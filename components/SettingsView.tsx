
import React from 'react';
import { Palette, Monitor, Sun, Moon, Check } from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsViewProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ theme, onThemeChange }) => {
  const ThemeCard = ({ id, label, icon: Icon }: { id: ThemeMode, label: string, icon: any }) => {
    const active = theme === id;
    return (
      <button 
        onClick={() => onThemeChange(id)}
        className={`flex-1 flex flex-col items-center gap-4 p-6 rounded-3xl border-2 transition-all group
        ${active 
          ? 'bg-blue-600/10 border-blue-600 shadow-xl shadow-blue-600/10' 
          : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all
          ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
          <Icon size={28} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black uppercase tracking-widest ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
            {label}
          </span>
          {active && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
        </div>
      </button>
    );
  };

  return (
    <div className="p-8 max-w-[1000px] mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">الإعدادات</h1>
        <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-xs">تخصيص تجربة المستخدم والمظهر</p>
      </div>

      <div className="glass rounded-[40px] p-10 border border-slate-200 dark:border-white/5 space-y-12">
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-6">
            <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600">
              <Palette size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">المظهر (Appearance)</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">اختر نمط الألوان المفضل لديك</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <ThemeCard id="light" label="فاتح (Light)" icon={Sun} />
            <ThemeCard id="dark" label="داكن (Dark)" icon={Moon} />
            <ThemeCard id="system" label="تلقائي (System)" icon={Monitor} />
          </div>
        </section>

        <section className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">معاينة البث المباشر</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">تطبيق الألوان المخصصة في واجهة المعلق</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              مفعل تلقائياً
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 flex items-center justify-between p-8 glass rounded-3xl border border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400">
            <Monitor size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 dark:text-white uppercase">إصدار النظام</p>
            <p className="text-[10px] text-slate-500 font-bold">PRO COMMENTATOR v1.0.4-PREVIEW</p>
          </div>
        </div>
        <button className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
          فحص التحديثات
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
