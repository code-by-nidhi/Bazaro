import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ProductGrid from '../../components/product/ProductGrid';
import { getProductsApi } from '../../services/productApi';
import { getCategoryByIdentifierApi } from '../../services/categoryApi';

const CategoryProducts = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          getCategoryByIdentifierApi(slug),
          getProductsApi({ category: slug }),
        ]);

        if (catData.success) {
          setCategory(catData.category);
        }
        if (prodData.success) {
          setProducts(prodData.products || []);
        }
      } catch (error) {
        console.warn('[Category Products Fetch Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [slug]);

  return (
    <MainLayout>
      {/* Category Hero Banner */}
      <div className="relative bg-slate-900 text-white py-16 overflow-hidden">
        {category?.image?.url && (
          <img
            src={category.image.url}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-wider mb-2">
            <Link to="/shop" className="hover:underline">Shop</Link> &gt; <span>{category?.name || slug}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight capitalize">
            {category?.name || slug} Store
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
            {category?.description || `Explore our curated selection of high quality ${slug} items.`}
          </p>

          {/* Subcategory Pills */}
          {category?.subcategories?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.slug}
                  to={`/shop?category=${slug}&subcategory=${encodeURIComponent(sub.name)}`}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full transition"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <ProductGrid products={products} loading={loading} />
      </div>
    </MainLayout>
  );
};

export default CategoryProducts;
