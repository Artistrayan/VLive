import { supabase } from '../supabaseClient';
import { safeStorage } from '../utils/safeStorage';

export const DEFAULT_THEME = {
  mode: 'custom', // 'dark' | 'light' | 'custom'
  primaryColor: '#f59e0b', // Amber 500
  secondaryColor: '#ec4899', // Pink 500
  accentColor: '#06b6d4', // Cyan 500
  backgroundColor: '#020617', // Slate 950
  cardBackgroundColor: '#0f172a', // Slate 900
  textColor: '#f8fafc', // Slate 50
  mutedTextColor: '#94a3b8', // Slate 400
  borderColor: '#334155', // Slate 700
  buttonStyle: 'gradient', // 'solid' | 'gradient' | 'outline' | 'glass'
  cardStyle: 'glassmorphism', // 'flat' | 'card3d' | 'glassmorphism' | 'neon'
  fontFamily: 'sans-serif', // 'sans-serif' | 'serif' | 'monospace'
  fontSizeBase: 14, // in px
  borderRadius: 16, // in px
  shadowLevel: 'glow', // 'none' | 'sm' | 'md' | 'lg' | 'glow'
  animationsEnabled: true,
  animationSpeed: 1.0 // 0.5x, 1x, 1.5x, 2x
};

export const DEFAULT_PAGE_LAYOUTS = {
  home: {
    title: 'Home Page',
    sections: [
      { id: 'home_stories_bar', label: 'Stories & Reels Bar', visible: true, order: 0, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'home_live_carousel', label: 'Featured Live Streams Carousel', visible: true, order: 1, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' },
      { id: 'home_posts_feed', label: 'Community Posts Feed', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' },
      { id: 'home_trending_creators', label: 'Trending Creators List', visible: true, order: 3, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  },
  discover: {
    title: 'Discover & Search Page',
    sections: [
      { id: 'discover_search_bar', label: 'Global Search & Filter Bar', visible: true, order: 0, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'discover_categories', label: 'Category Pills / Tags', visible: true, order: 1, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'none' },
      { id: 'discover_user_grid', label: 'Approved Users Grid', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' },
      { id: 'discover_leaderboard', label: 'Leaderboard & Top Gifters Subtab', visible: true, order: 3, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  },
  match: {
    title: 'Match & Video Roulette',
    sections: [
      { id: 'match_deck_card', label: 'Swipe Match Deck Card', visible: true, order: 0, padding: 20, margin: 12, borderRadius: 24, bg: '', shadow: 'glow' },
      { id: 'match_roulette_widget', label: '30s Video Roulette Speed Dating', visible: true, order: 1, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' },
      { id: 'match_who_liked_you', label: 'Who Liked You (VIP Banner)', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  },
  messages: {
    title: 'Messages & Direct Chat',
    sections: [
      { id: 'messages_header', label: 'Chat Header & Filter Tags', visible: true, order: 0, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'messages_pinned_list', label: 'Pinned Conversations Horizontal Row', visible: true, order: 1, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'none' },
      { id: 'messages_recent_list', label: 'Recent Messages List', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' },
      { id: 'messages_chat_window', label: 'Active Direct Chat Box & Input', visible: true, order: 3, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' }
    ]
  },
  profile: {
    title: 'Profile Dashboard',
    sections: [
      { id: 'profile_header_card', label: 'User Avatar, Name & Bio Card', visible: true, order: 0, padding: 20, margin: 12, borderRadius: 24, bg: '', shadow: 'glow' },
      { id: 'profile_stats_row', label: 'Followers, Following & Stars Stats', visible: true, order: 1, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'profile_tab_nav', label: 'Profile Subtabs Bar (Media, VIP, Wallet, Settings)', visible: true, order: 2, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'none' },
      { id: 'profile_moments_gallery', label: 'Media Moments & Photo Gallery', visible: true, order: 3, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  },
  wallet: {
    title: 'Wallet & Creator Earnings',
    sections: [
      { id: 'wallet_balance_card', label: 'Multi-Currency Balance Summary Card', visible: true, order: 0, padding: 20, margin: 12, borderRadius: 24, bg: '', shadow: 'glow' },
      { id: 'wallet_action_buttons', label: 'Buy Stars, Convert & Withdraw Actions', visible: true, order: 1, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'wallet_creator_studio', label: 'Creator Studio & Analytics Panel', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' },
      { id: 'wallet_transactions_list', label: 'Financial Transactions Audit History', visible: true, order: 3, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  },
  live: {
    title: 'Live Stream Viewer & Host',
    sections: [
      { id: 'live_video_player', label: 'Fullscreen Video Player Canvas', visible: true, order: 0, padding: 0, margin: 0, borderRadius: 0, bg: '', shadow: 'none' },
      { id: 'live_top_badges', label: 'Host Avatar, Viewer Count & VIP Badges', visible: true, order: 1, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'live_chat_overlay', label: 'Real-time Chat Overlay & AI Translation', visible: true, order: 2, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'none' },
      { id: 'live_gift_bar', label: 'Bottom Action Controls & Gift Shop Button', visible: true, order: 3, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'md' }
    ]
  },
  vip: {
    title: 'VIP & Membership Center',
    sections: [
      { id: 'vip_banner_card', label: 'VIP Status & Tier Banner', visible: true, order: 0, padding: 20, margin: 12, borderRadius: 24, bg: '', shadow: 'glow' },
      { id: 'vip_benefits_grid', label: 'VIP Perks & Features Grid', visible: true, order: 1, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' },
      { id: 'vip_plans_cards', label: 'Subscription Plans Options', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  },
  settings: {
    title: 'App Settings & Preferences',
    sections: [
      { id: 'settings_header', label: 'Settings Header & Search Input', visible: true, order: 0, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'settings_tabs_nav', label: '18-Section Category Navigation', visible: true, order: 1, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'none' },
      { id: 'settings_active_panel', label: 'Preference Toggles & Configuration Panel', visible: true, order: 2, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' }
    ]
  },
  admin: {
    title: 'Admin Dashboard Modal',
    sections: [
      { id: 'admin_header', label: 'Admin Security Status & Header', visible: true, order: 0, padding: 16, margin: 8, borderRadius: 20, bg: '', shadow: 'glow' },
      { id: 'admin_quick_stats', label: '20-Section Overview Cards Grid', visible: true, order: 1, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'md' },
      { id: 'admin_tabs_bar', label: 'Admin Modules Horizontal Tab Switcher', visible: true, order: 2, padding: 12, margin: 8, borderRadius: 16, bg: '', shadow: 'sm' },
      { id: 'admin_content_table', label: 'Admin Data Tables & Action Management', visible: true, order: 3, padding: 16, margin: 12, borderRadius: 20, bg: '', shadow: 'sm' }
    ]
  }
};

const LOCAL_STORAGE_KEY = 'vlive_ui_editor_config_v1';

export const loadUiConfig = async () => {
  let cached = safeStorage.getItem(LOCAL_STORAGE_KEY);
  let config = null;

  if (cached) {
    try {
      config = typeof cached === 'string' ? JSON.parse(cached) : cached;
    } catch (e) {
      console.warn('Failed to parse cached UI config', e);
    }
  }

  // Attempt to sync from Supabase tables
  try {
    const { data: themeData } = await supabase.from('theme_settings').select('*').limit(1);
    const { data: layoutData } = await supabase.from('page_layouts').select('*');
    const { data: componentData } = await supabase.from('component_positions').select('*');

    if (themeData && themeData.length > 0) {
      const fetchedTheme = themeData[0].settings || themeData[0];
      config = config || {};
      config.theme = { ...DEFAULT_THEME, ...(config.theme || {}), ...fetchedTheme };
    }

    if (layoutData && layoutData.length > 0) {
      config = config || {};
      config.pageLayouts = config.pageLayouts || { ...DEFAULT_PAGE_LAYOUTS };
      layoutData.forEach(item => {
        if (item.page_id && item.layout) {
          config.pageLayouts[item.page_id] = item.layout;
        }
      });
    }

    if (componentData && componentData.length > 0) {
      config = config || {};
      config.componentStyles = config.componentStyles || {};
      componentData.forEach(item => {
        if (item.component_id && item.styles) {
          config.componentStyles[item.component_id] = item.styles;
        }
      });
    }
  } catch (err) {
    console.info('Supabase UI settings fetch note (using local fallback if table missing):', err.message);
  }

  if (!config) {
    config = {
      theme: { ...DEFAULT_THEME },
      pageLayouts: JSON.parse(JSON.stringify(DEFAULT_PAGE_LAYOUTS)),
      componentStyles: {}
    };
  } else {
    config.theme = { ...DEFAULT_THEME, ...(config.theme || {}) };
    config.pageLayouts = { ...JSON.parse(JSON.stringify(DEFAULT_PAGE_LAYOUTS)), ...(config.pageLayouts || {}) };
    config.componentStyles = config.componentStyles || {};
  }

  return config;
};

export const saveUiConfigToSupabase = async (config) => {
  // 1. Save to safeStorage locally first for instant consistency
  safeStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));

  let dbSuccess = false;

  // 2. Try saving to Supabase tables
  try {
    // Save theme settings
    if (config.theme) {
      await supabase.from('theme_settings').upsert([
        { id: 1, settings: config.theme, updated_at: new Date().toISOString() }
      ], { onConflict: 'id' });
    }

    // Save page layouts
    if (config.pageLayouts) {
      const layoutRows = Object.keys(config.pageLayouts).map(pageId => ({
        page_id: pageId,
        layout: config.pageLayouts[pageId],
        updated_at: new Date().toISOString()
      }));
      await supabase.from('page_layouts').upsert(layoutRows, { onConflict: 'page_id' });
    }

    // Save ui settings summary
    await supabase.from('ui_settings').upsert([
      { id: 'global_ui_config', config_data: config, updated_at: new Date().toISOString() }
    ], { onConflict: 'id' });

    dbSuccess = true;
  } catch (err) {
    console.warn('Supabase UI config save warning:', err.message);
  }

  return { localSaved: true, dbSaved: dbSuccess };
};
