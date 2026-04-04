import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = 'brand' }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start justify-between min-w-[240px] flex-1 transition-all duration-200"
    >
      <div>
        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 mb-2">{value}</h3>
        <div className="flex items-center space-x-2">
          <span className={`flex items-center text-[10px] font-black px-2 py-1 rounded-lg ${
            isPositive 
              ? 'bg-emerald-50 text-emerald-600' 
              : 'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isPositive ? '+' : ''}{trendValue}%
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">vs last month</span>
        </div>
      </div>
      <div className="p-3 rounded-2xl bg-brand/10 text-brand shadow-sm">
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default StatCard;
