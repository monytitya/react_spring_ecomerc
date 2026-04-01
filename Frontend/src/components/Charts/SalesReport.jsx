import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: '22 Jun', income: 12000, expenses: 8000 },
  { name: '23 Jun', income: 15000, expenses: 9000 },
  { name: '24 Jun', income: 20678, expenses: 10000 },
  { name: '25 Jun', income: 14000, expenses: 8500 },
  { name: '26 Jun', income: 18000, expenses: 11000 },
  { name: '27 Jun', income: 16000, expenses: 9500 },
  { name: '28 Jun', income: 19000, expenses: 10500 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-sidebar p-3 rounded-lg shadow-xl border border-white/10 text-white text-[12px] font-sans">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-brand flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand"></span>
          <span>Income: ${payload[0].value.toLocaleString()}</span>
        </p>
        <p className="text-violet-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-violet-400"></span>
          <span>Expenses: ${payload[1].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesReport = () => {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIncome)" 
            name="Incomes"
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stroke="#a78bfa" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorExpenses)" 
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReport;
