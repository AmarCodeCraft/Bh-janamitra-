import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Make sure this is correct
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Add these headers for CORS and better error handling
client.headers["X-Appwrite-Response-Format"] = "1.0.0";
client.headers["Cache-Control"] = "no-cache";

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";

// Add helper function to check auth status
export const checkAuthStatus = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
};
