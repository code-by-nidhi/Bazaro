import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { getActiveBannersApi, createBannerApi, deleteBannerApi } from '../services/adminApi';
import { Plus, Trash2 } from 'lucide-react';
import { validateFields } from '../utils/validators';
import { showSuccess, showError, showValidationErrors, confirmAction, getErrorMessage } from '../utils/alerts';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const errors = validateFields([
      { label: 'Banner title', value: title, rule: 'bannerTitle', required: true },
      { label: 'Subtitle', value: subtitle, rule: 'shortText' },
      { label: 'Target link', value: link, rule: 'linkPath' },
      { label: 'Background image URL', value: imageUrl, rule: 'url', required: true },
    ]);
    if (errors.length) return showValidationErrors(errors);

    try {
      const data = new FormData();
      data.append('title', title.trim());
      data.append('subtitle', subtitle.trim());
      data.append('link', link.trim());
      data.append('imageUrl', imageUrl.trim());

      const res = await createBannerApi(data);
      if (res.success) {
        showSuccess('Banner created!', `'${title.trim()}' is now live on the homepage.`);
        setShowModal(false);
        setTitle('');
        setSubtitle('');
        setImageUrl('');
        fetchBanners();
      }
    } catch (error) {
      showError('Could not create banner', getErrorMessage(error, 'Failed to create banner.'));
    }
  };

  const handleDelete = async (id, bannerTitle) => {
    const confirmed = await confirmAction({
      title: `Delete banner '${bannerTitle}'?`,
      text: 'It will be removed from the homepage slider.',
      confirmButtonText: 'Yes, delete it',
    });
    if (!confirmed) return;
    try {
      const res = await deleteBannerApi(id);
      if (res.success) {
        showSuccess('Banner deleted', `'${bannerTitle}' has been removed.`);
        fetchBanners();
      }
    } catch (error) {
      showError('Delete failed', getErrorMessage(error, 'Delete failed.'));
    }
  };

  return (
    <AdminLayout title="Hero Slider & Banner Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-xs text-slate-500">Manage main homepage hero slider banners and promos.</p>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shrink-0"
          >
            <Plus size={16} /> Add Hero Banner
          </button>
        </div>

        {showModal && (
          <form noValidate onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-xs font-semibold max-w-lg">
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

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Save Banner</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {banners.map((b) => (
            <div key={b._id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="h-44 relative overflow-hidden bg-slate-900">
                <img src={b.image?.url} alt={b.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end text-white space-y-1">
                  <h4 className="text-base font-bold font-heading line-clamp-2">{b.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{b.subtitle}</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between gap-2 border-t border-slate-100 text-xs">
                <span className="font-mono text-slate-400 truncate min-w-0">Link: {b.link}</span>
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
