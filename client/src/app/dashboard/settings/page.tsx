'use client';

import React, { useState, useEffect } from 'react';
import API from '@/lib/api';
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  Bell, 
  Database, 
  CreditCard,
  CheckCircle2,
  Lock,
  Copy,
  Save,
  Loader2,
  Mail,
  User,
  Key,
  Smartphone,
  Info,
  Star,
  Zap,
  Check
} from 'lucide-react';

type Tab = 'General' | 'Security' | 'Notifications' | 'Billing';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [orgData, setOrgData] = useState<any>(null);
  const [orgName, setOrgName] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setOrgData(data.organization);
        setOrgName(data.organization.name);
        setThreshold(data.organization.defaultThreshold.toString());
      } catch (err) {
        console.error('Failed to fetch org details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  const copyToClipboard = () => {
    if (orgData) {
      navigator.clipboard.writeText(orgData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await API.put('/auth/organization', { 
        name: orgName, 
        defaultThreshold: threshold 
      });
      alert('Settings updated successfully');
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="p-8 text-zinc-500">Loading settings...</div>;

    switch(activeTab) {
      case 'General':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* Isolation Proof Section */}
            <section className="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-100">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">Developer Isolation Proof</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5 font-bold">Scoped Tenant Verification</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Organization ID (Read Only)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center text-zinc-500 font-mono text-xs select-all">
                      {orgData?.id}
                    </div>
                    <button onClick={copyToClipboard} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl transition-colors">
                      {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Registered Tenant Name</label>
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center text-zinc-500 font-bold text-xs uppercase tracking-tighter italic">
                    {orgData?.name}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={16} className="text-zinc-500" />
                Workspace Identity
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Custom Display Name</label>
                  <input 
                    type="text" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:ring-2 focus:ring-zinc-700 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1 flex items-center gap-2">
                    Global Stock Threshold
                    <span className="p-1 bg-blue-500/10 text-blue-500 rounded-md"><Info size={10} /></span>
                  </label>
                  <input 
                    type="number" 
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:ring-2 focus:ring-zinc-700 transition-all"
                    placeholder="Alert when stock is below..."
                  />
                  <p className="text-[10px] text-zinc-600 px-1">This sets the default low-stock alert level for all new products.</p>
                </div>
              </div>
            </section>

            <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Database size={16} className="text-zinc-500" />
                Data Preferences
              </h3>
              <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-zinc-100">Auto-Archiving</p>
                  <p className="text-xs text-zinc-600">Archive products after 6 months of inactivity</p>
                </div>
                <div className="h-6 w-11 rounded-full bg-zinc-800 flex items-center px-1">
                    <div className="h-4 w-4 rounded-full bg-zinc-600"></div>
                </div>
              </div>
            </section>
          </div>
        );

      case 'Security':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Key size={16} className="text-zinc-500" />
                Credentials
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Confirm</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="p-3 bg-zinc-950 rounded-2xl text-zinc-500">
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h4 className="text-zinc-100 font-bold text-sm">Two-Factor Authentication</h4>
                    <p className="text-xs text-zinc-600 mt-1">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg hover:bg-zinc-700 transition-all">Enable 2FA</button>
              </div>
            </section>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
               <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                <Bell size={16} className="text-zinc-500" />
                Alert Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Low Stock Alerts', desc: 'When inventory falls below threshold' },
                  { title: 'Weekly Reports', desc: 'Summary of all stock movements' },
                  { title: 'Organization Updates', desc: 'When team members change settings' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-zinc-100">{item.title}</p>
                      <p className="text-xs text-zinc-600">{item.desc}</p>
                    </div>
                    <div className={`h-6 w-11 rounded-full flex items-center px-1 ${idx === 0 ? 'bg-zinc-100' : 'bg-zinc-800'}`}>
                        <div className={`h-4 w-4 rounded-full ${idx === 0 ? 'bg-zinc-950 translate-x-5' : 'bg-zinc-600'} transition-all`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'Billing':
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 border-2 border-zinc-100 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-zinc-100 text-zinc-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Current</div>
                <Star className="text-zinc-100 mb-4" size={24} fill="currentColor" />
                <h4 className="text-xl font-bold text-zinc-100">Free Tier</h4>
                <p className="text-xs text-zinc-500 mt-1">Up to 500 products per organization</p>
                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-100">$0</span>
                  <span className="text-xs text-zinc-600">/mo</span>
                </div>
              </div>
              
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:border-zinc-500 transition-all cursor-pointer group">
                <Zap className="text-zinc-500 group-hover:text-yellow-500 mb-4 transition-colors" size={24} />
                <h4 className="text-xl font-bold text-zinc-100">Pro Scale</h4>
                <p className="text-xs text-zinc-500 mt-1">Unlimited inventory & advanced analytics</p>
                <div className="mt-8 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-100">$29</span>
                  <span className="text-xs text-zinc-600">/mo</span>
                </div>
              </div>
            </div>

            <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Subscription Features</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Unlimited Multi-tenancy',
                  'Real-time CSV Exports',
                  'Advanced Low Stock AI',
                  'Priority Support'
                ].map(feat => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-zinc-400">
                    <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-100">
                      <Check size={10} />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">Workspace Preferences</h2>
          <p className="text-zinc-500 mt-1 italic">Personalize your StockFlow environment</p>
        </div>
        <div className="text-xs text-zinc-600 flex items-center gap-2 bg-zinc-900/50 px-3 py-2 rounded-lg border border-zinc-800">
          <Info size={14} />
          Last synced: Just now
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-1">
          {(['General', 'Security', 'Notifications', 'Billing'] as Tab[]).map((tab) => {
            const icons = { General: Building2, Security: ShieldCheck, Notifications: Bell, Billing: CreditCard };
            const Icon = icons[tab];
            const isActive = activeTab === tab;
            return (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive ? 'bg-zinc-100 text-zinc-950 shadow-lg' : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
              >
                <Icon size={18} />
                {tab}
              </button>
            );
          })}
        </aside>

        <div className="flex-1 space-y-8">
          {renderContent()}

          <div className="flex justify-end border-t border-zinc-800 pt-8">
            <button 
              onClick={handleSave}
              disabled={saveLoading}
              className="flex items-center gap-2 px-10 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Apply Configurations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
