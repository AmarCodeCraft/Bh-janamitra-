export const handleAppwriteError = (error) => {
  console.error("Appwrite Error:", error);

  if (error.code) {
    switch (error.code) {
      case 401:
        return "Authentication failed. Please log in again.";
      case 403:
        return "Permission denied. Please check your access rights.";
      case 404:
        return "Resource not found.";
      case 429:
        return "Too many requests. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return `Error: ${error.message || "Unknown error occurred"}`;
    }
  }

  if (error.message?.includes("Failed to fetch")) {
    return "Network error. Please check your internet connection.";
  }

  return "An unexpected error occurred. Please try again.";
};
