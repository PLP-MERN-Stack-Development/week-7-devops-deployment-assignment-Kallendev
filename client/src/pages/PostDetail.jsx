import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Eye, MessageCircle, Tag, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { usePosts } from '../contexts/usePosts';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostDetail = () => {
  const { slug } = useParams();
  const { currentPost, loading, fetchPost, deletePost, addComment } = usePosts();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost(slug);
    }
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = async () => {
    if (!currentPost) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(currentPost._id);
        navigate('/');
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Error handled in context
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentPost) return;

    try {
      setSubmittingComment(true);
      await addComment(currentPost._id, comment.trim());
      setComment('');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // Error handled in context
    } finally {
      setSubmittingComment(false);
    }
  };

  const canEditPost = user && currentPost && (
    user._id === currentPost.author._id || user.role === 'admin'
  );

  if (loading || !currentPost) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Posts
      </Link>

      <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Featured Image */}
        {currentPost.featuredImage && (
          <div className="aspect-video overflow-hidden">
            <img
              src={currentPost.featuredImage}
              alt={currentPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Category and Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to={`/categories/${currentPost.category.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: currentPost.category.color }}
            >
              <Tag className="h-4 w-4 mr-2" />
              {currentPost.category.name}
            </Link>

            {canEditPost && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/edit/${currentPost._id}`}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {currentPost.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="font-medium">{currentPost.author.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(currentPost.publishedAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-5 w-5" />
                <span>{currentPost.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-5 w-5" />
                <span>{currentPost.comments.length}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {currentPost.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {currentPost.content}
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {currentPost.author.username}
                </h3>
                {currentPost.author.bio && (
                  <p className="text-gray-600">{currentPost.author.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comments ({currentPost.comments.length})
            </h3>

            {/* Add Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="mb-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!comment.trim() || submittingComment}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
                <p className="text-gray-600">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Login
                  </Link>
                  {' '}to join the conversation
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {currentPost.comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {comment.author.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;