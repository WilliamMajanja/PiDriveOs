export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SignalThreat {
  id: string;
  type: 'V2V_SPOOF' | 'IMSI_CATCHER' | 'ALPR_UPLINK' | 'GPS_JAMMER' | 'DEAUTH_ATTACK' | 'UNAUTHORIZED_BROADCAST' | 'CELL_TOWER_SIM' | 'DSRC_INTERFERENCE';
  source: string;
  frequency: string;
  power: number;
  level: ThreatLevel;
  timestamp: string;
  description: string;
  isGovernance: boolean;
  countermeasureActive?: boolean;
}

export interface V2VNode {
  id: string;
  distance: number;
  angle: number;
  trustScore: number;
  lastSeen: string;
  isMalicious: boolean;
  protocol?: 'DSRC' | 'C-V2X' | 'ITS-G5';
}

export type PiModel = 'ZERO_2_W' | 'PI_4' | 'PI_5_8GB' | 'PI_5_16GB';

export interface ServoMapping {
  channel: number;
  function: 'STEERING' | 'THROTTLE' | 'BRAKE' | 'AUX_1' | 'AUX_2';
  minPulse: number;
  maxPulse: number;
  centerPulse: number;
  inverted: boolean;
}

export interface OBDData {
  rpm: number;
  speed: number;
  coolantTemp: number;
  load: number;
  throttlePos: number;
  voltage: number;
  dtcCount: number;
  vin: string;
  protocol: string;
}

export interface SignalProtocol {
  name: string;
  frequency: string;
  bandwidth: string;
  modulation: string;
  encoding: string;
}
