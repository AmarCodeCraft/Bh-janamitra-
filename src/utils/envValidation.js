export const validateEnvironment = () => {
  const required = [
    "VITE_APPWRITE_PROJECT_ID",
    "VITE_APPWRITE_DATABASE_ID",
    "VITE_APPWRITE_COLLECTION_ID",
    "VITE_APPWRITE_BUCKET_ID",
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return true;
};
