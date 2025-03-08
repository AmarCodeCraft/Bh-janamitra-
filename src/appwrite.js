import { Client, Account, Databases, Storage } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

// Get environment variables
const ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Configure the client
try {
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

  // Set up headers for CORS and better error handling
  client.headers = {
    ...client.headers,
    "X-Appwrite-Response-Format": "1.0.0",
    "X-Appwrite-Project": PROJECT_ID,
    "Content-Type": "application/json",
  };

  console.log("Appwrite client initialized successfully");
} catch (error) {
  console.error("Appwrite client initialization error:", error);
}

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";

// Improved connection check with detailed error logging
export const checkAppwriteConnection = async () => {
  try {
    // Try to get the current session as a connection test
    await account.getSession("current");
    console.log("Appwrite connection successful");
    return true;
  } catch (error) {
    if (error.code === 401) {
      // 401 means the server is reachable but we're not authenticated
      console.log("Appwrite connection successful (not authenticated)");
      return true;
    }
    console.error("Appwrite connection failed:", error);
    return false;
  }
};

// Improved auth status check
export const checkAuthStatus = async () => {
  try {
    const session = await account.get();
    console.log("Auth check successful:", session);
    return session;
  } catch (error) {
    if (error.code === 401) {
      console.log("User not authenticated");
      return null;
    }
    console.error("Auth check error:", error);
    return null;
  }
};

// Custom error handler for Appwrite operations
export const handleAppwriteError = (error) => {
  if (error.code) {
    switch (error.code) {
      case 401:
        return "Authentication failed. Please log in again.";
      case 403:
        return "Permission denied. Please check your access rights.";
      case 404:
        return "Resource not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return `Error: ${error.message || "Unknown error occurred"}`;
    }
  }
  return "Network error. Please check your connection.";
};

// Test connection on module load
(async () => {
  try {
    const isConnected = await checkAppwriteConnection();
    if (!isConnected) {
      console.error("Failed to establish initial connection to Appwrite");
    }
  } catch (error) {
    console.error("Initial connection test failed:", error);
  }
})();
