import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, PenTool, User, LogOut, Home, Folder, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from "../../contexts/usePosts"; 


import SearchModal from '../common/SearchModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { searchPosts } = usePosts();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleSearch = async (query) => {
    await searchPosts(query);
    navigate('/');
    setShowSearch(false);
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                BlogSpace
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/categories"
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Folder className="h-4 w-4" />
                <span>Categories</span>
              </Link>
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <PenTool className="h-4 w-4" />
                    <span>Write</span>
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span>{user?.username}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-2 py-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/categories"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-2 py-2"
                >
                  <Folder className="h-4 w-4" />
                  <span>Categories</span>
                </Link>
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-2 py-2 text-left"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/create"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-blue-600 px-2 py-2"
                    >
                      <PenTool className="h-4 w-4" />
                      <span>Write</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors px-2 py-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors px-2 py-2 text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-3 border-t border-gray-200">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default Navbar;