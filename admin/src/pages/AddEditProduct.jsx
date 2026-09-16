import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Loader from '../components/common/Loader';
import { createProductApi, updateProductApi, getProductByIdApi } from '../services/productApi';
import { getCategoriesApi } from '../services/categoryApi';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';

const AddEditProduct = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    sku: '',
    featured: false,
    bestseller: false,
    trending: false,
    newArrival: true,
    tags: '',
    imageUrl: '',
  });

  const [imagesFiles, setImagesFiles] = useState([]);
  const [sizesInput, setSizesInput] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [weightsInput, setWeightsInput] = useState('');
  const [specList, setSpecList] = useState([{ title: '', value: '' }]);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const catRes = await getCategoriesApi();
        if (catRes.success) setCategories(catRes.categories || []);

        if (isEdit) {
          const prodRes = await getProductByIdApi(id);
          if (prodRes.success && prodRes.product) {
            const p = prodRes.product;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              shortDescription: p.shortDescription || '',
              price: p.price || '',
              discountPrice: p.discountPrice || '',
              category: p.category?._id || p.category || '',
              subcategory: p.subcategory || '',
              brand: p.brand || '',
              stock: p.stock || 0,
              sku: p.sku || '',
              featured: !!p.featured,
              bestseller: !!p.bestseller,
              trending: !!p.trending,
              newArrival: !!p.newArrival,
              tags: p.tags?.join(', ') || '',
              imageUrl: p.images?.[0]?.url || '',
            });
            if (p.variants?.sizes) setSizesInput(p.variants.sizes.join(', '));
            if (p.variants?.colors) setColorsInput(p.variants.colors.join(', '));
            if (p.variants?.weights) setWeightsInput(p.variants.weights.join(', '));
            if (p.specifications?.length > 0) setSpecList(p.specifications);
          }
        }
      } catch (error) {
        console.warn('[AddEditProduct Init Error]:', error.message);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSpec = () => {
    setSpecList([...specList, { title: '', value: '' }]);
  };

  const handleRemoveSpec = (idx) => {
    setSpecList(specList.filter((_, i) => i !== idx));
  };

  const handleSpecChange = (idx, field, val) => {
    const updated = [...specList];
    updated[idx][field] = val;
    setSpecList(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      // Append variants
      const variantsObj = {
        sizes: sizesInput ? sizesInput.split(',').map((s) => s.trim()) : [],
        colors: colorsInput ? colorsInput.split(',').map((c) => c.trim()) : [],
        weights: weightsInput ? weightsInput.split(',').map((w) => w.trim()) : [],
      };
      data.append('variants', JSON.stringify(variantsObj));
      data.append('specifications', JSON.stringify(specList.filter((s) => s.title && s.value)));

      // Append images files
      if (imagesFiles.length > 0) {
        for (let i = 0; i < imagesFiles.length; i++) {
          data.append('images', imagesFiles[i]);
        }
      }

      let res;
      if (isEdit) {
        res = await updateProductApi(id, data);
      } else {
        res = await createProductApi(data);
      }

      if (res.success) {
        setMsg(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => navigate('/products'), 1000);
      }
    } catch (error) {
      setMsg(error.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout title="Product Form"><Loader fullScreen text="Loading product form..." /></AdminLayout>;

  const selectedCatObj = categories.find((c) => c._id === formData.category);

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 text-xs font-semibold">
        {msg && <p className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-2xl font-bold">{msg}</p>}

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading">Basic Product Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Product Title *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Brand Name *</label>
              <input required type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Category *</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Subcategory *</label>
              <select required name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="">Select Subcategory</option>
                {selectedCatObj?.subcategories?.map((sub) => (
                  <option key={sub.slug} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Short Description</label>
            <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>

          <div>
            <label className="block text-slate-700 mb-1">Full Detailed Description *</label>
            <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 mb-1">Original Price (₹) *</label>
              <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Discount Price (₹)</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Stock Count *</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">SKU Code *</label>
              <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl uppercase" />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading">Media & Images</h3>
          <div>
            <label className="block text-slate-700 mb-1">Upload Product Image Files (Cloudinary)</label>
            <input type="file" multiple onChange={(e) => setImagesFiles(e.target.files)} className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-slate-700 mb-1">Or Web Image URL (Fallback)</label>
            <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
        </div>

        {/* Variants & Specifications */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading">Variants & Specifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 mb-1">Sizes (Comma Separated)</label>
              <input type="text" placeholder="S, M, L, XL" value={sizesInput} onChange={(e) => setSizesInput(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Colors (Comma Separated)</label>
              <input type="text" placeholder="Black, Navy, White" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-700 mb-1">Weights / Pack (Comma Separated)</label>
              <input type="text" placeholder="500g, 1kg" value={weightsInput} onChange={(e) => setWeightsInput(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2">
            <Save size={18} /> {submitting ? 'Saving...' : 'Save Product Record'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddEditProduct;
