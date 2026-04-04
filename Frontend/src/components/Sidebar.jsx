import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
  PieChart,
  Gift,
  Files,
  Tag,
  Receipt,
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, badge }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center justify-between px-4 py-3 min-h-[48px] rounded-xl transition-all duration-200 group
      ${isActive
        ? 'bg-brand text-white shadow-lg shadow-brand/20'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-semibold text-sm transition-colors">{label}</span>
    </div>
    {badge && (
      <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
        {badge}
      </span>
    )}
  </NavLink>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('customer_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="w-72 h-screen bg-sidebar fixed left-0 top-0 flex flex-col p-6 font-sans overflow-y-auto z-50 shadow-2xl">
      {/* Brand */}
      <div className="flex items-center space-x-3 mb-10 px-2 group cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center transform group-hover:rotate-0 transition-transform rotate-6 shadow-lg shadow-brand/20 text-white">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <span className="text-xl font-black tracking-tight text-white transition-colors">Blueberry</span>
      </div>

      {/* Navigation */}
      <div className="space-y-6 flex-1">
        <div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        </div>

        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Management</h3>
          <div className="space-y-1">
            {isAdmin && <SidebarItem icon={PieChart}    label="Analytics"  to="/analytics" />}
            {isAdmin && <SidebarItem icon={Users}       label="Customers"  to="/customers" />}
            <SidebarItem icon={ShoppingCart} label="Orders"   to="/orders" />
            <SidebarItem icon={Package}     label="Products"   to="/products" />
            {isAdmin && <SidebarItem icon={Receipt}     label="Invoices"   to="/invoices" />}
            {isAdmin && <SidebarItem icon={Gift}        label="Coupons"    to="/coupons" />}
          </div>
        </div>

        {isAdmin && (
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Catalog</h3>
            <div className="space-y-1">
              <SidebarItem icon={Tag}         label="Categories & Brands" to="/catalog" />
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">System</h3>
          <div className="space-y-1">
            {isAdmin && <SidebarItem icon={Files}       label="CMS"       to="/cms" />}
            <SidebarItem icon={Settings}    label="Settings"  to="/settings" />
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto flex items-center space-x-3 px-4 py-4 text-slate-400 hover:text-white transition-colors group"
      >
        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        <span className="font-bold text-sm">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
