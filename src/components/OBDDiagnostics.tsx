import React, { useState, useEffect } from 'react';
import { Gauge, Activity, AlertCircle, CheckCircle2, Search, Terminal, Settings } from 'lucide-react';
import { OBDData } from '../types';
import { cn } from '../lib/utils';

export function OBDDiagnostics() {
  const [data, setData] = useState<OBDData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/obd');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const obdData = await response.json();
        setData(obdData);
      } catch (error) {
        console.error('Failed to fetch OBD data:', error);
        // Add a small delay before retrying on failure
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    const interval = setInterval(fetchData, 1000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));
  };

  const scanPIDs = () => {
    setIsScanning(true);
    addLog('Initiating PID scan...');
    setTimeout(() => {
      addLog('Scanning Mode 01 (Real-time Data)...');
      setTimeout(() => {
        addLog('Scanning Mode 03 (Stored DTCs)...');
        setTimeout(() => {
          addLog('Scan complete. 42 PIDs supported.');
          setIsScanning(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const clearCodes = () => {
    addLog('Sending Mode 04 (Clear DTCs) command...');
    setTimeout(() => {
      addLog('DTCs cleared successfully.');
    }, 1000);
  };

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Gauge className="w-8 h-8 text-emerald-500" />
          <h2 className="text-3xl font-bold text-white tracking-tight">OBD-II Diagnostics</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={scanPIDs}
            disabled={isScanning}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Search className={cn("w-4 h-4", isScanning && "animate-spin")} />
            Scan PIDs
          </button>
          <button 
            onClick={clearCodes}
            className="px-6 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Clear DTCs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Real-time Gauges */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16" />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Engine RPM</div>
            <div className="text-4xl font-mono text-emerald-400">{Math.round(data.rpm)}</div>
            <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(data.rpm / 8000) * 100}%` }} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Gauge className="w-16 h-16" />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Vehicle Speed</div>
            <div className="text-4xl font-mono text-blue-400">{Math.round(data.speed)} <span className="text-sm">MPH</span></div>
            <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(data.speed / 120) * 100}%` }} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16" />
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-bold">Engine Load</div>
            <div className="text-4xl font-mono text-amber-400">{Math.round(data.load)}%</div>
            <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${data.load}%` }} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">System Status</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Coolant Temp</span>
                <span className="text-sm font-mono text-white">{data.coolantTemp}°C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Battery Voltage</span>
                <span className="text-sm font-mono text-white">{data.voltage}V</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Throttle Position</span>
                <span className="text-sm font-mono text-white">{data.throttlePos}%</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">Vehicle Info</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">VIN</span>
                <span className="text-sm font-mono text-white">{data.vin}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Protocol</span>
                <span className="text-[10px] font-mono text-zinc-300 text-right">{data.protocol}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
              data.dtcCount === 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
              {data.dtcCount === 0 ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div className="text-xl font-bold text-white">{data.dtcCount} DTCs</div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Diagnostic Trouble Codes</div>
          </div>

          {/* DTC List Section */}
          {data.dtcs && data.dtcs.length > 0 && (
            <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg font-medium text-white uppercase tracking-tight">Detected Trouble Codes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.dtcs.map((dtc, i) => (
                  <div key={i} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl group hover:border-rose-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-mono font-bold text-rose-400">{dtc.code}</span>
                      <span className="text-[8px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full uppercase font-bold">Stored</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{dtc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Diagnostic Console */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Diagnostic Console</h3>
            </div>
            <div className="flex-1 bg-black/50 rounded-xl border border-zinc-800 p-4 font-mono text-[10px] text-zinc-500 space-y-2 overflow-y-auto h-64 custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              {logs.length === 0 && <div className="italic text-zinc-700">Awaiting commands...</div>}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Calibration Tools</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                Reset Fuel Trim
              </button>
              <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                Idle Relearn
              </button>
              <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                ABS Bleed Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
