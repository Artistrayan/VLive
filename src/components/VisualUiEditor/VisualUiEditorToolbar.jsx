import React from 'react';
import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import { 
  Sparkles, Palette, Undo, Redo, Save, RotateCcw, Smartphone, Tablet, Monitor, 
  Layers, Check, Eye, X, Sliders, ShieldCheck, Power
} from 'lucide-react';

const SUPPORTED_PAGES_LIST = [
  { id: 'home', label: '🏠 Home Page' },
  { id: 'profile', label: '👤 Profile' },
  { id: 'match', label: '🔥 Swipe Match' },
  { id: 'discover', label: '🔍 Discover' },
  { id: 'messages', label: '💬 Messages' },
  { id: 'live', label: '📹 Live Stream' },
  { id: 'wallet', label: '💰 Wallet' },
  { id: 'vip', label: '👑 VIP Center' },
  { id: 'settings', label: '⚙️ Settings' },
  { id: 'admin', label: '🛡️ Admin Dashboard' }
];

const DEVICE_PREVIEWS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%' },
  { id: 'tablet', label: 'Tablet (768px)', icon: Tablet, width: '768px' },
  { id: 'large_phone', label: 'Large Phone (430px)', icon: Smartphone, width: '430px' },
  { id: 'mobile', label: 'Android Mobile (375px)', icon: Smartphone, width: '375px' },
  { id: 'small_phone', label: 'Small Phone (320px)', icon: Smartphone, width: '320px' }
];

export default function VisualUiEditorToolbar({ activeTab, setActiveTab, setIsAdminPanelOpen }) {
  const {
    isSuperAdmin,
    isEditMode,
    setIsEditMode,
    selectedPage,
    setSelectedPage,
    devicePreview,
    setDevicePreview,
    setIsThemeModalOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    undo,
    redo,
    canUndo,
    canRedo,
    resetPage,
    resetAll,
    publishChanges
  } = useVisualUiEditor();

  if (!isSuperAdmin || !isEditMode) return null;

  const handlePageSelect = (pageId) => {
    setSelectedPage(pageId);
    if (pageId === 'admin') {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminPanelOpen(false);
      setActiveTab(pageId);
    }
  };

  return (
    <header className="sticky top-0 z-[60] bg-slate-950/95 border-b border-amber-500/40 p-2 sm:px-4 shadow-[0_4px_30px_rgba(245,158,11,0.25)] backdrop-blur-2xl text-xs w-full dir-ltr overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-0.5">
        
        {/* LEFT: SUPER ADMIN BADGE & EDIT MODE TOGGLE */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 border border-amber-500/50 px-2.5 py-1.5 rounded-2xl text-amber-300 font-black shadow-inner whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span className="text-xs">V.LIVE Visual Builder</span>
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md text-[9px] uppercase font-black">Super Admin</span>
          </div>

          <button
            onClick={() => {
              const next = !isEditMode;
              setIsEditMode(next);
              if (next) setIsInspectorOpen(true);
            }}
            className={`px-3 py-1.5 rounded-2xl font-black flex items-center gap-1.5 transition shadow-lg shrink-0 whitespace-nowrap ${
              isEditMode
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Visual Edit: ON' : 'Enable Visual Edit'}</span>
          </button>
        </div>

        {/* MIDDLE: PAGE SELECTOR, DEVICE PREVIEWS & INSPECTOR TOGGLE */}
        {isEditMode && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Page Dropdown */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-2 py-1 shadow-inner">
              <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">Page:</span>
              <select
                value={selectedPage}
                onChange={e => handlePageSelect(e.target.value)}
                className="bg-transparent text-amber-300 font-black outline-none text-xs cursor-pointer px-1 py-0.5"
              >
                {SUPPORTED_PAGES_LIST.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white font-bold">
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Frame Switcher */}
            <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 gap-1">
              {DEVICE_PREVIEWS.map(d => {
                const IconComp = d.icon;
                const isActive = devicePreview === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDevicePreview(d.id)}
                    title={d.label}
                    className={`p-1.5 rounded-xl transition ${
                      isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Inspector Toggle */}
            <button
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              className={`px-2.5 py-1.5 rounded-2xl border transition flex items-center gap-1 font-bold shrink-0 whitespace-nowrap ${
                isInspectorOpen ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow' : 'bg-slate-900 text-slate-400 border-slate-700/80 hover:text-white'
              }`}
              title="Toggle Inspector Side Panel"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="text-[11px]">Inspector</span>
            </button>
          </div>
        )}

        {/* RIGHT: THEME MANAGER, UNDO, REDO, PUBLISH ACTIONS */}
        {isEditMode && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Manager */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="px-2.5 py-1.5 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 font-black flex items-center gap-1 transition shadow-md whitespace-nowrap"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px]">Theme</span>
            </button>

            {/* Undo / Redo */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl p-0.5">
              <button
                onClick={undo}
                disabled={!canUndo}
                title="Undo"
                className="p-1.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                title="Redo"
                className="p-1.5 rounded-xl text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Save & Publish */}
            <button
              onClick={publishChanges}
              className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center gap-1 whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
