import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg
    bg-slate-800/50 border border-slate-700
    text-slate-100 placeholder-slate-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const iconPaddingLeft = Icon && iconPosition === 'left' ? 'pl-12' : '';
  const iconPaddingRight = Icon && iconPosition === 'right' ? 'pr-12' : '';
  const passwordPaddingRight = isPassword ? 'pr-12' : '';

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className={`w-5 h-5 ${
              error ? 'text-red-400' : 
              isFocused ? 'text-cyan-400' : 'text-slate-400'
            }`} />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${baseInputClasses}
            ${errorClasses}
            ${iconPaddingLeft}
            ${iconPaddingRight}
            ${passwordPaddingRight}
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Icon className={`w-5 h-5 ${
              error ? 'text-red-400' : 
              isFocused ? 'text-cyan-400' : 'text-slate-400'
            }`} />
          </div>
        )}

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="text-slate-400 text-sm">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
