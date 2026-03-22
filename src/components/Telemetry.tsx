import React, { useState, useEffect } from 'react';
import { Gauge, Navigation, Zap, Thermometer, Cpu, MemoryStick } from 'lucide-react';

export function Telemetry() {
  const [speed, setSpeed] = useState(0);
  const [steering, setSteering] = useState(0);
  const [throttle, setThrottle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(prev => {
        const target = 25 + Math.sin(Date.now() / 2000) * 10;
        return prev + (target - prev) * 0.1;
      });
      setSteering(prev => {
        const target = Math.sin(Date.now() / 1000) * 30;
        return prev + (target - prev) * 0.2;
      });
      setThrottle(prev => {
        const target = 40 + Math.cos(Date.now() / 1500) * 20;
        return prev + (target - prev) * 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Speedometer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <Gauge className="w-8 h-8 text-emerald-500 mb-4 opacity-50" />
        <div className="text-6xl font-light font-mono text-white tracking-tighter">
          {speed.toFixed(1)}
        </div>
        <div className="text-sm text-zinc-500 uppercase tracking-widest mt-2 font-medium">km/h</div>
      </div>

      {/* Steering & Throttle */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4" /> Steering
            </span>
            <span className="text-xl font-mono text-blue-400">{steering.toFixed(1)}°</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-zinc-600 z-10" />
            <div 
              className="absolute top-0 bottom-0 bg-blue-500 rounded-full transition-all duration-100"
              style={{
                left: steering < 0 ? `calc(50% + ${steering}%)` : '50%',
                width: `${Math.abs(steering)}%`
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4" /> Throttle
            </span>
            <span className="text-xl font-mono text-amber-400">{throttle.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-100"
              style={{ width: `${throttle}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
          <Thermometer className="w-4 h-4 text-rose-500 mb-1" />
          <span className="text-2xl font-mono text-white">42°C</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Pi Temp</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
          <Cpu className="w-4 h-4 text-indigo-500 mb-1" />
          <span className="text-2xl font-mono text-white">28%</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">CPU Load</span>
        </div>
      </div>
    </div>
  );
}
