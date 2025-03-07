import { useState, useEffect, createContext, useContext } from "react";
import { account, ID } from "../appwrite";

// Create an authentication context
const AuthContext = createContext();

// Provider component that wraps the app and makes auth object available to any child component that calls useAuth()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const session = await account.get();
      setUser(session);
      setIsAuthenticated(true);
      console.log("Auth check successful:", session);
    } catch (error) {
      console.log("Not authenticated:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      console.log("Starting signup process...");

      // Create account
      const response = await account.create(ID.unique(), email, password, name);
      console.log("Account created:", response);

      // Create session (login)
      await account.createEmailSession(email, password);
      console.log("Session created");

      // Get account details
      const user = await account.get();
      console.log("User details fetched:", user);

      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await account.createEmailSession(email, password);
      const user = await account.get();
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signUp,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for components to get the auth object and re-render when it changes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
