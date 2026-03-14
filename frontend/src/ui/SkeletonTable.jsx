import React from 'react';

const SkeletonTable = () => {
  return (
    <div className="w-full animate-pulse">
      {/* Table Header Skeleton */}
      <div className="flex gap-4 p-4 border-b border-white/10 bg-white/[0.02]">
        <div className="h-4 bg-white/10 rounded w-1/6"></div>
        <div className="h-4 bg-white/10 rounded w-1/3"></div>
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
        <div className="h-4 bg-white/10 rounded w-1/6"></div>
      </div>
      
      {/* Table Rows Skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-white/5 items-center">
          <div className="h-4 bg-[#ccff00]/20 rounded w-1/6"></div>
          <div className="h-5 bg-white/10 rounded w-1/3"></div>
          <div className="h-6 bg-white/5 rounded-full w-24"></div>
          <div className="h-6 bg-white/10 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
