import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { validateFields } from '../../utils/validators';
import { showSuccess, showValidationErrors } from '../../utils/alerts';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateFields([
      { label: 'Full name', value: form.name, rule: 'personName', required: true },
      { label: 'Email address', value: form.email, rule: 'email', required: true },
      { label: 'Message', value: form.message, rule: 'message', required: true },
    ]);
    if (errors.length) return showValidationErrors(errors);

    setSubmitted(true);
    showSuccess('Message sent!', 'We will reply within 2 hours.');
  };

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-black font-heading">Get In Touch With Support</h1>
          <p className="text-xs text-slate-400 mt-1">Our support desk is active 24/7 to resolve order queries.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 font-heading">Contact Information</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Have questions regarding your order status, coupon codes, or merchant partnerships? Reach out to our executive support team.
          </p>

          <div className="space-y-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <MapPin size={18} />
              </div>
              <span>Suite 404, Tech Park, Indiranagar, Bengaluru, KA 560038</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Phone size={18} />
              </div>
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Mail size={18} />
              </div>
              <span>support@bazaro.com</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Send Us a Message</h3>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold">
              ✅ Thank you! Message sent successfully. We will reply within 2 hours.
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input required type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message</label>
                <textarea required rows="4" name="message" maxLength={1000} value={form.message} onChange={handleChange} placeholder="How can we help you?" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition flex items-center justify-center gap-2">
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
