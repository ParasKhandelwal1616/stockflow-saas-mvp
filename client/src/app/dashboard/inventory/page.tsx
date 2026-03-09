'use client';

import React, { useEffect, useState } from 'react';
import API from '@/lib/api';
import { 
  Package, 
  Search, 
  PlusCircle, 
  Loader2, 
  X,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowUpDown,
  Download
} from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  lowStockThreshold: number | null;
  costPrice: number | null;
  sellingPrice: number | null;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    quantity: '0',
    lowStockThreshold: '5',
    costPrice: '0',
    sellingPrice: '0'
  });

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
      };
      await API.post('/products', payload);
      setShowModal(false);
      setFormData({
        sku: '',
        name: '',
        quantity: '0',
        lowStockThreshold: '5',
        costPrice: '0',
        sellingPrice: '0'
      });
      fetchProducts();
    } catch (err: any) {
      alert('Failed to add product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="animate-spin text-zinc-500" size={32} />
      <span className="text-zinc-500 font-medium">Loading inventory...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
            <Package className="text-zinc-500" size={24} />
            Inventory Master
          </h2>
          <p className="text-zinc-500 mt-1">Manage and track your organization's stock items</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-sm font-bold transition-all shadow-lg shadow-white/5"
          >
            <PlusCircle size={18} />
            Create Product
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              type="text"
              placeholder="Quick search by SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
            />
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
             <button className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-100 rounded-xl transition-all">
                <ArrowUpDown size={18} />
             </button>
             <button className="p-2.5 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-100 rounded-xl transition-all">
                <Filter size={18} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">SKU</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Stock Level</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Price (Unit)</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.map((product) => {
                const isLowStock = product.quantity <= (product.lowStockThreshold || 5);
                return (
                  <tr key={product.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-8 py-6">
                      <code className="text-zinc-500 font-mono text-xs">{product.sku}</code>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-semibold text-zinc-100">{product.name}</p>
                    </td>
                    <td className="px-8 py-6">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                          Critical Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-mono text-sm font-bold ${isLowStock ? 'text-amber-500' : 'text-zinc-300'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-300">${product.sellingPrice || 0}</span>
                        <span className="text-[10px] text-zinc-600 font-medium">Cost: ${product.costPrice || 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 rounded-lg transition-all">
                            <Edit2 size={14} />
                         </button>
                         <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded-lg transition-all">
                            <Trash2 size={14} />
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-zinc-950 rounded-full text-zinc-700">
                        <Package size={48} strokeWidth={1} />
                      </div>
                      <div>
                        <p className="text-zinc-400 font-medium">No inventory data available</p>
                        <p className="text-zinc-600 text-sm mt-1">Ready to scale? Add your first product item.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Reuse same as Dashboard for consistency) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Product Registration</h3>
                <p className="text-sm text-zinc-500 mt-0.5">Define your inventory specifications</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                    placeholder="E.g. Wireless Headphones"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Unique SKU</label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                    placeholder="WH-001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Opening Stock</label>
                  <input
                    required
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Alert Threshold</label>
                  <input
                    required
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Cost (per unit)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-bold transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold transition-all shadow-xl shadow-white/5"
                >
                  Register Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
