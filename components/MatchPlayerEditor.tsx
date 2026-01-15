
import React, { useState } from 'react';
import { X, Users, MoveHorizontal, Shield, Square, Ban, Sparkles } from 'lucide-react';
import { Team, Player } from '../types';
import FootballPitch from './FootballPitch';
import { DEFAULT_PLAYER_AVATAR } from '../constants';

interface MatchPlayerEditorProps {
  team: Team;
  formation: string;
  onClose: () => void;
  onSwap: (starterId: string, benchId: string) => void;
  onUpdatePlayer?: (player: Player) => void;
}

const MatchPlayerEditor: React.FC<MatchPlayerEditorProps> = ({ team, formation, onClose, onSwap, onUpdatePlayer }) => {
  const starters = team.players.filter(p => p.status === 'Starter' && !p.deleted);
  const bench = team.players.filter(p => p.status === 'Substitute' && !p.deleted);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);

  const selectedPlayer = team.players.find(p => p.id === selectedPlayerId);

  // All bench players remain visible, but we identify suggestions
  const isSuggested = (benchPlayer: Player) => {
    return selectedPlayer?.status === 'Starter' && benchPlayer.category === selectedPlayer.category;
  };

  const handlePlayerSelect = (p: Player) => {
    setSelectedPlayerId(p.id);
  };

  const handleAction = (benchId: string) => {
    if (selectedPlayerId) {
      const source = team.players.find(p => p.id === selectedPlayerId);
      const target = team.players.find(p => p.id === benchId);

      if (source?.status === 'Starter' && target?.status === 'Substitute') {
        if (source.redCard) {
          setShakingId(selectedPlayerId);
          setTimeout(() => setShakingId(null), 500);
          return;
        }
        onSwap(selectedPlayerId, benchId);
        setSelectedPlayerId(null);
      }
    }
  };

  const toggleStatus = (key: 'isCaptain' | 'yellowCard' | 'redCard') => {
    if (!selectedPlayer || !onUpdatePlayer) return;
    onUpdatePlayer({
      ...selectedPlayer,
      [key]: !selectedPlayer[key]
    });
  };

  const getPositionGroupColor = (category: string) => {
    switch (category) {
      case 'Midfield': return 'bg-emerald-500/20 border-emerald-500/50';
      case 'Defense': return 'bg-blue-500/20 border-blue-500/50';
      case 'Attack': return 'bg-red-500/20 border-red-500/50';
      case 'Goalkeeper': return 'bg-yellow-400/20 border-yellow-400/50';
      default: return 'bg-white/5 border-white/5';
    }
  };

  const getHighlightStyle = (category: string) => {
    if (category === 'Goalkeeper') return 'shadow-[0_0_15px_rgba(255,255,255,0.4)] ring-1 ring-white/50 animate-pulse';
    return 'shadow-[0_0_15px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/50 animate-pulse';
  };

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300" dir="rtl">
      <style>{`
        @keyframes shake-mini {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .shake-active { animation: shake-mini 0.2s ease-in-out infinite; }
      `}</style>

      <div className="glass w-full max-w-[1400px] h-[90vh] rounded-[40px] border border-white/10 shadow-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-xl p-2 border border-white/10 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">محرر التشكيلة والبطاقات</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">إدارة اللاعبين والبطاقات والقائد</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Right Sidebar: Bench */}
          <div className="w-80 border-l border-white/5 p-6 flex flex-col bg-slate-900/50">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">مقاعد الاحتياط</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {bench.map((player) => {
                const suggested = isSuggested(player);
                return (
                  <button
                    key={player.id}
                    onClick={() => selectedPlayer?.status === 'Starter' ? handleAction(player.id) : handlePlayerSelect(player)}
                    className={`w-full group flex items-center gap-3 p-3 rounded-2xl border transition-all text-right relative
                      ${selectedPlayerId === player.id 
                        ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-600/20' 
                        : `${getPositionGroupColor(player.category)} hover:bg-white/10`}
                      ${suggested ? getHighlightStyle(player.category) : ''}`}
                  >
                    <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden shrink-0">
                      <img src={player.avatar || DEFAULT_PLAYER_AVATAR} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-black ${selectedPlayerId === player.id ? 'text-white' : 'text-slate-200'} truncate italic`}>
                        {player.number}. {player.name}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">
                        {player.category} - {player.subRole}
                      </p>
                    </div>
                    {suggested && (
                      <Sparkles size={12} className="text-blue-400 absolute top-2 left-2 animate-bounce" />
                    )}
                    {selectedPlayer?.status === 'Starter' && !selectedPlayer.redCard && (
                      <MoveHorizontal size={14} className="text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Pitch */}
          <div className="flex-1 p-8 bg-black/20 flex flex-col">
            <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
              <FootballPitch 
                players={starters} 
                formation={formation} 
                onPlayerClick={handlePlayerSelect}
                teamColor="blue"
              />
              {selectedPlayerId && starters.some(p => p.id === selectedPlayerId) && (
                 <div className="absolute inset-0 bg-blue-600/5 pointer-events-none border-4 border-blue-500/30 rounded-3xl" />
              )}
            </div>
          </div>

          {/* Left Sidebar: Controls */}
          <div className="w-80 border-r border-white/5 p-6 flex flex-col bg-slate-950">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">تحكم اللاعب</h3>
            
            {selectedPlayer ? (
              <div className="space-y-8 animate-in slide-in-from-left-4">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`w-24 h-24 rounded-full p-1 border-2 border-white/10 bg-slate-900 overflow-hidden ${shakingId === selectedPlayerId ? 'shake-active' : ''}`}>
                    <img src={selectedPlayer.avatar || DEFAULT_PLAYER_AVATAR} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white italic">{selectedPlayer.name}</h4>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{selectedPlayer.subRole} • {selectedPlayer.status === 'Starter' ? 'أساسي' : 'بديل'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => toggleStatus('isCaptain')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                    ${selectedPlayer.isCaptain ? 'bg-amber-400 border-amber-500 text-slate-950' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield size={18} />
                      <span className="text-xs font-black uppercase">قائد الفريق</span>
                    </div>
                    {selectedPlayer.isCaptain && <span className="font-black text-sm">(C)</span>}
                  </button>

                  <button 
                    onClick={() => toggleStatus('yellowCard')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                    ${selectedPlayer.yellowCard ? 'bg-yellow-400 border-yellow-500 text-slate-950' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Square size={18} fill={selectedPlayer.yellowCard ? "currentColor" : "none"} />
                      <span className="text-xs font-black uppercase">بطاقة صفراء</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => toggleStatus('redCard')}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                    ${selectedPlayer.redCard ? 'bg-red-600 border-red-700 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Ban size={18} />
                      <span className="text-xs font-black uppercase">بطاقة حمراء</span>
                    </div>
                  </button>
                </div>

                {selectedPlayer.redCard && selectedPlayer.status === 'Starter' && (
                  <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-2xl">
                    <p className="text-[10px] text-red-400 font-bold leading-relaxed text-center italic">
                      تم طرد اللاعب. لا يمكن استبداله بلاعب آخر من مقاعد البدلاء.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <Users size={48} className="mb-4 text-slate-600" />
                <p className="text-xs font-black uppercase text-slate-500">اختر لاعباً للمعاينة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPlayerEditor;
