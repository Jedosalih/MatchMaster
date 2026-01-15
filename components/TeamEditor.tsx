import React, { useState, useRef } from 'react';
import { Save, ChevronRight, UserPlus, X, Shield, Trash2, Users, Edit2, Upload, ChevronDown, ChevronUp, ZoomIn, ZoomOut, AlertCircle, RefreshCcw } from 'lucide-react';
import { Team, Player, RoleCategory, SubRole, PlayerStatus } from '../types';
import { DEFAULT_PLAYER_AVATAR, DEFAULT_TEAM_LOGO } from '../constants';

interface TeamEditorProps {
  team: Team | null;
  onSave: (team: Team) => void;
  onCancel: () => void;
}

const ROLE_OPTIONS: Record<RoleCategory, { code: SubRole; en: string; ar: string }[]> = {
  'Attack': [
    { code: 'ST', en: 'Striker', ar: 'رأس حربة' },
    { code: 'CF', en: 'Center Forward', ar: 'مهاجم صريح' },
    { code: 'LW', en: 'Left Wing', ar: 'جناح أيسر' },
    { code: 'RW', en: 'Right Wing', ar: 'جناح أيمن' },
  ],
  'Midfield': [
    { code: 'CM', en: 'Central Midfielder', ar: 'وسط' },
    { code: 'CDM', en: 'Defensive Midfielder', ar: 'ارتكاز' },
    { code: 'CAM', en: 'Attacking Midfielder', ar: 'صانع لعب' },
    { code: 'LM', en: 'Left Midfielder', ar: 'وسط أيسر' },
    { code: 'RM', en: 'Right Midfielder', ar: 'وسط أيمن' },
  ],
  'Defense': [
    { code: 'CB', en: 'Center Back', ar: 'قلب دفاع' },
    { code: 'LB', en: 'Left Back', ar: 'ظهير أيسر' },
    { code: 'RB', en: 'Right Back', ar: 'ظهير أيمن' },
    { code: 'LWB', en: 'Left Wing Back', ar: 'ظهير جناح أيسر' },
    { code: 'RWB', en: 'Right Wing Back', ar: 'ظهير جناح أيمن' },
  ],
  'Goalkeeper': [
    { code: 'GK', en: 'Goalkeeper', ar: 'حارس مرمى' },
  ]
};

