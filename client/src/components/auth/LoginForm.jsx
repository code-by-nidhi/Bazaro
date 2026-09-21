import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthField, PasswordField, authButtonClass } from './AuthShell';
import { validateFields } from '../../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../../utils/alerts';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectMessage = location.state?.message;
  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields([
      { label: 'Email address', value: email, rule: 'email', required: true },
      { label: 'Password', value: password, required: true },
    ]);
    if (errors.length) return showValidationErrors(errors);

    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      if (data.success) {
        showSuccess('Welcome back!', data.message || 'Logged in successfully.');
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      showError('Login failed', getErrorMessage(error, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 font-heading tracking-tight">Log In</h1>
      <p className="mt-1.5 text-sm text-slate-500">Sign in to your orders, cart and wishlist</p>

      {/* Special Protected Checkout Notice Banner */}
      {redirectMessage && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-600 shrink-0" />
          <span>{redirectMessage}</span>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-3">
        <AuthField
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="user@bazaro.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end px-1">
          <Link to="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2">
            Forgot password?
          </Link>
        </div>

        <div className="pt-1">
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? 'Signing In...' : 'Log In'}
          </button>
        </div>
      </form>

      <p className="mt-5 text-sm text-center text-slate-500">
        Don&rsquo;t have an account?{' '}
        <Link to="/register" className="font-semibold text-slate-900 underline underline-offset-2 hover:text-orange-600">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
