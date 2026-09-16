import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/currencyFormatter';
import { createOrderApi, createRazorpayOrderApi, verifyRazorpayPaymentApi } from '../../services/orderApi';
import { ShieldCheck, MapPin, CreditCard, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

const Checkout = () => {
  const { cartItems, subtotal, discountAmount, taxPrice, shippingPrice, totalAmount, appliedCoupon, clearCart } = useCart();
  const { user, saveAddress } = useAuth();
  const navigate = useNavigate();

  // Address Selection State
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(user?.addresses?.length === 0);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState('Razorpay'); // 'Razorpay' or 'COD'
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeShippingAddress = showAddressForm
    ? newAddress
    : user?.addresses?.[selectedAddressIdx] || newAddress;

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    try {
      await saveAddress(newAddress);
      setShowAddressForm(false);
    } catch (error) {
      console.warn('[Save Address Warning]:', error.message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!activeShippingAddress.addressLine || !activeShippingAddress.pincode) {
      setErrorMessage('Please select or provide a valid shipping address.');
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant,
        })),
        shippingAddress: activeShippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || '',
      };

      if (paymentMethod === 'COD') {
        // Place COD Order directly
        const data = await createOrderApi(orderPayload);
        if (data.success && data.order) {
          clearCart();
          navigate('/payment-success', { state: { order: data.order } });
        }
      } else {
        // Razorpay Order Creation via Server-Side Verification
        const rzpData = await createRazorpayOrderApi(orderPayload);
        if (!rzpData.success) {
          throw new Error(rzpData.message || 'Failed to create Razorpay Order');
        }

        const options = {
          key: rzpData.key,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: 'Bazaro Clothing Store',
          description: `Order Payment #${rzpData.dbOrderId.slice(-6)}`,
          order_id: rzpData.razorpayOrderId,
          handler: async (response) => {
            try {
              const verifyRes = await verifyRazorpayPaymentApi({
                dbOrderId: rzpData.dbOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                clearCart();
                navigate('/payment-success', { state: { order: verifyRes.order } });
              }
            } catch (err) {
              setErrorMessage(err.response?.data?.message || 'Payment verification failed.');
              navigate('/payment-failed', { state: { error: err.message } });
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: activeShippingAddress.phone || user?.phone,
          },
          theme: {
            color: '#4f46e5',
          },
        };

        // Open Razorpay SDK
        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            navigate('/payment-failed', { state: { error: response.error.description } });
          });
          rzp.open();
        } else {
          // Fallback verify for mock server order in dev mode
          const verifyRes = await verifyRazorpayPaymentApi({
            dbOrderId: rzpData.dbOrderId,
            razorpayOrderId: rzpData.razorpayOrderId,
            razorpayPaymentId: `pay_mock_${Date.now()}`,
            razorpaySignature: 'mock_signature',
          });
          if (verifyRes.success) {
            clearCart();
            navigate('/payment-success', { state: { order: verifyRes.order } });
          }
        }
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Checkout failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-8 border-b border-slate-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-black font-heading">Secure Checkout</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <strong className="text-white">{user?.email}</strong>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold mb-6">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Checkout Steps Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Customer Information */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600">
                <CheckCircle2 size={20} />
                <h3 className="text-sm font-bold text-slate-900">Step 1: Customer Account Verified</h3>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{user?.name}</p>
                  <p>{user?.email} | {user?.phone || 'No phone provided'}</p>
                </div>
                <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                  Authenticated
                </span>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <MapPin size={20} />
                <h3 className="text-sm font-bold text-slate-900">Step 2: Shipping Address</h3>
              </div>

              {/* Saved Addresses List */}
              {user?.addresses?.length > 0 && !showAddressForm && (
                <div className="space-y-3">
                  {user.addresses.map((addr, idx) => (
                    <label
                      key={idx}
                      className={`block p-4 border rounded-2xl cursor-pointer transition ${
                        selectedAddressIdx === idx
                          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping_address"
                          checked={selectedAddressIdx === idx}
                          onChange={() => setSelectedAddressIdx(idx)}
                          className="mt-1 text-indigo-600"
                        />
                        <div className="text-xs text-slate-700 space-y-1">
                          <p className="font-bold text-slate-900">{addr.fullName} ({addr.phone})</p>
                          <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          {addr.landmark && <p className="text-slate-400">Landmark: {addr.landmark}</p>}
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    + Add New Delivery Address
                  </button>
                </div>
              )}

              {/* Add New Address Form */}
              {showAddressForm && (
                <form onSubmit={handleSaveNewAddress} className="space-y-3 text-xs font-semibold pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Address Line *</label>
                    <input
                      type="text"
                      required
                      placeholder="House/Flat No, Street, Colony"
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                    >
                      Save Address
                    </button>
                    {user?.addresses?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <CreditCard size={20} />
                <h3 className="text-sm font-bold text-slate-900">Step 3: Select Payment Method</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 border rounded-2xl cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === 'Razorpay'
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    value="Razorpay"
                    checked={paymentMethod === 'Razorpay'}
                    onChange={() => setPaymentMethod('Razorpay')}
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Razorpay Online Payment</span>
                    <span className="block text-[11px] text-slate-500">UPI, Credit/Debit Cards, NetBanking</span>
                  </div>
                </label>

                <label
                  className={`p-4 border rounded-2xl cursor-pointer transition flex items-center gap-3 ${
                    paymentMethod === 'COD'
                      ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Cash on Delivery (COD)</span>
                    <span className="block text-[11px] text-slate-500">Pay cash upon item arrival</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items Summary & Pay Button */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              Order Items ({cartItems.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatCurrency(taxPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? 'FREE' : formatCurrency(shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200 font-heading">
                <span>Total Payable</span>
                <span className="text-indigo-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={processing || cartItems.length === 0}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-indigo-200 transition flex items-center justify-center gap-2"
            >
              {processing
                ? 'Processing Order...'
                : paymentMethod === 'Razorpay'
                ? `Pay ${formatCurrency(totalAmount)} via Razorpay`
                : `Confirm COD Order (${formatCurrency(totalAmount)})`}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>HMAC SHA256 Verified Payment Security</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
