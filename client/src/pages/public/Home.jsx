import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Play,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Flame,
  Award,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  ChevronRight,
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import ProductGrid from '../../components/product/ProductGrid';
import { getFeaturedSectionsApi } from '../../services/productApi';
import { getActiveBannersApi } from '../../services/bannerApi';
import { getCategoryIcon } from '../../constants/categories';
import { useProducts } from '../../hooks/useProducts';

const Home = () => {
  const [sections, setSections] = useState({
    featured: [],
    bestsellers: [],
    trending: [],
    newArrivals: [],
  });
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  // Admin-managed categories, so a newly added department appears here too.
  const { navCategories, loadingCategories } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const secData = await getFeaturedSectionsApi();
        if (secData.success) {
          setSections({
            featured: secData.featured || [],
            bestsellers: secData.bestsellers || [],
            trending: secData.trending || [],
            newArrivals: secData.newArrivals || [],
          });
        }
      } catch (error) {
        console.warn('[Home Fetch Warning]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <MainLayout>
      {/* Bold Fashion Editorial Hero (100vh Viewport Fit) */}
      <section className="bg-white py-4 md:py-6 lg:min-h-[calc(100vh-145px)] flex flex-col justify-center overflow-hidden border-b border-slate-100 relative">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="container mx-auto px-4 max-w-7xl flex flex-col justify-center flex-1"
        >
          {/* Top Row: Rotating Brand Badge + Headline + Customer Avatars */}
          <div className="relative flex items-start justify-center pt-1 pb-5 sm:pb-7">
            {/* Left Rotating Circular Badge */}
            <div className="hidden md:flex absolute left-0 top-0 items-center justify-center">
              <div className="relative w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                <svg
                  className="w-full h-full animate-spin"
                  style={{ animationDuration: '18s' }}
                  viewBox="0 0 100 100"
                >
                  <path
                    id="brandCirclePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-extrabold tracking-[0.18em] uppercase fill-slate-800">
                    <textPath href="#brandCirclePath">
                      • YOUR BRAND • STYLE SHOP
                    </textPath>
                  </text>
                </svg>
                <span className="absolute w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-md">
                  <Play size={12} className="fill-white ml-0.5" />
                </span>
              </div>
            </div>

            {/* Centered Editorial Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-black text-slate-950 tracking-tight font-heading leading-[1.08] text-center max-w-3xl">
              Elevate Your Style With <br className="hidden sm:block" />
              Bold Fashion
            </h1>

            {/* Right Customer Avatar Stack */}
            <div className="hidden md:flex absolute right-0 top-1 items-center -space-x-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                alt="Happy customer"
                loading="lazy"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white object-cover shadow-xs"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                alt="Happy customer"
                loading="lazy"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-white object-cover shadow-xs"
              />
              <Link
                to="/shop"
                aria-label="Browse the full shop"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-slate-950 border-2 border-white text-white flex items-center justify-center shadow-md hover:bg-slate-800 transition"
              >
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Staggered Editorial Card Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 items-start pb-6">
            {/* Column 1: Tall Card + Short Card */}
            <div className="space-y-3 lg:space-y-4 lg:mt-3">
              <Link to="/shop" className="block relative h-[220px] sm:h-[260px] lg:h-[300px] rounded-t-[28px] rounded-b-xl lg:rounded-t-[48px] overflow-hidden bg-[#f67a1d] group shadow-xs">
                <img
                  src="/images/orange-guy.png"
                  alt="Head-to-toe orange tracksuit and jacket streetwear look"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
              </Link>
              <Link to="/shop" className="block relative h-[104px] sm:h-[120px] lg:h-[136px] rounded-t-[20px] rounded-b-lg lg:rounded-t-[32px] overflow-hidden bg-[#f7b53b] group shadow-xs">
                <img
                  src="/images/yellow-guy.png"
                  alt="Printed teal shirt with pink cargo pants"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
              </Link>
            </div>

            {/* Column 2: Full-Height Card */}
            <Link to="/shop" className="block relative h-[300px] sm:h-[340px] lg:h-[400px] lg:mt-8 rounded-t-[28px] rounded-b-xl lg:rounded-t-[48px] overflow-hidden bg-[#8aac80] group shadow-xs">
              <img
                src="/images/green-girl.png"
                alt="Green double-breasted coat with matching wide-leg trousers"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </Link>

            {/* Column 3: Center Feature Card + Explore CTA */}
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center lg:mt-5">
              {/* Small Accent Mark */}
              <div className="hidden lg:flex mb-3 w-7 h-7 rounded-full border border-orange-400 items-center justify-center text-orange-500">
                <Sparkles size={13} strokeWidth={2.5} />
              </div>

              <div className="relative w-full">
                <Link to="/shop" className="block relative h-[240px] sm:h-[280px] lg:h-[336px] rounded-t-[28px] rounded-b-xl lg:rounded-t-[48px] overflow-hidden bg-[#ebab19] group shadow-sm">
                  <img
                    src="/images/yellow-hat-guy.png"
                    alt="Yellow wide-brim hat with mustard corduroy coat"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                  />
                </Link>

                {/* Overlapping Dark Pill CTA */}
                <Link
                  to="/shop"
                  className="absolute left-1/2 -translate-x-1/2 -bottom-5 inline-flex items-center gap-1.5 px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-[11px] sm:text-xs font-extrabold whitespace-nowrap shadow-lg shadow-slate-950/25 transition transform hover:-translate-y-0.5"
                >
                  <span>Explore Collections</span>
                  <ArrowUpRight size={14} strokeWidth={2.5} />
                </Link>
              </div>
            </div>

            {/* Column 4: Full-Height Card */}
            <Link to="/shop" className="hidden sm:block relative h-[300px] sm:h-[340px] lg:h-[400px] lg:mt-8 rounded-t-[28px] rounded-b-xl lg:rounded-t-[48px] overflow-hidden bg-[#6fb9d8] group shadow-xs">
              <img
                src="/images/blue-guy.png"
                alt="Powder blue denim jacket and joggers"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
              />
            </Link>

            {/* Column 5: Tall Card + Short Card */}
            <div className="hidden lg:block space-y-4">
              <Link to="/shop" className="block relative h-[300px] rounded-t-[48px] rounded-b-xl overflow-hidden bg-[#a9d19d] group shadow-xs">
                <img
                  src="/images/red-glass-girl.png"
                  alt="Red statement sunglasses with cream knit"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
              </Link>
              <Link to="/shop" className="block relative h-[136px] rounded-t-[32px] rounded-b-lg overflow-hidden bg-[#2c785d] group shadow-xs">
                <img
                  src="/images/green-guy.png"
                  alt="Green sweatshirt and joggers on emerald backdrop"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Category Grid Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">Curated Collections</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 font-heading">
                Shop By Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              View All Categories <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
              {navCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                return (
                  <Link
                    key={cat._id || cat.slug}
                    to={`/category/${cat.slug}`}
                    className="group bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-100 rounded-2xl p-4 text-center transition duration-300 flex flex-col items-center justify-center gap-2 shadow-2xs hover:shadow-lg hover:shadow-indigo-200"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 group-hover:bg-white/20 text-indigo-600 group-hover:text-white flex items-center justify-center transition">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-extrabold line-clamp-2 leading-tight">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1">
                <Flame size={16} className="fill-amber-500" /> Hot & Trending Now
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 font-heading">
                Popular Across Categories
              </h2>
            </div>
            <Link
              to="/shop?trending=true"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              See All Trending <ChevronRight size={16} />
            </Link>
          </div>

          <ProductGrid products={sections.trending} loading={loading} />
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-widest rounded-full">
              Limited Time Coupon
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-heading leading-tight">
              Get Extra 20% OFF Your First Purchase
            </h2>
            <p className="text-xs text-slate-300 max-w-md">
              Apply coupon code <strong className="text-amber-400 font-bold">BAZARO20</strong> at checkout to unlock instant discounts across every clothing collection.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition inline-flex items-center gap-2"
              >
                Claim Discount Code <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-end">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
              alt="Promo Banner"
              className="w-96 h-64 object-cover rounded-3xl shadow-2xl border-4 border-white/10 rotate-2"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1">
                <Sparkles size={16} className="text-indigo-600" /> Handpicked Quality
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 font-heading">
                Featured Product Collection
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View Featured <ChevronRight size={16} />
            </Link>
          </div>

          <ProductGrid products={sections.featured} loading={loading} />
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pink-600 flex items-center gap-1">
                <Award size={16} /> Customer Favorites
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 font-heading">
                Best Sellers Across Collections
              </h2>
            </div>
            <Link
              to="/shop?bestseller=true"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All Bestsellers <ChevronRight size={16} />
            </Link>
          </div>

          <ProductGrid products={sections.bestsellers} loading={loading} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <Mail size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-heading">
            Subscribe to Bazaro Insider
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Be the first to receive exclusive flash sale notifications, new category launches, and member-only coupons directly in your inbox.
          </p>

          {newsletterSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold">
              🎉 Thank you for subscribing! Check your inbox soon for exclusive deals.
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-md transition"
              >
                Subscribe Free
              </button>
            </form>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
