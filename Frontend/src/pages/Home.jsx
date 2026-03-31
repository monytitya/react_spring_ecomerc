import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api/api';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star, 
  Watch, 
  Gift, 
  Smartphone, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  Headphones 
} from 'lucide-react';

const CategoryCard = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center gap-4 group cursor-pointer">
    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-shop-primary group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-shop-primary/20">
      <Icon size={32} className="group-hover:scale-110 transition-transform" />
    </div>
    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-shop-primary transition-colors">{title}</span>
  </div>
);

const ProductCard = ({ image, title, price, oldPrice, label, rating, reviews }) => (
  <div className="card !p-0 overflow-hidden group border border-slate-100 flex flex-col h-full bg-white relative">
    {label && (
       <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
           <span className="badge badge-success !rounded-sm px-3 !text-[10px] shadow-sm">{label}</span>
           {label === 'Featured' && <span className="bg-warning text-white text-[9px] font-black italic px-2 py-0.5 rounded shadow-sm text-center">BEST</span>}
       </div>
    )}
    <div className="relative overflow-hidden aspect-[4/5] bg-[#f8f9fa] flex items-center justify-center p-8">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Quick Action Overlay */}
      <div className="absolute bottom-4 left-0 right-0 px-4 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
         <button className="flex-1 bg-white text-slate-800 py-2.5 rounded text-xs font-bold hover:bg-shop-primary hover:text-white transition-colors shadow-lg">Quick View</button>
         <button className="w-10 h-10 bg-shop-primary text-white rounded flex items-center justify-center hover:bg-black transition-colors shadow-lg">
            <ShoppingBag size={18} />
         </button>
      </div>
    </div>
    
    <div className="p-5 flex-1 flex flex-col">
       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accessories</p>
       <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-shop-primary transition-colors mb-2 line-clamp-2">
         {title}
       </h4>
       <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
             <Star key={i} size={12} className={i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-slate-300'} />
          ))}
          <span className="text-[10px] text-slate-400 font-bold ml-1">({reviews})</span>
       </div>
       <div className="mt-auto flex items-center gap-3">
          <span className="text-lg font-black text-slate-900">${price.toFixed(2)}</span>
          {oldPrice && <span className="text-sm font-semibold text-slate-400 line-through">${oldPrice.toFixed(2)}</span>}
       </div>
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="flex items-center gap-6 p-10 border-r border-slate-100 last:border-0 group">
     <div className="text-shop-primary group-hover:scale-110 transition-transform duration-300">
        <Icon size={48} strokeWidth={1} />
     </div>
     <div>
        <h5 className="font-bold text-slate-800 text-lg">{title}</h5>
        <p className="text-sm text-slate-500 font-medium">{desc}</p>
     </div>
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products/featured');
        // Structure is ApiResponse<List<ProductModel>>
        setFeaturedProducts(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Connection to backend failed.');
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="pb-20 bg-white">
      {/* Hero Section - PressMart Style */}
      <section className="relative h-[800px] bg-[#f9f9f9] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/ecommerce_hero_banner_1774890068836.png" 
            className="w-full h-full object-cover object-center translate-x-12 scale-105" 
            alt="Hero Background" 
          />
        </div>
        <div className="max-w-[1440px] mx-auto h-full px-8 relative z-10 flex flex-col justify-center gap-12">
           <div className="space-y-6 max-w-2xl fade-in">
              <span className="block text-shop-primary font-black uppercase tracking-[0.3em] text-sm italic">Summer Sale collections</span>
              <h1 className="text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                MODERN <br />
                <span className="text-shop-primary">COLLECTIONS.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
                Experience the finest selection of hand-crafted products designed for contemporary life. Get up to 65% OFF this summer.
              </p>
              <div className="flex items-center gap-6 pt-6">
                <button className="bg-shop-primary text-white px-12 py-5 rounded-full font-black text-lg hover:bg-black hover:scale-105 transition-all shadow-[0_15px_30px_-5px_rgba(0,184,148,0.4)] flex items-center gap-3 group">
                   Shop Now <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button className="border-2 border-slate-200 text-slate-800 px-12 py-5 rounded-full font-black text-lg hover:border-shop-primary hover:text-shop-primary transition-all">
                   Read More
                </button>
              </div>
           </div>
        </div>
      </section>

      {/* Categories Row */}
      <section className="max-w-[1440px] mx-auto py-24 px-8 grid grid-cols-10 gap-8 overflow-x-auto scrollbar-hide">
        <CategoryCard icon={ShoppingBag} title="Fashion" />
        <CategoryCard icon={Watch} title="Watches" />
        <CategoryCard icon={Smartphone} title="Electronics" />
        <CategoryCard icon={Gift} title="Beauty" />
        <CategoryCard icon={Star} title="Sports" />
        <CategoryCard icon={RefreshCw} title="Kids" />
        <CategoryCard icon={ShieldCheck} title="Jewellery" />
        <CategoryCard icon={Headphones} title="Gadgets" />
        <CategoryCard icon={ArrowRight} title="Others" />
        <CategoryCard icon={ShoppingBag} title="New" />
      </section>

      {/* Deals of the Day / Featured Products */}
      <section className="max-w-[1440px] mx-auto pb-24 px-8">
        <div className="flex items-center justify-between mb-12 border-b-2 border-slate-50 pb-6">
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Featured <span className="text-shop-primary">Deals</span></h2>
           <div className="flex items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-shop-primary transition-colors">
              View All Deals <ArrowRight size={18} />
           </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 min-h-[400px]">
           {loading ? (
             [...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-50 h-[400px] rounded-2xl"></div>
             ))
           ) : featuredProducts.length > 0 ? (
             featuredProducts.map(item => (
                <ProductCard 
                  key={item.productId}
                  title={item.productTitle} 
                  price={item.productPrice || 0} 
                  oldPrice={item.productPspPrice} 
                  label={item.productLabel || 'FEATURED'} 
                  rating={5} 
                  reviews={84}
                  image={getImageUrl(item.productImg1)} 
                />
             ))
           ) : (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                <p className="text-lg font-bold text-slate-300 italic uppercase tracking-widest">No Featured Products available.</p>
             </div>
           )}
        </div>
      </section>

      {/* Promotion Blocks */}
      <section className="max-w-[1440px] mx-auto pb-24 px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
         {['Sunglasses', 'Footwear', 'Accessories'].map((cat, i) => (
           <div key={cat} className="group relative h-[300px] overflow-hidden rounded-2xl cursor-pointer shadow-lg">
              <img 
                src={`https://images.unsplash.com/photo-${1523275335684 + i * 1000}-4e07add3d344?auto=format&fit=crop&q=80&w=800`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={cat} 
              />
              <div className="absolute inset-0 bg-black/60 opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-12 flex flex-col justify-center">
                 <h3 className="text-3xl font-black text-white mb-2">{cat}</h3>
                 <p className="text-white/80 font-bold mb-6 italic tracking-wider">Min. 45-80% Off</p>
                 <span className="text-sm font-black text-white uppercase tracking-widest underline decoration-2 underline-offset-8 decoration-shop-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                   Shop Now <ArrowRight size={16} />
                 </span>
              </div>
           </div>
         ))}
      </section>

      {/* Trust Features */}
      <section className="bg-white border-y border-slate-100 mb-24 py-12">
         <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 px-8">
            <Feature icon={Truck} title="Free Shipping" desc="On all orders over $99" />
            <Feature icon={RefreshCw} title="Easy Returns" desc="30 Days Money Back" />
            <Feature icon={ShieldCheck} title="Secure Payments" desc="100% Secure Gateway" />
            <div className="flex items-center gap-6 p-10 group">
               <div className="text-shop-primary group-hover:scale-110 transition-transform duration-300">
                  <Headphones size={48} strokeWidth={1} />
               </div>
               <div>
                  <h5 className="font-bold text-slate-800 text-lg">24/7 Support</h5>
                  <p className="text-sm text-slate-500 font-medium">Expert Online Help</p>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
