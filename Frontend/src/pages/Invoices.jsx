import React, { useEffect, useState } from 'react';
import { orderApi, customerApi } from '../services/api';
import { FileText, Search, Eye, X, Loader2, DollarSign, Package, User, Calendar } from 'lucide-react';

const Invoices = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll();
      const data = res.data?.data || [];
      setOrders(data);
      setFiltered(data);
    } catch { showToast('Failed to load invoices', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(orders.filter(o =>
      String(o.invoiceNo).includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.productTitle?.toLowerCase().includes(q)
    ));
  }, [search, orders]);

  const STATUS_COLORS = {
    Pending:    'bg-amber-100 text-amber-700',
    Processing: 'bg-blue-100 text-blue-700',
    Shipped:    'bg-violet-100 text-violet-700',
    Delivered:  'bg-emerald-100 text-emerald-700',
    Cancelled:  'bg-red-100 text-red-700',
  };

  const totalRevenue = orders
    .filter(o => o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + (o.dueAmount || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:hidden">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'} print:hidden`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} invoices • Revenue from delivered: <span className="text-emerald-600 font-bold">${totalRevenue.toLocaleString()}</span></p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-slate-800', bg: 'bg-slate-50' },
          { label: 'Pending', value: orders.filter(o => o.orderStatus === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Delivered', value: orders.filter(o => o.orderStatus === 'Delivered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-brand', bg: 'bg-brand/5' },
        ].map(card => (
          <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-white shadow-sm`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
            <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by invoice, customer..."
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
                  {['Invoice #', 'Customer', 'Product', 'Qty', 'Amount', 'Date', 'Status', 'View'].map(h => (
                    <th key={h} className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(order => (
                  <tr key={order.orderId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-brand">#{order.invoiceNo}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{order.customerName || 'Guest User'}</td>
                    <td className="px-5 py-4 text-slate-600 max-w-[160px] truncate">{order.productTitle || 'Unknown Product'}</td>
                    <td className="px-5 py-4 text-slate-600">{order.qty}</td>
                    <td className="px-5 py-4 font-bold text-slate-800">${order.dueAmount?.toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.orderStatus] || 'bg-slate-100 text-slate-500'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setViewModal(order)} className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-slate-400">No invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal for Web View & Print Layout */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:block print:relative print:bg-white print:p-0">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 print:shadow-none print:max-w-none print:p-0 print:h-auto print:static">
            
            {/* Header / Actions: Hidden strictly on print */}
            <div className="flex justify-between items-center mb-6 print:hidden">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Invoice Detail</h2>
                <p className="text-sm text-slate-400 font-mono mt-0.5">#{viewModal.invoiceNo}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => window.print()} 
                  className="px-4 py-2 bg-brand text-white font-bold rounded-lg hover:bg-brand/90 transition-all text-sm flex items-center shadow-lg shadow-brand/20">
                  <FileText className="w-4 h-4 mr-2" /> Print Invoice
                </button>
                <button onClick={() => setViewModal(null)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Printable Invoice Document */}
            <div className="space-y-8">
              
              {/* Invoice Header */}
              <div className="flex justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">INVOICE</h1>
                  <p className="text-slate-500 font-mono mt-1 pr-4">#{viewModal.invoiceNo}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-brand">Blueberry CRM</h2>
                  <p className="text-sm text-slate-500 mt-1">123 E-Commerce Blvd</p>
                  <p className="text-sm text-slate-500">Suite 400, Tech City</p>
                </div>
              </div>

              {/* Bill To & Details */}
              <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
                  <p className="font-bold text-slate-800 text-lg">{viewModal.customerName || 'Guest User'}</p>
                  <p className="text-sm text-slate-500 mt-1">Customer ID: {viewModal.customerId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Order Details</p>
                  <p className="text-sm font-semibold text-slate-800">
                    Date: <span className="font-normal text-slate-500 ml-2">
                       {viewModal.orderDate ? new Date(viewModal.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    Status: <span className="font-bold text-brand ml-2 uppercase text-xs tracking-wider">{viewModal.orderStatus}</span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Item Description</th>
                    <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Size</th>
                    <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Qty</th>
                    <th className="py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 font-semibold text-slate-800">{viewModal.productTitle || 'Unknown Product'}</td>
                    <td className="py-4 text-slate-500 text-center">{viewModal.size || '—'}</td>
                    <td className="py-4 text-slate-500 text-center">{viewModal.qty}</td>
                    <td className="py-4 font-bold text-slate-800 text-right">${viewModal.dueAmount?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end pt-4">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>${viewModal.dueAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                    <span>Total</span>
                    <span>${viewModal.dueAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>

            <button onClick={() => setViewModal(null)} className="w-full mt-8 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 print:hidden">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
