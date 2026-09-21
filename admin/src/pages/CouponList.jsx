import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { getAllCouponsApi, createCouponApi, deleteCouponApi } from '../services/couponApi';
import { formatDate } from '../utils/currencyFormatter';
import { Plus, Trash2 } from 'lucide-react';
import { validateFields } from '../utils/validators';
import { showSuccess, showError, showValidationErrors, confirmAction, getErrorMessage } from '../utils/alerts';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minimumPurchase, setMinimumPurchase] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const fetchCoupons = async () => {
    try {
      const data = await getAllCouponsApi();
      if (data.success) setCoupons(data.coupons || []);
    } catch (error) {
      console.warn('[Coupons Fetch Warning]:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateFields([
      { label: 'Coupon code', value: code, rule: 'couponCode', required: true },
      { label: 'Discount type', value: discountType, rule: 'discountType', required: true },
      { label: 'Discount value', value: discountValue, rule: 'price', required: true },
      { label: 'Minimum purchase', value: minimumPurchase, rule: 'price' },
      { label: 'Expiry date', value: expiryDate, rule: 'date', required: true },
    ]);
    if (discountValue !== '' && Number(discountValue) <= 0) errors.push('Discount value must be greater than 0.');
    if (discountType === 'percentage' && Number(discountValue) > 100) {
      errors.push('Percentage discount cannot be more than 100%.');
    }
    if (expiryDate && expiryDate < new Date().toISOString().slice(0, 10)) {
      errors.push('Expiry date cannot be in the past.');
    }
    if (errors.length) return showValidationErrors(errors);

    try {
      const res = await createCouponApi({
        code: code.trim(),
        discountType,
        discountValue: Number(discountValue),
        minimumPurchase: minimumPurchase ? Number(minimumPurchase) : 0,
        expiryDate,
      });

      if (res.success) {
        showSuccess('Coupon created!', `Coupon '${code.trim()}' is now active.`);
        setShowModal(false);
        setCode('');
        setDiscountValue('');
        setMinimumPurchase('');
        setExpiryDate('');
        fetchCoupons();
      }
    } catch (error) {
      showError('Could not create coupon', getErrorMessage(error, 'Failed to create coupon.'));
    }
  };

  const handleDelete = async (id, couponCode) => {
    const confirmed = await confirmAction({
      title: `Delete coupon '${couponCode}'?`,
      text: 'Customers will no longer be able to use this code.',
      confirmButtonText: 'Yes, delete it',
    });
    if (!confirmed) return;
    try {
      const res = await deleteCouponApi(id);
      if (res.success) {
        showSuccess('Coupon deleted', `Coupon '${couponCode}' has been removed.`);
        fetchCoupons();
      }
    } catch (error) {
      showError('Delete failed', getErrorMessage(error, 'Delete failed.'));
    }
  };

  return (
    <AdminLayout title="Coupon Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-xs text-slate-500">Create promotional promo codes for discount offers.</p>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shrink-0"
          >
            <Plus size={16} /> Create Coupon
          </button>
        </div>

        {showModal && (
          <form noValidate onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-xs font-semibold max-w-md">
            <h3 className="text-base font-bold text-slate-900 font-heading">Add Promo Code</h3>

            <div>
              <label className="block text-slate-700 mb-1">Coupon Code *</label>
              <input required type="text" placeholder="e.g. BAZARO20" maxLength={15} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Discount Type *</label>
                <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Discount Value *</label>
                <input required type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Min Purchase (₹)</label>
                <input type="number" value={minimumPurchase} onChange={(e) => setMinimumPurchase(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-700 mb-1">Expiry Date *</label>
                <input required type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Save Coupon</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xs">
            <Loader text="Loading coupons..." />
          </div>
        ) : (
          <>
          {/* Table view — tablet & desktop */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
            <table className="w-full min-w-[720px] text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-extrabold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Min Purchase</th>
                  <th className="py-3.5 px-4">Used Count</th>
                  <th className="py-3.5 px-4">Expiry</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-black text-indigo-600">{c.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                    </td>
                    <td className="py-3 px-4 text-slate-600">₹{c.minimumPurchase}</td>
                    <td className="py-3 px-4 text-slate-600">{c.usedCount} times</td>
                    <td className="py-3 px-4 text-slate-600">{formatDate(c.expiryDate)}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDelete(c._id, c.code)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view — phones */}
          <div className="md:hidden space-y-3">
            {coupons.map((c) => (
              <div key={c._id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-indigo-600 truncate">{c.code}</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(c._id, c.code)} aria-label="Delete coupon" className="p-2 -mr-2 -mt-1 text-red-600 hover:bg-red-50 rounded-lg shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-slate-600">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Min</p>
                    <p>₹{c.minimumPurchase}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Used</p>
                    <p>{c.usedCount} times</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Expires</p>
                    <p>{formatDate(c.expiryDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default CouponList;
