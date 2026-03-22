import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldAlert, Cpu, Network } from 'lucide-react';

export function Settings() {
  const [aiModel, setAiModel] = useState('mobilenet');
  const [maxSpeed, setMaxSpeed] = useState(25);
  const [enableLidar, setEnableLidar] = useState(true);
  const [enableGps, setEnableGps] = useState(true);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center gap-3 mb-2">
        <SettingsIcon className="w-6 h-6 text-emerald-500" />
        <h2 className="text-2xl font-semibold">System Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Configuration */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-medium text-white">AI Configuration</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Vision Model</label>
              <select 
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              >
                <option value="mobilenet">MobileNet V3 (Fastest, 30fps)</option>
                <option value="yolov8n">YOLOv8 Nano (Balanced, 20fps)</option>
                <option value="yolov8s">YOLOv8 Small (Accurate, 10fps)</option>
              </select>
              <p className="text-xs text-zinc-500 mt-2">Select the neural network model for object detection. Larger models are more accurate but run slower on the Raspberry Pi.</p>
            </div>
          </div>
        </div>

        {/* Safety Limits */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-medium text-white">Safety Limits</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-zinc-400">Software Speed Limit</label>
                <span className="text-sm font-mono text-emerald-400">{maxSpeed} km/h</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="50" 
                value={maxSpeed}
                onChange={(e) => setMaxSpeed(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <p className="text-xs text-zinc-500 mt-2">The AI will never command the vehicle to exceed this speed, regardless of the situation.</p>
            </div>
          </div>
        </div>

        {/* Hardware Toggles */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Network className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Sensor Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <div>
                <div className="font-medium text-white">LiDAR Mapping</div>
                <div className="text-xs text-zinc-500">Enable 360° obstacle avoidance</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableLidar} onChange={() => setEnableLidar(!enableLidar)} />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <div>
                <div className="font-medium text-white">GPS Navigation</div>
                <div className="text-xs text-zinc-500">Enable waypoint routing</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enableGps} onChange={() => setEnableGps(!enableGps)} />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
