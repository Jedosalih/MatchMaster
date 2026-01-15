
import React from 'react';
import { Shield, Layout, Target, Zap, Activity, Eye } from 'lucide-react';
import { TacticalMode, OverlayType } from '../types';

interface Props {
  mode: TacticalMode;
  onModeChange: (mode: TacticalMode) => void;
  overlay: OverlayType;
  onOverlayChange: (overlay: OverlayType) => void;
}

const TacticalControls: React.FC<Props> = ({ mode, onModeChange, overlay, onOverlayChange }) => {
  return (
    <div className="flex items-center justify-between w-full bg-slate-900/50 backdrop-blur-xl border border-white/5 p-2 rounded-2xl">
      {/* Game States */}
      <div className="flex items-center bg-black/40 p-1 rounded-xl">
        {[
          { id: 'Defending', icon: Shield, label: 'دفاعي', color: 'text-blue-400' },
          { id: 'Balanced', icon: Layout, label: 'متوازن', color: 'text-emerald-400' },
          { id: 'Attacking', icon: Zap, label: 'هجومي', color: 'text-red-400' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id as TacticalMode)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300
              ${mode === m.id ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <m.icon size={14} className={mode === m.id ? m.color : ''} />
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Analysis Overlays */}
      <div className="flex items-center gap-2">
        {[
          { id: 'None', icon: Eye, label: 'رؤية عادية' },
          { id: 'Compactness', icon: Activity, label: 'الكتلة' },
          { id: 'Influence', icon: Target, label: 'مناطق التأثير' },
        ].map((o) => (
          <button
            key={o.id}
            onClick={() => onOverlayChange(o.id as OverlayType)}
            className={`p-2 rounded-lg transition-all group relative
              ${overlay === o.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
          >
            <o.icon size={16} />
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
              {o.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TacticalControls;
