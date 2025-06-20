import React, { forwardRef } from 'react';

const Select = forwardRef(({ className = '', children, onChange, ...props }, ref) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  return (
    <select
      ref={ref}
      onChange={handleChange}
      className={`
        w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        dark:bg-gray-800 dark:border-gray-600 dark:text-white
        dark:focus:ring-blue-400 dark:focus:border-blue-400
        dark:disabled:bg-gray-700
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export default Select;
