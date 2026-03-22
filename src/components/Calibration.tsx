import React, { useState } from 'react';
import { Settings2, Save, RotateCcw, Cpu, LayoutGrid, Sliders, Activity, Gauge, ShieldAlert, CheckCircle2, AlertCircle, X, ChevronRight, Zap } from 'lucide-react';
import { PiModel, ServoMapping } from '../types';
import { cn } from '../lib/utils';

export function Calibration() {
  const [piModel, setPiModel] = useState<PiModel>('PI_5_16GB');
  const [steeringCenter, setSteeringCenter] = useState(0);
  const [steeringMax, setSteeringMax] = useState(45);
  const [throttleMax, setThrottleMax] = useState(100);
  const [isEscCalibrating, setIsEscCalibrating] = useState(false);
  const [isLeveling, setIsLeveling] = useState(false);
  const [editingMapping, setEditingMapping] = useState<number | null>(null);
  
  const [mappings, setMappings] = useState<ServoMapping[]>([
    { channel: 0, function: 'STEERING', minPulse: 1000, maxPulse: 2000, centerPulse: 1500, inverted: false },
    { channel: 1, function: 'THROTTLE', minPulse: 1000, maxPulse: 2000, centerPulse: 1500, inverted: false },
    { channel: 2, function: 'BRAKE', minPulse: 1000, maxPulse: 2000, centerPulse: 1500, inverted: false },
  ]);

  const handleMappingUpdate = (index: number, updates: Partial<ServoMapping>) => {
    setMappings(prev => prev.map((m, i) => i === index ? { ...m, ...updates } : m));
  };

  const startEscCalibration = () => {
    setIsEscCalibrating(true);
    // Simulate ESC calibration sequence
    setTimeout(() => setIsEscCalibrating(false), 5000);
  };

  const startLeveling = () => {
    setIsLeveling(true);
    setTimeout(() => setIsLeveling(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-emerald-500" />
          <h2 className="text-3xl font-bold text-white tracking-tight">System Calibration</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={startLeveling}
            disabled={isLeveling}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Activity className={cn("w-4 h-4", isLeveling && "animate-spin")} />
            {isLeveling ? 'Leveling...' : 'Level IMU'}
          </button>
          <button 
            onClick={startEscCalibration}
            disabled={isEscCalibrating}
            className="px-6 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <ShieldAlert className={cn("w-4 h-4", isEscCalibrating && "animate-pulse")} />
            {isEscCalibrating ? 'ESC Mode Active' : 'ESC Calibration'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hardware Selection & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-medium text-white">Compute Module</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {(['ZERO_2_W', 'PI_4', 'PI_5_8GB', 'PI_5_16GB'] as const).map((model) => (
                <button
                  key={model}
                  onClick={() => setPiModel(model)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                    piModel === model 
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                      : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  )}
                >
                  <span className="text-sm font-medium">{model.replace(/_/g, ' ')}</span>
                  {piModel === model && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <LayoutGrid className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">PWM Controller</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4">
              Detected: PCA9685 (16-Channel) via I2C.
            </p>
            <div className="p-4 bg-black/20 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-zinc-500">Address</span>
                <span className="text-zinc-300 font-mono">0x40</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-zinc-500">Frequency</span>
                <span className="text-zinc-300 font-mono">50 Hz</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-wider">
                <span className="text-zinc-500">Resolution</span>
                <span className="text-zinc-300 font-mono">12-bit</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-medium text-white">Sensor Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">IMU (MPU6050)</span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest">Calibrated</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">GPS (NEO-M8N)</span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest">3D Fix</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Compass (HMC5883L)</span>
                <span className="text-amber-500 font-bold uppercase tracking-widest">Needs Calibration</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Camera Alignment</span>
                <span className="text-emerald-500 font-bold uppercase tracking-widest">Nominal</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-white">Battery & Power</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold mb-1">Low Voltage Cutoff</div>
                <div className="flex items-center gap-3">
                  <input type="range" min="9" max="12" step="0.1" defaultValue="10.5" className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none accent-yellow-500" />
                  <span className="text-xs font-mono text-zinc-300">10.5V</span>
                </div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Current Draw</div>
                <div className="text-sm font-mono text-white">1.2A <span className="text-[10px] text-zinc-500">(Idle)</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Calibration Sliders & Channel Mapping */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <Sliders className="w-6 h-6 text-emerald-500" />
              <h2 className="text-2xl font-semibold">Servo & ESC Calibration</h2>
            </div>
            
            <div className="space-y-10">
              {/* Steering */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">Steering Center Offset</label>
                  <span className="text-sm font-mono text-emerald-400">{steeringCenter > 0 ? `+${steeringCenter}` : steeringCenter}°</span>
                </div>
                <input 
                  type="range" min="-20" max="20" value={steeringCenter}
                  onChange={(e) => setSteeringCenter(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">
                  <span>Left Max</span>
                  <span>Center</span>
                  <span>Right Max</span>
                </div>
              </div>

              {/* Throttle */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-300">Maximum Throttle Limit</label>
                  <span className="text-sm font-mono text-emerald-400">{throttleMax}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={throttleMax}
                  onChange={(e) => setThrottleMax(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[10px] text-zinc-500 mt-2 uppercase font-bold tracking-widest">Safety limit for autonomous operations</p>
              </div>

              {/* Channel Mapping */}
              <div className="pt-8 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Channel Mapping</h4>
                  <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest hover:underline">Add Channel</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {mappings.map((m, i) => (
                    <div key={i} className="group relative">
                      <div className={cn(
                        "flex items-center gap-4 p-4 bg-black/20 rounded-2xl border transition-all",
                        editingMapping === i ? "border-emerald-500 ring-1 ring-emerald-500/20" : "border-zinc-800 hover:border-zinc-700"
                      )}>
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-sm font-mono text-zinc-400">
                          {m.channel}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-bold text-white uppercase tracking-widest">{m.function}</div>
                            {m.inverted && <span className="text-[8px] bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded uppercase font-bold">Inverted</span>}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono mt-0.5">Pulse: {m.minPulse} - {m.maxPulse}μs (Center: {m.centerPulse}μs)</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {/* Simulate test signal */}}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-[9px] font-bold text-zinc-400 uppercase tracking-widest rounded border border-zinc-700 transition-all"
                          >
                            Test
                          </button>
                          <button 
                            onClick={() => setEditingMapping(editingMapping === i ? null : i)}
                            className="p-2 text-zinc-500 hover:text-emerald-500 transition-colors"
                          >
                            <ChevronRight className={cn("w-5 h-5 transition-transform", editingMapping === i && "rotate-90")} />
                          </button>
                        </div>
                      </div>

                      {/* Inline Editor */}
                      {editingMapping === i && (
                        <div className="mt-2 p-6 bg-zinc-900 border border-emerald-500/30 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Min Pulse (μs)</label>
                                <input 
                                  type="number" value={m.minPulse}
                                  onChange={(e) => handleMappingUpdate(i, { minPulse: Number(e.target.value) })}
                                  className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-sm font-mono text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Max Pulse (μs)</label>
                                <input 
                                  type="number" value={m.maxPulse}
                                  onChange={(e) => handleMappingUpdate(i, { maxPulse: Number(e.target.value) })}
                                  className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-sm font-mono text-white"
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold mb-1 block">Center Pulse (μs)</label>
                                <input 
                                  type="number" value={m.centerPulse}
                                  onChange={(e) => handleMappingUpdate(i, { centerPulse: Number(e.target.value) })}
                                  className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-sm font-mono text-white"
                                />
                              </div>
                              <div className="flex items-center justify-between pt-4">
                                <label className="text-[10px] text-zinc-500 uppercase font-bold">Invert Signal</label>
                                <button 
                                  onClick={() => handleMappingUpdate(i, { inverted: !m.inverted })}
                                  className={cn(
                                    "w-10 h-5 rounded-full transition-all relative",
                                    m.inverted ? "bg-emerald-500" : "bg-zinc-800"
                                  )}
                                >
                                  <div className={cn(
                                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                                    m.inverted ? "left-6" : "left-1"
                                  )} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]">
                <Save className="w-5 h-5" />
                Save Configuration
              </button>
              <button 
                onClick={() => {
                  setSteeringCenter(0);
                  setSteeringMax(45);
                  setThrottleMax(100);
                  setEditingMapping(null);
                }}
                className="px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-4 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
