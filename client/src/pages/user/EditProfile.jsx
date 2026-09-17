import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { Save } from 'lucide-react';
import { validateFields } from '../../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../../utils/alerts';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields([
      { label: 'Full name', value: name, rule: 'personName', required: true },
      { label: 'Phone number', value: phone, rule: 'phone' },
      { label: 'New password', value: password, rule: 'password' },
    ]);
    if (errors.length) return showValidationErrors(errors);

    setLoading(true);
    try {
      const payload = { name: name.trim(), phone: phone.trim() };
      if (password) payload.password = password;

      const data = await updateProfile(payload);
      if (data.success) {
        showSuccess('Profile updated!', data.message || 'Your changes have been saved.');
        navigate('/profile');
      }
    } catch (error) {
      showError('Update failed', getErrorMessage(error, 'Failed to update profile.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 font-heading">Edit Profile Details</h2>

          <form noValidate onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                maxLength={14}
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">New Password (Leave blank to keep unchanged)</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Save size={16} /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;
