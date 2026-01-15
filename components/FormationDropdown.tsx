
import React from 'react';
import { FORMATIONS_MAP } from '../constants';

interface Props {
  currentFormation: string;
  onFormationChange: (formation: string) => void;
  teamColor: string;
}

const FormationDropdown: React.FC<Props> = ({ currentFormation, onFormationChange, teamColor }) => {
  const formations = Object.keys(FORMATIONS_MAP);

  return (
    <div className="relative inline-block w-32">
      <select
        value={currentFormation}
        onChange={(e) => onFormationChange(e.target.value)}
        className={`w-full bg-slate-900/80 border border-white/10 rounded-lg py-1 px-3 text-[11px] font-bold uppercase tracking-widest text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 transition-all
          ${teamColor === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-yellow-500'}`}
      >
        {formations.map((f) => (
          <option key={f} value={f} className="bg-slate-900">
            {f}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default FormationDropdown;
