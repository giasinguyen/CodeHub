import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2 className={`animate-spin text-cyan-400 ${sizes[size]} ${className}`} />
  );
};

// Loading Dots Component
const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Full Page Loading Component
const FullPageLoading = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-slate-300 text-lg">{message}</p>
      </div>
    </div>
  );
};

// Card Loading Skeleton
const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-6 ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <div className="h-3 bg-slate-700 rounded"></div>
          <div className="h-3 bg-slate-700 rounded w-5/6"></div>
          <div className="h-3 bg-slate-700 rounded w-4/6"></div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            <div className="w-16 h-6 bg-slate-700 rounded"></div>
            <div className="w-16 h-6 bg-slate-700 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// List Loading Skeleton
const ListSkeleton = ({ items = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Profile Loading Skeleton
const ProfileSkeleton = () => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="animate-pulse">
        {/* Avatar and basic info */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-slate-700 rounded-full"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-slate-700 rounded w-1/3"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-4 bg-slate-700 rounded w-2/3"></div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center">
              <div className="h-8 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
        
        {/* Bio */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-4/5"></div>
          <div className="h-4 bg-slate-700 rounded w-3/5"></div>
        </div>
      </div>
    </div>
  );
};

// Loading States Component
const Loading = ({ 
  type = 'spinner', 
  size = 'md',
  message,
  className = '',
  items = 3 
}) => {
  switch (type) {
    case 'dots':
      return <LoadingDots className={className} />;
    case 'fullpage':
      return <FullPageLoading message={message} />;
    case 'card':
      return <CardSkeleton className={className} />;
    case 'list':
      return <ListSkeleton items={items} className={className} />;
    case 'profile':
      return <ProfileSkeleton />;
    default:
      return <LoadingSpinner size={size} className={className} />;
  }
};

// Export all components
export default Loading;
export {
  LoadingSpinner,
  LoadingDots,
  FullPageLoading,
  CardSkeleton,
  ListSkeleton,
  ProfileSkeleton,
};
