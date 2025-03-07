import { Client, Account, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Make sure this is correct
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Add CORS settings
client.headers["X-Appwrite-Response-Format"] = "1.0.0";

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID } from "appwrite";
