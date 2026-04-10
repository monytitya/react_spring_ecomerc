import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, RefreshCw, Headphones, ChevronRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { productApi, catalogApi, fileUrl } from '../../services/api';

const BASE = 'http://localhost:9090/api/files/';
const img  = (f) => (f ? `${BASE}${f}` : null);

/* --- Original Beautiful Product Card --- */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const image = img(product.productImg || product.imageName || product.imageFile);
  const currentPrice = product.productPrice ?? product.price ?? 0;
  const oldPrice = product.productPspPrice ?? product.salePrice ?? 0;
  const discount = oldPrice > 0 && oldPrice > currentPrice
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/product/${product.productId}`)}
      className="group bg-white rounded-3xl p-4 shadow-sm border border-slate-100/60 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4">
        {image ? (
          <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" onError={e=>{e.target.style.display='none';}} />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-12 h-12 text-slate-200" /></div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {(product.productLabel || product.label) && (
             <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/30">
               {product.productLabel || product.label}
             </span>
          )}
          {discount > 0 && (
             <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
               -{discount}% OFF
             </span>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
          <span className="text-xs font-bold text-slate-400 ml-1">(4.9)</span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.productTitle || product.title}
        </h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-black text-slate-900">${currentPrice}</span>
            {discount > 0 && <span className="text-sm font-bold text-slate-400 line-through ml-2">${oldPrice}</span>}
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      productApi.getFeatured().catch(()=>({data:{data:[]}})),
      catalogApi.getTopCategories().catch(()=>({data:{data:[]}}))
    ]).then(([f, c]) => {
      setFeatured(f.data?.data || f.data || []);
      setCategories(c.data?.data || c.data || []);
    });
  }, []);

  const FEATURES = [
    { icon: Truck, title: 'Free Global Shipping', desc: 'On all orders over $150. Fast & trackable.', bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: Shield, title: 'Secure Checkout', desc: '256-bit SSL encryption for your peace of mind.', bg: 'bg-green-50', text: 'text-green-600' },
    { icon: RefreshCw, title: '30-Day Returns', desc: 'Not 100% satisfied? Return it hassle-free.', bg: 'bg-purple-50', text: 'text-purple-600' },
    { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always here to help.', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* --- HERO SECTION --- */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-8 lg:py-12 mt-[72px]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-400/20 via-indigo-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-400/10 via-pink-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0f172a] rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-blue-900/20">
            {/* Background design elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12 lg:p-20">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 mb-8 w-fit mx-auto lg:mx-0">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-bold text-white tracking-wide">New Summer Collection</span>
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6">
                  Elevate Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Lifestyle</span>
                </h1>
                <p className="text-lg text-slate-300 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                  Discover premium products designed to make every day extraordinary. Shop the latest trends with exclusive deals.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button onClick={() => navigate('/shop')} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/30 transition-all hover:shadow-blue-600/50 hover:-translate-y-1 flex items-center justify-center gap-2">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => navigate('/shop?label=new')} className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-sm uppercase tracking-wider rounded-2xl backdrop-blur transition-all border border-white/10 flex items-center justify-center">
                    Explore New
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-12 border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc, bg, text }) => (
              <div key={title} className="flex flex-col items-center text-center group cursor-pointer">
                <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${text}`} />
                </div>
                <h3 className="font-black text-slate-800 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[200px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      {categories.length > 0 && (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shop by Category</h2>
                <p className="text-slate-500 mt-2 font-medium">Find exactly what you're looking for</p>
              </div>
              <button onClick={() => navigate('/shop')} className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map(cat => {
                const id = cat.catId || cat.categoryId;
                const title = cat.catTitle || cat.name;
                const image = cat.catImage || cat.image || cat.imageName;
                return (
                <div 
                  key={id}
                  onClick={() => navigate(`/shop?category=${id}`)}
                  className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <img src={img(image)} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={e=>{e.target.style.display='none';}} />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                    <h3 className="text-white font-black text-xl mb-1">{title}</h3>
                    <p className="text-blue-300 text-sm font-semibold flex items-center gap-1 group-hover:text-white transition-colors">
                      Explore <ChevronRight className="w-4 h-4" />
                    </p>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </section>
      )}

      {/* --- FEATURED PRODUCTS --- */}
      {featured.length > 0 && (
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="flex items-center gap-3 text-3xl font-black text-slate-900 tracking-tight">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  Featured Products
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Hand-picked selections just for you</p>
              </div>
              <button onClick={() => navigate('/shop')} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors">
                View Collection
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map(p => <ProductCard key={p.productId} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* --- BOTTOM CTA --- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <Zap className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">Ready to upgrade your shopping experience?</h2>
            <p className="text-blue-100 font-medium text-lg mb-10">Join thousands of happy customers and discover why Blueberry is the #1 choice for premium products.</p>
            <button onClick={() => navigate('/shop')} className="px-10 py-5 bg-white text-blue-700 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Start Shopping Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
