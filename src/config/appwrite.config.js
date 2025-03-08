const config = {
  endpoint:
    import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  project: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  database: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  collection: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  bucket: import.meta.env.VITE_APPWRITE_BUCKET_ID,
};

export default config;
