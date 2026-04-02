import React, { useEffect, useState } from 'react';
import { couponApi } from '../services/api';
import { Gift, Plus, Trash2, X, Save, Loader2, Tag, Percent } from 'lucide-react';

const emptyCoupon = { couponCode: '', couponDiscount: '', couponLimit: '', couponStatus: 'active' };

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
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
      const res = await couponApi.getAll();
      setCoupons(res.data?.data || []);
    } catch { showToast('Failed to load coupons', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await couponApi.create({
        couponCode: modal.couponCode,
        couponDiscount: Number(modal.couponDiscount),
        couponLimit: Number(modal.couponLimit),
        couponStatus: modal.couponStatus,
      });
      showToast('Coupon created!');
      setModal(null);
      load();
    } catch (e) { showToast(e.response?.data?.message || 'Create failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    setDeletingId(id);
    try {
      await couponApi.delete(id);
      showToast('Coupon deleted!');
      load();
    } catch { showToast('Delete failed', 'error'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
          <p className="text-sm text-slate-500 mt-1">{coupons.length} active coupons</p>
        </div>
        <button onClick={() => setModal({ ...emptyCoupon })}
          className="flex items-center space-x-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all">
          <Plus className="w-4 h-4" /><span>New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? <div className="col-span-3 flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
          : coupons.length === 0
            ? <div className="col-span-3 text-center py-20 text-slate-400">No coupons yet. Create one!</div>
            : coupons.map(c => (
              <div key={c.couponId} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-10 -mt-10" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-brand" />
                    </div>
                    <button onClick={() => handleDelete(c.couponId)} disabled={deletingId === c.couponId}
                      className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                      {deletingId === c.couponId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Coupon Code</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-widest font-mono">{c.couponCode}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Discount</p>
                      <p className="text-xl font-black text-brand">{c.couponDiscount}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Limit</p>
                      <p className="text-xl font-black text-slate-700">{c.couponLimit || '∞'}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-medium">Status</p>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.couponStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {c.couponStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Create Coupon</h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Coupon Code</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={modal.couponCode} onChange={e => setModal({ ...modal, couponCode: e.target.value.toUpperCase() })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    placeholder="SAVE20" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Discount (%)</label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min={1} max={100} value={modal.couponDiscount} onChange={e => setModal({ ...modal, couponDiscount: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    placeholder="10" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Usage Limit</label>
                <input type="number" min={1} value={modal.couponLimit} onChange={e => setModal({ ...modal, couponLimit: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  placeholder="100 (leave blank for unlimited)" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                <select value={modal.couponStatus} onChange={e => setModal({ ...modal, couponStatus: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-brand text-white rounded-xl font-bold flex items-center justify-center hover:bg-brand/90">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" />Create</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
