export const API_ENDPOINTS = {
  base: "https://cloud.appwrite.io/v1",
  health: "/health",
  account: "/account",
  database: (databaseId) => `/databases/${databaseId}`,
  collection: (databaseId, collectionId) =>
    `/databases/${databaseId}/collections/${collectionId}`,
  storage: (bucketId) => `/storage/buckets/${bucketId}`,
};

export const getHeaders = (projectId) => ({
  "X-Appwrite-Project": projectId,
  "X-Appwrite-Response-Format": "1.0.0",
  "Content-Type": "application/json",
});
