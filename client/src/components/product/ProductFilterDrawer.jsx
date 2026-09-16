import React from 'react';
import { X, RotateCcw, Filter, Star } from 'lucide-react';

const ProductFilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  categories = [],
}) => {
  const activeCategory = categories.find((c) => c.slug === filters.category);
  const subcategories = activeCategory?.subcategories || [];

  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Categories</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ category: '', subcategory: '' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
              !filters.category ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.slug}
              onClick={() => onFilterChange({ category: cat.slug, subcategory: '' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                filters.category === cat.slug
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter (If active category has subcategories) */}
      {subcategories.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Subcategories</h4>
          <div className="space-y-1.5">
            <button
              onClick={() => onFilterChange({ subcategory: '' })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                !filters.subcategory ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Subcategories
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => onFilterChange({ subcategory: sub.name })}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                  filters.subcategory === sub.name
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Price Range (₹)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-1/2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-1/2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">Minimum Rating</h4>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => onFilterChange({ rating: filters.rating === star ? '' : star })}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                Number(filters.rating) === star ? 'bg-amber-100 text-amber-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: star }).map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs text-slate-700 ml-1">& Up</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-4 border-t border-slate-100">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={filters.inStock === 'true'}
            onChange={(e) => onFilterChange({ inStock: e.target.checked ? 'true' : '' })}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          In Stock Only
        </label>
      </div>

      {/* Reset Button */}
      <button
        onClick={onResetFilters}
        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 mt-4"
      >
        <RotateCcw size={14} /> Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar View */}
      <div className="hidden lg:block w-64 shrink-0 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs h-fit sticky top-24">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Filter size={16} className="text-indigo-600" /> Filter Products
          </h3>
        </div>
        {filterContent}
      </div>

      {/* Mobile Drawer Modal View */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col p-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Filter size={16} className="text-indigo-600" /> Filters
                </h3>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilterDrawer;
