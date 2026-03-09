'use client';

import React, { useState } from 'react';
import { 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Filter,
  Calendar,
  Package,
  ArrowRight
} from 'lucide-react';

interface Order {
  id: string;
  date: string;
  productName: string;
  type: 'Restock' | 'Sale';
  quantity: number;
}

const placeholderOrders: Order[] = [
  { id: '1', date: '2026-03-09', productName: 'Premium Gadget', type: 'Restock', quantity: 50 },
  { id: '2', date: '2026-03-08', productName: 'Tech Widget', type: 'Sale', quantity: 12 },
  { id: '3', date: '2026-03-08', productName: 'Zinc Module', type: 'Sale', quantity: 5 },
  { id: '4', date: '2026-03-07', productName: 'Premium Gadget', type: 'Sale', quantity: 8 },
  { id: '5', date: '2026-03-07', productName: 'Standard Part', type: 'Restock', quantity: 100 },
];

export default function Orders() {
  const [filter, setFilter] = useState<'All' | 'Restock' | 'Sale'>('All');

  const filteredOrders = filter === 'All' 
    ? placeholderOrders 
    : placeholderOrders.filter(o => o.type === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <History className="text-zinc-500" size={24} />
            Recent Activity
          </h2>
          <p className="text-zinc-500 mt-1">History of stock movements and transactions</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full pl-10 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-700 appearance-none"
            >
              <option value="All">All Transactions</option>
              <option value="Restock">Restocks</option>
              <option value="Sale">Sales</option>
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-medium transition-all">
            <Calendar size={16} />
            Export Log
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Activity</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Qty</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-zinc-500 text-sm font-mono">{order.date}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        order.type === 'Restock' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {order.type === 'Restock' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                      <div>
                        <p className="font-semibold text-zinc-100 text-sm">{order.productName}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{order.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`font-mono text-sm ${
                      order.type === 'Restock' ? 'text-emerald-500' : 'text-blue-500'
                    }`}>
                      {order.type === 'Restock' ? '+' : '-'}{order.quantity}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-zinc-500 hover:text-zinc-100 transition-colors">
                      <ArrowRight size={16} className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-3xl border-dashed flex flex-col items-center justify-center gap-4">
        <div className="p-3 bg-zinc-900 rounded-2xl text-zinc-700">
          <Package size={32} />
        </div>
        <div className="text-center">
          <p className="text-zinc-400 font-medium italic">"Data integration in progress..."</p>
          <p className="text-zinc-600 text-xs mt-1">Real-time order synchronization will be available in the next release.</p>
        </div>
      </div>
    </div>
  );
}
