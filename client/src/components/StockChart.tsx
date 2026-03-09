'use client';

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Product {
  name: string;
  quantity: number;
}

export default function StockChart({ products }: { products: Product[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = [...products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 10) + '...' : p.name,
      quantity: p.quantity,
      fullName: p.name
    }));

  if (!isMounted) return <div className="h-[300px] bg-zinc-900/50 rounded-2xl animate-pulse" />;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl h-[350px] w-full min-h-[350px]">
      <h3 className="text-zinc-100 font-bold mb-6 flex items-center gap-2">
        Inventory Distribution
        <span className="text-[10px] font-normal text-zinc-500 uppercase tracking-widest">(Top 5 Products)</span>
      </h3>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#71717a', fontSize: 12 }} 
            />
            <Tooltip
              cursor={{ fill: '#27272a', opacity: 0.4 }}
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #27272a',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#f4f4f5'
              }}
              itemStyle={{ color: '#f4f4f5' }}
            />
            <Bar dataKey="quantity" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#f4f4f5' : '#3f3f46'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
