import React, { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { Button } from '../ui';
import toast from 'react-hot-toast';

const AvatarUpload = ({ 
  currentImage, 
  onImageUpdate, 
  type = 'avatar', 
  size = 'md' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    cover: 'w-full h-48'
  };

  const actualSize = type === 'cover' ? 'cover' : size;

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'codehub_images');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpdate(data.secure_url);
      toast.success(`${type === 'cover' ? 'Cover photo' : 'Profile picture'} updated successfully!`);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      setPreview(currentImage); // Reset to original
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUpdate(null);
    toast.success(`${type === 'cover' ? 'Cover photo' : 'Profile picture'} removed`);
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div 
          className={`
            ${sizeClasses[actualSize]}
            border-2 border-dashed border-slate-600 rounded-lg
            bg-slate-800/50 flex items-center justify-center
            overflow-hidden relative
            ${type === 'cover' ? 'rounded-lg' : 'rounded-full'}
            group-hover:border-cyan-500 transition-colors
          `}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt={type === 'cover' ? 'Cover photo' : 'Profile picture'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <label htmlFor={`${type}-upload`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    as="span"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRemove}
                  className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <label 
              htmlFor={`${type}-upload`}
              className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">
                Upload {type === 'cover' ? 'Cover' : 'Photo'}
              </span>
              <span className="text-xs text-slate-500 mt-1">
                PNG, JPG up to 5MB
              </span>
            </label>
          )}
        </div>

        <input
          id={`${type}-upload`}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
          <span>Uploading...</span>
        </div>
      )}

      <div className="text-xs text-slate-500">
        {type === 'cover' 
          ? 'Recommended size: 1200x400px'
          : 'Recommended size: 400x400px'
        }
      </div>
    </div>
  );
};

export default AvatarUpload;