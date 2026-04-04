import React, { useEffect, useState } from 'react';
import { orderApi } from '../services/api';
import { ShoppingCart, Search, ChevronDown, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-violet-100 text-violet-700',
  Delivered:  'bg-emerald-100 text-emerald-700',
  Cancelled:  'bg-red-100 text-red-700',
};

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdmin 
        ? await orderApi.getAll() 
        : await orderApi.getCustomerOrders(storedUser.id);
      const data = res.data?.data || [];
      setOrders(data);
      setFiltered(data);
    } catch { showToast('Failed to load orders', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(orders.filter(o => {
      const matchSearch = o.customerName?.toLowerCase().includes(q) ||
        String(o.invoiceNo).includes(q) || o.productTitle?.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'All' || o.orderStatus === filterStatus;
      return matchSearch && matchStatus;
    }));
  }, [search, filterStatus, orders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, orderStatus: status } : o));
      showToast('Order status updated!');
    } catch { showToast('Failed to update status', 'error'); }
    finally { setUpdatingId(null); }
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
          <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? 'Orders' : 'My Orders'}</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} {isAdmin ? 'orders found' : 'purchases in history'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAdmin ? "Search by customer, invoice..." : "Search by product or invoice..."}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', ...STATUS_OPTIONS].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === s ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-white border border-slate-200 text-slate-500 hover:border-brand/30'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Invoice</th>
                  {isAdmin && <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Customer</th>}
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Qty</th>
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  {isAdmin && <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(order => (
                  <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">#{order.invoiceNo}</td>
                    {isAdmin && <td className="px-5 py-4 font-semibold text-slate-800">{order.customerName}</td>}
                    <td className="px-5 py-4 text-slate-600 max-w-[200px] truncate">{order.productTitle}</td>
                    <td className="px-5 py-4 text-slate-600">{order.qty}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">${order.dueAmount?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.orderStatus] || 'bg-slate-100 text-slate-500'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={e => handleStatusChange(order.orderId, e.target.value)}
                            disabled={updatingId === order.orderId}
                            className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-slate-400">No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
