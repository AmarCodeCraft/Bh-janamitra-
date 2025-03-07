import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".mobile-menu") &&
        !event.target.closest(".menu-button")
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 max-w-[100vw] overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center h-16 px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-orange-500 font-bold text-xl md:text-2xl">
                Bhōjanamitra
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`text-gray-600 hover:text-orange-500 font-medium ${
                  location.pathname === "/" ? "text-orange-500" : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`text-gray-600 hover:text-orange-500 font-medium ${
                  location.pathname === "/explore" ? "text-orange-500" : ""
                }`}
              >
                Explore
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/upload"
                    className={`text-gray-600 hover:text-orange-500 font-medium ${
                      location.pathname === "/upload" ? "text-orange-500" : ""
                    }`}
                  >
                    Upload
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center text-gray-600 hover:text-orange-500 font-medium focus:outline-none">
                      <span className="mr-1">{user?.name || "Account"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-orange-500 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 focus:outline-none menu-button"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white pt-16 mobile-menu overflow-y-auto">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                className={`block py-3 text-lg font-medium ${
                  location.pathname === "/"
                    ? "text-orange-500"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`block py-3 text-lg font-medium ${
                  location.pathname === "/explore"
                    ? "text-orange-500"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/upload"
                    className={`block py-3 text-lg font-medium ${
                      location.pathname === "/upload"
                        ? "text-orange-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Upload
                  </Link>
                  <Link
                    to="/profile"
                    className={`block py-3 text-lg font-medium ${
                      location.pathname === "/profile"
                        ? "text-orange-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`block py-3 text-lg font-medium ${
                      location.pathname === "/settings"
                        ? "text-orange-500"
                        : "text-gray-600"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 text-lg font-medium text-gray-600 border-t border-gray-200 mt-4 pt-4"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block text-center py-3 text-lg font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block text-center py-3 text-lg font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                <span className="text-orange-500 font-bold text-xl">
                  Bhōjanamitra
                </span>
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Share your culinary creations with the world
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Navigation
                </h3>
                <div className="mt-4 space-y-2">
                  <Link
                    to="/"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Home
                  </Link>
                  <Link
                    to="/explore"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Explore
                  </Link>
                  <Link
                    to="/upload"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Upload
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Account
                </h3>
                <div className="mt-4 space-y-2">
                  <Link
                    to="/profile"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Settings
                  </Link>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 mt-6 sm:mt-0">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Legal
                </h3>
                <div className="mt-4 space-y-2">
                  <Link
                    to="/privacy"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-500 hover:text-orange-500 block"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} Bhōjanamitra. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
