import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { getActiveBannersApi, createBannerApi, deleteBannerApi } from '../services/adminApi';
import { Plus, Trash2, Image } from 'lucide-react';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('/shop');
  const [imageUrl, setImageUrl] = useState('');

  const fetchBanners = async () => {
    try {
      const data = await getActiveBannersApi();
      if (data.success) setBanners(data.banners || []);
    } catch (error) {
      console.warn('[Banner Fetch Warning]:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('subtitle', subtitle);
      data.append('link', link);
      if (imageUrl) data.append('imageUrl', imageUrl);

      const res = await createBannerApi(data);
      if (res.success) {
        setMsg(`Banner '${title}' created!`);
        setShowModal(false);
        setTitle('');
        setSubtitle('');
        fetchBanners();
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create banner.');
    }
  };

  const handleDelete = async (id, bannerTitle) => {
    if (!window.confirm(`Delete banner '${bannerTitle}'?`)) return;
    try {
      const res = await deleteBannerApi(id);
      if (res.success) {
        setMsg(`Banner '${bannerTitle}' deleted.`);
        fetchBanners();
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <AdminLayout title="Hero Slider & Banner Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-xs text-slate-500">Manage main homepage hero slider banners and promos.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} /> Add Hero Banner
          </button>
        </div>

        {msg && <p className="p-3 bg-indigo-50 text-indigo-800 text-xs font-bold rounded-xl">{msg}</p>}

        {showModal && (
          <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4 text-xs font-semibold max-w-lg">
            <h3 className="text-base font-bold text-slate-900 font-heading">Add Hero Slide Banner</h3>

            <div>
              <label className="block text-slate-700 mb-1">Banner Heading Title *</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Subtitle / Offer Description</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Target Link Path</label>
              <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Background Image URL (Cloudinary / Unsplash)</label>
              <input required type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl">Save Banner</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img src={b.image?.url} alt={b.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white space-y-1">
                  <h4 className="text-base font-bold font-heading">{b.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{b.subtitle}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="font-mono text-slate-400">Link: {b.link}</span>
                <button onClick={() => handleDelete(b._id, b.title)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BannerList;
