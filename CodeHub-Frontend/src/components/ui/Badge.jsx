import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'default',
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    secondary: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span 
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
