import React, { useState, useEffect } from 'react';
import { 
  X, Camera, MapPin, Link, Github, Twitter, Linkedin, 
  User, Mail, Globe, Save, Loader2 
} from 'lucide-react';
import { Button, Input } from '../ui';
import { authAPI, uploadAPI } from '../../services/api';
import toast from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    location: '',
    websiteUrl: '',
    githubUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    avatarUrl: '',
    coverPhotoUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        websiteUrl: user.websiteUrl || '',
        githubUrl: user.githubUrl || '',
        twitterUrl: user.twitterUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        avatarUrl: user.avatarUrl || '',
        coverPhotoUrl: user.coverPhotoUrl || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate URLs
    const urlFields = ['websiteUrl', 'githubUrl', 'twitterUrl', 'linkedinUrl'];
    urlFields.forEach(field => {
      const value = formData[field];
      if (value && !isValidUrl(value)) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    // Validate bio length
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    // Validate full name length
    if (formData.fullName && formData.fullName.length > 100) {
      newErrors.fullName = 'Full name must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;    } catch {
      return false;
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('Image size must be less than 10MB');
        return;
      }

      setIsUploadingAvatar(true);
      
      const response = await uploadAPI.uploadAvatar(file);
      const imageUrl = response.data.imageUrl;
      
      setFormData(prev => ({
        ...prev,
        avatarUrl: imageUrl
      }));
      
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('Image size must be less than 10MB');
        return;
      }

      setIsUploadingCover(true);
      
      const response = await uploadAPI.uploadCoverPhoto(file);
      const imageUrl = response.data.imageUrl;
      
      setFormData(prev => ({
        ...prev,
        coverPhotoUrl: imageUrl
      }));
      
      toast.success('Cover photo uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload cover photo:', error);
      toast.error('Failed to upload cover photo');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await authAPI.updateProfile(formData);
      
      onUpdate(response.data);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 overflow-hidden">
      {/* Full screen modal */}
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content area with scroll */}
        <div className="flex-1 overflow-y-auto bg-slate-900">
          <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Photo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Cover Photo</h3>
            <div className="relative h-32 rounded-lg overflow-hidden">
              {formData.coverPhotoUrl ? (
                <img 
                  src={formData.coverPhotoUrl} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
              )}
              
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                {isUploadingCover ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-white mr-2" />
                    <span className="text-white font-medium">Change Cover</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  disabled={isUploadingCover || isLoading}
                />
              </label>
            </div>
          </div>

          {/* Avatar Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-700">
                  {formData.avatarUrl ? (
                    <img 
                      src={formData.avatarUrl} 
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
                      <span className="text-xl font-bold text-white">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                
                <label className="absolute -bottom-1 -right-1 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full cursor-pointer transition-colors">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploadingAvatar || isLoading}
                  />
                </label>
              </div>
              
              <div className="flex-1">
                <p className="text-white font-medium">Profile Picture</p>
                <p className="text-slate-400 text-sm">
                  JPG, PNG or GIF. Max size 10MB. Square images work best.
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-white font-medium mb-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                error={errors.fullName}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-white font-medium mb-2">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                error={errors.location}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-white font-medium mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 transition-colors ${
                errors.bio 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-slate-600 focus:ring-cyan-500 focus:border-cyan-500'
              }`}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.bio && (
                <span className="text-red-400 text-sm">{errors.bio}</span>
              )}
              <span className={`text-sm ml-auto ${
                formData.bio.length > 450 ? 'text-red-400' : 'text-slate-400'
              }`}>
                {formData.bio.length}/500
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Social Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-white font-medium mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </label>
                <Input
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  error={errors.websiteUrl}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white font-medium mb-2">
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </label>
                <Input
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username"
                  error={errors.githubUrl}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white font-medium mb-2">
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </label>
                <Input
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/username"
                  error={errors.twitterUrl}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-white font-medium mb-2">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </label>
                <Input
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  error={errors.linkedinUrl}
                  disabled={isLoading}
                />              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700 mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || isUploadingAvatar || isUploadingCover}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </Button>
          </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
