import React, { useEffect, useState } from 'react';
import { catalogApi, fileUrl } from '../services/api';
import { Tag, Factory, Plus, Edit2, Trash2, X, Save, Loader2, Upload } from 'lucide-react';

const emptyCategory = { catTitle: '', catTop: 'no', catImage: '' };
const emptyManufacturer = { manufacturerTitle: '', manufacturerTop: 'no', manufacturerImage: '' };

const CatalogPage = () => {
  const [tab, setTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, mRes] = await Promise.all([catalogApi.getCategories(), catalogApi.getManufacturers()]);
      setCategories(cRes.data?.data || []);
      setManufacturers(mRes.data?.data || []);
    } catch { showToast('Failed to load catalog', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const isCat = modal.type === 'categories';
      const apiPath = isCat ? catalogApi.admin.createCategory : catalogApi.admin.createManufacturer;
      const apiPathUpdate = isCat ? catalogApi.admin.updateCategory : catalogApi.admin.updateManufacturer;
      
      const { imgFile, ...restData } = modal.data;
      const payloadKey = isCat ? 'category' : 'manufacturer';
      
      const formData = new FormData();
      formData.append(payloadKey, JSON.stringify(restData));
      if (imgFile) formData.append('image', imgFile);

      if (modal.mode === 'create') {
        await apiPath(formData);
        showToast(`${isCat ? 'Category' : 'Manufacturer'} created!`);
      } else {
        const id = isCat ? restData.catId : restData.manufacturerId;
        await apiPathUpdate(id, formData);
        showToast(`${isCat ? 'Category' : 'Manufacturer'} updated!`);
      }
      setModal(null);
      load();
    } catch { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, isCat) => {
    if (!window.confirm('Delete this item?')) return;
    setDeletingId(id);
    try {
      const apiPath = isCat ? catalogApi.admin.deleteCategory : catalogApi.admin.deleteManufacturer;
      await apiPath(id);
      showToast('Deleted item successfully!');
      load();
    } catch { showToast('Delete failed, possibly in use.', 'error'); }
    finally { setDeletingId(null); }
  };

  const items = tab === 'categories' ? categories : manufacturers;
  const idKey = tab === 'categories' ? 'catId' : 'manufacturerId';
  const titleKey = tab === 'categories' ? 'catTitle' : 'manufacturerTitle';
  const topKey = tab === 'categories' ? 'catTop' : 'manufacturerTop';
  const imageKey = tab === 'categories' ? 'catImage' : 'manufacturerImage';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catalog</h1>
          <p className="text-sm text-slate-500 mt-1">Manage categories and manufacturers</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm w-fit">
        {[
          { key: 'categories', label: 'Categories', icon: Tag },
          { key: 'manufacturers', label: 'Manufacturers', icon: Factory },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === key ? 'bg-brand text-white shadow-md shadow-brand/20' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="font-semibold text-slate-700">{items.length} {tab === 'categories' ? 'categories' : 'manufacturers'}</p>
          <button
            onClick={() => setModal({ type: tab, data: tab === 'categories' ? { ...emptyCategory } : { ...emptyManufacturer }, mode: 'create' })}
            className="flex items-center space-x-2 bg-brand text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all">
            <Plus className="w-4 h-4" /><span>Add {tab === 'categories' ? 'Category' : 'Manufacturer'}</span>
          </button>
        </div>

        {loading
          ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['#', 'Image', 'Title', 'Featured', 'Products', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item, i) => (
                    <tr key={item[idKey]} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-slate-400 font-medium">{i + 1}</td>
                      <td className="px-5 py-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                          {item[imageKey]
                            ? <img src={fileUrl(item[imageKey])} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-300">
                                {tab === 'categories' ? <Tag className="w-5 h-5" /> : <Factory className="w-5 h-5" />}
                              </div>
                          }
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{item[titleKey]}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item[topKey] === 'yes' ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-400'}`}>
                          {item[topKey] === 'yes' ? '⭐ Featured' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{item.productCount || 0}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setModal({ type: tab, data: { ...item }, mode: 'edit' })}
                            className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item[idKey], tab === 'categories')}
                            disabled={deletingId === item[idKey]}
                            className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-all">
                            {deletingId === item[idKey] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-16 text-slate-400">No items found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Info Form Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {modal.mode === 'create' ? `New ${modal.type === 'categories' ? 'Category' : 'Manufacturer'}` : 'Edit ' + (modal.type === 'categories' ? 'Category' : 'Manufacturer')}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Title *</label>
                <input value={modal.data[titleKey]} onChange={e => setModal({ ...modal, data: { ...modal.data, [titleKey]: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" placeholder="Title..." />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Image</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 overflow-hidden shrink-0">
                    {modal.data.imgFile ? (
                      <img src={URL.createObjectURL(modal.data.imgFile)} alt="preview" className="w-full h-full object-cover" />
                    ) : modal.data[imageKey] ? (
                      <img src={fileUrl(modal.data[imageKey])} alt="existing" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <input type="file" accept="image/*" 
                    onChange={e => setModal({ ...modal, data: { ...modal.data, imgFile: e.target.files[0] } })}
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 transition-all cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Featured</label>
                <select value={modal.data[topKey]} onChange={e => setModal({ ...modal, data: { ...modal.data, [topKey]: e.target.value } })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-brand text-white rounded-xl font-bold flex items-center justify-center hover:bg-brand/90">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
