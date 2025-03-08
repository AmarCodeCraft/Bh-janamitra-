import appwriteService from "../appwrite";

export const getFoodImages = async (limit = 10) => {
  try {
    const response = await appwriteService.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      [],
      limit
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching food images:", error);
    throw error;
  }
};

export const uploadImage = async (file, userId, caption, tags) => {
  try {
    const fileUpload = await appwriteService.uploadFile(
      file,
      import.meta.env.VITE_APPWRITE_BUCKET_ID
    );

    const document = await appwriteService.databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COLLECTION_ID,
      "unique()",
      {
        userId,
        imageId: fileUpload.$id,
        caption,
        tags,
        likes: 0,
      }
    );

    return document;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
