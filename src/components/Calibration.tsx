import React, { useState } from 'react';
import { Settings2, Save, RotateCcw } from 'lucide-react';

export function Calibration() {
  const [steeringCenter, setSteeringCenter] = useState(0);
  const [steeringMax, setSteeringMax] = useState(45);
  const [throttleMax, setThrottleMax] = useState(100);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 className="w-6 h-6 text-emerald-500" />
          <h2 className="text-2xl font-semibold">Hardware Calibration</h2>
        </div>
        <p className="text-zinc-400 mb-8">
          Adjust these values to match your specific hardware setup. Ensure the vehicle is on blocks (wheels off the ground) during calibration.
        </p>

        <div className="space-y-8">
          {/* Steering Center */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300">Steering Center Offset</label>
              <span className="text-sm font-mono text-emerald-400">{steeringCenter}°</span>
            </div>
            <input 
              type="range" 
              min="-20" 
              max="20" 
              value={steeringCenter}
              onChange={(e) => setSteeringCenter(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>-20° (Left)</span>
              <span>0°</span>
              <span>+20° (Right)</span>
            </div>
          </div>

          {/* Steering Max Angle */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300">Maximum Steering Angle</label>
              <span className="text-sm font-mono text-emerald-400">{steeringMax}°</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="60" 
              value={steeringMax}
              onChange={(e) => setSteeringMax(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>10°</span>
              <span>60°</span>
            </div>
          </div>

          {/* Throttle Max */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-zinc-300">Maximum Throttle Limit</label>
              <span className="text-sm font-mono text-emerald-400">{throttleMax}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={throttleMax}
              onChange={(e) => setThrottleMax(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>10% (Safe)</span>
              <span>100% (Full Power)</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
            <Save className="w-5 h-5" />
            Save Calibration
          </button>
          <button 
            onClick={() => {
              setSteeringCenter(0);
              setSteeringMax(45);
              setThrottleMax(100);
            }}
            className="px-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
