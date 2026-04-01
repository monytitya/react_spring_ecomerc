import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = 'brand' }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between min-w-[240px] flex-1"
    >
      <div>
        <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{value}</h3>
        <div className="flex items-center space-x-1.5">
          <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {isPositive ? '+' : ''}{trendValue}%
          </span>
          <span className="text-[11px] font-medium text-slate-400">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default StatCard;
