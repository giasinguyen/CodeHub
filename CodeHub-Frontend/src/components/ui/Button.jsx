import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-[0.98]
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-500
      hover:from-cyan-600 hover:to-blue-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-cyan-500
    `,
    secondary: `
      bg-slate-700 hover:bg-slate-600
      text-white border border-slate-600
      focus:ring-slate-500
    `,
    outline: `
      bg-transparent border-2 border-cyan-500
      text-cyan-400 hover:bg-cyan-500 hover:text-white
      focus:ring-cyan-500
    `,
    ghost: `
      bg-transparent hover:bg-slate-700
      text-slate-300 hover:text-white
      focus:ring-slate-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-red-500
    `,
    success: `
      bg-green-600 hover:bg-green-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-green-500
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
    xl: 'px-8 py-4 text-lg h-14',
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 mr-2" />
      )}
      
      {children}
      
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
