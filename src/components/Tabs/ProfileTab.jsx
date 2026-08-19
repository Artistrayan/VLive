import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import React, { useState, useEffect } from 'react';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { safeStorage } from '../../utils/safeStorage';
import { getUserId, apiProfile } from '../../services/api';
import { isUserAnAdmin } from '../../utils/usernameUtils';
import { 
  Camera, Edit3, Settings, ShieldAlert, Sparkles, QrCode, Lock, Crown,
  CheckCircle, Plus, DollarSign, LogOut, ChevronRight, MapPin, Wallet, Flame, Video, Gift, PhoneCall, Image,
  User, Users, Eye, ThumbsUp, Heart, Share2, Award, Calendar, Globe, Briefcase, GraduationCap,
  MessageSquare, Shield, Activity, Radio, Check, X, Smartphone, Copy, ExternalLink, Zap, Star, ShieldCheck,
  Filter, Play, AlertCircle, Trash2, Upload, UserCheck
} from 'lucide-react';
import { interestService } from "../../services/interestService.js";
import InterestsModal from "./InterestsModal.jsx";
import { CoinsIcon, VerifiedBadge, VipStatusBadge } from '../CommonBadges';


// Helper to localize numbers according to current active language
const formatNum = (num) => {
  if (num === null || num === undefined || num === '') return '0';
  const val = Number(num);
  if (isNaN(val)) return String(num);

  const lang = typeof window !== 'undefined' && window.vlive_app_lang 
    ? window.vlive_app_lang 
    : (typeof localStorage !== 'undefined' ? localStorage.getItem('vlive_app_lang') : 'fa') || 'fa';

  if (lang === 'fa' || lang === 'ar') {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return val.toLocaleString('en-US').replace(/[0-9]/g, (d) => persianDigits[parseInt(d, 10)]);
  }
  return val.toLocaleString('en-US');
};

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
     setIsLanguageModalOpen = (() => {}), handleSelectLanguage = (() => {}), setIsQrCodeModalOpen = (() => {}),
    setWalletSubTab = (() => {}), setIsLoggedIn = (() => {}), setAuthStep = (() => {}),
    showToast = (() => {}), loc = ((a, b) => b || a),
    isVerified = true,
    setIsAdminPanelOpen,
    setAdminActiveTab,
    setIsStreamerCenterOpen,
    setIsHostLiveOpen = (() => {}),
    authAvatar = '', authFullName = '', authCity = 'Tehran', userRank = 'VIP Streamer',
    authBio = '', dailyStreak = 5,
    usersList = [], setUsersList = (() => {}),
    adminReportsList = [],
    addAdminAuditLog = (() => {})
  } = props;

  // if (activeTab !== 'profile') return null;

  const { isSuperAdmin, isEditMode, setIsEditMode } = useVisualUiEditor();

  // --- PERSISTENT PROFILE EDIT STATES ---
  const [coverPhoto, setCoverPhoto] = useState(() => {
    return safeStorage.getItem('vlive_profile_cover') || '';
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
    return safeStorage.getItem('vlive_profile_ig') || '';
  });
  const [telegramLink, setTelegramLink] = useState(() => {
    return safeStorage.getItem('vlive_profile_tg') || '';
  });

  // --- EDIT PROFILE MODAL STATE ---
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [fullInterestsList, setFullInterestsList] = useState([]);

  useEffect(() => {
    interestService.getGlobalInterests().then(res => setFullInterestsList(res));
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userName || authFullName || 'User',
    bio: userBio || authBio || '',
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
      image: '',
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
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [newPostType, setNewPostType] = useState('photo');
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

    // Real backend database sync
    apiProfile.updateProfile({
      name: editForm.name,
      bio: editForm.bio,
      avatar: editForm.avatar,
      city: editForm.city,
      age: Number(editForm.age) || undefined,
      interests: editForm.interests,
      is_onboarded: true
    }).catch(e => console.warn('ProfileTab backend sync note:', e));

    setIsEditModalOpen(false);
    showToast(window.loc('پروفایل شما با موفقیت به‌روزرسانی و ذخیره شد ✨', 'Profile updated & saved successfully ✨'));
  };

  const handleAddPost = () => {
    if (!newPostText.trim() && !newPostImage.trim()) {
      showToast(window.loc('لطفاً متنی بنویسید یا تصویری/ویدیویی از گالری انتخاب نمایید', 'Please write text or select a photo/video from gallery'));
      return;
    }
    const isVid = newPostType === 'video' || (newPostImage && (newPostImage.startsWith('data:video') || newPostImage.includes('.mp4')));
    const newPost = {
      id: Date.now(),
      isPinned: false,
      author: userName || 'Rayan Maleki',
      username: currentUsername || 'rayan_vlive',
      avatar: userAvatar || PRESET_AVATARS[0],
      time: 'Just now',
      content: newPostText,
      image: isVid ? null : (newPostImage.trim() || null),
      video: isVid ? (newPostImage.trim() || null) : null,
      mediaType: isVid ? 'video' : 'photo',
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false
    };
    setProfilePosts([newPost, ...profilePosts]);
    setNewPostText('');
    setNewPostImage('');
    setNewPostType('photo');
    showToast(window.loc('پست جدید با موفقیت منتشر شد 🎉', 'New post published successfully 🎉'));
  };

  const detectedTgId = props.currentUser?.telegram_id || props.currentTelegramId || (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.id : '') || '';
  const isAdminUser = (props.currentUser?.role === 'admin' || props.userRole === 'admin' || String(detectedTgId).trim() === '8933698119') && String(detectedTgId).trim() === '8933698119';

  return (
    <>
      {activeTab === 'profile' && (
        <>
      <div className="space-y-1.5 pb-28 animate-fadeIn dir-ltr">
        
        {/* ========================================== */}
        {/* 1. HERO COVER & PROFILE CARD               */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_header_card" defaultLabel="User Avatar, Name & Bio Card">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl">
            {/* Cover Banner */}
            <div className="h-28 sm:h-36 relative overflow-hidden bg-slate-900">
              <img 
                src={coverPhoto} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-90 transition duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
              
              {/* Top Quick Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                {isAdminUser && (
                  <button
                    onClick={() => setIsAdminPanelOpen && setIsAdminPanelOpen(true)}
                    className="p-2 rounded-2xl bg-rose-600/90 hover:bg-rose-500 text-white backdrop-blur-md transition border border-rose-400/50 shadow-lg flex items-center gap-1 text-xs font-black"
                    title={window.loc('پنل مدیریت', 'Admin Panel')}
                  >
                    <Shield className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">{window.loc('مدیریت', 'Admin')}</span>
                  </button>
                )}

                <button
                  onClick={() => setIsQrCodeModalOpen(true)}
                  className="p-2 rounded-2xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-md transition border border-white/20"
                  title="Share QR Code"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Profile Info & Avatar */}
            <div className="px-4 sm:px-6 pb-4 relative space-y-4">
              <div className="flex items-start justify-between gap-4">
                {/* Avatar on Top-Left + Username under photo */}
                <div className="flex flex-col items-center -mt-12 sm:-mt-16 shrink-0">
                  <div className="relative group">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_35px_rgba(236,72,153,0.5)]">
                      <img
                        src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                        alt={userName}
                        className="w-full h-full object-cover rounded-full bg-slate-900"
                      />
                    </div>
                    
                    {/* Online Status Badge */}
                    {showOnlineStatus && (
                      <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg" title="Online Status" />
                    )}

                    {/* Level & Verified Badge together at bottom right of Avatar */}
                    <div className="absolute bottom-1 right-1 z-10 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-full border border-slate-800 shadow-xl">
                      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="text-[10px] text-purple-200 uppercase font-bold">Lv</span>
                        <span>{userLevel}</span>
                      </div>
                      {isVerified && <VerifiedBadge showLabel={false} className="w-5 h-5 shrink-0" />}
                    </div>

                    {/* Change Avatar Overlay */}
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300 text-white font-bold text-xs gap-1 z-20"
                    >
                      <Camera className="w-5 h-5 text-pink-400" />
                    </button>
                  </div>

                  {/* Username under profile photo */}
                  <span className="font-mono text-cyan-400 font-bold text-xs sm:text-sm mt-1.5 text-center">
                    @{currentUsername || authUsername || 'user'}
                  </span>
                </div>

                {/* Right / Side Details (Name & VIP Badge) */}
                <div className="pt-3 sm:pt-4 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                      {userName || authFullName || 'User'}
                    </h1>
                    <VipStatusBadge size="normal" showText={true} />
                  </div>
                </div>
              </div>

              {/* STORIES SECTION INSIDE PROFILE CARD UNDER AVATAR */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between px-1">
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
                    className="flex flex-col items-center gap-1 shrink-0 group"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950 border-2 border-dashed border-pink-500/60 flex items-center justify-center text-pink-400 group-hover:scale-105 transition">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300">{window.loc('افزودن', 'Add')}</span>
                  </button>

                  {/* Story Circles */}
                  {[
                    { title: 'Daily Vlog', img: PRESET_AVATARS[0] || '' },
                    { title: 'Stream Moments', img: PRESET_AVATARS[1] || '' },
                    { title: 'VIP Exclusive', img: PRESET_AVATARS[2] || '' },
                    { title: 'Travel ✈️', img: PRESET_AVATARS[3] || '' },
                  ].map((story, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 group-hover:scale-105 transition shadow-md">
                        <img src={story.img} alt={story.title} className="w-full h-full object-cover rounded-full bg-slate-950" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate">{story.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* SEPARATE STATS CARD UNDERNEATH PROFILE     */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_stats_card" defaultLabel="Profile Statistics Bar">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg flex justify-around items-center text-center">
            {/* Followers */}
            <button
              onClick={() => {
                setActiveProfileTab('followers');
                showToast(window.loc('لیست فالوورهای شما 👥', 'Your followers list 👥'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'followers'
                  ? 'bg-indigo-950/80 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('فالوورها', 'Followers')}
            >
              <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{formatNum(userFollowersCount)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition truncate w-full">
                {window.loc('فالوورها', 'Followers')}
              </span>
            </button>

            {/* Following */}
            <button
              onClick={() => {
                setActiveProfileTab('following');
                showToast(window.loc('لیست افراد دنبال‌شده 🤝', 'Following list 🤝'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'following'
                  ? 'bg-blue-950/80 border-blue-500/60 shadow-md ring-1 ring-blue-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('فالووینگ', 'Following')}
            >
              <UserCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-white">{formatNum(userFollowingCount)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition truncate w-full">
                {window.loc('فالووینگ', 'Following')}
              </span>
            </button>

            {/* Likes */}
            <button
              onClick={() => {
                setActiveProfileTab('likes');
                showToast(window.loc('پست‌ها و مطالب محبوب شما ❤️', 'Your liked posts & stats ❤️'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'likes'
                  ? 'bg-pink-950/80 border-pink-500/60 shadow-md ring-1 ring-pink-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('لایک‌ها', 'Likes')}
            >
              <Heart className="w-5 h-5 text-pink-400 fill-pink-500/20 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-pink-400">{formatNum(userTotalLikes)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-pink-300 transition truncate w-full">
                {window.loc('لایک‌ها', 'Likes')}
              </span>
            </button>

            {/* Views */}
            <button
              onClick={() => {
                setActiveProfileTab('activity');
                showToast(window.loc('تاریخچه بازدیدها و فعالیت‌های اخیر 👁️', 'Views & activity history 👁️'));
              }}
              className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-2xl transition group flex-1 max-w-[90px] border ${
                activeProfileTab === 'activity'
                  ? 'bg-cyan-950/80 border-cyan-500/60 shadow-md ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800'
              }`}
              title={window.loc('بازدیدها', 'Views')}
            >
              <Eye className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition shrink-0" />
              <span className="text-xs sm:text-sm font-black text-cyan-400">{formatNum(userViewsCount)}</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-300 transition truncate w-full">
                {window.loc('بازدیدها', 'Views')}
              </span>
            </button>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* SUB-NAVIGATION CONTENT TABS                */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_tab_nav" defaultLabel="Profile Content Tabs">
          <div className="flex bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 mb-1.5 items-center justify-around gap-2">
            {/* Photos Icon Tab & Add (+) Button */}
            <div className={`flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all ${
              activeProfileTab === 'photos' 
                ? 'bg-slate-800 text-pink-400 border border-slate-700/80 shadow-md' 
                : 'text-slate-500 hover:text-slate-300'
            }`}>
              <button
                onClick={() => setActiveProfileTab('photos')}
                className="flex items-center gap-1 transition active:scale-95"
                title={window.loc('عکس‌ها', 'Photos')}
              >
                <Image className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewPostType('photo');
                  setIsCreatePostModalOpen(true);
                }}
                className="p-0.5 rounded-md bg-pink-500/20 hover:bg-pink-500/40 text-pink-400 border border-pink-500/30 transition active:scale-95 flex items-center justify-center shrink-0"
                title={window.loc('گذاشتن پست عکس جدید', 'Create Photo Post')}
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Videos Icon Tab & Add (+) Button */}
            <div className={`flex items-center gap-2.5 px-5 py-2 rounded-xl transition-all ${
              activeProfileTab === 'videos' 
                ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-md' 
                : 'text-slate-500 hover:text-slate-300'
            }`}>
              <button
                onClick={() => setActiveProfileTab('videos')}
                className="flex items-center gap-1 transition active:scale-95"
                title={window.loc('فیلم‌ها', 'Videos')}
              >
                <Video className="w-7 h-7" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNewPostType('video');
                  setIsCreatePostModalOpen(true);
                }}
                className="p-0.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 transition active:scale-95 flex items-center justify-center shrink-0"
                title={window.loc('گذاشتن پست ویدیو جدید', 'Create Video Post')}
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </VisualSectionWrapper>
        {/* 2. SUB-TAB CONTENT PANELS                  */}
        {/* ========================================== */}

        {/* TAB: FOLLOWERS LIST */}
        {activeProfileTab === 'followers' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{window.loc('دنبال‌کنندگان شما', 'Your Followers')}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{formatNum(userFollowersCount)} {window.loc('فالوور واقعی', 'Real Followers')}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-500/30">
                  👥 {formatNum(userFollowersCount)}
                </span>
              </div>

              {/* Followers List Grid */}
              <div className="space-y-2.5">
                {usersList.length > 0 ? (
                  usersList.slice(0, 8).map(u => (
                    <div key={u.id || u.username} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={u.avatar || u.userAvatar || ''} alt={u.name || u.username} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                          {u.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                            <span>{u.name || u.username}</span>
                            {u.isVIP && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-black border border-amber-500/40">VIP</span>}
                          </h4>
                          <span className="text-[10px] text-slate-400">@{u.username} • {window.loc('سطح', 'Lvl')} {formatNum(u.level || 15)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`${window.loc('درخواست دنبال‌کردن متقابل ارسال شد به', 'Follow request sent to')} @${u.username}`)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow transition active:scale-95 flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{window.loc('فالو متقابل', 'Follow Back')}</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs font-medium">
                    {window.loc('هنوز دنبال‌کننده‌ای ثبت نشده است.', 'No followers yet.')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: FOLLOWING LIST */}
        {activeProfileTab === 'following' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{window.loc('افراد دنبال‌شده توسط شما', 'Users You Follow')}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{formatNum(userFollowingCount)} {window.loc('استریمر و کاربر', 'Streamers & Users')}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/30">
                  🤝 {formatNum(userFollowingCount)}
                </span>
              </div>

              {/* Following List Grid */}
              <div className="space-y-2.5">
                {[
                  { id: 'fg1', username: 'Rayan_Super_Admin', name: 'Rayan Admin', avatar: '', isLive: true, role: 'Super Admin', level: 99 },
                  { id: 'fg2', username: 'Mina_Music', name: 'Mina Music Host', avatar: '', isLive: true, role: 'Top Streamer', level: 42 },
                  { id: 'fg3', username: 'Darius_Game', name: 'Darius Gamer', avatar: '', isLive: false, role: 'PRO Gamer', level: 28 },
                  { id: 'fg4', username: 'Zeinab_Art', name: 'Zeinab Digital Art', avatar: '', isLive: false, role: 'Creator', level: 35 }
                ].map(u => (
                  <div key={u.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                        {u.isLive && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-rose-600 text-white px-1 rounded-full border border-slate-950 animate-pulse">LIVE</span>}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                          <span>{u.name}</span>
                          <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-black border border-blue-500/40">{u.role}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400">@{u.username} • {window.loc('سطح', 'Lvl')} {formatNum(u.level)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {u.isLive && (
                        <button
                          onClick={() => showToast(`${window.loc('ورود به لایک/استریم زنده', 'Joining live stream of')} @${u.username}`)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-[10px] border border-rose-500/40 transition flex items-center gap-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>{window.loc('تلاش لایو', 'Watch')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => showToast(`${window.loc('لغو دنبال‌کردن', 'Unfollowed')} @${u.username}`)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-800 transition"
                      >
                        {window.loc('دنبال‌شده', 'Following')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: LIKES FEED */}
        {activeProfileTab === 'likes' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                    <Heart className="w-5 h-5 fill-pink-500/30" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{window.loc('پست‌ها و فعالیت‌های پسندیده‌شده', 'Liked Content & Heart History')}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{formatNum(userTotalLikes)} {window.loc('لایک ثبت‌شده', 'Total Likes')}</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-pink-400 bg-pink-950/80 px-2.5 py-1 rounded-full border border-pink-500/30">
                  ❤️ {formatNum(userTotalLikes)}
                </span>
              </div>

              {/* Liked Posts Grid */}
              <div className="space-y-3">
                {profilePosts.map(post => (
                  <div key={`liked-${post.id}`} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-pink-500/30 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <h4 className="font-bold text-white text-xs">{post.author}</h4>
                          <span className="text-[9.5px] text-slate-400">@{post.username} • {post.time}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-pink-400 flex items-center gap-1 bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-500/30">
                        <Heart className="w-3 h-3 fill-pink-400" />
                        {formatNum(post.likes)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed dir-rtl">{post.content}</p>
                    {post.image && (
                      <div className="rounded-xl overflow-hidden aspect-video border border-slate-800 max-h-40">
                        <img src={post.image} alt="Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        
        {/* ========================================== */}
        {/* SUB-TAB CONTENT PANELS                  */}
        {/* ========================================== */}
{/* TAB 1: POSTS FEED */}
        { (activeProfileTab === 'photos' || activeProfileTab === 'videos') && (
          <div className="space-y-4 animate-fadeIn">
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
{(() => {
                    try {
                      const parsed = JSON.parse(userInterests);
                      if (Array.isArray(parsed)) {
                        return parsed.map(id => {
                          const item = fullInterestsList.find(i => i.id === id);
                          if (!item) return null;
                          return (
                            <span key={id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-bold">
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </span>
                          );
                        });
                      }
                    } catch(e) {}
                    return userInterests.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold">
                        #{tag.trim()}
                      </span>
                    ));
                  })()}
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


      </div>

      {/* ========================================== */}
      {/* 3. EDIT PROFILE MODAL                      */}
      {/* ========================================== */}
      

{/* DEDICATED ADMIN CARD FOR ADMIN USERS       */}
        {/* ========================================== */}
        {isAdminUser && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border border-rose-500/50 shadow-xl space-y-2 animate-fadeIn">
            {/* Top Action Row: Entry Button Only */}
            <div className="flex items-center justify-between gap-2 pb-1 border-b border-rose-500/30">
              <button
                onClick={() => setIsAdminPanelOpen && setIsAdminPanelOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Shield className="w-4 h-4" />
                <span>{window.loc('ورود به پنل مدیریت', 'Enter Admin Panel')}</span>
              </button>
            </div>

            {/* 4 Compact Interactive Clickable Stats Cards */}
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  if (setAdminActiveTab) setAdminActiveTab('users');
                  if (setIsAdminPanelOpen) setIsAdminPanelOpen(true);
                  showToast(window.loc('مدیریت و آمار کامل کاربران 👥', 'Full User Management & Stats 👥'));
                }}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-cyan-400 text-center flex flex-col justify-center items-center min-w-0 cursor-pointer transition active:scale-95 group shadow-sm"
              >
                <span className="block text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition">
                  {formatNum((usersList || []).length)}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-200 truncate w-full flex items-center justify-center gap-0.5">
                  <Users className="w-2.5 h-2.5 text-cyan-400 inline" />
                  {window.loc('کل کاربران', 'Total Users')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setAdminActiveTab) setAdminActiveTab('verification');
                  if (setIsAdminPanelOpen) setIsAdminPanelOpen(true);
                  showToast(window.loc('بررسی مدارک و درخواست‌های احراز هویت 📑', 'Identity Verification & Pending Documents 📑'));
                }}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-amber-400 text-center flex flex-col justify-center items-center min-w-0 cursor-pointer transition active:scale-95 group shadow-sm"
              >
                <span className="block text-sm sm:text-base font-black text-amber-400 group-hover:scale-110 transition">
                  {formatNum((usersList || []).filter(u => u.isPendingAuth || u.status === 'pending' || u.kycStatus === 'pending').length)}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-200 truncate w-full flex items-center justify-center gap-0.5">
                  <ShieldAlert className="w-2.5 h-2.5 text-amber-400 inline" />
                  {window.loc('احراز معلق', 'Pending Auth')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setAdminActiveTab) setAdminActiveTab('verification');
                  if (setIsAdminPanelOpen) setIsAdminPanelOpen(true);
                  showToast(window.loc('مدیریت و آمار مجری‌ها و استریمرها 🎙️', 'Streamers & Broadcaster Management 🎙️'));
                }}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-cyan-400 text-center flex flex-col justify-center items-center min-w-0 cursor-pointer transition active:scale-95 group shadow-sm"
              >
                <span className="block text-sm sm:text-base font-black text-cyan-400 group-hover:scale-110 transition">
                  {formatNum((usersList || []).filter(u => u.isStreamer || u.isBroadcaster || u.role === 'streamer').length)}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-200 truncate w-full flex items-center justify-center gap-0.5">
                  <Radio className="w-2.5 h-2.5 text-cyan-400 inline" />
                  {window.loc('استریمرها', 'Streamers')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (setAdminActiveTab) setAdminActiveTab('reports');
                  if (setIsAdminPanelOpen) setIsAdminPanelOpen(true);
                  showToast(window.loc('مرکز بررسی گزارش‌های تخلف 🚨', 'Violation Reports Center 🚨'));
                }}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-rose-500/30 hover:border-rose-400 text-center flex flex-col justify-center items-center min-w-0 cursor-pointer transition active:scale-95 group shadow-sm"
              >
                <span className="block text-sm sm:text-base font-black text-rose-400 group-hover:scale-110 transition">
                  {formatNum((adminReportsList || []).length)}
                </span>
                <span className="text-[9px] text-slate-400 group-hover:text-slate-200 truncate w-full flex items-center justify-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 text-rose-400 inline" />
                  {window.loc('گزارش‌ها', 'Reports')}
                </span>
              </button>
            </div>

            {/* Visual Editor / Audit Log Quick Actions */}
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => setIsEditMode && setIsEditMode(!isEditMode)}
                className="flex-1 py-2 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditMode ? window.loc('خروج از ویرایش بصری', 'Exit Visual Edit') : window.loc('ویرایش بصری UI', 'Visual UI Editor')}</span>
              </button>
              <button
                onClick={() => {
                  addAdminAuditLog(window.loc('بازبینی سریع کاربران از پروفایل انجام شد', 'Quick review of user profiles was done'));
                  showToast(window.loc('بررسی امنیتی کامل اجرا شد ✅', 'A complete security check has been implemented'));
                }}
                className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1 transition"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{window.loc('ثبت لاگ نظارت', 'Record Audit Log')}</span>
              </button>
            </div>
          </div>
        )}
        {/* ========================================== */}
                

{/* ACTION GRID                                */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_actions_grid" defaultLabel="Profile Actions Grid">
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mb-1.5">
            <button onClick={() => setIsEditModalOpen(true)} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Edit3 className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('ویرایش', 'Edit')}</span>
            </button>
            <button onClick={() => { if(props.setActiveTab) props.setActiveTab('wallet'); if(props.setWalletSubTab) props.setWalletSubTab('buy'); }} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
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
            <button onClick={() => setActiveProfileTab('likes')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Heart className="w-5 h-5 text-rose-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('علاقه‌مندی', 'Favorites')}</span>
            </button>
            <button onClick={() => setActiveProfileTab('followers')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Users className="w-5 h-5 text-indigo-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('فالوورها', 'Followers')}</span>
            </button>
            
            <button onClick={() => setActiveProfileTab('following')} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('فالووینگ', 'Following')}</span>
            </button>
            <button onClick={() => { if(props.setIsSettingsModalOpen) props.setIsSettingsModalOpen(true); }} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <Settings className="w-5 h-5 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('تنظیمات', 'Settings')}</span>
            </button>
            <button onClick={() => props.setIsSupportModalOpen && props.setIsSupportModalOpen(true)} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition shadow-sm">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] text-slate-400 font-bold">{window.loc('پشتیبانی', 'Support')}</span>
            </button>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* MODALS                                    */}
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
                        '',
                        '',
                        '',
                        '',
                        ''
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
            // MOCK removed, fetching from DB (handled upstream or later)
            if (stored) {
              setUserInterests(stored);
              safeStorage.setItem("vlive_profile_interests", stored);
            }
          }
        }}
        userId={getUserId()}
        showToast={typeof showToast !== 'undefined' ? showToast : undefined}
      />
    
      {/* CREATE POST MODAL */}
      
{isCreatePostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {newPostType === 'video' ? (
                  <Video className="w-5 h-5 text-cyan-400" />
                ) : (
                  <Image className="w-5 h-5 text-pink-400" />
                )}
                <h3 className="font-black text-white text-sm">
                  {newPostType === 'video' 
                    ? window.loc('ارسال ویدیوی جدید', 'New Video Post')
                    : window.loc('ارسال عکس یا پست جدید', 'New Photo Post')}
                </h3>
              </div>
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Info Row */}
            <div className="flex items-center gap-3">
              <img
                src={userAvatar || authAvatar || PRESET_AVATARS[0]}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border border-pink-500/40"
              />
              <div>
                <h4 className="font-bold text-white text-xs">{userName || authFullName || 'User'}</h4>
                <span className="text-[10px] text-slate-400">@{currentUsername || authUsername || 'user'}</span>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder={window.loc('امروز چه خبر؟ متن خود را بنویسید...', 'Share a moment or thoughts...')}
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-pink-500 resize-none dir-rtl"
            />

            {/* Direct Gallery Upload (Photos & Videos) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span>{window.loc('انتخاب عکس یا ویدیو از گالری گوشی:', 'Select Photo or Video from Phone Gallery:')}</span>
                {newPostImage && (
                  <span className="text-[10px] text-pink-400 font-normal">
                    {newPostType === 'video' ? '📹 ' + window.loc('ویدیو انتخاب شد', 'Video selected') : '🖼️ ' + window.loc('عکس انتخاب شد', 'Photo selected')}
                  </span>
                )}
              </div>

              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-pink-500/40 hover:border-pink-500 bg-slate-950/80 hover:bg-slate-950 rounded-2xl cursor-pointer transition group text-center">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition mb-1.5">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-200">
                  {window.loc('انتخاب فایل از گالری گوشی 📱', 'Select File from Gallery 📱')}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {window.loc('پشتیبانی کامل از تصاویر و ویدیوها (JPG, PNG, MP4, MOV)', 'Full support for photos & videos (JPG, PNG, MP4, MOV)')}
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const isVid = file.type.startsWith('video');
                    setNewPostType(isVid ? 'video' : 'photo');

                    try {
                      if (!isVid && typeof compressImageFile === 'function') {
                        const compressed = await compressImageFile(file, 1080, 1080, 0.85);
                        setNewPostImage(compressed);
                      } else {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setNewPostImage(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                      showToast(window.loc(isVid ? 'ویدیو با موفقیت بارگذاری شد 📹' : 'تصویر با موفقیت بارگذاری شد 📸', isVid ? 'Video uploaded successfully 📹' : 'Photo uploaded successfully 📸'));
                    } catch (err) {
                      showToast(window.loc('خطا در انتخاب فایل از گالری', 'Error selecting file from gallery'));
                    }
                  }}
                />
              </label>

              {/* Preview Selected Media */}
              {newPostImage && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-pink-500/40 max-h-52 flex items-center justify-center shadow-inner">
                  {newPostType === 'video' || newPostImage.startsWith('data:video') ? (
                    <video src={newPostImage} controls className="w-full max-h-52 object-cover rounded-2xl" />
                  ) : (
                    <img src={newPostImage} alt="Gallery preview" className="w-full max-h-52 object-cover rounded-2xl" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setNewPostImage('');
                      setNewPostType('photo');
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/90 text-rose-400 hover:text-white border border-rose-500/50 shadow-md transition"
                    title={window.loc('حذف رسانه', 'Remove media')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsCreatePostModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                {window.loc('انصراف', 'Cancel')}
              </button>
              <button
                onClick={() => {
                  handleAddPost();
                  setIsCreatePostModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{window.loc('انتشار پست', 'Publish')}</span>
              </button>
            </div>
          </div>
        </div>
      )}


        
  </>
      )}
    </>
);
}

