import React, { useEffect, useState } from 'react';
import { dashboardApi, orderApi, productApi } from '../services/api';
import {
  TrendingUp, Users, DollarSign, Package, ShoppingCart,
  BarChart2, ArrowUpRight, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const MONTHLY_STUB = [
  { month: 'Jan', revenue: 4200, orders: 38 },
  { month: 'Feb', revenue: 5800, orders: 52 },
  { month: 'Mar', revenue: 4900, orders: 44 },
  { month: 'Apr', revenue: 7200, orders: 67 },
  { month: 'May', revenue: 6100, orders: 55 },
  { month: 'Jun', revenue: 8400, orders: 79 },
  { month: 'Jul', revenue: 9200, orders: 88 },
];

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, oRes] = await Promise.all([dashboardApi.getStats(), orderApi.getAll()]);
        setStats(sRes.data?.data);
        setOrders(oRes.data?.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-brand" /></div>;

  const statusCounts = {
    Pending:   orders.filter(o => o.orderStatus === 'Pending').length,
    Processing: orders.filter(o => o.orderStatus === 'Processing').length,
    Delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    Cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
  };

  const kpis = [
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
    { label: 'Total Orders',  value: (stats?.totalOrders || 0).toLocaleString(), icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%' },
    { label: 'Customers',     value: (stats?.totalCustomers || 0).toLocaleString(), icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', trend: '+5%' },
    { label: 'Products',      value: (stats?.totalProducts || 0).toLocaleString(), icon: Package, color: 'text-brand', bg: 'bg-brand/10', trend: '+2%' },
  ];

  const statusCards = [
    { label: 'Pending',   count: statusCounts.Pending,   icon: Clock,       color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Processing',count: statusCounts.Processing, icon: BarChart2,   color: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: 'Delivered', count: statusCounts.Delivered,  icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Cancelled', count: statusCounts.Cancelled,  icon: XCircle,     color: 'text-red-500',   bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time business performance overview</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 ${kpi.bg} rounded-xl flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />{kpi.trend}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-4">{kpi.value}</p>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_STUB} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-6">Order Status</h3>
          <div className="space-y-4">
            {statusCards.map(s => {
              const pct = orders.length > 0 ? Math.round((s.count / orders.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-7 h-7 ${s.bg} rounded-lg flex items-center justify-center`}>
                        <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">{s.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-700 ${s.color === 'text-amber-600' ? 'bg-amber-400' : s.color === 'text-blue-600' ? 'bg-blue-400' : s.color === 'text-emerald-600' ? 'bg-emerald-400' : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-right text-[10px] text-slate-400 mt-0.5">{pct}%</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 font-medium mb-1">Categories</p>
              <p className="text-2xl font-black text-slate-800">{stats?.totalCategories || 0}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-slate-400 font-medium mb-1">Brands</p>
              <p className="text-2xl font-black text-slate-800">{stats?.totalManufacturers || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Orders trend */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-6">Monthly Orders Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={MONTHLY_STUB}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }} />
            <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
