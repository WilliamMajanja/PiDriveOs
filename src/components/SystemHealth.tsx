import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Thermometer, MemoryStick, HardDrive, Wifi, Info } from 'lucide-react';
import { PiModel } from '../types';
import { cn } from '../lib/utils';

export function SystemHealth() {
  const [piModel, setPiModel] = useState<PiModel>('PI_5_16GB');
  const [stats, setStats] = useState({
    cpu: 0,
    temp: 0,
    ram: 0,
    disk: 0,
    network: 0
  });
  const [logs, setLogs] = useState<{ timestamp: string; level: string; message: string }[]>([]);

  useEffect(() => {
    // Real-time Telemetry Fetch
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/telemetry');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch telemetry:', error);
      }
    };

    const statsInterval = setInterval(fetchStats, 2000);
    fetchStats();

    // Live Logs via WebSocket
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
      const log = JSON.parse(event.data);
      setLogs(prev => [log, ...prev].slice(0, 50));
    };

    return () => {
      clearInterval(statsInterval);
      socket.close();
    };
  }, []);

  const getStatusColor = (value: number, warning: number, critical: number) => {
    if (value >= critical) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (value >= warning) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  const MetricCard = ({ title, value, unit, icon: Icon, warning, critical }: any) => {
    const colorClass = getStatusColor(value, warning, critical);
    return (
      <div className={cn("border rounded-2xl p-6 shadow-xl transition-all duration-500", colorClass)}>
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
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-semibold">System Health</h2>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Cpu className="w-4 h-4 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">{piModel.replace(/_/g, ' ')}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="CPU Load" value={stats.cpu} unit="%" icon={Cpu} warning={70} critical={90} />
        <MetricCard title="Temperature" value={stats.temp} unit="°C" icon={Thermometer} warning={65} critical={80} />
        <MetricCard title="Memory Usage" value={stats.ram} unit="%" icon={MemoryStick} warning={80} critical={95} />
        <MetricCard title="Storage" value={stats.disk} unit="%" icon={HardDrive} warning={85} critical={95} />
        <MetricCard title="Network Tx/Rx" value={stats.network} unit="Mbps" icon={Wifi} warning={80} critical={95} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">System Logs</h3>
          <div className="font-mono text-[10px] text-zinc-500 space-y-2 overflow-y-auto h-48 bg-black/50 p-4 rounded-xl border border-zinc-800 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="text-zinc-600 italic">Waiting for live log stream...</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={cn(
                  log.level === 'INFO' ? "text-emerald-500" : 
                  log.level === 'WARN' ? "text-amber-500" : 
                  log.level === 'ERROR' ? "text-rose-500" : "text-zinc-400"
                )}>
                  [{new Date(log.timestamp).toLocaleTimeString()}] [{log.level}] {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Hardware Specs</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-[9px] text-zinc-500 uppercase mb-1">Total RAM</div>
                <div className="text-lg font-mono text-white">{piModel === 'PI_5_16GB' ? '16 GB' : piModel === 'PI_5_8GB' ? '8 GB' : piModel === 'PI_4' ? '4 GB' : '512 MB'}</div>
              </div>
              <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-[9px] text-zinc-500 uppercase mb-1">Architecture</div>
                <div className="text-lg font-mono text-white">ARMv8-A</div>
              </div>
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                {piModel === 'PI_5_16GB' 
                  ? "Pi 5 16GB detected. High-performance mode enabled. Large-scale AI models and multi-camera processing are supported."
                  : piModel === 'ZERO_2_W'
                  ? "Pi Zero 2 W detected. Low-power mode enabled. Recommended for lightweight edge processing and basic motor control."
                  : "Standard Pi 4/5 detected. Balanced mode enabled."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
