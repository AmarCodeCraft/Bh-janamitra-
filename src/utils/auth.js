import { account } from '../config/appwrite';
import { ID } from 'appwrite';

// Function to sign up a new user
export const signUp = async (email, password, name) => {
  try {
    const response = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    
    if (response.$id) {
      // Sign in the user after successful sign up
      return await signIn(email, password);
    }
    
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Function to sign in a user
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    
    return {
      session,
      user
    };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Function to sign out a user
export const signOut = async () => {
  try {
    return await account.deleteSession();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Function to check if a user is authenticated
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Function to check if user is logged in
export const isLoggedIn = async () => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch {
    return false;
  }
};
