import React, { useState, useEffect } from 'react';
import { CameraFeed } from './CameraFeed';
import { Telemetry } from './Telemetry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate telemetry data
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          speed: Math.random() * 10 + 15,
          steering: (Math.random() - 0.5) * 40,
        };
        const newData = [...prev, newPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 500);
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
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Speed & Steering History</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" hide />
                <YAxis yAxisId="left" stroke="#10b981" fontSize={12} tickFormatter={(val) => `${val.toFixed(0)} km/h`} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} tickFormatter={(val) => `${val.toFixed(0)}°`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#e4e4e7' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="steering" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column: Telemetry */}
      <div className="flex flex-col gap-6">
        <Telemetry />
      </div>
    </div>
  );
}
