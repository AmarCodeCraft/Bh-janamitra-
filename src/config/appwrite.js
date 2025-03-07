import { Client, Account, Databases, Storage } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Your Appwrite endpoint and project ID
// You'll need to replace these with your actual Appwrite details
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '67cab350000e6e7db6d4'; // Replace with your project ID

// Database and collection IDs
// Replace these with your actual database and collection IDs
const DATABASE_ID = '67cab39a001fd7884030';
const FOOD_COLLECTION_ID = '67cab3fb003c5bd237e3';
const USER_COLLECTION_ID = '67cab4180038d722eb56';

// Storage bucket ID
// Replace with your actual storage bucket ID
// image name of bucket id
const STORAGE_BUCKET_ID = '67cab43d00074b3ff611';

// Configure the client
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export configuration constants
export const appwriteConfig = {
  databaseId: DATABASE_ID,
  foodCollectionId: FOOD_COLLECTION_ID,
  userCollectionId: USER_COLLECTION_ID,
  storageBucketId: STORAGE_BUCKET_ID,
};

export default client;
