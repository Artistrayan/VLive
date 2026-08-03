import React from 'react';
import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import { ArrowUp, ArrowDown, Eye, EyeOff, Edit3, Move, Layers } from 'lucide-react';

export default function VisualSectionWrapper({ pageId, sectionId, defaultLabel, children, className = '', style = {} }) {
  const {
    isEditMode,
    selectedComponentId,
    setSelectedComponentId,
    uiConfig,
    moveSection,
    toggleSectionVisibility,
    setIsInspectorOpen
  } = useVisualUiEditor();

  const pageConfig = uiConfig?.pageLayouts?.[pageId];
  const sectionConfig = pageConfig?.sections?.find(s => s.id === sectionId);

  // If section is not configured in layout defaults, render children as normal
  if (!sectionConfig) {
    return <div className={className} style={style}>{children}</div>;
  }

  const { visible = true, padding, margin, borderRadius, bg, shadow } = sectionConfig;
  const isSelected = selectedComponentId === sectionId;

  // In production (not edit mode), hide completely if visible is false
  if (!visible && !isEditMode) {
    return null;
  }

  // Dynamic style calculation
  const dynamicStyle = {
    ...style,
    ...(padding !== undefined ? { padding: `${padding}px` } : {}),
    ...(margin !== undefined ? { margin: `${margin}px 0` } : {}),
    ...(borderRadius !== undefined ? { borderRadius: `${borderRadius}px` } : {}),
    ...(bg ? { background: bg } : {})
  };

  const shadowClass = shadow === 'glow'
    ? 'shadow-[0_0_30px_rgba(245,158,11,0.25)] border border-amber-500/30'
    : shadow === 'lg'
    ? 'shadow-2xl'
    : shadow === 'md'
    ? 'shadow-lg'
    : shadow === 'sm'
    ? 'shadow-md'
    : '';

  if (!isEditMode) {
    return (
      <div className={`${className} ${shadowClass} transition-all duration-300`} style={dynamicStyle}>
        {children}
      </div>
    );
  }

  // EDIT MODE ACTIVE: Render outline, badge & controls
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponentId(sectionId);
        setIsInspectorOpen(true);
      }}
      className={`relative group my-2 transition-all duration-200 cursor-pointer rounded-2xl ${
        !visible ? 'opacity-40 grayscale' : ''
      } ${
        isSelected
          ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 border-2 border-amber-400 bg-amber-500/5'
          : 'border-2 border-dashed border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/5'
      } ${className} ${shadowClass}`}
      style={dynamicStyle}
    >
      {/* FLOATING SECTION CONTROL BADGE */}
      <div className="absolute -top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900 border border-amber-500/80 rounded-xl px-2.5 py-1 text-[11px] font-bold text-amber-300 shadow-lg pointer-events-auto">
        <Move className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate max-w-[150px]">{sectionConfig.label || defaultLabel || sectionId}</span>
        
        <div className="flex items-center gap-1 ml-1 border-r border-slate-700 pr-1">
          <button
            title="Move Up"
            onClick={(e) => {
              e.stopPropagation();
              moveSection(pageId, sectionId, 'up');
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            title="Move Down"
            onClick={(e) => {
              e.stopPropagation();
              moveSection(pageId, sectionId, 'down');
            }}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-amber-400"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
          <button
            title={visible ? "Hide Section" : "Show Section"}
            onClick={(e) => {
              e.stopPropagation();
              toggleSectionVisibility(pageId, sectionId);
            }}
            className={`p-1 rounded hover:bg-slate-800 ${visible ? 'text-emerald-400' : 'text-rose-400'}`}
          >
            {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
          <button
            title="Edit Style in Inspector"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedComponentId(sectionId);
              setIsInspectorOpen(true);
            }}
            className="p-1 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!visible && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-20 pointer-events-none">
          <span className="bg-rose-950/90 text-rose-300 border border-rose-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xl">
            <EyeOff className="w-3.5 h-3.5" />
            Hidden Section (Edit Mode Only)
          </span>
        </div>
      )}

      {children}
    </div>
  );
}
