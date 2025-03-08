import { Client, Account, Databases, Storage } from "appwrite";

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.account = null;
    this.databases = null;
    this.storage = null;
    this.init();
  }

  init() {
    try {
      this.client
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

      // Initialize services
      this.account = new Account(this.client);
      this.databases = new Databases(this.client);
      this.storage = new Storage(this.client);

      console.log("Appwrite service initialized");
    } catch (error) {
      console.error("Appwrite initialization failed:", error);
    }
  }

  async createAccount(email, password, name) {
    try {
      const response = await this.account.create(
        "unique()",
        email,
        password,
        name
      );
      return response;
    } catch (error) {
      console.error("Account creation failed:", error);
      throw error;
    }
  }

  async createSession(email, password) {
    try {
      return await this.account.createEmailSession(email, password);
    } catch (error) {
      console.error("Session creation failed:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.error("Get current user failed:", error);
      return null;
    }
  }

  async listDocuments(databaseId, collectionId, queries = [], limit = 10) {
    try {
      return await this.databases.listDocuments(
        databaseId,
        collectionId,
        queries,
        limit
      );
    } catch (error) {
      console.error("List documents failed:", error);
      throw error;
    }
  }

  async uploadFile(file, bucketId) {
    try {
      return await this.storage.createFile(bucketId, "unique()", file);
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;

// Export individual services for convenience
export const account = appwriteService.account;
export const databases = appwriteService.databases;
export const storage = appwriteService.storage;
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
