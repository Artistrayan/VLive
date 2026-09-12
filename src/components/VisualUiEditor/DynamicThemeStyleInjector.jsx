import React, { useEffect } from 'react';
import { useVisualUiEditor } from '../../context/VisualUiEditorContext';

export default function DynamicThemeStyleInjector() {
  const { uiConfig } = useVisualUiEditor();
  const theme = uiConfig?.theme || {};

  useEffect(() => {
    if (!theme) return;

    const root = document.documentElement;

    if (theme.primaryColor) root.style.setProperty('--vlive-primary', theme.primaryColor);
    if (theme.secondaryColor) root.style.setProperty('--vlive-secondary', theme.secondaryColor);
    if (theme.accentColor) root.style.setProperty('--vlive-accent', theme.accentColor);
    if (theme.backgroundColor) root.style.setProperty('--vlive-bg', theme.backgroundColor);
    if (theme.cardBackgroundColor) root.style.setProperty('--vlive-card-bg', theme.cardBackgroundColor);
    if (theme.textColor) root.style.setProperty('--vlive-text', theme.textColor);
    if (theme.borderRadius !== undefined) root.style.setProperty('--vlive-radius', `${theme.borderRadius}px`);

    const speed = theme.animationSpeed || 1.0;
    root.style.setProperty('--vlive-anim-speed', `${1 / speed}s`);

  }, [theme]);

  const animCSS = !theme.animationsEnabled
    ? `* { animation: none !important; transition: none !important; }`
    : `:root { --anim-speed-factor: ${1 / (theme.animationSpeed || 1.0)}; }`;

  return (
    <style>{`
      ${animCSS}
      :root {
        --vlive-primary: ${theme.primaryColor || '#f59e0b'};
        --vlive-secondary: ${theme.secondaryColor || '#ec4899'};
        --vlive-accent: ${theme.accentColor || '#06b6d4'};
        --vlive-bg: ${theme.backgroundColor || '#020617'};
        --vlive-card-bg: ${theme.cardBackgroundColor || '#0f172a'};
        --vlive-text: ${theme.textColor || '#f8fafc'};
      }
    `}</style>
  );
}
