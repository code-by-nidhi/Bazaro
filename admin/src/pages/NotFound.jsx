import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center font-sans">
    <span className="text-6xl font-black text-indigo-600 font-heading">404</span>
    <h1 className="mt-3 text-xl font-extrabold text-slate-900 font-heading">Page not found</h1>
    <p className="mt-1 text-sm text-slate-500 max-w-sm">
      That admin page does not exist. It may have been moved or renamed.
    </p>
    <Link
      to="/"
      className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
    >
      <LayoutDashboard size={16} /> Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
