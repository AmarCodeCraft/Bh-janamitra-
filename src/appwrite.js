import { Client, Account, Databases, Storage } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Configure the client
try {
  client.setEndpoint(APPWRITE_ENDPOINT).setProject(PROJECT_ID);

  // Add custom headers for better error handling
  client.headers = {
    ...client.headers,
    "X-Appwrite-Response-Format": "1.0.0",
    "Cache-Control": "no-cache",
  };

  console.log("Appwrite client initialized with project:", PROJECT_ID);
} catch (error) {
  console.error("Appwrite client initialization error:", error);
}

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";

// Health check with retry mechanism
export const checkAppwriteConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await client.call("get", "/health");
      console.log("Appwrite health check successful");
      return true;
    } catch (error) {
      console.error(`Appwrite health check attempt ${i + 1} failed:`, error);
      if (i === retries - 1) return false;
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  return false;
};

// Auth status check with retry mechanism
export const checkAuthStatus = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const session = await account.get();
      console.log("Auth check successful");
      return session;
    } catch (error) {
      console.error(`Auth check attempt ${i + 1} failed:`, error);
      if (i === retries - 1) return null;
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  return null;
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
