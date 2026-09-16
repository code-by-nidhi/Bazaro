import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilterDrawer from '../../components/product/ProductFilterDrawer';
import Pagination from '../../components/common/Pagination';
import { getProductsApi } from '../../services/productApi';
import { useProducts } from '../../hooks/useProducts';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useProducts();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract filter parameters from URL
  const filters = {
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
    featured: searchParams.get('featured') || '',
    bestseller: searchParams.get('bestseller') || '',
    trending: searchParams.get('trending') || '',
    newArrival: searchParams.get('newArrival') || '',
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        Object.keys(filters).forEach((key) => {
          if (filters[key]) queryParams[key] = filters[key];
        });

        const data = await getProductsApi(queryParams);
        if (data.success) {
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setTotalProducts(data.totalProducts || 0);
        }
      } catch (error) {
        console.warn('[Shop Fetch Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    const params = new URLSearchParams();
    Object.keys(updated).forEach((key) => {
      if (updated[key]) params.set(key, updated[key]);
    });
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Resolve the slug in the URL to the admin-defined display name.
  const activeCategory = categories.find((c) => c.slug === filters.category);

  const handlePageChange = (newPage) => {
    handleFilterChange({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-8 sm:py-10 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            {filters.category ? (activeCategory?.name || filters.category).toUpperCase() : 'ALL CLOTHING'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse {totalProducts} clothing styles with nationwide express delivery.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Top Control Bar: Mobile Filter Button & Sorting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <span className="text-xs font-semibold text-slate-500">
              Showing <strong className="text-slate-900">{products.length}</strong> of {totalProducts} Products
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <ArrowUpDown size={14} /> Sort By:
            </span>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_low_high">Price: Low to High</option>
              <option value="price_high_low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="flex gap-6 xl:gap-8 items-start">
          <ProductFilterDrawer
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            categories={categories}
          />

          <div className="flex-1 min-w-0">
            <ProductGrid products={products} loading={loading} />
            <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Shop;
