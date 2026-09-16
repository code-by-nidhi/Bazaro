import React from 'react';
import ProductCard from './ProductCard';
import { CardSkeleton } from '../common/Skeleton';
import { PackageX } from 'lucide-react';

const ProductGrid = ({ products = [], loading = false, emptyMessage = 'No products match your selected criteria.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <CardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center flex flex-col items-center justify-center my-6 space-y-3">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <PackageX size={32} />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Products Found</h3>
        <p className="text-xs text-slate-500 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
