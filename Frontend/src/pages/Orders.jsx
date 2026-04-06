import React, { useEffect, useState } from 'react';
import { orderApi } from '../services/api';
import { ShoppingCart, Search, ChevronDown, Loader2, Printer, X, FileText } from 'lucide-react';

const STATUS_COLORS = {
  Pending: 'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-violet-100 text-violet-700',
  Delivered: 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const STATUS_BADGE_PRINT = {
  Pending: 'color:#b45309;background:#fef3c7',
  Processing: 'color:#1d4ed8;background:#dbeafe',
  Shipped: 'color:#6d28d9;background:#ede9fe',
  Delivered: 'color:#065f46;background:#d1fae5',
  Cancelled: 'color:#b91c1c;background:#fee2e2',
};

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const InvoiceModal = ({ order, onClose }) => {
  if (!order) return null;

  const subtotal = order.dueAmount ?? 0;
  const tax = 0;
  const total = subtotal + tax;
  const statusStyle = STATUS_BADGE_PRINT[order.orderStatus] || 'color:#374151;background:#f3f4f6';

  const handlePrint = () => {
    const win = window.open('', '_blank', 'width=800,height=700');
    win.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice #${order.invoiceNo}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff;padding:40px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px}
    .brand{text-align:right}
    .brand-name{font-size:22px;font-weight:800;color:#2563eb}
    .brand-addr{font-size:12px;color:#64748b;margin-top:4px;line-height:1.6}
    .invoice-title{font-size:36px;font-weight:900;color:#0f172a;letter-spacing:-1px}
    .invoice-no{font-size:13px;color:#64748b;margin-top:4px}
    .divider{border:none;border-top:1px solid #e2e8f0;margin:20px 0}
    .meta{display:flex;justify-content:space-between;margin-bottom:28px}
    .meta-block{}
    .meta-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:6px}
    .meta-value{font-size:15px;font-weight:700;color:#0f172a}
    .meta-sub{font-size:12px;color:#64748b;margin-top:2px}
    .meta-right{text-align:right}
    .status-badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;${statusStyle}}
    table{width:100%;border-collapse:collapse;margin-bottom:28px}
    thead tr{background:#f8fafc}
    th{text-align:left;padding:10px 14px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;border-bottom:1px solid #e2e8f0}
    th:last-child,td:last-child{text-align:right}
    td{padding:12px 14px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9}
    .totals{display:flex;flex-direction:column;align-items:flex-end;gap:6px}
    .total-row{display:flex;gap:60px;font-size:13px;color:#64748b}
    .total-row.grand{font-size:16px;font-weight:800;color:#0f172a;margin-top:8px;border-top:1px solid #e2e8f0;padding-top:10px}
    .footer{margin-top:40px;text-align:center;font-size:11px;color:#94a3b8}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-no">#${order.invoiceNo}</div>
    </div>
    <div class="brand">
      <div class="brand-name">Blueberry CRM</div>
      <div class="brand-addr">123 E-Commerce Blvd<br/>Suite 400, Tech City</div>
    </div>
  </div>
  <hr class="divider"/>
  <div class="meta">
    <div class="meta-block">
      <div class="meta-label">Billed To</div>
      <div class="meta-value">${order.customerName || `Unknown Customer (ID: ${order.customerId})`}</div>
      <div class="meta-sub">Customer ID: ${order.customerId || '—'}</div>
    </div>
    <div class="meta-block meta-right">
      <div class="meta-label">Order Details</div>
      <div class="meta-sub">Date: <strong>${order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</strong></div>
      <div class="meta-sub" style="margin-top:4px">Status: <span class="status-badge">${order.orderStatus}</span></div>
    </div>
  </div>
  <hr class="divider"/>
  <table>
    <thead>
      <tr>
        <th>Item Description</th>
        <th>Size</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${order.productTitle || `Unknown Product (ID: ${order.productId})`}</td>
        <td>${order.size || 'M'}</td>
        <td>${order.qty}</td>
        <td><strong>$${subtotal.toLocaleString()}</strong></td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>$${subtotal.toLocaleString()}</span></div>
    <div class="total-row"><span>Tax (0%)</span><span>$${tax.toFixed(2)}</span></div>
    <div class="total-row grand"><span>Total</span><span>$${total.toLocaleString()}</span></div>
  </div>
  <div class="footer">Thank you for your business! · Blueberry CRM</div>
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-800">Invoice Detail</h2>
            <p className="text-xs text-slate-400 mt-0.5">#{order.invoiceNo}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-blue-200"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="px-8 py-6">
          {/* Title + Brand */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">INVOICE</h1>
              <p className="text-sm text-slate-400 mt-1">#{order.invoiceNo}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-blue-600">Blueberry CRM</p>
              <p className="text-xs text-slate-400 mt-1">123 E-Commerce Blvd</p>
              <p className="text-xs text-slate-400">Suite 400, Tech City</p>
            </div>
          </div>

          <hr className="border-slate-100 mb-5" />

          {/* Billed To / Order Details */}
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Billed To</p>
              <p className="font-bold text-slate-800">
                {order.customerName || `Unknown Customer (ID: ${order.customerId})`}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Customer ID: {order.customerId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Order Details</p>
              <p className="text-xs text-slate-500">
                Date: <span className="font-semibold text-slate-700">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                </span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Status:{' '}
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[order.orderStatus] || 'bg-slate-100 text-slate-500'}`}>
                  {order.orderStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-xs uppercase tracking-wider text-slate-400 font-semibold pb-3">Item Description</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-slate-400 font-semibold pb-3">Size</th>
                <th className="text-center py-2 text-xs uppercase tracking-wider text-slate-400 font-semibold pb-3">Qty</th>
                <th className="text-right py-2 text-xs uppercase tracking-wider text-slate-400 font-semibold pb-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3 text-slate-700">
                  {order.productTitle || `Unknown Product (ID: ${order.productId})`}
                </td>
                <td className="py-3 text-center text-slate-500">{order.size || 'M'}</td>
                <td className="py-3 text-center text-slate-500">{order.qty}</td>
                <td className="py-3 text-right font-bold text-slate-800">${(order.dueAmount ?? 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex flex-col items-end gap-1.5 text-sm border-t border-slate-100 pt-4">
            <div className="flex justify-between w-52">
              <span className="text-slate-400">Subtotal</span>
              <span className="text-slate-600">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between w-52">
              <span className="text-slate-400">Tax (0%)</span>
              <span className="text-slate-600">$0.00</span>
            </div>
            <div className="flex justify-between w-52 mt-2 pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">Total</span>
              <span className="font-bold text-slate-800">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Orders Page ────────────────────────────────────────────── */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      const matchSearch = o.customerName?.toLowerCase().includes(q)
        || String(o.invoiceNo).includes(q)
        || o.productTitle?.toLowerCase().includes(q);
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
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.msg}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedOrder && (
        <InvoiceModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isAdmin ? 'Orders' : 'My Orders'}</h1>
          <p className="text-sm text-slate-500 mt-1">{filtered.length} {isAdmin ? 'orders found' : 'purchases in history'}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={isAdmin ? 'Search by customer, invoice...' : 'Search by product or invoice...'}
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

      {/* Table */}
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
                  <th className="text-left px-5 py-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Invoice</th>
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
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.orderStatus] || 'bg-slate-100 text-slate-500'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    {/* View Invoice button */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View
                      </button>
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
                  <tr><td colSpan={9} className="text-center py-16 text-slate-400">No orders found</td></tr>
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
