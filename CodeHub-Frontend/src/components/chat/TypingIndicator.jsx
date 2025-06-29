import React from 'react';

const TypingIndicator = ({ username }) => {
  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
             style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
             style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" 
             style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-slate-500">
        {username} is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;
