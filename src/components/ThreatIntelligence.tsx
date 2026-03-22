import React, { useState, useEffect } from 'react';
import { ShieldCheck, Radar, AlertTriangle, ShieldAlert, Eye, Globe, History, Info, Lock, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { SignalThreat, V2VNode, ThreatLevel } from '../types';

import { GoogleGenAI } from "@google/genai";

import ReactMarkdown from 'react-markdown';

export function ThreatIntelligence() {
  const [threats, setThreats] = useState<SignalThreat[]>([]);
  const [v2vNodes, setV2vNodes] = useState<V2VNode[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [activeAudit, setActiveAudit] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch('/api/threats');
        const data = await response.json();
        setThreats(data);
      } catch (error) {
        console.error('Failed to fetch threats:', error);
      }
    };

    const interval = setInterval(fetchThreats, 5000);
    fetchThreats();

    // Simulate V2V Node detection (still simulated as it's mesh-based)
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
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(nodeInterval);
    };
  }, []);

  const runAudit = async (threat: SignalThreat) => {
    setIsAuditing(true);
    setAuditResult(null);
    setRiskScore(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `As a Senior Sovereign Edge AI Security Architect, perform a DEEP TACTICAL ANALYSIS of the following signal threat detected in a V2X (Vehicle-to-Everything) mesh network:

        THREAT DATA:
        - Type: ${threat.type}
        - Source: ${threat.source}
        - Frequency: ${threat.frequency}
        - Power: ${threat.power} dBm
        - Description: ${threat.description}
        - Timestamp: ${new Date(threat.timestamp).toISOString()}

        REQUIRED ANALYSIS (Markdown format):
        1. **Threat Profile & Origin Analysis**: Identify the likely actor (State-level, Criminal, Script Kiddie) and the sophistication of the hardware required.
        2. **Potential Attack Vectors**: Detail exactly how this signal could compromise the PiDriveOS cluster (e.g., buffer overflows in DSRC stack, timing attacks on GPS sync, etc.).
        3. **Predictive Capability Assessment**: Based on this signal, what is the most likely NEXT move by the attacker? (e.g., Escalation to full denial of service, lateral movement to other nodes).
        4. **Impact on Sovereign Autonomy**: How does this affect the vehicle's ability to operate without external governance or cloud dependency?
        5. **Recommended Countermeasures (Tactical & Strategic)**: Provide immediate actions (e.g., frequency hopping, MAC randomization) and long-term hardening steps.
        6. **Risk Score (0-100)**: Provide a numerical risk assessment at the very end in the format: [RISK_SCORE: X]`,
      });
      
      const text = response.text;
      setAuditResult(text);
      
      // Extract risk score
      const match = text.match(/\[RISK_SCORE:\s*(\d+)\]/);
      if (match) {
        setRiskScore(parseInt(match[1]));
      }
    } catch (error) {
      console.error('Audit failed:', error);
      setAuditResult('Audit failed. Check connectivity to Sovereign AI engine.');
    } finally {
      setIsAuditing(false);
    }
  };

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
                        onClick={() => {
                          setActiveAudit(threat.id);
                          runAudit(threat);
                        }}
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
                  <span className="text-sm font-mono text-white">
                    {threats.filter(t => t.type === 'IMSI_CATCHER').length} Detected
                  </span>
                </div>
              </div>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Enforcement Uplinks</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">ALPR / Speed</span>
                  <span className="text-sm font-mono text-white">
                    {threats.filter(t => t.type === 'ALPR_UPLINK').length} Detected
                  </span>
                </div>
              </div>
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-2">Signal Integrity</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">GPS / V2X</span>
                  <span className={cn(
                    "text-sm font-mono",
                    threats.some(t => t.type === 'GPS_JAMMER' || t.type === 'V2V_SPOOF') ? "text-rose-400" : "text-emerald-400"
                  )}>
                    {threats.some(t => t.type === 'GPS_JAMMER' || t.type === 'V2V_SPOOF') ? "COMPROMISED" : "SECURE"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      {activeAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-8 shrink-0">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-emerald-500" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Sovereign AI Tactical Audit</h3>
              </div>
              <button onClick={() => {
                setActiveAudit(null);
                setAuditResult(null);
                setRiskScore(null);
              }} className="text-zinc-500 hover:text-white transition-colors">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
              <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800 min-h-[200px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Signal Intelligence Report</div>
                  {riskScore !== null && (
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      riskScore > 70 ? "text-rose-500 border-rose-500/20 bg-rose-500/10" :
                      riskScore > 40 ? "text-amber-500 border-amber-500/20 bg-amber-500/10" :
                      "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                    )}>
                      Risk Score: {riskScore}/100
                    </div>
                  )}
                </div>
                
                {isAuditing ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 text-emerald-500 py-12">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <div className="text-xs font-mono uppercase tracking-widest animate-pulse">Reasoning Engine: Decoding Attack Vectors...</div>
                  </div>
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown>
                      {auditResult || "No audit data available."}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Tactical Recommendation</div>
                  <div className="text-sm font-semibold text-emerald-400 uppercase">
                    {auditResult ? "EXECUTE COUNTERMEASURES" : "PENDING"}
                  </div>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Sovereign Status</div>
                  <div className="text-sm font-semibold text-zinc-300 uppercase">
                    {auditResult ? "DEFENSE ACTIVE" : "WAITING"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <p className="text-[10px] text-rose-400 leading-relaxed uppercase tracking-wide">
                  {threats.find(t => t.id === activeAudit)?.isGovernance 
                    ? "CRITICAL: This signal matches known patterns used in governance-led automated enforcement testing. Deploying cloaking protocols is highly recommended."
                    : "WARNING: This signal originates from a non-trusted V2X mesh node. Maintain isolation until source is verified."}
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setActiveAudit(null);
                setAuditResult(null);
                setRiskScore(null);
              }}
              className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
            >
              Close Tactical Report
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
