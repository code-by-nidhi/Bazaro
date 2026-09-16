import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { Home, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <span className="text-7xl font-black text-indigo-600 font-heading">404</span>
        <h1 className="text-2xl font-extrabold text-slate-900">Oops! Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm">
          The page or product category you are trying to access does not exist or has been moved.
        </p>

        <div className="flex gap-3 pt-4">
          <Link
            to="/"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
          >
            <Home size={16} /> Return to Home
          </Link>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-2"
          >
            <ShoppingBag size={16} /> Browse Shop
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
