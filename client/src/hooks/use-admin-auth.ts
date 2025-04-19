import { useState, useEffect } from "react";

// Define a user type
interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}

interface UseAdminAuth {
  user: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Admin credentials (per requirements: chris@2005 for both username and password)
const ADMIN_EMAIL = "chris@2005";
const ADMIN_PASSWORD = "chris@2005";

export function useAdminAuth(): UseAdminAuth {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for stored authentication on load
  useEffect(() => {
    const storedAuth = localStorage.getItem("portfolioAdminAuth");
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth && parsedAuth.isAuthenticated) {
          setUser({
            email: parsedAuth.email,
            isAuthenticated: true
          });
          setIsAdmin(true);
        }
      } catch (err) {
        // Invalid stored data, clear it
        localStorage.removeItem("portfolioAdminAuth");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // Simple validation against hardcoded credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          email: email,
          isAuthenticated: true
        };
        
        // Store authentication in localStorage
        localStorage.setItem("portfolioAdminAuth", JSON.stringify(adminUser));
        
        setUser(adminUser);
        setIsAdmin(true);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid login credentials");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setError(null);
    
    try {
      // Clear stored authentication
      localStorage.removeItem("portfolioAdminAuth");
      
      // Reset state
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      setError("Error logging out");
      throw err;
    }
  };

  return { user, isAdmin, isLoading, error, login, logout };
}
