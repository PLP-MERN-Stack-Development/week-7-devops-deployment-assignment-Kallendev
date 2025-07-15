import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile(data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // Error handled in context
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
          <div className="flex items-center justify-center space-x-2 text-blue-100">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Edit className="h-6 w-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Username must be less than 20 characters',
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                {...register('bio', {
                  maxLength: {
                    value: 500,
                    message: 'Bio must be less than 500 characters',
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                rows={4}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                {...register('avatar')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter avatar image URL"
              />
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Role:</span>
              <span className="ml-2 font-medium capitalize">{user.role}</span>
            </div>
            <div>
              <span className="text-gray-600">Member since:</span>
              <span className="ml-2 font-medium">
                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;