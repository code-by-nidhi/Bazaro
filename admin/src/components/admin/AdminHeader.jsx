import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ExternalLink, Menu, ChevronDown, LogOut, ShieldCheck } from 'lucide-react';

// The storefront is a separate app on its own origin.
const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173';

const AdminHeader = ({ title = 'Dashboard Overview', onOpenSidebar = () => {} }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-3 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        {/* Drawer toggle, hidden once the static sidebar appears */}
        <button
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="lg:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-lg transition shrink-0"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-extrabold text-slate-900 font-heading truncate">{title}</h1>
          <p className="hidden sm:block text-xs text-slate-500 mt-0.5 truncate">
            Welcome back, {user?.name || 'Administrator'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <a
          href={STOREFRONT_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold rounded-lg transition whitespace-nowrap"
        >
          View Live Store <ExternalLink size={14} />
        </a>

        {/* Account menu — the only way out of the portal */}
        <div className="relative sm:pl-4 sm:border-l border-slate-200" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Account menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-full hover:bg-slate-50 p-1 transition"
          >
            <img
              src={user?.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden md:block min-w-0 text-left">
              <span className="block text-xs font-bold text-slate-900 truncate max-w-[140px]">{user?.name}</span>
              <span className="block text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                {user?.email}
              </span>
            </div>
            <ChevronDown size={14} className="hidden md:block text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                  <ShieldCheck size={10} /> Administrator
                </span>
              </div>

              <a
                href={STOREFRONT_URL}
                target="_blank"
                rel="noreferrer"
                className="sm:hidden flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <ExternalLink size={16} /> View Live Store
              </a>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
