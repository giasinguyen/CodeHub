import React from 'react';

const Avatar = ({ 
  src, 
  alt, 
  fallback, 
  size = 'md', 
  className = '',
  onClick 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const handleError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'flex';
  };

  return (
    <div 
      className={`relative rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 ${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      )}
      <div 
        className={`w-full h-full flex items-center justify-center text-white font-bold ${src ? 'hidden' : 'flex'}`}
      >
        {fallback}
      </div>
    </div>
  );
};

export default Avatar;
