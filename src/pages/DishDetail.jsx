import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getFoodImageById,
  updateLikes,
  deleteFoodImage,
} from "../utils/foodImages";
import { useAuth } from "../hooks/useAuth";
import { databases, ID } from "../appwrite";
import { motion } from "framer-motion";

const DishDetail = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        const dishData = await getFoodImageById(id);
        setDish(dishData);
        await fetchComments();
      } catch (error) {
        console.error("Error fetching dish:", error);
        setError("Failed to load dish details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        "comments", // Create this collection in Appwrite
        [
          // Query to get comments for this dish
          databases.queries.equal("dishId", id),
          databases.queries.orderDesc("$createdAt"),
        ]
      );
      setComments(response.documents);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    if (!dish) return;

    try {
      const currentLikes = dish.likes || 0;
      const updatedLikes = currentLikes + 1;

      // Update in database
      await updateLikes(id, updatedLikes);

      // Update local state
      setDish((prev) => ({
        ...prev,
        likes: updatedLikes,
      }));
    } catch (error) {
      console.error("Error liking dish:", error);
    }
  };

  const handleDelete = async () => {
    if (!dish || !user || dish.userId !== user.$id) return;

    try {
      await deleteFoodImage(id, dish.imageId);
      navigate("/profile");
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);

      const commentData = {
        dishId: id,
        userId: user.$id,
        userName: user.name || user.email,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      };

      const response = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        "comments", // Create this collection in Appwrite
        ID.unique(),
        commentData
      );

      setComments((prev) => [response, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        "comments",
        commentId
      );

      setComments((prev) =>
        prev.filter((comment) => comment.$id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <Link to="/explore" className="text-orange-500 hover:text-orange-600">
          Back to Explore
        </Link>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Dish not found
        </h2>
        <Link to="/explore" className="text-orange-500 hover:text-orange-600">
          Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              className="h-64 w-full object-contain md:h-full md:object-cover"
              src={dish.imageUrl}
              alt={dish.caption || "Food dish"}
              onError={(e) => {
                e.target.src = "/src/assets/images/placeholder-food.jpg";
                e.target.onerror = null;
              }}
            />
          </div>
          <div className="p-6 md:p-8 md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {dish.caption}
              </h1>
              {user && dish.userId === user.$id && (
                <div className="flex space-x-2">
                  <Link
                    to={`/edit/${id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center mb-4">
              <span className="text-gray-600 text-sm">
                Posted on {new Date(dish.$createdAt).toLocaleDateString()}
              </span>
            </div>

            {dish.description && (
              <p className="text-gray-600 mb-6">{dish.description}</p>
            )}

            {dish.tags && dish.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dish.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleLike}
                  className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-1 text-orange-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{dish.likes || 0}</span>
                </button>
              </div>

              <Link
                to={`/profile/${dish.userId}`}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                View Chef's Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Comments</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className={`px-4 py-2 rounded-md font-medium ${
                submitting || !newComment.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
            <p className="text-gray-600 mb-2">
              Sign in to join the conversation
            </p>
            <Link
              to="/login"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition duration-300"
            >
              Sign In
            </Link>
          </div>
        )}

        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div
                key={comment.$id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mr-3">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {comment.userName}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>

                  {user && user.$id === comment.userId && (
                    <button
                      onClick={() => handleDeleteComment(comment.$id)}
                      className="text-gray-400 hover:text-red-500"
                      title="Delete comment"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishDetail;
