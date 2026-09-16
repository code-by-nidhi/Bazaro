import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { getAllCouponsApi, createCouponApi, deleteCouponApi } from '../services/couponApi';
import { formatDate } from '../utils/currencyFormatter';
import { Plus, Trash2, Tag } from 'lucide-react';

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
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
    try {
      const res = await createCouponApi({
        code,
        discountType,
        discountValue: Number(discountValue),
        minimumPurchase: minimumPurchase ? Number(minimumPurchase) : 0,
        expiryDate,
      });

      if (res.success) {
        setMsg(`Coupon '${code}' created!`);
        setShowModal(false);
        setCode('');
        setDiscountValue('');
        fetchCoupons();
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create coupon.');
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (!window.confirm(`Delete coupon '${couponCode}'?`)) return;
    try {
      const res = await deleteCouponApi(id);
      if (res.success) {
        setMsg(`Coupon '${couponCode}' deleted.`);
        fetchCoupons();
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <AdminLayout title="Coupon Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-xs text-slate-500">Create promotional promo codes for discount offers.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} /> Create Coupon
          </button>
        </div>

        {msg && <p className="p-3 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-xl">{msg}</p>}

        {showModal && (
          <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-xs font-semibold max-w-md">
            <h3 className="text-base font-bold text-slate-900 font-heading">Add Promo Code</h3>

            <div>
              <label className="block text-slate-700 mb-1">Coupon Code *</label>
              <input required type="text" placeholder="e.g. BAZARO20" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase" />
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

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Save Coupon</button>
            </div>
          </form>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
          {loading ? (
            <Loader text="Loading coupons..." />
          ) : (
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CouponList;
