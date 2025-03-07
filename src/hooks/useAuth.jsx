import { useState, useEffect, createContext, useContext } from "react";
import { getCurrentUser, signIn, signUp, signOut } from "../utils/auth";
import { account, ID } from "../appwrite";

// Create an authentication context
const AuthContext = createContext();

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if there is a current user session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const session = await account.get();
        setUser(session);
        setIsAuthenticated(true);
        console.log("Auth check successful:", session); // Debug log
      } catch (error) {
        console.log("Not authenticated:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign up function
  const handleSignUp = async (email, password, name) => {
    let retries = 3;

    while (retries > 0) {
      try {
        const response = await account.create(
          ID.unique(),
          email,
          password,
          name
        );

        // Create session after successful signup
        await account.createEmailSession(email, password);

        setUser(response);
        setIsAuthenticated(true);
        return response;
      } catch (error) {
        console.error(
          `Signup attempt failed. Retries left: ${retries - 1}`,
          error
        );
        retries--;

        if (retries === 0) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  // Sign in function
  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await signIn(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for components to get the auth object and re-render when it changes

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
