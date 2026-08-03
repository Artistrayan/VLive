import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_THEME, DEFAULT_PAGE_LAYOUTS, loadUiConfig, saveUiConfigToSupabase } from '../services/uiEditorService';

const VisualUiEditorContext = createContext(null);

export function VisualUiEditorProvider({ children, isSuperAdmin, showToast }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [devicePreview, setDevicePreview] = useState('desktop'); // 'desktop' | 'mobile' | 'small_phone' | 'large_phone' | 'tablet'
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Active UI Config
  const [uiConfig, setUiConfig] = useState({
    theme: { ...DEFAULT_THEME },
    pageLayouts: JSON.parse(JSON.stringify(DEFAULT_PAGE_LAYOUTS)),
    componentStyles: {}
  });

  // Undo / Redo History Stacks
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    loadUiConfig().then(loadedConfig => {
      if (isMounted && loadedConfig) {
        setUiConfig(loadedConfig);
        setHistory([loadedConfig]);
        setHistoryIndex(0);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Push new state to history
  const pushHistory = useCallback((newConfig) => {
    setUiConfig(newConfig);
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newConfig];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo Action
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setUiConfig(history[prevIndex]);
    }
  }, [history, historyIndex]);

  // Redo Action
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setUiConfig(history[nextIndex]);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Update Theme
  const updateTheme = useCallback((newThemePartial) => {
    const updated = {
      ...uiConfig,
      theme: { ...uiConfig.theme, ...newThemePartial }
    };
    pushHistory(updated);
  }, [uiConfig, pushHistory]);

  // Update Specific Section Styles
  const updateSectionStyle = useCallback((pageId, sectionId, newStylesPartial) => {
    const pageObj = uiConfig.pageLayouts[pageId] || { title: pageId, sections: [] };
    const updatedSections = pageObj.sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, ...newStylesPartial };
      }
      return sec;
    });

    const updated = {
      ...uiConfig,
      pageLayouts: {
        ...uiConfig.pageLayouts,
        [pageId]: {
          ...pageObj,
          sections: updatedSections
        }
      }
    };
    pushHistory(updated);
  }, [uiConfig, pushHistory]);

  // Move Section Up or Down
  const moveSection = useCallback((pageId, sectionId, direction) => {
    const pageObj = uiConfig.pageLayouts[pageId];
    if (!pageObj || !pageObj.sections) return;

    const sections = [...pageObj.sections];
    const index = sections.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    // Swap items
    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // Update orders
    const reordered = sections.map((sec, idx) => ({ ...sec, order: idx }));

    const updated = {
      ...uiConfig,
      pageLayouts: {
        ...uiConfig.pageLayouts,
        [pageId]: {
          ...pageObj,
          sections: reordered
        }
      }
    };
    pushHistory(updated);
  }, [uiConfig, pushHistory]);

  // Reorder Sections Array directly
  const setPageSectionsOrder = useCallback((pageId, newSectionsArray) => {
    const pageObj = uiConfig.pageLayouts[pageId] || { title: pageId, sections: [] };
    const reordered = newSectionsArray.map((sec, idx) => ({ ...sec, order: idx }));

    const updated = {
      ...uiConfig,
      pageLayouts: {
        ...uiConfig.pageLayouts,
        [pageId]: {
          ...pageObj,
          sections: reordered
        }
      }
    };
    pushHistory(updated);
  }, [uiConfig, pushHistory]);

  // Toggle Component Visibility
  const toggleSectionVisibility = useCallback((pageId, sectionId) => {
    const pageObj = uiConfig.pageLayouts[pageId];
    if (!pageObj || !pageObj.sections) return;

    const updatedSections = pageObj.sections.map(sec => {
      if (sec.id === sectionId) {
        return { ...sec, visible: !sec.visible };
      }
      return sec;
    });

    const updated = {
      ...uiConfig,
      pageLayouts: {
        ...uiConfig.pageLayouts,
        [pageId]: {
          ...pageObj,
          sections: updatedSections
        }
      }
    };
    pushHistory(updated);
  }, [uiConfig, pushHistory]);

  // Reset Single Page
  const resetPage = useCallback((pageId) => {
    const defaultPageObj = DEFAULT_PAGE_LAYOUTS[pageId];
    if (!defaultPageObj) return;

    const updated = {
      ...uiConfig,
      pageLayouts: {
        ...uiConfig.pageLayouts,
        [pageId]: JSON.parse(JSON.stringify(defaultPageObj))
      }
    };
    pushHistory(updated);
    if (showToast) showToast(`🔄 Reset ${defaultPageObj.title || pageId} layout to default.`);
  }, [uiConfig, pushHistory, showToast]);

  // Reset Theme
  const resetTheme = useCallback(() => {
    const updated = {
      ...uiConfig,
      theme: { ...DEFAULT_THEME }
    };
    pushHistory(updated);
    if (showToast) showToast('🎨 Theme reset to default colors & styles.');
  }, [uiConfig, pushHistory, showToast]);

  // Reset All
  const resetAll = useCallback(() => {
    const defaultConfig = {
      theme: { ...DEFAULT_THEME },
      pageLayouts: JSON.parse(JSON.stringify(DEFAULT_PAGE_LAYOUTS)),
      componentStyles: {}
    };
    pushHistory(defaultConfig);
    if (showToast) showToast('✨ Restored all default application layouts and themes.');
  }, [pushHistory, showToast]);

  // Save & Publish
  const publishChanges = useCallback(async () => {
    if (!isSuperAdmin) {
      if (showToast) showToast('❌ Only Super Admin can publish UI changes.');
      return;
    }
    const result = await saveUiConfigToSupabase(uiConfig);
    if (result.dbSaved) {
      if (showToast) showToast('👑 UI Configuration Published & Synced to Supabase!');
    } else {
      if (showToast) showToast('✨ UI Configuration Saved Locally & Cached!');
    }
  }, [isSuperAdmin, uiConfig, showToast]);

  const value = {
    isSuperAdmin,
    isEditMode,
    setIsEditMode,
    selectedPage,
    setSelectedPage,
    selectedComponentId,
    setSelectedComponentId,
    devicePreview,
    setDevicePreview,
    isThemeModalOpen,
    setIsThemeModalOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    uiConfig,
    updateTheme,
    updateSectionStyle,
    moveSection,
    setPageSectionsOrder,
    toggleSectionVisibility,
    undo,
    redo,
    canUndo,
    canRedo,
    resetPage,
    resetTheme,
    resetAll,
    publishChanges
  };

  return (
    <VisualUiEditorContext.Provider value={value}>
      {children}
    </VisualUiEditorContext.Provider>
  );
}

export const useVisualUiEditor = () => {
  const ctx = useContext(VisualUiEditorContext);
  if (!ctx) {
    return {
      isSuperAdmin: false,
      isEditMode: false,
      setIsEditMode: () => {},
      selectedPage: 'home',
      setSelectedPage: () => {},
      selectedComponentId: null,
      setSelectedComponentId: () => {},
      devicePreview: 'desktop',
      setDevicePreview: () => {},
      isThemeModalOpen: false,
      setIsThemeModalOpen: () => {},
      isInspectorOpen: false,
      setIsInspectorOpen: () => {},
      uiConfig: {
        theme: { ...DEFAULT_THEME },
        pageLayouts: DEFAULT_PAGE_LAYOUTS,
        componentStyles: {}
      },
      updateTheme: () => {},
      updateSectionStyle: () => {},
      moveSection: () => {},
      setPageSectionsOrder: () => {},
      toggleSectionVisibility: () => {},
      undo: () => {},
      redo: () => {},
      canUndo: false,
      canRedo: false,
      resetPage: () => {},
      resetTheme: () => {},
      resetAll: () => {},
      publishChanges: () => {}
    };
  }
  return ctx;
};
