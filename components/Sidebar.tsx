
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon
} from 'lucide-react';
import { ThemeMode } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onNavigate, 
  isCollapsed, 
  setIsCollapsed,
  theme,
  onThemeToggle
}) => {
  const NavItem = ({ icon: Icon, id, label }: { icon: any, id: string, label: string }) => {
    const active = currentView === id || (id === 'teams' && currentView === 'edit-team');
    return (
      <button 
        onClick={() => onNavigate(id)}
        className={`p-3 rounded-xl transition-all duration-300 group relative flex items-center justify-center w-full
        ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        {!isCollapsed && <span className="mr-3 text-sm font-medium flex-1 text-right">{label}</span>}
        {isCollapsed && (
          <div className="absolute right-14 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {label}
          </div>
        )}
      </button>
    );
  };

  return (
    <aside className={`h-screen bg-slate-900 border-l border-slate-800 flex flex-col items-center py-6 transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="mb-10 text-blue-500">
        <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center border border-blue-500/20">
          <Trophy size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex flex-col space-y-4 flex-1 w-full px-3">
        <NavItem icon={LayoutDashboard} id="match" label="الرئيسية" />
        <NavItem icon={Users} id="teams" label="الفرق" />
        <div className="w-10 h-px bg-slate-800 my-2 mx-auto shrink-0" />
      </div>

      <div className="mt-auto flex flex-col space-y-4 w-full px-3">
        {/* Theme Toggle Button */}
        <button 
          onClick={onThemeToggle}
          className="p-3 rounded-xl transition-all duration-300 group relative flex items-center justify-center w-full text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          {!isCollapsed && <span className="mr-3 text-sm font-medium flex-1 text-right">{theme === 'dark' ? 'الوضع المضيء' : 'الوضع المظلم'}</span>}
          {isCollapsed && (
            <div className="absolute right-14 bg-slate-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              تبديل السمة
            </div>
          )}
        </button>
        
        <NavItem icon={Settings} id="settings" label="الإعدادات" />
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 text-slate-400 hover:text-white transition-colors flex items-center justify-center w-full"
        >
          {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
