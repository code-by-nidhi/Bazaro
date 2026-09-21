import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthField, PasswordField, authButtonClass } from './AuthShell';
import { validateFields } from '../../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../../utils/alerts';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields([
      { label: 'Username', value: formData.name, rule: 'personName', required: true },
      { label: 'Email address', value: formData.email, rule: 'email', required: true },
      { label: 'Password', value: formData.password, rule: 'password', required: true },
      { label: 'Confirm password', value: formData.confirmPassword, required: true },
    ]);
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.push('Passwords do not match.');
    }
    if (errors.length) return showValidationErrors(errors);

    setLoading(true);
    try {
      const data = await register({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      if (data.success) {
        showSuccess('Account created!', data.message || 'Welcome to Bazaro.');
        navigate('/');
      }
    } catch (error) {
      showError('Registration failed', getErrorMessage(error, 'Could not create your account.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 font-heading tracking-tight">Sign Up</h1>
      <p className="mt-1.5 text-sm text-slate-500">Let&rsquo;s create your account</p>

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-3">
        <AuthField
          label="Username"
          icon={User}
          type="text"
          name="name"
          autoComplete="name"
          placeholder="alex.johnson"
          value={formData.name}
          onChange={handleChange}
        />
        <AuthField
          label="Email"
          icon={Mail}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="alex@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordField
            label="Confirm"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <p className="px-1 text-[11px] text-slate-400">
          8-32 characters with uppercase, lowercase, number and special character.
        </p>

        <div className="pt-1">
          <button type="submit" disabled={loading} className={authButtonClass}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>
      </form>

      <p className="mt-5 text-xs text-center text-slate-400 leading-relaxed">
        By creating an account, you agree to our Terms and Conditions and Privacy Policy.
      </p>
      <p className="mt-2 text-sm text-center text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-slate-900 underline underline-offset-2 hover:text-orange-600">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
