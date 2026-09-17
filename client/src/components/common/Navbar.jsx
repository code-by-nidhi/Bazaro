import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldAlert,
  PackageCheck,
  Truck,
  Tag,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useProducts } from '../../hooks/useProducts';
import { getCategoryIcon } from '../../constants/categories';
import BrandLogo from './BrandLogo';
// The admin panel is a separate app on its own origin.
import { ADMIN_URL } from '../../config/urls';

// Primary navigation. "Categories" sits between these two groups and is rendered
// separately as a dropdown fed by the admin-managed category list.
const NAV_LINKS_BEFORE = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/shop?newArrival=true' },
  { label: 'Best Sellers', to: '/shop?bestseller=true' },
];

const NAV_LINKS_AFTER = [
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = ({ onOpenCart, onOpenFlashDeal }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistItems } = useWishlist();
  // Categories come from the database, so anything an admin adds shows up here.
  const { navCategories } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const userRef = useRef(null);
  const categoriesRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close the popovers on any outside tap (mouseleave never fires on touch).
  useEffect(() => {
    if (!userDropdownOpen && !categoriesOpen) return undefined;
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [userDropdownOpen, categoriesOpen]);

  // Never leave a menu hanging open after a route change.
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCategoriesOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Active when the path matches; /shop entries also have to match their filter flag.
  const isActive = (to) => {
    const [path, query] = to.split('?');
    if (query) return location.pathname === path && location.search.includes(query);
    if (path === '/') return location.pathname === '/';
    return location.pathname === path && !location.search;
  };

  const categoriesActive = location.pathname.startsWith('/category/');

  const navLinkClass = (active) =>
    `relative text-sm font-medium transition-colors whitespace-nowrap py-1 ${
      active ? 'text-orange-500' : 'text-slate-700 hover:text-orange-500'
    }`;

  const Underline = ({ show }) =>
    show ? (
      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
    ) : null;

  return (
    <header className="sticky top-0 z-40 bg-white">
      {/* ---------- Announcement Bar ---------- */}
      <div className="bg-slate-950 text-slate-200">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-2.5 text-[11px] sm:text-xs font-medium">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Truck size={14} className="text-slate-300 shrink-0" />
              Free Worldwide Shipping Over $50
            </span>

            <span className="hidden sm:block w-px h-3.5 bg-slate-700" aria-hidden="true" />

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 whitespace-nowrap hover:text-white transition"
            >
              <Tag size={14} className="text-orange-500 shrink-0" />
              Summer Sale Up To 70% Off
            </Link>

            <span className="hidden md:block w-px h-3.5 bg-slate-700" aria-hidden="true" />

            <button
              onClick={onOpenFlashDeal}
              className="hidden md:flex items-center gap-2 whitespace-nowrap hover:text-white transition cursor-pointer"
            >
              <Zap size={14} className="fill-orange-500 text-orange-500 shrink-0" />
              Limited Time Flash Deals
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Main Header ---------- */}
      <div className="border-b border-slate-100 shadow-xs bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between gap-4 h-16 sm:h-[72px]">
            {/* Left: hamburger + wordmark */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                className="lg:hidden p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/" aria-label="Bazaro home" className="flex items-center">
                <span className="sm:hidden">
                  <BrandLogo size="sm" tagline={null} />
                </span>
                <span className="hidden sm:inline-flex">
                  <BrandLogo size="md" />
                </span>
              </Link>
            </div>

            {/* Center: primary navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_LINKS_BEFORE.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link key={link.to} to={link.to} className={navLinkClass(active)}>
                    {link.label}
                    <Underline show={active} />
                  </Link>
                );
              })}

              {/* Categories dropdown — driven by the admin-managed category list */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  aria-expanded={categoriesOpen}
                  className={`${navLinkClass(categoriesActive)} flex items-center gap-1 cursor-pointer`}
                >
                  Categories
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${categoriesOpen ? 'rotate-180' : ''}`}
                  />
                  <Underline show={categoriesActive} />
                </button>

                {categoriesOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <Link
                      to="/shop"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-orange-50 hover:text-orange-600 transition"
                    >
                      All Products
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    {navCategories.map((cat) => {
                      const Icon = getCategoryIcon(cat.icon);
                      return (
                        <Link
                          key={cat._id || cat.slug}
                          to={`/category/${cat.slug}`}
                          className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition ${
                            location.pathname === `/category/${cat.slug}`
                              ? 'text-orange-600 bg-orange-50'
                              : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                        >
                          <Icon size={16} className="shrink-0" />
                          <span className="truncate">{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {NAV_LINKS_AFTER.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link key={link.to} to={link.to} className={navLinkClass(active)}>
                    {link.label}
                    <Underline show={active} />
                  </Link>
                );
              })}
            </nav>

            {/* Right: action icons */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                aria-expanded={searchOpen}
                className="p-2 rounded-full text-slate-800 hover:text-orange-500 hover:bg-slate-50 transition"
              >
                {searchOpen ? <X size={21} /> : <Search size={21} />}
              </button>

              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative hidden min-[360px]:flex p-2 rounded-full text-slate-800 hover:text-orange-500 hover:bg-slate-50 transition items-center justify-center"
              >
                <Heart size={21} />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Account */}
              <div className="relative" ref={userRef}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-label="Account menu"
                    className="p-2 rounded-full text-slate-800 hover:text-orange-500 hover:bg-slate-50 transition flex items-center"
                  >
                    <img
                      src={user.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80'}
                      alt={user.name}
                      className="w-[22px] h-[22px] rounded-full object-cover"
                    />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    aria-label="Log in"
                    className="p-2 rounded-full text-slate-800 hover:text-orange-500 hover:bg-slate-50 transition flex items-center"
                  >
                    <User size={21} />
                  </Link>
                )}

                {isAuthenticated && userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                          Admin Account
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <a
                        href={ADMIN_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition"
                      >
                        <ShieldAlert size={16} /> Admin Portal
                      </a>
                    )}

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <PackageCheck size={16} /> My Orders
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition text-left"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={onOpenCart}
                aria-label="Cart"
                className="relative p-2 rounded-full text-slate-800 hover:text-orange-500 hover:bg-slate-50 transition flex items-center justify-center"
              >
                <ShoppingCart size={21} />
                {totalItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Expanding Search Bar ---------- */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-white animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="container mx-auto max-w-7xl px-4 py-3">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search shirts, dresses, kurtas, jackets & more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-11 pr-24 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition"
                />
                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 sm:px-5 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-bold transition"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Mobile Drawer ---------- */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 shadow-lg px-4 py-4 space-y-4 max-h-[calc(100vh-7.5rem)] overflow-y-auto">
          <div className="space-y-0.5">
            {NAV_LINKS_BEFORE.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-sm font-semibold rounded-lg transition ${
                  isActive(link.to) ? 'text-orange-600 bg-orange-50' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-0.5 pt-3 border-t border-slate-100">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 py-1">
              Categories
            </p>
            {navCategories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <Link
                  key={cat._id || cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition ${
                    location.pathname === `/category/${cat.slug}`
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={16} className="text-orange-500 shrink-0" /> {cat.name}
                </Link>
              );
            })}
          </div>

          <div className="space-y-0.5 pt-3 border-t border-slate-100">
            {[
              ...NAV_LINKS_AFTER,
              { label: 'Wishlist', to: '/wishlist' },
              { label: 'My Orders', to: '/my-orders' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-2.5 border border-slate-200 text-slate-800 text-sm font-bold rounded-full"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
