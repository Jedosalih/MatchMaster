
import React from 'react';
import { Activity, Repeat, Ban, ShieldAlert } from 'lucide-react';
import { MatchData, MatchEvent } from '../types';

interface Props {
  data: MatchData;
}

const MatchInsights: React.FC<Props> = ({ data }) => {
  const events = data.events || [];

  const EventIcon = ({ type, isCanceled }: { type: string, isCanceled?: boolean }) => {
    if (isCanceled) return <Ban size={14} className="text-slate-400" />;
    switch (type) {
      case 'goal': return <span className="text-base">⚽</span>;
      case 'yellow': return <div className="w-3 h-4 bg-yellow-400 rounded-sm shadow-sm" />;
      case 'red': return <div className="w-3 h-4 bg-red-600 rounded-sm shadow-sm" />;
      case 'sub': return <Repeat size={14} className="text-emerald-500" />;
      default: return <Activity size={14} className="text-slate-400" />;
    }
  };

  const renderEvent = (event: MatchEvent, align: 'right' | 'left') => {
    const isCanceled = !!event.isCanceled;
    const isRight = align === 'right';
    
    return (
      <div key={event.id} className={`flex items-center gap-4 py-3 group transition-all ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-1 min-w-0 ${isRight ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 mb-0.5 ${isRight ? 'justify-start' : 'justify-end'}`}>
             <span className="text-[10px] font-black text-blue-500 tabular-nums opacity-60">{event.minute}'</span>
             <p className={`text-sm font-black italic tracking-tight uppercase leading-none transition-colors
              ${isCanceled ? 'text-slate-500 line-through opacity-50' : 'text-slate-900 dark:text-white'}`}>
              {event.player}
              {event.isOwnGoal && <span className="mr-2 text-[9px] font-bold text-red-500">(هدف عكسي)</span>}
            </p>
          </div>
          <p className={`text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest flex items-center gap-2 ${isRight ? 'justify-start' : 'justify-end'}`}>
            {isCanceled ? (
              <span className="flex items-center gap-1 text-red-400/80"><ShieldAlert size={10} /> ملغى: {event.cancelReason || 'بقرار تحكيمي'}</span>
            ) : event.type === 'sub' ? (
                <span className="flex items-center gap-1">🔄 {event.player} بدلاً من {event.playerOut}</span>
            ) : event.type === 'yellow' ? (
                <span>🟨 حصل على بطاقة صفراء</span>
            ) : event.type === 'red' ? (
                <span>🟥 حصل على بطاقة حمراء</span>
            ) : (
                <span>سجل هدفاً</span>
            )}
            {!isCanceled && event.angle && (
              <span className="opacity-40 tracking-tighter">
                • {event.angle} {event.numericAngle && event.numericAngle > 0 ? `(${event.numericAngle}°)` : ''}
              </span>
            )}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500
          ${isCanceled ? 'bg-slate-100/50 dark:bg-white/5 border-slate-200 dark:border-white/5 grayscale' : 'bg-white dark:bg-white/5 border-white/10 shadow-lg group-hover:scale-110'}`}>
          <EventIcon type={event.type} isCanceled={isCanceled} />
        </div>
      </div>
    );
  };

  return (
    <div className="glass rounded-[40px] p-10 border border-slate-200 dark:border-white/5 shadow-3xl overflow-hidden relative">
      <div className="flex flex-col items-center mb-12 relative">
        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-500/20">
          <Activity size={28} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">أحداث المباراة</h3>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">Match Events • Timeline</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative min-h-[400px]">
        {/* Right Column: Home Team Events */}
        <div className="space-y-2">
            <div className="flex items-center gap-3 justify-end mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
                <div className="text-right">
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none">{data.homeTeam.name}</p>
                    <p className="text-[9px] text-blue-500 font-bold uppercase mt-1">أحداث المضيف</p>
                </div>
                <img src={data.homeTeam.logo} className="w-8 h-8 object-contain opacity-40" />
            </div>
            <div className="space-y-1">
                {events.filter(e => e.team === 'home').sort((a,b) => parseInt(b.minute) - parseInt(a.minute)).map(e => renderEvent(e, 'right'))}
                {events.filter(e => e.team === 'home').length === 0 && (
                    <div className="py-20 text-center opacity-20">
                        <p className="text-[10px] font-black uppercase">لا توجد أحداث مسجلة</p>
                    </div>
                )}
            </div>
        </div>

        {/* Left Column: Away Team Events */}
        <div className="space-y-2">
            <div className="flex items-center gap-3 justify-start mb-8 border-b border-slate-200 dark:border-white/5 pb-4">
                <img src={data.awayTeam.logo} className="w-8 h-8 object-contain opacity-40" />
                <div className="text-left">
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none">{data.awayTeam.name}</p>
                    <p className="text-[9px] text-amber-500 font-bold uppercase mt-1">أحداث الضيف</p>
                </div>
            </div>
            <div className="space-y-1">
                {events.filter(e => e.team === 'away').sort((a,b) => parseInt(b.minute) - parseInt(a.minute)).map(e => renderEvent(e, 'left'))}
                {events.filter(e => e.team === 'away').length === 0 && (
                    <div className="py-20 text-center opacity-20">
                        <p className="text-[10px] font-black uppercase">لا توجد أحداث مسجلة</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MatchInsights;
