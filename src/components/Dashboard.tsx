import React, { useState, useEffect } from 'react';
import { CameraFeed } from './CameraFeed';
import { Telemetry } from './Telemetry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, ShieldCheck, CarFront } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [obdData, setObdData] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/obd');
        const obd = await response.json();
        setObdData(obd);

        setData(prev => {
          const newPoint = {
            time: new Date().toLocaleTimeString(),
            speed: obd.speed,
            rpm: obd.rpm / 100, // Scale for chart
          };
          const newData = [...prev, newPoint];
          if (newData.length > 20) newData.shift();
          return newData;
        });
      } catch (error) {
        console.error('Failed to fetch OBD data:', error);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Column: Camera and Map Preview */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 relative shadow-xl">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-mono text-white tracking-wider">LIVE FEED</span>
          </div>
          <CameraFeed />
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-64 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Vehicle Performance History</h3>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="text-emerald-400">Speed (km/h)</span>
              <span className="text-blue-400">RPM (x100)</span>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" hide />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={12} tickFormatter={(val) => `${val.toFixed(0)}`} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `${val.toFixed(0)}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="rpm" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column: Telemetry & Quick Stats */}
      <div className="flex flex-col gap-6">
        <Telemetry />
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <CarFront className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Quick OBD Stats</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Coolant</div>
              <div className="text-lg font-mono text-white">{obdData?.coolantTemp || 0}°C</div>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Load</div>
              <div className="text-lg font-mono text-white">{obdData?.engineLoad || 0}%</div>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Throttle</div>
              <div className="text-lg font-mono text-white">{obdData?.throttlePos || 0}%</div>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase mb-1">Voltage</div>
              <div className="text-lg font-mono text-white">{obdData?.voltage || 0}V</div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Security Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <span className="text-xs text-zinc-400">Mesh Network</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Encrypted</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <span className="text-xs text-zinc-400">Signal Integrity</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
