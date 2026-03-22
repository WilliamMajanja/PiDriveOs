import React, { useState, useEffect } from 'react';
import { Zap, Radio, ShieldAlert, Wifi, AlertCircle, Activity, Info, Cpu, Layers, Sliders, Target, Lock, Unlock, Database, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

type SignalSource = 'internal' | 'esp32' | 'hackrf';

export function SignalLab() {
  const [source, setSource] = useState<SignalSource>('internal');
  const [isMirtActive, setIsMirtActive] = useState(false);
  const [detectedSignals, setDetectedSignals] = useState<string[]>([]);
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [gain, setGain] = useState(20);
  const [isHopping, setIsHopping] = useState(false);
  const [isJamming, setIsJamming] = useState(false);
  const [jammerDuration, setJammerDuration] = useState(0);
  const [isBypassActive, setIsBypassActive] = useState(false);
  const [isPidScanning, setIsPidScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'spectrum' | 'bypass' | 'scanner'>('spectrum');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isJamming) {
      timer = setInterval(() => {
        setJammerDuration(prev => prev + 1);
      }, 1000);
    } else {
      setJammerDuration(0);
    }
    return () => clearInterval(timer);
  }, [isJamming]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch('/api/signals');
        const data = await response.json();
        
        let processedSignals = data.signals.map((s: any) => ({ freq: s.x.toString(), power: s.y }));
        
        if (isJamming) {
          // Simulate signal disruption/noise
          processedSignals = processedSignals.map((s: any) => ({
            ...s,
            power: Math.random() > 0.3 ? Math.floor(Math.random() * 40 + 60) : s.power
          }));
        } else {
          // Add some "peaks" to make it look like real signals
          processedSignals = processedSignals.map((s: any, i: number) => {
            if (i % 15 === 0) return { ...s, power: Math.floor(Math.random() * 30 + 60) };
            return s;
          });
        }

        setFrequencyData(processedSignals);
        setGain(data.gain);
        if (data.source === 'HACKRF_ONE') setSource('hackrf');
        else if (data.source === 'ESP32') setSource('esp32');
        else setSource('internal');
      } catch (error) {
        console.error('Failed to fetch signals:', error);
      }
    };

    const interval = setInterval(fetchSignals, 1000);
    fetchSignals();

    return () => clearInterval(interval);
  }, [isJamming]);

  const [interceptLogs, setInterceptLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isBypassActive) {
      const interval = setInterval(() => {
        const possibleLogs = [
          `[OK] Handshake intercepted: DSRC_V2X_NODE_${Math.floor(Math.random() * 999)}`,
          `[OK] Injecting spoofed priority packet (PRIO_${Math.floor(Math.random() * 5)})...`,
          `[OK] Traffic controller state: ${Math.random() > 0.5 ? 'OVERRIDE_REQUESTED' : 'PHASE_LOCK_ENGAGED'}`,
          `[..] Monitoring response stream for ACK...`,
          `[OK] Phase transition initiated: GREEN_ALL_CLEAR`,
          `[OK] Signal integrity: ${(Math.random() * 5 + 95).toFixed(1)}% | Latency: ${Math.floor(Math.random() * 10)}ms`,
          `[WARN] Encryption layer detected: AES-128 (Bypassing...)`,
          `[OK] Node ID spoofed: 0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`
        ];
        const newLog = possibleLogs[Math.floor(Math.random() * possibleLogs.length)];
        setInterceptLogs(prev => [`[${new Date().toLocaleTimeString()}] ${newLog}`, ...prev].slice(0, 20));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setInterceptLogs([]);
    }
  }, [isBypassActive]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-amber-500" />
          <h2 className="text-3xl font-bold text-white tracking-tight">Signal Lab <span className="text-zinc-500 text-lg font-normal">v2.5 Tactical</span></h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsHopping(!isHopping)}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
              isHopping ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            )}
          >
            <Target className={cn("w-4 h-4", isHopping && "animate-pulse")} />
            Freq Hopping
          </button>
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            {(['internal', 'esp32', 'hackrf'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  source === s ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {s === 'internal' ? 'Pi Native' : s.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Advanced Mode</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Source Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sliders className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">Source Config</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-wider">LNA Gain</label>
                  <span className="text-xs font-mono text-blue-400">{gain} dB</span>
                </div>
                <input 
                  type="range" min="0" max="40" value={gain} 
                  onChange={(e) => setGain(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-300">Hardware Status</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Device:</span>
                    <span className="text-emerald-400 font-mono">{source === 'hackrf' ? 'HackRF One' : source === 'esp32' ? 'ESP32-S3' : 'BCM2835'}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Interface:</span>
                    <span className="text-zinc-300 font-mono">{source === 'internal' ? 'GPIO/PWM' : 'USB-CDC'}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-500">Sample Rate:</span>
                    <span className="text-zinc-300 font-mono">{source === 'hackrf' ? '20 MSPS' : '2 MSPS'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">Protocol Analysis</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Active Protocol</div>
                <div className="text-sm font-mono text-white">DSRC (802.11p)</div>
              </div>
              <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Modulation</div>
                <div className="text-sm font-mono text-white">OFDM</div>
              </div>
              <div className="p-4 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Bandwidth</div>
                <div className="text-sm font-mono text-white">10 MHz</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-medium text-white">Tactical Controls</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Lock className={cn("w-4 h-4 transition-colors", isJamming ? "text-rose-500" : "text-zinc-500")} />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Signal Jammer</span>
                </div>
                <button 
                  onClick={() => setIsJamming(!isJamming)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    isJamming ? "bg-rose-500" : "bg-zinc-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    isJamming ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Unlock className={cn("w-4 h-4 transition-colors", isBypassActive ? "text-emerald-500" : "text-zinc-500")} />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Protocol Bypass</span>
                </div>
                <button 
                  onClick={() => {
                    setIsBypassActive(!isBypassActive);
                    if (!isBypassActive) setActiveTab('bypass');
                  }}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    isBypassActive ? "bg-emerald-500" : "bg-zinc-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    isBypassActive ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Search className={cn("w-4 h-4 transition-colors", isPidScanning ? "text-blue-500" : "text-zinc-500")} />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">PID Scanner</span>
                </div>
                <button 
                  onClick={() => {
                    setIsPidScanning(!isPidScanning);
                    if (!isPidScanning) setActiveTab('scanner');
                  }}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all relative",
                    isPidScanning ? "bg-blue-500" : "bg-zinc-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    isPidScanning ? "left-6" : "left-1"
                  )} />
                </button>
              </div>
            </div>
          </div>

          {/* Jammer Status Card */}
          <div className={cn(
            "bg-zinc-900 border rounded-2xl p-6 shadow-xl transition-all duration-500",
            isJamming ? "border-rose-500/50 bg-rose-500/5" : "border-zinc-800"
          )}>
            <div className="flex items-center gap-3 mb-6">
              <Activity className={cn("w-5 h-5", isJamming ? "text-rose-500" : "text-zinc-500")} />
              <h3 className="text-lg font-medium text-white">Jammer Status</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">State</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                  isJamming ? "bg-rose-500/20 text-rose-500 animate-pulse" : "bg-zinc-800 text-zinc-500"
                )}>
                  {isJamming ? 'Active' : 'Standby'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Freq Range</span>
                <span className="text-xs font-mono text-zinc-300">
                  {source === 'hackrf' ? '1MHz - 6GHz' : source === 'esp32' ? '2.4GHz / 5GHz' : '300MHz - 900MHz'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Power Output</span>
                <span className="text-xs font-mono text-zinc-300">{isJamming ? `${gain + 10} dBm` : '0 dBm'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Duration</span>
                <span className="text-xs font-mono text-zinc-300">
                  {Math.floor(jammerDuration / 60)}:{(jammerDuration % 60).toString().padStart(2, '0')}s
                </span>
              </div>
              {isJamming && (
                <div className="pt-4 border-t border-rose-500/20">
                  <div className="flex items-center gap-2 text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                    <AlertCircle className="w-3 h-3" />
                    High Heat Warning
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Center */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-medium text-white">Signal Intelligence Center</h3>
                </div>
                <div className="flex bg-zinc-800/50 p-1 rounded-lg border border-zinc-800">
                  <button 
                    onClick={() => setActiveTab('spectrum')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      activeTab === 'spectrum' ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Spectrum
                  </button>
                  <button 
                    onClick={() => setActiveTab('bypass')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      activeTab === 'bypass' ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Bypass
                  </button>
                  <button 
                    onClick={() => setActiveTab('scanner')}
                    className={cn(
                      "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      activeTab === 'scanner' ? "bg-blue-500/20 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    Scanner
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400 uppercase font-mono">
                    {source === 'hackrf' ? '1MHz - 6GHz' : source === 'esp32' ? '2.4GHz / 5GHz' : '300MHz - 900MHz'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-500 uppercase font-mono">Real-time Scan</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[400px]">
              {/* Main Display Area */}
              <div className="xl:col-span-2 bg-black/40 rounded-xl p-6 border border-zinc-800 flex flex-col relative overflow-hidden">
                {activeTab === 'spectrum' && (
                  <>
                    {isJamming && (
                      <div className="absolute inset-0 bg-rose-500/5 pointer-events-none flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-1 h-8 bg-rose-500/40 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] animate-pulse">Jamming Active</span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Waterfall Spectrum Analyzer</div>
                      <div className="text-[10px] text-zinc-600 font-mono">PEAK: -{Math.floor(Math.random() * 20 + 40)} dBm</div>
                    </div>
                    <div className="flex-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={frequencyData}>
                          <XAxis dataKey="freq" hide />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#10b981' }}
                            labelStyle={{ color: '#71717a', fontSize: '10px' }}
                          />
                          <Bar dataKey="power" radius={[4, 4, 0, 0]}>
                            {frequencyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.power > 80 ? '#f43f5e' : entry.power > 50 ? '#fbbf24' : '#10b981'} opacity={0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-4 text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
                      <span>{source === 'hackrf' ? '1.0 MHz' : source === 'esp32' ? '2.401 GHz' : '300 MHz'}</span>
                      <span>Center: {source === 'hackrf' ? '3.0 GHz' : source === 'esp32' ? '2.437 GHz' : '600 MHz'}</span>
                      <span>{source === 'hackrf' ? '6.0 GHz' : source === 'esp32' ? '2.484 GHz' : '900 MHz'}</span>
                    </div>
                  </>
                )}

                {activeTab === 'bypass' && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Protocol Bypass Monitor</div>
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                        isBypassActive ? "bg-emerald-500/20 text-emerald-500 animate-pulse" : "bg-zinc-800 text-zinc-600"
                      )}>
                        {isBypassActive ? 'INTERCEPTING_V2X' : 'IDLE'}
                      </div>
                    </div>
                    <div className="flex-1 bg-black/20 rounded-xl p-4 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar border border-zinc-800/50">
                      {isBypassActive ? (
                        interceptLogs.map((log, i) => (
                          <div key={i} className="text-emerald-500/80 flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>{log}</span>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-700 italic gap-4">
                          <Unlock className="w-12 h-12 opacity-20" />
                          <span className="uppercase tracking-[0.2em] text-[10px]">Activate Protocol Bypass to begin interception...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'scanner' && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">PID Scanner Results</div>
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                        isPidScanning ? "bg-blue-500/20 text-blue-500 animate-pulse" : "bg-zinc-800 text-zinc-600"
                      )}>
                        {isPidScanning ? 'SCANNING_ECU' : 'IDLE'}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { pid: '0x0C', name: 'Engine RPM', val: '2450', unit: 'RPM' },
                        { pid: '0x0D', name: 'Vehicle Speed', val: '42', unit: 'km/h' },
                        { pid: '0x05', name: 'Coolant Temp', val: '92', unit: '°C' },
                        { pid: '0x11', name: 'Throttle Pos', val: '18.4', unit: '%' },
                        { pid: '0x0F', name: 'Intake Temp', val: '34', unit: '°C' },
                        { pid: '0x04', name: 'Engine Load', val: '22.1', unit: '%' },
                      ].map(p => (
                        <div key={p.pid} className="p-3 bg-black/20 border border-zinc-800 rounded-xl flex justify-between items-center group hover:border-blue-500/30 transition-all">
                          <div>
                            <div className="text-[8px] text-zinc-600 font-mono">{p.pid}</div>
                            <div className="text-[10px] text-zinc-300 uppercase font-bold">{p.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono text-blue-400 font-bold">{isPidScanning ? p.val : '---'}</div>
                            <div className="text-[8px] text-zinc-600 uppercase font-mono">{p.unit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {isPidScanning && (
                      <div className="mt-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-blue-500" />
                          <span className="text-[9px] text-blue-400 uppercase font-bold tracking-widest">Bus Traffic: 42.1 KB/s</span>
                        </div>
                        <div className="text-[9px] text-zinc-500 font-mono">PACKETS: 1,422 | ERRORS: 0</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Detection Log */}
              <div className="bg-black/40 rounded-xl p-6 border border-zinc-800 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Threat Intelligence Log</div>
                  <Activity className="w-4 h-4 text-rose-500 opacity-50" />
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                  {detectedSignals.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-600 text-xs italic">
                      Scanning for anomalies...
                    </div>
                  ) : (
                    detectedSignals.map((sig, i) => (
                      <div key={i} className="group flex flex-col p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-rose-500/30 transition-all animate-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-bold text-rose-400 tracking-wider">{sig}</span>
                          </div>
                          <span className="text-[8px] text-zinc-600 font-mono">0.2s AGO</span>
                        </div>
                        <div className="text-[9px] text-zinc-500 font-mono">FREQ: {Math.floor(Math.random() * 5000 + 100)} MHz | PWR: -{Math.floor(Math.random() * 30 + 50)} dBm</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'X-BAND', freq: '10.525' },
                { label: 'K-BAND', freq: '24.150' },
                { label: 'KA-BAND', freq: '34.700' },
                { label: 'LASER', freq: '904nm' }
              ].map(band => (
                <div key={band.label} className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 group hover:bg-zinc-800/50 transition-colors">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors">{band.label}</div>
                  <div className="text-lg font-mono font-bold text-zinc-300">{band.freq}<span className="text-[10px] text-zinc-600 ml-1">{band.label === 'LASER' ? '' : 'GHz'}</span></div>
                  <div className="mt-2 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-0 group-hover:w-1/4 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Warning */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4 items-start">
            <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
            <div>
              <h4 className="text-amber-500 font-semibold mb-1 text-sm">Legal & Safety Disclaimer</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                The functionalities in the Signal Lab (including ESP32 Wi-Fi tools and HackRF wideband scanning) are for educational and authorized research purposes only. Traffic light manipulation, radar jamming, or unauthorized network interference are illegal in most jurisdictions. PiDriveOS does not condone the use of these features on public roads or unauthorized networks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

