import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'How does Bazaro verify product pricing and order totals?',
    a: 'All order calculations, taxes, shipping fees, and coupon discounts are verified server-side on our Node.js backend directly against MongoDB records before payment links or order confirmations are issued.',
  },
  {
    q: 'What payment methods are supported on Bazaro?',
    a: 'We support Razorpay (UPI, Credit/Debit cards, Net Banking) and Cash on Delivery (COD) for eligible pincodes across India.',
  },
  {
    q: 'Can I cancel or return an item after delivery?',
    a: 'Yes, Bazaro provides a 7-Day Easy Return policy. You can initiate return requests directly from your My Orders dashboard.',
  },
  {
    q: 'How do I apply coupon codes during checkout?',
    a: 'On the Checkout order summary step, enter your coupon code (e.g. BAZARO20) and click Apply. The discount will instantly be applied after backend validation.',
  },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-black font-heading">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-400 mt-1">Everything you need to know about shopping on Bazaro.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-2xl space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <button
              onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
              className="w-full p-4 text-left flex items-center justify-between font-bold text-xs text-slate-900"
            >
              <span>{faq.q}</span>
              <ChevronDown size={18} className={`transition transform ${openIdx === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-50 pt-2 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default FAQ;
