import { databases, storage, appwriteConfig } from "../config/appwrite";
import { ID, Query } from "appwrite";

// Function to upload a food image
export const uploadFoodImage = async (file, userId, caption, tags = []) => {
  try {
    // First, upload the image to storage
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageBucketId,
      ID.unique(),
      file
    );

    // Create a preview URL for the uploaded image
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageBucketId,
      uploadedFile.$id,
      2000, // width
      2000, // height
      "center", // gravity
      100 // quality
    );

    // Then, create a database entry for the food image
    const foodPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      ID.unique(),
      {
        userId,
        imageId: uploadedFile.$id,
        imageUrl: fileUrl,
        caption,
        tags: tags.join(","), // Ensure tags are a single string
        likes: "0", // Store likes as a string to match Appwrite's expectations
        comments: JSON.stringify([]), // Store empty array as JSON string
      }
    );

    return foodPost;
  } catch (error) {
    console.error("Error uploading food image:", error);
    throw error;
  }
};

// Function to get all food images
export const getAllFoodImages = async (limit = 10) => {
  try {
    console.log("Getting food images with limit:", limit);
    console.log("Database ID:", appwriteConfig.databaseId);
    console.log("Collection ID:", appwriteConfig.foodCollectionId);

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(limit)]
    );

    console.log("Raw response from Appwrite:", response);
    console.log("Documents from Appwrite:", response.documents);

    // Process tags from string to array
    const documents = response.documents.map((doc) => {
      if (doc.tags && typeof doc.tags === "string") {
        doc.tags = doc.tags.split(",").filter((tag) => tag.trim() !== "");
      } else {
        doc.tags = [];
      }
      return doc;
    });

    console.log("Processed documents:", documents);

    return documents;
  } catch (error) {
    console.error("Error getting food images:", error);
    console.error("Error details:", error.message, error.stack);
    throw error;
  }
};

// Function to get food images by user ID
export const getUserFoodImages = async (userId, limit = 10) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    );

    // Process tags from string to array
    const documents = response.documents.map((doc) => {
      if (doc.tags && typeof doc.tags === "string") {
        doc.tags = doc.tags.split(",").filter((tag) => tag.trim() !== "");
      } else {
        doc.tags = [];
      }
      return doc;
    });

    return documents;
  } catch (error) {
    console.error("Error getting user food images:", error);
    throw error;
  }
};

// Function to get a single food image by ID
export const getFoodImageById = async (id) => {
  try {
    const response = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      id
    );

    // Process tags from string to array
    if (response.tags && typeof response.tags === "string") {
      response.tags = response.tags
        .split(",")
        .filter((tag) => tag.trim() !== "");
    } else {
      response.tags = [];
    }

    return response;
  } catch (error) {
    console.error("Error getting food image:", error);
    throw error;
  }
};

// Function to delete a food image
export const deleteFoodImage = async (id, imageId) => {
  try {
    // Delete the image from storage
    await storage.deleteFile(appwriteConfig.storageBucketId, imageId);

    // Delete the database entry
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      id
    );

    return { success: true };
  } catch (error) {
    console.error("Error deleting food image:", error);
    throw error;
  }
};

// Function to like a food image
export const likeFoodImage = async (id, currentLikes) => {
  try {
    // Convert currentLikes to a number if it's a string, add 1, then convert back to string
    const newLikes = (parseInt(currentLikes) + 1).toString();

    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      id,
      {
        likes: newLikes,
      }
    );

    return response;
  } catch (error) {
    console.error("Error liking food image:", error);
    throw error;
  }
};

// Function to add a comment to a food image
export const addComment = async (
  id,
  userId,
  userName,
  comment,
  currentComments = "[]"
) => {
  try {
    const parsedComments = JSON.parse(currentComments);
    const newComment = {
      id: ID.unique(),
      userId,
      userName,
      comment,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...parsedComments, newComment];
    const commentsString = JSON.stringify(updatedComments);

    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      id,
      {
        comments: commentsString,
      }
    );

    return response;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Function to update likes for a food image
export const updateLikes = async (id, likes) => {
  try {
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foodCollectionId,
      id,
      { likes }
    );

    return response;
  } catch (error) {
    console.error("Error updating likes:", error);
    throw error;
  }
};
