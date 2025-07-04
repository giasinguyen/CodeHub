import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  variant = 'default',
  padding = 'default',
  hover = true,
  onClick,
  ...props 
}) => {  const baseClasses = `
    bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/90 backdrop-blur-sm
    border border-slate-700 dark:border-slate-700 light:border-gray-200
    rounded-xl
    transition-all duration-200
  `;
  const variants = {
    default: 'shadow-lg dark:shadow-lg light:shadow-md',
    elevated: 'shadow-xl shadow-black/20 dark:shadow-xl dark:shadow-black/20 light:shadow-lg light:shadow-gray-300/20',
    outline: 'border-2 border-slate-600 dark:border-slate-600 light:border-gray-300',
    glass: 'bg-slate-800/30 dark:bg-slate-800/30 light:bg-white/70 backdrop-blur-md',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/20 light:hover:shadow-gray-300/30 hover:-translate-y-1' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const cardClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${paddings[padding]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `;

  if (onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

// Card Title Component
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-slate-100 ${className}`}>
    {children}
  </h3>
);

// Card Content Component
const CardContent = ({ children, className = '' }) => (
  <div className={`text-slate-300 ${className}`}>
    {children}
  </div>
);

// Card Footer Component
const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-slate-700 dark:border-slate-700 light:border-gray-200 ${className}`}>
    {children}
  </div>
);

// Attach sub-components
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
