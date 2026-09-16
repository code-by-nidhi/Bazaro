import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Copy, Check, ShoppingBag, Clock, Tag, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const FlashDealModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const couponCode = 'BAZARO20';

  // Live countdown timer state (hours:minutes:seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShopNow = () => {
    onClose();
    navigate('/shop');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl shadow-2xl border border-slate-800 text-white overflow-visible z-10 my-auto"
          >
            {/* Top-Right Red Circular Close Button (as shown in second image) */}
            <button
              onClick={onClose}
              aria-label="Close Flash Deal"
              className="absolute -top-3.5 -right-3.5 w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition transform hover:scale-110 active:scale-95 z-20 cursor-pointer"
            >
              <X size={18} strokeWidth={3} />
            </button>

            {/* Glowing Accent Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

            {/* Banner Header Art */}
            <div className="relative pt-8 px-6 text-center space-y-3">
              {/* Flash Deal Top Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white font-black text-[11px] uppercase tracking-widest rounded-full shadow-md animate-bounce">
                <Zap size={14} className="fill-yellow-300 text-yellow-300" />
                <span>FLASH DEAL WEEK SALE</span>
              </div>

              {/* Title & Headline */}
              <div className="space-y-1">
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-300 to-amber-300 font-heading uppercase drop-shadow-sm">
                  Save Up To 50%
                </h3>
                <p className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1">
                  <Sparkles size={14} className="text-amber-400" />
                  Exclusive Limited-Time Discounts
                  <Sparkles size={14} className="text-amber-400" />
                </p>
              </div>
            </div>

            {/* Body Content Card */}
            <div className="p-6 space-y-5">
              {/* Shipping Highlight Badge */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 text-center flex items-center justify-center gap-2">
                <Tag size={16} className="text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">
                  Free Express Shipping on Orders Over <span className="text-amber-400 font-black">₹999</span>
                </span>
              </div>

              {/* Promo Coupon Box */}
              <div className="bg-gradient-to-r from-red-950/60 via-slate-800 to-purple-950/60 border border-red-500/30 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Use Promo Coupon Code
                </div>

                <div className="flex items-center justify-between bg-slate-900/90 border border-slate-700 rounded-xl p-2.5 px-4">
                  <span className="font-mono font-black text-xl text-amber-400 tracking-wider">
                    {couponCode}
                  </span>

                  <button
                    onClick={handleCopyCode}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={14} /> COPIED!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> COPY CODE
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">Get instant 20% OFF extra at checkout</p>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 rounded-xl px-4 py-2 border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold text-slate-300">
                  <Clock size={14} className="text-red-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Offer Expires In:</span>
                </div>

                <div className="font-mono font-extrabold text-white flex items-center gap-1">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  :
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-400">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  :
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-red-400">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>

              {/* Call-to-action Button */}
              <button
                onClick={handleShopNow}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 hover:from-red-500 hover:to-pink-500 text-white text-sm font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag size={18} className="group-hover:scale-110 transition" />
                SHOP NOW & SAVE
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FlashDealModal;
