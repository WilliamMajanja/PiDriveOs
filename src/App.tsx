/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Calibration } from './components/Calibration';
import { MapView } from './components/Map';
import { SystemHealth } from './components/SystemHealth';
import { SignalLab } from './components/SignalLab';
import { ThreatIntelligence } from './components/ThreatIntelligence';
import { OBDDiagnostics } from './components/OBDDiagnostics';
import { Countermeasures } from './components/Countermeasures';
import { Settings } from './components/Settings';
import { EmergencyStop } from './components/EmergencyStop';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEmergencyStop, setIsEmergencyStop] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'calibration':
        return <Calibration />;
      case 'map':
        return <MapView />;
      case 'health':
        return <SystemHealth />;
      case 'signals':
        return <SignalLab />;
      case 'intel':
        return <ThreatIntelligence />;
      case 'counter':
        return <Countermeasures />;
      case 'obd':
        return <OBDDiagnostics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">System Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <div className="text-xs text-zinc-400 uppercase tracking-wider">AI Model</div>
                <div className="text-sm font-medium text-zinc-200">MobileNet V3 (Fast)</div>
             </div>
             <div className="h-8 w-px bg-zinc-800 mx-2" />
             <EmergencyStop isEmergencyStop={isEmergencyStop} setIsEmergencyStop={setIsEmergencyStop} />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {/* Emergency Stop Overlay */}
          {isEmergencyStop && (
            <div className="absolute inset-0 z-50 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="bg-red-900 border-2 border-red-500 p-8 rounded-2xl shadow-2xl shadow-red-900/50 max-w-md text-center animate-in fade-in zoom-in duration-200">
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/50">
                  <span className="text-5xl">🛑</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-tight">Emergency Stop</h2>
                <p className="text-red-200 mb-8">All motor power has been cut. The vehicle is immobilized. Inspect the vehicle before resuming operation.</p>
                <button 
                  onClick={() => setIsEmergencyStop(false)}
                  className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold uppercase tracking-wider transition-colors border border-zinc-700 w-full"
                >
                  Clear E-Stop & Resume
                </button>
              </div>
            </div>
          )}
          
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
