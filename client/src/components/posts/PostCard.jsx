import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, MessageCircle, Tag } from 'lucide-react';

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <Link
            to={`/categories/${post.category.slug}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: post.category.color }}
          >
            <Tag className="h-3 w-3 mr-1" />
            {post.category.name}
          </Link>
        </div>

        {/* Title */}
        <Link to={`/posts/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{post.author.username}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          to={`/posts/${post.slug}`}
          className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:underline transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
};

export default PostCard;