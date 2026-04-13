import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, X, Tag, ArrowRight, Loader2, ShoppingCart, Truck } from 'lucide-react';
import { cartApi, couponApi, orderApi, fileUrl } from '../../services/api';

const BASE = 'http://localhost:9090/api/files/';
const img  = (f) => (f ? `${BASE}${f}` : null);

const Cart = () => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [coupon,  setCoupon]  = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [updating, setUpdating] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!(localStorage.getItem('admin_token') || localStorage.getItem('customer_token'));

  const load = () => {
    if (!isLoggedIn) { setLoading(false); return; }
    cartApi.get().then(r => setItems(r.data?.data || [])).catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleQty = async (productId, qty) => {
    if (qty < 1) { handleRemove(productId); return; }
    setUpdating(productId);
    await cartApi.updateQty(productId, qty).catch(() => {});
    setItems(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i));
    setUpdating(null);
  };

  const handleRemove = async (productId) => {
    await cartApi.remove(productId).catch(() => {});
    setItems(prev => prev.filter(i => (i.pId || i.productId) !== productId));
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setPlacingOrder(true);
    try {
      // Get the customer ID if logged in (usually stored in localstorage or decoded from token)
      // For now, we'll try to find it from localStorage if it exists
      const customerStr = localStorage.getItem('customer');
      const customer = customerStr ? JSON.parse(customerStr) : null;
      
      // PlaceOrderRequest requires: customerId, dueAmount, qty, size, productId
      // We'll use the first item to simplify for this flow, or the backend could handle multiple (usually)
      // Standard flow: placeOrder creates a CustomerOrder and PendingOrder and returns it with invoiceNo
      const firstItem = items[0];
      const payload = {
        customerId: customer?.customerId || null,
        dueAmount: total,
        qty: firstItem.qty || 1,
        size: firstItem.size || 'M',
        productId: firstItem.pId || firstItem.productId
      };
      
      const res = await orderApi.placeOrder(payload);
      if (res.data?.success) {
        const invoiceNo = res.data.data.invoiceNo;
        navigate(`/checkout/${invoiceNo}`);
      } else {
        alert("Failed to place order: " + (res.data?.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Checkout error:", err);
      // Fallback if API fails
      navigate('/checkout/new');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCoupon = async () => {
    setCouponError('');
    try {
      const res = await couponApi.validate(coupon);
      const data = res.data?.data || res.data;
      if (data?.discountAmount) {
        setDiscount(data.discountAmount);
        setCouponApplied(true);
      } else if (data?.discountPercent) {
        setDiscount(Math.round(subtotal * data.discountPercent / 100));
        setCouponApplied(true);
      } else {
        setCouponError('Invalid coupon code');
      }
    } catch {
      setCouponError('Invalid or expired coupon');
    }
  };

  const subtotal  = items.reduce((s, i) => s + (i.productPrice ?? i.salePrice ?? i.price ?? 0) * i.qty, 0);
  const shipping  = subtotal >= 50 ? 0 : 9.99;
  const tax       = +(subtotal * 0.08).toFixed(2);
  const total     = +(subtotal - discount + shipping + tax).toFixed(2);

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <div className="text-center max-w-md px-4">
        <ShoppingCart className="w-20 h-20 text-slate-200 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-slate-800 mb-3">Your Cart</h1>
        <p className="text-slate-500 mb-8">Please sign in to view your cart and checkout.</p>
        <Link to="/login" className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 inline-block">
          Sign In to Continue
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-white">Shopping Cart</h1>
          <p className="text-white/60 mt-1 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-32"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag className="w-20 h-20 text-slate-200 mb-6" />
            <h2 className="text-2xl font-black text-slate-700 mb-3">Your cart is empty</h2>
            <p className="text-slate-400 text-sm mb-8">Add some products and come back here to checkout.</p>
            <Link to="/shop" className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/25">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping bar */}
              {subtotal < 50 && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">
                      Add <strong className="text-blue-600">${(50 - subtotal).toFixed(2)}</strong> more to get free shipping!
                    </p>
                    <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {subtotal >= 50 && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-bold text-green-700">🎉 You've unlocked free shipping!</p>
                </div>
              )}

              {/* Items */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {items.map((item, i) => {
                  const image  = img(item.productImg || item.imageName || item.imageFile);
                  const price  = item.productPrice ?? item.salePrice ?? item.price ?? 0;
                  const id = item.pId || item.productId;
                  return (
                    <div key={id} className={`flex gap-5 p-5 ${i > 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50/50 transition-colors`}>
                      {/* Image */}
                      <div
                        className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/${id}`)}
                      >
                        {image
                          ? <img src={image} alt={item.productTitle || item.title} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none';}} />
                          : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-slate-300" /></div>
                        }
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-slate-800 text-sm line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                          onClick={() => navigate(`/product/${id}`)}
                        >
                          {item.productTitle || item.title}
                        </h3>
                        {item.size && <p className="text-xs text-slate-400 mt-1">Size: {item.size}</p>}
                        <p className="font-black text-blue-600 mt-2">${price}</p>
                      </div>

                      {/* Qty + Remove */}
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => handleRemove(id)} className="text-slate-300 hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQty(id, item.qty - 1)}
                            disabled={updating === id}
                            className="px-2.5 py-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <span className="px-3 font-bold text-sm text-slate-800 min-w-[2rem] text-center">
                            {updating === id ? '…' : item.qty}
                          </span>
                          <button
                            onClick={() => handleQty(id, item.qty + 1)}
                            disabled={updating === id}
                            className="px-2.5 py-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>
                        <p className="font-black text-slate-900 text-sm">${(price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping */}
              <Link to="/shop" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
                ← Continue Shopping
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-black text-slate-900 text-lg mb-6">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Coupon Code</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value); setCouponError(''); setCouponApplied(false); setDiscount(0); }}
                        placeholder="Enter code"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                      />
                    </div>
                    <button
                      onClick={handleCoupon}
                      className="px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  {couponApplied && <p className="text-green-600 text-xs mt-1 font-semibold">✓ Coupon applied! You save ${discount}</p>}
                </div>

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-bold">-${discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-slate-800'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax (8%)</span>
                    <span className="font-bold text-slate-800">${tax}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex justify-between">
                    <span className="font-black text-slate-900 text-base">Total</span>
                    <span className="font-black text-slate-900 text-base">${total}</span>
                  </div>
                </div>

                {/* Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="mt-6 w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/40 disabled:opacity-50"
                >
                  {placingOrder ? 'Processing...' : 'Proceed to Checkout'} <ArrowRight className="w-5 h-5" />
                </button>

                {/* Payment icons */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-slate-400 mb-2">Secure payment powered by</p>
                  <div className="flex justify-center gap-2">
                    {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                      <span key={p} className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
