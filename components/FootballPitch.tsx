
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Player, RoleCategory, SubRole, Position } from '../types';
import { FORMATIONS_MAP } from '../constants';

interface Props {
  players: Player[];
  formation: string;
  onPlayerClick: (player: Player) => void;
  onSwap?: (players: Player[]) => void; 
  teamColor: string;
}

const CATEGORY_PRIORITY: Record<RoleCategory, SubRole[]> = {
  'Goalkeeper': ['GK'],
  'Defense': ['CB', 'LCB', 'RCB', 'LB', 'RB', 'LWB', 'RWB'],
  'Midfield': ['CM', 'LCM', 'RCM', 'CDM', 'LDM', 'RDM', 'CAM', 'LM', 'RM'],
  'Attack': ['ST', 'CF', 'LW', 'RW']
};

const getCategoryFromSubRole = (role: SubRole, currentFormation?: string): RoleCategory => {
  if (role === 'GK') return 'Goalkeeper';
  
  if (currentFormation === '3-5-2' && (role === 'LWB' || role === 'RWB')) {
    return 'Midfield';
  }

  if (['LB', 'LCB', 'CB', 'RCB', 'RB', 'LWB', 'RWB'].includes(role)) return 'Defense';
  if (['CDM', 'LDM', 'RDM', 'CM', 'LCM', 'RCM', 'CAM', 'LM', 'RM'].includes(role)) return 'Midfield';
  return 'Attack';
};

