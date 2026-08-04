const fs = require('fs');

let content = fs.readFileSync('src/modals/SettingsModal.jsx', 'utf8');

if (!content.includes('import { safeStorage }')) {
  content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { safeStorage } from '../utils/safeStorage';"
  );
}

const newStates = `
  const [privacyLastSeen, setPrivacyLastSeen] = React.useState(props.privacyLastSeen || 'everyone');
  const [privacyOnlineStatus, setPrivacyOnlineStatus] = React.useState(props.privacyOnlineStatus || 'everyone');
  const [privacyWhoMessage, setPrivacyWhoMessage] = React.useState(props.privacyWhoMessage || 'everyone');
  const [privacyWhoCall, setPrivacyWhoCall] = React.useState(props.privacyWhoCall || 'everyone');
  const [privacyShowCity, setPrivacyShowCity] = React.useState(props.privacyShowCity !== undefined ? props.privacyShowCity : true);
  const [privacyShowAge, setPrivacyShowAge] = React.useState(props.privacyShowAge !== undefined ? props.privacyShowAge : true);
  const [settingsCategoryFilter, setSettingsCategoryFilter] = React.useState(props.settingsCategoryFilter || 'all');
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(props.is2FAEnabled || false);
  const [notifSettingsDetailed, setNotifSettingsDetailed] = React.useState(props.notifSettingsDetailed || { likes: true, comments: true, gifts: true, lives: true });
  const [appAccentColor, setAppAccentColor] = React.useState(props.appAccentColor || 'pink');
  const [appFontSize, setAppFontSize] = React.useState(props.appFontSize || 'medium');
  const [appAnimations, setAppAnimations] = React.useState(props.appAnimations !== undefined ? props.appAnimations : true);
  const APP_LANGUAGES = props.APP_LANGUAGES || [
    { code: 'fa', name: 'فارسی' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'tr', name: 'Türkچه' },
    { code: 'ru', name: 'Русский' }
  ];
  const handleSelectLanguage = props.handleSelectLanguage || ((code) => { if (props.setCurrentAppLang) props.setCurrentAppLang(code); });
  const currentAppLang = props.currentAppLang || 'fa';
  const [liveDefaultQuality, setLiveDefaultQuality] = React.useState(props.liveDefaultQuality || '720p');
  const [videoCallQuality, setVideoCallQuality] = React.useState(props.videoCallQuality || '720p');
  const [beautyFilterEnabled, setBeautyFilterEnabled] = React.useState(props.beautyFilterEnabled !== undefined ? props.beautyFilterEnabled : true);
  const [autoSaveLive, setAutoSaveLive] = React.useState(props.autoSaveLive || false);
  const [showLiveComments, setShowLiveComments] = React.useState(props.showLiveComments !== undefined ? props.showLiveComments : true);
  const [autoDownloadPhotos, setAutoDownloadPhotos] = React.useState(props.autoDownloadPhotos !== undefined ? props.autoDownloadPhotos : true);
  const [autoDownloadVideos, setAutoDownloadVideos] = React.useState(props.autoDownloadVideos || false);
  const [photoSendQuality, setPhotoSendQuality] = React.useState(props.photoSendQuality || 'high');
  const [videoSendQuality, setVideoSendQuality] = React.useState(props.videoSendQuality || 'high');
  const setActiveTab = props.setActiveTab || (() => {});
  const [hostUsdtAddress, setHostUsdtAddress] = React.useState(props.hostUsdtAddress || '');
  const [cacheSizeMb, setCacheSizeMb] = React.useState(props.cacheSizeMb || 45.8);
  const [dataSaverEnabled, setDataSaverEnabled] = React.useState(props.dataSaverEnabled || false);
  const [mobileVideoQuality, setMobileVideoQuality] = React.useState(props.mobileVideoQuality || 'auto');
  const [blockedUsers, setBlockedUsers] = React.useState(props.blockedUsers || []);
  const [systemPerms, setSystemPerms] = React.useState(props.systemPerms || { camera: true, mic: true, location: true, notifs: true });
  const [feedbackText, setFeedbackText] = React.useState(props.feedbackText || '');
  const setIsLoggedIn = props.setIsLoggedIn || (() => {});
  const setAuthStep = props.setAuthStep || (() => {});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
  const [deletePassInput, setDeletePassInput] = React.useState('');
`;

content = content.replace(
  '  const setDataSaverMode = props.setDataSaverMode || setLocalAppDataSaverMode;',
  '  const setDataSaverMode = props.setDataSaverMode || setLocalAppDataSaverMode;\n' + newStates
);

fs.writeFileSync('src/modals/SettingsModal.jsx', content);
