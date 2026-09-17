import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { useProducts } from '../../hooks/useProducts';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';

const Footer = () => {
  // Mirror the admin-managed navbar categories in the footer's shop links.
  const { navCategories } = useProducts();
  const footerCategories = navCategories.slice(0, 5);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* Value Pillars */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Free Express Shipping</h4>
            <p className="text-xs text-slate-400 mt-1">On all orders over ₹999 across India.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-pink-600/20 text-pink-400 rounded-2xl">
            <RotateCcw size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">7-Day Easy Returns</h4>
            <p className="text-xs text-slate-400 mt-1">Hassle-free replacement & refunds.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">100% Secure Payments</h4>
            <p className="text-xs text-slate-400 mt-1">Razorpay HMAC SHA256 verified security.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl">
            <Headphones size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">24/7 Dedicated Support</h4>
            <p className="text-xs text-slate-400 mt-1">Chat or call with customer support anytime.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Overview */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" aria-label="Bazaro home" className="inline-flex">
            <BrandLogo size="md" tone="light" />
          </Link>
          <p className="text-xs leading-relaxed text-slate-400 pr-6">
            Bazaro is India's dedicated clothing destination — tailored menswear, everyday womenswear, kids' essentials, handcrafted ethnic wear, winter layers and activewear, delivered nationwide.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-full transition">
              <Instagram size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-full transition">
              <Twitter size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-full transition">
              <Facebook size={16} />
            </a>
            <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white rounded-full transition">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/shop" className="hover:text-indigo-400 transition">All Products</Link></li>
            {footerCategories.map((cat) => (
              <li key={cat._id || cat.slug}>
                <Link to={`/category/${cat.slug}`} className="hover:text-indigo-400 transition">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/profile" className="hover:text-indigo-400 transition">My Account</Link></li>
            <li><Link to="/my-orders" className="hover:text-indigo-400 transition">Track Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-indigo-400 transition">My Wishlist</Link></li>
            <li><Link to="/faq" className="hover:text-indigo-400 transition">FAQs & Help</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400 transition">Support Desk</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Corporate Office</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-start gap-2.5 min-w-0">
              <MapPin size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <span className="break-words">Suite 404, Tech Park, Indiranagar, Bengaluru, KA 560038</span>
            </li>
            <li className="flex items-center gap-2.5 min-w-0">
              <Phone size={16} className="text-indigo-400 shrink-0" />
              <span className="break-words">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2.5 min-w-0">
              <Mail size={16} className="text-indigo-400 shrink-0" />
              <span className="break-all">support@bazaro.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Copyright */}
      <div className="container mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Bazaro E-Commerce Inc. All rights reserved. Built with MERN Stack.</p>

        <div className="flex items-center gap-4">
          <span className="bg-slate-800 px-3 py-1 rounded text-slate-400 font-semibold">Razorpay Verified</span>
          <span className="bg-slate-800 px-3 py-1 rounded text-slate-400 font-semibold">SSL 256-bit Encrypted</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
