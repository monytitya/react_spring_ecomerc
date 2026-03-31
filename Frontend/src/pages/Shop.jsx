import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api/api';
import { Search, Filter, ArrowRight, Grid, List as ListIcon, Star, ShoppingBag, Heart, ChevronDown } from 'lucide-react';

const ProductListItem = ({ image, title, price, oldPrice, label, rating, reviews }) => (
   <div className="card !p-0 overflow-hidden group border border-slate-100 flex flex-col md:flex-row h-auto bg-white mb-6">
      <div className="relative overflow-hidden w-full md:w-[300px] h-[300px] md:h-auto bg-[#f8f9fa] flex items-center justify-center p-8">
         <img
            src={image}
            alt={title}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
         />
         {label && <span className="absolute top-4 left-4 badge badge-success !rounded-sm px-3 !text-[10px] shadow-sm">{label}</span>}
      </div>

      <div className="p-8 flex-1 flex flex-col justify-center">
         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Modern Collection</p>
         <h4 className="text-xl font-bold text-slate-800 group-hover:text-shop-primary transition-colors mb-4 italic">
            {title}
         </h4>
         <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
               <Star key={i} size={14} className={i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-slate-300'} />
            ))}
            <span className="text-xs text-slate-400 font-bold ml-1">({reviews} reviews)</span>
         </div>
         <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-3 leading-relaxed">
            Experience the pinnacle of design with this precision-crafted product. Perfect for discerning customers who demand quality and style. Includes premium materials and advanced craftsmanship.
         </p>
         <div className="flex items-center gap-6 mb-8">
            <span className="text-3xl font-black text-slate-900">${price.toFixed(2)}</span>
            {oldPrice && <span className="text-lg font-semibold text-slate-300 line-through">${oldPrice.toFixed(2)}</span>}
         </div>
         <div className="flex gap-4">
            <button className="bg-shop-primary text-white px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-black hover:scale-105 transition-all shadow-lg shadow-shop-primary/10 flex items-center gap-2">
               Add to Cart <ShoppingBag size={18} />
            </button>
            <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all shadow-sm">
               <Heart size={20} />
            </button>
         </div>
      </div>
   </div>
);

const FilterSection = ({ title, children }) => (
   <div className="py-8 border-b border-slate-100 last:border-0">
      <div className="flex justify-between items-center mb-6">
         <h5 className="font-black text-slate-800 text-sm uppercase tracking-widest italic">{title}</h5>
         <ChevronDown size={14} className="text-slate-300" />
      </div>
      <div className="space-y-3">
         {children}
      </div>
   </div>
);

