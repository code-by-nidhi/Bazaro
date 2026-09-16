import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Zap, Flame, Award, Sparkles } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatCurrency } from '../../utils/currencyFormatter';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const imgUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
  const effectivePrice = product.discountPrice || product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col relative">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${product.slug}`}>
          <img
            src={imgUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discountPercentage > 0 && (
            <span className="badge-sale px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.bestseller && (
            <span className="badge-featured px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Award size={10} /> Bestseller
            </span>
          )}
          {product.trending && (
            <span className="badge-trending px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1">
              <Flame size={10} /> Trending
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md shadow-md transition ${
            isWishlisted
              ? 'bg-pink-500 text-white'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-pink-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} className={isWishlisted ? 'fill-white' : ''} />
        </button>

        {/* Quick Actions Hover Bar */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={14} /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>{product.brand}</span>
            <span className="text-indigo-600">{product.category?.name || 'Store'}</span>
          </div>

          <Link to={`/product/${product.slug}`} className="block mt-1">
            <h3 className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-indigo-600 transition leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-50">
          <RatingStars rating={product.rating} reviewsCount={product.numberOfReviews} size={13} />

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-black text-slate-900 font-heading">
              {formatCurrency(effectivePrice)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xs font-medium text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
