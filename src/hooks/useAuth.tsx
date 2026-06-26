import { createContext, useContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const ROLE_FETCH_TIMEOUT_MS = 10000; // 10 seconds

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  rolesLoading: boolean;
  rolesError: string | null;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to add timeout to any promise
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  // Track if bootstrap has been attempted this session
  const hasBootstrapped = useRef(false);
  // Track the current user ID to detect user changes
  const currentUserId = useRef<string | null>(null);
  // Sequence counter to ensure only latest role request updates state
  const rolesRequestSeq = useRef(0);

  // Core role fetching logic (no loading state management here)
  const fetchUserRoles = useCallback(async (userId: string): Promise<{ isAdmin: boolean; isEditor: boolean }> => {
    // Fetch roles using SECURITY DEFINER function
    const roleResult = await withTimeout(
      Promise.resolve(supabase.rpc('get_user_roles', { _user_id: userId })),
      ROLE_FETCH_TIMEOUT_MS,
      'Role fetch'
    );

    if (roleResult.error) {
      console.error("Error fetching user roles:", roleResult.error);
      throw roleResult.error;
    }

    let roles = roleResult.data?.map((r) => r.role) || [];

    // If no roles found, attempt bootstrap (first admin scenario)
    if (roles.length === 0 && !hasBootstrapped.current) {
      hasBootstrapped.current = true;
      console.log("No roles found, attempting bootstrap...");

      const bootstrapResult = await withTimeout(
        Promise.resolve(supabase.rpc('bootstrap_first_admin', { _user_id: userId })),
        ROLE_FETCH_TIMEOUT_MS,
        'Bootstrap'
      );

      if (bootstrapResult.error) {
        console.error("Bootstrap error:", bootstrapResult.error);
      } else {
        console.log("Bootstrap result:", bootstrapResult.data);

        if (bootstrapResult.data === 'bootstrapped_as_admin') {
          // Re-fetch roles after bootstrap
          const refreshResult = await withTimeout(
            Promise.resolve(supabase.rpc('get_user_roles', { _user_id: userId })),
            ROLE_FETCH_TIMEOUT_MS,
            'Role re-fetch after bootstrap'
          );
          
          if (refreshResult.error) {
            console.error("Error re-fetching roles after bootstrap:", refreshResult.error);
            throw refreshResult.error;
          }
          
          roles = refreshResult.data?.map((r) => r.role) || [];
        }
      }
    }

    return {
      isAdmin: roles.includes("admin"),
      isEditor: roles.includes("editor"),
    };
  }, []);

  // Safe role checking with timeout and sequence guard
  const safeCheckRoles = useCallback(async (userId: string) => {
    // Increment sequence and capture current value
    rolesRequestSeq.current += 1;
    const thisRequestSeq = rolesRequestSeq.current;

    setRolesLoading(true);
    setRolesError(null);

    try {
      const { isAdmin: admin, isEditor: editor } = await fetchUserRoles(userId);

      // Only apply if this is still the latest request
      if (thisRequestSeq === rolesRequestSeq.current) {
        setIsAdmin(admin);
        setIsEditor(editor);
        setRolesError(null);
      }
    } catch (error) {
      console.error("Error checking roles:", error);
      
      // Only apply error if this is still the latest request
      if (thisRequestSeq === rolesRequestSeq.current) {
        setIsAdmin(false);
        setIsEditor(false);
        setRolesError(
          error instanceof Error && error.message.includes('timed out')
            ? "Unable to verify your access. Please check your connection and retry."
            : "Unable to verify your access right now. Please retry."
        );
      }
    } finally {
      // Only update loading if this is still the latest request
      if (thisRequestSeq === rolesRequestSeq.current) {
        setRolesLoading(false);
      }
    }
  }, [fetchUserRoles]);

  // Public method to retry role fetching
  const refreshRoles = useCallback(async () => {
    if (user) {
      await safeCheckRoles(user.id);
    }
  }, [user, safeCheckRoles]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, newSession) => {
      if (!mounted) return;

      // Ignore INITIAL_SESSION - we handle initial state via getSession()
      if (event === 'INITIAL_SESSION') {
        return;
      }

      const newUserId = newSession?.user?.id ?? null;
      const userChanged = newUserId !== currentUserId.current;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        if (userChanged) {
          currentUserId.current = newUserId;
          hasBootstrapped.current = false;
          // Fire and forget - don't await to avoid blocking
          void safeCheckRoles(newSession.user.id);
        }
      } else {
        // User signed out
        currentUserId.current = null;
        setIsAdmin(false);
        setIsEditor(false);
        setRolesLoading(false);
        setRolesError(null);
        hasBootstrapped.current = false;
      }
    });

    // THEN check for existing session
    const initSession = async () => {
      try {
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setSession(null);
            setUser(null);
          }
          return;
        }

        if (!mounted) return;

        setSession(existingSession);
        setUser(existingSession?.user ?? null);

        if (existingSession?.user) {
          currentUserId.current = existingSession.user.id;
          // Don't await - let loading finish immediately, roles load separately
          void safeCheckRoles(existingSession.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        // Always set loading false - session restoration is complete
        // Role loading is tracked separately by rolesLoading
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [safeCheckRoles]);

  const signInWithMagicLink = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: false,
      },
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsEditor(false);
    setRolesLoading(false);
    setRolesError(null);
    hasBootstrapped.current = false;
    currentUserId.current = null;
    rolesRequestSeq.current = 0;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        rolesLoading,
        rolesError,
        signInWithMagicLink,
        signOut,
        refreshRoles,
        isAdmin,
        isEditor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
