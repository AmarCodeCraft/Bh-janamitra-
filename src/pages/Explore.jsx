import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { getAllFoodImages } from "../utils/foodImages"; // Import the utility function directly
import React from "react";
import { likeFoodImage } from "../utils/foodImages"; // Make sure to import this function

// Add a base64 encoded small placeholder image that will always work
const fallbackImageBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const Explore = () => {
  const [foodImages, setFoodImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);

  // Use a ref to track if we've already loaded data
  const dataFetchedRef = React.useRef(false);

  useEffect(() => {
    // Only fetch data if we haven't already
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true; // Set to true immediately to prevent multiple calls

    const fetchImages = async () => {
      try {
        setLoading(true);
        const images = await getAllFoodImages(50);
        const validImages = Array.isArray(images)
          ? images.filter((img) => img && typeof img === "object")
          : [];
        setFoodImages(validImages);
        setFilteredImages(validImages);
      } catch (error) {
        console.error("Error fetching images:", error);
        setFoodImages([]);
        setFilteredImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []); // Empty dependency array

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredImages(foodImages);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = foodImages.filter((image) => {
      if (!image) return false;

      const captionMatch =
        image.caption && image.caption.toLowerCase().includes(term);
      const tagMatch =
        image.tags &&
        Array.isArray(image.tags) &&
        image.tags.some((tag) => tag && tag.toLowerCase().includes(term));

      return captionMatch || tagMatch;
    });

    setFilteredImages(filtered);
  }, [searchTerm, foodImages]);

  // Handle like functionality
  const handleLike = async (id, currentLikes) => {
    try {
      await likeFoodImage(id, currentLikes + 1);

      // Update local state
      setFoodImages((prevImages) =>
        prevImages.map((img) =>
          img.$id === id ? { ...img, likes: currentLikes + 1 } : img
        )
      );

      setFilteredImages((prevImages) =>
        prevImages.map((img) =>
          img.$id === id ? { ...img, likes: currentLikes + 1 } : img
        )
      );
    } catch (error) {
      console.error("Error liking image:", error);
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

  // Add console log to check filteredImages before rendering
  console.log("Rendering with filteredImages:", filteredImages);
  console.log("Loading state:", loading);

  // Debug the structure of the first image if available
  if (filteredImages.length > 0) {
    console.log("First image in filteredImages:", filteredImages[0]);
    console.log("Image URL:", filteredImages[0].imageUrl);
    console.log("Image caption:", filteredImages[0].caption);
    console.log("Image tags:", filteredImages[0].tags);
  } else {
    console.log("No images in filteredImages array");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Explore Dishes
        </h1>
        <p className="text-gray-600 mb-6">
          Discover amazing culinary creations from our community
        </p>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by caption or tags..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Food Images Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredImages.length > 0 ? (
            filteredImages.map((image) => (
              <motion.div
                key={image.$id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                variants={itemVariants}
              >
                <Link
                  to={`/dish/${image.$id}`}
                  className="group block relative overflow-hidden"
                >
                  <div className="relative h-80">
                    <img
                      src={image.imageUrl}
                      alt={image.caption || "Food dish"}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = fallbackImageBase64; // Use inline base64 image
                        e.target.onerror = null;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                      <span className="text-white font-medium flex items-center gap-2">
                        View Details
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-6 bg-white">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-1">
                    {image.caption}
                  </h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600 text-sm">
                      {new Date(image.$createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleLike(image.$id, image.likes)}
                      className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-orange-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">{image.likes || 0}</span>
                    </button>
                  </div>
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {image.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-orange-200 transition-colors"
                          onClick={() => setSearchTerm(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-sm">
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
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-4">
                No dishes found matching your search
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Floating Upload Button */}
      <Link
        to="/upload"
        className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-colors"
        title="Upload a new dish"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Explore;
