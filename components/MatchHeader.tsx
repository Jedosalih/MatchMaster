
import React, { useRef } from 'react';
import { MapPin } from 'lucide-react';
import { MatchData } from '../types';

interface Props {
  data: MatchData;
  onOpenGoalModal: (team: 'home' | 'away') => void;
  onOpenRemoveModal: (team: 'home' | 'away') => void;
}

const MatchHeader: React.FC<Props> = ({ data, onOpenGoalModal, onOpenRemoveModal }) => {
  // Use ReturnType<typeof setTimeout> for compatibility with both Node.js and Browser environments
  const clickTimers = useRef<{ [key: string]: ReturnType<typeof setTimeout> | null }>({ home: null, away: null });

  const handleScoreClick = (side: 'home' | 'away') => {
    if (clickTimers.current[side]) {
      // It's a double click
      clearTimeout(clickTimers.current[side]!);
      clickTimers.current[side] = null;
      onOpenRemoveModal(side);
    } else {
      // Potential single click
      clickTimers.current[side] = setTimeout(() => {
        onOpenGoalModal(side);
        clickTimers.current[side] = null;
      }, 250);
    }
  };

  return (
    <header className="h-24 glass border-b border-white/5 px-8 flex items-center justify-between z-[40]">
      {/* Left Section: Venue & Competition Info */}
      <div className="flex items-center space-x-reverse space-x-6">
        <div className="flex items-center gap-2 bg-blue-600/10 px-3 py-1.5 rounded-full border border-blue-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live</span>
        </div>
        <div className="flex flex-col">
          <div className="text-slate-400 text-[10px] font-black tracking-widest uppercase opacity-60">
            {data.competition}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
            <MapPin size={10} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{data.venue}</span>
          </div>
        </div>
      </div>

      {/* Center Section: Score and Teams */}
      <div className="flex items-center">
        <div className="flex items-center space-x-reverse space-x-12">
          <div className="text-right">
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none italic uppercase tracking-tighter">{data.homeTeam.name}</h2>
            <p className="text-[10px] text-blue-500 font-black uppercase mt-1 tracking-widest">المضيف</p>
          </div>
          
          <div className="flex items-center space-x-reverse space-x-3 bg-slate-950/20 dark:bg-black/40 px-4 py-2 rounded-[24px] border border-slate-200 dark:border-white/5 shadow-2xl">
            {/* Home Score */}
            <button 
              onClick={() => handleScoreClick('home')}
              className="w-14 h-14 flex items-center justify-center text-5xl font-black text-slate-900 dark:text-white tabular-nums hover:scale-110 transition-transform active:scale-95"
              title="نقرة: إضافة هدف | نقرتان: إلغاء هدف"
            >
              {data.score.home}
            </button>
            
            <div className="flex flex-col items-center opacity-20">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mb-1.5" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>

            {/* Away Score */}
            <button 
              onClick={() => handleScoreClick('away')}
              className="w-14 h-14 flex items-center justify-center text-5xl font-black text-slate-900 dark:text-white tabular-nums hover:scale-110 transition-transform active:scale-95"
              title="نقرة: إضافة هدف | نقرتان: إلغاء هدف"
            >
              {data.score.away}
            </button>
          </div>

          <div className="text-left">
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none italic uppercase tracking-tighter">{data.awayTeam.name}</h2>
            <p className="text-[10px] text-amber-500 font-black uppercase mt-1 tracking-widest">الضيف</p>
          </div>
        </div>
      </div>

      {/* Right Section: Empty for symmetry */}
      <div className="w-[180px]" />
    </header>
  );
};

export default MatchHeader;
