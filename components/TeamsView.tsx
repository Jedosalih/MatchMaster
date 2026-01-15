
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Team, Player } from '../types';
import SquadSyncModal from './SquadSyncModal';

interface TeamsViewProps {
  teams: Team[];
  onCreateTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: (teamId: string) => void;
  onSyncSquad?: (teamId: string, players: Player[]) => void;
}

const TeamCard: React.FC<{ team: Team, onEdit: () => void, onDelete: () => void }> = ({ team, onEdit, onDelete }) => {
  const [showFullNotes, setShowFullNotes] = useState(false);
  const notesText = (team.notes || []).join('\n');
  const isLongNotes = notesText.split('\n').length > 2 || notesText.length > 80;

  return (
    <div className="glass rounded-3xl p-6 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10 group-hover:bg-blue-600/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-center shadow-inner">
          <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="p-2 bg-white/5 hover:bg-blue-600/20 hover:text-blue-400 rounded-xl transition-all text-slate-500"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm('هل أنت متأكد من حذف هذا الفريق؟')) {
                onDelete();
              }
            }}
            className="p-2 bg-white/5 hover:bg-red-600/20 hover:text-red-400 rounded-xl transition-all text-slate-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <h3 className="text-xl font-black text-white italic tracking-tight">{team.name}</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{team.manager}</p>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-white/5">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-blue-500" />
            <span className="text-sm font-black text-white">{(team.players || []).length}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">لاعب</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">التشكيل:</span>
            <span className="text-xs font-black text-blue-400">{team.formation}</span>
          </div>
        </div>

        {team.notes && team.notes.length > 0 && (
          <div className="relative">
            <p className={`text-xs text-slate-400 leading-relaxed whitespace-pre-wrap transition-all duration-300 ${!showFullNotes ? 'line-clamp-2' : ''}`}>
              {notesText}
            </p>
            {isLongNotes && (
              <button 
                onClick={() => setShowFullNotes(!showFullNotes)}
                className="mt-2 text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:text-blue-300"
              >
                {showFullNotes ? (
                  <>عرض أقل <ChevronUp size={12} /></>
                ) : (
                  <>عرض المزيد <ChevronDown size={12} /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TeamsView: React.FC<TeamsViewProps> = ({ teams, onCreateTeam, onEditTeam, onDeleteTeam, onSyncSquad }) => {
  const [syncTeamId, setSyncTeamId] = useState<string | null>(null);

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">إدارة الفرق</h1>
          <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">قائمة الأندية والمنتخبات المسجلة</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCreateTeam}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} />
            <span>إنشاء فريق جديد</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teams.map((team) => (
          <TeamCard 
            key={team.id} 
            team={team} 
            onEdit={() => onEditTeam(team)} 
            onDelete={() => onDeleteTeam(team.id)} 
          />
        ))}

        {teams.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Users size={32} className="text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-slate-500">لا يوجد فرق مسجلة حالياً</h3>
            <p className="text-slate-600 mt-2">ابدأ بإنشاء فريقك الأول لتظهر هنا</p>
          </div>
        )}
      </div>

      {syncTeamId && onSyncSquad && (
        <SquadSyncModal 
          onClose={() => setSyncTeamId(null)} 
          onApply={(players) => onSyncSquad(syncTeamId, players)} 
        />
      )}
    </div>
  );
};

export default TeamsView;
