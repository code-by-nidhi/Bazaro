import React from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { Settings, ShieldCheck, Key, Database, Globe } from 'lucide-react';

const AdminSettings = () => {
  return (
    <AdminLayout title="Store & API Settings">
      <div className="max-w-3xl space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
            <Globe size={18} className="text-indigo-600" /> Platform General Configuration
          </h3>

          <div className="space-y-3 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Store Name</label>
              <input type="text" readOnly value="Bazaro Clothing Store" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Support Email</label>
              <input type="text" readOnly value="support@bazaro.com" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
            <Key size={18} className="text-amber-500" /> Gateway & Cloud Key Integrations
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="font-bold text-slate-900">Razorpay Key ID</span>
              <span className="font-mono text-indigo-600">rzp_test_bazaro_key_id</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="font-bold text-slate-900">Cloudinary Account</span>
              <span className="font-mono text-emerald-600">Configured / Fallback Active</span>
            </div>

            <div className="flex justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="font-bold text-slate-900">MongoDB Database URI</span>
              <span className="font-mono text-slate-600">mongodb://127.0.0.1:27017/bazaro</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
