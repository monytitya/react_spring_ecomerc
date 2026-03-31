import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart2, 
  ShoppingBag, 
  Users, 
  Layout, 
  Settings, 
  Mail, 
  Calendar, 
  PieChart, 
  FileText,
  Search,
  Bell,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  LogOut,
  AppWindow,
  PackageCheck,
  CreditCard,
  UserCheck
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, badge, count }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
      ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`
    }
  >
    <Icon size={20} className="shrink-0" />
    <span className="font-medium text-sm flex-1">{label}</span>
    {badge && <span className="badge badge-success !text-[10px] py-0.5">{badge}</span>}
    {count && <span className="text-[10px] py-0.5 text-text-muted">{count}</span>}
  </NavLink>
);

const Sidebar = () => {
  return (
    <aside className="sidebar w-[280px] h-screen bg-[#1a1f36] flex flex-col pt-0 shrink-0 border-r border-slate-800/50">
      <div className="px-6 py-6 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="text-xl font-bold tracking-tight text-white uppercase italic">Mofi</span>
        </div>
        <HelpCircle size={18} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide space-y-6">
        <div>
          <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">General</p>
          <div className="space-y-1">
            <SidebarLink to="/admin" icon={Layout} label="Dashboard" badge="2" />
            <SidebarLink to="/admin/projects" icon={AppWindow} label="Projects" />
            <SidebarLink to="/admin/ecommerce" icon={ShoppingBag} label="Ecommerce" />
            <SidebarLink to="/admin/education" icon={HelpCircle} label="Education" />
          </div>
        </div>

        <div>
           <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Applications</p>
           <div className="space-y-1">
            <SidebarLink to="/admin/product" icon={PackageCheck} label="Product" />
            <SidebarLink to="/admin/file-manager" icon={PieChart} label="File Manager" />
            <SidebarLink to="/admin/kanban" icon={Layout} label="Kanban Board" />
            <SidebarLink to="/admin/contacts" icon={Users} label="Contacts" />
            <SidebarLink to="/admin/tasks" icon={FileText} label="Tasks" />
            <SidebarLink to="/admin/calendar" icon={Calendar} label="Calendar" />
            <SidebarLink to="/admin/social-app" icon={MessageCircle} label="Social App" />
          </div>
        </div>

        <div>
           <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Forms & Table</p>
           <div className="space-y-1">
            <SidebarLink to="/admin/forms" icon={FileText} label="Forms" />
            <SidebarLink to="/admin/tables" icon={Layout} label="Tables" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800/50">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
};

const Header = () => (
  <header className="h-[80px] bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
    <div className="flex items-center gap-4 flex-1">
       <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search Mofi..." 
            className="w-full bg-slate-50/50 border border-slate-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all placeholder:text-slate-400"
          />
       </div>
    </div>

    <div className="flex items-center gap-5">
      <div className="flex items-center gap-3 pr-5 border-r border-slate-100">
        <div className="p-2 relative rounded-full hover:bg-slate-50 cursor-pointer text-slate-500 hover:text-primary transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary border-2 border-white"></span>
        </div>
        <div className="p-2 rounded-full hover:bg-slate-50 cursor-pointer text-slate-500 hover:text-primary transition-all">
          <MessageCircle size={20} />
        </div>
        <div className="p-2 rounded-full hover:bg-slate-50 cursor-pointer text-slate-500 hover:text-primary transition-all">
          <Layout size={20} />
        </div>
      </div>

      <div className="flex items-center gap-3 cursor-pointer group">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors leading-tight">Admin John</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Super Admin</p>
        </div>
        <div className="relative">
          <img 
            src="https://avatar.iran.liara.run/public/boy?username=admin" 
            className="w-10 h-10 rounded-xl border-2 border-slate-100 group-hover:border-primary/30 transition-all shadow-sm" 
            alt="User" 
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success border-2 border-white rounded-full"></span>
        </div>
        <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-all" />
      </div>
    </div>
  </header>
);

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout bg-[#f5f7fb]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="main-content !ml-0 p-8 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
