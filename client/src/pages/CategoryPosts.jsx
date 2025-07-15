import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Folder } from 'lucide-react';
import { usePosts } from '../contexts/usePosts';
import PostCard from '../components/posts/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CategoryPosts = () => {
  const { slug } = useParams();
  const { posts, categories, loading, fetchPosts, fetchCategories } = usePosts();
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length]);

  useEffect(() => {
    if (slug && categories.length > 0) {
      const category = categories.find(cat => cat.slug === slug);
      setCurrentCategory(category);
      
      if (category) {
        fetchPosts({ category: category._id });
      }
    }
  }, [slug, categories]);

  if (loading || !currentCategory) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        to="/categories"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Categories
      </Link>

      {/* Category Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
             style={{ backgroundColor: currentCategory.color }}>
          <Folder className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {currentCategory.name}
        </h1>
        {currentCategory.description && (
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            {currentCategory.description}
          </p>
        )}
        <p className="text-gray-500">
          {currentCategory.postCount} {currentCategory.postCount === 1 ? 'post' : 'posts'} in this category
        </p>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No posts in this category yet
          </h3>
          <p className="text-gray-500">
            Be the first to write about {currentCategory.name.toLowerCase()}!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPosts;