import { useState, useCallback } from "react";
import {
  getAllFoodImages,
  getUserFoodImages,
  getFoodImageById,
  deleteFoodImage,
  likeFoodImage,
  addComment,
} from "../utils/foodImages.jsx";
import { storage, databases, ID } from "../appwrite";

const useFoodImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Upload a new food image
  const uploadImage = useCallback(async (file, userId, caption, tags) => {
    try {
      if (!file || !userId) {
        throw new Error("File and user ID are required");
      }

      console.log("Starting upload process...", { userId, caption, tags });

      // 1. First upload the file to storage
      const storageResponse = await storage.createFile(
        import.meta.env.VITE_APPWRITE_BUCKET_ID,
        ID.unique(),
        file
      );

      if (!storageResponse || !storageResponse.$id) {
        throw new Error("Failed to upload image to storage");
      }

      console.log("File uploaded to storage:", storageResponse);

      // 2. Create the database record
      const databaseResponse = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          userId: userId,
          imageId: storageResponse.$id,
          caption: caption || "",
          tags: tags || [],
          likes: 0,
        }
      );

      console.log("Database record created:", databaseResponse);

      return databaseResponse;
    } catch (error) {
      console.error("Upload error:", error);

      // If storage upload succeeded but database failed, cleanup the uploaded file
      if (error.storageFileId) {
        try {
          await storage.deleteFile(
            import.meta.env.VITE_APPWRITE_BUCKET_ID,
            error.storageFileId
          );
        } catch (cleanupError) {
          console.error("Failed to cleanup storage file:", cleanupError);
        }
      }

      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }, []);

  // Get all food images
  const handleGetAllImages = async (limit) => {
    try {
      setLoading(true);
      setError(null);
      const images = await getAllFoodImages(limit);
      return images;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get food images by user ID
  const handleGetUserImages = async (userId, limit) => {
    try {
      setLoading(true);
      setError(null);
      const images = await getUserFoodImages(userId, limit);
      return images;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get a single food image by ID
  const handleGetImageById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const image = await getFoodImageById(id);
      return image;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a food image
  const handleDeleteImage = async (id, imageId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteFoodImage(id, imageId);
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Like a food image
  const handleLikeImage = async (id, currentLikes) => {
    try {
      setLoading(true);
      setError(null);
      const result = await likeFoodImage(id, currentLikes);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a comment to a food image
  const handleAddComment = async (
    id,
    userId,
    userName,
    comment,
    currentComments
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await addComment(
        id,
        userId,
        userName,
        comment,
        currentComments
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    uploadImage,
    getAllImages: handleGetAllImages,
    getUserImages: handleGetUserImages,
    getImageById: handleGetImageById,
    deleteImage: handleDeleteImage,
    likeImage: handleLikeImage,
    addComment: handleAddComment,
  };
};

export default useFoodImages;
