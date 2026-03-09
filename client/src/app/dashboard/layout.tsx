'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, LogOut, Package, BarChart3, Settings, ShoppingCart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { name: 'Inventory', icon: Package, href: '/dashboard/inventory' },
    { name: 'Orders', icon: ShoppingCart, href: '/dashboard/orders' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-800 dark:border-t-zinc-100 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 dark:bg-zinc-100 rounded-lg flex items-center justify-center">
            <Layout className="text-zinc-100 dark:text-zinc-950" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">StockFlow</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-zinc-950 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-950 font-medium shadow-lg shadow-zinc-950/10 dark:shadow-zinc-100/10' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/20 dark:bg-zinc-950/80 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside className="w-64 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Layout className="text-zinc-950 dark:text-zinc-100" size={24} />
                <span className="font-bold text-lg">StockFlow</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-950 dark:text-zinc-100"><X size={24} /></button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-red-600 mt-auto"
            >
              <LogOut size={20} />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-zinc-500 p-2 hover:bg-zinc-100 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold md:ml-0 text-zinc-950 dark:text-zinc-100">
              {navItems.find(i => pathname === i.href)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <ThemeToggle />
            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-medium text-zinc-950 dark:text-zinc-300">Admin User</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Admin</span>
              </div>
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-zinc-950 dark:text-zinc-100 font-bold shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}
