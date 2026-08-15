import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#131b2e] border border-gray-800 rounded-2xl p-4 animate-pulse space-y-4">
      <div className="aspect-square rounded-xl bg-gray-800/80" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-800 rounded w-5/6" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gray-800 rounded w-1/3" />
        <div className="h-9 w-9 bg-gray-800 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-gray-800">
      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-24" /></td>
      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-32" /></td>
      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-16" /></td>
      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-20" /></td>
      <td className="p-4"><div className="h-4 bg-gray-800 rounded w-12" /></td>
    </tr>
  );
}
