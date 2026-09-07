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
  Filter, Play, AlertCircle, Trash2, Upload, UserCheck, UserPlus
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

  // --- LOCAL & REAL GALLERY (PHOTOS & VIDEOS) & LIKERS STATE ---
  const [galleryPhotos, setGalleryPhotos] = useState(() => {
    try {
      const stored = safeStorage.getItem(`vlive_user_photos_${currentUsername || 'me'}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [galleryVideos, setGalleryVideos] = useState(() => {
    try {
      const stored = safeStorage.getItem(`vlive_user_videos_${currentUsername || 'me'}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [profileLikers, setProfileLikers] = useState(() => {
    const uid = props.currentUser?.id || getUserId() || currentUsername || 'me';
    return apiProfile.getProfileLikers(uid);
  });

  const targetProfileId = props.currentUser?.id || getUserId() || currentUsername || 'me';
  const [isProfileLiked, setIsProfileLiked] = useState(() => apiProfile.isUserProfileLiked(targetProfileId));
  const [isUserFollowedState, setIsUserFollowedState] = useState(() => apiProfile.isUserFollowed(targetProfileId));

  useEffect(() => {
    setIsProfileLiked(apiProfile.isUserProfileLiked(targetProfileId));
    setIsUserFollowedState(apiProfile.isUserFollowed(targetProfileId));
  }, [targetProfileId]);

  // Sync real profile likes count and likers from database and API
  useEffect(() => {
    let isMounted = true;
    const uid = props.currentUser?.id || getUserId() || currentUsername || 'me';
    
    if (uid && apiProfile && typeof apiProfile.getProfileLikesCount === 'function') {
      apiProfile.getProfileLikesCount(uid).then(cnt => {
        if (isMounted && typeof cnt === 'number') {
          setExtraLikes(cnt);
        }
      });
    }

    setProfileLikers(apiProfile.getProfileLikers(uid));

    const handleProfileLiked = (e) => {
      if (e?.detail) {
        if (typeof e.detail.likesCount === 'number') {
          setExtraLikes(e.detail.likesCount);
        }
        if (Array.isArray(e.detail.likers)) {
          setProfileLikers(e.detail.likers);
        } else {
          setProfileLikers(apiProfile.getProfileLikers(uid));
        }
        if (e.detail.targetUserId === targetProfileId || e.detail.targetUserId === 'me') {
          if (typeof e.detail.isLiked === 'boolean') {
            setIsProfileLiked(e.detail.isLiked);
          }
        }
      }
    };
    window.addEventListener('vlive_profile_liked', handleProfileLiked);
    return () => {
      isMounted = false;
      window.removeEventListener('vlive_profile_liked', handleProfileLiked);
    };
  }, [currentUsername, props.currentUser, targetProfileId]);

  const handleToggleLike = async () => {
    try {
      const res = await apiProfile.toggleLikeProfile(targetProfileId);
      if (res && res.success) {
        setIsProfileLiked(res.isLiked);
        if (typeof res.likesCount === 'number') {
          setExtraLikes(res.likesCount);
        }
        if (res.isLiked) {
          showToast(window.loc('❤️ پروفایل پسندیده شد', '❤️ Liked profile'));
        } else {
          showToast(window.loc('🤍 لایک پروفایل لغو شد', '🤍 Profile like removed'));
        }
      }
    } catch (err) {
      console.warn('handleToggleLike err:', err);
    }
  };

  const handleToggleFollow = async () => {
    try {
      if (isUserFollowedState) {
        const res = await apiProfile.unfollowUser(targetProfileId);
        if (res && res.success) {
          setIsUserFollowedState(false);
          showToast(window.loc('لغو دنبال کردن انجام شد', 'Unfollowed'));
        }
      } else {
        const targetObj = {
          id: targetProfileId,
          username: currentUsername || authUsername || 'user',
          name: userName || authFullName || 'User',
          avatar: userAvatar || authAvatar || ''
        };
        const res = await apiProfile.followUser(targetObj);
        if (res && res.success) {
          setIsUserFollowedState(true);
          showToast(window.loc('✓ کاربر را دنبال کردید', '✓ Followed user'));
        }
      }
    } catch (err) {
      console.warn('handleToggleFollow err:', err);
    }
  };

  // Real total likes calculation
  const userTotalLikes = Math.max(extraLikes, profileLikers.length);

  // Dynamic Profile Completion % based on filled details
  const profileCompletionPercent = (() => {
    const fields = [userName, userBio, userAvatar, coverPhoto, userCity, userAge, userOccupation, userInterests];
    const filled = fields.filter(f => f && String(f).trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  })();

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

  const detectedTgId = props.currentUser?.telegram_id || props.currentTelegramId || (typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user?.id : '') || '';
  const effectiveUserRole = userRole || props.currentUser?.role || 'user';
  const isAdminUser = isUserAnAdmin(effectiveUserRole, detectedTgId);

  // Female user determination
  const userGenderStr = String(userGender || props.currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
  const isFemale = Boolean(
    userGenderStr === 'female' ||
    userGenderStr === 'خانم' ||
    userGenderStr === 'زن' ||
    userGenderStr === 'f'
  );

  // Admin is exempt from any restrictions. Regular female users can publish posts and stories. Male users are viewers.
  const canCreateContent = Boolean(isAdminUser || isFemale);

  return (
    <>
      {activeTab === 'profile' && (
        <>
      <div className="space-y-1.5 pb-28 animate-fadeIn dir-ltr">
        
        {/* ========================================== */}
        {/* 1. HERO COVER & PROFILE CARD               */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_header_card" defaultLabel="User Avatar, Name & Bio Card">
          <div className="relative rounded-[1.75rem] overflow-hidden bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/95 border border-slate-800/80 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            {/* Cover Banner (Slim & Compact) */}
            <div className="h-20 sm:h-24 relative overflow-hidden bg-gradient-to-r from-pink-900/40 via-purple-900/40 via-slate-900 to-cyan-900/40">
              {coverPhoto ? (
                <img 
                  src={coverPhoto} 
                  alt="Cover" 
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition duration-700" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                  <div className="absolute -inset-10 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-cyan-500/20 blur-xl animate-pulse" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(236,72,153,0.2),transparent_70%)]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Top Quick Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                {isAdminUser && (
                  <button
                    onClick={() => setIsAdminPanelOpen && setIsAdminPanelOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white backdrop-blur-xl transition-all duration-300 border border-rose-400/40 shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center gap-1.5 text-xs font-black cursor-pointer group"
                    title={window.loc('پنل مدیریت', 'Admin Panel')}
                  >
                    <Shield className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">{window.loc('مدیریت', 'Admin')}</span>
                  </button>
                )}

                <button
                  onClick={() => setIsQrCodeModalOpen(true)}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-white backdrop-blur-xl transition-all duration-300 border border-white/20 shadow-md hover:border-cyan-500/50 group cursor-pointer"
                  title="Share QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Profile Info & Avatar (Brought up in line with actions) */}
            <div className="px-4 sm:px-6 pb-3.5 relative space-y-3">
              <div className="flex items-start justify-between gap-3">
                {/* Avatar on Top-Left + Username and Likes under photo */}
                <div className="flex flex-col items-center -mt-12 sm:-mt-14 shrink-0">
                  <div 
                    onClick={() => setIsEditModalOpen(true)}
                    className="relative group cursor-pointer"
                    title={window.loc('کلیک برای ویرایش پروفایل', 'Click to edit profile')}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_25px_rgba(236,72,153,0.4)] overflow-hidden">
                      {(userAvatar || authAvatar) ? (
                        <img
                          src={userAvatar || authAvatar}
                          alt={userName}
                          className="w-full h-full object-cover rounded-full bg-slate-900"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-slate-400">
                          <User className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Online Status Badge */}
                    {showOnlineStatus && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-md" title="Online Status" />
                    )}

                    {/* Level & Verified Badge together at bottom right of Avatar */}
                    <div className="absolute bottom-0.5 right-0.5 z-10 flex items-center gap-0.5 bg-slate-950/90 backdrop-blur-xl p-0.5 rounded-full border border-slate-800 shadow-lg">
                      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="text-[8px] text-purple-200 uppercase font-bold">Lv</span>
                        <span>{userLevel}</span>
                      </div>
                      {isVerified && <VerifiedBadge showLabel={false} className="w-3.5 h-3.5 shrink-0" />}
                    </div>

                    {/* Change Avatar Overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition duration-300 text-white font-bold text-xs gap-1 z-20 backdrop-blur-sm">
                      <Camera className="w-5 h-5 text-pink-400 animate-pulse" />
                      <span className="text-[9px]">{window.loc('ویرایش', 'Edit')}</span>
                    </div>
                  </div>

                  {/* Username under profile photo */}
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap justify-center">
                    <span className="font-mono text-cyan-400 font-bold text-[11px] sm:text-xs text-center bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      @{currentUsername || authUsername || 'user'}
                    </span>
                  </div>
                </div>

                {/* Right / Side Details (Actions above Name: Heart Like + Follow, then Name, VIP Badge & Bio) */}
                <div className="pt-0.5 sm:pt-1 flex-1 space-y-1.5">
                  {/* Heart Icon (Larger, Off/On State) & Follow Button above User Name */}
                  <div className="flex items-center gap-2 flex-wrap pb-0.5">
                    {/* LIKE BUTTON (Larger, Off = Muted outline, On = Glowing Pink/Red Heart) */}
                    <button
                      onClick={handleToggleLike}
                      className={`p-1.5 px-3 rounded-full border transition-all duration-300 flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm ${
                        isProfileLiked
                          ? 'bg-rose-500/20 border-rose-500/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                          : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                      title={isProfileLiked ? window.loc('لایک شده (کلیک برای لغو)', 'Liked (Click to unlike)') : window.loc('لایک کردن پروفایل', 'Like Profile')}
                    >
                      <Heart
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isProfileLiked 
                            ? 'fill-rose-500 text-rose-500 scale-110' 
                            : 'text-slate-400 stroke-2'
                        }`}
                      />
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSeparateModal('likes');
                        }}
                        className={`text-xs font-black font-mono tracking-tight hover:underline cursor-pointer ${
                          isProfileLiked ? 'text-rose-300' : 'text-slate-300'
                        }`}
                        title={window.loc('مشاهده لایک‌کنندگان', 'View Likers')}
                      >
                        {formatNum(userTotalLikes)}
                      </span>
                    </button>

                    {/* FOLLOW BUTTON IN FRONT OF HEART */}
                    <button
                      onClick={handleToggleFollow}
                      className={`px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 active:scale-95 cursor-pointer border ${
                        isUserFollowedState
                          ? 'bg-slate-900 border-slate-700 text-emerald-400 hover:border-rose-500/50 hover:text-rose-400'
                          : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 border-transparent text-white hover:opacity-95 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                      }`}
                      title={isUserFollowedState ? window.loc('لغو دنبال کردن', 'Unfollow') : window.loc('دنبال کردن کاربر', 'Follow User')}
                    >
                      {isUserFollowedState ? (
                        <>
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>{window.loc('دنبال می‌کنید', 'Following')}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>{window.loc('دنبال کردن', 'Follow')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {userName || authFullName || 'User'}
                    </h1>
                    <VipStatusBadge size="small" showText={true} />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium line-clamp-2 max-w-md">
                    {userBio || window.loc('به پروفایل من خوش آمدید ✨', 'Welcome to my profile ✨')}
                  </p>
                </div>
              </div>

              {/* STORIES SECTION INSIDE PROFILE CARD (WITHOUT TITLE, ONLY 'ALL') */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-end px-1">
                  <span 
                    onClick={() => {
                      if (props.setActiveStoryView) props.setActiveStoryView('all');
                    }}
                    className="text-[10px] text-pink-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Flame className="w-3 h-3 text-pink-400" />
                    <span>{window.loc('همه', 'All')}</span>
                  </span>
                </div>
                
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
                  {/* Add Story Button (For female users & admins) */}
                  {canCreateContent && (
                    <button
                      onClick={() => {
                        if (props.setIsAddStoryModalOpen) props.setIsAddStoryModalOpen(true);
                        else showToast(window.loc('بخش استوری آماده است', 'Story creator active'));
                      }}
                      className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-full bg-slate-950/80 border-2 border-dashed border-pink-500/60 flex items-center justify-center text-pink-400 group-hover:scale-105 group-hover:border-pink-400 transition shadow-inner shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-300">{window.loc('افزودن', 'Add')}</span>
                    </button>
                  )}

                  {/* User Profile Stories & Highlights (Permanent in Profile) */}
                  {(props.advancedStories || props.userStoriesList || []).filter(story => {
                    if (!story) return false;
                    return Boolean(
                      (story.userId && props.currentUser?.id && String(story.userId) === String(props.currentUser.id)) ||
                      (story.user_id && props.currentUser?.id && String(story.user_id) === String(props.currentUser.id)) ||
                      (story.userId && props.currentUserId && String(story.userId) === String(props.currentUserId)) ||
                      (story.user_id && props.currentUserId && String(story.user_id) === String(props.currentUserId)) ||
                      (story.username && currentUsername && String(story.username).toLowerCase() === String(currentUsername).toLowerCase()) ||
                      (story.username && authUsername && String(story.username).toLowerCase() === String(authUsername).toLowerCase()) ||
                      (story.username && userName && String(story.username).toLowerCase() === String(userName).toLowerCase())
                    );
                  }).map((story, i) => {

                    return (
                      <div 
                        key={story.id || i} 
                        onClick={() => {
                          if (props.setActiveStoryView) {
                            props.setActiveStoryView({
                              group: {
                                user: {
                                  name: story.username || (isMyStory ? userName : 'User'),
                                  avatar: story.userAvatar || (isMyStory ? userAvatar : ''),
                                  isVip: true
                                },
                                items: [
                                  {
                                    id: story.id,
                                    url: story.media_url || story.imageUrl || story.videoUrl,
                                    duration: 5,
                                    time: window.loc('هم‌اکنون', 'Right now'),
                                    caption: story.caption || story.title || ''
                                  }
                                ],
                                isMe: isMyStory
                              },
                              currentIndex: 0,
                              progress: 0
                            });
                          }
                        }}
                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                      >
                        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 group-hover:scale-105 transition shadow-md overflow-hidden shrink-0">
                          {(story.media_url || story.imageUrl || story.videoUrl) ? (
                            <img src={story.media_url || story.imageUrl || story.videoUrl} alt={story.title || 'Story'} className="w-full h-full object-cover rounded-full bg-slate-950" />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-full text-pink-400 font-black text-[10px]">
                              LIVE
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 max-w-[54px] truncate text-center">{story.title || story.caption || story.username || 'Story'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* 2. FOLLOWERS, FOLLOWING, VIEWS ROW (SHARED SLIM RECTANGULAR CARD ABOVE MEDIA) */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_stats_shared_card" defaultLabel="Followers, Following, Views Card">
          <div className="py-2 px-3 bg-gradient-to-r from-slate-900/95 via-slate-950 to-slate-900/95 rounded-2xl border border-slate-800/80 shadow-md backdrop-blur-xl">
            <div className="grid grid-cols-3 divide-x divide-slate-800/80 dir-ltr">
              
              {/* Followers (Icon + Count Only) */}
              <button
                onClick={() => setActiveSeparateModal('followers')}
                className="py-1 px-2 flex items-center justify-center gap-2 group hover:bg-indigo-950/30 rounded-xl transition cursor-pointer"
                title={window.loc('دنبال‌کنندگان', 'Followers')}
              >
                <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white font-mono group-hover:text-indigo-300 transition">
                  {formatNum(followersList.length || userFollowersCount)}
                </span>
              </button>

              {/* Following (Icon + Count Only) */}
              <button
                onClick={() => setActiveSeparateModal('following')}
                className="py-1 px-2 flex items-center justify-center gap-2 group hover:bg-blue-950/30 rounded-xl transition cursor-pointer"
                title={window.loc('دنبال‌شوندگان', 'Following')}
              >
                <UserCheck className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white font-mono group-hover:text-blue-300 transition">
                  {formatNum(userFollowingCount)}
                </span>
              </button>

              {/* Views (Icon + Count Only) */}
              <button
                onClick={() => setActiveSeparateModal('views')}
                className="py-1 px-2 flex items-center justify-center gap-2 group hover:bg-cyan-950/30 rounded-xl transition cursor-pointer"
                title={window.loc('بازدیدها', 'Views')}
              >
                <Eye className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white font-mono group-hover:text-cyan-300 transition">
                  {formatNum(userViewsCount)}
                </span>
              </button>

            </div>
          </div>
        </VisualSectionWrapper>

        {/* ========================================== */}
        {/* 3. PHOTOS & VIDEOS CARD (UNDER STATS)      */}
        {/* ========================================== */}
        <VisualSectionWrapper pageId="profile" sectionId="profile_media_card" defaultLabel="Photos & Videos Card">
          <div className="p-3 bg-gradient-to-r from-slate-900/95 via-slate-950 to-slate-900/95 rounded-2xl sm:rounded-3xl border border-slate-800/80 shadow-lg backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Photo Option */}
              <button
                onClick={() => setActiveSeparateModal('photos')}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-950 border border-purple-500/30 hover:border-purple-500/80 transition-all duration-300 flex items-center justify-between group shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 group-hover:scale-110 transition-transform shrink-0">
                    <Image className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-black text-white group-hover:text-purple-300 transition">{window.loc('عکس‌ها', 'Photos')}</h4>
                    <span className="text-[10px] text-slate-400">{window.loc('گالری تصاویر', 'Image Gallery')}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-purple-300 font-mono bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-500/40 shadow-inner">
                  {formatNum(galleryPhotos.length)}
                </span>
              </button>

              {/* Video Option */}
              <button
                onClick={() => setActiveSeparateModal('videos')}
                className="p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950 border border-rose-500/30 hover:border-rose-500/80 transition-all duration-300 flex items-center justify-between group shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 group-hover:scale-110 transition-transform shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-black text-white group-hover:text-rose-300 transition">{window.loc('ویدیوها', 'Videos')}</h4>
                    <span className="text-[10px] text-slate-400">{window.loc('ویدیوهای کوتاه', 'Short Videos')}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-rose-300 font-mono bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40 shadow-inner">
                  {formatNum(galleryVideos.length)}
                </span>
              </button>
            </div>
          </div>
        </VisualSectionWrapper>

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
                  <h2 className="text-base font-black text-white">{window.loc('دنبال‌کنندگان', 'Followers')}</h2>
                </>
              )}
              {activeSeparateModal === 'following' && (
                <>
                  <UserCheck className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-black text-white">{window.loc('دنبال‌شوندگان', 'Following')}</h2>
                </>
              )}
              {activeSeparateModal === 'likes' && (
                <>
                  <Heart className="w-5 h-5 text-pink-400 fill-pink-500/30" />
                  <h2 className="text-base font-black text-white">{window.loc('لایک‌ها', 'Likes')}</h2>
                </>
              )}
              {activeSeparateModal === 'views' && (
                <>
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-black text-white">{window.loc('بازدیدها', 'Views')}</h2>
                </>
              )}
              {activeSeparateModal === 'photos' && (
                <>
                  <Image className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-black text-white">{window.loc('عکس‌ها', 'Photos')}</h2>
                </>
              )}
              {activeSeparateModal === 'videos' && (
                <>
                  <Video className="w-5 h-5 text-rose-400" />
                  <h2 className="text-base font-black text-white">{window.loc('ویدیوها', 'Videos')}</h2>
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
                  <h3 className="font-black text-white text-base">{window.loc('دنبال‌کنندگان', 'Followers')}</h3>
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
                            showToast(`${window.loc('دنبال شد:', 'Followed:')} @${u.username}`);
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
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 2. SEPARATE FOLLOWING PAGE */}
            {activeSeparateModal === 'following' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-black text-white text-base">{window.loc('دنبال‌شوندگان', 'Following')}</h3>
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
                                showToast(`${window.loc('لایو', 'Live')} @${u.username}`);
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
                              showToast(`${window.loc('لغو شد', 'Unfollowed')}`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950/60 hover:text-red-300 text-slate-300 font-bold text-xs border border-slate-800 transition"
                          >
                            {window.loc('لغو دنبال کردن', 'Unfollow')}
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

            {/* 3. SEPARATE LIKES PAGE (USERS WHO LIKED THE PROFILE) */}
            {activeSeparateModal === 'likes' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-pink-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    <h3 className="font-black text-white text-base">{window.loc('لایک‌کنندگان پروفایل', 'Profile Likers')}</h3>
                  </div>
                  <span className="text-xs font-black text-pink-400 bg-pink-950 px-3 py-1 rounded-full border border-pink-500/40 font-mono">
                    ❤️ {formatNum(userTotalLikes)}
                  </span>
                </div>

                <div className="space-y-3">
                  {profileLikers.length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                      <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">{window.loc('هنوز کاربری پروفایل شما را لایک نکرده است.', 'No users have liked your profile yet.')}</p>
                    </div>
                  ) : (
                    profileLikers.map((liker, idx) => (
                      <div key={liker.id || idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-pink-500/30 transition">
                        <div className="flex items-center gap-3">
                          {liker.avatar ? (
                            <img src={liker.avatar} alt={liker.name || liker.username} className="w-10 h-10 rounded-full object-cover border border-pink-500/30" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-900 border border-pink-500/30 flex items-center justify-center text-slate-400">
                              <User className="w-5 h-5 text-pink-400" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-white text-xs">{liker.name || liker.username || 'User'}</h5>
                            <span className="text-[10px] text-slate-400">@{liker.username || 'user'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-pink-400 text-xs font-bold font-mono">
                          <Heart className="w-4 h-4 fill-pink-500" />
                          <span>{liker.time || window.loc('لایک کرد', 'Liked')}</span>
                        </div>
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
                  <h3 className="font-black text-white text-base">{window.loc('بازدیدها', 'Views')}</h3>
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
                      <p className="text-slate-300 text-xs font-bold">{window.loc('هنوز بازدیدی ثبت نشده است.', 'No profile visits recorded yet.')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. SEPARATE PHOTOS GALLERY PAGE */}
            {activeSeparateModal === 'photos' && (
              <div className="p-5 rounded-3xl bg-slate-900 border border-purple-500/30 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-purple-400" />
                    <h3 className="font-black text-white text-base">{window.loc('عکس‌های من', 'My Photos')}</h3>
                  </div>
                  <label className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>{window.loc('افزودن عکس', 'Add Photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          let mediaUrl = '';
                          if (typeof compressImageFile === 'function') {
                            mediaUrl = await compressImageFile(file, 1080, 1080, 0.85);
                          } else {
                            const reader = new FileReader();
                            mediaUrl = await new Promise((res) => {
                              reader.onloadend = () => res(reader.result);
                              reader.readAsDataURL(file);
                            });
                          }
                          const newPhoto = { id: Date.now(), url: mediaUrl, created_at: new Date().toISOString() };
                          setGalleryPhotos(prev => {
                            const updated = [newPhoto, ...prev];
                            safeStorage.setItem(`vlive_user_photos_${currentUsername || 'me'}`, JSON.stringify(updated));
                            return updated;
                          });
                          showToast(window.loc('عکس با موفقیت افزوده شد 📸', 'Photo added successfully 📸'));
                        } catch (err) {
                          showToast(window.loc('خطا در بارگذاری عکس', 'Error uploading photo'));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryPhotos.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                      <Image className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">{window.loc('عکسی ثبت نشده است', 'No photos yet')}</p>
                    </div>
                  ) : (
                    galleryPhotos.map(p => (
                      <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800 group bg-slate-950">
                        <img src={p.url || p.image} alt="Photo" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <button
                          onClick={() => {
                            setGalleryPhotos(prev => {
                              const updated = prev.filter(item => item.id !== p.id);
                              safeStorage.setItem(`vlive_user_photos_${currentUsername || 'me'}`, JSON.stringify(updated));
                              return updated;
                            });
                            showToast(window.loc('عکس حذف شد 🗑️', 'Photo removed 🗑️'));
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-400" />
                    <h3 className="font-black text-white text-base">{window.loc('ویدیوهای من', 'My Videos')}</h3>
                  </div>
                  <label className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>{window.loc('افزودن ویدیو', 'Add Video')}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const newVid = { id: Date.now(), url: reader.result, created_at: new Date().toISOString() };
                            setGalleryVideos(prev => {
                              const updated = [newVid, ...prev];
                              safeStorage.setItem(`vlive_user_videos_${currentUsername || 'me'}`, JSON.stringify(updated));
                              return updated;
                            });
                            showToast(window.loc('ویدیو با موفقیت بارگذاری شد 📹', 'Video uploaded successfully 📹'));
                          };
                          reader.readAsDataURL(file);
                        } catch (err) {
                          showToast(window.loc('خطا در بارگذاری ویدیو', 'Error uploading video'));
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {galleryVideos.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                      <Video className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-bold">{window.loc('ویدیویی ثبت نشده است', 'No videos yet')}</p>
                    </div>
                  ) : (
                    galleryVideos.map(p => (
                      <div key={p.id} className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
                        <video src={p.url || p.video} controls className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            setGalleryVideos(prev => {
                              const updated = prev.filter(item => item.id !== p.id);
                              safeStorage.setItem(`vlive_user_videos_${currentUsername || 'me'}`, JSON.stringify(updated));
                              return updated;
                            });
                            showToast(window.loc('ویدیو حذف شد 🗑️', 'Video removed 🗑️'));
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-rose-400 hover:text-white opacity-0 group-hover:opacity-100 transition z-10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <div className="flex gap-2">
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
        </>
      )}
    </>
  );
}

