import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/currencyFormatter';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, subtotal, totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    onClose();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout', message: 'You need to login before placing an order.' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-indigo-600" size={20} />
              <h3 className="text-base font-bold text-slate-900">Your Shopping Cart</h3>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <ShoppingBag size={40} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Looks like you haven't added anything yet. Explore our latest clothing collection!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full shadow-md transition"
                >
                  Start Shopping Now
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const imgUrl = item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                return (
                  <div
                    key={`${item.product._id}_${item.variantKey}`}
                    className="flex gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl relative"
                  >
                    <img
                      src={imgUrl}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-white border border-slate-200"
                    />

                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.name}</h4>
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{item.product.brand}</p>

                      {/* Variant tags */}
                      {item.selectedVariant && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.selectedVariant.size && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                              Size: {item.selectedVariant.size}
                            </span>
                          )}
                          {item.selectedVariant.color && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                              Color: {item.selectedVariant.color}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-indigo-600">
                          {formatCurrency(item.product.discountPrice || item.product.price)}
                        </span>

                        {/* Quantity selector */}
                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.variantKey, item.quantity - 1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.variantKey, item.quantity + 1)}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id, item.variantKey)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                <span>Estimated Total</span>
                <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium pt-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Verified 256-bit Secure Razorpay Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
