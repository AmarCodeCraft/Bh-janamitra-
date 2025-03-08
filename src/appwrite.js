import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client();

// Configure the client with proper error handling
try {
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
    .setSelfSigned(true); // Enable this for development

  // Add these headers for better error handling and CORS
  client.headers = {
    ...client.headers,
    "X-Appwrite-Response-Format": "1.0.0",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  };

  console.log(
    "Appwrite client configured with project:",
    import.meta.env.VITE_APPWRITE_PROJECT_ID
  );
} catch (error) {
  console.error("Error configuring Appwrite client:", error);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";

// Add health check function
export const checkAppwriteConnection = async () => {
  try {
    const healthCheck = await fetch("https://cloud.appwrite.io/v1/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": import.meta.env.VITE_APPWRITE_PROJECT_ID,
      },
    });

    if (!healthCheck.ok) {
      throw new Error("Health check failed");
    }

    return true;
  } catch (error) {
    console.error("Appwrite connection check failed:", error);
    return false;
  }
};

// Add the missing checkAuthStatus function
export const checkAuthStatus = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
};
