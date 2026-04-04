import React, { useState } from 'react';
import { adminApi, fileUrl } from '../services/api';
import { User, Lock, Camera, Save, Loader2, Mail, Shield } from 'lucide-react';

const Settings = () => {
  const [stored, setStored] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [profile, setProfile] = useState({
    name: stored.name || stored.adminName || '',
    email: stored.email || stored.adminEmail || '',
    role: stored.role || 'ADMIN',
    image: stored.image || stored.adminImage || null
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleResetData = async () => {
    if (!window.confirm("ARE YOU SURE? This will permanently delete all Customers and Orders. This action cannot be undone.")) return;
    setResetLoading(true);
    try {
      await adminApi.resetData();
      showToast("Marketplace data reset successfully!");
    } catch {
      showToast("Failed to reset data", "error");
    } finally {
      setResetLoading(false);
    }
  };
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  React.useEffect(() => {
    const fetchAdmin = async () => {
      if (!stored.id) return;
      try {
        const res = await adminApi.getProfile(stored.id);
        const data = res.data.data;
        setProfile({
          name: data.adminName,
          email: data.adminEmail,
          role: 'ADMIN',
          image: data.adminImage
        });
        // Sync storage if needed
        const newUser = { ...stored, name: data.adminName, email: data.adminEmail, image: data.adminImage };
        localStorage.setItem('user', JSON.stringify(newUser));
        setStored(newUser);
      } catch (err) {
        console.error("Failed to fetch admin profile:", err);
      }
    };
    fetchAdmin();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const adminId = stored.id;
      let newImage = profile.image;
      
      if (avatarFile && adminId) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const imgRes = await adminApi.uploadProfileImage(adminId, formData);
        newImage = imgRes.data.data;
      }
      
      // Update localStorage for consistency
      const updatedUser = { ...stored, name: profile.name, email: profile.email, image: newImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setStored(updatedUser);
      setProfile(prev => ({ ...prev, image: newImage }));
      
      showToast('Profile updated successfully!');
      // Force a slight delay to allow image propagation
      setTimeout(() => window.dispatchEvent(new Event('storage')), 100);
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e) => { e.preventDefault(); };

  const displayName = profile.name || profile.email || 'Admin';
  const avatarSrc = avatarPreview || (profile.image ? fileUrl(profile.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&size=200`);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your admin profile and account security</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-brand" />
          </div>
          <h3 className="font-bold text-slate-800">Profile Information</h3>
        </div>

        {/* Avatar */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-brand/10 bg-slate-50">
              <img 
                src={avatarSrc} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  if (!avatarSrc.includes('ui-avatars')) {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&size=200`;
                  }
                }}
              />
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-brand rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-brand/90 transition-all">
              <Camera className="w-3.5 h-3.5 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="font-bold text-slate-900 text-lg">{displayName}</p>
            <p className="text-sm text-slate-400">{profile.email}</p>
            <span className="inline-flex items-center space-x-1 mt-2 px-3 py-1 bg-brand/10 text-brand rounded-full text-xs font-bold">
              <Shield className="w-3 h-3" />
              <span>{profile.role}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="Your name"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="your@email.com"
                type="email"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Role</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={profile.role}
                disabled
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Admin ID</label>
            <div className="relative">
              <input
                value={stored.id || '—'}
                disabled
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="mt-6 flex items-center space-x-2 bg-brand text-white px-6 py-3 rounded-xl font-bold hover:bg-brand/90 transition-all shadow-lg shadow-brand/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /><span>Save Changes</span></>}
        </button>
      </div>

      {/* Security Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
            <Lock className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="font-bold text-slate-800">Security</h3>
        </div>

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passwords.newPass}
                onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit"
              className="flex items-center space-x-2 bg-rose-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
              <Lock className="w-4 h-4" /><span>Change Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center">
                <Shield className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Danger Zone</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">High Impact Administrative Actions</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="max-w-md">
              <h4 className="text-sm font-bold text-rose-900 mb-1">Reset Marketplace Data</h4>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                This will permanently delete all **Customers, Orders, Carts, and Wishlists**. 
                Your Admin account and Product catalog will remain safe. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={handleResetData}
              disabled={resetLoading}
              className="flex items-center justify-center space-x-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 whitespace-nowrap min-w-[180px]"
            >
              {resetLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Reset Marketplace</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white text-sm">
        <h3 className="font-bold mb-4 text-slate-200 uppercase tracking-widest text-[10px]">System Environment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1.5 opacity-60">Identity</p>
            <p className="font-bold text-white">{displayName}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1.5 opacity-60">Hierarchy</p>
            <p className="font-bold text-brand uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3 h-3" />
              <span>{profile.role}</span>
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1.5 opacity-60">Connection</p>
            <p className="font-bold text-emerald-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live System</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
