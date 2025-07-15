import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { PenTool, Image as ImageIcon, X } from 'lucide-react';
import { usePosts } from '../contexts/usePosts';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [featuredImage, setFeaturedImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const { categories, fetchCategories, createPost } = usePosts();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      status: 'draft',
    },
  });

  const watchContent = watch('content');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (watchContent && watchContent.length > 200) {
      const excerpt = watchContent.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
      setValue('excerpt', excerpt);
    }
  }, [watchContent, setValue]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5000000) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFeaturedImage(response.data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const postData = {
        ...data,
        featuredImage,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };

      await createPost(postData);
      navigate('/');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // Error handled in context
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <PenTool className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 200,
                  message: 'Title must be less than 200 characters',
                },
              })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your post title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            {featuredImage ? (
              <div className="relative">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-800 font-medium">
                    {uploading ? 'Uploading...' : 'Click to upload an image'}
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-gray-500 text-sm mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                {...register('category', {
                  required: 'Category is required',
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                {...register('tags')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter tags separated by commas..."
              />
              <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              {...register('content', {
                required: 'Content is required',
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              rows={12}
              placeholder="Write your post content here..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt', {
                maxLength: {
                  value: 300,
                  message: 'Excerpt must be less than 300 characters',
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              rows={3}
              placeholder="Brief description of your post (auto-generated if left empty)..."
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="draft"
                  {...register('status')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Save as Draft</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="radio"
                  value="published"
                  {...register('status')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Publish Now</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Create Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;