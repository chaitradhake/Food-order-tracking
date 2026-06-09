import React from 'react';

function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className={`animate-spin rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size] || sizeClasses.md}`}></div>
    </div>
  );
}

export default LoadingSpinner;
