import { useVisualUiEditor } from '../../context/VisualUiEditorContext';
import React, { useState, useEffect } from 'react';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { safeStorage } from '../../utils/safeStorage';
import { getUserId, apiProfile, apiSocial, calculateAge } from '../../services/api';
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
    currentUser,
    userRole,
    userGender = 'male',
    setUserGender = (() => {}),
    setIsBecomeStreamerModalOpen = (() => {}),
    setIsKycModalOpen = (() => {}),
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
    isVerified = false,
    setIsAdminPanelOpen,
    setAdminActiveTab,
    setIsStreamerCenterOpen,
    setIsHostLiveOpen = (() => {}),
    setIsLiveStudioOpen = (() => {}),
    authAvatar = '', authFullName = '', authCity = 'Tehran', userRank = 'VIP Streamer',
    authBio = '', dailyStreak = 5,
    usersList = [], setUsersList = (() => {}),
    adminReportsList = [],
    addAdminAuditLog = (() => {})
  } = props;

  const userGenderVal = String(userGender || currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
  const isFemaleUser = Boolean(
    userGenderVal === 'female' ||
    userGenderVal === 'خانم' ||
    userGenderVal === 'زن' ||
    userGenderVal === 'f'
  );

  const isUserAdmin = Boolean(
    isUserRayan ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'ADMIN' ||
    currentUser?.user_type === 'SUPER_ADMIN' ||
    String(currentUser?.telegram_id || '').trim() === '8933698119' ||
    String(currentUsername || authUsername || userName || '').toLowerCase() === 'rayan' ||
    String(currentUser?.username || '').toLowerCase() === 'rayan'
  );

  const isManagementApproved = Boolean(
    isUserAdmin ||
    
    userRole === 'streamer' ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'streamer' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer ||
    currentUser?.is_streamer ||
    currentUser?.isHost
  );

  // STRICT RULE: Both female gender AND management approval required for normal users. Admin is unrestricted.
  const isStreamerUser = Boolean(isUserAdmin || (isFemaleUser && isManagementApproved));
  const isFemaleApprovedStreamer = isStreamerUser;

  // if (activeTab !== 'profile') return null;

  const { isSuperAdmin, isEditMode, setIsEditMode } = useVisualUiEditor();

  // --- PERSISTENT PROFILE EDIT STATES ---
  const [coverPhoto, setCoverPhoto] = useState(() => {
    return safeStorage.getItem('vlive_profile_cover') || '';
  });
  const [userCity, setUserCity] = useState(() => {
    return safeStorage.getItem('vlive_profile_city') || authCity || '';
  });
  const [userBirthDate, setUserBirthDate] = useState(() => {
    return safeStorage.getItem('vlive_profile_birthdate') || '';
  });
  const [userAge, setUserAge] = useState(() => {
    const savedBirth = safeStorage.getItem('vlive_profile_birthdate');
    if (savedBirth) {
      const calc = calculateAge(savedBirth);
      if (calc !== null) return String(calc);
    }
    return safeStorage.getItem('vlive_profile_age') || '';
  });
  const [userOccupation, setUserOccupation] = useState(() => {
    return safeStorage.getItem('vlive_profile_occupation') || '';
  });
  const [userEducation, setUserEducation] = useState(() => {
    return safeStorage.getItem('vlive_profile_education') || '';
  });
  const [userRelationship, setUserRelationship] = useState(() => {
    return safeStorage.getItem('vlive_profile_relationship') || 'Single';
  });
  const [userInterests, setUserInterests] = useState(() => {
    return safeStorage.getItem('vlive_profile_interests') || '';
  });
  const [userLanguages, setUserLanguages] = useState(() => {
    return safeStorage.getItem('vlive_profile_languages') || 'Persian, English';
  });
  const [instagramLink, setInstagramLink] = useState(() => {
    return safeStorage.getItem('vlive_profile_ig') || '';
  });
  const [telegramLink, setTelegramLink] = useState(() => {
    return safeStorage.getItem('vlive_profile_tg') || '';
  });

  // Sync real profile data from Supabase DB on mount & listen to updates
  useEffect(() => {
    let isMounted = true;
    
    const refreshFromSupabase = () => {
      apiProfile.getProfile().then(profile => {
        if (!isMounted || !profile) return;
        
        const birthVal = profile.birth_date || profile.birthdate || profile.birthday;
        let effectiveAge = '';
        if (birthVal) {
          setUserBirthDate(birthVal);
          safeStorage.setItem('vlive_profile_birthdate', birthVal);
          const calc = calculateAge(birthVal);
          if (calc !== null) {
            effectiveAge = String(calc);
          }
        }

        if (!effectiveAge && profile.age !== undefined && profile.age !== null && profile.age !== '') {
          effectiveAge = String(profile.age);
        }

        if (effectiveAge) {
          setUserAge(effectiveAge);
          safeStorage.setItem('vlive_profile_age', effectiveAge);
          setEditForm(prev => ({ ...prev, age: effectiveAge, birth_date: birthVal || prev.birth_date }));
        }

        if (profile.name) {
          setUserName(profile.name);
          safeStorage.setItem('vlive_user_name', profile.name);
        }
        if (profile.avatar || profile.avatar_url) {
          const av = profile.avatar || profile.avatar_url;
          setUserAvatar(av);
          safeStorage.setItem('vlive_user_avatar', av);
        }
        if (profile.gender) {
          if (typeof setUserGender === 'function') setUserGender(profile.gender);
          safeStorage.setItem('vlive_user_gender', profile.gender);
        }
        if (profile.city) {
          setUserCity(profile.city);
          safeStorage.setItem('vlive_profile_city', profile.city);
          setEditForm(prev => ({ ...prev, city: profile.city }));
        }
        if (profile.bio) {
          setUserBio(profile.bio);
          setEditForm(prev => ({ ...prev, bio: profile.bio }));
        }
        if (profile.occupation) {
          setUserOccupation(profile.occupation);
          safeStorage.setItem('vlive_profile_occupation', profile.occupation);
          setEditForm(prev => ({ ...prev, occupation: profile.occupation }));
        }
        if (profile.education) {
          setUserEducation(profile.education);
          safeStorage.setItem('vlive_profile_education', profile.education);
          setEditForm(prev => ({ ...prev, education: profile.education }));
        }
        if (profile.relationship) {
          setUserRelationship(profile.relationship);
          safeStorage.setItem('vlive_profile_relationship', profile.relationship);
          setEditForm(prev => ({ ...prev, relationship: profile.relationship }));
        }
        if (profile.interests) {
          setUserInterests(profile.interests);
          safeStorage.setItem('vlive_profile_interests', profile.interests);
          setEditForm(prev => ({ ...prev, interests: profile.interests }));
        }
        if (profile.languages) {
          setUserLanguages(profile.languages);
          safeStorage.setItem('vlive_profile_languages', profile.languages);
          setEditForm(prev => ({ ...prev, languages: profile.languages }));
        }
        if (profile.instagram) {
          setInstagramLink(profile.instagram);
          safeStorage.setItem('vlive_profile_ig', profile.instagram);
        }
        if (profile.telegram) {
          setTelegramLink(profile.telegram);
          safeStorage.setItem('vlive_profile_tg', profile.telegram);
        }
      }).catch(e => console.warn('ProfileTab getProfile sync error:', e));
    };

    refreshFromSupabase();

    const handleProfileUpdate = (e) => {
      const detail = e?.detail;
      if (!detail || !isMounted) return;
      if (detail.name) {
        setUserName(detail.name);
        safeStorage.setItem('vlive_user_name', detail.name);
      }
      if (detail.avatar || detail.avatar_url) {
        const av = detail.avatar || detail.avatar_url;
        setUserAvatar(av);
        safeStorage.setItem('vlive_user_avatar', av);
      }
      if (detail.bio !== undefined) {
        setUserBio(detail.bio);
        safeStorage.setItem('vlive_user_bio', detail.bio);
      }
      if (detail.gender) {
        if (typeof setUserGender === 'function') setUserGender(detail.gender);
        safeStorage.setItem('vlive_user_gender', detail.gender);
      }
      if (detail.city || detail.country) {
        const loc = detail.city || detail.country;
        setUserCity(loc);
        safeStorage.setItem('vlive_profile_city', loc);
      }
      if (detail.age !== undefined && detail.age !== null && detail.age !== '') {
        const ageStr = String(detail.age);
        setUserAge(ageStr);
        safeStorage.setItem('vlive_profile_age', ageStr);
      }
      if (detail.birth_date) {
        setUserBirthDate(detail.birth_date);
        safeStorage.setItem('vlive_profile_birthdate', detail.birth_date);
      }
      if (detail.interests) {
        setUserInterests(detail.interests);
        safeStorage.setItem('vlive_profile_interests', detail.interests);
      }
      if (detail.occupation) {
        setUserOccupation(detail.occupation);
        safeStorage.setItem('vlive_profile_occupation', detail.occupation);
      }
      if (detail.education) {
        setUserEducation(detail.education);
        safeStorage.setItem('vlive_profile_education', detail.education);
      }
      if (detail.relationship) {
        setUserRelationship(detail.relationship);
        safeStorage.setItem('vlive_profile_relationship', detail.relationship);
      }
      if (detail.languages) {
        setUserLanguages(detail.languages);
        safeStorage.setItem('vlive_profile_languages', detail.languages);
      }
      if (detail.instagram) {
        setInstagramLink(detail.instagram);
        safeStorage.setItem('vlive_profile_ig', detail.instagram);
      }
      if (detail.telegram) {
        setTelegramLink(detail.telegram);
        safeStorage.setItem('vlive_profile_tg', detail.telegram);
      }
      if (detail.cover) {
        setCoverPhoto(detail.cover);
        safeStorage.setItem('vlive_profile_cover', detail.cover);
      }

      setEditForm(prev => ({
        ...prev,
        name: detail.name || prev.name,
        bio: detail.bio !== undefined ? detail.bio : prev.bio,
        avatar: detail.avatar || detail.avatar_url || prev.avatar,
        gender: detail.gender || prev.gender,
        city: detail.city || detail.country || prev.city,
        age: detail.age !== undefined && detail.age !== null ? String(detail.age) : prev.age,
        birth_date: detail.birth_date || prev.birth_date,
        interests: detail.interests || prev.interests,
        occupation: detail.occupation || prev.occupation,
        education: detail.education || prev.education,
        relationship: detail.relationship || prev.relationship,
        languages: detail.languages || prev.languages,
        instagram: detail.instagram || prev.instagram,
        telegram: detail.telegram || prev.telegram,
        cover: detail.cover || prev.cover
      }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('vlive_profile_updated', handleProfileUpdate);
    }

    return () => { 
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('vlive_profile_updated', handleProfileUpdate);
      }
    };
  }, []);

  // --- EDIT PROFILE MODAL STATE ---
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [fullInterestsList, setFullInterestsList] = useState([]);

  useEffect(() => {
    interestService.getGlobalInterests().then(res => setFullInterestsList(res));
  }, []);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSeparateModal, setActiveSeparateModal] = useState(null);
  const [editForm, setEditForm] = useState({
    name: userName || authFullName || safeStorage.getItem('vlive_user_name') || 'User',
    bio: userBio || authBio || safeStorage.getItem('vlive_user_bio') || '',
    gender: userGender || currentUser?.gender || safeStorage.getItem('vlive_user_gender') || 'male',
    city: userCity || safeStorage.getItem('vlive_profile_city') || '',
    birth_date: userBirthDate || safeStorage.getItem('vlive_profile_birthdate') || '',
    age: userAge || safeStorage.getItem('vlive_profile_age') || '',
    occupation: userOccupation || safeStorage.getItem('vlive_profile_occupation') || '',
    education: userEducation || safeStorage.getItem('vlive_profile_education') || '',
    relationship: userRelationship || safeStorage.getItem('vlive_profile_relationship') || 'Single',
    interests: userInterests || safeStorage.getItem('vlive_profile_interests') || '',
    languages: userLanguages || safeStorage.getItem('vlive_profile_languages') || 'فارسی (Persian)',
    instagram: instagramLink || safeStorage.getItem('vlive_profile_ig') || '',
    telegram: telegramLink || safeStorage.getItem('vlive_profile_tg') || '',
    avatar: userAvatar || authAvatar || safeStorage.getItem('vlive_user_avatar') || PRESET_AVATARS[0],
    cover: coverPhoto || safeStorage.getItem('vlive_profile_cover') || ''
  });

  useEffect(() => {
    if (isEditModalOpen) {
      setEditForm(prev => ({
        ...prev,
        name: userName || safeStorage.getItem('vlive_user_name') || prev.name,
        bio: userBio || safeStorage.getItem('vlive_user_bio') || prev.bio,
        gender: userGender || currentUser?.gender || safeStorage.getItem('vlive_user_gender') || 'male',
        city: userCity || safeStorage.getItem('vlive_profile_city') || prev.city,
        birth_date: userBirthDate || safeStorage.getItem('vlive_profile_birthdate') || prev.birth_date,
        age: userAge || safeStorage.getItem('vlive_profile_age') || prev.age,
        occupation: userOccupation || safeStorage.getItem('vlive_profile_occupation') || prev.occupation,
        education: userEducation || safeStorage.getItem('vlive_profile_education') || prev.education,
        relationship: userRelationship || safeStorage.getItem('vlive_profile_relationship') || prev.relationship,
        interests: userInterests || safeStorage.getItem('vlive_profile_interests') || prev.interests,
        languages: userLanguages || safeStorage.getItem('vlive_profile_languages') || prev.languages,
        instagram: instagramLink || safeStorage.getItem('vlive_profile_ig') || prev.instagram,
        telegram: telegramLink || safeStorage.getItem('vlive_profile_tg') || prev.telegram,
        avatar: userAvatar || safeStorage.getItem('vlive_user_avatar') || prev.avatar,
        cover: coverPhoto || safeStorage.getItem('vlive_profile_cover') || prev.cover
      }));
    }
  }, [isEditModalOpen, userName, userBio, userGender, userCity, userBirthDate, userAge, userOccupation, userEducation, userRelationship, userInterests, userLanguages, instagramLink, telegramLink, userAvatar, coverPhoto]);

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
  const [followingList, setFollowingList] = useState(() => apiProfile.getFollowingList());
  const [followersList, setFollowersList] = useState(() => apiProfile.getFollowersList());
  const [profileVisitors, setProfileVisitors] = useState(() => apiProfile.getProfileVisitors(currentUsername || 'me'));
  const [userFollowersCount, setUserFollowersCount] = useState(() => {
    return Number(safeStorage.getItem('vlive_user_followers') || 0);
  });
  const [userViewsCount, setUserViewsCount] = useState(() => {
    return Number(safeStorage.getItem('vlive_user_views') || 0);
  });
  const [extraLikes, setExtraLikes] = useState(() => {
    return Number(safeStorage.getItem('vlive_user_extra_likes') || 0);
  });

  const userFollowingCount = followingList.length;

  useEffect(() => {
    const syncFollow = () => {
      setFollowingList(apiProfile.getFollowingList());
      setFollowersList(apiProfile.getFollowersList());
    };
    window.addEventListener('vlive_follow_changed', syncFollow);
    return () => window.removeEventListener('vlive_follow_changed', syncFollow);
  }, []);

  // Load real profile visitors and persistent views count without counting self visits
  useEffect(() => {
    const targetKey = currentUsername || 'me';
    setProfileVisitors(apiProfile.getProfileVisitors(targetKey));
    
    // Sync views count from Supabase/safeStorage
    apiProfile.getProfile().then(p => {
      if (p && p.views_count !== undefined) {
        setUserViewsCount(Number(p.views_count) || 0);
        safeStorage.setItem('vlive_user_views', String(p.views_count || 0));
      }
    }).catch(() => {});
  }, [currentUsername]);

  // --- LOCAL POSTS STATE WITH REAL LIKES & COMMENTS ---
  const [profilePosts, setProfilePosts] = useState(() => {
    try {
      const stored = safeStorage.getItem(`vlive_user_posts_${currentUsername || 'me'}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      safeStorage.setItem(`vlive_user_posts_${currentUsername || 'me'}`, JSON.stringify(profilePosts));
    } catch {
      // suppressed
    }
  }, [profilePosts, currentUsername]);

  // Real total likes calculation across posts + persistent likes
  const userTotalLikes = profilePosts.reduce((sum, post) => sum + (post.likes || 0), 0) + extraLikes;

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

  // Save changes to safeStorage and sync to database immediately
  const handleSaveProfile = async () => {
    try {
      if (typeof setUserName === 'function') setUserName(editForm.name);
      if (typeof setUserBio === 'function') setUserBio(editForm.bio);
      if (typeof setUserAvatar === 'function') setUserAvatar(editForm.avatar);
      if (typeof setCoverPhoto === 'function') setCoverPhoto(editForm.cover);
      if (typeof setUserCity === 'function') setUserCity(editForm.city);
      if (typeof setUserBirthDate === 'function') setUserBirthDate(editForm.birth_date || '');
      if (typeof setUserAge === 'function') setUserAge(editForm.age);
      if (typeof setUserOccupation === 'function') setUserOccupation(editForm.occupation);
      if (typeof setUserEducation === 'function') setUserEducation(editForm.education);
      if (typeof setUserRelationship === 'function') setUserRelationship(editForm.relationship);
      if (typeof setUserInterests === 'function') setUserInterests(editForm.interests);
      if (typeof setUserLanguages === 'function') setUserLanguages(editForm.languages);
      if (typeof setInstagramLink === 'function') setInstagramLink(editForm.instagram);
      if (typeof setTelegramLink === 'function') setTelegramLink(editForm.telegram);

      safeStorage.setItem('vlive_user_name', editForm.name || '');
      safeStorage.setItem('vlive_user_bio', editForm.bio || '');
      safeStorage.setItem('vlive_user_avatar', editForm.avatar || '');
      safeStorage.setItem('vlive_profile_cover', editForm.cover || '');
      safeStorage.setItem('vlive_profile_city', editForm.city || '');
      safeStorage.setItem('vlive_profile_birthdate', editForm.birth_date || '');
      safeStorage.setItem('vlive_profile_age', editForm.age || '');
      safeStorage.setItem('vlive_profile_occupation', editForm.occupation || '');
      safeStorage.setItem('vlive_profile_education', editForm.education || '');
      safeStorage.setItem('vlive_profile_relationship', editForm.relationship || 'Single');
      safeStorage.setItem('vlive_profile_interests', editForm.interests || '');
      safeStorage.setItem('vlive_profile_languages', editForm.languages || '');
      safeStorage.setItem('vlive_profile_ig', editForm.instagram || '');
      safeStorage.setItem('vlive_profile_tg', editForm.telegram || '');
      safeStorage.setItem('vlive_user_gender', editForm.gender || 'male');

      const prevGender = userGender;
      if (typeof setUserGender === 'function') setUserGender(editForm.gender);

      // If changing to female, trigger streamer verification modal
      if (editForm.gender === 'female' && prevGender !== 'female') {
        if (typeof setIsBecomeStreamerModalOpen === 'function') {
          setIsBecomeStreamerModalOpen(true);
        }
      } else if (editForm.gender === 'male' && prevGender !== 'male') {
        showToast(window.loc('⚠️ با تغییر جنسیت به آقا، قابلیّت و دسترسی استریمری شما لغو شد (استریمر = خانم + تایید مدیریت).', 'By changing gender to male, streamer access is revoked (Streamer = Female + Admin approval).'));
      }

      // Immediate DB sync via apiProfile.syncProfileState
      await apiProfile.syncProfileState({
        name: editForm.name,
        bio: editForm.bio,
        avatar: editForm.avatar,
        gender: editForm.gender,
        city: editForm.city,
        birth_date: editForm.birth_date || undefined,
        age: Number(editForm.age) || undefined,
        interests: editForm.interests,
        occupation: editForm.occupation,
        education: editForm.education,
        relationship: editForm.relationship,
        languages: editForm.languages,
        instagram: editForm.instagram,
        telegram: editForm.telegram,
        is_onboarded: true
      });

      setIsEditModalOpen(false);
      showToast(window.loc('پروفایل شما با موفقیت به‌روزرسانی و ذخیره شد ✨', 'Profile updated & saved successfully ✨'));
    } catch (e) {
      console.warn('ProfileTab backend sync note:', e);
      setIsEditModalOpen(false);
      showToast(window.loc('پروفایل شما ذخیره شد ✨', 'Profile saved successfully ✨'));
    }
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
      author: userName || props.currentUser?.name || 'User',
      username: currentUsername || props.currentUser?.username || 'user',
      avatar: userAvatar || props.currentUser?.avatar || PRESET_AVATARS[0],
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
  const effectiveUserRole = userRole || props.currentUser?.role || 'user';
  const isAdminUser = isUserAnAdmin(effectiveUserRole, detectedTgId);

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
                  <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative group cursor-pointer"
                    title={window.loc('کلیک برای ویرایش پروفایل', 'Click to edit profile')}
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-amber-400 shadow-[0_0_35px_rgba(236,72,153,0.5)] overflow-hidden">
                      {(userAvatar || authAvatar) ? (
                        <img
                          src={userAvatar || authAvatar}
                          alt={userName}
                          className="w-full h-full object-cover rounded-full bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                          <User className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400" />
                        </div>
                      )}
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

                  {/* User Active Stories */}
                  {(props.userStoriesList || []).map((story, i) => (
                    <div key={story.id || i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 group-hover:scale-105 transition shadow-md overflow-hidden">
                        {story.media_url ? (
                          <img src={story.media_url} alt={story.title || 'Story'} className="w-full h-full object-cover rounded-full bg-slate-950" />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-full text-pink-400 font-bold text-xs">
                            LIVE
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate">{story.title || story.caption || 'Story'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* SEPARATE PAGES & FEATURES HUB (صفحات مجزا) */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_separate_pages_hub" defaultLabel="Separate Pages Hub">
          <div className="p-4 bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 px-1">
              <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{window.loc('صفحات و بخش‌های مجزای پروفایل', 'Dedicated Profile Pages')}</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                {window.loc('۶ صفحه مجزا', '6 Standalone Pages')}
              </span>
            </div>

            {/* 6 Grid Tiles for Dedicated Pages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* 1. Followers Dedicated Page */}
              <button
                onClick={() => {
                  setActiveSeparateModal('followers');
                  showToast(window.loc('ورود به صفحه مجزای فالوورها 👥', 'Opened Followers Page 👥'));
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/30 hover:border-indigo-500/80 transition-all duration-300 flex flex-col justify-between items-start gap-2 shadow-sm hover:shadow-indigo-500/20 group text-right cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 group-hover:scale-110 transition shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-indigo-400 font-mono bg-indigo-950/90 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    {formatNum(followersList.length || userFollowersCount)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-indigo-300 transition">{window.loc('صفحه فالوورها', 'Followers Page')}</h4>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{window.loc('مدیریت دنبال‌کنندگان 👥', 'Manage followers 👥')}</p>
                </div>
              </button>

              {/* 2. Following Dedicated Page */}
              <button
                onClick={() => {
                  setActiveSeparateModal('following');
                  showToast(window.loc('ورود به صفحه مجزای فالووینگ 🤝', 'Opened Following Page 🤝'));
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-950 border border-blue-500/30 hover:border-blue-500/80 transition-all duration-300 flex flex-col justify-between items-start gap-2 shadow-sm hover:shadow-blue-500/20 group text-right cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 group-hover:scale-110 transition shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-blue-400 font-mono bg-blue-950/90 px-2 py-0.5 rounded-full border border-blue-500/30">
                    {formatNum(userFollowingCount)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-blue-300 transition">{window.loc('صفحه فالووینگ', 'Following Page')}</h4>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{window.loc('افراد دنبال‌شده 🤝', 'Users followed 🤝')}</p>
                </div>
              </button>

              {/* 3. Likes Dedicated Page */}
              <button
                onClick={() => {
                  setActiveSeparateModal('likes');
                  showToast(window.loc('ورود به صفحه مجزای لایک‌ها ❤️', 'Opened Likes Page ❤️'));
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-pink-950/60 to-slate-950 border border-pink-500/30 hover:border-pink-500/80 transition-all duration-300 flex flex-col justify-between items-start gap-2 shadow-sm hover:shadow-pink-500/20 group text-right cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40 group-hover:scale-110 transition shrink-0">
                    <Heart className="w-4 h-4 fill-pink-500/30" />
                  </div>
                  <span className="text-xs font-black text-pink-400 font-mono bg-pink-950/90 px-2 py-0.5 rounded-full border border-pink-500/30">
                    {formatNum(userTotalLikes)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-pink-300 transition">{window.loc('صفحه لایک‌ها', 'Likes Page')}</h4>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{window.loc('پست‌ها و لایک‌ها ❤️', 'Liked posts & heart ❤️')}</p>
                </div>
              </button>

              {/* 4. Views Dedicated Page */}
              <button
                onClick={() => {
                  setActiveSeparateModal('views');
                  showToast(window.loc('ورود به صفحه مجزای بازدیدها 👁️', 'Opened Views Page 👁️'));
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-950 border border-cyan-500/30 hover:border-cyan-500/80 transition-all duration-300 flex flex-col justify-between items-start gap-2 shadow-sm hover:shadow-cyan-500/20 group text-right cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 group-hover:scale-110 transition shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-cyan-400 font-mono bg-cyan-950/90 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    {formatNum(userViewsCount)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-cyan-300 transition">{window.loc('صفحه بازدیدها', 'Views Page')}</h4>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{window.loc('آمار بازدیدکنندگان 👁️', 'Profile visitors 👁️')}</p>
                </div>
              </button>

              {/* 5. Photos Gallery Dedicated Page */}
              <button
                onClick={() => {
                  setActiveSeparateModal('photos');
                  showToast(window.loc('ورود به صفحه مجزای گالری عکس‌ها 🖼️', 'Opened Photos Page 🖼️'));
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-950 border border-purple-500/30 hover:border-purple-500/80 transition-all duration-300 flex flex-col justify-between items-start gap-2 shadow-sm hover:shadow-purple-500/20 group text-right cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 group-hover:scale-110 transition shrink-0">
                    <Image className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-purple-400 font-mono bg-purple-950/90 px-2 py-0.5 rounded-full border border-purple-500/30">
                    {formatNum(profilePosts.filter(p => !p.video).length)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-purple-300 transition">{window.loc('گالری عکس‌ها', 'Photos Gallery')}</h4>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{window.loc('تصاویر منتشرشده 🖼️', 'Published photos 🖼️')}</p>
                </div>
              </button>

              {/* 6. Videos Gallery Dedicated Page */}
              <button
                onClick={() => {
                  setActiveSeparateModal('videos');
                  showToast(window.loc('ورود به صفحه مجزای گالری ویدیوها 📹', 'Opened Videos Page 📹'));
                }}
                className="p-3 rounded-2xl bg-gradient-to-br from-rose-950/60 to-slate-950 border border-rose-500/30 hover:border-rose-500/80 transition-all duration-300 flex flex-col justify-between items-start gap-2 shadow-sm hover:shadow-rose-500/20 group text-right cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 group-hover:scale-110 transition shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-rose-400 font-mono bg-rose-950/90 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {formatNum(profilePosts.filter(p => p.video).length)}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-white group-hover:text-rose-300 transition">{window.loc('گالری ویدیوها', 'Videos Gallery')}</h4>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">{window.loc('ویدیوهای منتشرشده 📹', 'Published videos 📹')}</p>
                </div>
              </button>

            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* MAIN PROFILE DETAILS & TIMELINE           */}
        {/* ========================================== */}
        <div className="space-y-4 animate-fadeIn">
          
          {/* About & Biography Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-black text-white text-base pb-3 border-b border-slate-800 flex items-center justify-between">
              <span>{window.loc('اطلاعات شخصی و بیوگرافی', 'Personal Details & Biography')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  <span>{window.loc('جنسیت کاربر', 'User Gender')}</span>
                </span>
                <p className="text-white font-black text-sm flex items-center gap-2">
                  <span>{userGender === 'female' ? window.loc('زن (Female) 👩', 'Female 👩') : window.loc('مرد (Male) 👨', 'Male 👨')}</span>
                  {userGender === 'female' && (
                    <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30 font-bold">
                      {window.loc('واجد شرایط استریم ✨', 'Stream Eligible ✨')}
                    </span>
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  <span>{window.loc('سن و تاریخ تولد', 'Age & Birthday')}</span>
                </span>
                <p className="text-white font-black text-sm">{userAge ? `${userAge} ${window.loc('سال', 'years old')}` : window.loc('ثبت نشده (ویرایش نمایید)', 'Not specified (Edit profile)')}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{window.loc('شهر و موقعیت', 'Location')}</span>
                </span>
                <p className="text-white font-black text-sm">{userCity || window.loc('ثبت نشده', 'Not specified')}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>{window.loc('شغل و فعالیت', 'Occupation')}</span>
                </span>
                <p className="text-white font-black text-sm">{userOccupation || window.loc('ثبت نشده', 'Not specified')}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{window.loc('تحصیلات', 'Education')}</span>
                </span>
                <p className="text-white font-black text-sm">{userEducation || window.loc('ثبت نشده', 'Not specified')}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{window.loc('وضعیت تاهل', 'Relationship Status')}</span>
                </span>
                <p className="text-white font-black text-sm">{userRelationship}</p>
              </div>
            </div>

            {/* Languages & Interests Tags */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div 
                onClick={() => setIsLanguageModalOpen(true)}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition group"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-bold text-slate-300">{window.loc('زبان‌های گفتاری:', 'Spoken Languages:')}</span>
                  <span className="text-xs font-black text-white">{userLanguages}</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {window.loc('تغییر 🌐', 'CHANGE 🌐')}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">{window.loc('علاقه‌مندی‌ها', 'Interests & Tags')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    try {
                      const parsed = JSON.parse(userInterests);
                      if (Array.isArray(parsed)) {
                        return parsed.map(id => {
                          const item = fullInterestsList.find(i => i.id === id);
                          if (!item) return null;
                          return (
                            <span key={id} className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-bold">
                              <span>{item.icon}</span>
                              <span>{item.name}</span>
                            </span>
                          );
                        });
                      }
                    } catch(e) {}
                    return userInterests.split(',').map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold">
                        #{tag.trim()}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* User Posts Timeline Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Camera className="w-5 h-5 text-pink-400" />
                <span>{window.loc('پست‌ها و محتوای منتشرشده', 'Published Posts & Timeline')}</span>
              </h3>
              <button
                onClick={() => {
                  setNewPostType('photo');
                  setIsCreatePostModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>{window.loc('ایجاد پست جدید', 'New Post')}</span>
              </button>
            </div>

            {profilePosts.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-3">
                <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">{window.loc('هنوز پستی منتشر نشده است', 'No posts published yet')}</h4>
                <p className="text-xs text-slate-400">{window.loc('اولین عکس، ویدیو یا دل‌نوشته خود را با دوستانتان به اشتراک بگذارید.', 'Share your first photo, video or thoughts with your friends.')}</p>
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-pink-500/25 active:scale-95 transition"
                >
                  {window.loc('➕ ایجاد اولین پست', '➕ Create First Post')}
                </button>
              </div>
            ) : (
              profilePosts.map(post => (
                <div key={post.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-purple-500/40" />
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

                  {post.video && (
                    <div className="rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-slate-950">
                      <video src={post.video} controls className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-xs text-slate-400">
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
              ))
            )}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* FULLSCREEN STANDALONE MODALS (صفحات مجزا)   */}
      {/* ========================================== */}
      {activeSeparateModal !== null && (
        <div className="fixed inset-0 z-[80] bg-slate-950/95 backdrop-blur-2xl flex flex-col p-4 sm:p-6 animate-fadeIn overflow-y-auto dir-rtl">
          
          {/* Top Modal Navigation Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 shrink-0 max-w-3xl mx-auto w-full">
            <button
              onClick={() => setActiveSeparateModal(null)}
              className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-2 font-bold text-xs hover:border-pink-500/50 transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4 text-pink-400 rotate-180" />
              <span>{window.loc('بازگشت به پروفایل', 'Back to Profile')}</span>
            </button>

            <div className="flex items-center gap-2">
              {activeSeparateModal === 'followers' && (
                <>
                  <Users className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black text-white">{window.loc('صفحه مجزای دنبال‌کنندگان', 'Followers Dedicated Page')}</h2>
                </>
              )}
              {activeSeparateModal === 'following' && (
                <>
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-black text-white">{window.loc('صفحه مجزای دنبال‌شوندگان', 'Following Dedicated Page')}</h2>
                </>
              )}
              {activeSeparateModal === 'likes' && (
                <>
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-500/30" />
                  <h2 className="text-base font-black text-white">{window.loc('صفحه مجزای لایک‌ها', 'Likes Dedicated Page')}</h2>
                </>
              )}
              {activeSeparateModal === 'views' && (
                <>
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-black text-white">{window.loc('صفحه مجزای بازدیدکنندگان', 'Visitors Dedicated Page')}</h2>
                </>
              )}
              {activeSeparateModal === 'photos' && (
                <>
                  <Image className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-black text-white">{window.loc('صفحه مجزای گالری عکس‌ها', 'Photos Gallery Dedicated Page')}</h2>
                </>
              )}
              {activeSeparateModal === 'videos' && (
                <>
                  <Video className="w-5 h-5 text-rose-400" />
                  <h2 className="text-base font-black text-white">{window.loc('صفحه مجزای گالری ویدیوها', 'Videos Gallery Dedicated Page')}</h2>
                </>
              )}
            </div>

            <button
              onClick={() => setActiveSeparateModal(null)}
              className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dedicated Page Content Container */}
          <div className="py-4 flex-1 overflow-y-auto max-w-3xl mx-auto w-full space-y-4">
            
            {/* 1. SEPARATE FOLLOWERS PAGE */}
            {activeSeparateModal === 'followers' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-indigo-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-white text-base">{window.loc('لیست کامل دنبال‌کنندگان شما', 'Your Complete Followers List')}</h3>
                    <p className="text-xs text-slate-400">{window.loc('کاربران و اعضایی که پروفایل شما را دنبال می‌کنند', 'Users and members following your profile')}</p>
                  </div>
                  <span className="text-xs font-black text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/40 font-mono">
                    👥 {formatNum(followersList.length || userFollowersCount)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {followersList.length > 0 ? (
                    followersList.map(u => (
                      <div key={u.id || u.username} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {(u.avatar || u.userAvatar) ? (
                              <img src={u.avatar || u.userAvatar} alt={u.name || u.username} className="w-11 h-11 rounded-full object-cover border border-slate-700" />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                            {(u.isOnline || u.online) && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{u.name || u.username}</span>
                              {u.isVIP && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-black border border-amber-500/40">VIP</span>}
                            </h4>
                            <span className="text-[10px] text-slate-400">@{u.username} • {window.loc('سطح', 'Lvl')} {formatNum(u.level || 1)}</span>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            await apiProfile.followUser(u);
                            showToast(`${window.loc('شما با موفقیت دنبال کردید:', 'You successfully followed:')} @${u.username}`);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition active:scale-95 flex items-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>{window.loc('فالو متقابل', 'Follow Back')}</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800 space-y-3">
                      <Users className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-slate-300 text-xs font-bold">{window.loc('هنوز کاربری شما را دنبال نکرده است.', 'No followers yet.')}</p>
                      <p className="text-slate-500 text-[11px]">{window.loc('با فعالیت در استریم‌ها و انتشار عکس/ویدیو، فالوور جدید جذب کنید.', 'Gain followers by hosting streams and publishing content.')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SEPARATE FOLLOWING PAGE */}
            {activeSeparateModal === 'following' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-white text-base">{window.loc('افراد دنبال‌شده توسط شما', 'Users You Follow')}</h3>
                    <p className="text-xs text-slate-400">{window.loc('استریمرها و کاربرانی که دنبال می‌کنید', 'Streamers & members you are following')}</p>
                  </div>
                  <span className="text-xs font-black text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-500/40 font-mono">
                    🤝 {formatNum(userFollowingCount)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {followingList.length > 0 ? (
                    followingList.map(u => (
                      <div key={u.id || u.username} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 transition flex items-center justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name || u.username} className="w-11 h-11 rounded-full object-cover border border-slate-700" />
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                            {u.isLive && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-rose-600 text-white px-1.5 rounded-full border border-slate-950 animate-pulse">LIVE</span>}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                              <span>{u.name || u.username}</span>
                              {u.role && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-black border border-blue-500/40">{u.role}</span>}
                            </h4>
                            <span className="text-[10px] text-slate-400">@{u.username} • {window.loc('سطح', 'Lvl')} {formatNum(u.level || 1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.isLive && (
                            <button
                              onClick={() => {
                                setActiveSeparateModal(null);
                                if (props.setActiveTab) props.setActiveTab('home');
                                showToast(`${window.loc('ورود به لایواستریم', 'Joining livestream of')} @${u.username}`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs border border-rose-500/40 transition flex items-center gap-1"
                            >
                              <Video className="w-3.5 h-3.5" />
                              <span>{window.loc('لایو', 'Live')}</span>
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              await apiProfile.unfollowUser(u.id || u.username);
                              showToast(`${window.loc('لغو دنبال‌کردن', 'Unfollowed')} @${u.username}`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/60 hover:text-red-300 text-slate-300 font-bold text-xs border border-slate-800 transition"
                          >
                            {window.loc('دنبال‌شده (لغو)', 'Following (Unfollow)')}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800 space-y-3">
                      <UserCheck className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-slate-300 text-xs font-bold">{window.loc('هنوز کاربری را دنبال نکرده‌اید.', 'You are not following anyone yet.')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. SEPARATE LIKES PAGE */}
            {activeSeparateModal === 'likes' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-pink-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-white text-base">{window.loc('آمار و لیست لایک‌ها', 'Likes & Favorites History')}</h3>
                    <p className="text-xs text-slate-400">{window.loc('پست‌ها و محتوای پسندیده‌شده توسط شما', 'Liked posts and content by you')}</p>
                  </div>
                  <span className="text-xs font-black text-pink-400 bg-pink-950 px-3 py-1 rounded-full border border-pink-500/40 font-mono">
                    ❤️ {formatNum(userTotalLikes)}
                  </span>
                </div>

                <div className="space-y-3">
                  {profilePosts.filter(p => p.liked || p.likes > 0).length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                      <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">{window.loc('هنوز پستی را لایک نکرده‌اید', 'No liked posts yet')}</p>
                    </div>
                  ) : (
                    profilePosts.filter(p => p.liked || p.likes > 0).map(post => (
                      <div key={`liked-${post.id}`} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 hover:border-pink-500/30 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {post.avatar ? (
                              <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-white text-xs">{post.author}</h4>
                              <span className="text-[9.5px] text-slate-400">@{post.username} • {post.time}</span>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              const nextLiked = !post.liked;
                              if (nextLiked) {
                                await apiSocial.likePost(post.id);
                              } else {
                                await apiSocial.unlikePost(post.id);
                              }
                              setProfilePosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: nextLiked, likes: Math.max(0, p.likes + (nextLiked ? 1 : -1)) } : p));
                            }}
                            className={`text-xs font-black flex items-center gap-1 px-3 py-1 rounded-full border transition active:scale-95 ${
                              post.liked ? 'bg-pink-600 text-white border-pink-500' : 'bg-pink-950/60 text-pink-400 border-pink-500/30 hover:bg-pink-900/60'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${post.liked ? 'fill-white' : 'fill-pink-400'}`} />
                            <span>{formatNum(post.likes)}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed dir-rtl">{post.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 4. SEPARATE VIEWS PAGE */}
            {activeSeparateModal === 'views' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-white text-base">{window.loc('آمار و بازدیدکنندگان پروفایل', 'Profile Views & Visitors')}</h3>
                    <p className="text-xs text-slate-400">{window.loc('لیست آخرین افرادی که از صفحه شما دیدن کرده‌اند', 'Recent visitors of your profile')}</p>
                  </div>
                  <span className="text-xs font-black text-cyan-400 bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/40 font-mono">
                    👁️ {formatNum(userViewsCount)}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {profileVisitors.length > 0 ? (
                    profileVisitors.map((v, i) => (
                      <div key={v.id || i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {v.avatar ? (
                            <img src={v.avatar} alt={v.name || v.username} className="w-10 h-10 rounded-full object-cover border border-cyan-500/30" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center text-slate-400">
                              <User className="w-5 h-5 text-cyan-400" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-white text-xs">{v.name || v.username}</h5>
                            <span className="text-[10px] text-slate-400">@{v.username}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{v.time || window.loc('به تازگی', 'Recently')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-950 border border-dashed border-slate-800 space-y-2">
                      <Eye className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-slate-300 text-xs font-bold">{window.loc('هنوز بازدیدی از پروفایل ثبت نشده است.', 'No profile visits recorded yet.')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. SEPARATE PHOTOS GALLERY PAGE */}
            {activeSeparateModal === 'photos' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-white text-base">{window.loc('گالری عکس‌های شما', 'Your Photo Gallery')}</h3>
                    <p className="text-xs text-slate-400">{window.loc('تصاویر منتشرشده در پروفایل', 'Published photos on profile')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewPostType('photo');
                      setIsCreatePostModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{window.loc('افزودن عکس جدید', 'Add Photo')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {profilePosts.filter(p => !p.video && p.image).length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                      <Image className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">{window.loc('هنوز عکسی در گالری ثبت نشده است', 'No photos in gallery yet')}</p>
                    </div>
                  ) : (
                    profilePosts.filter(p => !p.video && p.image).map(p => (
                      <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 group bg-slate-950">
                        <img src={p.image} alt="Photo" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition p-2 flex items-end justify-between text-white text-[11px] font-bold">
                          <span>❤️ {p.likes}</span>
                          <span>💬 {p.comments}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. SEPARATE VIDEOS GALLERY PAGE */}
            {activeSeparateModal === 'videos' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-black text-white text-base">{window.loc('گالری ویدیوهای شما', 'Your Video Gallery')}</h3>
                    <p className="text-xs text-slate-400">{window.loc('ویدیوها و کلیپ‌های کوتاه منتشرشده', 'Published videos & clips')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewPostType('video');
                      setIsCreatePostModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{window.loc('افزودن ویدیوی جدید', 'Add Video')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profilePosts.filter(p => p.video).length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                      <Video className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">{window.loc('هنوز ویدیویی در گالری ثبت نشده است', 'No videos in gallery yet')}</p>
                    </div>
                  ) : (
                    profilePosts.filter(p => p.video).map(p => (
                      <div key={p.id} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                        <video src={p.video} controls className="w-full h-full object-cover" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

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

              {/* Gender Selection & Streamer Rules */}
              <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    <span>{window.loc('تعیین جنسیت (Gender)', 'Gender Selection')}</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    editForm.gender === 'female'
                      ? 'bg-pink-500/10 text-pink-400 border-pink-500/30'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  }`}>
                    {editForm.gender === 'female' ? window.loc('👩 خانم (واجد شرایط استریم)', '👩 Female (Stream Eligible)') : window.loc('👨 آقا', '👨 Male')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm(prev => ({ ...prev, gender: 'female' }));
                      if (typeof setIsBecomeStreamerModalOpen === 'function') {
                        setIsBecomeStreamerModalOpen(true);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                      editForm.gender === 'female'
                        ? 'bg-gradient-to-r from-pink-600/30 to-purple-600/30 border-pink-500 text-pink-300 shadow-md ring-1 ring-pink-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👩</span>
                    <span>{window.loc('زن (Female)', 'Female')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, gender: 'male' }))}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition ${
                      editForm.gender === 'male'
                        ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/30 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>👨</span>
                    <span>{window.loc('مرد (Male)', 'Male')}</span>
                  </button>
                </div>

                {editForm.gender === 'female' && (
                  <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[11px] text-pink-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                    <span>{window.loc('حساب‌های بانوان امکان تایید نشان استریمری، آغاز لایواستریم و دریافت الماس و درآمد را دارند.', 'Female accounts are eligible for official Streamer verification, host broadcasting, and creator rewards.')}</span>
                  </div>
                )}
              </div>

              {/* City, Birthdate & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  <label className="text-xs font-bold text-slate-300">{window.loc('تاریخ تولد (میلادی)', 'Date of Birth')}</label>
                  <input
                    type="date"
                    value={editForm.birth_date || ''}
                    onChange={(e) => {
                      const dob = e.target.value;
                      const calculated = calculateAge(dob);
                      setEditForm(prev => ({
                        ...prev,
                        birth_date: dob,
                        age: calculated !== null ? String(calculated) : prev.age
                      }));
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {window.loc('سن محاسبه‌شده', 'Calculated Age')}
                  </label>
                  <input
                    type="text"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    placeholder="24"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none font-mono font-bold text-pink-400"
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
              {(userAvatar || authAvatar) ? (
                <img
                  src={userAvatar || authAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full object-cover border border-pink-500/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-pink-500/40 flex items-center justify-center text-slate-400">
                  <User className="w-5 h-5 text-pink-400" />
                </div>
              )}
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

