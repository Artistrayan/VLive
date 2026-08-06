import React from 'react';
import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import { X, Palette, Sparkles, Sun, Moon, Zap, RotateCcw, Check } from 'lucide-react';

const PRESET_THEMES = [
  {
    name: 'V.Live Dark Amber (Default)',
    id: 'default_dark',
    theme: {
      mode: 'custom',
      primaryColor: '#f59e0b',
      secondaryColor: '#ec4899',
      accentColor: '#06b6d4',
      backgroundColor: '#020617',
      cardBackgroundColor: '#0f172a',
      textColor: '#f8fafc',
      mutedTextColor: '#94a3b8',
      borderColor: '#334155',
      buttonStyle: 'gradient',
      cardStyle: 'glassmorphism',
      borderRadius: 16,
      shadowLevel: 'glow',
      animationsEnabled: true,
      animationSpeed: 1.0
    }
  },
  {
    name: 'Cyberpunk Neon',
    id: 'cyberpunk',
    theme: {
      mode: 'custom',
      primaryColor: '#00f0ff',
      secondaryColor: '#ff0055',
      accentColor: '#ffe600',
      backgroundColor: '#05050a',
      cardBackgroundColor: '#0d0d1a',
      textColor: '#ffffff',
      mutedTextColor: '#8892b0',
      borderColor: '#ff0055',
      buttonStyle: 'gradient',
      cardStyle: 'neon',
      borderRadius: 12,
      shadowLevel: 'glow',
      animationsEnabled: true,
      animationSpeed: 1.2
    }
  },
  {
    name: 'Deep Ocean Blue',
    id: 'deep_ocean',
    theme: {
      mode: 'custom',
      primaryColor: '#3b82f6',
      secondaryColor: '#06b6d4',
      accentColor: '#10b981',
      backgroundColor: '#030712',
      cardBackgroundColor: '#111827',
      textColor: '#f9fafb',
      mutedTextColor: '#9ca3af',
      borderColor: '#1f2937',
      buttonStyle: 'solid',
      cardStyle: 'card3d',
      borderRadius: 20,
      shadowLevel: 'lg',
      animationsEnabled: true,
      animationSpeed: 1.0
    }
  },
  {
    name: 'Clean Light Mode',
    id: 'clean_light',
    theme: {
      mode: 'light',
      primaryColor: '#d97706',
      secondaryColor: '#db2777',
      accentColor: '#0891b2',
      backgroundColor: '#f8fafc',
      cardBackgroundColor: '#ffffff',
      textColor: '#0f172a',
      mutedTextColor: '#64748b',
      borderColor: '#e2e8f0',
      buttonStyle: 'gradient',
      cardStyle: 'flat',
      borderRadius: 16,
      shadowLevel: 'sm',
      animationsEnabled: true,
      animationSpeed: 1.0
    }
  }
];

