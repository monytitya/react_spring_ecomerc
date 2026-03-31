import React, { useState, useEffect } from 'react';
import api, { getImageUrl } from '../api/api';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  XCircle,
  FileText,
  Image as ImageIcon,
  Tag,
  Box,
  ChevronDown,
  ArrowUpRight
} from 'lucide-react';

const ProductRow = ({ product, status, stock, price, category }) => (
  <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer">
    <td className="py-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
           <img src={getImageUrl(product.image)} className="w-full h-full object-contain" alt={product.name} />
        </div>
        <div>
           <h6 className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors italic leading-tight">{product.name}</h6>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SKU: {product.sku || 'N/A'}</p>
        </div>
      </div>
    </td>
    <td className="py-5">
       <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter bg-slate-50 px-3 py-1.5 rounded-lg w-max border border-slate-100">
          <Tag size={14} className="text-primary" /> {category}
       </div>
    </td>
    <td className="py-5">
       <span className="text-sm font-black text-slate-900">${price.toFixed(2)}</span>
    </td>
    <td className="py-5">
       <div className="flex flex-col gap-1">
          <span className={`text-[10px] font-black uppercase tracking-widest ${stock > 20 ? 'text-success' : 'text-danger'}`}>{stock > 20 ? 'In Stock' : 'Low Stock'}</span>
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
             <div className={`h-full rounded-full transition-all duration-1000 ${stock > 20 ? 'bg-success' : 'bg-danger'}`} style={{width: `${Math.min(stock, 100)}%`}}></div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stock} Units</span>
       </div>
    </td>
    <td className="py-5">
       <span className={`badge ${status === 'Active' ? 'badge-primary' : status === 'Draft' ? 'badge-warning' : 'badge-danger'}`}>
          {status}
       </span>
    </td>
    <td className="py-5 text-right">
       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-md transition-all"><Eye size={16} /></button>
          <button className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-success hover:shadow-md transition-all"><Edit3 size={16} /></button>
          <button className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-danger hover:shadow-md transition-all"><Trash2 size={16} /></button>
       </div>
    </td>
  </tr>
);

const Ecommerce = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        // Extract contents from ApiResponse<Page<ProductModel>> structure
        // Assuming response.data is { status: 'SUCCESS', message: '...', data: { content: [...] } }
        const productList = response.data.data.content || response.data.data;
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Connection to backend failed. Please ensure Spring Boot is running.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 leading-none">Product Management</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
               Management <span>/</span> Ecommerce <span>/</span> Products
            </div>
         </div>
         <div className="flex items-center gap-4">
            <button className="bg-white border border-slate-100 text-slate-500 px-6 py-3 rounded-xl text-xs font-bold hover:shadow-md transition-all flex items-center gap-2">
               <Download size={16} /> Export CSV
            </button>
            <button className="bg-primary text-white px-8 py-3 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-xl shadow-primary/10">
               <Plus size={18} /> Add New Product
            </button>
         </div>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-6 py-4 rounded-xl text-sm font-bold flex items-center gap-3">
          <XCircle size={10} className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="card bg-primary text-white border-none p-8 flex justify-between items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="space-y-1 relative z-10">
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Total Products</h5>
               <h2 className="text-4xl font-black italic">{loading ? '...' : products.length}</h2>
               <p className="text-[10px] font-bold opacity-60 flex items-center gap-1 uppercase tracking-tighter">
                  <ArrowUpRight size={12} /> Live tracking from database
               </p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-xl relative z-10">
               <Box size={32} />
            </div>
         </div>
         
         <div className="card bg-white border-none p-8 flex justify-between items-center group">
            <div className="space-y-1">
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Active Listings</h5>
               <h2 className="text-4xl font-black text-slate-800 italic">{loading ? '...' : products.filter(p => p.status === 'Active').length}</h2>
               <p className="text-[10px] font-bold text-success flex items-center gap-1 uppercase tracking-tighter">
                  <CheckCircle size={12} /> Stable Status
               </p>
            </div>
            <div className="w-16 h-16 bg-success/10 text-success rounded-2xl flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform">
               <Clock size={32} />
            </div>
         </div>

         <div className="card bg-white border-none p-8 flex justify-between items-center group">
            <div className="space-y-1">
               <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Out of Stock</h5>
               <h2 className="text-4xl font-black text-slate-800 italic">0</h2>
               <p className="text-[10px] font-bold text-danger flex items-center gap-1 uppercase tracking-tighter">
                  <XCircle size={12} /> Requires Attention
               </p>
            </div>
            <div className="w-16 h-16 bg-danger/10 text-danger rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
               <XCircle size={32} />
            </div>
         </div>
      </div>

      {/* Product Table Card */}
      <div className="card border-none shadow-sm relative z-10 overflow-hidden">
         {/* Table Filters */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 pb-8 border-b border-slate-50">
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative group flex-1 md:w-[320px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name, sku, category..." 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:bg-white focus:shadow-lg outline-none transition-all placeholder:text-slate-400"
                  />
               </div>
               <button className="w-12 h-12 bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary rounded-xl hover:shadow-md transition-all">
                  <Filter size={18} />
               </button>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
               {['All Products', 'Active', 'Disabled'].map((filter, i) => (
                  <button key={filter} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/30'}`}>
                     {filter}
                  </button>
               ))}
            </div>
         </div>

         {/* Actual Table */}
         <div className="overflow-x-auto fade-in">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Fetching Inventory...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic border-b border-slate-50">
                       <th className="pb-6 w-2/5">Product Information</th>
                       <th className="pb-6">Category</th>
                       <th className="pb-6">Base Price</th>
                       <th className="pb-6">Stock Status</th>
                       <th className="pb-6">Visibility</th>
                       <th className="pb-6 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {products.length > 0 ? (
                      products.map(item => (
                        <ProductRow 
                           key={item.productId}
                           product={{
                             name: item.productTitle, 
                             sku: item.productUrl || `PID-${item.productId}`, 
                             image: item.productImg1
                           }} 
                           category={item.catTitle || 'Uncategorized'} 
                           price={item.productPrice || 0} 
                           stock={100} 
                           status={item.status || 'Active'} 
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-20 text-center">
                           <p className="text-sm font-bold text-slate-400 italic">No products found in database.</p>
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
            )}
         </div>

         {/* Table Pagination Placeholder */}
         <div className="flex justify-between items-center pt-10 mt-10 border-t border-slate-50 italic">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page 1 of 12</span>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-slate-50 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-all">Prev</button>
               <button className="px-4 py-2 bg-primary text-white rounded-lg text-[10px] font-black uppercase shadow-md">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Ecommerce;
