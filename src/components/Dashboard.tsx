import React, { useState, useEffect } from 'react';
import { CameraFeed } from './CameraFeed';
import { Telemetry } from './Telemetry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  Activity, 
  Zap, 
  ShieldCheck, 
  CarFront, 
  Terminal, 
  AlertTriangle, 
  Eye, 
  Globe, 
  Lock, 
  Cpu, 
  Database, 
  Wifi,
  Search,
  ShieldAlert,
  Flame,
  Camera
} from 'lucide-react';
import { cn } from '../lib/utils';
import { performSovereignAudit, AuditReport } from '../services/auditService';

export function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [obdData, setObdData] = useState<any>(null);
  const [systemLogs, setSystemLogs] = useState<{ time: string; msg: string; level: 'INFO' | 'WARN' | 'CRIT' }[]>([]);
  const [threats, setThreats] = useState<any[]>([]);
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    const logInterval = setInterval(() => {
      const logs: { msg: string; level: 'INFO' | 'WARN' | 'CRIT' }[] = [
        { msg: "Encrypted mesh handshake successful", level: 'INFO' },
        { msg: "External ping detected on port 443", level: 'WARN' },
        { msg: "Signal integrity check: 99.8%", level: 'INFO' },
        { msg: "Anomalous DSRC packet dropped", level: 'WARN' },
        { msg: "GPS spoofing attempt mitigated", level: 'CRIT' },
        { msg: "Telemetry stream synchronized", level: 'INFO' },
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setSystemLogs(prev => [{ time: new Date().toLocaleTimeString(), ...randomLog }, ...prev].slice(0, 15));
    }, 3000);

    const threatInterval = setInterval(() => {
      const mockThreats = [
        { id: 'T-882', type: 'Surveillance', distance: '150m', risk: 'LOW' },
        { id: 'T-104', type: 'Signal Intercept', distance: '45m', risk: 'HIGH' },
        { id: 'T-229', type: 'Cellular Tower', distance: '1.2km', risk: 'INFO' },
      ];
      setThreats(mockThreats.sort(() => Math.random() - 0.5));
    }, 5000);

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
            load: obd.load,
          };
          const newData = [...prev, newPoint];
          if (newData.length > 20) newData.shift();
          return newData;
        });
      } catch (error) {
        console.error('Failed to fetch OBD data:', error);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
      clearInterval(threatInterval);
    };
  }, []);

  const runAudit = async () => {
    setIsAuditing(true);
    const report = await performSovereignAudit(obdData || { speed: 0, rpm: 0 }, systemLogs);
    setAudit(report);
    setIsAuditing(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-700">
      {/* Header / Audit Trigger */}
      <div className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-widest">SIPS Kernel v4.2.0</h1>
            <p className="text-[10px] text-zinc-500 font-mono">SOVEREIGN_INTELLIGENCE_PROTECTION_SYSTEM</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={runAudit}
            disabled={isAuditing}
            className={cn(
              "px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              isAuditing && "animate-pulse opacity-50"
            )}
          >
            <Search className="w-3 h-3" />
            {isAuditing ? 'Auditing...' : 'Run Sovereign Audit'}
          </button>
          <div className="text-right font-mono text-[10px] text-zinc-500 uppercase">
            <div>Uptime: 14:22:09</div>
            <div>Lat: 34.0522° N | Lon: 118.2437° W</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left Column: Intelligence Matrix */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Sovereign AI Audit Result */}
          {audit && (
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Sovereign Audit</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">Stability</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
                    audit.stability === 'STABLE' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {audit.stability}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase">Security</span>
                  <span className="text-lg font-mono text-white font-bold">{audit.securityScore}%</span>
                </div>
                <div className="p-3 bg-black/40 border border-zinc-800 rounded-xl">
                  <p className="text-[9px] text-zinc-400 leading-relaxed italic">
                    "{audit.threatAssessment}"
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">Tactical Actions</div>
                  {audit.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-2 text-[9px] text-zinc-300">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5" />
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Threat Matrix */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent animate-scan" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-500" />
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Threat Matrix</h3>
              </div>
              <div className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[8px] font-bold text-rose-500 uppercase animate-pulse">Scanning</div>
            </div>
            <div className="space-y-3 relative z-10">
              {threats.map((threat) => (
                <div key={threat.id} className="p-3 bg-black/40 rounded-xl border border-zinc-800 hover:border-rose-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex justify-between items-center mb-1 relative">
                    <span className="text-[10px] font-mono text-rose-400 font-bold">{threat.id}</span>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest",
                      threat.risk === 'HIGH' ? "bg-rose-500 text-white" : 
                      threat.risk === 'LOW' ? "bg-amber-500/20 text-amber-500" : "bg-zinc-800 text-zinc-500"
                    )}>
                      {threat.risk}
                    </span>
                  </div>
                  <div className="flex justify-between items-end relative">
                    <span className="text-xs text-zinc-200 font-medium">{threat.type}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{threat.distance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Logs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">System Kernel Logs</h3>
            </div>
            <div className="flex-1 bg-black/40 rounded-xl p-3 font-mono text-[9px] overflow-y-auto space-y-1.5 custom-scrollbar">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex gap-2 border-b border-zinc-800/30 pb-1.5 last:border-0">
                  <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                  <span className={cn(
                    "font-bold shrink-0",
                    log.level === 'CRIT' ? "text-rose-500" : 
                    log.level === 'WARN' ? "text-amber-500" : "text-emerald-500"
                  )}>
                    {log.level}
                  </span>
                  <span className="text-zinc-400 truncate">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Visual Intelligence */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex-1 relative shadow-xl group">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white tracking-widest uppercase">Live Intelligence Feed</span>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                CAM_01 / REAR_SENSE
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none border-2 border-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <CameraFeed />
            
            {/* HUD Overlays */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end pointer-events-none">
              <div className="space-y-1">
                <div className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Object Recognition</div>
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-emerald-500/40" />
                  <div className="w-1 h-6 bg-emerald-500/60" />
                  <div className="w-1 h-3 bg-emerald-500/30" />
                </div>
              </div>
              <div className="text-right">
                <div className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Coordinates</div>
                <div className="text-[10px] font-mono text-zinc-300">40.7128° N, 74.0060° W</div>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-64 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Telemetry Analytics</h3>
              </div>
              <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-widest">
                <span className="text-emerald-400">Velocity</span>
                <span className="text-blue-400">Engine Load</span>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 120]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="speed" stroke="#10b981" fillOpacity={1} fill="url(#colorSpeed)" strokeWidth={2} isAnimationActive={false} />
                  <Area type="monotone" dataKey="load" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Overview */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-emerald-500" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Global Intelligence</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 flex flex-col items-center text-center">
                <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Satellites</div>
                <div className="text-xl font-mono text-emerald-400 font-bold">12</div>
                <div className="text-[8px] text-emerald-500/60 uppercase mt-1">Locked</div>
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-zinc-800 flex flex-col items-center text-center">
                <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Mesh Nodes</div>
                <div className="text-xl font-mono text-blue-400 font-bold">08</div>
                <div className="text-[8px] text-blue-500/60 uppercase mt-1">Active</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-rose-500" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Security Protocol</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Occupant Shield', status: 'ACTIVE', icon: ShieldCheck, color: 'text-emerald-500' },
                { label: 'Signal Cloak', status: 'STANDBY', icon: Wifi, color: 'text-zinc-500' },
                { label: 'Active Defense', status: 'READY', icon: Zap, color: 'text-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-black/20 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                    <span className="text-[10px] text-zinc-300 uppercase tracking-wider">{item.label}</span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold uppercase tracking-widest",
                    item.status === 'ACTIVE' ? "text-emerald-500" : 
                    item.status === 'READY' ? "text-amber-500" : "text-zinc-600"
                  )}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Countermeasures */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-rose-500" />
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Quick Defense</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" />
                Caltrops
              </button>
              <button className="py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                <Activity className="w-3 h-3" />
                Strobe
              </button>
              <button className="py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                <Flame className="w-3 h-3" />
                Smoke
              </button>
              <button className="py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2">
                <Zap className="w-3 h-3" />
                EMP Pulse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
