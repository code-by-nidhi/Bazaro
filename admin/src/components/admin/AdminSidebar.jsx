import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Image,
  Star,
  Settings,
  ShoppingBasket,
  ArrowLeft,
  X,
} from 'lucide-react';

// The storefront is a separate app on its own origin.
const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Categories', path: '/categories', icon: Layers },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Customers', path: '/users', icon: Users },
  { label: 'Coupons', path: '/coupons', icon: Tag },
  { label: 'Banners', path: '/banners', icon: Image },
  { label: 'Reviews', path: '/reviews', icon: Star },
  { label: 'Store Settings', path: '/settings', icon: Settings },
];

const AdminSidebar = ({ isOpen = false, onClose = () => {} }) => {
  const location = useLocation();

  const sidebarContent = (
    <>
      {/* Admin Brand Header */}
      <div className="p-5 lg:p-6 border-b border-slate-800 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <ShoppingBasket size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-lg font-black text-white tracking-tight font-heading block leading-tight">
              BAZARO<span className="text-indigo-500">.</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest font-extrabold text-indigo-400 -mt-0.5">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Close button, drawer only */}
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 sm:px-4 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return to Customer Store */}
      <div className="p-4 border-t border-slate-800">
        <a
          href={STOREFRONT_URL}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
        >
          <ArrowLeft size={16} /> Return to Storefront
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Static sidebar on desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-slate-900 text-slate-300 min-h-screen flex-col border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Slide-in drawer on tablet & mobile */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
