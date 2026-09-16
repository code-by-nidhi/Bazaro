import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/currencyFormatter';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    taxPrice,
    shippingPrice,
    totalAmount,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput) return;
    setApplying(true);
    await applyCoupon(couponCodeInput);
    setApplying(false);
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout', message: 'You need to login before placing an order.' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black font-heading">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1">Review your selected products, apply coupons, and proceed to checkout.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">Your Cart is Currently Empty</h3>
            <p className="text-xs text-slate-500">Discover our latest clothing collections and find your fit.</p>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
            >
              Start Shopping Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items Table */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const imgUrl = item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                return (
                  <div
                    key={`${item.product._id}_${item.variantKey}`}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={imgUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div>
                        <Link to={`/product/${item.product.slug}`} className="text-xs font-bold text-slate-900 hover:text-indigo-600">
                          {item.product.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{item.product.brand}</p>
                        <span className="text-xs font-extrabold text-indigo-600 block mt-1">
                          {formatCurrency(item.product.discountPrice || item.product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      {/* Quantity selector */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.variantKey, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:bg-white rounded-lg transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.variantKey, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:bg-white rounded-lg transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="text-sm font-black text-slate-900 font-heading">
                        {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product._id, item.variantKey)}
                        className="p-2 text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary & Coupon Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Tag size={14} className="text-indigo-600" /> Apply Promo Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                    <span>Code: {appliedCoupon.code} Applied</span>
                    <button onClick={removeCoupon} className="text-red-600 text-xs hover:underline font-bold">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BAZARO20"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                    >
                      {applying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] font-bold text-red-600">{couponError}</p>}
              </div>

              {/* Calculation Table */}
              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(taxPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-slate-900">
                    {shippingPrice === 0 ? <strong className="text-emerald-600">FREE</strong> : formatCurrency(shippingPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-200 font-heading">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
