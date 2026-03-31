import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  ChevronRight,
  ArrowLeft,
  Search,
  Grid
} from 'lucide-react';

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const product = {
    title: "Tan Solid Laptop Backpack Professional Edition 2024",
    price: 149.0,
    oldPrice: 185.0,
    rating: 4.8,
    reviews: 124,
    description: "Experience the pinnacle of design with this precision-crafted laptop backpack. Perfect for discerning professionals who demand quality and style. Includes premium materials and advanced craftsmanship for maximum durability and comfort during daily commutes.",
    features: [
      "Water-resistant premium leather finish",
      "Ergonomic padded shoulder straps",
      "Dedicated 15.6-inch laptop compartment",
      "Internal organization pockets for accessories",
      "YKK professional grade self-healing zippers"
    ],
    sku: "BP-10293",
    category: "Accessories",
    tags: ["Fashion", "Backpack", "Professional", "Travel"],
    images: [
      "https://m.media-amazon.com/images/I/81L7uXp-9TL._AC_UF1000,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/71X8X8xZtCL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71jY5G5K8SL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71pLh0X5T6L._AC_SL1500_.jpg"
    ]
  };

  return (
    <div className="max-w-[1440px] mx-auto py-20 px-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">
         Home <ChevronRight size={14} /> Shop <ChevronRight size={14} /> {product.category} <ChevronRight size={14} /> <span className="text-shop-primary">Detail View</span>
      </div>

      <div className="grid grid-cols-12 gap-16">
        {/* Gallery Section */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
           <div className="relative aspect-square rounded-3xl bg-[#f8f9fa] border border-slate-100 overflow-hidden group">
              <img 
                src={product.images[selectedImage]} 
                className="w-full h-full object-contain p-12 group-hover:scale-105 transition-transform duration-700" 
                alt="Product" 
              />
              <div className="absolute top-6 left-6 badge badge-success !rounded-sm px-4 py-1.5 shadow-lg">18% OFF</div>
              <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-shop-primary shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                 <Search size={20} />
              </button>
           </div>
           
           <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                 <div 
                   key={i} 
                   onClick={() => setSelectedImage(i)}
                   className={`aspect-square rounded-xl bg-slate-50 border-2 cursor-pointer overflow-hidden transition-all p-3 ${selectedImage === i ? 'border-shop-primary shadow-lg shadow-shop-primary/10' : 'border-transparent hover:border-slate-200'}`}
                 >
                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="Thumb" />
                 </div>
              ))}
           </div>
        </div>

        {/* Content Section */}
        <div className="col-span-12 lg:col-span-6 space-y-10">
           <div className="space-y-4">
              <span className="text-xs font-black text-shop-primary uppercase tracking-[0.3em] font-content italic">Modern Professional Edition</span>
              <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tighter italic">
                {product.title}
              </h1>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1 text-warning">
                    {[...Array(5)].map((_, i) => (
                       <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'} />
                    ))}
                 </div>
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">({product.reviews} Customer Reviews)</span>
              </div>
              <div className="flex items-center gap-6 pt-2">
                 <span className="text-4xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                 <span className="text-xl font-bold text-slate-300 line-through">${product.oldPrice.toFixed(2)}</span>
              </div>
           </div>

           <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
             {product.description}
           </p>

           {/* Purchase Actions */}
           <div className="space-y-8 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-8">
                 <div className="flex items-center bg-slate-50 rounded-full p-1.5 border border-slate-100">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-shop-primary hover:bg-white transition-all text-xl font-black"
                    >-</button>
                    <span className="w-12 text-center text-lg font-black text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-12 h-12 rounded-full flex items-center justify-center text-slate-400 hover:text-shop-primary hover:bg-white transition-all text-xl font-black"
                    >+</button>
                 </div>
                 
                 <button className="flex-1 bg-shop-primary text-white py-5 rounded-full font-black text-lg uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(0,184,148,0.4)] hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                   Add to Cart <ShoppingBag size={24} />
                 </button>

                 <button className="w-[68px] h-[68px] border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-secondary hover:border-secondary transition-all shadow-sm">
                   <Heart size={28} />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                 <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-slate-50 rounded-2xl text-shop-primary group-hover:scale-110 transition-transform"><Truck size={24} /></div>
                    <div className="leading-tight">
                       <p className="text-xs font-black uppercase tracking-widest text-slate-900">Free Delivery</p>
                       <p className="text-[11px] font-bold text-slate-400">On all orders over $99</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 group">
                    <div className="p-3 bg-slate-50 rounded-2xl text-shop-primary group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
                    <div className="leading-tight">
                       <p className="text-xs font-black uppercase tracking-widest text-slate-900">Secure Payment</p>
                       <p className="text-[11px] font-bold text-slate-400">100% Secure Checkout</p>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Details Tabs */}
           <div className="pt-10 space-y-8">
              <div className="flex gap-12 border-b-2 border-slate-50">
                 {['description', 'features', 'specifications'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-shop-primary' : 'text-slate-300'}`}
                    >
                       {tab}
                       {activeTab === tab && <div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-shop-primary rounded-full fade-in"></div>}
                    </button>
                 ))}
              </div>
              <div className="fade-in min-h-[150px]">
                 {activeTab === 'features' ? (
                   <ul className="space-y-4">
                      {product.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-500 font-medium">
                           <div className="w-5 h-5 rounded-full bg-shop-primary/10 text-shop-primary flex items-center justify-center shrink-0"><Check size={14} /></div>
                           {f}
                        </li>
                      ))}
                   </ul>
                 ) : (
                   <p className="text-slate-500 font-medium leading-relaxed italic">{product.description}</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
