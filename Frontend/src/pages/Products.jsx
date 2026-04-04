import React, { useEffect, useState, useRef } from 'react';
import { productApi, catalogApi, fileUrl } from '../services/api';
import { Package, Plus, Search, Edit2, Trash2, X, Save, Loader2, Upload, Tag, ChevronDown } from 'lucide-react';

const emptyProduct = {
  productTitle: '', productUrl: '', productPrice: '', productPspPrice: '',
  productDesc: '', productFeatures: '', productKeywords: '', productLabel: 'new',
  status: 'active', catId: '', pCatId: '', manufacturerId: '',
};

const LABELS = ['new', 'hot', 'sale', ''];
const STATUSES = ['active', 'inactive'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data: {} }
  const [saving, setSaving] = useState(false);
  const [imgPreviews, setImgPreviews] = useState({ img1: null, img2: null, img3: null });
  const [imgFiles, setImgFiles] = useState({ img1: null, img2: null, img3: null });
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, cRes, mRes] = await Promise.all([
        productApi.getProducts(0, 100),
        catalogApi.getCategories(),
        catalogApi.getManufacturers(),
      ]);
      const prods = pRes.data?.data?.content || pRes.data?.data || [];
      setProducts(prods);
      setFiltered(prods);
      setCategories(cRes.data?.data || []);
      setManufacturers(mRes.data?.data || []);
    } catch { showToast('Failed to load products', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.productTitle?.toLowerCase().includes(q) ||
      p.catTitle?.toLowerCase().includes(q) ||
      p.productLabel?.toLowerCase().includes(q)
    ));
  }, [search, products]);

  const openCreate = () => {
    setModal({ mode: 'create', data: { ...emptyProduct } });
    setImgPreviews({ img1: null, img2: null, img3: null });
    setImgFiles({ img1: null, img2: null, img3: null });
  };

  const openEdit = (p) => {
    setModal({ mode: 'edit', data: { ...p } });
    setImgPreviews({
      img1: p.productImg1 ? fileUrl(p.productImg1) : null,
      img2: p.productImg2 ? fileUrl(p.productImg2) : null,
      img3: p.productImg3 ? fileUrl(p.productImg3) : null,
    });
    setImgFiles({ img1: null, img2: null, img3: null });
  };

  const handleImgChange = (key, file) => {
    if (!file) return;
    setImgFiles(prev => ({ ...prev, [key]: file }));
    setImgPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      const productBlob = new Blob([JSON.stringify({
        productTitle: modal.data.productTitle,
        productUrl: modal.data.productUrl,
        productPrice: Number(modal.data.productPrice),
        productPspPrice: Number(modal.data.productPspPrice),
        productDesc: modal.data.productDesc,
        productFeatures: modal.data.productFeatures,
        productKeywords: modal.data.productKeywords,
        productLabel: modal.data.productLabel,
        status: modal.data.status,
        catId: modal.data.catId ? Number(modal.data.catId) : null,
        pCatId: modal.data.pCatId ? Number(modal.data.pCatId) : null,
        manufacturerId: modal.data.manufacturerId ? Number(modal.data.manufacturerId) : null,
      })], { type: 'application/json' });
      formData.append('product', productBlob);
      if (imgFiles.img1) formData.append('img1', imgFiles.img1);
      if (imgFiles.img2) formData.append('img2', imgFiles.img2);
      if (imgFiles.img3) formData.append('img3', imgFiles.img3);

      if (modal.mode === 'create') {
        await productApi.admin.create(formData);
        showToast('Product created!');
      } else {
        await productApi.admin.update(modal.data.productId, formData);
        showToast('Product updated!');
      }
      setModal(null);
      load();
    } catch (e) { showToast(e.response?.data?.message || 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setDeletingId(id);
    try {
      await productApi.admin.delete(id);
      showToast('Product deleted!');
      load();
    } catch { showToast('Delete failed', 'error'); }
    finally { setDeletingId(null); }
  };

  const LABEL_COLORS = { new: 'bg-blue-100 text-blue-700', hot: 'bg-red-100 text-red-700', sale: 'bg-emerald-100 text-emerald-700' };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} products</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center space-x-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all">
          <Plus className="w-4 h-4" /><span>Add Product</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Image', 'Title', 'Price', 'PSP Price', 'Category', 'Label', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => (
                  <tr key={p.productId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                        {p.productImg1
                          ? <img src={fileUrl(p.productImg1)} alt="" className="w-full h-full object-cover" />
                          : <Package className="w-5 h-5 text-slate-300 m-auto mt-3" />}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-800 max-w-[180px] truncate">{p.productTitle}</td>
                    <td className="px-5 py-3 font-bold text-slate-800">${p.productPrice?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-500 line-through text-xs">${p.productPspPrice?.toLocaleString()}</td>
                    <td className="px-5 py-3 text-slate-600">{p.catTitle}</td>
                    <td className="px-5 py-3">
                      {p.productLabel && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${LABEL_COLORS[p.productLabel] || 'bg-slate-100 text-slate-500'}`}>
                          {p.productLabel}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center space-x-1">
                        <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/10 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.productId)} disabled={deletingId === p.productId} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          {deletingId === p.productId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-slate-400">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 my-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">{modal.mode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>

            {/* Image Upload Row */}
            <div className="flex gap-4 mb-6">
              {['img1'].map((key) => (
                <label key={key} className="flex-1 cursor-pointer">
                  <div className={`h-32 rounded-2xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors ${imgPreviews[key] ? 'border-transparent' : 'border-slate-200 hover:border-brand/40'}`}>
                    {imgPreviews[key]
                      ? <img src={imgPreviews[key]} alt="" className="w-full h-full object-contain" />
                      : <div className="text-center"><Upload className="w-6 h-6 text-slate-300 mx-auto" /><p className="text-sm font-medium text-slate-400 mt-2">Upload Product Image</p></div>
                    }
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleImgChange(key, e.target.files[0])} />
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Product Title *</label>
                <input value={modal.data.productTitle} onChange={e => setModal({ ...modal, data: { ...modal.data, productTitle: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Product title..." />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Price ($) *</label>
                <input type="number" value={modal.data.productPrice} onChange={e => setModal({ ...modal, data: { ...modal.data, productPrice: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">PSP Price ($)</label>
                <input type="number" value={modal.data.productPspPrice} onChange={e => setModal({ ...modal, data: { ...modal.data, productPspPrice: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Category</label>
                <select value={modal.data.catId} onChange={e => setModal({ ...modal, data: { ...modal.data, catId: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.catId} value={c.catId}>{c.catTitle}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Manufacturer</label>
                <select value={modal.data.manufacturerId} onChange={e => setModal({ ...modal, data: { ...modal.data, manufacturerId: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  <option value="">Select Manufacturer</option>
                  {manufacturers.map(m => <option key={m.manufacturerId} value={m.manufacturerId}>{m.manufacturerTitle}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Label</label>
                <select value={modal.data.productLabel} onChange={e => setModal({ ...modal, data: { ...modal.data, productLabel: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  {LABELS.map(l => <option key={l} value={l}>{l || '(none)'}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                <select value={modal.data.status} onChange={e => setModal({ ...modal, data: { ...modal.data, status: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea rows={3} value={modal.data.productDesc} onChange={e => setModal({ ...modal, data: { ...modal.data, productDesc: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none" placeholder="Product description..." />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Keywords</label>
                <input value={modal.data.productKeywords} onChange={e => setModal({ ...modal, data: { ...modal.data, productKeywords: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="keyword1, keyword2..." />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-brand text-white rounded-xl font-bold flex items-center justify-center hover:bg-brand/90">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />{modal.mode === 'create' ? 'Create' : 'Update'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
