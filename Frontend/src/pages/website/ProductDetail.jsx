import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag, Heart, Star, Truck, Shield, ArrowLeft, Minus, Plus,
  Check, Share2, Loader2, ShoppingCart
} from 'lucide-react';
import { productApi, cartApi, wishlistApi } from '../../services/api';

const BASE = 'http://localhost:9090/api/files/';
const img  = (f) => (f ? `${BASE}${f}` : null);

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [product, setProduct]     = useState(null);
  const [related,  setRelated]    = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [qty,      setQty]        = useState(1);
  const [size,     setSize]       = useState('M');
  const [inWish,   setInWish]     = useState(false);
  const [added,    setAdded]      = useState(false);
  const [tab,      setTab]        = useState('description');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!(localStorage.getItem('admin_token') || localStorage.getItem('customer_token'));

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    productApi.getById(id).then(r => {
      const p = r.data?.data || r.data;
      setProduct(p);
      // Related products
      if (p?.categoryId) {
        productApi.getByCategory(p.categoryId).then(r2 => {
          const list = (r2.data?.data || r2.data || []).filter(x => x.productId !== p.productId);
          setRelated(list.slice(0, 4));
        }).catch(() => {});
      }
    }).catch(() => navigate('/shop'))
      .finally(() => setLoading(false));

    if (user?.id) {
      wishlistApi.get(user.id).then(r => {
        const ids = (r.data?.data || []).map(w => w.productId);
        setInWish(ids.includes(Number(id)));
      }).catch(() => {});
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      await cartApi.add({ productId: product.productId, qty, size });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch { navigate('/login'); }
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    await wishlistApi.toggle(user.id, product.productId).catch(() => {});
    setInWish(w => !w);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );
  if (!product) return null;

  const image   = img(product.imageName || product.imageFile);
  const price   = product.salePrice ?? product.price ?? 0;
  const oldPrice = product.price && product.salePrice && product.salePrice < product.price ? product.price : null;
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/home" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xl group">
              {image ? (
                <img
                  src={image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={e => { e.target.style.display='none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-24 h-24 text-slate-200" />
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl">
                  -{discount}%
                </div>
              )}
              {product.label && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wide">
                  {product.label}
                </div>
              )}
            </div>
            {/* Actions row below image */}
            <div className="flex gap-3">
              <button
                onClick={handleWishlist}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${inWish ? 'border-red-400 text-red-500 bg-red-50' : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'}`}
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-red-500' : ''}`} />
                {inWish ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                onClick={() => navigator.share?.({ title: product.title, url: window.location.href }).catch(() => {})}
                className="px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {/* Category */}
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">
              {product.categoryName || product.manufacturerName || 'Blueberry Collection'}
            </p>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-sm text-slate-500">4.0 · 24 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-slate-100">
              <span className="text-4xl font-black text-slate-900">${price}</span>
              {oldPrice && (
                <>
                  <span className="text-xl text-slate-400 line-through">${oldPrice}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{product.shortDescription}</p>
            )}

            {/* Size Picker */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-slate-700 text-sm">Size</p>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">Size Guide</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                      size === s
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-4 mb-8">
              {/* Qty */}
              <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="px-4 py-3 hover:bg-slate-200 transition-colors"
                >
                  <Minus className="w-4 h-4 text-slate-700" />
                </button>
                <span className="px-5 font-bold text-slate-800 min-w-[3rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="px-4 py-3 hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl font-black text-sm transition-all shadow-lg ${
                  added
                    ? 'bg-green-500 text-white shadow-green-500/25'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                }`}
              >
                {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
            </div>

            {/* Checkout direct */}
            <button
              onClick={() => { handleAddToCart(); setTimeout(() => navigate('/cart'), 300); }}
              className="w-full py-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-black text-sm hover:bg-blue-50 transition-colors mb-8"
            >
              Buy Now
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck,   label: 'Free Shipping', sub: 'Orders over $50' },
                { icon: Shield,  label: 'Secure Pay',    sub: '100% protected' },
                { icon: Check,   label: 'Easy Returns',  sub: '30-day policy' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-slate-50 rounded-2xl p-3 text-center">
                  <Icon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-1 border-b border-slate-100 mb-8">
            {['description', 'details', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-bold capitalize transition-all ${
                  tab === t
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === 'description' && (
            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
              {product.description || product.shortDescription || (
                <p>No description available for this product.</p>
              )}
            </div>
          )}
          {tab === 'details' && (
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {[
                ['SKU', `PRD-${product.productId}`],
                ['Category', product.categoryName || '—'],
                ['Brand', product.manufacturerName || '—'],
                ['Label', product.label || '—'],
                ['Weight', '0.5 kg'],
                ['Sizes', SIZES.join(', ')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-3 border-b border-slate-100 text-sm">
                  <span className="font-semibold text-slate-500">{k}</span>
                  <span className="font-bold text-slate-800">{v}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && (
            <div className="space-y-6 max-w-2xl">
              {[
                { name: 'Alex T.', stars: 5, text: 'Absolutely love this product! Great quality and fast delivery.', date: '2026-03-15' },
                { name: 'Jane R.', stars: 4, text: 'Really nice product, just a bit smaller than I expected from the photos.', date: '2026-02-28' },
                { name: 'Chris M.', stars: 5, text: 'Perfect gift! Very happy with the purchase.', date: '2026-02-10' },
              ].map(r => (
                <div key={r.name} className="bg-slate-50 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{r.name}</p>
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><Star key={s} className={`w-3 h-3 ${s<=r.stars?'fill-amber-400 text-amber-400':'text-slate-200'}`}/>)}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-600">"{r.text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <div
                  key={p.productId}
                  onClick={() => navigate(`/product/${p.productId}`)}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-slate-50 overflow-hidden">
                    {img(p.imageName || p.imageFile)
                      ? <img src={img(p.imageName || p.imageFile)} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>{e.target.style.display='none';}}/>
                      : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-slate-200"/></div>
                    }
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{p.title}</h3>
                    <span className="font-black text-slate-900">${p.salePrice ?? p.price ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
