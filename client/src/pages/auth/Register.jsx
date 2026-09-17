import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, ShoppingBag } from 'lucide-react';
import { validateFields } from '../../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../../utils/alerts';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      { label: 'Full name', value: formData.name, rule: 'personName', required: true },
      { label: 'Email address', value: formData.email, rule: 'email', required: true },
      { label: 'Phone number', value: formData.phone, rule: 'phone' },
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
        phone: formData.phone.trim(),
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
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingBag size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-heading">Create Bazaro Account</h2>
            <p className="text-xs text-slate-500">Join thousands of happy shoppers across India.</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                name="name"
                placeholder="Alex Johnson"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                name="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 9876543210"
                maxLength={14}
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Password *</label>
              <p className="text-[10px] font-medium text-slate-400 mb-1">8-32 characters with uppercase, lowercase, number and special character.</p>
              <input
                type="password"
                required
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus size={16} /> {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <p className="text-xs text-center text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
