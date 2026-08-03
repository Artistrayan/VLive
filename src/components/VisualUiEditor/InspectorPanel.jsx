import React, { useState } from 'react';
import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import { 
  Sliders, Eye, EyeOff, ArrowUp, ArrowDown, Move, Layers, X, ChevronRight,
  ChevronLeft, Palette, Sparkles, RotateCcw, ShieldCheck, Copy
} from 'lucide-react';

const BG_PRESETS = [
  { name: 'شفاف (Transparent)', value: 'transparent' },
  { name: 'شیشه‌ای تیره (Glass Slate)', value: 'rgba(15, 23, 42, 0.85)' },
  { name: 'گرادیان طلایی (Gold Gradient)', value: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.9))' },
  { name: 'گرادیان صورتی (Pink Gradient)', value: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(15, 23, 42, 0.9))' },
  { name: 'گرادیان سایبر (Cyber Cyan)', value: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(15, 23, 42, 0.9))' }
];

export default function InspectorPanel() {
  const {
    isEditMode,
    selectedPage,
    setSelectedPage,
    selectedComponentId,
    setSelectedComponentId,
    isInspectorOpen,
    setIsInspectorOpen,
    uiConfig,
    updateSectionStyle,
    moveSection,
    toggleSectionVisibility,
    resetPage
  } = useVisualUiEditor();

  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'properties'

  if (!isEditMode) return null;

  const pageConfig = uiConfig?.pageLayouts?.[selectedPage] || { title: selectedPage, sections: [] };
  const sections = pageConfig.sections || [];
  const selectedSection = sections.find(s => s.id === selectedComponentId);

  if (!isInspectorOpen) {
    return (
      <button
        onClick={() => setIsInspectorOpen(true)}
        className="fixed left-3 top-20 z-40 p-3 rounded-2xl bg-slate-900 border border-amber-500/60 text-amber-400 shadow-2xl hover:scale-105 transition flex items-center gap-2 font-bold text-xs"
      >
        <Sliders className="w-4 h-4 animate-pulse" />
        <span>باز کردن پنل تنظیمات UI</span>
      </button>
    );
  }

  return (
    <aside className="fixed left-3 top-16 bottom-16 z-40 w-80 bg-slate-900/95 border border-amber-500/40 rounded-3xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-fadeIn dir-ltr">
      {/* PANEL TOP HEADER */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60" dir="rtl">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-xs font-black text-amber-300">پنل تنظیمات و ویرایشگر UI</h3>
            <p className="text-[10px] text-slate-400">صفحه فعال: <span className="text-cyan-400 font-bold">{pageConfig.title || selectedPage}</span></p>
          </div>
        </div>
        <button
          onClick={() => setIsInspectorOpen(false)}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* PANEL TAB SWITCHER */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-bold" dir="rtl">
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 ${
            activeTab === 'sections'
              ? 'border-b-2 border-amber-400 text-amber-300 bg-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>بخش‌ها ({sections.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 ${
            activeTab === 'properties'
              ? 'border-b-2 border-amber-400 text-amber-300 bg-slate-900'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>استایل بخش</span>
        </button>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs" dir="rtl">
        {activeTab === 'sections' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>ترتیب و نمایش بخش‌های صفحه</span>
              <button
                onClick={() => resetPage(selectedPage)}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>بازنشانی</span>
              </button>
            </div>

            <div className="space-y-2">
              {sections.map((sec, idx) => {
                const isSecSelected = selectedComponentId === sec.id;
                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setSelectedComponentId(sec.id);
                      setActiveTab('properties');
                    }}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                      isSecSelected
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : sec.visible
                        ? 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                        : 'bg-slate-950/50 border-slate-900 text-slate-500 line-through'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-xs truncate">{sec.label || sec.id}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={() => moveSection(selectedPage, sec.id, 'up')}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Move Down"
                        disabled={idx === sections.length - 1}
                        onClick={() => moveSection(selectedPage, sec.id, 'down')}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title={sec.visible ? 'Hide' : 'Show'}
                        onClick={() => toggleSectionVisibility(selectedPage, sec.id)}
                        className={`p-1 rounded hover:bg-slate-800 ${sec.visible ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* PROPERTIES TAB */
          <div className="space-y-4">
            {selectedSection ? (
              <>
                <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
                  <span className="text-[10px] text-amber-400 font-bold block">بخش انتخاب‌شده:</span>
                  <h4 className="font-black text-white text-xs">{selectedSection.label}</h4>
                  <span className="font-mono text-[10px] text-slate-500 block">{selectedSection.id}</span>
                </div>

                {/* VISIBILITY TOGGLE */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">وضعیت نمایش در صفحه:</span>
                  <button
                    onClick={() => toggleSectionVisibility(selectedPage, selectedSection.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      selectedSection.visible
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {selectedSection.visible ? 'نمایش داده می‌شود' : 'مخفی شده'}
                  </button>
                </div>

                {/* PADDING SLIDER */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>فاصله داخلی (Padding):</span>
                    <span className="font-mono text-amber-300">{selectedSection.padding ?? 16}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="48"
                    step="2"
                    value={selectedSection.padding ?? 16}
                    onChange={e => updateSectionStyle(selectedPage, selectedSection.id, { padding: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* MARGIN SLIDER */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>فاصله بیرونی (Margin):</span>
                    <span className="font-mono text-amber-300">{selectedSection.margin ?? 12}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={selectedSection.margin ?? 12}
                    onChange={e => updateSectionStyle(selectedPage, selectedSection.id, { margin: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* BORDER RADIUS SLIDER */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>انحنای گوشه (Border Radius):</span>
                    <span className="font-mono text-amber-300">{selectedSection.borderRadius ?? 16}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={selectedSection.borderRadius ?? 16}
                    onChange={e => updateSectionStyle(selectedPage, selectedSection.id, { borderRadius: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* SHADOW SELECTOR */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <label className="block text-slate-300 font-medium">سایه و افکت پیرامون (Shadow):</label>
                  <select
                    value={selectedSection.shadow || 'sm'}
                    onChange={e => updateSectionStyle(selectedPage, selectedSection.id, { shadow: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 outline-none"
                  >
                    <option value="none">بدون سایه (None)</option>
                    <option value="sm">ملایم (Soft)</option>
                    <option value="md">متوسط (Medium)</option>
                    <option value="lg">سایه عمیق (Heavy)</option>
                    <option value="glow">درخشش نئونی (Glow)</option>
                  </select>
                </div>

                {/* BACKGROUND PRESET */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="block text-slate-300 font-medium">پس‌زمینه اختصاصی بخش (Background):</label>
                  <div className="space-y-1.5">
                    {BG_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => updateSectionStyle(selectedPage, selectedSection.id, { bg: preset.value })}
                        className={`w-full p-2 rounded-xl border text-right font-medium text-[11px] flex items-center justify-between transition ${
                          selectedSection.bg === preset.value
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                            : 'border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span>{preset.name}</span>
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-600" style={{ background: preset.value }} />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <Sliders className="w-8 h-8 mx-auto opacity-30 text-amber-400" />
                <p>لطفاً یک بخش را از تب "بخش‌ها" یا با کلیک روی صفحه انتخاب کنید.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