const Shop = () => {
   const [products, setProducts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [manufacturers, setManufacturers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            const [prodRes, catRes, manRes] = await Promise.all([
               api.get('/products'),
               api.get('/categories'),
               api.get('/manufacturers')
            ]);

            setProducts(prodRes.data.data.content || prodRes.data.data);
            setCategories(catRes.data.data || []);
            setManufacturers(manRes.data.data || []);
            setLoading(false);
         } catch (err) {
            console.error('Failed to fetch shop data:', err);
            setError('Failed to connect to store inventory.');
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   return (
      <div className="max-w-[1440px] mx-auto py-20 px-8">
         <div className="bg-[#f8f9fa] rounded-3xl p-20 mb-20 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-shop-primary/5 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-12 -translate-x-12 blur-3xl"></div>

            <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">THE <span className="text-shop-primary">COLLECTION.</span></h1>
            <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
               Home <span>/</span> Modern Store <span>/</span> All Products
            </div>
         </div>

         <div className="grid grid-cols-12 gap-12">
            <aside className="col-span-3 hidden lg:block space-y-10">
               <div className="relative group">
                  <input
                     type="text"
                     placeholder="Search products..."
                     className="w-full bg-white border border-slate-100 rounded-xl py-4 pl-12 pr-4 text-sm font-medium focus:shadow-lg outline-none transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-shop-primary transition-colors" size={20} />
               </div>

               <div>
                  <FilterSection title="Categories">
                     {loading ? (
                        <div className="animate-pulse space-y-2">
                           {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-50 w-full rounded"></div>)}
                        </div>
                     ) : categories.length > 0 ? (
                        categories.map(cat => (
                           <div key={cat.catId} className="flex items-center justify-between group cursor-pointer">
                              <span className="text-sm font-bold text-slate-500 group-hover:text-shop-primary transition-colors">{cat.catTitle}</span>
                              <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-shop-primary/10 group-hover:text-shop-primary transition-all">{cat.productCount || 0}</span>
                           </div>
                        ))
                     ) : (
                        <p className="text-xs text-slate-300 italic">No categories</p>
                     )}
                  </FilterSection>

                  <FilterSection title="Manufacturers">
                     {loading ? (
                        <div className="animate-pulse space-y-2">
                           {[1, 2, 3].map(i => <div key={i} className="h-4 bg-slate-50 w-full rounded"></div>)}
                        </div>
                     ) : manufacturers.length > 0 ? (
                        manufacturers.map(man => (
                           <div key={man.manufacturerId} className="flex items-center justify-between group cursor-pointer">
                              <span className="text-sm font-bold text-slate-500 group-hover:text-shop-primary transition-colors">{man.manufacturerTitle}</span>
                              <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full group-hover:bg-shop-primary/10 group-hover:text-shop-primary transition-all">{man.productCount || 0}</span>
                           </div>
                        ))
                     ) : (
                        <p className="text-xs text-slate-300 italic">No manufacturers</p>
                     )}
                  </FilterSection>

                  <FilterSection title="Price Range">
                     <div className="space-y-6">
                        <div className="h-1 bg-slate-100 rounded-full relative">
                           <div className="absolute left-[10%] right-[30%] h-full bg-shop-primary rounded-full"></div>
                           <div className="absolute left-[10%] -translate-x-1/2 -top-2 w-5 h-5 bg-white border-2 border-shop-primary rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                           <div className="absolute right-[30%] translate-x-1/2 -top-2 w-5 h-5 bg-white border-2 border-shop-primary rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                        </div>
                        <div className="flex justify-between font-black text-xs text-slate-900 tracking-widest uppercase italic">
                           <span>$0.00</span>
                           <span>$5000.00</span>
                        </div>
                     </div>
                  </FilterSection>
               </div>
            </aside>
            <div className="col-span-12 lg:col-span-9 space-y-8">
               <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
                  <div className="flex items-center gap-4">
                     <button className="w-12 h-12 bg-black text-white rounded-xl shadow-lg flex items-center justify-center"><Grid size={20} /></button>
                     <button className="w-12 h-12 bg-white text-slate-400 hover:text-shop-primary rounded-xl border border-slate-100 flex items-center justify-center"><ListIcon size={20} /></button>
                     <span className="text-sm font-bold text-slate-400 ml-4 uppercase tracking-widest hidden sm:block">
                        {loading ? 'Inventory audit...' : `In Stock: ${products.length} Products`}
                     </span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest hidden sm:block italic">Sort By:</span>
                     <div className="bg-white border border-slate-100 px-6 py-3 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-3 hover:shadow-md transition-all">
                        Most Popular <ChevronDown size={14} />
                     </div>
                  </div>
               </div>

               <div className="fade-in min-h-[600px]">
                  {loading ? (
                     [1, 2, 3].map(i => <div key={i} className="animate-pulse bg-slate-50 h-[300px] mb-6 rounded-2xl"></div>)
                  ) : products.length > 0 ? (
                     products.map(item => (
                        <ProductListItem
                           key={item.productId}
                           title={item.productTitle}
                           price={item.productPrice || 0}
                           oldPrice={item.productPspPrice}
                           label={item.productLabel || 'MODERN'}
                           rating={5}
                           reviews={24}
                           image={getImageUrl(item.productImg1)}
                        />
                     ))
                  ) : (
                     <div className="py-20 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                        <p className="text-lg font-bold text-slate-300 italic uppercase tracking-widest">Inventory is empty.</p>
                     </div>
                  )}
               </div>

               <div className="flex justify-center pt-12">
                  <div className="flex gap-2">
                     <button className="w-12 h-12 bg-white border border-slate-100 text-slate-400 font-bold rounded-xl hover:bg-shop-primary hover:text-white hover:border-shop-primary transition-all">1</button>
                     <button className="w-12 h-12 bg-shop-primary text-white font-bold rounded-xl shadow-lg shadow-shop-primary/20">2</button>
                     <button className="w-12 h-12 bg-white border border-slate-100 text-slate-400 font-bold rounded-xl hover:bg-shop-primary hover:text-white hover:border-shop-primary transition-all">3</button>
                     <button className="w-12 h-12 bg-white border border-slate-100 text-slate-400 font-bold rounded-xl hover:bg-shop-primary hover:text-white hover:border-shop-primary transition-all flex items-center justify-center"><ArrowRight size={18} /></button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Shop;
