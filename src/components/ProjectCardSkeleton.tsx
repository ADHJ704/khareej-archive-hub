
import React from 'react';

const ProjectCardSkeleton = () => {
  return (
    <div className="archive-card overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200 dark:bg-slate-800" />
      <div className="p-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-4" />
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          ))}
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
