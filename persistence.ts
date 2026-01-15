
import { Team, Player, ThemeMode, MatchEvent } from './types';

/**
 * VIRTUAL JSON FILE SYSTEM
 * Architecture:
 * /data
 *   /core
 *     teams.json
 *     players.json
 *   /match
 *     formations.json
 *     bench.json
 *     score.json
 *     events.json
 *   /history
 *     snapshot_prev.json (State before last change)
 *   /settings
 *     theme.json
 */

export interface AppSnapshot {
  teams: Team[];
  homeFormation: string;
  awayFormation: string;
  score: { home: number; away: number };
  events: MatchEvent[];
  timestamp: number;
}

const STORAGE_PREFIX = 'pro_commentator_fs:';

export const VirtualFS = {
  // Simulates writing a JSON file to a specific path
  writeJSON: (path: string, data: any) => {
    const serialized = JSON.stringify({
      path,
      data,
      updatedAt: Date.now(),
      version: "1.0"
    });
    localStorage.setItem(`${STORAGE_PREFIX}${path}`, serialized);
  },

  // Simulates reading a JSON file from a path
  readJSON: <T>(path: string): T | null => {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${path}`);
    if (!item) return null;
    try {
      const parsed = JSON.parse(item);
      return parsed.data as T;
    } catch (e) {
      console.error(`Error reading virtual file: ${path}`, e);
      return null;
    }
  },

  // Helper to check if the "file system" is initialized
  isInitialized: () => {
    return localStorage.getItem(`${STORAGE_PREFIX}/data/core/teams.json`) !== null;
  }
};

export const PersistenceService = {
  // Added helper to persist theme selection
  saveTheme: (theme: ThemeMode) => {
    VirtualFS.writeJSON('/data/settings/theme.json', theme);
  },

  // Added helper to retrieve theme selection
  getTheme: (): ThemeMode => {
    return VirtualFS.readJSON<ThemeMode>('/data/settings/theme.json') || 'dark';
  },

  saveAll: (teams: Team[], hForm: string, aForm: string, score: { home: number, away: number }) => {
    // 1. Core Data
    VirtualFS.writeJSON('/data/core/teams.json', teams.map(t => ({
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      logo: t.logo,
      formation: t.formation, // Ensure formation is saved
      form: t.form || [], // Ensure form is saved
      manager: t.manager,
      notes: t.notes || [],
      commentaryPoints: t.commentaryPoints || [],
      isDeleted: !!t.deleted
    })));

    VirtualFS.writeJSON('/data/core/players.json', teams.flatMap(t => (t.players || []).map(p => ({
      ...p,
      teamId: t.id,
      isDeleted: !!p.deleted
    }))));

    // 2. Match Data
    VirtualFS.writeJSON('/data/match/formations.json', { home: hForm, away: aForm });
    VirtualFS.writeJSON('/data/match/score.json', score);
    
    // Bench is inherently part of player status
    VirtualFS.writeJSON('/data/match/bench.json', teams.map(t => ({
      teamId: t.id,
      benchPlayerIds: (t.players || []).filter(p => p.status === 'Substitute' && !p.deleted).map(p => p.id)
    })));
  },

  loadAll: (): { teams: Team[], homeFormation: string, awayFormation: string, score: { home: number, away: number } } | null => {
    const vTeams = VirtualFS.readJSON<any[]>('/data/core/teams.json');
    const vPlayers = VirtualFS.readJSON<any[]>('/data/core/players.json');
    const vFormations = VirtualFS.readJSON<any>('/data/match/formations.json');
    const vScore = VirtualFS.readJSON<any>('/data/match/score.json');

    if (!vTeams || !vPlayers) return null;

    const teams = vTeams.map(t => ({
      ...t,
      deleted: t.isDeleted,
      players: vPlayers
        .filter(p => p.teamId === t.id)
        .map(p => ({ ...p, deleted: p.isDeleted }))
    })) as Team[];

    return {
      teams,
      homeFormation: vFormations?.home || '4-2-3-1',
      awayFormation: vFormations?.away || '4-2-3-1',
      score: vScore || { home: 0, away: 0 }
    };
  },

  pushHistory: (snapshot: AppSnapshot) => {
    // Single step logic: overwrite previous
    VirtualFS.writeJSON('/data/history/snapshot_prev.json', snapshot);
  },

  undo: (currentTeams: Team[], currentH: string, currentA: string, currentS: { home: number, away: number }): AppSnapshot | null => {
    const prev = VirtualFS.readJSON<AppSnapshot>('/data/history/snapshot_prev.json');
    if (!prev) return null;

    // One-time use: Clear prev immediately to prevent multiple undos
    VirtualFS.writeJSON('/data/history/snapshot_prev.json', null);
    
    return prev;
  }
};
