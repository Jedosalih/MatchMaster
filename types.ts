
export type RoleCategory = 'Attack' | 'Midfield' | 'Defense' | 'Goalkeeper';

export type SubRole = 
  | 'GK' 
  | 'LB' | 'LCB' | 'CB' | 'RCB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'LDM' | 'RDM' | 'CM' | 'LCM' | 'RCM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'ST' | 'CF';

export type PlayerStatus = 'Starter' | 'Substitute';

export type TacticalMode = 'Defending' | 'Balanced' | 'Attacking';
export type OverlayType = 'None' | 'Compactness' | 'Heatmap' | 'Influence';
export type ThemeMode = 'dark' | 'light' | 'system';

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  avatar?: string;
  category: RoleCategory;
  subRole: SubRole;
  isCaptain?: boolean;
  yellowCard?: boolean;
  redCard?: boolean;
  assignedRole?: SubRole; // Calculated from formation
  currentPos?: Position; // For manual overrides
  status: PlayerStatus;
  deleted?: boolean; // Soft delete flag
  // Management Fields
  height?: number;
  weight?: number;
  age?: number;
  nationality?: string;
  birthDate?: string; // New field for squad sync
  positionRaw?: string; // Original text from source
  playerNotes?: string;
  stats: {
    goals: number;
    assists: number;
    passes: number;
    heat?: string;
  };
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow' | 'red' | 'sub';
  minute: string;
  player: string;
  playerOut?: string; // For substitutions
  team: 'home' | 'away';
  isOwnGoal?: boolean;
  isCanceled?: boolean;
  cancelReason?: string;
  angle?: string;
  numericAngle?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  formation: string;
  form: string[];
  manager: string;
  notes: string[];
  commentaryPoints?: string[]; // Pre-written commentary points
  players: Player[];
  deleted?: boolean; // Soft delete flag
}

export interface MatchData {
  competition: string;
  homeTeam: Team;
  awayTeam: Team;
  score: { home: number; away: number };
  time: string;
  venue: string;
  events: MatchEvent[];
}

export interface FormationsMap {
  [formationName: string]: {
    [subRole in SubRole]?: Position;
  };
}