export default function ThemeManagerModal() {
  const {
    isThemeModalOpen,
    setIsThemeModalOpen,
    uiConfig,
    updateTheme,
    resetTheme
  } = useVisualUiEditor();

  if (!isThemeModalOpen) return null;

  const theme = uiConfig.theme;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-ltr">
      <div className="w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl text-right" dir="rtl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 dir-ltr">
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 dir-rtl">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-300">{window.loc('🎨 مدیر تم و رنگ‌بندی نرم‌افزار (Theme Manager)', '🎨 Software theme and color scheme (Theme Manager)')}</h3>
              <p className="text-xs text-slate-400">{window.loc('تنظیمات تم، رنگ‌ها، فونت، استایل کارت‌ها و انیمیشن‌ها', 'Theme settings, colors, fonts, style cards and animations')}</p>
            </div>
          </div>
        </div>

        {/* PRESET THEMES LIST */}
        <div className="space-y-2 text-xs">
          <label className="block text-slate-300 font-bold">{window.loc('✨ تم‌های پیش‌فرض آماده (Presets):', '✨ Ready default themes (Presets):')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_THEMES.map(preset => (
              <button
                key={preset.id}
                onClick={() => updateTheme(preset.theme)}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500 flex flex-col items-center justify-between text-center gap-2 transition hover:scale-[1.02]"
              >
                <span className="font-bold text-slate-200 text-[11px] truncate w-full">{preset.name}</span>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ background: preset.theme.primaryColor }} />
                  <span className="w-3.5 h-3.5 rounded-full" style={{ background: preset.theme.secondaryColor }} />
                  <span className="w-3.5 h-3.5 rounded-full" style={{ background: preset.theme.backgroundColor }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* COLOR PICKERS GRID */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-amber-400 text-xs border-b border-slate-800 pb-1">{window.loc('🎨 پالت رنگ اختصاصی (Custom Palette):', '🎨 Dedicated color palette (Custom Palette):')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Primary Color */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('رنگ اصلی (Primary Color):', 'Primary Color:')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor || '#f59e0b'}
                  onChange={e => updateTheme({ primaryColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[11px] text-amber-300">{theme.primaryColor}</span>
              </div>
            </div>

            {/* Secondary Color */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('رنگ ثانویه (Secondary Color):', 'Secondary Color:')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor || '#ec4899'}
                  onChange={e => updateTheme({ secondaryColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[11px] text-pink-300">{theme.secondaryColor}</span>
              </div>
            </div>

            {/* Accent Color */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('رنگ تأکیدی (Accent Color):', 'Accent Color:')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.accentColor || '#06b6d4'}
                  onChange={e => updateTheme({ accentColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[11px] text-cyan-300">{theme.accentColor}</span>
              </div>
            </div>

            {/* Background Color */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('پس‌زمینه برنامه (Background):', 'Background of the program:')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.backgroundColor || '#020617'}
                  onChange={e => updateTheme({ backgroundColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[11px] text-slate-400">{theme.backgroundColor}</span>
              </div>
            </div>

            {/* Card Background Color */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('پس‌زمینه کارت‌ها (Card Background):', 'Card Background:')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.cardBackgroundColor || '#0f172a'}
                  onChange={e => updateTheme({ cardBackgroundColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[11px] text-slate-400">{theme.cardBackgroundColor}</span>
              </div>
            </div>

            {/* Text Color */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('رنگ متون (Text Color):', 'Text Color:')}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.textColor || '#f8fafc'}
                  onChange={e => updateTheme({ textColor: e.target.value })}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="font-mono text-[11px] text-slate-200">{theme.textColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENT STYLING & SHAPES */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-amber-400 text-xs border-b border-slate-800 pb-1">{window.loc('📐 استایل و انحنای کارت‌ها (Card & Button Style):', '📐 Card & Button Style:')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Button Style */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="block text-slate-300 font-medium">{window.loc('استایل دکمه‌ها (Button Style):', 'Button Style:')}</label>
              <select
                value={theme.buttonStyle || 'gradient'}
                onChange={e => updateTheme({ buttonStyle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 outline-none"
              >
                <option value="solid">{window.loc('ساده (Solid Color)', 'Simple (Solid Color)')}</option>
                <option value="gradient">{window.loc('گرادیان ملایم (Gradient)', 'gentle gradient')}</option>
                <option value="outline">{window.loc('دورخط دار (Outline)', 'outline')}</option>
                <option value="glass">{window.loc('شیشه‌ای (Glassmorphism)', 'glass (Glassmorphism)')}</option>
              </select>
            </div>

            {/* Card Style */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="block text-slate-300 font-medium">{window.loc('استایل کارت‌ها (Card Style):', 'Card Style:')}</label>
              <select
                value={theme.cardStyle || 'glassmorphism'}
                onChange={e => updateTheme({ cardStyle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 outline-none"
              >
                <option value="flat">{window.loc('تخت ساده (Flat 2D)', 'Flat 2D')}</option>
                <option value="card3d">{window.loc('سه‌بعدی با سایه (3D Depth Card)', '3D with shadow (3D Depth Card)')}</option>
                <option value="glassmorphism">{window.loc('شیشه‌ای مات (Glassmorphism)', 'Glassmorphism')}</option>
                <option value="neon">{window.loc('نئونی درخشان (Neon Border)', 'Bright neon (Neon Border)')}</option>
              </select>
            </div>

            {/* Border Radius Slider */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>{window.loc('انحنای گوشه‌ها (Border Radius):', 'The curvature of the corners (Border Radius):')}</span>
                <span className="font-mono text-amber-300">{theme.borderRadius || 16}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={theme.borderRadius || 16}
                onChange={e => updateTheme({ borderRadius: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Shadow Level */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="block text-slate-300 font-medium">{window.loc('شدت سایه (Shadow Level):', 'Shadow Level:')}</label>
              <select
                value={theme.shadowLevel || 'glow'}
                onChange={e => updateTheme({ shadowLevel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 outline-none"
              >
                <option value="none">{window.loc('بدون سایه (None)', 'No shadow (None)')}</option>
                <option value="sm">{window.loc('ملایم (Soft)', 'Soft')}</option>
                <option value="md">{window.loc('متوسط (Medium)', 'Medium')}</option>
                <option value="lg">{window.loc('عمیق (Heavy)', 'heavy')}</option>
                <option value="glow">{window.loc('درخشان نئونی (Neon Glow)', 'Neon Glow')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ANIMATIONS & SPEED */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-amber-400 text-xs border-b border-slate-800 pb-1">{window.loc('⚡ انیمیشن‌ها و سرعت اجرا (Animations):', '⚡ Animations and execution speed (Animations):')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">{window.loc('فعال بودن انیمیشن‌های برنامه:', 'Activation of program animations:')}</span>
              <button
                onClick={() => updateTheme({ animationsEnabled: !theme.animationsEnabled })}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  theme.animationsEnabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {theme.animationsEnabled ? window.loc('⚡ فعال (Enabled)', '⚡ Enabled') : window.loc('🚫 غیرفعال (Disabled)', 'Disabled')}
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>{window.loc('سرعت انیمیشن‌ها (Animation Speed):', 'Animation Speed:')}</span>
                <span className="font-mono text-amber-300">{theme.animationSpeed || 1.0}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={theme.animationSpeed || 1.0}
                onChange={e => updateTheme({ animationSpeed: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 dir-ltr">
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{window.loc('تأیید و بستن (Done)', 'Confirm and close (Done)')}</span>
          </button>
          <button
            onClick={resetTheme}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{window.loc('بازنشانی تم به حالت پیش‌فرض', 'Reset theme to default')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