const ImageUpload: React.FC<{ 
  currentImage: string; 
  onImageCropped: (base64: string) => void; 
  label: string;
  circular?: boolean;
}> = ({ currentImage, onImageCropped, label, circular }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target?.result as string);
        setIsCropping(true);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (canvasRef.current && tempImage) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvasRef.current!.width = 256;
        canvasRef.current!.height = 256;
        const baseScale = Math.min(256 / img.width, 256 / img.height);
        const dw = img.width * baseScale * zoom;
        const dh = img.height * baseScale * zoom;
        const dx = (256 - dw) / 2 + offset.x;
        const dy = (256 - dh) / 2 + offset.y;
        ctx?.clearRect(0, 0, 256, 256);
        ctx!.fillStyle = '#0f172a';
        ctx?.fillRect(0, 0, 256, 256);
        ctx?.drawImage(img, dx, dy, dw, dh);
        onImageCropped(canvasRef.current!.toDataURL('image/png'));
        setIsCropping(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      img.src = tempImage;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - lastPos.x;
      const dy = e.clientY - lastPos.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-blue-500/50 transition-all overflow-hidden flex items-center justify-center bg-white/5
          ${circular ? 'w-24 h-24 rounded-full' : 'w-32 h-32 rounded-3xl'}`}
      >
        {currentImage ? (
          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <Upload size={24} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
        )}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{label}</span>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      {isCropping && (
        <div className="fixed inset-0 z-[400] bg-black/95 flex flex-col items-center justify-center p-6 backdrop-blur-xl" dir="rtl">
          <div className="glass p-8 rounded-[40px] border border-white/10 max-w-xl w-full space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black text-white italic tracking-tighter text-center">تعديل الصورة</h3>
            <div 
              className="aspect-square w-full relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <img 
                src={tempImage!} 
                className="absolute transition-transform pointer-events-none" 
                style={{ 
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                  top: '50%',
                  left: '50%',
                  maxWidth: 'none'
                }} 
                alt="Crop preview" 
              />
              <div className="absolute inset-0 border-4 border-blue-500 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]" style={{ borderRadius: circular ? '50%' : '1.5rem' }} />
            </div>
            <div className="flex items-center gap-6 justify-center">
              <button onClick={() => setZoom(prev => Math.max(0.1, prev - 0.1))} className="p-3 bg-white/5 rounded-xl hover:text-white transition-colors text-slate-400"><ZoomOut size={20} /></button>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"><div className="bg-blue-600 h-full transition-all" style={{ width: `${Math.min(100, zoom * 33)}%` }} /></div>
              <button onClick={() => setZoom(prev => Math.min(5, prev + 0.1))} className="p-3 bg-white/5 rounded-xl hover:text-white transition-colors text-slate-400"><ZoomIn size={20} /></button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setIsCropping(false); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="flex-1 py-4 rounded-2xl font-black text-slate-500">إلغاء</button>
              <button onClick={handleCrop} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-600/20">تأكيد القص</button>
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </div>
  );
};

const TeamEditor: React.FC<TeamEditorProps> = ({ team, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Team>({
    id: team?.id || Math.random().toString(36).substr(2, 9),
    name: team?.name || '',
    shortName: team?.shortName || '',
    logo: team?.logo || DEFAULT_TEAM_LOGO,
    formation: team?.formation || '4-3-3',
    form: team?.form || ['W', 'W', 'W', 'W', 'W'],
    manager: team?.manager || '',
    notes: team?.notes || [],
    commentaryPoints: team?.commentaryPoints || [],
    players: team?.players || []
  });

  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [starterLimitError, setStarterLimitError] = useState<{ visible: boolean, player: Partial<Player> | null }>({ visible: false, player: null });
  const [swapStarterId, setSwapStarterId] = useState<string | null>(null);

  const handleSaveTeam = () => {
    if (!formData.name.trim() || !formData.manager.trim()) {
      alert('يرجى ملء البيانات الإجبارية للفريق (الاسم والمدرب)');
      return;
    }
    onSave(formData);
  };

  const handleAddPlayer = () => {
    setEditingPlayer({
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      number: 0,
      category: 'Midfield',
      subRole: 'CM',
      status: 'Substitute',
      isCaptain: false,
      avatar: DEFAULT_PLAYER_AVATAR,
      stats: { goals: 0, assists: 0, passes: 0 }
    });
    setShowMoreDetails(false);
  };

  const savePlayer = () => {
    if (!editingPlayer?.name) {
      alert('يرجى ملء اسم اللاعب');
      return;
    }
    
    // ATOMIC Starter check: strictly enforce 11
    const starters = formData.players.filter(p => p.status === 'Starter' && !p.deleted);
    const existingPlayer = formData.players.find(p => p.id === editingPlayer.id);
    const willBeStarter = editingPlayer.status === 'Starter';
    const wasStarter = existingPlayer?.status === 'Starter';
    
    if (willBeStarter && !wasStarter && starters.length >= 11) {
      setStarterLimitError({ visible: true, player: editingPlayer });
      return;
    }

    finalizePlayerSave(editingPlayer as Player);
  };

  const finalizePlayerSave = (player: Player) => {
    let updatedPlayers = [...formData.players];
    const index = updatedPlayers.findIndex(p => p.id === player.id);

    // Captain single-assignment guarantee
    if (player.isCaptain) {
      updatedPlayers = updatedPlayers.map(p => ({ ...p, isCaptain: false }));
    }

    if (index >= 0) {
      updatedPlayers[index] = player;
    } else {
      updatedPlayers.push(player);
    }

    setFormData({ ...formData, players: updatedPlayers });
    setEditingPlayer(null);
    setStarterLimitError({ visible: false, player: null });
  };

  const handleSwapAndSave = () => {
    if (!swapStarterId || !starterLimitError.player) return;

    // ATOMIC SWAP: Downgrade old starter AND upgrade new one in same operation
    const updatedPlayers = formData.players.map(p => {
      if (p.id === swapStarterId) return { ...p, status: 'Substitute' as const };
      if (p.id === starterLimitError.player?.id) return { ...starterLimitError.player, status: 'Starter' as const };
      return p;
    }) as Player[];

    // Handle case where new player is completely new to team
    const newPlayerId = starterLimitError.player.id;
    if (!updatedPlayers.find(p => p.id === newPlayerId)) {
        updatedPlayers.push({ ...starterLimitError.player, status: 'Starter' } as Player);
    }

    // Secondary Captain Check
    let finalPlayers = updatedPlayers;
    if (starterLimitError.player.isCaptain) {
        finalPlayers = updatedPlayers.map(p => p.id === newPlayerId ? p : { ...p, isCaptain: false });
    }

    setFormData({ ...formData, players: finalPlayers });
    setEditingPlayer(null);
    setStarterLimitError({ visible: false, player: null });
    setSwapStarterId(null);
  };

  const softDeletePlayer = (id: string) => {
    setFormData({
      ...formData,
      players: formData.players.map(p => p.id === id ? { ...p, deleted: true } : p)
    });
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in slide-in-from-bottom-4 duration-500" dir="rtl">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onCancel} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all"><ChevronRight size={24} /></button>
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">{team ? 'تعديل الفريق' : 'إنشاء فريق جديد'}</h1>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-widest text-[10px]">إدارة الهوية والتشكيلات باحترافية</p>
        </div>
        <div className="mr-auto flex gap-3">
          <button onClick={onCancel} className="px-6 py-3 rounded-2xl font-black text-slate-400">إلغاء</button>
          <button onClick={handleSaveTeam} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 shadow-xl"><Save size={20} /><span>حفظ النادي</span></button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <div className="glass rounded-3xl p-6 border border-white/5 space-y-8">
            <h2 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 pb-4">الإعدادات العامة</h2>
            <ImageUpload currentImage={formData.logo} onImageCropped={(b64) => setFormData({...formData, logo: b64})} label="شعار الفريق" />
            <div className="space-y-4">
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">اسم الفريق *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">اختصار الفريق</label><input type="text" value={formData.shortName} onChange={e => setFormData({...formData, shortName: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">المدير الفني *</label><input type="text" value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-bold text-slate-500 uppercase">ملاحظات تكتيكية</label><textarea value={formData.notes.join('\n')} onChange={e => setFormData({...formData, notes: e.target.value.split('\n')})} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white h-32 focus:border-blue-500" /></div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="glass rounded-3xl p-6 border border-white/5 min-h-[600px]">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
              <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3"><Users size={20} className="text-blue-500" /><span>قائمة اللاعبين ({formData.players.filter(p => !p.deleted).length})</span></h2>
              <button onClick={handleAddPlayer} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all"><UserPlus size={16} /><span>إضافة لاعب</span></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.players.filter(p => !p.deleted).map((p) => (
                <div key={p.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group hover:border-white/20 transition-all">
                  <div className="w-12 h-12 rounded-full p-0.5 border-2 border-white/10 overflow-hidden bg-slate-900"><img src={p.avatar || DEFAULT_PLAYER_AVATAR} alt={p.name} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate italic uppercase tracking-tighter"><span className="text-blue-400 ml-2">{p.number}</span>{p.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{p.subRole} • {p.status === 'Starter' ? 'أساسي' : 'بديل'}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingPlayer(p); setShowMoreDetails(false); }} className="p-2 text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                    <button onClick={() => softDeletePlayer(p.id)} className="p-2 text-slate-500 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingPlayer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300" dir="rtl">
          <div className="glass w-full max-w-2xl rounded-[40px] border border-white/10 shadow-3xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
              <h3 className="text-xl font-black text-white italic tracking-tighter">بيانات اللاعب</h3>
              <button onClick={() => setEditingPlayer(null)} className="p-2 text-slate-500 hover:text-white transition-all"><X size={24} /></button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="flex gap-8 items-start">
                <ImageUpload currentImage={editingPlayer.avatar || DEFAULT_PLAYER_AVATAR} onImageCropped={(b64) => setEditingPlayer({...editingPlayer, avatar: b64})} label="تغيير الصورة" circular />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase">الاسم الكامل *</label><input type="text" value={editingPlayer.name} onChange={e => setEditingPlayer({...editingPlayer, name: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white" /></div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase">رقم القميص *</label>
                    <input 
                      type="text" 
                      value={editingPlayer.number === 0 ? '0' : (editingPlayer.number || '')} 
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const parsed = val === '' ? 0 : parseInt(val, 10);
                        setEditingPlayer({...editingPlayer, number: parsed});
                      }} 
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white tabular-nums" 
                    />
                  </div>
                  <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase">الحالة</label><div className="flex p-1 bg-slate-950 rounded-xl border border-white/5"><button onClick={() => setEditingPlayer({...editingPlayer, status: 'Starter'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${editingPlayer.status === 'Starter' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>أساسي</button><button onClick={() => setEditingPlayer({...editingPlayer, status: 'Substitute'})} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${editingPlayer.status === 'Substitute' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}>بديل</button></div></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase">المركز العام</label><select value={editingPlayer.category} onChange={e => setEditingPlayer({...editingPlayer, category: e.target.value as RoleCategory, subRole: ROLE_OPTIONS[e.target.value as RoleCategory][0].code})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"><option value="Attack">هجوم</option><option value="Midfield">وسط</option><option value="Defense">دفاع</option><option value="Goalkeeper">حراسة مرمى</option></select></div>
                <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase">المركز التفصيلي</label><select value={editingPlayer.subRole} onChange={e => setEditingPlayer({...editingPlayer, subRole: e.target.value as SubRole})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white">{ROLE_OPTIONS[editingPlayer.category || 'Midfield'].map(opt => (<option key={opt.code} value={opt.code}>{opt.code} — {opt.en} | {opt.ar}</option>))}</select></div>
              </div>
              <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5"><button onClick={() => setEditingPlayer({...editingPlayer, isCaptain: !editingPlayer.isCaptain})} className={`flex items-center gap-3 px-6 py-2 rounded-xl text-xs font-black transition-all ${editingPlayer.isCaptain ? 'bg-amber-400 text-slate-950' : 'text-slate-500'}`}><Shield size={16} /><span>{editingPlayer.isCaptain ? 'قائد الفريق' : 'تعيين كقائد'}</span></button></div>
              <div className="border border-white/5 rounded-2xl overflow-hidden">
                <button onClick={() => setShowMoreDetails(!showMoreDetails)} className="w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"><span className="text-[10px] font-black text-slate-400 uppercase">تفاصيل إضافية</span>{showMoreDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
                {showMoreDetails && (
                  <div className="p-6 bg-black/20 grid grid-cols-2 gap-6 animate-in slide-in-from-top-2">
                    <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500">الطول (سم)</label><input type="number" value={editingPlayer.height || ''} onChange={e => setEditingPlayer({...editingPlayer, height: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" /></div>
                    <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500">الوزن (كجم)</label><input type="number" value={editingPlayer.weight || ''} onChange={e => setEditingPlayer({...editingPlayer, weight: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" /></div>
                    <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500">العمر</label><input type="number" value={editingPlayer.age || ''} onChange={e => setEditingPlayer({...editingPlayer, age: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" /></div>
                    <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-500">الجنسية</label><input type="text" value={editingPlayer.nationality || ''} onChange={e => setEditingPlayer({...editingPlayer, nationality: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white" /></div>
                    <div className="col-span-2 space-y-1.5"><label className="text-[9px] font-bold text-slate-500 uppercase">ملاحظات اللاعب</label><textarea value={editingPlayer.playerNotes || ''} onChange={e => setEditingPlayer({...editingPlayer, playerNotes: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white h-20" /></div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 bg-slate-900/80 flex gap-4"><button onClick={() => setEditingPlayer(null)} className="flex-1 py-4 font-black text-slate-500">إلغاء</button><button onClick={savePlayer} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl">تأكيد البيانات</button></div>
          </div>
        </div>
      )}

      {starterLimitError.visible && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass max-w-md w-full p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-white italic tracking-tighter">قائمة الأساسيين مكتملة</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              لديك بالفعل 11 لاعباً أساسياً. لا يمكنك تعيين لاعب أساسي جديد إلا بعد نقل لاعب حالي إلى مقاعد البدلاء.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5 text-right">
                <label className="text-[10px] font-bold text-slate-500 uppercase">اختر لاعباً لنقله للبدلاء:</label>
                <select 
                  value={swapStarterId || ''} 
                  onChange={e => setSwapStarterId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white"
                >
                  <option value="">-- اختر لاعب --</option>
                  {formData.players.filter(p => p.status === 'Starter' && !p.deleted).map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.number})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => finalizePlayerSave({ ...starterLimitError.player, status: 'Substitute' } as Player)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-black text-slate-300 border border-white/5">جعله بديلاً</button>
                <button disabled={!swapStarterId} onClick={handleSwapAndSave} className={`flex-1 py-3 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 ${swapStarterId ? 'bg-blue-600 hover:bg-blue-500 shadow-lg' : 'bg-slate-800 opacity-50 cursor-not-allowed'}`}><RefreshCcw size={14} />تبديل وحفظ</button>
              </div>
            </div>
            <button onClick={() => setStarterLimitError({ visible: false, player: null })} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">إلغاء العملية</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamEditor;