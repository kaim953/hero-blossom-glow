import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CircleNotch, Envelope, CheckCircle } from "@phosphor-icons/react";
import type { EmailOtpType } from "@supabase/supabase-js";

const emailSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
});

const MAGIC_LINK_COOLDOWN = 60; // seconds

const Auth = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(MAGIC_LINK_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  
  // Track if callback has been processed to prevent re-processing
  const callbackProcessed = useRef(false);

  const { signInWithMagicLink, signOut, refreshRoles, user, loading, isAdmin, isEditor, rolesLoading, rolesError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Process auth callback (magic link, invite, PKCE code)
  useEffect(() => {
    if (callbackProcessed.current) return;
    
    const processAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Check for various callback formats
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const code = queryParams.get('code');
      const tokenHash = queryParams.get('token_hash');
      const type = queryParams.get('type') as EmailOtpType | null;
      const errorDescription = queryParams.get('error_description') || hashParams.get('error_description');
      
      // Handle error from auth provider
      if (errorDescription) {
        callbackProcessed.current = true;
        window.history.replaceState(null, '', window.location.pathname);
        toast({
          title: "Login Failed",
          description: errorDescription,
          variant: "destructive",
        });
        return;
      }
      
      // No callback params present
      if (!accessToken && !code && !tokenHash) {
        return;
      }
      
      // Mark as processing and prevent re-entry
      callbackProcessed.current = true;
      setIsProcessingCallback(true);
      
      try {
        let result;
        
        if (code) {
          // PKCE flow
          result = await supabase.auth.exchangeCodeForSession(code);
        } else if (tokenHash && type) {
          // Magic link / invite / recovery via token_hash
          result = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        } else if (accessToken && refreshToken) {
          // Implicit flow (hash-based)
          result = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        } else if (accessToken) {
          // Partial token (shouldn't happen, but handle gracefully)
          throw new Error("Incomplete auth callback: missing refresh_token");
        }
        
        if (result?.error) {
          throw result.error;
        }
        
        // Success - clear URL params and stop processing
        window.history.replaceState(null, '', window.location.pathname);
        setIsProcessingCallback(false);
        
      } catch (error) {
        console.error("Auth callback error:", error);
        window.history.replaceState(null, '', window.location.pathname);
        setIsProcessingCallback(false);
        toast({
          title: "Login Failed",
          description: error instanceof Error ? error.message : "Unable to complete sign in. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    processAuthCallback();
  }, [toast]);

  // Redirect if already logged in with valid roles
  useEffect(() => {
    // Wait for auth loading AND callback processing to complete
    if (loading || isProcessingCallback) return;
    
    // If roles are still loading, wait
    if (rolesLoading) return;
    
    if (user) {
      // If there was a roles error, handle it with a toast and retry option
      if (rolesError) {
        toast({
          title: "Access Verification Failed",
          description: "Unable to verify your permissions. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (isAdmin || isEditor) {
        navigate("/admin/post");
      } else {
        // User exists but no roles after successful role fetch - sign out
        console.log("No roles assigned - signing out");
        signOut();
        toast({
          title: "Access Denied",
          description: "Your account does not have the required permissions.",
          variant: "destructive",
        });
      }
    }
  }, [user, loading, rolesLoading, rolesError, isAdmin, isEditor, navigate, signOut, isProcessingCallback, toast]);

  // Timeout for callback processing - prevents getting stuck indefinitely
  useEffect(() => {
    if (!isProcessingCallback) return;
    
    const timeout = setTimeout(() => {
      // If still processing after 10 seconds, something went wrong
      setIsProcessingCallback(false);
      toast({
        title: "Login Failed",
        description: "Unable to complete sign in. Please try again.",
        variant: "destructive",
      });
      // Clear the URL hash to prevent re-detection
      window.history.replaceState(null, '', window.location.pathname);
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [isProcessingCallback, toast]);

  // Countdown timer for resend button
  useEffect(() => {
    if (!emailSent) return;
    
    setResendCountdown(MAGIC_LINK_COOLDOWN);
    setCanResend(false);
    
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [emailSent]);

  const validateForm = () => {
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: { email?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check rate limiting via localStorage
      const lastSentKey = `magic_link_sent_${email}`;
      const lastSent = localStorage.getItem(lastSentKey);

      if (lastSent) {
        const timeSinceLastSent = Date.now() - parseInt(lastSent, 10);
        if (timeSinceLastSent < MAGIC_LINK_COOLDOWN * 1000) {
          toast({
            title: "Login Failed",
            description: "Unable to send login link. Please try again later.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // First, verify if email is registered
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-login-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.registered) {
        toast({
          title: "Access Denied",
          description: "Unregistered email. Access is restricted to registered members.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Email is registered, proceed with magic link
      const { error } = await signInWithMagicLink(email);
      if (error) {
        toast({
          title: "Login Failed",
          description: "Unable to send login link. Please try again later.",
          variant: "destructive",
        });
      } else {
        localStorage.setItem(lastSentKey, Date.now().toString());
        setEmailSent(true);
        toast({ title: "Login link sent!" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Verify if email is still registered before resending
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-login-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.registered) {
        toast({
          title: "Access Denied",
          description: "Unregistered email. Access is restricted to registered members.",
          variant: "destructive",
        });
        setIsResending(false);
        return;
      }

      const { error } = await signInWithMagicLink(email);
      if (error) {
        toast({
          title: "Login Failed",
          description: "Unable to send login link. Please try again later.",
          variant: "destructive",
        });
      } else {
        // Reset countdown and update localStorage timestamp
        localStorage.setItem(`magic_link_sent_${email}`, Date.now().toString());
        setResendCountdown(MAGIC_LINK_COOLDOWN);
        setCanResend(false);
        toast({ title: "Login link sent!" });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (loading || isProcessingCallback || (user && rolesLoading)) {
    return (
      <div className="min-h-screen bg-bg-01 flex items-center justify-center flex-col gap-4">
        <CircleNotch size={32} className="animate-spin text-neutral-08" />
        {isProcessingCallback && (
          <p className="text-neutral-10">Signing you in...</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-bg-01">
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 tablet:px-0 py-[160px]">
          <div className="bg-neutral-00 rounded-[16px] tablet:rounded-[20px] border border-neutral-02 py-6 px-5 w-full tablet:py-10 tablet:px-8 tablet:w-[500px]">
            {emailSent ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-neutral-02 rounded-[100px] flex items-center justify-center">
                    <CheckCircle size={16} className="text-neutral-10" />
                  </div>
                  <h4 className="text-h4 text-neutral-12">Check your email</h4>
                </div>
                <p className="text-body text-neutral-10 mb-[80px]">
                  We sent a magic link to <strong>{email}</strong>. Click the link to sign in. The link will expire in 1 hour.
                </p>
                <div className="flex flex-col items-start gap-4">
                  <OutlineButton onClick={handleResend} disabled={isResending || !canResend}>
                    {isResending ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : !canResend ? (
                      `Resend link (${resendCountdown}s)`
                    ) : (
                      "Resend link"
                    )}
                  </OutlineButton>
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-body text-neutral-10"
                  >
                    Use a different email
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-neutral-02 rounded-[100px] flex items-center justify-center">
                    <Envelope size={16} className="text-neutral-10" />
                  </div>
                  <h4 className="text-h4 text-neutral-12">Admin Login</h4>
                </div>
                  <p className="text-body text-neutral-10 mb-[80px]">
                    Enter your email to receive a secure magic link. Access is restricted to registered members.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6">
                    <div className="flex flex-col gap-2 w-full">
                      <Label htmlFor="email" className="text-neutral-12">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@email.com"
                        className={errors.email ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <span className="text-sm text-red-500">{errors.email}</span>
                      )}
                    </div>

                  <FilledButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      "Send login link"
                    )}
                  </FilledButton>
                </form>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Auth;
