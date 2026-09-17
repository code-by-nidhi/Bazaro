import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useAuth } from '../../hooks/useAuth';
import { Plus, Save } from 'lucide-react';
import { getAddressErrors } from '../../utils/validators';
import { showSuccess, showError, showValidationErrors, getErrorMessage } from '../../utils/alerts';

const AddressManagement = () => {
  const { user, saveAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [addressData, setAddressData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = getAddressErrors(addressData);
    if (errors.length) return showValidationErrors(errors);

    try {
      const data = await saveAddress(addressData);
      showSuccess('Address saved!', data?.message || 'Your delivery address has been added.');
      setShowForm(false);
      setAddressData({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false,
      });
    } catch (error) {
      showError('Could not save address', getErrorMessage(error, 'Failed to save address.'));
    }
  };

  return (
    <MainLayout>
      <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-heading">Address Management</h1>
            <p className="text-xs text-slate-400 mt-1">Manage delivery locations for fast checkout.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} /> Add Address
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        {showForm && (
          <form noValidate onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 text-xs font-semibold">
            <h3 className="text-base font-bold text-slate-900">Add New Delivery Address</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Full Name *</label>
                <input required type="text" value={addressData.fullName} onChange={(e) => setAddressData({ ...addressData, fullName: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Phone Number *</label>
                <input required type="tel" maxLength={14} value={addressData.phone} onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Street Address *</label>
              <input required type="text" placeholder="Flat/House No, Colony, Area" value={addressData.addressLine} onChange={(e) => setAddressData({ ...addressData, addressLine: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">City *</label>
                <input required type="text" value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">State *</label>
                <input required type="text" value={addressData.state} onChange={(e) => setAddressData({ ...addressData, state: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Pincode *</label>
                <input required type="text" inputMode="numeric" maxLength={6} value={addressData.pincode} onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-extrabold flex items-center gap-1.5"><Save size={16} /> Save Address</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.addresses?.map((addr, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl text-xs space-y-2 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900">{addr.fullName} ({addr.phone})</span>
                {addr.isDefault && <span className="bg-indigo-100 text-indigo-800 text-[10px] font-extrabold px-2 py-0.5 rounded">Default</span>}
              </div>
              <p className="text-slate-600">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default AddressManagement;
