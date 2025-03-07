import { useState } from 'react';
import { 
  uploadFoodImage, 
  getAllFoodImages, 
  getUserFoodImages, 
  getFoodImageById,
  deleteFoodImage,
  likeFoodImage,
  addComment
} from '../utils/foodImages';

const useFoodImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Upload a new food image
  const handleUploadImage = async (file, userId, caption, tags) => {
    try {
      setLoading(true);
      setError(null);
      const result = await uploadFoodImage(file, userId, caption, tags);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
  const handleAddComment = async (id, userId, userName, comment, currentComments) => {
    try {
      setLoading(true);
      setError(null);
      const result = await addComment(id, userId, userName, comment, currentComments);
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
    uploadImage: handleUploadImage,
    getAllImages: handleGetAllImages,
    getUserImages: handleGetUserImages,
    getImageById: handleGetImageById,
    deleteImage: handleDeleteImage,
    likeImage: handleLikeImage,
    addComment: handleAddComment
  };
};

export default useFoodImages;
