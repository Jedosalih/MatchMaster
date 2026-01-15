
import React from 'react';
import { X, User, Globe, Calendar, Shirt, Hash } from 'lucide-react';
import { Player } from '../types';

interface Props {
  player: Player | null;
  onClose: () => void;
}

const calculateAge = (birthDate?: string) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const ContextPanel: React.FC<Props> = ({ player, onClose }) => {
  if (!player) return null;

  const age = calculateAge(player.birthDate);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Goalkeeper': return 'حارس مرمى';
      case 'Defense': return 'مدافع';
      case 'Midfield': return 'وسط';
      case 'Attack': return 'مهاجم';
      default: return category;
    }
  };

  const InfoRow = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number | null, color: string }) => (
    <div className="glass p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-white/5 flex items-center gap-3 sm:gap-4 group hover:bg-white/5 transition-all">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/5 ${color} shrink-0`}>
        <Icon size={18} className="sm:size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1 truncate">{label}</p>
        <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight truncate">
          {value || 'غير محدد'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 h-full w-full sm:w-[400px] glass border-r border-slate-200 dark:border-white/10 z-[100] shadow-2xl transition-all duration-500 ease-in-out flex flex-col animate-in slide-in-from-left">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">بيانات اللاعب</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <X size={24} className="text-slate-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 scrollbar-hide">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 border-4 border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-slate-900 overflow-hidden">
              <img 
                src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                alt={player.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[12px] font-black uppercase shadow-xl border-2 border-slate-900">
              {getCategoryLabel(player.category)}
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight flex items-center justify-center uppercase tracking-tighter italic">
              <span>{player.name}</span>
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-blue-500 font-black text-xl tabular-nums">#{player.number}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">{player.subRole}</span>
            </div>
          </div>
        </div>

        {/* Info Grid - Responsive Side-by-Side layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow 
            icon={Globe} 
            label="الجنسية" 
            value={player.nationality || 'غير محدد'} 
            color="text-emerald-500" 
          />
          <InfoRow 
            icon={Calendar} 
            label="العمر" 
            value={age ? `${age} سنة` : 'غير محدد'} 
            color="text-blue-500" 
          />
          <InfoRow 
            icon={Shirt} 
            label="المركز التفصيلي" 
            value={player.subRole} 
            color="text-amber-500" 
          />
          <InfoRow 
            icon={Hash} 
            label="رقم القميص" 
            value={player.number} 
            color="text-slate-500" 
          />
          <div className="sm:col-span-2">
             <InfoRow 
                icon={User} 
                label="الفئة المركزية" 
                value={getCategoryLabel(player.category)} 
                color="text-purple-500" 
              />
          </div>
        </div>

        {/* Additional Detail Box */}
        {player.playerNotes && (
          <div className="glass p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">ملاحظات إضافية</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
              {player.playerNotes}
            </p>
          </div>
        )}
      </div>

      {/* Footer Decoration */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 flex items-center justify-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          معلومات الهوية الموثقة
        </p>
      </div>
    </div>
  );
};

export default ContextPanel;
