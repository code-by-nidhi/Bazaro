import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ProductGrid from '../../components/product/ProductGrid';
import { getProductsApi } from '../../services/productApi';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchData = async () => {
      setLoading(true);
      try {
        const data = await getProductsApi({ search: query });
        if (data.success) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.warn('[Search Fetch Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchSearchData();
  }, [query]);

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Search size={14} /> Search Results
          </div>
          <h1 className="text-3xl font-black font-heading">
            Results for <span className="text-indigo-400">"{query}"</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Found {products.length} clothing items matching your query.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <ProductGrid
          products={products}
          loading={loading}
          emptyMessage={`We couldn't find any products matching "${query}". Try checking your spelling or search another term.`}
        />
      </div>
    </MainLayout>
  );
};

export default SearchResults;
