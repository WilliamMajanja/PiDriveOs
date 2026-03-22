import React from 'react';
import { MapPin, Navigation2, Compass } from 'lucide-react';

export function MapView() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative shadow-xl">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-[#1e1e24] flex items-center justify-center overflow-hidden">
          {/* Grid pattern for map */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3 }} />
          
          {/* Simulated Route */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
            <path 
              d="M 100,500 C 200,400 300,500 400,300 C 500,100 600,200 700,100" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="opacity-50"
            />
            <path 
              d="M 100,500 C 200,400 300,500 400,300" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>

          {/* Current Position Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
              <Navigation2 className="w-8 h-8 text-emerald-500 fill-emerald-500 rotate-45 relative z-10" />
            </div>
          </div>
        </div>

        {/* Map UI Overlay */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-xl p-4 shadow-lg">
            <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Current Location</div>
            <div className="font-mono text-lg text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              37.7749° N, 122.4194° W
            </div>
          </div>
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-xl p-4 shadow-lg">
            <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Heading</div>
            <div className="font-mono text-lg text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500" />
              045° NE
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6">
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 rounded-xl p-4 shadow-lg flex items-center gap-4">
            <div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">GPS Status</div>
              <div className="font-medium text-emerald-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                3D Fix (12 Sats)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
