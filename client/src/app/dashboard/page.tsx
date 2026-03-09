'use client';

import React, { useEffect, useState } from 'react';
import API from '@/lib/api';
import { 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Search, 
  PlusCircle, 
  TrendingUp, 
  Loader2, 
  X,
  Filter,
  Download,
  Layout
} from 'lucide-react';
import StockChart from '@/components/StockChart';
import Alerts from '@/components/Alerts';

interface Product {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  lowStockThreshold: number | null;
  costPrice: number | null;
  sellingPrice: number | null;
}

export default function Dashboard() {
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
      // Map string values to numbers for the API
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
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        alert('Failed to add product: ' + (err.response?.data?.error || 'Unknown error'));
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await API.get('/products/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export inventory');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.quantity <= (p.lowStockThreshold || 5)).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.quantity * (p.costPrice || 0)), 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="animate-spin text-zinc-500" size={32} />
      <span className="text-zinc-500 font-medium">Loading inventory...</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <Alerts products={products} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockChart products={products} />
        </div>
        
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-700 transition-all h-[165px]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Package size={20} />
              </div>
              <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} />
                +12.5%
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Products</p>
              <h3 className="text-2xl font-bold text-zinc-100 mt-1">{totalProducts}</h3>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-700 transition-all h-[165px]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <AlertTriangle size={20} />
              </div>
              {lowStockCount > 0 && (
                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                  Attention Required
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Low Stock Alert</p>
              <h3 className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? 'text-amber-500' : 'text-zinc-100'}`}>
                {lowStockCount}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between group hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
            <DollarSign size={20} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-500">Inventory Value</p>
          <h3 className="text-2xl font-bold text-zinc-100 mt-1">
            ${inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Product Management Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 md:p-8 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={handleExport}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-medium transition-all"
            >
              <Download size={18} />
              Download Report
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-sm font-bold transition-all shadow-lg"
            >
              <PlusCircle size={18} />
              Add Product
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50 border-b border-zinc-800">
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">SKU</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Product</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">In Stock</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Price</th>
                <th className="px-8 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredProducts.map((product) => {
                const isLowStock = product.quantity <= (product.lowStockThreshold || 5);
                return (
                  <tr key={product.id} className="hover:bg-zinc-800/20 transition-colors group">
                    <td className="px-8 py-5">
                      <code className="text-zinc-500 font-mono text-xs">{product.sku}</code>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-semibold text-zinc-100">{product.name}</p>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`font-mono text-sm ${isLowStock ? 'text-amber-500' : 'text-zinc-300'}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-zinc-300">${product.sellingPrice || 0}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-wider">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-zinc-950 rounded-full text-zinc-700">
                        <Package size={48} strokeWidth={1} />
                      </div>
                      <div>
                        <p className="text-zinc-400 font-medium">No products found</p>
                        <p className="text-zinc-600 text-sm mt-1">Start by adding your first inventory item</p>
                      </div>
                      <button 
                        onClick={() => setShowModal(true)}
                        className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-all"
                      >
                        Add your first product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Add New Product</h3>
                <p className="text-sm text-zinc-500 mt-0.5">Enter product details to update inventory</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-100 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">SKU</label>
                  <input
                    required
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                    placeholder="PRD-001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Product Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                    placeholder="Premium Gadget"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Initial Stock</label>
                  <input
                    required
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Low Stock Alert</label>
                  <input
                    required
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cost Price</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Selling Price</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold transition-all"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
