import { Client, Account, Databases, Storage } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

// Get environment variables with fallbacks
const ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

if (!PROJECT_ID) {
  console.error("Project ID is not defined in environment variables");
}

// Configure the client
try {
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setSelfSigned(true); // Enable this for development

  // Add these headers for better error handling and CORS
  client.headers = {
    "X-Appwrite-Project": PROJECT_ID,
    "X-Appwrite-Response-Format": "1.0.0",
    "Content-Type": "application/json",
  };

  console.log("Appwrite client initialized with:", {
    endpoint: ENDPOINT,
    projectId: PROJECT_ID,
    databaseId: DATABASE_ID,
    collectionId: COLLECTION_ID,
  });
} catch (error) {
  console.error("Appwrite client initialization error:", error);
}

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";

// Improved connection check with retries
export const checkAppwriteConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Try to get the current account as a connection test
      await account.get();
      console.log("Appwrite connection successful");
      return true;
    } catch (error) {
      if (error.code === 401) {
        // 401 means server is reachable but we're not authenticated
        console.log("Appwrite connection successful (not authenticated)");
        return true;
      }
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        return false;
      }
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  return false;
};

// Improved auth check with retries
export const checkAuthStatus = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const session = await account.get();
      console.log("Auth check successful");
      return session;
    } catch (error) {
      if (error.code === 401) {
        console.log("User not authenticated");
        return null;
      }
      console.error(`Auth check attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        return null;
      }
      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
  return null;
};

// Helper function to get food images
export const getFoodImages = async (limit = 10) => {
  try {
    console.log("Getting food images with limit:", limit);
    console.log("Database ID:", DATABASE_ID);
    console.log("Collection ID:", COLLECTION_ID);

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        // Add any queries or filters here
      ],
      limit
    );

    return response.documents;
  } catch (error) {
    console.error("Error getting food images:", error);
    throw error;
  }
};

// Initialize connection check
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
