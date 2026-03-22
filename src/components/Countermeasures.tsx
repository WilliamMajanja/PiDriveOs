import React, { useState } from 'react';
import { ShieldAlert, Zap, Flame, Droplets, Lock, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export function Countermeasures() {
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [caltropsCount, setCaltropsCount] = useState(12);
  const [isSmokeActive, setIsSmokeActive] = useState(false);
  const [isOilActive, setIsOilActive] = useState(false);
  const [isEmpCharging, setIsEmpCharging] = useState(false);
  const [isPlateFlipped, setIsPlateFlipped] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isShredderActive, setIsShredderActive] = useState(false);
  const [isNightVisionActive, setIsNightVisionActive] = useState(false);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [logs, setLogs] = useState<{ time: string; action: string; status: 'SUCCESS' | 'WARNING' | 'ERROR' }[]>([]);

  const addLog = (action: string, status: 'SUCCESS' | 'WARNING' | 'ERROR' = 'SUCCESS') => {
    setLogs(prev => [{
      time: new Date().toLocaleTimeString(),
      action,
      status
    }, ...prev].slice(0, 10));
  };

  const toggleShredder = () => {
    setIsShredderActive(!isShredderActive);
    addLog(`Retractable tire shredders ${!isShredderActive ? 'deployed' : 'retracted'}`, !isShredderActive ? 'WARNING' : 'SUCCESS');
  };

  const toggleNightVision = () => {
    setIsNightVisionActive(!isNightVisionActive);
    addLog(`IR Floodlights ${!isNightVisionActive ? 'activated' : 'deactivated'}`);
  };

  const triggerLockdown = () => {
    setIsLockdownActive(true);
    addLog('SYSTEM LOCKDOWN INITIATED', 'ERROR');
    setTimeout(() => {
      setIsLockdownActive(false);
      addLog('Lockdown sequence completed - All ports isolated');
    }, 5000);
  };

  const deployEmp = () => {
    setIsEmpCharging(true);
    addLog('EMP Capacitors charging...', 'WARNING');
    setTimeout(() => {
      setIsEmpCharging(false);
      addLog('EMP Pulse discharged - Local electronics disrupted');
      // Screen shake effect
      document.body.classList.add('animate-shake');
      setTimeout(() => document.body.classList.remove('animate-shake'), 500);
    }, 3000);
  };

  const togglePlate = () => {
    setIsPlateFlipped(!isPlateFlipped);
    addLog(`License plate ${!isPlateFlipped ? 'flipped to secondary' : 'restored to primary'}`);
  };

  const toggleSiren = () => {
    setIsSirenActive(!isSirenActive);
    addLog(`High-decibel acoustic deterrent ${!isSirenActive ? 'activated' : 'deactivated'}`);
  };

  const deployCaltrops = () => {
    if (caltropsCount > 0) {
      setCaltropsCount(prev => prev - 1);
      addLog('Caltrops deployed from rear dispenser');
    } else {
      addLog('Caltrops dispenser empty', 'ERROR');
    }
  };

  const toggleStrobe = () => {
    setIsStrobeActive(!isStrobeActive);
    addLog(`High-intensity strobe lights ${!isStrobeActive ? 'activated' : 'deactivated'}`);
  };

  const deploySmoke = () => {
    setIsSmokeActive(true);
    addLog('Smoke screen deployment initiated');
    setTimeout(() => {
      setIsSmokeActive(false);
      addLog('Smoke screen generator cooling down', 'WARNING');
    }, 5000);
  };

  const deployOil = () => {
    setIsOilActive(true);
    addLog('Oil slick deployed');
    setTimeout(() => {
      setIsOilActive(false);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
          <h2 className="text-3xl font-bold text-white tracking-tight">Anti-Pursuit Countermeasures</h2>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Tactical Mode Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Caltrops Control */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-rose-500/30 transition-all">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Zap className={cn("w-8 h-8 transition-colors", caltropsCount > 0 ? "text-amber-500" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Caltrops</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Rear Dispenser</p>
          
          <div className="w-full bg-zinc-800 h-2 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-500" 
              style={{ width: `${(caltropsCount / 12) * 100}%` }} 
            />
          </div>
          
          <div className="flex items-center justify-between w-full mb-6">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Remaining</span>
            <span className="text-xl font-mono text-white font-bold">{caltropsCount}/12</span>
          </div>

          <button 
            onClick={deployCaltrops}
            disabled={caltropsCount === 0}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 active:scale-95"
          >
            Deploy
          </button>
        </div>

        {/* Strobe Control */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-blue-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isStrobeActive ? "bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse" : "bg-zinc-800"
          )}>
            <Zap className={cn("w-8 h-8 transition-colors", isStrobeActive ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Strobe Lights</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">High-Intensity LED</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              isStrobeActive ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-500"
            )}>
              {isStrobeActive ? 'Pulsing @ 15Hz' : 'Standby'}
            </div>
          </div>

          <button 
            onClick={toggleStrobe}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95",
              isStrobeActive ? "bg-zinc-800 text-white border border-zinc-700" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
            )}
          >
            {isStrobeActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        {/* EMP Pulse */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-amber-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isEmpCharging ? "bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse" : "bg-zinc-800"
          )}>
            <Zap className={cn("w-8 h-8 transition-colors", isEmpCharging ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">EMP Pulse</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Electromagnetic Disruption</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className="text-[10px] font-mono text-amber-500 font-bold">
              {isEmpCharging ? 'CHARGING CAPACITORS...' : 'READY FOR DISCHARGE'}
            </div>
          </div>

          <button 
            onClick={deployEmp}
            disabled={isEmpCharging}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20 active:scale-95"
          >
            Discharge
          </button>
        </div>

        {/* License Plate Flipper */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isPlateFlipped ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-zinc-800"
          )}>
            <ShieldAlert className={cn("w-8 h-8 transition-colors", isPlateFlipped ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Plate Flipper</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Identity Obfuscation</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className="px-4 py-2 bg-black/40 border border-zinc-800 rounded font-mono text-xs text-zinc-300">
              {isPlateFlipped ? 'X-772-TACT' : 'ABC-123-REG'}
            </div>
          </div>

          <button 
            onClick={togglePlate}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95",
              isPlateFlipped ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            )}
          >
            {isPlateFlipped ? 'Restore' : 'Flip Plate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Smoke Screen */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isSmokeActive ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-zinc-800"
          )}>
            <Flame className={cn("w-8 h-8 transition-colors", isSmokeActive ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Smoke Screen</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Glycol Generator</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-6 rounded-sm transition-colors",
                    isSmokeActive ? "bg-emerald-500 animate-bounce" : "bg-zinc-800"
                  )} 
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>

          <button 
            onClick={deploySmoke}
            disabled={isSmokeActive}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            Deploy
          </button>
        </div>

        {/* Oil Slick */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-zinc-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isOilActive ? "bg-zinc-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-zinc-800"
          )}>
            <Droplets className={cn("w-8 h-8 transition-colors", isOilActive ? "text-zinc-900" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Oil Slick</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Rear Valve</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
             <div className="text-[10px] font-mono text-zinc-500">PRESSURE: 42 PSI</div>
          </div>

          <button 
            onClick={deployOil}
            disabled={isOilActive}
            className="w-full py-3 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-900 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-white/10 active:scale-95"
          >
            Release
          </button>
        </div>

        {/* Acoustic Deterrent (Siren) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-rose-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isSirenActive ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-bounce" : "bg-zinc-800"
          )}>
            <Activity className={cn("w-8 h-8 transition-colors", isSirenActive ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Acoustic Deterrent</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">High-Decibel Siren</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              isSirenActive ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800 text-zinc-500"
            )}>
              {isSirenActive ? '130 dB OUTPUT' : 'STANDBY'}
            </div>
          </div>

          <button 
            onClick={toggleSiren}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95",
              isSirenActive ? "bg-zinc-800 text-white border border-zinc-700" : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20"
            )}
          >
            {isSirenActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        {/* Tire Shredder */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-rose-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isShredderActive ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]" : "bg-zinc-800"
          )}>
            <ShieldAlert className={cn("w-8 h-8 transition-colors", isShredderActive ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Tire Shredder</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Retractable Spikes</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              isShredderActive ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800 text-zinc-500"
            )}>
              {isShredderActive ? 'DEPLOYED' : 'RETRACTED'}
            </div>
          </div>

          <button 
            onClick={toggleShredder}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95",
              isShredderActive ? "bg-zinc-800 text-white border border-zinc-700" : "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20"
            )}
          >
            {isShredderActive ? 'Retract' : 'Deploy'}
          </button>
        </div>

        {/* Night Vision Assist */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isNightVisionActive ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" : "bg-zinc-800"
          )}>
            <Zap className={cn("w-8 h-8 transition-colors", isNightVisionActive ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">IR Floodlights</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Night Vision Assist</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
            <div className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
              isNightVisionActive ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800 text-zinc-500"
            )}>
              {isNightVisionActive ? 'ILLUMINATING' : 'STANDBY'}
            </div>
          </div>

          <button 
            onClick={toggleNightVision}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95",
              isNightVisionActive ? "bg-zinc-800 text-white border border-zinc-700" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
            )}
          >
            {isNightVisionActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        {/* System Lockdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center group hover:border-rose-500/30 transition-all">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300",
            isLockdownActive ? "bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-ping" : "bg-zinc-800"
          )}>
            <Lock className={cn("w-8 h-8 transition-colors", isLockdownActive ? "text-white" : "text-zinc-600")} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">System Lockdown</h3>
          <p className="text-[10px] text-zinc-500 mb-6 uppercase tracking-[0.2em]">Total Isolation</p>
          
          <div className="flex-1 flex items-center justify-center w-full mb-6">
             <div className="text-[10px] font-mono text-zinc-500">ENCRYPTION: AES-256</div>
          </div>

          <button 
            onClick={triggerLockdown}
            disabled={isLockdownActive}
            className={cn(
              "w-full py-3 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95",
              isLockdownActive ? "bg-rose-900 text-rose-500" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            )}
          >
            {isLockdownActive ? 'LOCKING...' : 'Lockdown'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">Hardware Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-zinc-300">Dispenser Servo</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500">READY</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-zinc-300">Strobe Driver</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500">READY</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-zinc-300">Pressure Pump</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500">READY</span>
            </div>
          </div>
        </div>

        {/* Tactical Log */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Deployment History</h3>
            <Lock className="w-4 h-4 text-zinc-600" />
          </div>
          <div className="flex-1 bg-black/50 rounded-xl border border-zinc-800 p-4 font-mono text-[10px] space-y-2 overflow-y-auto h-48 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 border-b border-zinc-800/50 pb-2 last:border-0">
                <span className="text-zinc-600">[{log.time}]</span>
                <span className={cn(
                  log.status === 'SUCCESS' ? "text-emerald-500" : 
                  log.status === 'WARNING' ? "text-amber-500" : "text-rose-500"
                )}>
                  {log.action}
                </span>
              </div>
            ))}
            {logs.length === 0 && <div className="text-zinc-700 italic">No tactical actions recorded...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
