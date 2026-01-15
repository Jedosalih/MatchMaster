
import React, { useState } from 'react';
import { Sparkles, Globe, ShieldCheck, Loader2, X, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { Player, RoleCategory, SubRole } from '../types';

interface Props {
  onClose: () => void;
  onApply: (players: Player[]) => void;
}

const SquadSyncModal: React.FC<Props> = ({ onClose, onApply }) => {
  const [url, setUrl] = useState('https://www.btolat.com/team/squad/15001/al-hilal-saudi');
  const [status, setStatus] = useState<'idle' | 'searching' | 'parsing' | 'success' | 'error'>('idle');
  const [results, setResults] = useState<any[]>([]);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSync = async () => {
    setStatus('searching');
    setErrorMessage('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `
        visit this page: ${url}
        and extract the current squad data for the team.
        Return ONLY a JSON array of players.
        
        Use this structure for each player:
        {
          "name": string,
          "number": number | null,
          "positionRaw": string,
          "subRole": "GK" | "LB" | "CB" | "RB" | "CDM" | "CM" | "CAM" | "LM" | "RM" | "LW" | "RW" | "ST",
          "category": "Goalkeeper" | "Defender" | "Midfielder" | "Forward",
          "nationality": string,
          "birthDate": string
        }

        Mapping Guide:
        - Goalkeeper -> GK
        - Left Back / ظهير أيسر -> LB
        - Center Back / قلب دفاع -> CB
        - Right Back / ظهير أيمن -> RB
        - Defensive Mid / ارتكاز -> CDM
        - Center Mid / وسط -> CM
        - Attacking Mid / صانع ألعاب -> CAM
        - Left Wing / جناح أيسر -> LW
        - Right Wing / جناح أيمن -> RW
        - Striker / Forward / رأس حربة -> ST

        Do not include images. Map to the specific subRole that best fits the Arabic text on the page.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                number: { type: Type.NUMBER },
                positionRaw: { type: Type.STRING },
                subRole: { type: Type.STRING },
                category: { type: Type.STRING },
                nationality: { type: Type.STRING },
                birthDate: { type: Type.STRING }
              }
            }
          }
        },
      });

      const extractedPlayers = JSON.parse(response.text || '[]');
      setResults(extractedPlayers);
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedSources = groundingChunks
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }));
      setSources(extractedSources);

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'فشل الاتصال بمحرك البحث الذكي');
    }
  };

  const mapToInternalPlayer = (p: any): Player => {
    const categoryMap: Record<string, RoleCategory> = {
      'Goalkeeper': 'Goalkeeper',
      'Defender': 'Defense',
      'Midfielder': 'Midfield',
      'Forward': 'Attack'
    };

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: p.name,
      number: p.number || 0,
      category: categoryMap[p.category] || 'Midfield',
      subRole: (p.subRole as SubRole) || 'CM',
      status: 'Substitute', // Force all synced players to bench initially
      nationality: p.nationality,
      birthDate: p.birthDate,
      positionRaw: p.positionRaw,
      stats: { goals: 0, assists: 0, passes: 0 }
    };
  };

  const handleApply = () => {
    onApply(results.map(mapToInternalPlayer));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-6" dir="rtl">
      <div className="glass w-full max-w-2xl rounded-[40px] border border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">مستكشف البيانات الذكي</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">AI-Powered Squad Synchronization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">رابط المصدر (btolat.com)</label>
            <div className="relative group">
              <input 
                type="text" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-[20px] px-6 py-4 text-sm text-white focus:border-blue-500 transition-all"
                placeholder="https://..."
              />
              <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 opacity-50" size={18} />
            </div>
          </div>

          {status === 'idle' && (
            <div className="p-8 border border-dashed border-white/10 rounded-[32px] text-center space-y-4">
              <ShieldCheck className="mx-auto text-slate-700" size={40} />
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                سيقوم النظام بزيارة الرابط واستخراج قائمة اللاعبين، أرقامهم، ومراكزهم بدقة عالية باستخدام تقنيات Grounding.
              </p>
              <button onClick={handleSync} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95">بدء الفحص الذكي</button>
            </div>
          )}

          {(status === 'searching' || status === 'parsing') && (
            <div className="p-20 text-center space-y-6">
              <Loader2 className="mx-auto text-blue-500 animate-spin" size={48} />
              <div className="space-y-2">
                <p className="text-lg font-black text-white italic">جاري استخراج البيانات...</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">Visiting source • Parsing Squad • Validating Schema</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3 text-emerald-500">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-black italic">تم العثور على {results.length} لاعباً</span>
                </div>
                {sources.length > 0 && (
                  <div className="flex gap-2">
                    {sources.map((s, i) => (
                      <a key={i} href={s.uri} target="_blank" className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded hover:bg-blue-500/20 transition-all flex items-center gap-1">
                        <ExternalLink size={10} /> {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {results.map((p, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-3">
                    <span className="text-xs font-black text-blue-500 tabular-nums">#{p.number || '??'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white truncate">{p.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{p.subRole || p.category}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 flex gap-4">
                <button onClick={() => setStatus('idle')} className="flex-1 py-4 font-black text-slate-500">إعادة الفحص</button>
                <button onClick={handleApply} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black shadow-xl">تحديث قاعدة البيانات</button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-8 bg-red-600/5 border border-red-500/20 rounded-3xl text-center space-y-4">
              <AlertTriangle className="mx-auto text-red-500" size={40} />
              <p className="text-sm font-black text-white uppercase italic">حدث خطأ أثناء الفحص</p>
              <p className="text-xs text-slate-500 leading-relaxed">{errorMessage}</p>
              <button onClick={() => setStatus('idle')} className="bg-slate-900 border border-white/10 text-white px-8 py-4 rounded-2xl font-black">حاول مرة أخرى</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SquadSyncModal;
