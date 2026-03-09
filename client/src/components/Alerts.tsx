'use client';

import React from 'react';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  lowStockThreshold: number | null;
}

export default function Alerts({ products }: { products: Product[] }) {
  const lowStockProducts = products.filter(p => p.quantity <= (p.lowStockThreshold || 5));

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 mb-2 px-1">
        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          <AlertTriangle size={18} className="animate-pulse" />
        </div>
        <h3 className="text-zinc-100 font-bold tracking-tight">System Alerts</h3>
        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-500/20">
          {lowStockProducts.length} Urgent
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lowStockProducts.map(p => (
          <div key={p.id} className="group relative overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 p-4 rounded-2xl transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-zinc-950 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <Package size={18} className="text-zinc-500 group-hover:text-amber-500 transition-colors" />
              </div>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                {p.quantity} left
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100 mb-0.5">{p.name}</p>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{p.sku}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center group-hover:border-amber-500/20">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Urgent Restock</span>
              <button className="text-zinc-100 hover:text-amber-500 transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
