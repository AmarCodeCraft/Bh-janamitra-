import { useState } from 'react';
import { 
  uploadFoodImage, 
  getAllFoodImages, 
  getUserFoodImages, 
  getFoodImageById,
  deleteFoodImage,
  likeFoodImage,
  addComment
} from '../utils/foodImages.jsx';

const useFoodImages = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (err) => {
    const message = err?.message || 'An unknown error occurred';
    setError(message);
    return message;
  };

  const handleUploadImage = async (file, userId, caption, tags) => {
    setLoading(true);
    setError(null);
    try {
      return await uploadFoodImage(file, userId, caption, tags);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllImages = async (limit) => {
    setLoading(true);
    setError(null);
    try {
      return await getAllFoodImages(limit);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserImages = async (userId, limit) => {
    setLoading(true);
    setError(null);
    try {
      return await getUserFoodImages(userId, limit);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGetImageById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await getFoodImageById(id);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (userId, imageId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFoodImage(userId, imageId);
      return { success: true };
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLikeImage = async (imageId, currentLikes) => {
    setLoading(true);
    setError(null);
    try {
      return await likeFoodImage(imageId, currentLikes);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (imageId, userId, userName, comment, currentComments) => {
    setLoading(true);
    setError(null);
    try {
      return await addComment(imageId, userId, userName, comment, currentComments);
    } catch (err) {
      handleError(err);
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
    addComment: handleAddComment,
  };
};

export default useFoodImages;
