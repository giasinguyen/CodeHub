import React, { forwardRef } from 'react';

const TextArea = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        dark:bg-gray-800 dark:border-gray-600 dark:text-white
        dark:focus:ring-blue-400 dark:focus:border-blue-400
        dark:disabled:bg-gray-700
        resize-vertical
        ${className}
      `}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
