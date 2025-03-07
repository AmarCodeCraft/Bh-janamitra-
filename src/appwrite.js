import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

// Configure the client
try {
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  // Add headers for better error handling
  client.headers = {
    ...client.headers,
    "X-Appwrite-Response-Format": "1.0.0",
    "Cache-Control": "no-cache",
  };

  console.log("Appwrite client configured successfully");
} catch (error) {
  console.error("Error configuring Appwrite client:", error);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";

// Helper function to check connection
export const checkAppwriteConnection = async () => {
  try {
    await account.get();
    return true;
  } catch (error) {
    console.error("Appwrite connection check failed:", error);
    return false;
  }
};
