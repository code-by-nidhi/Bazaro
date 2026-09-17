import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from '../services/categoryApi';
import { CATEGORY_ICON_OPTIONS, getCategoryIcon, DEFAULT_CATEGORY_ICON } from '../constants/categories';
import { Plus, Trash2, Pencil, Eye, EyeOff, Star, X } from 'lucide-react';
import { validateFields, PATTERNS, HINTS } from '../utils/validators';
import { showSuccess, showError, showValidationErrors, confirmAction, getErrorMessage } from '../utils/alerts';

const emptyForm = {
  name: '',
  description: '',
  subInput: '',
  imageUrl: '',
  icon: DEFAULT_CATEGORY_ICON,
  showInNavbar: true,
  featured: false,
  displayOrder: 0,
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const fetchCats = async () => {
    try {
      const data = await getCategoriesApi();
      if (data.success) setCategories(data.categories || []);
    } catch (error) {
      showError('Could not load categories', getErrorMessage(error, 'Failed to load categories.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      subInput: (cat.subcategories || []).map((s) => s.name).join(', '),
      imageUrl: cat.image?.url || '',
      icon: cat.icon || DEFAULT_CATEGORY_ICON,
      showInNavbar: cat.showInNavbar !== false,
      featured: !!cat.featured,
      displayOrder: cat.displayOrder ?? 0,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subs = form.subInput.split(',').map((s) => s.trim()).filter(Boolean);
    const errors = validateFields([
      { label: 'Category name', value: form.name, rule: 'categoryName', required: true },
      { label: 'Description', value: form.description, rule: 'shortText' },
      { label: 'Image URL', value: form.imageUrl, rule: 'url' },
      { label: 'Navbar position', value: form.displayOrder, rule: 'displayOrder' },
    ]);
    const badSub = subs.find((sub) => !PATTERNS.categoryName.test(sub));
    if (badSub) errors.push(`Subcategory '${badSub}' ${HINTS.categoryName}`);
    if (errors.length) return showValidationErrors(errors);

    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', form.name.trim());
      data.append('description', form.description.trim());
      data.append('subcategories', JSON.stringify(subs));
      data.append('icon', form.icon);
      data.append('showInNavbar', String(form.showInNavbar));
      data.append('featured', String(form.featured));
      data.append('displayOrder', String(Number(form.displayOrder) || 0));
      if (form.imageUrl.trim()) data.append('imageUrl', form.imageUrl.trim());

      const res = editingId
        ? await updateCategoryApi(editingId, data)
        : await createCategoryApi(data);

      if (res.success) {
        showSuccess(
          editingId ? 'Category updated!' : 'Category created!',
          editingId
            ? `'${form.name.trim()}' updated. The storefront navbar is up to date.`
            : `'${form.name.trim()}' created and added to the storefront navbar.`
        );
        closeModal();
        await fetchCats();
      }
    } catch (error) {
      showError('Could not save category', getErrorMessage(error, 'Failed to save category.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    const confirmed = await confirmAction({
      title: `Delete category '${catName}'?`,
      text: 'This cannot be undone.',
      confirmButtonText: 'Yes, delete it',
    });
    if (!confirmed) return;
    try {
      const res = await deleteCategoryApi(id);
      if (res.success) {
        showSuccess('Category deleted', `'${catName}' has been removed.`);
        await fetchCats();
      }
    } catch (error) {
      showError('Delete failed', getErrorMessage(error, 'Delete failed.'));
    }
  };

  // Toggle navbar visibility straight from the card without opening the form.
  const handleToggleNavbar = async (cat) => {
    try {
      const data = new FormData();
      data.append('showInNavbar', String(!(cat.showInNavbar !== false)));
      const res = await updateCategoryApi(cat._id, data);
      if (res.success) {
        showSuccess(
          'Navbar updated',
          `'${cat.name}' is now ${res.category.showInNavbar ? 'visible in' : 'hidden from'} the navbar.`
        );
        await fetchCats();
      }
    } catch (error) {
      showError('Update failed', getErrorMessage(error, 'Update failed.'));
    }
  };

  return (
    <AdminLayout title="Category Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="text-xs text-slate-500 max-w-xl">
            Categories added here appear automatically in the storefront navbar with their own{' '}
            <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">/category/:slug</code> page.
          </p>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shrink-0"
          >
            <Plus size={16} /> Create Category
          </button>
        </div>

        {/* Create / Edit Form */}
        {showModal && (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 text-xs font-semibold max-w-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {editingId ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button type="button" onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Category Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Footwear"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Navbar Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => setField('icon', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORY_ICON_OPTIONS.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="Shown on the category landing page"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Subcategories (Comma Separated)</label>
              <input
                type="text"
                placeholder="Sneakers, Sandals, Boots"
                value={form.subInput}
                onChange={(e) => setField('subInput', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setField('imageUrl', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Navbar Position</label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={form.displayOrder}
                  onChange={(e) => setField('displayOrder', e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] font-medium text-slate-400 mt-1">Lower numbers appear first.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={form.showInNavbar}
                  onChange={(e) => setField('showInNavbar', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                Show in storefront navbar
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setField('featured', e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                Featured department
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl transition"
              >
                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </form>
        )}

        {/* Category Cards */}
        {loading ? (
          <Loader text="Loading categories..." />
        ) : categories.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-10 text-center">
            <p className="text-sm font-bold text-slate-700">No categories yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Create your first department — it will show up in the storefront navbar right away.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              const visible = cat.showInNavbar !== false;
              return (
                <div
                  key={cat._id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={cat.image?.url}
                      alt={cat.name}
                      className="w-12 h-12 rounded-2xl object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                        <Icon size={14} className="text-indigo-600 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono truncate">/category/{cat.slug}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {visible ? 'In Navbar' : 'Hidden'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600">
                      Position {cat.displayOrder ?? 0}
                    </span>
                    {cat.featured && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Star size={9} className="fill-amber-500 text-amber-500" /> Featured
                      </span>
                    )}
                  </div>

                  {cat.subcategories?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {cat.subcategories.map((s) => (
                        <span
                          key={s.slug}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex justify-end gap-1">
                    <button
                      onClick={() => handleToggleNavbar(cat)}
                      title={visible ? 'Hide from navbar' : 'Show in navbar'}
                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                    >
                      {visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      onClick={() => openEdit(cat)}
                      title="Edit category"
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      title="Delete category"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CategoryList;
