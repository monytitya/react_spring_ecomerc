import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  Calendar as CalendarIcon,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import SalesReport from '../components/Charts/SalesReport';
import { dashboardApi, productApi, fileUrl } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  const displayName = storedUser.name || storedUser.adminName || 'User';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsTask = isAdmin 
          ? dashboardApi.getStats() 
          : dashboardApi.getCustomerStats(storedUser.id);

        const [statsRes, productsRes] = await Promise.all([
          statsTask,
          productApi.getFeatured()
        ]);
        
        setStats(statsRes.data.data);
        const products = productsRes.data.data || [];
        if (products.length === 0) {
          const allRes = await productApi.getProducts(0, 5);
          setTopProducts(allRes.data.data.content || []);
        } else {
          setTopProducts(products.slice(0, 5));
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin ? 'Overview' : `Welcome back, ${displayName}! 👋`}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin 
              ? 'Real-time performance and analytics for your store.' 
              : 'Here is what is happening with your account today.'
            }
          </p>
        </div>
        {isAdmin && (
          <div className="flex items-center space-x-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center space-x-2 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>22 Jun 2024 - 28 Jun 2024</span>
            </div>
            <button className="bg-brand text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all">
              Download Report
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title={isAdmin ? "Total Profit" : "Total Spent"} 
          value={`$${(isAdmin ? stats?.totalProfit : stats?.totalRevenue)?.toLocaleString() || '0'}`} 
          trend="up" 
          trendValue="3.55" 
          icon={DollarSign} 
          color="emerald-500" 
        />
        <StatCard 
          title={isAdmin ? "Total Expenses" : "Total Orders"} 
          value={(isAdmin ? stats?.totalExpenses : stats?.totalOrders)?.toLocaleString() || '0'} 
          trend="up" 
          trendValue="2.67" 
          icon={isAdmin ? TrendingUp : ShoppingBag} 
          color={isAdmin ? "rose-500" : "brand"} 
        />
        <StatCard 
          title={isAdmin ? "New Users" : "Active Orders"} 
          value={(isAdmin ? stats?.newUsers : stats?.pendingOrders)?.toLocaleString() || '0'} 
          trend={isAdmin ? "down" : "up"} 
          trendValue={isAdmin ? "9.89" : "12.5"} 
          icon={isAdmin ? Users : CalendarIcon} 
          color="violet-500" 
        />
      </div>

      {/* Main Row */}
      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-8`}>
        {/* Sales Report (Admin only) */}
        {isAdmin && (
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Sales Report</h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Income vs Expenses</p>
              </div>
              <div className="flex items-center space-x-5 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-brand"></span>
                  <span className="font-bold text-slate-500">Incomes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-violet-400"></span>
                  <span className="font-bold text-slate-500">Expenses</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <SalesReport />
            </div>
          </div>
        )}

        {/* Top Selling Products / Recommended */}
        <div className={`bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col ${!isAdmin ? 'max-w-md' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              {isAdmin ? 'Top Selling Products' : 'Recommended for You'}
            </h3>
            {isAdmin && (
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100">
                    <img 
                      src={fileUrl(product.productImg)} 
                      alt={product.productTitle} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand transition-colors line-clamp-1">{product.productTitle}</h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Available</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">${product.productPrice}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="mt-8 w-full py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-brand transition-all flex items-center justify-center space-x-2 group"
          >
            <span>{isAdmin ? 'View All Products' : 'Browse Store'}</span>
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Admin Bottom Row (Marketing/Events) */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-4">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Upcoming Events</h3>
             <div className="space-y-4">
                {[
                  { date: '30 JUN, TUE', title: 'Meeting with partners', color: 'bg-brand' },
                  { date: '05 JUL, MON', title: '103th Web Conference', color: 'bg-violet-400' },
                  { date: '06 JUL, TUE', title: 'Lunch with Steve', color: 'bg-emerald-400' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className={`w-12 h-12 rounded-xl ${event.color} flex flex-col items-center justify-center text-white shrink-0`}>
                      <p className="text-[10px] font-bold uppercase">{event.date.split(' ')[0]} {event.date.split(' ')[1]}</p>
                      <p className="text-[10px] font-bold opacity-80">{event.date.split(', ')[1]}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">10:00 AM - 12:00 PM</p>
                    </div>
                    <MoreVertical className="w-5 h-5 text-slate-300 group-hover:text-slate-500" />
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-brand p-10 rounded-3xl shadow-xl shadow-brand/20 relative overflow-hidden text-white flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">Grow your business faster with premium tools.</h2>
                <p className="text-white/80 text-sm mb-8 max-w-md">Access advanced analytics, inventory management, and automated marketing campaigns tailored for your scale.</p>
                <button className="bg-white text-brand px-8 py-3 rounded-xl font-bold hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10">
                  Upgrade to Pro
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
