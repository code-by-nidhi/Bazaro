import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import confetti from 'canvas-confetti';
import { CheckCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/currencyFormatter';

const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Launch festive confetti animation
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <MainLayout>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle size={48} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Order Confirmed!</span>
            <h1 className="text-2xl font-black text-slate-900 font-heading">Thank You For Your Purchase</h1>
            <p className="text-xs text-slate-500">Your order has been placed and is currently being processed.</p>
          </div>

          {order && (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-semibold">Order ID</span>
                <span className="font-extrabold text-slate-900">#{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Payment Method</span>
                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Payment Status</span>
                <span className="font-extrabold text-emerald-600">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-indigo-600 text-sm font-black">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/my-orders"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Package size={16} /> View My Orders
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              Continue Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccess;
