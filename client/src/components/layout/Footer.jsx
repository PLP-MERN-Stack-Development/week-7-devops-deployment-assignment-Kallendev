import React from 'react';
import { PenTool, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <PenTool className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">BlogSpace</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              A modern blogging platform where ideas come to life. Share your thoughts, connect with readers, and build your community.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>using MERN Stack</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/categories" className="hover:text-white transition-colors">Categories</a></li>
              <li><a href="/create" className="hover:text-white transition-colors">Write</a></li>
              <li><a href="/profile" className="hover:text-white transition-colors">Profile</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Rich Text Editor</li>
              <li>Image Uploads</li>
              <li>Comments System</li>
              <li>Category Management</li>
              <li>User Authentication</li>
              <li>Responsive Design</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 BlogSpace. Built with React, Node.js, Express, and MongoDB.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;