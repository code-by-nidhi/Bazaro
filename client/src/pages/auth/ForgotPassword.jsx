import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <MainLayout>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-heading">Reset Password</h2>
            <p className="text-xs text-slate-500">Enter your email to receive password reset instructions.</p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center space-y-2">
              <p>✅ Instructions sent to {email}</p>
              <Link to="/login" className="inline-block text-indigo-600 underline text-xs">Return to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@bazaro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <p className="text-xs text-center text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
