import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmergencyStopProps {
  isEmergencyStop: boolean;
  setIsEmergencyStop: (val: boolean) => void;
}

export function EmergencyStop({ isEmergencyStop, setIsEmergencyStop }: EmergencyStopProps) {
  return (
    <button
      onClick={() => setIsEmergencyStop(true)}
      disabled={isEmergencyStop}
      className={cn(
        "flex items-center gap-2 px-6 py-2 rounded-lg font-bold uppercase tracking-wider transition-all duration-200",
        isEmergencyStop 
          ? "bg-red-900 text-red-500 cursor-not-allowed opacity-50" 
          : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40 active:scale-95"
      )}
    >
      <AlertTriangle className="w-5 h-5" />
      E-Stop
    </button>
  );
}
