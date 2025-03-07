export const API_CONFIG = {
  endpoint: "https://cloud.appwrite.io/v1",
  project: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  database: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collection: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  bucket: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};

export const validateConfig = () => {
  const requiredVars = [
    "VITE_APPWRITE_PROJECT_ID",
    "VITE_APPWRITE_DATABASE_ID",
    "VITE_APPWRITE_COLLECTION_ID",
    "VITE_APPWRITE_BUCKET_ID",
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return true;
};
