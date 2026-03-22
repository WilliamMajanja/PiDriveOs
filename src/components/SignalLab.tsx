import React, { useState, useEffect } from 'react';
import { Zap, Radio, ShieldAlert, Wifi, AlertCircle, Activity, Info, Cpu, Layers, Sliders } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { cn } from '../lib/utils';

type SignalSource = 'internal' | 'esp32' | 'hackrf';

export function SignalLab() {
  const [source, setSource] = useState<SignalSource>('internal');
  const [isMirtActive, setIsMirtActive] = useState(false);
  const [detectedSignals, setDetectedSignals] = useState<string[]>([]);
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [gain, setGain] = useState(20);

  useEffect(() => {
    // Simulate frequency scanner data based on source
    const interval = setInterval(() => {
      let range = 20;
      let startFreq = 300;
      let step = 30;

      if (source === 'hackrf') {
        range = 40;
        startFreq = 1;
        step = 150; // Simplified for visualization
      } else if (source === 'esp32') {
        range = 14;
        startFreq = 2400;
        step = 5; // 2.4GHz WiFi channels
      }

      const newData = Array.from({ length: range }, (_, i) => ({
        freq: (startFreq + i * step).toString(),
        power: Math.random() * (gain / 40 * 100),
      }));
      setFrequencyData(newData);

      // Randomly detect "threats" or "networks"
      if (Math.random() > 0.95) {
        let threats = ['KA-BAND RADAR', 'K-BAND RADAR', 'LASER DETECTED', 'X-BAND RADAR'];
        if (source === 'esp32') threats = ['WIFI DEAUTH DETECTED', 'BT BEACON FOUND', 'ROGUE AP DETECTED'];
        if (source === 'hackrf') threats = ['WIDEBAND SIGNAL', 'GSM UPLINK', 'GPS JAMMING DETECTED'];
        
        const threat = threats[Math.floor(Math.random() * threats.length)];
        setDetectedSignals(prev => [threat, ...prev].slice(0, 5));
      }
    }, 800);

    return () => clearInterval(interval);
  }, [source, gain]);

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-semibold">Signal Lab <span className="text-zinc-500 text-lg font-normal">v2.0</span></h2>
        </div>
        <div className="flex items-center gap-4">
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
              <Radio className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-medium text-white">Traffic Control</h3>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4 bg-black/20 rounded-xl border border-zinc-800 mb-6">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500",
                isMirtActive ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]" : "bg-zinc-800"
              )}>
                <Wifi className={cn("w-8 h-8", isMirtActive ? "text-white animate-pulse" : "text-zinc-600")} />
              </div>
              <div className="text-[10px] font-medium text-zinc-300 mb-1 uppercase tracking-wider">MIRT Opticom</div>
              <div className={cn("text-[9px] font-mono uppercase tracking-widest", isMirtActive ? "text-emerald-400" : "text-zinc-500")}>
                {isMirtActive ? "Broadcasting 14Hz" : "Standby"}
              </div>
            </div>

            <button
              onClick={() => setIsMirtActive(!isMirtActive)}
              className={cn(
                "w-full py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 text-xs",
                isMirtActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
              )}
            >
              {isMirtActive ? "Stop MIRT" : "Activate MIRT"}
            </button>
          </div>
        </div>

        {/* Intelligence Center */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-medium text-white">Signal Intelligence Center</h3>
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
              {/* Spectrum Analyzer */}
              <div className="xl:col-span-2 bg-black/40 rounded-xl p-6 border border-zinc-800 flex flex-col">
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

