import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react';

const PaymentFailed = () => {
  const location = useLocation();
  const error = location.state?.error || 'Payment process was interrupted or cancelled.';

  return (
    <MainLayout>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle size={48} />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">Payment Failed</span>
            <h1 className="text-2xl font-black text-slate-900 font-heading">Transaction Unsuccessful</h1>
            <p className="text-xs text-slate-500">{error}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/checkout"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Retry Payment
            </Link>
            <Link
              to="/cart"
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentFailed;
