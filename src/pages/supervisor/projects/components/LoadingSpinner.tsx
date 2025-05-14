
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-archive-primary mb-4"></div>
      <p className="text-archive-dark dark:text-white">جاري تحميل المشاريع...</p>
    </div>
  );
};

export default LoadingSpinner;
