import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';
import { getProductsApi, deleteProductApi } from '../services/productApi';
import { formatCurrency } from '../utils/currencyFormatter';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProductsApi({ search, page, limit: 10 });
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.warn('[Admin Product List Error]:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete product '${name}'?`)) return;
    try {
      const res = await deleteProductApi(id);
      if (res.success) {
        setMsg(`Product '${name}' deleted successfully!`);
        fetchProducts();
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to delete product.');
    }
  };

  return (
    <AdminLayout title="Product Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          </div>

          <Link
            to="/products/add"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-200"
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>

        {msg && <p className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold rounded-xl">{msg}</p>}

        <div className="bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
          {loading ? (
            <Loader text="Loading products..." />
          ) : (
            <table className="w-full min-w-[820px] text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={prod.images?.[0]?.url} alt={prod.name} className="w-10 h-10 object-cover rounded-xl bg-slate-100 border border-slate-200" />
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                        <p className="text-[10px] text-slate-400">{prod.brand}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{prod.sku}</td>
                    <td className="py-3 px-4 text-slate-700">{prod.category?.name || 'General'}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{formatCurrency(prod.discountPrice || prod.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        prod.stock > 5 ? 'bg-emerald-100 text-emerald-800' : prod.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {prod.stock > 0 ? `${prod.stock} In Stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link to={`/products/edit/${prod._id}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg inline-block">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(prod._id, prod.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>
    </AdminLayout>
  );
};

export default ProductList;
