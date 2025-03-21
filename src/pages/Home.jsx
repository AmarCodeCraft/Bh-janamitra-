import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllFoodImages } from "../utils/foodImages";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const [foodImages, setFoodImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const images = await getAllFoodImages(10);
        setFoodImages(Array.isArray(images) ? images : []);
      } catch (error) {
        console.error("Error fetching images:", error);
        setFoodImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.section
        className="text-center py-8 md:py-12 lg:py-20 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl mb-8 md:mb-12 px-4 md:px-8"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Share Your Culinary Creations
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 px-4 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Discover, share, and celebrate the art of food with fellow enthusiasts
          around the world.
        </motion.p>
        {!isAuthenticated ? (
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
            >
              Join Now
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white hover:bg-gray-100 text-orange-500 font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
            >
              Sign In
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              to="/upload"
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300 inline-block"
            >
              Share Your Food
            </Link>
          </motion.div>
        )}
      </motion.section>

      {/* Featured Food Images */}
      <section className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Featured Dishes</h2>
          <Link
            to="/explore"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {foodImages.length > 0 ? (
              foodImages.map((image) => (
                <motion.div
                  key={image?.$id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  variants={itemVariants}
                >
                  <Link
                    to={`/dish/${image?.$id}`}
                    className="group block relative overflow-hidden"
                  >
                    <div className="relative h-48 sm:h-64 lg:h-80">
                      <img
                        src={image?.imageUrl}
                        alt={image?.caption || "Food dish"}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
                          e.target.onerror = null;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 sm:p-6">
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
                  <div className="p-4 sm:p-6 bg-white">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-800 line-clamp-1">
                      {image?.caption || "Untitled Dish"}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs sm:text-sm">
                        {new Date(image?.$createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-orange-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-sm sm:text-base">
                          {image?.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-500 text-base sm:text-lg">
                  No dishes available at the moment.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Home;
