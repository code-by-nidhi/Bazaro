import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { ShieldCheck, Truck, RotateCcw, Award, Users, ShoppingBag } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Our Story & Mission</span>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight">
            Redefining E-Commerce Commerce in India
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Bazaro was built to empower millions of shoppers with direct access to authentic organic groceries, designer fashion, luxury skincare, and flagship technology under one unified platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Uncompromising Quality</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every item in our 70+ product catalog undergoes rigorous batch verification and quality inspection prior to dispatch.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Truck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Nationwide Express Logistics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Partnered with top tier logistics providers to ensure 48-hour delivery across metro hubs in India.
            </p>
          </div>

          <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">Razorpay Protected Checkout</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cryptographically verified HMAC SHA256 payment processing ensuring zero unauthorized charges.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
