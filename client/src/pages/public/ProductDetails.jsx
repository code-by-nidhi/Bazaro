import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import RatingStars from '../../components/common/RatingStars';
import ProductGrid from '../../components/product/ProductGrid';
import Loader from '../../components/common/Loader';
import { getProductBySlugApi } from '../../services/productApi';
import { getProductReviewsApi, addReviewApi } from '../../services/reviewApi';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/currencyFormatter';
import { validateFields } from '../../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../../utils/alerts';
import {
  ShoppingBag,
  Heart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle,
  Star,
  Plus,
  Minus,
} from 'lucide-react';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Variant States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Active Tab
  const [activeTab, setActiveTab] = useState('description');

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await getProductBySlugApi(slug);
        if (data.success && data.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);

          // Preselect first variants if available
          if (data.product.variants?.sizes?.length > 0) setSelectedSize(data.product.variants.sizes[0]);
          if (data.product.variants?.colors?.length > 0) setSelectedColor(data.product.variants.colors[0]);
          if (data.product.variants?.weights?.length > 0) setSelectedWeight(data.product.variants.weights[0]);

          // Fetch reviews
          const revData = await getProductReviewsApi(data.product._id);
          if (revData.success) {
            setReviews(revData.reviews || []);
          }
        }
      } catch (error) {
        console.warn('[Product Details Fetch Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [slug]);

  if (loading) return <MainLayout><Loader fullScreen text="Loading product details..." /></MainLayout>;
  if (!product) return <MainLayout><div className="text-center py-20 font-bold text-slate-700">Product not found.</div></MainLayout>;

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' }];

  const activeImage = images[activeImageIdx]?.url || images[0].url;
  const isWishlisted = isInWishlist(product._id);
  const effectivePrice = product.discountPrice || product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      size: selectedSize,
      color: selectedColor,
      weight: selectedWeight,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout', message: 'You need to login before placing an order.' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${slug}`, message: 'Please login to post a review.' } });
      return;
    }
    const errors = validateFields([
      { label: 'Rating', value: newRating, rule: 'rating', required: true },
      { label: 'Comment', value: newComment, rule: 'reviewComment', required: true },
    ]);
    if (errors.length) return showValidationErrors(errors);

    setReviewSubmitting(true);
    try {
      const data = await addReviewApi({
        productId: product._id,
        rating: newRating,
        comment: newComment.trim(),
      });
      if (data.success) {
        showSuccess('Thank you!', data.message || 'Your review has been submitted.');
        setReviews([data.review, ...reviews]);
        setNewComment('');
      }
    } catch (error) {
      showError('Review not submitted', getErrorMessage(error, 'Failed to submit review.'));
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <MainLayout>
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-100 py-3 border-b border-slate-200">
        <div className="container mx-auto px-4 text-xs font-semibold text-slate-600 flex items-center gap-2">
          <Link to="/" className="hover:text-indigo-600">Home</Link> &gt;
          <Link to="/shop" className="hover:text-indigo-600">Shop</Link> &gt;
          <Link to={`/category/${product.category?.slug}`} className="hover:text-indigo-600">{product.category?.name}</Link> &gt;
          <span className="text-slate-900 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery Slider */}
          <div className="space-y-4">
            <div className="aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />

              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 badge-sale px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                  SAVE {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-white transition shrink-0 ${
                      activeImageIdx === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">{product.brand}</span>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 font-heading leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mt-3">
                <RatingStars rating={product.rating} reviewsCount={product.numberOfReviews} size={16} />
                <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                {product.stock > 0 ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={12} /> In Stock ({product.stock} left)
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 font-heading">
                {formatCurrency(effectivePrice)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-sm text-slate-400 line-through">{formatCurrency(product.price)}</span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                    You Save {formatCurrency(product.price - effectivePrice)}
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.shortDescription || product.description?.slice(0, 160) + '...'}
            </p>

            {/* Variants Selectors */}
            {product.variants?.sizes?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                        selectedSize === size
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants?.colors?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                        selectedColor === color
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variants?.weights?.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Select Weight / Pack</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition ${
                        selectedWeight === w
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quantity</label>
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-slate-600 hover:bg-white rounded-lg transition"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-xs font-extrabold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1 text-slate-600 hover:bg-white rounded-lg transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Add to Shopping Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Zap size={18} className="text-amber-400" /> Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-center ${
                  isWishlisted
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Wishlist"
              >
                <Heart size={20} className={isWishlisted ? 'fill-white' : ''} />
              </button>
            </div>

            {/* Guarantees Box */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <Truck size={18} className="mx-auto text-indigo-600" />
                <span className="block text-[10px] font-bold text-slate-800">Fast Express Shipping</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <RotateCcw size={18} className="mx-auto text-pink-600" />
                <span className="block text-[10px] font-bold text-slate-800">7-Day Easy Returns</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <ShieldCheck size={18} className="mx-auto text-emerald-600" />
                <span className="block text-[10px] font-bold text-slate-800">Verified Original</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs Section */}
        <div className="mt-16 bg-white border border-slate-200 rounded-3xl p-6 md:p-8">
          <div className="flex border-b border-slate-200 gap-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold transition border-b-2 ${
                activeTab === 'description' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Detailed Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`pb-4 text-sm font-bold transition border-b-2 ${
                activeTab === 'specifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Specifications ({product.specifications?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold transition border-b-2 ${
                activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Verified Reviews ({reviews.length})
            </button>
          </div>

          <div className="pt-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-xl">
                {product.specifications?.length > 0 ? (
                  <table className="w-full text-xs text-left border-collapse">
                    <tbody>
                      {product.specifications.map((spec, idx) => (
                        <tr key={idx} className="border-b border-slate-100 odd:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-800 w-1/3">{spec.title}</td>
                          <td className="py-2.5 px-4 text-slate-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-xs text-slate-500">No additional specifications listed.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Submit Review Box */}
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl max-w-xl space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Write a Customer Review</h4>

                  <form noValidate onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
                      <div className="flex gap-1 text-amber-400 cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            onClick={() => setNewRating(star)}
                            className={star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Comment</label>
                      <textarea
                        required
                        rows="3"
                        maxLength={500}
                        placeholder="Write your honest thoughts about this product (10-500 characters)..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-500">No reviews yet. Be the first to review this product!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={rev.user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
                              alt={rev.user?.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-slate-900">{rev.user?.name || 'Verified Buyer'}</span>
                          </div>
                          <RatingStars rating={rev.rating} showNumber={false} size={14} />
                        </div>
                        <p className="text-xs text-slate-700">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-xl font-black text-slate-900 font-heading">You May Also Like</h3>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetails;
