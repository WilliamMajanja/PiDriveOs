import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Thermometer, MemoryStick, HardDrive, Wifi } from 'lucide-react';

export function SystemHealth() {
  const [stats, setStats] = useState({
    cpu: 28,
    temp: 42,
    ram: 64,
    disk: 45,
    network: 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 10)),
        temp: Math.min(85, Math.max(30, prev.temp + (Math.random() - 0.5) * 2)),
        ram: Math.min(100, Math.max(0, prev.ram + (Math.random() - 0.5) * 5)),
        disk: 45, // Static for simulation
        network: Math.min(100, Math.max(0, prev.network + (Math.random() - 0.5) * 20))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, warning: number, critical: number) => {
    if (value >= critical) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (value >= warning) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  const MetricCard = ({ title, value, unit, icon: Icon, warning, critical }: any) => {
    const colorClass = getStatusColor(value, warning, critical);
    return (
      <div className={`border rounded-2xl p-6 shadow-xl transition-colors duration-500 ${colorClass}`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider opacity-80">
            <Icon className="w-5 h-5" />
            {title}
          </div>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-mono font-light tracking-tighter">{value.toFixed(1)}</span>
          <span className="text-lg opacity-60 mb-1">{unit}</span>
        </div>
        <div className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-current transition-all duration-1000 ease-in-out"
            style={{ width: `${Math.min(100, value)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="w-6 h-6 text-emerald-500" />
        <h2 className="text-2xl font-semibold">System Health</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="CPU Load" value={stats.cpu} unit="%" icon={Cpu} warning={70} critical={90} />
        <MetricCard title="Temperature" value={stats.temp} unit="°C" icon={Thermometer} warning={65} critical={80} />
        <MetricCard title="Memory Usage" value={stats.ram} unit="%" icon={MemoryStick} warning={80} critical={95} />
        <MetricCard title="Storage" value={stats.disk} unit="%" icon={HardDrive} warning={85} critical={95} />
        <MetricCard title="Network Tx/Rx" value={stats.network} unit="Mbps" icon={Wifi} warning={80} critical={95} />
      </div>

      <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">System Logs</h3>
        <div className="font-mono text-xs text-zinc-500 space-y-2 overflow-y-auto h-48 bg-black/50 p-4 rounded-xl border border-zinc-800">
          <div className="text-emerald-500">[INFO] System booted successfully.</div>
          <div className="text-emerald-500">[INFO] Camera module initialized.</div>
          <div className="text-emerald-500">[INFO] LiDAR sensor connected on /dev/ttyUSB0.</div>
          <div className="text-emerald-500">[INFO] AI Model loaded: MobileNet V3.</div>
          <div className="text-amber-500">[WARN] GPS signal weak. Searching for satellites...</div>
          <div className="text-emerald-500">[INFO] GPS 3D fix acquired.</div>
          <div className="text-emerald-500">[INFO] Telemetry stream started.</div>
          <div className="text-zinc-400">[DEBUG] Frame processing time: 32ms.</div>
          <div className="text-zinc-400">[DEBUG] Frame processing time: 31ms.</div>
          <div className="text-zinc-400">[DEBUG] Frame processing time: 33ms.</div>
        </div>
      </div>
    </div>
  );
}
