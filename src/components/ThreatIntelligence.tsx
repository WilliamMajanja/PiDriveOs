import React, { useState, useEffect } from 'react';
import { ShieldCheck, Radar, AlertTriangle, ShieldAlert, Eye, Globe, History, Info, Lock, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { SignalThreat, V2VNode, ThreatLevel } from '../types';

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<SignalThreat[]>([]);
  const [v2vNodes, setV2vNodes] = useState<V2VNode[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [activeAudit, setActiveAudit] = useState<string | null>(null);

  useEffect(() => {
    // Simulate V2V Node detection
    const nodeInterval = setInterval(() => {
      const newNode: V2VNode = {
        id: `node-${Math.floor(Math.random() * 1000)}`,
        distance: Math.random() * 100,
        angle: Math.random() * 360,
        trustScore: Math.random() * 100,
        lastSeen: new Date().toISOString(),
        isMalicious: Math.random() > 0.9,
      };
      setV2vNodes(prev => [newNode, ...prev].slice(0, 12));

      if (newNode.isMalicious) {
        const threat: SignalThreat = {
          id: `threat-${Date.now()}`,
          type: 'V2V_SPOOF',
          source: newNode.id,
          frequency: '5.9 GHz',
          power: -Math.floor(Math.random() * 40 + 50),
          level: 'HIGH',
          timestamp: new Date().toISOString(),
          description: 'Anomalous V2V broadcast detected. Possible position spoofing or replay attack.',
          isGovernance: false,
        };
        setThreats(prev => [threat, ...prev].slice(0, 10));
      }
    }, 3000);

    // Simulate Governance/Surveillance detection
    const govInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        const types: SignalThreat['type'][] = ['IMSI_CATCHER', 'ALPR_UPLINK', 'GPS_JAMMER'];
        const type = types[Math.floor(Math.random() * types.length)];
        const threat: SignalThreat = {
          id: `gov-${Date.now()}`,
          type,
          source: 'UNKNOWN_GOV_NODE',
          frequency: type === 'IMSI_CATCHER' ? '850 MHz' : type === 'ALPR_UPLINK' ? '915 MHz' : '1.57 GHz',
          power: -Math.floor(Math.random() * 20 + 30),
          level: type === 'GPS_JAMMER' ? 'CRITICAL' : 'MEDIUM',
          timestamp: new Date().toISOString(),
          description: type === 'IMSI_CATCHER' ? 'Cellular surveillance node detected. IMSI catcher signature match.' : 
                       type === 'ALPR_UPLINK' ? 'Automated License Plate Recognition data uplink detected.' : 
                       'GPS signal interference detected. High-power jamming signature.',
          isGovernance: true,
        };
        setThreats(prev => [threat, ...prev].slice(0, 10));
      }
    }, 5000);

    return () => {
      clearInterval(nodeInterval);
      clearInterval(govInterval);
    };
  }, []);

  const getLevelColor = (level: ThreatLevel) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-500 border-rose-500/20 bg-rose-500/10';
      case 'HIGH': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'MEDIUM': return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
      case 'LOW': return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-semibold">Threat Intelligence <span className="text-zinc-500 text-lg font-normal">Active Defense</span></h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Monitoring V2X Mesh</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* V2X Mesh Radar */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Radar className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">V2X Mesh Radar</h3>
            </div>
            <button 
              onClick={() => setIsScanning(!isScanning)}
              className={cn("text-[10px] font-mono uppercase px-2 py-1 rounded border transition-all", isScanning ? "text-emerald-400 border-emerald-500/30" : "text-zinc-500 border-zinc-800")}
            >
              {isScanning ? 'Scanning...' : 'Paused'}
            </button>
          </div>
          
          <div className="relative aspect-square bg-black/40 rounded-full border border-zinc-800 flex items-center justify-center overflow-hidden mb-6">
            {/* Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full border border-zinc-800/50 rounded-full" />
              <div className="absolute w-2/3 h-2/3 border border-zinc-800/50 rounded-full" />
              <div className="absolute w-1/3 h-1/3 border border-zinc-800/50 rounded-full" />
              <div className="absolute w-px h-full bg-zinc-800/50" />
              <div className="absolute h-px w-full bg-zinc-800/50" />
            </div>

            {/* Scanning Sweep */}
            {isScanning && (
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent origin-center animate-[spin_4s_linear_infinite]" />
            )}

            {/* Nodes */}
            {v2vNodes.map(node => (
              <div 
                key={node.id}
                className={cn(
                  "absolute w-2 h-2 rounded-full transition-all duration-1000",
                  node.isMalicious ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                )}
                style={{
                  left: `${50 + (node.distance / 2) * Math.cos(node.angle * (Math.PI / 180))}%`,
                  top: `${50 + (node.distance / 2) * Math.sin(node.angle * (Math.PI / 180))}%`,
                }}
              />
            ))}

            {/* Self */}
            <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500">
              <span>Nearby Nodes</span>
              <span>{v2vNodes.length} Detected</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-black/20 rounded-lg border border-zinc-800">
                <div className="text-[9px] text-zinc-500 uppercase mb-1">Avg Trust</div>
                <div className="text-sm font-mono text-emerald-400">
                  {v2vNodes.length > 0 ? Math.floor(v2vNodes.reduce((acc, n) => acc + n.trustScore, 0) / v2vNodes.length) : 0}%
                </div>
              </div>
              <div className="p-2 bg-black/20 rounded-lg border border-zinc-800">
                <div className="text-[9px] text-zinc-500 uppercase mb-1">Malicious</div>
                <div className="text-sm font-mono text-rose-400">
                  {v2vNodes.filter(n => n.isMalicious).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Intelligence Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-medium text-white">Active Threat Intelligence</h3>
              </div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Real-time Audit</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {threats.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-4">
                  <Lock className="w-12 h-12 opacity-20" />
                  <p className="text-sm italic">No active threats detected in current perimeter.</p>
                </div>
              ) : (
                threats.map(threat => (
                  <div 
                    key={threat.id} 
                    className={cn(
                      "group flex flex-col p-4 rounded-2xl border transition-all duration-300 animate-in slide-in-from-right-4",
                      threat.isGovernance ? "bg-blue-500/5 border-blue-500/20" : "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("px-2 py-0.5 rounded text-[9px] font-bold uppercase", getLevelColor(threat.level))}>
                          {threat.level}
                        </div>
                        <span className="text-sm font-semibold text-white">{threat.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                        {threat.isGovernance && <Globe className="w-3 h-3 text-blue-400" />}
                        <span>{new Date(threat.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{threat.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-zinc-600 uppercase">Source</span>
                          <span className="text-[10px] font-mono text-zinc-400">{threat.source}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-zinc-600 uppercase">Freq</span>
                          <span className="text-[10px] font-mono text-zinc-400">{threat.frequency}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-zinc-600 uppercase">Power</span>
                          <span className="text-[10px] font-mono text-zinc-400">{threat.power} dBm</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveAudit(threat.id)}
                        className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                      >
                        Audit Signal
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Governance Monitor */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">Governance & Surveillance Monitor</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Cellular Surveillance</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">IMSI Catchers</span>
                  <span className="text-sm font-mono text-white">0 Detected</span>
                </div>
              </div>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Enforcement Uplinks</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">ALPR / Speed</span>
                  <span className="text-sm font-mono text-white">0 Detected</span>
                </div>
              </div>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Signal Integrity</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">GPS / V2X</span>
                  <span className="text-sm font-mono text-emerald-400">SECURE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal (Simplified) */}
      {activeAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-bold text-white">Sovereign AI Audit Report</h3>
              </div>
              <button onClick={() => setActiveAudit(null)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="space-y-6">
              <div className="p-4 bg-black/40 rounded-2xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Signal Analysis</div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  The Gemini 3 Flash reasoning engine has analyzed the signal signature. The source exhibits characteristics of a non-standard DSRC broadcast. High probability of a replay attack targeting the vehicle's collision avoidance system.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Recommendation</div>
                  <div className="text-sm font-semibold text-emerald-400">ISOLATE NODE</div>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Action Taken</div>
                  <div className="text-sm font-semibold text-zinc-300">LOGGED & IGNORED</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <p className="text-xs text-rose-400">This signal matches known patterns used in governance-led automated enforcement testing.</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveAudit(null)}
              className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all"
            >
              Close Audit
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex gap-4 items-start">
        <Info className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
        <div>
          <h4 className="text-emerald-500 font-semibold mb-1 text-sm">Sovereign Defense Protocol</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            The Threat Intelligence system uses the HackRF One and ESP32 addons to monitor the 5.9GHz V2X spectrum and cellular bands. It identifies malicious actors attempting to spoof vehicle data or intercept communications. The "Governance Monitor" specifically tracks signals from automated enforcement systems (ALPR, Speed Cameras) and surveillance nodes (IMSI Catchers) to ensure your vehicle remains sovereign and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