const FootballPitch: React.FC<Props> = ({ players = [], formation, onPlayerClick, onSwap, teamColor }) => {
  const pitchRef = useRef<HTMLDivElement>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<Position | null>(null);
  const [isActuallyDragging, setIsActuallyDragging] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, SubRole>>({});
  const [shakingId, setShakingId] = useState<string | null>(null);
  
  const formationConfig = FORMATIONS_MAP[formation] || FORMATIONS_MAP["4-3-3"];

  useEffect(() => {
    const assignedSlots = new Set<SubRole>();
    const availableSlots = Object.keys(formationConfig) as SubRole[];
    const newAssignments: Record<string, SubRole> = {};
    const sortedPlayers = [...players].sort((a, b) => (a.id || '').localeCompare(b.id || ''));

    sortedPlayers.forEach(player => {
      if (availableSlots.includes(player.subRole) && !assignedSlots.has(player.subRole)) {
        newAssignments[player.id] = player.subRole;
        assignedSlots.add(player.subRole);
      }
    });

    sortedPlayers.forEach(player => {
      if (newAssignments[player.id]) return; 

      const priorities = CATEGORY_PRIORITY[player.category];
      for (const role of priorities) {
        if (availableSlots.includes(role) && !assignedSlots.has(role)) {
          newAssignments[player.id] = role;
          assignedSlots.add(role);
          break;
        }
      }
    });

    sortedPlayers.forEach(player => {
      if (newAssignments[player.id]) return;

      for (const role of availableSlots) {
        if (!assignedSlots.has(role)) {
          newAssignments[player.id] = role;
          assignedSlots.add(role);
          break;
        }
      }
    });

    setAssignments(newAssignments);
  }, [players, formation, formationConfig]);

  const mappedPlayers = useMemo(() => {
    return (players || []).map(p => {
      const role = assignments[p.id];
      if (!role) return null;
      const pos = formationConfig[role];
      if (!pos) return null;
      return { ...p, currentTacticalPos: pos, role };
    }).filter((p): p is any => p !== null);
  }, [players, assignments, formationConfig]);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setDraggedId(id);
    setIsActuallyDragging(false);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggedId || !pitchRef.current) return;
      const rect = pitchRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (!isActuallyDragging && (Math.abs(e.movementX) > 4 || Math.abs(e.movementY) > 4)) {
        setIsActuallyDragging(true);
      }

      setDragPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };

    const onMouseUp = () => {
      if (!draggedId) return;

      if (isActuallyDragging && dragPos) {
        const target = mappedPlayers.find(p => {
          if (p.id === draggedId) return false;
          const dist = Math.sqrt(Math.pow(dragPos.x - p.currentTacticalPos.x, 2) + Math.pow(dragPos.y - p.currentTacticalPos.y, 2));
          return dist < 8; 
        });

        if (target && onSwap) {
          const sourcePlayer = players.find(p => p.id === draggedId);
          if (sourcePlayer?.redCard || target.redCard) {
            const forbiddenId = sourcePlayer?.redCard ? draggedId : target.id;
            setShakingId(forbiddenId);
            setTimeout(() => setShakingId(null), 500);
          } else {
            const sourceRole = assignments[draggedId];
            const targetRole = assignments[target.id];
            
            const updatedPlayers = players.map(p => {
              if (p.id === draggedId) return { ...p, subRole: targetRole };
              if (p.id === target.id) return { ...p, subRole: sourceRole };
              return p;
            });
            onSwap(updatedPlayers);
          }
        }
      }

      setDraggedId(null);
      setDragPos(null);
    };

    if (draggedId) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [draggedId, isActuallyDragging, dragPos, mappedPlayers, assignments, players, onSwap]);

  const getPlayerRoleColor = (player: Player, role: SubRole) => {
    // Yellow card override
    if (player.yellowCard) return 'bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]';
    
    const category = getCategoryFromSubRole(role, formation);
    switch (category) {
      case 'Attack': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
      case 'Midfield': return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
      case 'Defense': return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]';
      case 'Goalkeeper': return 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div 
      ref={pitchRef}
      className="relative w-full h-full bg-[#0c2a13] rounded-xl overflow-hidden border-[3px] border-white/10 shadow-inner select-none transition-colors duration-500"
    >
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-55%, -50%) rotate(-2deg); }
          75% { transform: translate(-45%, -50%) rotate(2deg); }
        }
        .shake-player {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="9.15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="0.4" fill="rgba(255,255,255,0.3)" />
        <rect x="21" y="0" width="58" height="16.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <rect x="37" y="0" width="26" height="5.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <path d="M 37.5 16.5 A 9.15 9.15 0 0 0 62.5 16.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <circle cx="50" cy="11" r="0.4" fill="rgba(255,255,255,0.3)" />
        <rect x="21" y="83.5" width="58" height="16.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <rect x="37" y="94.5" width="26" height="5.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <path d="M 37.5 83.5 A 9.15 9.15 0 0 1 62.5 83.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        <circle cx="50" cy="89" r="0.4" fill="rgba(255,255,255,0.3)" />
      </svg>

      {mappedPlayers.map((player: any) => {
        const isDraggingThis = draggedId === player.id;
        const pos = (isDraggingThis && dragPos) ? dragPos : player.currentTacticalPos;
        const roleColorClass = getPlayerRoleColor(player, player.role);
        const isShaking = shakingId === player.id;
        
        return (
          <div
            key={player.id}
            onMouseDown={(e) => handleMouseDown(e, player.id)}
            onClick={() => { if (!isActuallyDragging) onPlayerClick(player); }}
            className={`absolute flex flex-col items-center group cursor-grab active:cursor-grabbing transition-all duration-500 ease-in-out
              ${isDraggingThis ? 'z-50 !transition-none' : 'z-20'} ${isShaking ? 'shake-player' : ''}`}
            style={{ 
              left: `${pos.x}%`, 
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '80px'
            }}
          >
            <div 
              className={`w-14 h-14 rounded-full p-0.5 border-2 border-slate-900 transition-colors duration-500 flex items-center justify-center overflow-hidden relative
              ${roleColorClass}
              ${isDraggingThis ? 'scale-110' : 'group-hover:scale-105'}`}
            >
              <img 
                src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.id}`}
                alt={player.name}
                className="w-full h-full rounded-full object-cover pointer-events-none bg-slate-900"
              />
              {/* Red Card Overlay */}
              {player.redCard && (
                <div className="absolute inset-0 bg-red-600/60 flex items-center justify-center text-white font-black text-2xl z-10">
                  🚫
                </div>
              )}
            </div>

            <div className={`mt-1 px-1.5 py-0.5 rounded shadow-lg pointer-events-none transition-colors duration-300
              ${player.yellowCard ? 'bg-yellow-400 text-slate-900' : 'bg-black/80 text-white border border-white/10'}`}>
              <p className="text-[9px] font-black uppercase tracking-tighter whitespace-nowrap leading-none flex items-center gap-1">
                <span className="opacity-80 tabular-nums">{player.number}</span>
                <span className="truncate max-w-[45px]">{player.name}</span>
                {player.isCaptain && <span className="text-[8px] font-black text-amber-500">(C)</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FootballPitch;
