import { useState, useEffect } from "react";
import appwriteService from "../appwrite";

export const useAppwrite = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await appwriteService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await appwriteService.createSession(email, password);
      await checkAuth();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const signup = async (email, password, name) => {
    try {
      await appwriteService.createAccount(email, password, name);
      await login(email, password);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await appwriteService.account.deleteSession("current");
      setUser(null);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
  };
};
