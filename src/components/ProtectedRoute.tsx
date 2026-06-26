import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { CircleNotch, Warning, ArrowClockwise, SignOut } from "@phosphor-icons/react";
import FilledButton from "@/components/FilledButton";
import OutlineButton from "@/components/OutlineButton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireEditor = false,
}: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isEditor, rolesLoading, rolesError, refreshRoles, signOut } = useAuth();
  const location = useLocation();

  // Session restoration in progress
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-01 flex items-center justify-center">
        <CircleNotch size={32} className="animate-spin text-neutral-08" />
      </div>
    );
  }

  // No user - redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Roles are being fetched
  if (rolesLoading) {
    return (
      <div className="min-h-screen bg-neutral-01 flex items-center justify-center flex-col gap-4">
        <CircleNotch size={32} className="animate-spin text-neutral-08" />
        <p className="text-body text-neutral-10">Verifying access...</p>
      </div>
    );
  }

  // Roles fetch failed - show recovery UI
  if (rolesError) {
    const handleRetry = async () => {
      await refreshRoles();
    };

    const handleSignOut = async () => {
      await signOut();
    };

    return (
      <div className="min-h-screen bg-neutral-01 flex items-center justify-center px-4">
        <div className="bg-neutral-00 rounded-[16px] border border-neutral-02 py-8 px-6 max-w-md w-full text-center">
          <div className="w-12 h-12 bg-neutral-02 rounded-full flex items-center justify-center mx-auto mb-4">
            <Warning size={24} className="text-neutral-10" />
          </div>
          <h2 className="text-h4 text-neutral-12 mb-2">Unable to verify access</h2>
          <p className="text-body text-neutral-10 mb-6">
            {rolesError}
          </p>
          <div className="flex flex-col gap-3">
            <FilledButton onClick={handleRetry} className="w-full justify-center">
              <ArrowClockwise size={16} className="mr-2" />
              Retry
            </FilledButton>
            <OutlineButton onClick={handleSignOut} className="w-full justify-center">
              <SignOut size={16} className="mr-2" />
              Sign out
            </OutlineButton>
          </div>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-01 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-h4 text-neutral-12 mb-2">Access Denied</h2>
          <p className="text-body text-neutral-10">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (requireEditor && !isEditor && !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-01 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-h4 text-neutral-12 mb-2">Access Denied</h2>
          <p className="text-body text-neutral-10">
            You need editor privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
