import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal, 
  Search, 
  MapPin, 
  ArrowUpRight, 
  ChevronRight, 
  Star 
} from 'lucide-react';

const StatsCard = ({ title, value, subtext, color, icon: Icon, trend }) => (
  <div className="card relative overflow-hidden group border-none shadow-sm flex flex-col justify-between h-[180px]">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h5>
        <h2 className="text-3xl font-black text-slate-800">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
    </div>
    
    <div className="flex items-center gap-2">
       <span className={`flex items-center gap-0.5 text-xs font-bold ${trend > 0 ? 'text-success' : 'text-danger'}`}>
          {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {Math.abs(trend)}%
       </span>
       <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{subtext}</span>
    </div>

    {/* Mini Chart Placeholder Background */}
    <div className="absolute inset-x-0 bottom-0 h-1/3 opacity-20 group-hover:opacity-40 transition-opacity">
       <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path d="M0,25 Q25,10 50,20 T100,5 L100,30 L0,30 Z" fill={`var(--${color === 'primary' ? 'primary' : color})`} />
       </svg>
    </div>
  </div>
);

const RecentOrderRow = ({ user, orderDate, price, status }) => (
  <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer">
    <td className="py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
           <img src={`https://avatar.iran.liara.run/public?username=${user.name}`} alt={user.name} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700 leading-tight group-hover:text-primary transition-colors">{user.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.id}</p>
        </div>
      </div>
    </td>
    <td className="py-4 text-sm font-bold text-slate-500">{orderDate}</td>
    <td className="py-4 text-sm font-black text-slate-800">${price.toFixed(2)}</td>
    <td className="py-4">
       <span className={`badge ${status === 'Succeed' ? 'badge-success' : status === 'Waiting' ? 'badge-warning' : 'badge-danger'}`}>
          {status}
       </span>
    </td>
    <td className="py-4 text-right">
       <button className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-primary transition-all">
          <MoreHorizontal size={18} />
       </button>
    </td>
  </tr>
);

const CustomerRow = ({ name, id, status, image }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer">
     <div className="flex items-center gap-4">
        <img src={image} className="w-10 h-10 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100" alt={name}/>
        <div>
           <h6 className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors leading-tight">{name}</h6>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">ID #{id} · {status}</p>
        </div>
     </div>
     <button className="p-2 rounded-lg text-slate-300 group-hover:text-primary group-hover:bg-white shadow-sm transition-all">
        <ArrowUpRight size={18} />
     </button>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 leading-none">Ecommerce Dashboard</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <MapPin size={14} className="text-primary" /> Dashboard <span>/</span> Ecommerce
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Search report..." 
                 className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:shadow-md outline-none transition-all w-[240px]"
                />
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center gap-2">
               + Create Report
            </button>
         </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Sells" value="12,463" subtext="Compared to Jan 2024" color="primary" icon={ShoppingBag} trend={12.5} />
        <StatsCard title="Orders Value" value="$78,596" subtext="Compared to Aug 2024" color="info" icon={CreditCard} trend={8.3} />
        <StatsCard title="Daily Orders" value="95,789" subtext="Compared to May 2024" color="warning" icon={ShoppingCart} trend={-2.1} />
        <StatsCard title="Daily Revenue" value="$41,954" subtext="Compared to July 2024" color="secondary" icon={DollarSign} trend={5.8} />
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Recent Orders - 8 cols */}
         <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="card border-none shadow-sm">
               <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                  <h4 className="text-xl font-black text-slate-800 italic uppercase">Recent Orders</h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:underline uppercase tracking-tighter">
                     View All Orders <ChevronRight size={16} />
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                           <th className="pb-4">Recent Orders</th>
                           <th className="pb-4">Order Date</th>
                           <th className="pb-4">Price</th>
                           <th className="pb-4">Status</th>
                           <th className="pb-4 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        <RecentOrderRow user={{name: 'Decorative Plants', id: '#34552'}} orderDate="20 Sep - 03:00AM" price={637.30} status="Succeed" />
                        <RecentOrderRow user={{name: 'Sticky Calendar', id: '#34553'}} orderDate="12 Mar - 08:12AM" price={637.30} status="Waiting" />
                        <RecentOrderRow user={{name: 'Crystal Mug', id: '#34554'}} orderDate="Feb 15 - 10:00AM" price={637.30} status="Succeed" />
                        <RecentOrderRow user={{name: 'Motion Table Lamp', id: '#34555'}} orderDate="Jun 10 - 12:30AM" price={637.30} status="Canceled" />
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Sales Overview Chart (Visual Placeholder) */}
            <div className="card border-none shadow-sm bg-primary/5 border border-primary/10">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xl font-black text-slate-800 italic uppercase">Sales Overview</h4>
                  <div className="p-2 rounded-lg bg-white shadow-sm cursor-pointer text-slate-400 hover:text-primary hover:shadow-md transition-all">
                    <MoreHorizontal size={20} />
                  </div>
               </div>
               <div className="h-[300px] flex items-end gap-4 px-4 pb-4">
                  {[40, 20, 60, 80, 50, 45, 75, 90, 65, 85, 30, 55].map((h, i) => (
                    <div key={i} className="flex-1 group relative flex flex-col items-center">
                       <div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary" style={{height: `${h}%`}}>
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                             ${h*10}k
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 mt-4 uppercase">M{i+1}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar widgets - 4 cols */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
             <div className="card border-none shadow-sm h-full">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
                  <h4 className="text-lg font-black text-slate-800 italic uppercase">Recent Customers</h4>
                  <div className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-400">
                    <MoreHorizontal size={20} />
                  </div>
                </div>
                <div className="space-y-2">
                   <CustomerRow name="Junsung Park" id="32449" status="Paid" image="https://avatar.iran.liara.run/public/boy?username=junsung" />
                   <CustomerRow name="Yongjae Choi" id="95460" status="Pending" image="https://avatar.iran.liara.run/public/boy?username=yongjae" />
                   <CustomerRow name="Seonil Jang" id="85488" status="Paid" image="https://avatar.iran.liara.run/public/boy?username=seonil" />
                   <CustomerRow name="Joohee Min" id="95462" status="Pending" image="https://avatar.iran.liara.run/public/girl?username=joohee" />
                   <CustomerRow name="Soojung Kin" id="14586" status="Paid" image="https://avatar.iran.liara.run/public/girl?username=soojung" />
                </div>
             </div>

             <div className="card bg-secondary text-white border-none shadow-lg shadow-secondary/20 p-8 space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="space-y-1 relative z-10">
                   <h2 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">Special Discount</h2>
                   <h1 className="text-2xl font-black italic">Deal of the Day From Wear!</h1>
                   <p className="text-sm font-medium opacity-80 leading-relaxed">Save up to 75% on women's fits and flare dresses today only.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                   {['14', '23', '59', '32'].map((unit, i) => (
                     <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur rounded flex items-center justify-center text-lg font-black">{unit}</div>
                        <span className="text-[8px] font-black uppercase opacity-60 italic">{['Days', 'Hours', 'Min', 'Sec'][i]}</span>
                     </div>
                   ))}
                </div>
                <button className="relative z-10 w-full bg-white text-secondary py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl">
                   Shop the Deal
                </button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
