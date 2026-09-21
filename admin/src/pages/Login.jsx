import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import BrandLogo from '../components/common/BrandLogo';
import { validateFields } from '../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../utils/alerts';
import { STOREFRONT_URL } from '../config/urls';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send the admin back to whatever page bounced them here.
  const redirectTo = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields([
      { label: 'Admin email', value: email, rule: 'email', required: true },
      { label: 'Password', value: password, required: true },
    ]);
    if (errors.length) return showValidationErrors(errors);

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      if (data.success) {
        showSuccess('Welcome back!', 'Signed in to the admin portal.');
        navigate(redirectTo, { replace: true });
      } else {
        showError('Access denied', data.message || 'Invalid admin credentials.');
      }
    } catch (error) {
      showError('Login failed', getErrorMessage(error, 'Invalid admin credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[36rem] max-w-full h-64 bg-indigo-600/20 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <h1 className="flex justify-center">
            <span className="sr-only">Bazaro Admin Portal</span>
            <BrandLogo size="md" tone="light" tagline="Admin Portal" />
          </h1>
          <p className="text-xs text-slate-400">Restricted area — administrator sign in</p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label htmlFor="admin-email" className="block text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="username"
                placeholder="admin@bazaro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <LogIn size={17} />
            {loading ? 'Verifying...' : 'Sign In To Portal'}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 leading-relaxed border-t border-slate-800 pt-4">
          Customer accounts cannot sign in here.
          <br />
          Looking for the shop?{' '}
          <a
            href={STOREFRONT_URL}
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
          >
            Go to the storefront
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
