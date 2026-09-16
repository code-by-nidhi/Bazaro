import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
      <div className="w-full h-48 bg-slate-200 rounded-xl animate-shimmer" />
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-9 w-9 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-12 bg-slate-100 rounded-lg w-full" />
      ))}
    </div>
  );
};
