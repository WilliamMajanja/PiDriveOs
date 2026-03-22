export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SignalThreat {
  id: string;
  type: 'V2V_SPOOF' | 'IMSI_CATCHER' | 'ALPR_UPLINK' | 'GPS_JAMMER' | 'DEAUTH_ATTACK' | 'UNAUTHORIZED_BROADCAST';
  source: string;
  frequency: string;
  power: number;
  level: ThreatLevel;
  timestamp: string;
  description: string;
  isGovernance: boolean;
}

export interface V2VNode {
  id: string;
  distance: number;
  angle: number;
  trustScore: number;
  lastSeen: string;
  isMalicious: boolean;
}
