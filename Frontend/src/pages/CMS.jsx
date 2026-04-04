import React, { useEffect, useState } from 'react';
import { cmsApi } from '../services/api';
import { FileText, MessageSquare, Book, Store, HelpCircle, Edit2, Save, X, Loader2, ChevronRight } from 'lucide-react';

const Section = ({ icon: Icon, title, color, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex items-center space-x-3 px-6 py-4 border-b border-slate-100">
      <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CMS = () => {
  const [about, setAbout] = useState([]);
  const [contact, setContact] = useState([]);
  const [terms, setTerms] = useState([]);
  const [stores, setStores] = useState([]);
  const [enquiryTypes, setEnquiryTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(null); // { type, item }
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [aRes, cRes, tRes, sRes, eRes] = await Promise.all([
        cmsApi.getAbout(),
        cmsApi.getContact(),
        cmsApi.getTerms(),
        cmsApi.getStores(),
        cmsApi.getEnquiryTypes(),
      ]);
      setAbout(aRes.data?.data || []);
      setContact(cRes.data?.data || []);
      setTerms(tRes.data?.data || []);
      setStores(sRes.data?.data || []);
      setEnquiryTypes(eRes.data?.data || []);
    } catch { showToast('Failed to load CMS content', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editModal.type === 'about') {
        await cmsApi.updateAbout(editModal.item.aboutId, editModal.item);
      } else if (editModal.type === 'contact') {
        await cmsApi.updateContact(editModal.item.contactId, editModal.item);
      }
      showToast('Content updated!');
      setEditModal(null);
      load();
    } catch { showToast('Update failed', 'error'); }
    finally { setSaving(false); }
  };

  const TABS = [
    { key: 'about',   label: 'About Us',      icon: FileText,     color: 'bg-brand' },
    { key: 'contact', label: 'Contact',        icon: MessageSquare, color: 'bg-violet-500' },
    { key: 'terms',   label: 'Terms',          icon: Book,         color: 'bg-amber-500' },
    { key: 'stores',  label: 'Stores',         icon: Store,        color: 'bg-emerald-500' },
    { key: 'enquiry', label: 'Enquiry Types',  icon: HelpCircle,   color: 'bg-rose-500' },
  ];

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-brand" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">CMS Content</h1>
        <p className="text-sm text-slate-500 mt-1">Manage site content, stores, and enquiry settings</p>
      </div>

      {/* Tab Nav */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === t.key ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-brand/30 hover:text-brand'}`}>
            <t.icon className="w-4 h-4" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* About Us */}
      {activeTab === 'about' && (
        <Section icon={FileText} title="About Us Content" color="bg-brand">
          {about.length === 0
            ? <p className="text-slate-400 text-center py-8">No about us content found</p>
            : about.map(item => (
              <div key={item.aboutId} className="border border-slate-100 rounded-2xl p-5 hover:border-brand/30 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 mb-1">{item.aboutTitle}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{item.aboutDesc}</p>
                  </div>
                  <button onClick={() => setEditModal({ type: 'about', item: { ...item } })}
                    className="ml-4 p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          }
        </Section>
      )}

      {/* Contact */}
      {activeTab === 'contact' && (
        <Section icon={MessageSquare} title="Contact Us Content" color="bg-violet-500">
          {contact.length === 0
            ? <p className="text-slate-400 text-center py-8">No contact content found</p>
            : contact.map(item => (
              <div key={item.contactId} className="border border-slate-100 rounded-2xl p-5 hover:border-violet-200 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 mb-1">{item.contactTitle}</h4>
                    <p className="text-sm text-slate-500 line-clamp-2">{item.contactDesc}</p>
                  </div>
                  <button onClick={() => setEditModal({ type: 'contact', item: { ...item } })}
                    className="ml-4 p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all opacity-0 group-hover:opacity-100 flex-shrink-0">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          }
        </Section>
      )}

      {/* Terms */}
      {activeTab === 'terms' && (
        <Section icon={Book} title="Terms & Policies" color="bg-amber-500">
          {terms.length === 0
            ? <p className="text-slate-400 text-center py-8">No terms found</p>
            : <div className="space-y-3">
                {terms.map(item => (
                  <div key={item.termId} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl hover:bg-amber-50 transition-colors group cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-800">{item.termTitle}</p>
                      <p className="text-xs text-slate-400 font-mono">/{item.termLink}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500" />
                  </div>
                ))}
              </div>
          }
        </Section>
      )}

      {/* Stores */}
      {activeTab === 'stores' && (
        <Section icon={Store} title="Store Locations" color="bg-emerald-500">
          {stores.length === 0
            ? <p className="text-slate-400 text-center py-8">No stores found</p>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stores.map((item, i) => (
                  <div key={i} className="border border-slate-100 rounded-2xl p-5 bg-emerald-50/30">
                    <h4 className="font-bold text-slate-800 mb-2">{item.storeTitle || item.storeName}</h4>
                    {item.storeAddress && <p className="text-sm text-slate-500">{item.storeAddress}</p>}
                    {item.storePhone && <p className="text-sm text-slate-500 mt-1">📞 {item.storePhone}</p>}
                    {item.storeEmail && <p className="text-sm text-slate-500">✉️ {item.storeEmail}</p>}
                  </div>
                ))}
              </div>
          }
        </Section>
      )}

      {/* Enquiry Types */}
      {activeTab === 'enquiry' && (
        <Section icon={HelpCircle} title="Enquiry Types" color="bg-rose-500">
          {enquiryTypes.length === 0
            ? <p className="text-slate-400 text-center py-8">No enquiry types found</p>
            : <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {enquiryTypes.map((item, i) => (
                  <div key={i} className="bg-rose-50 rounded-xl px-4 py-3 text-sm font-semibold text-rose-700">
                    {item.enquiryType || item.type || JSON.stringify(item)}
                  </div>
                ))}
              </div>
          }
        </Section>
      )}

      {/* Edit Modal (About / Contact) */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Edit Content</h2>
              <button onClick={() => setEditModal(null)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {Object.entries(editModal.item)
                .filter(([k]) => !['aboutId', 'contactId'].includes(k))
                .map(([key, val]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {typeof val === 'string' && val.length > 80
                      ? <textarea rows={4} value={val}
                          onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, [key]: e.target.value } })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none" />
                      : <input value={val || ''} onChange={e => setEditModal({ ...editModal, item: { ...editModal.item, [key]: e.target.value } })}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
                    }
                  </div>
                ))}
            </div>
            <div className="flex space-x-3 mt-8">
              <button onClick={() => setEditModal(null)} className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
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

export default CMS;
