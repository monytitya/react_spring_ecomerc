import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  Search, 
  ChevronDown,
  Globe,
  Menu,
  LogOut
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  // AuthResponse stores: { id, name, email, role }
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Admin"}');
  const displayName = user.name || user.adminName || user.customerName || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('customer_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left side: Search & Menu */}
      <div className="flex items-center space-x-6 flex-1">
        <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand transition-colors" />
          <input 
            type="text" 
            placeholder="Search analytics, orders, or users..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">EN</span>
          </button>
        </div>

        <div className="h-8 w-px bg-slate-100 mx-2"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors">{displayName}</p>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/5 overflow-hidden ring-2 ring-transparent group-hover:ring-brand/20 transition-all">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="p-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
