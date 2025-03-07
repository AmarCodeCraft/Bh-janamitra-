import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

// Configure the client
try {
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  // Add these headers for better error handling and CORS
  client.headers = {
    ...client.headers,
    "X-Appwrite-Response-Format": "1.0.0",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  };

  console.log("Appwrite client configured with project:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
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
    const response = await fetch('https://cloud.appwrite.io/v1/health/general', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    return true;
  } catch (error) {
    console.error('Appwrite connection check failed:', error);
    return false;
  }
};
