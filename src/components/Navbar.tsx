// This is the component that hold all the code in the navbar
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import AuthModal from "./auth/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { AuthState, logOut } from "../state";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { isAuthenticated, user } = useSelector(
    (state: { auth: AuthState }) => state.auth,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // This is the definition of where the named endpoint if the words are clicked
  const navigation = [
    { name: "Home", path: "/" },
    { name: "Find a job", path: "/jobs" },
    { name: "Employers", path: "/employers" },
    { name: "Blog", path: "/blog" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ];

  // For this part we saw it fit to actually write the function to be executed when someone the butto
  const handlePostJob = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      navigate("/employer/post-job");
    }
  };

  // Handle logout will only appear of someone has logged in
  const handleLogout = () => {
    dispatch(logOut());
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* This is the first part of the nav component from the left */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img src="/logo.jpg" className="h-12 w-12" alt="" />
                {/* <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block"> */}
                {/*   Medrin Jobs */}
                {/* </span> */}
              </Link>

              <div className="hidden md:ml-8 md:flex md:space-x-4">
                {navigation.map((item) => (
                  // The link here is for those who wish to click for easy change of homepage
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2"
                  >
                    {/* This item.name contains all the words that are in the navbar apart from the login and post a job button */}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative">
                  {/* This button will only appear if the user is logged in such that it displays the name of the user and gives some initial functionality */}
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden lg:block">{user?.name}</span>
                  </button>

                  {showProfileMenu && (
                    // THis will be only showing when the user is signed in and the user is an employer
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      {user?.role === "employer" && (
                        <>
                          <Link
                            to="/employer/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/employer/jobs"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            My Jobs
                          </Link>
                        </>
                      )}
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-4 w-4 inline mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // This button appears only when the user has not siged up
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-700 hover:text-blue-600 px-4 py-2"
                >
                  Login / Register
                </button>
              )}
              {/* This is the post a job button that appears before logging in  and even when you are an employer */}
              <button
                onClick={handlePostJob}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Post a Job
              </button>
            </div>

            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* This is the mobile presentation of how it would look like on mobile view if run app is run from a mobile device*/}
        {isOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {user?.role === "employer" && (
                    <>
                      <Link
                        to="/employer/dashboard"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employer/jobs"
                        className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        My Jobs
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  Login / Register
                </button>
              )}
              <button
                onClick={() => {
                  handlePostJob();
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Post a Job
              </button>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialView={isAuthenticated ? "login" : "user-type"}
      />
    </>
  );
};

export default Navbar;

