import React from 'react';
import { LayoutDashboard, Map, Settings, Activity, SlidersHorizontal, CarFront, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calibration', label: 'Calibration', icon: SlidersHorizontal },
    { id: 'map', label: 'Map & GPS', icon: Map },
    { id: 'health', label: 'System Health', icon: Activity },
    { id: 'signals', label: 'Signal Lab', icon: Zap },
    { id: 'intel', label: 'Threat Intel', icon: ShieldCheck },
    { id: 'obd', label: 'OBD II Diagnostics', icon: CarFront },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800">
        <CarFront className="w-6 h-6 text-emerald-500 mr-3" />
        <span className="text-xl font-bold tracking-tight text-white">PiDrive<span className="text-emerald-500">OS</span></span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 font-medium" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 mr-3 transition-colors",
                isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="bg-zinc-800/50 rounded-xl p-4">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Battery</div>
          <div className="flex items-end justify-between mb-1">
            <span className="text-2xl font-mono text-emerald-400">11.4<span className="text-sm text-zinc-500">V</span></span>
            <span className="text-sm text-zinc-400">84%</span>
          </div>
          <div className="w-full bg-zinc-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[84%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
