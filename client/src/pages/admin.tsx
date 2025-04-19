import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import AdminLogin from "@/components/admin/login";
import Dashboard from "@/components/admin/dashboard";
import { Loader2 } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Show login page if not loading and no user
    if (!isLoading && !user) {
      setShowLogin(true);
    } else if (user) {
      setShowLogin(false);
    }
  }, [user, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show login if no user
  if (showLogin) {
    return <AdminLogin />;
  }

  // If user exists but is not admin
  if (user && !isAdmin) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mb-4 bg-destructive/10 p-3 rounded-full inline-flex">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-destructive" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            Your account doesn't have admin privileges. Please contact the site administrator.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Show dashboard if user exists and is admin
  return <Dashboard />;
};

export default Admin;
