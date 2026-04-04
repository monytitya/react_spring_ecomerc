import React, { useEffect, useState } from 'react';
import { customerApi, fileUrl } from '../services/api';
import { Users, Search, Edit2, Trash2, X, Save, Loader2, MapPin, Phone, Mail, User } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'create'|'edit', data: {} }
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
      const res = await customerApi.getAll();
      const data = res.data?.data || [];
      setCustomers(data);
      setFiltered(data);
    } catch { showToast('Failed to load customers', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(customers.filter(c =>
      c.customerName?.toLowerCase().includes(q) ||
      c.customerEmail?.toLowerCase().includes(q) ||
      c.customerCity?.toLowerCase().includes(q) ||
      c.customerCountry?.toLowerCase().includes(q)
    ));
  }, [search, customers]);

  const handleSave = async () => {
    if (!modal.data.customerName || !modal.data.customerEmail) {
      showToast('Name and Email are required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await customerApi.create(modal.data);
        showToast('Customer created!');
      } else {
        await customerApi.update(modal.data.customerId, modal.data);
        showToast('Customer updated!');
      }
      setModal(null);
      load();
    } catch (e) {
      showToast(e.response?.data?.message || 'Operation failed', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await customerApi.delete(id);
      showToast('Customer deleted');
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
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} registered customers</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create', data: {} })}
          className="flex items-center space-x-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all"
        >
          <Users className="w-4 h-4" /><span>Add Customer</span>
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, city..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['#', 'Customer', 'Email', 'Contact', 'City', 'Country', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((c, i) => (
                  <tr key={c.customerId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-medium">{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-brand/10 overflow-hidden flex-shrink-0">
                          {c.customerImage
                            ? <img src={fileUrl(c.customerImage)} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-brand font-bold text-sm">{c.customerName?.[0]}</div>
                          }
                        </div>
                        <span className="font-semibold text-slate-800">{c.customerName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{c.customerEmail}</td>
                    <td className="px-5 py-4 text-slate-600">{c.customerContact}</td>
                    <td className="px-5 py-4 text-slate-600">{c.customerCity}</td>
                    <td className="px-5 py-4 text-slate-600">{c.customerCountry}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setModal({ mode: 'edit', data: { ...c } })}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand hover:bg-brand/10 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.customerId)}
                          disabled={deletingId === c.customerId}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          {deletingId === c.customerId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-16 text-slate-400">No customers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {modal.mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
              </h2>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'customerName', label: 'Full Name', icon: User, placeholder: 'e.g. John Doe' },
                { key: 'customerEmail', label: 'Email', icon: Mail, placeholder: 'john@example.com' },
                { key: 'customerContact', label: 'Contact', icon: Phone, placeholder: '+855...' },
                { key: 'customerCity', label: 'City', icon: MapPin, placeholder: 'e.g. Phnom Penh' },
                { key: 'customerCountry', label: 'Country', icon: MapPin, placeholder: 'e.g. Cambodia' },
                { key: 'customerAddress', label: 'Address', icon: MapPin, placeholder: 'Detailed address...' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={modal.data[key] || ''}
                      onChange={e => setModal({ ...modal, data: { ...modal.data, [key]: e.target.value } })}
                      placeholder={placeholder}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
              ))}
              {modal.mode === 'create' && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Password (Optional)</label>
                  <div className="relative">
                    <Save className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={modal.data.customerPass || ''}
                      onChange={e => setModal({ ...modal, data: { ...modal.data, customerPass: e.target.value } })}
                      placeholder="Default: 123456"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-brand text-white rounded-xl font-bold flex items-center justify-center hover:bg-brand/90 transition-all">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> {modal.mode === 'create' ? 'Create' : 'Save'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
