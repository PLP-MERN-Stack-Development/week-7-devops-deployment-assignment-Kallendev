import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, FileText } from 'lucide-react';
import { usePosts } from '../contexts/usePosts';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Categories = () => {
  const { categories, loading, fetchCategories } = usePosts();

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading && categories.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Categories</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore posts organized by topics and find content that interests you most
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
          <p className="text-gray-500">Categories will appear here once they are created.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div
                className="h-32 p-6 flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: category.color }}
              >
                <Folder className="h-12 w-12 text-white" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                
                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">
                      {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                  
                  <span className="text-blue-600 group-hover:underline text-sm font-medium">
                    View Posts →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;