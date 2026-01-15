
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MatchHeader from './components/MatchHeader';
import MatchInsights from './components/MatchInsights';
import FootballPitch from './components/FootballPitch';
import ContextPanel from './components/ContextPanel';
import FormationDropdown from './components/FormationDropdown';
import TeamsView from './components/TeamsView';
import TeamEditor from './components/TeamEditor';
import MatchPlayerEditor from './components/MatchPlayerEditor';
import SettingsView from './components/SettingsView';
import { MOCK_MATCH } from './constants';
import { Player, Team, MatchData, ThemeMode, MatchEvent } from './types';
import { RotateCcw, X, Edit3, Target, Ban, ShieldAlert, Check, Hash, HelpCircle } from 'lucide-react';
import { PersistenceService, VirtualFS } from './persistence';

const TeamMatchView: React.FC<{ 
  team: Team, 
  formation: string, 
  onFormationChange: (f: string) => void, 
  onPlayerClick: (p: Player) => void,
  onPlayersUpdate: (p: Player[]) => void,
  onEditPlayers: () => void,
  teamColor: 'blue' | 'yellow'
}> = ({ team, formation, onFormationChange, onPlayerClick, onPlayersUpdate, onEditPlayers, teamColor }) => {
  const captain = (team.players || []).find(p => p.isCaptain && !p.deleted);
  const starters = (team.players || []).filter(p => p.status === 'Starter' && !p.deleted);
  const colorClass = teamColor === 'blue' ? 'text-blue-400' : 'text-amber-400';
  const borderClass = teamColor === 'blue' ? 'border-blue-500/20' : 'border-amber-500/20';

  return (
    <div className="glass rounded-3xl p-5 md:p-6 border border-white/5 flex flex-col shadow-2xl h-full space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/5 rounded-xl p-2 border border-white/10 flex items-center justify-center">
            <img src={team.logo} className="w-full h-full object-contain" alt={team.shortName} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none italic">{team.name}</h3>
            <p className={`text-[10px] font-bold uppercase mt-1 tracking-widest opacity-80 ${colorClass}`}>
              فريق {teamColor === 'blue' ? 'المضيف' : 'الضيف'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onEditPlayers}
            className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-600 dark:text-white uppercase transition-all"
          >
            <Edit3 size={14} />
            <span>تعديل اللاعبين</span>
          </button>
          <FormationDropdown 
            currentFormation={formation} 
            onFormationChange={onFormationChange} 
            teamColor={teamColor} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full h-[400px] sm:h-[480px] lg:h-[540px] relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-950/20 shadow-inner">
          <FootballPitch 
            players={starters} 
            formation={formation}
            onPlayerClick={onPlayerClick}
            onSwap={onPlayersUpdate}
            teamColor={teamColor}
          />
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4">
          <div className={`sm:w-1/3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border ${borderClass} flex flex-col gap-3 shadow-lg h-full`}>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">المدير الفني</span>
              <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{team.manager}</span>
            </div>
            <div className="w-full h-px bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">قائد الفريق</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-sm font-black text-slate-900 dark:text-white leading-none">{captain?.name || 'غير محدد'}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 glass p-4 rounded-xl border border-slate-200 dark:border-white/5 flex flex-col shadow-lg">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-200 dark:border-white/5">ملاحظات تكتيكية</h4>
            <div className="space-y-1.5 whitespace-pre-wrap max-h-24 overflow-y-auto custom-scrollbar">
              {(team.notes || []).map((note, i) => (
                <div key={i} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('match');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [theme, setTheme] = useState<ThemeMode>(() => PersistenceService.getTheme());

  const [teams, setTeams] = useState<Team[]>(() => {
    const loaded = PersistenceService.loadAll();
    if (loaded) return loaded.teams;
    return [
      { ...MOCK_MATCH.homeTeam, id: 'hilal-1' },
      { ...MOCK_MATCH.awayTeam, id: 'nassr-1' }
    ];
  });

  const [events, setEvents] = useState<MatchEvent[]>(() => {
    const stored = VirtualFS.readJSON<MatchEvent[]>('/data/match/events.json');
    return (stored || MOCK_MATCH.events) as MatchEvent[];
  });

  const [homeFormation, setHomeFormation] = useState(() => {
    const loaded = PersistenceService.loadAll();
    return loaded ? loaded.homeFormation : '4-2-3-1';
  });
  
  const [awayFormation, setAwayFormation] = useState(() => {
    const loaded = PersistenceService.loadAll();
    return loaded ? loaded.awayFormation : '4-2-3-1';
  });

  const [score, setScore] = useState(() => {
    const loaded = PersistenceService.loadAll();
    return loaded ? loaded.score : MOCK_MATCH.score;
  });

  // Modal States
  const [goalModalTeam, setGoalModalTeam] = useState<'home' | 'away' | null>(null);
  const [removeModalTeam, setRemoveModalTeam] = useState<'home' | 'away' | null>(null);
  const [goalScorerId, setGoalScorerId] = useState<string>('');
  const [isOwnGoal, setIsOwnGoal] = useState(false);
  const [goalAngle, setGoalAngle] = useState<string>('');
  const [numericAngle, setNumericAngle] = useState<string>('');
  const [showPrecisePrompt, setShowPrecisePrompt] = useState(false);
  const [usePreciseAngle, setUsePreciseAngle] = useState(false);
  const [removalReason, setRemovalReason] = useState<string>('');
  const [otherReasonText, setOtherReasonText] = useState<string>('');

  useEffect(() => {
    PersistenceService.saveAll(teams, homeFormation, awayFormation, score);
    VirtualFS.writeJSON('/data/match/events.json', events);
  }, [teams, homeFormation, awayFormation, score, events]);

  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [matchEditorTeamId, setMatchEditorTeamId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const recordAction = (newTeams: Team[], actionName: string, h = homeFormation, a = awayFormation, s = score, newEvents = events) => {
    // Capture EVERYTHING in the current state before applying updates
    PersistenceService.pushHistory({ teams, homeFormation, awayFormation, score, events, timestamp: Date.now() });
    
    setTeams(newTeams);
    setHomeFormation(h);
    setAwayFormation(a);
    setScore(s);
    setEvents(newEvents);
    
    setToast({ message: actionName, visible: true });
    setTimeout(() => setToast(p => ({ ...p, visible: false })), 5000);
  };

  const handleUndo = () => {
    const prev = PersistenceService.undo(teams, homeFormation, awayFormation, score);
    if (prev) {
      setTeams(prev.teams);
      setHomeFormation(prev.homeFormation);
      setAwayFormation(prev.awayFormation);
      setScore(prev.score);
      setEvents(prev.events); // Fully restore the Match Timeline to its state before the last action
      
      setToast({ message: 'تم التراجع عن الإجراء الأخير', visible: true });
      setTimeout(() => setToast(p => ({ ...p, visible: false })), 3000);
    }
  };

  const handleSyncSquad = (teamId: string, newPlayers: Player[]) => {
    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        // MERGE: Keep existing players (especially starters) and append new substitutes
        // Filter out any new players that already exist by name or number to avoid obvious duplicates
        const existingPlayers = t.players || [];
        const uniqueNewPlayers = newPlayers.filter(np => 
          !existingPlayers.some(ep => !ep.deleted && (ep.name === np.name || ep.number === np.number))
        );
        
        // Mark all unique new players specifically as Substitutes
        const newBenchPlayers = uniqueNewPlayers.map(p => ({ ...p, status: 'Substitute' as const }));
        
        return { 
          ...t, 
          players: [...existingPlayers, ...newBenchPlayers] 
        };
      }
      return t;
    });
    recordAction(updatedTeams, "تم تحديث قائمة البدلاء بنجاح");
  };

  const handleAddGoal = () => {
    if (!goalModalTeam || !goalScorerId) return;
    const teamToFind = isOwnGoal ? (goalModalTeam === 'home' ? 'away' : 'home') : goalModalTeam;
    const scorerTeam = teamToFind === 'home' ? teams[0] : teams[1];
    const scorer = scorerTeam.players.find(p => p.id === goalScorerId);
    
    const newEvent: MatchEvent = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'goal',
        minute: MOCK_MATCH.time.split(':')[0],
        player: scorer?.name || 'غير معروف',
        team: goalModalTeam,
        isOwnGoal,
        angle: goalAngle,
        numericAngle: (usePreciseAngle && numericAngle) ? parseInt(numericAngle) : undefined
    };

    const newScore = { ...score, [goalModalTeam]: score[goalModalTeam] + 1 };
    recordAction(teams, "تم تسجيل هدف", homeFormation, awayFormation, newScore, [newEvent, ...events]);
    
    setGoalModalTeam(null);
    setGoalScorerId('');
    setIsOwnGoal(false);
    setGoalAngle('');
    setNumericAngle('');
    setShowPrecisePrompt(false);
    setUsePreciseAngle(false);
  };

  const handleRemoveGoal = () => {
    if (!removeModalTeam || !removalReason) return;
    if (score[removeModalTeam] <= 0) return;

    const lastGoalIndex = events.findIndex(e => e.team === removeModalTeam && e.type === 'goal' && !e.isCanceled);
    
    if (lastGoalIndex === -1) {
        setRemoveModalTeam(null);
        return;
    }

    const updatedEvents = [...events];
    updatedEvents[lastGoalIndex] = {
        ...updatedEvents[lastGoalIndex],
        isCanceled: true,
        cancelReason: removalReason === 'أخرى' ? otherReasonText : removalReason
    };

    const newScore = { ...score, [removeModalTeam]: score[removeModalTeam] - 1 };
    recordAction(teams, "تم إلغاء الهدف وتحديث السجل", homeFormation, awayFormation, newScore, updatedEvents);
    
    setRemoveModalTeam(null);
    setRemovalReason('');
    setOtherReasonText('');
  };

  const handlePlayersUpdate = (teamId: string, updatedStarters: Player[]) => {
    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        // Fix bench disappearance bug: 
        // updatedStarters contains only players currently on the pitch.
        // We must keep all other players (substitutes and soft-deleted players).
        const otherPlayers = t.players.filter(p => p.status !== 'Starter' || p.deleted);
        return { ...t, players: [...updatedStarters, ...otherPlayers] };
      }
      return t;
    });
    recordAction(updatedTeams, "تم تحديث التشكيلة");
  };

  const handleUpdatePlayer = (teamId: string, player: Player) => {
    const originalTeam = teams.find(t => t.id === teamId);
    const originalPlayer = originalTeam?.players.find(p => p.id === player.id);

    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        let updatedPlayers = t.players.map(p => {
          if (p.id === player.id) return player;
          if (player.isCaptain && p.isCaptain) return { ...p, isCaptain: false };
          return p;
        });
        return { ...t, players: updatedPlayers };
      }
      return t;
    });

    let newEvents = [...events];
    if (player.yellowCard && !originalPlayer?.yellowCard) {
        newEvents = [{
            id: Math.random().toString(36).substr(2, 9),
            type: 'yellow',
            minute: MOCK_MATCH.time.split(':')[0],
            player: player.name,
            team: teamId === teams[0].id ? 'home' : 'away'
        }, ...newEvents];
    }
    if (player.redCard && !originalPlayer?.redCard) {
        newEvents = [{
            id: Math.random().toString(36).substr(2, 9),
            type: 'red',
            minute: MOCK_MATCH.time.split(':')[0],
            player: player.name,
            team: teamId === teams[0].id ? 'home' : 'away'
        }, ...newEvents];
    }

    recordAction(updatedTeams, "تم تحديث بيانات اللاعب", homeFormation, awayFormation, score, newEvents);
  };

  const handleMatchSwap = (teamId: string, starterId: string, benchId: string) => {
    let newEvents = [...events];
    const updatedTeams = teams.map(t => {
      if (t.id === teamId) {
        const starterPlayer = t.players.find(p => p.id === starterId);
        const benchPlayer = t.players.find(p => p.id === benchId);
        if (!starterPlayer || !benchPlayer) return t;

        const updatedPlayers = t.players.map(p => {
          if (p.id === starterId) return { ...p, status: 'Substitute' as const };
          if (p.id === benchId) return { ...p, status: 'Starter' as const, subRole: starterPlayer.subRole };
          return p;
        });

        const subEvent: MatchEvent = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'sub',
            minute: MOCK_MATCH.time.split(':')[0],
            player: benchPlayer.name,
            playerOut: starterPlayer.name,
            team: t.id === teams[0].id ? 'home' : 'away'
        };
        newEvents = [subEvent, ...events];

        return { ...t, players: updatedPlayers };
      }
      return t;
    });

    recordAction(updatedTeams, "تم إجراء التبديل", homeFormation, awayFormation, score, newEvents);
  };

  const getMatchData = (): MatchData => {
    const activeTeams = teams.filter(t => !t.deleted);
    const homeTeam = activeTeams[0] || MOCK_MATCH.homeTeam;
    const awayTeam = activeTeams[1] || MOCK_MATCH.awayTeam;
    return { ...MOCK_MATCH, homeTeam, awayTeam, score, events };
  };

  const matchData = getMatchData();
  const currentScorerList = goalModalTeam 
    ? (isOwnGoal 
        ? (goalModalTeam === 'home' ? matchData.awayTeam.players : matchData.homeTeam.players) 
        : (goalModalTeam === 'home' ? matchData.homeTeam.players : matchData.awayTeam.players))
    : [];

  const lastValidGoalToCancel = removeModalTeam 
    ? events.find(e => e.team === removeModalTeam && e.type === 'goal' && !e.isCanceled)
    : null;

  const getNumericPlaceholder = () => {
    if (goalAngle === 'زاوية عليا') return 'نطاق (60-90)';
    if (goalAngle === 'منتصف') return 'نطاق (30-60)';
    if (goalAngle === 'زاوية سفلى') return 'نطاق (0-30)';
    return 'درجة الزاوية';
  };

  const handleAngleSelect = (a: string) => {
    setGoalAngle(a);
    setShowPrecisePrompt(true);
  };

  return (
    <div className="flex h-screen bg-background text-slate-900 dark:text-slate-100 overflow-hidden font-['Tajawal'] transition-colors duration-300" dir="rtl">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        theme={theme}
        onThemeToggle={() => setTheme(p => p === 'dark' ? 'light' : 'dark')}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background/50">
        <MatchHeader 
            data={matchData} 
            onOpenGoalModal={setGoalModalTeam} 
            onOpenRemoveModal={setRemoveModalTeam} 
        />
        
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {currentView === 'match' && (
            <div className="p-4 lg:p-8 space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-[1920px] mx-auto w-full">
                <TeamMatchView 
                  team={matchData.homeTeam} 
                  formation={homeFormation}
                  onFormationChange={(f) => recordAction(teams, "تغيير التشكيل", f, awayFormation)}
                  onPlayerClick={setSelectedPlayer}
                  onPlayersUpdate={(p) => handlePlayersUpdate(matchData.homeTeam.id, p)}
                  onEditPlayers={() => setMatchEditorTeamId(matchData.homeTeam.id)}
                  teamColor="blue"
                />
                <TeamMatchView 
                  team={matchData.awayTeam} 
                  formation={awayFormation}
                  onFormationChange={(f) => recordAction(teams, "تغيير التشكيل", homeFormation, f)}
                  onPlayerClick={setSelectedPlayer}
                  onPlayersUpdate={(p) => handlePlayersUpdate(matchData.awayTeam.id, p)}
                  onEditPlayers={() => setMatchEditorTeamId(matchData.awayTeam.id)}
                  teamColor="yellow"
                />
              </div>
              
              <div className="max-w-[1920px] mx-auto w-full pb-20">
                 <MatchInsights data={matchData} />
              </div>
            </div>
          )}

          {currentView === 'teams' && (
            <TeamsView 
              teams={teams.filter(t => !t.deleted)} 
              onCreateTeam={() => { setEditingTeam(null); setCurrentView('edit-team'); }} 
              onEditTeam={t => { setEditingTeam(t); setCurrentView('edit-team'); }} 
              onDeleteTeam={tId => recordAction(teams.map(t => t.id === tId ? {...t, deleted: true} : t), "تم الحذف")} 
              onSyncSquad={handleSyncSquad}
            />
          )}
          {currentView === 'edit-team' && <TeamEditor team={editingTeam} onSave={t => {
            const updated = [...teams];
            const idx = updated.findIndex(u => u.id === t.id);
            if (idx >= 0) updated[idx] = t; else updated.push(t);
            recordAction(updated, "تم الحفظ");
            setCurrentView('teams');
          }} onCancel={() => setCurrentView('teams')} />}
          
          {currentView === 'settings' && <SettingsView theme={theme} onThemeChange={setTheme} />}
        </div>
      </main>

      <ContextPanel player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />

      {matchEditorTeamId && (
        <MatchPlayerEditor 
          team={teams.find(t => t.id === matchEditorTeamId)!} 
          formation={matchEditorTeamId === matchData.homeTeam.id ? homeFormation : awayFormation}
          onClose={() => setMatchEditorTeamId(null)}
          onSwap={(s, b) => handleMatchSwap(matchEditorTeamId, s, b)}
          onUpdatePlayer={(p) => handleUpdatePlayer(matchEditorTeamId, p)}
        />
      )}

      {/* Goal Addition Modal */}
      {goalModalTeam && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="glass w-full max-w-lg rounded-[40px] border border-white/10 p-8 space-y-8 shadow-3xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><Target size={24} /></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">تسجيل هدف جديد</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">صالح فريق {goalModalTeam === 'home' ? matchData.homeTeam.name : matchData.awayTeam.name}</p>
                        </div>
                    </div>
                    <button onClick={() => setGoalModalTeam(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">اختر مسجل الهدف</label>
                            <button onClick={() => { setIsOwnGoal(!isOwnGoal); setGoalScorerId(''); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${isOwnGoal ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                                <ShieldAlert size={12} /> {isOwnGoal ? 'هدف عكسي (مفعل)' : 'هدف عكسي؟'}
                            </button>
                        </div>
                        <select value={goalScorerId} onChange={e => setGoalScorerId(e.target.value)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-blue-500 transition-all appearance-none">
                            <option value="">-- اختر اللاعب --</option>
                            {currentScorerList.filter(p => !p.deleted && p.status === 'Starter').map(p => (
                                <option key={p.id} value={p.id}>{p.number}. {p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">مستوى الهدف</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['زاوية عليا', 'منتصف', 'زاوية سفلى'].map(a => (
                                    <button key={a} onClick={() => handleAngleSelect(a)} className={`py-3 rounded-xl text-[10px] font-black transition-all border ${goalAngle === a ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>{a}</button>
                                ))}
                            </div>
                        </div>

                        {showPrecisePrompt && !usePreciseAngle && (
                          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between animate-in zoom-in-95">
                             <div className="flex items-center gap-3 text-slate-400">
                                <HelpCircle size={16} />
                                <span className="text-[11px] font-bold">هل ترغب في إضافة زاوية دقيقة؟</span>
                             </div>
                             <button onClick={() => setUsePreciseAngle(true)} className="text-blue-400 text-[10px] font-black uppercase hover:underline">نعم، أريد ذلك</button>
                          </div>
                        )}

                        {usePreciseAngle && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">زاوية دقيقة (اختياري)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={numericAngle}
                                        placeholder={getNumericPlaceholder()}
                                        onChange={e => setNumericAngle(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-blue-500 transition-all pl-12" 
                                    />
                                    <Hash size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button onClick={() => setGoalModalTeam(null)} className="flex-1 py-4 font-black text-slate-500 hover:text-white transition-colors">إلغاء</button>
                    <button disabled={!goalScorerId} onClick={handleAddGoal} className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white py-4 rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 transition-all"><Check size={20} /><span>تأكيد الهدف</span></button>
                </div>
            </div>
        </div>
      )}

      {/* Goal Removal Modal */}
      {removeModalTeam && (
        <div className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="glass w-full max-w-lg rounded-[40px] border border-white/10 p-8 space-y-8 shadow-3xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 border border-red-500/20"><Ban size={24} /></div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">إلغاء هدف مسجل</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">سيتم إلغاء هدف {lastValidGoalToCancel?.player} ({lastValidGoalToCancel?.minute}')</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">سبب الإلغاء</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['تسلل', 'خطأ سابق', 'لمسة يد', 'قرار VAR', 'أخرى'].map(r => (
                                <button key={r} onClick={() => setRemovalReason(r)} className={`flex items-center justify-center py-4 rounded-2xl text-[11px] font-black transition-all border ${removalReason === r ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}>{r}</button>
                            ))}
                        </div>
                    </div>

                    {removalReason === 'أخرى' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">أدخل السبب (اختياري)</label>
                            <input 
                                type="text"
                                value={otherReasonText}
                                onChange={e => setOtherReasonText(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-red-500 transition-all"
                                placeholder="أدخل سبباً قصيراً..."
                            />
                        </div>
                    )}
                </div>

                <div className="pt-4 flex gap-4">
                    <button onClick={() => setRemoveModalTeam(null)} className="flex-1 py-4 font-black text-slate-500 hover:text-white transition-colors">تراجع</button>
                    <button disabled={!removalReason} onClick={handleRemoveGoal} className="flex-1 bg-slate-900 border border-white/10 hover:border-red-500 disabled:opacity-30 text-white py-4 rounded-[24px] font-black shadow-xl flex items-center justify-center gap-3 transition-all">إلغاء الهدف نهائياً</button>
                </div>
            </div>
        </div>
      )}

      {toast.visible && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-8">
          <p className="text-sm font-black text-slate-900 dark:text-white italic">{toast.message}</p>
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
          <button onClick={handleUndo} className="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 hover:opacity-70 transition-opacity">
            <RotateCcw size={14} />
            <span>تراجع (Undo)</span>
          </button>
          <button onClick={() => setToast(p => ({ ...p, visible: false }))} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
