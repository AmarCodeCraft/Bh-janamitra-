import { createContext, useState, useContext, useEffect } from "react";
import { appwriteService } from "../appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await appwriteService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email, password) => {
    await appwriteService.login(email, password);
    await checkUser();
  };

  const signup = async (email, password, name) => {
    await appwriteService.createAccount(email, password, name);
    await login(email, password);
  };

  const logout = async () => {
    try {
      await appwriteService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
