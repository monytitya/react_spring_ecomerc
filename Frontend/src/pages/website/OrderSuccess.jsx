import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, Truck, Home, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { orderApi } from '../../services/api';
import { useCart } from '../../context/CartContext';

const OrderSuccess = () => {
  const { invoiceNo } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart(); // Ensure badge is 0 after successful payment
    if (invoiceNo) {
      orderApi.getByInvoice(invoiceNo)
        .then(r => setOrder(r.data?.data || null))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [invoiceNo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 pt-20 flex flex-col items-center justify-center px-4">
      {/* Animated success check */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
        <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">Order Placed! 🎉</h1>
      <p className="text-slate-500 text-center mb-2 max-w-md">
        Thank you for your purchase. Your order has been confirmed and is being processed.
      </p>
      {invoiceNo && (
        <div className="flex items-center gap-2 mb-8 bg-white border border-slate-100 shadow-sm px-5 py-3 rounded-2xl">
          <Package className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-slate-500">Invoice:</span>
          <span className="font-black text-slate-900 text-sm">{invoiceNo}</span>
        </div>
      )}

      {/* Order tracking stepper */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-8">
        <h2 className="font-black text-slate-800 mb-6 text-center">What happens next?</h2>
        {[
          { icon: CheckCircle2, label: 'Order Confirmed', sub: 'Your order has been placed', done: true, color: 'emerald' },
          { icon: Package, label: 'Processing', sub: 'We are preparing your items', done: false, color: 'blue' },
          { icon: Truck, label: 'Shipped', sub: 'On its way to you', done: false, color: 'blue' },
          { icon: Home, label: 'Delivered', sub: 'Enjoy your purchase!', done: false, color: 'blue' },
        ].map((step, i, arr) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                <step.icon className="w-5 h-5" />
              </div>
              {i < arr.length - 1 && (
                <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-emerald-200' : 'bg-slate-100'}`} />
              )}
            </div>
            <div className="pb-6">
              <p className={`font-bold text-sm ${step.done ? 'text-emerald-700' : 'text-slate-500'}`}>{step.label}</p>
              <p className="text-xs text-slate-400">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Link
          to="/my-orders"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
        >
          <Package className="w-5 h-5" /> Track My Order
        </Link>
        <Link
          to="/shop"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black rounded-2xl hover:border-blue-300 hover:text-blue-700 transition-all"
        >
          <ShoppingBag className="w-5 h-5" /> Continue Shopping
        </Link>
      </div>

      {/* Rate us */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-400 mb-2">Enjoying your experience?</p>
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400 cursor-pointer hover:scale-110 transition-transform" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
