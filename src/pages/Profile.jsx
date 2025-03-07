import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { getUserFoodImages, deleteFoodImage } from "../utils/foodImages";
import React from "react";

const Profile = () => {
  const [userImages, setUserImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const dataFetchedRef = React.useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current || !user) return;
    dataFetchedRef.current = true;

    const fetchUserImages = async () => {
      try {
        setLoading(true);
        const images = await getUserFoodImages(user.$id);
        setUserImages(Array.isArray(images) ? images : []);
      } catch (error) {
        console.error("Error fetching user images:", error);
        setUserImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserImages();
  }, [user]);

  const handleDeleteImage = async (id, imageId) => {
    try {
      console.log(
        `Attempting to delete image with ID: ${id} and imageId: ${imageId}`
      );

      // First check if the image exists before trying to delete it
      if (!imageId) {
        console.warn("No imageId provided, only removing from database");
        // If no imageId, just update the UI
        setUserImages((prevImages) =>
          prevImages.filter((image) => image.$id !== id)
        );
        return;
      }

      // Try to delete the image, but handle the case where the file doesn't exist
      try {
        await deleteFoodImage(id, imageId);
      } catch (error) {
        console.warn("Error deleting file from storage:", error);
        // If the file doesn't exist in storage, we should still remove it from the database
        // This would be handled by your deleteFoodImage function
      }

      // Update UI regardless of whether file deletion succeeded
      setUserImages((prevImages) =>
        prevImages.filter((image) => image.$id !== id)
      );
    } catch (error) {
      console.error("Error in delete process:", error);
      alert("Failed to delete the image. Please try again.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Please sign in to view your profile
        </h2>
        <Link
          to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 inline-block"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {user.name || "Food Enthusiast"}
            </h1>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className="text-gray-500 mb-4">
              Member since {new Date(user.$createdAt).toLocaleDateString()}
            </p>
            <Link
              to="/settings"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Dishes</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {userImages.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {userImages.map((image) => (
                <motion.div
                  key={image.$id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="relative group">
                    <div className="h-64 overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.caption || "Food dish"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src =
                            "/src/assets/images/placeholder-food.jpg";
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <Link
                        to={`/dish/${image.$id}`}
                        className="text-white font-medium hover:underline mb-2"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() =>
                          handleDeleteImage(image.$id, image.imageId)
                        }
                        className="text-red-300 hover:text-red-100 font-medium flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">
                      {image.caption}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        {new Date(image.$createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {image.likes || 0}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No dishes yet
              </h3>
              <p className="text-gray-600 mb-6">
                Share your culinary creations with the world!
              </p>
              <Link
                to="/upload"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Upload Your First Dish
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
