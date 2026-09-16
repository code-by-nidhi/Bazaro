import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/currencyFormatter';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black font-heading">My Wishlist</h1>
          <p className="text-xs text-slate-400 mt-1">Saved favorite items ({wishlistItems.length})</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
            <Heart size={40} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">Save products while browsing to view them later.</p>
            <Link to="/shop" className="inline-block px-6 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 space-y-3 relative flex flex-col justify-between">
                <div>
                  <img src={product.images?.[0]?.url} alt={product.name} className="w-full h-44 object-cover rounded-xl bg-slate-50 mb-2" />
                  <span className="text-[10px] uppercase font-bold text-indigo-600">{product.brand}</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{product.name}</h4>
                  <span className="text-sm font-black text-slate-900 block mt-1">
                    {formatCurrency(product.discountPrice || product.price)}
                  </span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      addToCart(product, 1);
                      removeFromWishlist(product._id);
                    }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                  >
                    <ShoppingBag size={14} /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Wishlist;
