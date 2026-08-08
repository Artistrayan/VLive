import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import React, { useState, useEffect } from 'react';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { safeStorage } from '../../utils/safeStorage';
import { getUserId } from '../../services/api';
import { 
  Camera, Edit3, Settings, ShieldAlert, Sparkles, QrCode, Lock, Crown,
  CheckCircle, Plus, DollarSign, LogOut, ChevronRight, MapPin, Wallet, Flame, Video, Gift, PhoneCall, Image,
  User, Users, Eye, ThumbsUp, Heart, Share2, Award, Calendar, Globe, Briefcase, GraduationCap,
  MessageSquare, Shield, Activity, Radio, Check, X, Smartphone, Copy, ExternalLink, Zap, Star, ShieldCheck,
  Filter, Play, AlertCircle, Trash2, Upload
} from 'lucide-react';
import { interestService } from "../../services/interestService";
import InterestsModal from "./InterestsModal";
import { CoinsIcon, VerifiedBadge, VipStatusBadge } from '../CommonBadges';

export default function ProfileTab(props) {
  const {
    activeTab,
    userAvatar, setUserAvatar,
    userName, setUserName,
    userBio, setUserBio,
    userCoins = 0, userDiamonds = 0, userCashBalance = 0,
    activeProfileTab = 'photos', setActiveProfileTab = (() => {}),
    currentUsername, authUsername,
    isUserRayan, userLevel = 24, vipPlan,
    PRESET_AVATARS = [], compressImageFile,
    setIsEditProfileModalOpen = (() => {}), setIsVipModalOpen = (() => {}),
    setIsSecurityModalOpen = (() => {}), setIsLanguageModalOpen = (() => {}), handleSelectLanguage = (() => {}), setIsQrCodeModalOpen = (() => {}),
    setWalletSubTab = (() => {}), setIsLoggedIn = (() => {}), setAuthStep = (() => {}),
    showToast = (() => {}), loc = ((a, b) => b || a),
    isVerified = true,
    setIsAdminPanelOpen,
    setIsStreamerCenterOpen,
    setIsHostLiveOpen = (() => {}),
    authAvatar = '', authFullName = '', authCity = 'Tehran', userRank = 'VIP Streamer',
    authBio = '', dailyStreak = 5,
    usersList = [], setUsersList = (() => {}),
    addAdminAuditLog = (() => {})
  } = props;

  if (activeTab !== 'profile') return null;

  const { isSuperAdmin, isEditMode, setIsEditMode } = useVisualUiEditor();

  // --- PERSISTENT PROFILE EDIT STATES ---
  const [coverPhoto, setCoverPhoto] = useState(() => {
    return safeStorage.getItem('vlive_profile_cover') || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  });
  const [userCity, setUserCity] = useState(() => {
    return safeStorage.getItem('vlive_profile_city') || authCity || 'Tehran, Iran';
  });
  const [userAge, setUserAge] = useState(() => {
    return safeStorage.getItem('vlive_profile_age') || '26';
  });
  const [userOccupation, setUserOccupation] = useState(() => {
    return safeStorage.getItem('vlive_profile_occupation') || 'Digital Content Creator & Streamer Host';
  });
  const [userEducation, setUserEducation] = useState(() => {
    return safeStorage.getItem('vlive_profile_education') || 'Software Engineering / Digital Arts';
  });
  const [userRelationship, setUserRelationship] = useState(() => {
    return safeStorage.getItem('vlive_profile_relationship') || 'Single';
  });
  const [userInterests, setUserInterests] = useState(() => {
    return safeStorage.getItem('vlive_profile_interests') || 'Live Streaming, Music, Tech, Travel, Gaming';
  });
  const [userLanguages, setUserLanguages] = useState(() => {
    return safeStorage.getItem('vlive_profile_languages') || 'Persian, English, Turkish';
  });
  const [instagramLink, setInstagramLink] = useState(() => {
    return safeStorage.getItem('vlive_profile_ig') || '@rayan_vlive';
  });
  const [telegramLink, setTelegramLink] = useState(() => {
    return safeStorage.getItem('vlive_profile_tg') || '@rayan_official';
  });

  // --- EDIT PROFILE MODAL STATE ---
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [fullInterestsList, setFullInterestsList] = useState([]);

  useEffect(() => {
    interestService.getGlobalInterests().then(res => setFullInterestsList(res));
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userName || authFullName || 'Rayan Maleki',
    bio: userBio || authBio || 'Official V.Live Streamer | Private video calls & interactive 4K streams',
    city: userCity,
    age: userAge,
    occupation: userOccupation,
    education: userEducation,
    relationship: userRelationship,
    interests: userInterests,
    languages: userLanguages,
    instagram: instagramLink,
    telegram: telegramLink,
    avatar: userAvatar || authAvatar || PRESET_AVATARS[0],
    cover: coverPhoto
  });

  // --- IMAGE UPLOAD HANDLERS ---
  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let result = null;
      if (typeof compressImageFile === 'function') {
        result = await compressImageFile(file, 400, 400, 0.85);
      } else {
        result = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }
      if (result) {
        setEditForm(prev => ({ ...prev, avatar: result }));
        showToast(window.loc('تصویر آواتار با موفقیت بارگذاری شد 🖼️', 'Avatar image uploaded successfully 🖼️'));
      }
    } catch (err) {
      showToast(window.loc('خطا در بارگذاری عکس ❌', 'Error in uploading photo'));
    }
  };

  const handleCoverFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      let result = null;
      if (typeof compressImageFile === 'function') {
        result = await compressImageFile(file, 800, 400, 0.85);
      } else {
        result = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }
      if (result) {
        setEditForm(prev => ({ ...prev, cover: result }));
        showToast(window.loc('تصویر کاور با موفقیت بارگذاری شد 🎨', 'The cover image has been successfully uploaded 🎨'));
      }
    } catch (err) {
      showToast(window.loc('خطا در بارگذاری کاور ❌', 'Error loading cover ❌'));
    }
  };

  // --- PRIVACY & SECURITY TOGGLES ---
  const [allowDirectMessages, setAllowDirectMessages] = useState(() => safeStorage.getItem('vlive_priv_dm') || 'everyone');
  const [allowPrivateCalls, setAllowPrivateCalls] = useState(() => safeStorage.getItem('vlive_priv_calls') || 'vip');
  const [showOnlineStatus, setShowOnlineStatus] = useState(() => safeStorage.getItem('vlive_priv_online') !== 'false');
  const [showLocation, setShowLocation] = useState(() => safeStorage.getItem('vlive_priv_loc') !== 'false');

  // --- REAL PROFILE STATISTICS & PERSISTENCE ---
  const [userFollowersCount, setUserFollowersCount] = useState(() => {
    return Number(safeStorage.getItem('vlive_user_followers') || 0);
  });
  const [userViewsCount, setUserViewsCount] = useState(() => {
    return Number(safeStorage.getItem('vlive_user_views') || 0);
  });

  // Calculate real Following count based on followedUsers prop or storage
  const userFollowingCount = Array.isArray(props.followedUsers)
    ? props.followedUsers.length
    : Number(safeStorage.getItem('vlive_user_following') || 0);

  // Increments real views count on profile visit
  useEffect(() => {
    const newViews = userViewsCount + 1;
    setUserViewsCount(newViews);
    safeStorage.setItem('vlive_user_views', String(newViews));
  }, []);

  // --- LOCAL POSTS STATE WITH REAL LIKES & COMMENTS (STARTING FROM ZERO) ---
  const [profilePosts, setProfilePosts] = useState([
    {
      id: 1,
      isPinned: true,
      author: userName || 'Rayan Maleki',
      username: currentUsername || 'rayan_vlive',
      avatar: userAvatar || PRESET_AVATARS[0],
      time: '2 hours ago',
      content: window.loc('🎬 لایواستریم اختصاصی امشب ساعت ۲۲:۰۰ شروع میشه! منتظر همگی در بخش لایو هستیم 💖✨', '🎬 Exclusive livestream starts tonight at 22:00! We are waiting for everyone in the live section 💖✨'),
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false
    },
    {
      id: 2,
      isPinned: false,
      author: userName || 'Rayan Maleki',
      username: currentUsername || 'rayan_vlive',
      avatar: userAvatar || PRESET_AVATARS[0],
      time: 'Yesterday',
      content: window.loc('مرسی از همه دوستانی که دیشب تو روم خصوصی همراهم بودن. هدیه‌های ارزشمندتون ثبت شد! 🎁🔥', 'Thank you to all my friends who were with me in the private room last night. Your valuable gifts have been registered! 🎁🔥'),
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false
    }
  ]);

  // Real total likes calculation across posts + persistent likes
  const userTotalLikes = profilePosts.reduce((sum, post) => sum + (post.likes || 0), 0) + Number(safeStorage.getItem('vlive_user_extra_likes') || 0);

  // Dynamic Profile Completion % based on filled details
  const profileCompletionPercent = (() => {
    const fields = [userName, userBio, userAvatar, coverPhoto, userCity, userAge, userOccupation, userInterests];
    const filled = fields.filter(f => f && String(f).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  })();
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  // Save changes to safeStorage
  const handleSaveProfile = () => {
    setUserName(editForm.name);
    setUserBio(editForm.bio);
    setUserAvatar(editForm.avatar);
    setCoverPhoto(editForm.cover);
    setUserCity(editForm.city);
    setUserAge(editForm.age);
    setUserOccupation(editForm.occupation);
    setUserEducation(editForm.education);
    setUserRelationship(editForm.relationship);
    setUserInterests(editForm.interests);
    setUserLanguages(editForm.languages);
    setInstagramLink(editForm.instagram);
    setTelegramLink(editForm.telegram);

    safeStorage.setItem('vlive_user_name', editForm.name);
    safeStorage.setItem('vlive_user_bio', editForm.bio);
    safeStorage.setItem('vlive_user_avatar', editForm.avatar);
    safeStorage.setItem('vlive_profile_cover', editForm.cover);
    safeStorage.setItem('vlive_profile_city', editForm.city);
    safeStorage.setItem('vlive_profile_age', editForm.age);
    safeStorage.setItem('vlive_profile_occupation', editForm.occupation);
    safeStorage.setItem('vlive_profile_education', editForm.education);
    safeStorage.setItem('vlive_profile_relationship', editForm.relationship);
    safeStorage.setItem('vlive_profile_interests', editForm.interests);
    safeStorage.setItem('vlive_profile_languages', editForm.languages);
    safeStorage.setItem('vlive_profile_ig', editForm.instagram);
    safeStorage.setItem('vlive_profile_tg', editForm.telegram);

    setIsEditModalOpen(false);
    showToast(window.loc('پروفایل شما با موفقیت به‌روزرسانی و ذخیره شد ✨', 'Profile updated & saved successfully ✨'));
  };

  const handleAddPost = () => {
    if (!newPostText.trim() && !newPostImage.trim()) {
      showToast(window.loc('لطفاً متنی برای پست وارد کنید', 'Please enter text for post'));
      return;
    }
    const newPost = {
      id: Date.now(),
      isPinned: false,
      author: userName || 'Rayan Maleki',
      username: currentUsername || 'rayan_vlive',
      avatar: userAvatar || PRESET_AVATARS[0],
      time: 'Just now',
      content: newPostText,
      image: newPostImage.trim() || null,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false
    };
    setProfilePosts([newPost, ...profilePosts]);
    setNewPostText('');
    setNewPostImage('');
    showToast(window.loc('پست جدید با موفقیت منتشر شد 🎉', 'New post published successfully 🎉'));
  };

  const isAdminUser = isUserRayan || isSuperAdmin || currentUsername?.toLowerCase() === 'rayan' || authUsername?.toLowerCase() === 'rayan';

  return (
    <>
      <div className="space-y-6 pb-28 animate-fadeIn dir-ltr">
        
        {/* ========================================== */}
        {/* 1. HERO COVER & PROFILE CARD               */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_header_card" defaultLabel="User Avatar, Name & Bio Card">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl">
            
            {/* Cover Banner */}
            <div className="h-40 sm:h-52 relative overflow-hidden bg-slate-900">
              <img 
                src={coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-90 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
              
              {/* Top Quick Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsQrCodeModalOpen(true)}
                  className="p-2 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md transition border border-white/20"
                  title="Share QR Code"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                </button>
                
                <button
                  onClick={() => setIsSecurityModalOpen(true)}
                  className="p-2 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md transition border border-white/20"
                  title="Settings & Security"
                >
                  <Settings className="w-4 h-4 text-slate-300" />
                </button>
              </div>

            </div>

            {/* Profile Info & Avatar */}
            <div className="px-4 sm:px-6 pb-6 relative">
              
              {/* Avatar & Action Row */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
                
                {/* Large Avatar */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                    <img
                      src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full bg-slate-900"
                    />
                  </div>
                  
                  {/* Online Badge */}
                  {showOnlineStatus && (
                    <span className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg" title="Online Status" />
                  )}

                  {/* Change Avatar Overlay */}
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 text-white font-bold text-xs gap-1"
                  >
                    <Camera className="w-5 h-5 text-pink-400" />
                  </button>
                </div>

              </div>

              {/* User Identity Details */}
              <div className="text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {userName || authFullName || 'Rayan Maleki'}
                  </h1>
                  {isVerified && <VerifiedBadge showLabel={false} className="w-5 h-5" />}
                  <VipStatusBadge size="normal" showText={true} />
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400 flex-wrap">
                  <span className="font-mono text-cyan-400 font-semibold">@{currentUsername || authUsername || 'rayan_vlive'}</span>
                  <span>•</span>
                  <span className="text-slate-300 font-medium">{userAge} yrs</span>
                  <span>•</span>
                  {showLocation && (
                    <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full text-slate-300">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      {userCity}
                    </span>
                  )}
                  <span>•</span>
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                    {userRank}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
                  {userBio || authBio || 'Official V.Live Streamer | Private video calls & interactive 4K streams'}
                </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(() => {
                      try {
                        const parsed = JSON.parse(userInterests);
                        if (Array.isArray(parsed)) {
                          return parsed.map(id => {
                            const item = fullInterestsList.find(i => i.id === id);
                            if (!item) return null;
                            return (
                              <span key={id} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300">
                                <span>{item.icon}</span>
                                <span>{item.name}</span>
                              </span>
                            );
                          });
                        }
                      } catch(e) {}
                      return userInterests.split(",").map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300">
                          #{tag.trim()}
                        </span>
                      ));
                    })()}
                  </div>

              </div>


              {/* Statistics Grid */}
              <div className="flex justify-around pt-3 mt-3 border-t border-slate-800/80 text-center">
                <div>
                  <span className="block text-sm font-black text-white">{userFollowersCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('فالوور', 'Followers')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-white">{userFollowingCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('فالووینگ', 'Following')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-pink-400">{userTotalLikes.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('لایک', 'Likes')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-cyan-400">{userViewsCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('بازدید', 'Views')}</span>
                </div>
                <div>
                  <span className="block text-sm font-black text-purple-400">Lv.{userLevel}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{window.loc('سطح', 'Level')}</span>
                </div>
              </div>

            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* STORIES HORIZONTAL BAR                    */}
        {/* ========================================== */}
        <div className="p-3 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{window.loc('استوری‌ها و هایلایت‌ها', 'Stories & Highlights')}</span>
            </span>
            <span className="text-[10px] text-pink-400 font-bold cursor-pointer">{window.loc('مشاهده همه', 'View All')}</span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {/* Add Story Button */}
            <button
              onClick={() => showToast(window.loc('📷 بخش آپلود استوری آماده است', 'Story Creator is active!'))}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-dashed border-pink-500/60 flex items-center justify-center text-pink-400 group-hover:scale-105 transition">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-300">{window.loc('افزودن', 'Add')}</span>
            </button>

            {/* Story Circles */}
            {[
              { title: 'Daily Vlog', img: PRESET_AVATARS[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
              { title: 'Stream Moments', img: PRESET_AVATARS[1] || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
              { title: 'VIP Exclusive', img: PRESET_AVATARS[2] || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80' },
              { title: 'Travel ✈️', img: PRESET_AVATARS[3] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
            ].map((story, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 group-hover:scale-105 transition shadow-md">
                  <img src={story.img} alt={story.title} className="w-full h-full object-cover rounded-full bg-slate-950" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 max-w-[64px] truncate">{story.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* SUB-NAVIGATION CONTENT TABS                */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_tab_nav" defaultLabel="Profile Content Tabs">
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-4 overflow-x-auto scrollbar-none">
            {[
              { id: 'photos', label: window.loc('عکس‌ها', 'Photos') },
              { id: 'videos', label: window.loc('فیلم‌ها', 'Videos') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveProfileTab(tab.id)}
                className={`flex-1 min-w-[80px] py-2 rounded-xl text-xs font-bold transition-all ${
                  activeProfileTab === tab.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* DEDICATED ADMIN CARD FOR ADMIN USERS       */}
        {/* ========================================== */}
        {isAdminUser && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border border-rose-500/50 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
                <div>
                  <h3 className="font-black text-white text-sm flex items-center gap-2">
                    <span>{window.loc('پنل مدیریت و ناظر ارشد (Super Admin)', 'Super Admin Moderation Control')}</span>
                    <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">RAYAN ONLY</span>
                  </h3>
                  <p className="text-[11px] text-rose-300">{window.loc('مدیریت مستقیم کاربران، گزارش‌ها، احراز هویت و دسترسی‌های سیستم', 'Direct management of users, reports, authentication and system access')}</p>
                </div>
              </div>

              <button
                onClick={() => setIsAdminPanelOpen && setIsAdminPanelOpen(true)}
                className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg flex items-center gap-1.5 transition active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>{window.loc('ورود به داشبورد کامل', 'Open Full Admin')}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/20 text-center">
                <span className="block text-lg font-black text-white">{usersList.length || 248}</span>
                <span className="text-[10px] text-slate-400">{window.loc('کل کاربران', 'Total users')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/20 text-center">
                <span className="block text-lg font-black text-amber-400">12</span>
                <span className="text-[10px] text-slate-400">{window.loc('احراز هویت معلق', 'Authentication pending')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/20 text-center">
                <span className="block text-lg font-black text-cyan-400">45</span>
                <span className="text-[10px] text-slate-400">{window.loc('استریمر تایید شده', 'Verified streamer')}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/20 text-center">
                <span className="block text-lg font-black text-rose-400">0</span>
                <span className="text-[10px] text-slate-400">{window.loc('گزارش تخلف جدید', 'Report a new violation')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setIsEditMode && setIsEditMode(!isEditMode)}
                className="flex-1 py-2.5 rounded-2xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditMode ? window.loc('خروج از ویرایش بصری UI', 'Exit visual UI editing') : window.loc('ویرایشگر بصری UI', 'Visual UI editor')}</span>
              </button>

              <button
                onClick={() => {
                  addAdminAuditLog(window.loc('بازبینی سریع کاربران از پروفایل انجام شد', 'Quick review of users\' profiles was done'));
                  showToast(window.loc('بررسی امنیتی کامل اجرا شد ✅', 'A complete security check has been implemented'));
                }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{window.loc('ثبت لاگ نظارت سریع', 'Fast monitoring log recording')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ACTION GRID                                */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_actions_grid" defaultLabel="Profile Actions Grid">
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-4">
            <button onClick={() => setIsEditModalOpen(true)} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Edit3 className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('ویرایش', 'Edit')}</span>
            </button>
            <button onClick={() => { setActiveProfileTab('wallet'); setWalletSubTab && setWalletSubTab('buy'); }} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Wallet className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('کیف پول', 'Wallet')}</span>
            </button>
            <button onClick={() => setActiveProfileTab('vip')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Crown className="w-5 h-5 text-purple-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('وی‌آی‌پی', 'VIP')}</span>
            </button>
            <button onClick={() => setActiveProfileTab('about')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <User className="w-5 h-5 text-cyan-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('درباره', 'About')}</span>
            </button>
            
            <button onClick={() => setActiveProfileTab('activity')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('فعالیت', 'Activity')}</span>
            </button>
            <button onClick={() => setActiveProfileTab('lives')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Video className="w-5 h-5 text-pink-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('لایوها', 'Lives')}</span>
            </button>
            <button onClick={() => showToast(window.loc('بخش علاقه‌مندی‌ها به زودی فعال می‌شود', 'Favorites coming soon'))} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Heart className="w-5 h-5 text-rose-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('علاقه‌مندی', 'Favorites')}</span>
            </button>
            <button onClick={() => showToast(window.loc('بخش فالوورها به زودی فعال می‌شود', 'Followers coming soon'))} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Users className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('فالوورها', 'Followers')}</span>
            </button>
            
            <button onClick={() => showToast(window.loc('بخش فالووینگ به زودی فعال می‌شود', 'Following coming soon'))} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('فالووینگ', 'Following')}</span>
            </button>
            <button onClick={() => setActiveProfileTab('settings')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('تنظیمات', 'Settings')}</span>
            </button>
            <button onClick={() => setIsSecurityModalOpen && setIsSecurityModalOpen(true)} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('حریم‌خصوصی', 'Privacy')}</span>
            </button>
            <button onClick={() => props.setIsSupportModalOpen && props.setIsSupportModalOpen(true)} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('پشتیبانی', 'Support')}</span>
            </button>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* 2. SUB-TAB CONTENT PANELS                  */}
        {/* ========================================== */}

        {/* TAB 1: POSTS FEED */}
        {activeProfileTab === 'posts' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Create Post Box */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img src={userAvatar || PRESET_AVATARS[0]} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-pink-500/40" />
                <input
                  type="text"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={window.loc('امروز چه خبر؟ متن یا عکس انتشار بدید...', 'Share a post or moment with followers...')}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <input
                  type="text"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  placeholder={window.loc('لینک تصویر (اختیاری)...', 'Image link (optional)...')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] text-white w-1/2 outline-none"
                />

                <button
                  onClick={handleAddPost}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{window.loc('انتشار پست', 'Publish')}</span>
                </button>
              </div>
            </div>

            {/* Posts List */}
            {profilePosts.map(post => (
              <div key={post.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-purple-500/40" />
                    <div>
                      <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>{post.author}</span>
                        {post.isPinned && (
                          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                            📌 Pinned
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] text-slate-400">@{post.username} • {post.time}</span>
                    </div>
                  </div>

                  <button className="text-slate-500 hover:text-white text-xs font-bold">•••</button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-medium dir-rtl">{post.content}</p>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-slate-950">
                    <img src={post.image} alt="Post Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <button
                    onClick={() => {
                      setProfilePosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
                    }}
                    className={`flex items-center gap-1.5 font-bold transition ${post.liked ? 'text-pink-500' : 'hover:text-white'}`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked ? 'fill-pink-500' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1.5 font-bold hover:text-white transition">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments} {window.loc('نظر', 'Comments')}</span>
                  </button>

                  <button 
                    onClick={() => showToast(window.loc('لینک پست کپی شد 🔗', 'Post link copied!'))}
                    className="flex items-center gap-1.5 font-bold hover:text-white transition"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ABOUT DETAILS */}
        {activeProfileTab === 'about' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="font-black text-white text-base pb-3 border-b border-slate-800 flex items-center justify-between">
                <span>{window.loc('اطلاعات شخصی و بیوگرافی', 'Personal Details & Biography')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    <span>{window.loc('سن و تاریخ تولد', 'Age & Birthday')}</span>
                  </span>
                  <p className="text-white font-black text-sm">{userAge} years old</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{window.loc('شهر و موقعیت', 'Location')}</span>
                  </span>
                  <p className="text-white font-black text-sm">{userCity}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                    <span>{window.loc('شغل و فعالیت', 'Occupation')}</span>
                  </span>
                  <p className="text-white font-black text-sm">{userOccupation}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    <span>{window.loc('تحصیلات', 'Education')}</span>
                  </span>
                  <p className="text-white font-black text-sm">{userEducation}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{window.loc('وضعیت تاهل', 'Relationship Status')}</span>
                  </span>
                  <p className="text-white font-black text-sm">{userRelationship}</p>
                </div>

                <div 
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 cursor-pointer hover:border-emerald-500/50 transition group"
                  title={window.loc('تغییر زبان برنامه', 'Change App Language')}
                >
                  <span className="text-slate-400 flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                      <span>{window.loc('زبان‌ها', 'Languages')}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {window.loc('تغییر 🌐', 'CHANGE 🌐')}
                    </span>
                  </span>
                  <p className="text-white font-black text-sm">{userLanguages}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-300">{window.loc('علاقه‌مندی‌ها', 'Interests & Tags')}</span>
                <div className="flex flex-wrap gap-2">
                  {userInterests.split(',').map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ACTIVITY TIMELINE */}
        {activeProfileTab === 'activity' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>{window.loc('تاریخچه فعالیت‌های اخیر', 'Recent Activity Log')}</span>
              </h3>

              <div className="space-y-3 text-xs">
                {[
                  { text: window.loc('برگزاری لایواستریم ۴K اختصاصی به مدت ۱.۵ ساعت', 'Holding an exclusive 4K live stream for 1.5 hours'), time: window.loc('امروز - ۱۰:۳۰', 'Today - 10:30'), icon: Video, color: 'text-pink-400' },
                  { text: window.loc('دریافت هدیه VIP تاج طلایی از @Elnaz', 'Received Golden Crown VIP gift from @Elnaz'), time: window.loc('دیروز - ۲۱:۱۵', 'Yesterday - 21:15'), icon: Gift, color: 'text-amber-400' },
                  { text: window.loc('رسیدن به سطح Lv.24 و دریافت بونوس ۵۰۰ سکه', 'Reach Lv.24 and get a bonus of 500 coins'), time: window.loc('۲ روز پیش', '2 days ago'), icon: Award, color: 'text-purple-400' },
                ].map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${act.color}`} />
                        <span className="text-slate-200 font-medium">{act.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: LIVES ARCHIVE */}
        {activeProfileTab === 'lives' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>{window.loc('آمار و عملکرد لایواستریم‌ها', 'Live Broadcast Performance')}</span>
                </h3>

                <button
                  onClick={() => {
                    if (!isVerified) {
                      showToast(window.loc('ابتدا باید درخواست استریمر شدن بدهید و توسط مدیریت تایید شوید ⚠️', 'You must first apply to become a streamer and be approved by admin ⚠️'));
                      return;
                    }
                    if (setIsHostLiveOpen) setIsHostLiveOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold"
                >
                  {window.loc('شروع لایو جدید', 'Go Live')}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium">{window.loc('مجموع ساعات لایو', 'Total live hours')}</span>
                  <span className="block text-xl font-black text-white">0 hrs</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium">{window.loc('کل بینندگان', 'Total viewers')}</span>
                  <span className="block text-xl font-black text-cyan-400">0</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 font-medium">{window.loc('درآمد از تماس اختصاصی', 'Earnings from exclusive calls')}</span>
                  <span className="block text-xl font-black text-amber-400">0 Stars</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: VIP & ACHIEVEMENTS */}
        {activeProfileTab === 'vip' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse" />
                <div>
                  <h3 className="font-black text-white text-lg">VIP Member Status</h3>
                  <p className="text-xs text-amber-300 font-semibold">{vipPlan ? `Active Plan: ${vipPlan.toUpperCase()}` : 'Standard VIP Member'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg"
              >
                Upgrade VIP
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Exclusive Gold Neon Profile Frame</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">High Priority Live Stream Placement</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Unlimited 4K HD Private Video Calls</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-200">24/7 Dedicated Support Agent</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: WALLET */}
        {activeProfileTab === 'wallet' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-black text-white text-lg">Wallet & Balance</h3>
                <p className="text-xs text-slate-400">Manage your V.Live Stars & USDT Earnings</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400 block">{userCoins.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400">Available Stars</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setWalletSubTab('buy')}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <CoinsIcon className="w-4 h-4 text-amber-300" />
                <span>Buy Stars</span>
              </button>
              <button
                onClick={() => setWalletSubTab('withdraw')}
                className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Withdraw USDT</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS & PRIVACY */}
        {activeProfileTab === 'settings' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-fadeIn">
            <h3 className="font-bold text-white text-sm pb-2 border-b border-slate-800">Account Preferences & Privacy</h3>
            
            {/* Privacy Controls */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>{window.loc('نمایش وضعیت آنلاین در پروفایل', 'Show Online Status')}</span>
                <input
                  type="checkbox"
                  checked={showOnlineStatus}
                  onChange={(e) => {
                    setShowOnlineStatus(e.target.checked);
                    safeStorage.setItem('vlive_priv_online', e.target.checked ? 'true' : 'false');
                  }}
                  className="w-4 h-4 text-pink-500 rounded"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>{window.loc('نمایش شهر و موقعیت جغرافیایی', 'Show Location on Profile')}</span>
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={(e) => {
                    setShowLocation(e.target.checked);
                    safeStorage.setItem('vlive_priv_loc', e.target.checked ? 'true' : 'false');
                  }}
                  className="w-4 h-4 text-pink-500 rounded"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => props.setIsSupportModalOpen && props.setIsSupportModalOpen(true)}
                className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{window.loc('قوانین و حریم خصوصی', 'Rules & Privacy')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => setIsQrCodeModalOpen(true)}
                className="w-full p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs text-slate-200 transition"
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>My QR Code</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setAuthStep('splash');
                  showToast('👋 You have been logged out.');
                }}
                className="w-full p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 flex items-center justify-between text-xs text-rose-300 transition mt-4"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="font-bold">Log Out Account</span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* 3. EDIT PROFILE MODAL                      */}
      {/* ========================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto" dir="rtl">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-pink-400" />
                <span>{window.loc('ویرایش اطلاعات کامل پروفایل', 'Edit complete profile information')}</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
              >✕</button>
            </div>

            <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Display Name & Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{window.loc('نام کامل / نام مستعار', 'Full name / Nickname')}</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{window.loc('بیوگرافی (Bio)', 'Biography (Bio)')}</label>
                <textarea
                  rows="3"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-pink-500"
                />
              </div>

              {/* Profile Image & Cover Upload & Management Card */}
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-black text-pink-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Camera className="w-4 h-4 text-pink-400" />
                  <span>{window.loc('تغییر و مدیریت تصویر پروفایل و کاور', 'Changing and managing the profile and cover image')}</span>
                </h4>

                {/* Avatar Section */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">{window.loc('تصویر آواتار (Profile Picture)', 'Avatar picture (Profile Picture)')}</label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg bg-slate-900 shrink-0">
                      {editForm.avatar ? (
                        <img src={editForm.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-[10px]">{window.loc('بدون عکس', 'No photo')}</div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{window.loc('آپلود عکس جدید', 'Upload a new photo')}</span>
                          <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                        </label>

                        {editForm.avatar && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditForm(prev => ({ ...prev, avatar: '' }));
                              showToast(window.loc('تصویر آواتار حذف شد 🗑️', 'Avatar image removed 🗑️'));
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1 border border-rose-500/30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{window.loc('حذف', 'remove')}</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder={window.loc('یا آدرس لینک تصویر (URL)...', 'or image link address (URL)...')}
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-[11px] outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Preset Avatar Selection Grid */}
                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1.5">{window.loc('یا انتخاب از آواتارهای آماده:', 'Or choosing from ready-made avatars:')}</span>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {(PRESET_AVATARS.length > 0 ? PRESET_AVATARS : [
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
                      ]).map((presetUrl, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, avatar: presetUrl }));
                            showToast(window.loc('آواتار انتخابی اعمال شد ✨', 'The selected avatar has been applied'));
                          }}
                          className={`w-10 h-10 rounded-full border-2 overflow-hidden shrink-0 transition ${
                            editForm.avatar === presetUrl ? 'border-pink-500 scale-110 shadow-[0_0_10px_rgba(236,72,153,0.5)]' : 'border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <img src={presetUrl} alt={`Preset ${pIdx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cover Photo Section */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <label className="text-xs font-bold text-slate-300 block">{window.loc('تصویر کاور پروفایل (Cover Photo)', 'Profile cover photo')}</label>
                  <div className="flex flex-col gap-2">
                    <div className="relative w-full h-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner">
                      {editForm.cover ? (
                        <img src={editForm.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-xs">{window.loc('بدون تصویر کاور', 'No cover image')}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-cyan-300 font-black text-xs flex items-center gap-1.5 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{window.loc('آپلود کاور جدید', 'Upload new cover')}</span>
                        <input type="file" accept="image/*" onChange={handleCoverFileUpload} className="hidden" />
                      </label>

                      {editForm.cover && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditForm(prev => ({ ...prev, cover: '' }));
                            showToast(window.loc('تصویر کاور حذف شد 🗑️', 'The cover image was removed 🗑️'));
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1 border border-rose-500/30 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{window.loc('حذف کاور', 'Remove the cover')}</span>
                        </button>
                      )}

                      <input
                        type="text"
                        placeholder={window.loc('لینک مستقیم کاور...', 'Direct link to the cover...')}
                        value={editForm.cover}
                        onChange={(e) => setEditForm({ ...editForm, cover: e.target.value })}
                        className="flex-1 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[11px] outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* City & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{window.loc('شهر و کشور', 'city ​​and country')}</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{window.loc('سن', 'age')}</label>
                  <input
                    type="text"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Occupation & Education */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{window.loc('شغل', 'job')}</label>
                  <input
                    type="text"
                    value={editForm.occupation}
                    onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{window.loc('تحصیلات', 'education')}</label>
                  <input
                    type="text"
                    value={editForm.education}
                    onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Relationship & Languages */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{window.loc('وضعیت تاهل', 'marital status')}</label>
                  <select
                    value={editForm.relationship}
                    onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  >
                    <option value="Single">{window.loc('مجرد (Single)', 'Single')}</option>
                    <option value="In a Relationship">{window.loc('در رابطه (In a Relationship)', 'In a Relationship')}</option>
                    <option value="Married">{window.loc('متاهل (Married)', 'Married')}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">{window.loc('زبان‌های گفتاری', 'Spoken languages')}</label>
                  <input
                    type="text"
                    value={editForm.languages}
                    onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">{window.loc('علاقه‌مندی‌ها', 'Interests')}</label>
                <button
                  type="button"
                  onClick={() => setIsInterestsModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs hover:border-pink-500 transition"
                >
                  <span className="text-slate-400">
                    {window.loc('انتخاب علاقه‌مندی‌ها...', 'Select interests...')}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 transition"
              >
                {window.loc('ذخیره تغییرات پروفایل ✨', 'Save profile changes ✨')}
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                {window.loc('انصراف', 'opt out')}
              </button>
            </div>
          </div>
        </div>
      )}
      <InterestsModal
        isOpen={isInterestsModalOpen}
        onClose={(selectedIds) => {
          setIsInterestsModalOpen(false);
          if (selectedIds && Array.isArray(selectedIds)) {
            const stored = JSON.stringify(selectedIds);
            setUserInterests(stored);
            safeStorage.setItem("vlive_profile_interests", stored);
          } else {
            const stored = localStorage.getItem("vlive_profile_interests_mock");
            if (stored) {
              setUserInterests(stored);
              safeStorage.setItem("vlive_profile_interests", stored);
            }
          }
        }}
        userId={getUserId()}
        showToast={typeof showToast !== 'undefined' ? showToast : undefined}
      />
    </>
  );
}
