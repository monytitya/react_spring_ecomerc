import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  Phone,
  Mail,
  ChevronDown,
  Globe,
  Share2
} from 'lucide-react'; 

const TopBar = () => (
  <div className="bg-white border-b border-slate-100 py-2.5 px-8 hidden lg:block">
    <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[13px] text-slate-500">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
          <Phone size={14} /> <span>+1 (23) 4567 890</span>
        </div>
        <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
          <Mail size={14} /> <span>support@pressmart.com</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="hover:text-primary cursor-pointer transition-colors">Welcome to Our Store!</span>
        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">English <ChevronDown size={14} /></div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">$ Dollar (US) <ChevronDown size={14} /></div>
        </div>
      </div>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="bg-white py-6 px-8 sticky top-0 z-50 shadow-sm border-b border-slate-50">
    <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-12">
      {/* Logo */}
      <NavLink to="/" className="text-3xl font-extrabold tracking-tighter text-slate-800 shrink-0">
        Press<span className="text-shop-primary">Mart.</span>
      </NavLink>

      {/* Search Bar - PressMart Style */}
      <div className="flex-1 max-w-2xl hidden md:flex items-center">
        <div className="flex-1 relative flex items-center">
            <div className="absolute left-4 border-r pr-4 text-sm font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:text-shop-primary transition-colors">
                All Categories <ChevronDown size={14} />
            </div>
            <input 
              type="text" 
              placeholder="Search for products, categories, sku..." 
              className="w-full bg-[#f8f9fa] border-none rounded-l-lg py-3.5 pl-[150px] pr-4 outline-none text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-shop-primary/20 transition-all font-medium"
            />
            <button className="bg-shop-primary text-white p-3.5 rounded-r-lg hover:bg-shop-primary/90 transition-all shadow-lg shadow-shop-primary/10">
              <Search size={20} />
            </button>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-8 shrink-0">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2.5 rounded-full bg-slate-50 group-hover:bg-shop-primary group-hover:text-white transition-all duration-300">
            <User size={22} className="group-hover:scale-110 transition-transform" />
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">My Account</p>
            <p className="text-sm font-bold text-slate-700">Login/Register</p>
          </div>
        </div>

        <div className="relative group cursor-pointer flex flex-col items-center">
           <div className="p-2.5 relative group-hover:text-shop-primary transition-colors">
             <Heart size={22} className="group-hover:scale-110 transition-transform" />
             <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 min-w-[18px] bg-shop-primary text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">0</span>
           </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wishlist</span>
        </div>

        <div className="relative group cursor-pointer flex flex-col items-center">
           <div className="p-2.5 relative group-hover:text-shop-primary transition-colors">
             <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
             <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 min-w-[18px] bg-secondary text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">0</span>
           </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Cart</span>
        </div>
      </div>
    </div>
  </nav>
);

const CategoryBar = () => (
    <div className="bg-[#00b894] py-3.5 px-8 text-white hidden lg:block shadow-md">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 px-6 py-2.5 bg-black/10 rounded-lg cursor-pointer hover:bg-black/20 transition-all font-bold text-sm tracking-wider uppercase">
                <Menu size={18} /> Shopping By Categories
            </div>

            <div className="flex items-center gap-10 font-bold text-sm uppercase tracking-wider">
                <NavLink to="/" className="hover:text-black/50 transition-colors">Home <ChevronDown size={12} className="inline ml-1" /></NavLink>
                <NavLink to="/shop" className="hover:text-black/50 transition-colors">Shop <ChevronDown size={12} className="inline ml-1" /></NavLink>
                <NavLink to="/pages" className="hover:text-black/50 transition-colors">Pages <ChevronDown size={12} className="inline ml-1" /></NavLink>
                <NavLink to="/blog" className="hover:text-black/50 transition-colors">Blog <ChevronDown size={12} className="inline ml-1" /></NavLink>
                <NavLink to="/elements" className="hover:text-black/50 transition-colors">Elements <ChevronDown size={12} className="inline ml-1" /></NavLink>
                <NavLink to="/buy" className="hover:text-black/50 transition-colors underline decoration-2 underline-offset-4 decoration-white/30">Buy PressMart</NavLink>
            </div>

            <div className="flex items-center gap-4">
                <Globe size={16} className="cursor-pointer hover:scale-125 transition-transform" />
                <Share2 size={16} className="cursor-pointer hover:scale-125 transition-transform" />
            </div>
        </div>
    </div>
);

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-20 px-8 border-t border-slate-800">
     <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
           <h3 className="text-white text-3xl font-extrabold italic">Press<span className="text-shop-primary">Mart.</span></h3>
           <p className="text-sm leading-relaxed">The best e-commerce solution for your modern business. High performance, zero hassle.</p>
           <div className="flex items-center gap-4">
              <Globe className="hover:text-white transition-colors cursor-pointer" />
              <Share2 className="hover:text-white transition-colors cursor-pointer" />
           </div>
        </div>
        <div className="space-y-6">
           <h4 className="text-white font-bold text-lg">Shop by Categories</h4>
           <ul className="space-y-3 text-sm font-medium">
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Fashion & Lifestyle</li>
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Electronics & Gadgets</li>
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Home & Kitchen</li>
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Books & Media</li>
           </ul>
        </div>
        <div className="space-y-6">
           <h4 className="text-white font-bold text-lg">Quick Links</h4>
           <ul className="space-y-3 text-sm font-medium">
             <li className="hover:text-shop-primary cursor-pointer transition-colors">About Us</li>
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Contact Support</li>
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Our Blog</li>
             <li className="hover:text-shop-primary cursor-pointer transition-colors">Privacy Policy</li>
           </ul>
        </div>
        <div className="space-y-6">
           <h4 className="text-white font-bold text-lg">Contact Info</h4>
           <ul className="space-y-3 text-sm font-medium">
             <li>+1 (23) 4567 890</li>
             <li>support@pressmart.com</li>
             <li>123 E-commerce Street, CA 90210</li>
           </ul>
        </div>
     </div>
  </footer>
);

const ShopLayout = ({ children }) => {
  return (
    <div className="shop-layout min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <CategoryBar />
      <main className="fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ShopLayout;
