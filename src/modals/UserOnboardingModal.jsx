import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Shield, Camera, Image, Check, AlertTriangle, Sparkles, 
  ChevronRight, Radio, RefreshCw, X, CheckCircle2, Lock, Heart, Globe,
  Hand, ShieldCheck, Clock, UserCheck, Mic, Bell
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import { cameraPermissionService } from '../services/cameraPermissionService';
import { apiProfile, apiAdmin, apiAuth } from '../services/api';
import { compressImageFile } from '../services/performance';
import { interestService } from '../services/interestService';

const AVAILABLE_COUNTRIES = [
  { code: 'IR', name: 'ایران (Iran)', flag: '🇮🇷' },
  { code: 'TR', name: 'ترکیه (Turkey)', flag: '🇹🇷' },
  { code: 'AE', name: 'امارات (UAE)', flag: '🇦🇪' },
  { code: 'DE', name: 'آلمان (Germany)', flag: '🇩🇪' },
  { code: 'GB', name: 'انگلستان (UK)', flag: '🇬🇧' },
  { code: 'US', name: 'ایالات متحده (USA)', flag: '🇺🇸' },
  { code: 'CA', name: 'کانادا (Canada)', flag: '🇨🇦' },
  { code: 'SE', name: 'سوئد (Sweden)', flag: '🇸🇪' },
  { code: 'OTHER', name: 'سایر کشورها (Other)', flag: '🌍' }
];

const PRESET_INTERESTS = [
  '🎬 پخش زنده و استریم', '✈️ سفر و گردشگری', '💄 مد و زیبایی',
  '🍳 آشپزی و لایف استایل', '💻 تکنولوژی و برنامه‌نویسی', '⚽ ورزش و تناسب اندام'
];

// Randomized verification poses requested from female applicants
const VERIFICATION_POSES = [
  {
    id: 'HAND_LEFT_UP',
    titleFa: 'بالا بردن دست چپ کنار صورت ✋',
    titleEn: 'Raise Left Hand next to face ✋',
    instructionFa: 'لطفاً دست چپ خود را باز کرده و کنار صورت بالا نگه‌دارید و سلفی بگیرید.',
    instructionEn: 'Please raise your open left hand next to your face and take a selfie.',
    icon: '✋'
  },
  {
    id: 'HAND_RIGHT_UP',
    titleFa: 'بالا بردن دست راست کنار صورت ✋',
    titleEn: 'Raise Right Hand next to face ✋',
    instructionFa: 'لطفاً دست راست خود را باز کرده و کنار صورت بالا نگه‌دارید و سلفی بگیرید.',
    instructionEn: 'Please raise your open right hand next to your face and take a selfie.',
    icon: '✋'
  },
  {
    id: 'PEACE_SIGN',
    titleFa: 'نشان دادن علامت پیروزی (V) با دو انگشت ✌️',
    titleEn: 'Show Peace (V) Sign with fingers ✌️',
    instructionFa: 'لطفاً با دو انگشت دست خود علامت پیروزی (V) را کنار صورت نشان داده و سلفی بگیرید.',
    instructionEn: 'Please show a peace (V) sign with your fingers next to your face.',
    icon: '✌️'
  },
  {
    id: 'THUMBS_UP',
    titleFa: 'نشان دادن علامت لایک (Thumbs Up) کنار چانه 👍',
    titleEn: 'Show Thumbs Up next to chin 👍',
    instructionFa: 'لطفاً علامت لایک (انگشت شست بالا) را کنار چانه خود نشان دهید و عکس سلفی بگیرید.',
    instructionEn: 'Please show a thumbs up gesture next to your chin and take a selfie.',
    icon: '👍'
  }
];

export default function UserOnboardingModal({
  isOpen,
  initialUsername = '',
  initialName = '',
  initialAvatar = '',
  initialAge = '',
  initialGender = '',
  telegramId = '',
  onComplete,
  showToast
}) {
  // Step state: 'BASE_INFO' -> 'FEMALE_PHOTO' -> 'FEMALE_SELFIE_POSE' -> 'FEMALE_STREAMER_OPTION'
  const [step, setStep] = useState('BASE_INFO');

  // Form states
  const [username, setUsername] = useState(initialUsername || '');
  const [fullName, setFullName] = useState(initialName || '');
  const [age, setAge] = useState(initialAge || '');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(true);
  const [country, setCountry] = useState('ایران (Iran)');
  const [gender, setGender] = useState(() => initialGender || safeStorage.getItem('vlive_user_gender') || 'male'); // 'male' | 'female'
  const [selectedInterests, setSelectedInterests] = useState(['🎬 پخش زنده و استریم']);
  
  // Photo & Gallery permission
  const [hasGalleryPermission, setHasGalleryPermission] = useState(() => {
    return safeStorage.getItem('vlive_perm_gallery_granted') !== 'false';
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState('');

  // App System Permissions (Camera Front & Back, Mic, Gallery, Notifications - only once on onboarding)
  const [permissions, setPermissions] = useState(() => ({
    camera: safeStorage.getItem('vlive_camera_permission_granted') !== 'false',
    microphone: safeStorage.getItem('vlive_mic_permission_granted') !== 'false',
    gallery: safeStorage.getItem('vlive_perm_gallery_granted') !== 'false',
    notifications: safeStorage.getItem('vlive_notif_permission_granted') !== 'false'
  }));

  const handleTogglePermission = async (key) => {
    const nextVal = !permissions[key];
    setPermissions(prev => ({ ...prev, [key]: nextVal }));
    if (key === 'camera') {
      safeStorage.setItem('vlive_camera_permission_granted', nextVal ? 'true' : 'false');
      if (nextVal) {
        cameraPermissionService.ensurePermissions({ video: true, audio: false }).catch(() => {});
      }
    } else if (key === 'microphone') {
      safeStorage.setItem('vlive_mic_permission_granted', nextVal ? 'true' : 'false');
      if (nextVal) {
        cameraPermissionService.ensurePermissions({ video: false, audio: true }).catch(() => {});
      }
    } else if (key === 'gallery') {
      safeStorage.setItem('vlive_perm_gallery_granted', nextVal ? 'true' : 'false');
      setHasGalleryPermission(nextVal);
    } else if (key === 'notifications') {
      safeStorage.setItem('vlive_notif_permission_granted', nextVal ? 'true' : 'false');
      if (nextVal && typeof Notification !== 'undefined' && Notification.requestPermission) {
        Notification.requestPermission().catch(() => {});
      }
    }
  };

  const handleGrantAllPermissions = async () => {
    setPermissions({
      camera: true,
      microphone: true,
      gallery: true,
      notifications: true
    });
    setHasGalleryPermission(true);
    safeStorage.setItem('vlive_camera_permission_granted', 'true');
    safeStorage.setItem('vlive_mic_permission_granted', 'true');
    safeStorage.setItem('vlive_perm_gallery_granted', 'true');
    safeStorage.setItem('vlive_notif_permission_granted', 'true');
    safeStorage.setItem('vlive_permissions_granted', 'true');
    safeStorage.setItem('vlive_permissions_prompted_once', 'true');

    try {
      await cameraPermissionService.ensurePermissions({ video: true, audio: true });
    } catch (e) {}

    if (typeof Notification !== 'undefined' && Notification.requestPermission) {
      try {
        await Notification.requestPermission();
      } catch (e) {}
    }
    showToast(window.loc('همه مجوزهای دسترسی با موفقیت تایید شدند ✅', 'All permissions approved successfully ✅'));
  };

  // Camera & Manual Verification states (Female Only)
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [selectedPose, setSelectedPose] = useState(() => {
    return VERIFICATION_POSES[Math.floor(Math.random() * VERIFICATION_POSES.length)];
  });
  const videoRef = useRef(null);
  const selfieFileInputRef = useRef(null);

  // Attach stream to video tag whenever stream or videoRef changes
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(e => console.warn('Video auto-play note:', e));
    }
  }, [isCameraActive, cameraStream]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Streamer Option
  const [wantToBeStreamer, setWantToBeStreamer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle interest
  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        showToast(window.loc('حداکثر ۵ علاقه را می‌توانید انتخاب کنید', 'Maximum 5 interests allowed'));
      }
    }
  };

  // Step 1: Base validation
  const handleValidateBaseInfo = () => {
    if (!username.trim() || username.trim().length < 3) {
      showToast(window.loc('نام کاربری باید حداقل ۳ حرف باشد', 'Username must be at least 3 characters'));
      return;
    }
    const numAge = Number(age);
    if (isNaN(numAge) || numAge < 18) {
      showToast(window.loc('سن شما باید بالای ۱۸ سال باشد 🔞', 'You must be 18 or older 🔞'));
      return;
    }
    if (!isAgeConfirmed) {
      showToast(window.loc('تایید سن بالای ۱۸ سال الزامی است', '18+ age confirmation is required'));
      return;
    }
    if (!selectedInterests || selectedInterests.length === 0) {
      showToast(window.loc('لطفاً حداقل ۱ مورد از علایق خود را انتخاب کنید', 'Please select at least 1 interest'));
      return;
    }

    // Persist permissions once and for all
    safeStorage.setItem('vlive_permissions_prompted_once', 'true');
    safeStorage.setItem('vlive_permissions_granted', 'true');
    safeStorage.setItem('vlive_camera_permission_granted', permissions.camera ? 'true' : 'false');
    safeStorage.setItem('vlive_mic_permission_granted', permissions.microphone ? 'true' : 'false');
    safeStorage.setItem('vlive_perm_gallery_granted', permissions.gallery ? 'true' : 'false');
    safeStorage.setItem('vlive_notif_permission_granted', permissions.notifications ? 'true' : 'false');

    if (gender === 'male') {
      // Men finish directly and enter the app
      finishOnboarding({
        gender: 'male',
        is_streamer: false,
        is_verified: false,
        status: 'approved'
      });
    } else {
      // Female moves to Gallery upload & permission step (strictly empty avatar required from gallery)
      setStep('FEMALE_PHOTO');
    }
  };

  // Step 2: Handle Gallery File Upload
  const handleGalleryFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!hasGalleryPermission) {
      showToast(window.loc('ابتدا باید تیک تایید اجازه دسترسی به گالری را فعال کنید ⚠️', 'You must first grant gallery access permission ⚠️'));
      return;
    }

    try {
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      setAvatarPreview(compressed);
      setAvatarError('');
      showToast(window.loc('عکس پروفایل با موفقیت از گالری انتخاب شد ✅', 'Profile photo selected from gallery successfully ✅'));
    } catch (err) {
      setAvatarError('خطا در فشرده‌سازی عکس');
    }
  };

  // Strict transition from Step 2 to Step 3
  const handleProceedToSelfie = () => {
    if (!hasGalleryPermission) {
      showToast(window.loc('لطفاً ابتدا تیک مجوز دسترسی به گالری را فعال کنید ⚠️', 'Please enable gallery permission first ⚠️'));
      return;
    }
    if (!avatarPreview || avatarPreview.trim().length === 0) {
      showToast(window.loc('انتخاب عکس پروفایل از گالری برای ادامه الزامی است 📸', 'Profile photo from gallery is required 📸'));
      return;
    }
    setStep('FEMALE_SELFIE_POSE');
  };

  // Strict transition from Step 3 to Step 4
  const handleProceedToStreamerOption = () => {
    if (!capturedSelfie || capturedSelfie.trim().length === 0) {
      showToast(window.loc('ثبت سلفی با ژست درخواستی الزامی است ✋', 'Gesture selfie capture is required ✋'));
      return;
    }
    stopCamera();
    setStep('FEMALE_STREAMER_OPTION');
  };

  // Step 3: Camera & Manual Gesture Selfie logic
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(window.loc('دوربین مستقیم در این محیط پشتیبانی نمی‌شود، لطفاً از دکمه عکاسی سلفی استفاده کنید 📸', 'Direct camera stream not supported, please use selfie upload/snap button 📸'));
        return;
      }
      const stream = await cameraPermissionService.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera error:', err);
      showToast(window.loc('دسترسی به دوربین مستقیم مقدور نشد. می‌توانید با دکمه عکاسی سلفی بگیرید 📸', 'Camera access failed. You can take/upload a selfie with the selfie button 📸'));
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureSelfieFromCamera = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const w = v.videoWidth || 480;
    const h = v.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(v, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedSelfie(dataUrl);
    stopCamera();
    showToast(window.loc('📸 سلفی با ژست درخواستی با موفقیت ثبت شد و آماده ارسال به مدیریت است.', '📸 Gesture selfie captured successfully and ready for admin review.'));
  };

  const handleSelfieFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 600, 600, 0.85);
      setCapturedSelfie(compressed);
      stopCamera();
      showToast(window.loc('📸 سلفی با ژست درخواستی با موفقیت انتخاب شد.', '📸 Gesture selfie selected successfully.'));
    } catch (err) {
      showToast(window.loc('خطا در بارگذاری عکس سلفی', 'Error processing selfie photo'));
    }
  };

  const randomizePose = () => {
    const nextList = VERIFICATION_POSES.filter(p => p.id !== selectedPose.id);
    const randomOne = nextList[Math.floor(Math.random() * nextList.length)];
    setSelectedPose(randomOne);
    setCapturedSelfie(null);
  };

  // Finish Onboarding and save to DB
  const finishOnboarding = async (additionalProps = {}) => {
    // Strict Guard for Female Users
    if (gender === 'female') {
      if (!hasGalleryPermission) {
        showToast(window.loc('اجازه دسترسی به گالری تایید نشده است ⚠️', 'Gallery permission is not approved ⚠️'));
        setStep('FEMALE_PHOTO');
        return;
      }
      if (!avatarPreview || avatarPreview.trim().length === 0) {
        showToast(window.loc('عکس پروفایل گالری انتخاب نشده است ⚠️', 'Profile photo is missing ⚠️'));
        setStep('FEMALE_PHOTO');
        return;
      }
      if (!capturedSelfie || capturedSelfie.trim().length === 0) {
        showToast(window.loc('سلفی با ژست دست ثبت نشده است ⚠️', 'Gesture selfie is required ⚠️'));
        setStep('FEMALE_SELFIE_POSE');
        return;
      }
    }

    setIsSubmitting(true);
    stopCamera();

    const finalProfileData = {
      username: username.trim(),
      name: fullName.trim() || username.trim(),
      age: Number(age),
      country,
      gender,
      interests: selectedInterests.join(', '),
      avatar: avatarPreview || '',
      telegram_id: telegramId || '',
      is_onboarded: true,
      ...additionalProps
    };

    // Save locally
    safeStorage.setItem('vlive_user_onboarded', 'true');
    safeStorage.setItem('vlive_user_gender', gender);
    safeStorage.setItem('vlive_current_username', username.trim());
    safeStorage.setItem('vlive_user_name', fullName.trim() || username.trim());
    if (age) {
      safeStorage.setItem('vlive_profile_age', String(age));
    }
    if (avatarPreview) {
      safeStorage.setItem('vlive_user_avatar', avatarPreview);
    }
    if (country) {
      safeStorage.setItem('vlive_profile_city', country);
    }
    if (selectedInterests && selectedInterests.length > 0) {
      safeStorage.setItem('vlive_profile_interests', selectedInterests.join(', '));
    }
    safeStorage.setItem('vlive_profile_completed', 'true');
    safeStorage.setItem('vlive_has_registered', 'true');
    safeStorage.setItem('vlive_user_logged_in', 'true');
    safeStorage.setItem('vlive_permissions_prompted_once', 'true');
    safeStorage.setItem('vlive_permissions_granted', 'true');
    safeStorage.setItem('vlive_camera_permission_granted', permissions.camera ? 'true' : 'false');
    safeStorage.setItem('vlive_mic_permission_granted', permissions.microphone ? 'true' : 'false');
    safeStorage.setItem('vlive_perm_gallery_granted', permissions.gallery ? 'true' : 'false');
    safeStorage.setItem('vlive_notif_permission_granted', permissions.notifications ? 'true' : 'false');

    // Save to backend / Supabase
    try {
      await apiAuth.registerOrLoginUser(finalProfileData);
      await apiProfile.syncProfileState(finalProfileData);

      // Submit application to Admin KYC queue whenever user requests streamer status or submits gesture selfie
      if (wantToBeStreamer || capturedSelfie || gender === 'female') {
        const kycReq = {
          id: 'kyc_' + Date.now(),
          username: username.trim(),
          name: fullName.trim() || username.trim(),
          avatar: avatarPreview || '',
          idCardPhoto: avatarPreview || '', // Profile Photo
          selfiePhoto: capturedSelfie || avatarPreview || '', // Live Gesture Selfie
          docUrl: avatarPreview || '',
          videoDemoUrl: '',
          gender: gender || 'female',
          verificationType: capturedSelfie ? 'MANUAL_GESTURE_SELFIE' : 'STREAMER_APPLICATION',
          requestedPose: selectedPose?.titleFa || '✌️ ژست پپیروزی',
          aiConfidence: 'تایید دستی مدیر',
          description: wantToBeStreamer 
            ? `درخواست استریمی کاربر هنگام ثبت‌نام | ژست: ${selectedPose?.titleFa || '-'}`
            : `احراز هویت بیومتریک و ژست عکاسی: ${selectedPose?.titleFa || '-'} | کاربر خانم`,
          wantToBeStreamer: wantToBeStreamer,
          status: 'Pending',
          requestedAt: new Date().toISOString()
        };

        // Send to real backend
        import('../services/api.js').then(({ apiProfile }) => {
          apiProfile.submitKyc(kycReq);
        });
        showToast(window.loc('📩 عکس پروفایل و سلفی شما جهت بررسی و تایید دستی برای مدیریت ارسال شد.', '📩 Your profile photo and gesture selfie have been submitted for manual admin verification.'));
      }
    } catch (e) {
      console.warn('Onboarding sync note:', e);
    }

    setIsSubmitting(false);
    onComplete(finalProfileData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn dir-rtl text-right font-sans">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col my-auto">
        
        {/* TOP HEADER */}
        <div className="p-4 bg-gradient-to-r from-pink-600/30 via-purple-600/20 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-sm text-white">تکمیل پروفایل و احراز هویت دستی</h2>
              <span className="text-[10px] text-slate-400">ورود امن به جامعه اختصاصی V.LIVE</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
            {step === 'BASE_INFO' && 'گام ۱ از ۲'}
            {step === 'FEMALE_PHOTO' && 'گام ۲: گالری'}
            {step === 'FEMALE_SELFIE_POSE' && 'گام ۳: سلفی با ژست'}
            {step === 'FEMALE_STREAMER_OPTION' && 'گام نهایی'}
          </span>
        </div>

        {/* BODY CONTENT */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* ================= STEP 1: BASE INFO (ALL USERS) ================= */}
          {step === 'BASE_INFO' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Username & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-pink-400" />
                    <span>نام کاربری (Username) *</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="example: sara_stream"
                    className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 text-white font-mono text-xs outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">نام نمایشی (Display Name)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="نام یا لقب شما"
                    className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 text-white text-xs outline-none transition"
                  />
                </div>
              </div>

              {/* Age & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>سن (Age) *</span>
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="90"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 text-white font-mono text-xs outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>کشور (Country) *</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 text-white text-xs outline-none transition"
                  >
                    {AVAILABLE_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age 18 Confirmation Checkbox */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="ageCheck"
                  checked={isAgeConfirmed}
                  onChange={(e) => setIsAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="ageCheck" className="text-[11px] text-amber-200 cursor-pointer leading-relaxed">
                  تایید سن بالای ۱۸ سال 🔞
                </label>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">جنسیت (Gender) *</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition ${
                      gender === 'male' 
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">👨</span>
                    <span className="text-xs">آقا (Male)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition ${
                      gender === 'female' 
                        ? 'bg-pink-600/20 border-pink-500 text-pink-300 font-bold shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-lg">👩</span>
                    <span className="text-xs">خانم (Female)</span>
                  </button>
                </div>
              </div>

              {/* Interests Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">علایق و زمینه‌های فعالیت (حداقل ۱ مورد) *</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                          isSelected 
                            ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-bold' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* App Permissions Section (Strictly Once on First-Time Profile Completion) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-purple-500/30 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">
                      {window.loc('مجوزهای دسترسی برنامه (فقط یک‌بار در اولین ورود)', 'App System Permissions (Only Once)')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGrantAllPermissions}
                    className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/40 text-[11px] font-bold text-purple-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-purple-300" />
                    <span>{window.loc('تایید همه', 'Grant All')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* 1. Camera (Front & Back) */}
                  <div 
                    onClick={() => handleTogglePermission('camera')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      permissions.camera 
                        ? 'bg-purple-500/10 border-purple-500/50 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Camera className={`w-4 h-4 ${permissions.camera ? 'text-purple-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-[11px] block">{window.loc('دوربین (جلو و عقب)', 'Camera (Front & Rear)')}</span>
                        <span className="text-[9px] text-slate-400 block">{window.loc('پخش زنده و تماس تصویری', 'Live stream & video call')}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.camera}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-purple-500 cursor-pointer pointer-events-none"
                    />
                  </div>

                  {/* 2. Microphone */}
                  <div 
                    onClick={() => handleTogglePermission('microphone')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      permissions.microphone 
                        ? 'bg-purple-500/10 border-purple-500/50 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Mic className={`w-4 h-4 ${permissions.microphone ? 'text-pink-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-[11px] block">{window.loc('میکروفون', 'Microphone')}</span>
                        <span className="text-[9px] text-slate-400 block">{window.loc('مکالمه صوتی و صدای لایو', 'Voice call & live audio')}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.microphone}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-pink-500 cursor-pointer pointer-events-none"
                    />
                  </div>

                  {/* 3. Gallery & Media */}
                  <div 
                    onClick={() => handleTogglePermission('gallery')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      permissions.gallery 
                        ? 'bg-purple-500/10 border-purple-500/50 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Image className={`w-4 h-4 ${permissions.gallery ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-[11px] block">{window.loc('گالری و رسانه', 'Gallery & Media')}</span>
                        <span className="text-[9px] text-slate-400 block">{window.loc('انتخاب عکس پروفایل و پست‌ها', 'Profile photo & posts')}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.gallery}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-cyan-500 cursor-pointer pointer-events-none"
                    />
                  </div>

                  {/* 4. Notifications */}
                  <div 
                    onClick={() => handleTogglePermission('notifications')}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      permissions.notifications 
                        ? 'bg-purple-500/10 border-purple-500/50 text-white' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className={`w-4 h-4 ${permissions.notifications ? 'text-amber-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-[11px] block">{window.loc('نمایش اعلان‌ها', 'Notifications')}</span>
                        <span className="text-[9px] text-slate-400 block">{window.loc('پیام‌ها و هشدارهای برنامه', 'Messages & app alerts')}</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={permissions.notifications}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-amber-500 cursor-pointer pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleValidateBaseInfo}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>{gender === 'male' ? 'تایید و ورود مستقیم به برنامه 🚀' : 'مرحله بعدی: انتخاب عکس و احراز هویت 📸'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          )}

          {/* ================= STEP 2: FEMALE PHOTO FROM GALLERY ================= */}
          {step === 'FEMALE_PHOTO' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-xs text-pink-200 leading-relaxed">
                👩 کاربر گرامی، برای حفظ امنیت و کیفیت پلتفرم، بارگذاری عکس واقعی از گالری گوشی با اجازه دسترسی الزامی است.
              </div>

              {/* Gallery Access Permission Switch */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-pink-400" />
                    <div>
                      <span className="font-bold text-xs text-white block">مجوز دسترسی به گالری تصاویر گوشی</span>
                      <span className="text-[10px] text-slate-400 block">بدون این مجوز، ورود به برنامه مجاز نمی‌باشد.</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasGalleryPermission}
                    onChange={(e) => {
    const val = e.target.checked;
    setHasGalleryPermission(val);
    safeStorage.setItem('vlive_perm_gallery_granted', val ? 'true' : 'false');
  }}
                    className="w-5 h-5 rounded text-pink-600 focus:ring-pink-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Upload Box */}
              {hasGalleryPermission ? (
                <div className="space-y-3">
                  <label className="block p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-pink-500/40 hover:border-pink-400 transition cursor-pointer text-center group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileSelect}
                      className="hidden"
                    />
                    {avatarPreview ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-pink-500 shadow-lg" />
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> عکس انتخاب شد (برای تغییر کلیک کنید)
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Image className="w-10 h-10 text-pink-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-white">انتخاب عکس پروفایل از گالری گوشی 📁</span>
                        <span className="text-[10px] text-slate-400">عکس با کیفیت و چهره واضح</span>
                      </div>
                    )}
                  </label>

                  {avatarPreview ? (
                    <button
                      type="button"
                      onClick={handleProceedToSelfie}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 transition flex items-center justify-center gap-1.5"
                    >
                      <span>تایید عکس پروفایل و رفتن به گام سلفی با ژست 📸</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400">⚠️ لطفاً ابتدا یک عکس پروفایل از گالری بالا انتخاب کنید تا دکمه مرحله بعد فعال شود.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
                  <p className="text-xs font-bold text-rose-200">دسترسی به گالری تایید نشده است.</p>
                  <p className="text-[10px] text-slate-400">لطفاً برای ادامه، تیک مجوز دسترسی بالا را فعال کنید.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep('BASE_INFO')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white"
              >
                بازگشت به گام قبلی
              </button>
            </div>
          )}

          {/* ================= STEP 3: FEMALE CAMERA SELFIE WITH REQUESTED POSE / GESTURE ================= */}
          {step === 'FEMALE_SELFIE_POSE' && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Pose Instruction Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-slate-900 border border-pink-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedPose.icon}</span>
                    <div>
                      <span className="text-[10px] text-pink-300 font-bold block">دستور احراز هویت دستی مدیر:</span>
                      <h4 className="text-xs font-black text-white">{selectedPose.titleFa}</h4>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={randomizePose}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 border border-slate-700 transition"
                    title="تغییر ژست درخواستی"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>تغییر ژست</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  {selectedPose.instructionFa}
                  <span className="block text-[10px] text-amber-300/90 mt-1">
                    🛡️ این عکس برای مدیر برنامه ارسال شده و بررسی دستی انجام می‌شود.
                  </span>
                </p>
              </div>

              {/* Camera Preview / Capture Box */}
              <div className="relative rounded-3xl bg-black overflow-hidden border border-slate-800 aspect-square max-w-[280px] mx-auto flex items-center justify-center shadow-2xl">
                {capturedSelfie ? (
                  <img src={capturedSelfie} alt="Captured Gesture Selfie" className="w-full h-full object-cover" />
                ) : isCameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                    <span className="text-xs text-slate-400 block">دوربین آماده ثبت سلفی با ژست درخواستی</span>
                  </div>
                )}
              </div>

              {/* Hidden Selfie File Input */}
              <input
                ref={selfieFileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleSelfieFileSelect}
              />

              {/* Camera Controls */}
              {!capturedSelfie ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {!isCameraActive ? (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex-1 py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/30"
                      >
                        <Camera className="w-4 h-4" />
                        <span>روشن کردن دوربین زنده 📷</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={captureSelfieFromCamera}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/30"
                      >
                        <Check className="w-4 h-4" />
                        <span>ثبت سلفی با ژست {selectedPose.icon}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => selfieFileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Camera className="w-4 h-4 text-pink-400" />
                    <span>عکاسی با برنامه دوربین گوشی یا انتخاب فایل سلفی 📱</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-1 animate-fadeIn">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>سلفی با ژست «{selectedPose.titleFa}» ثبت گردید</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      عکس پروفایل و سلفی جهت تایید دستی به مدیریت ارسال خواهد شد.
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedSelfie(null);
                        startCamera();
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{window.loc('سلفی مجدد', 'Retry Selfie')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleProceedToStreamerOption}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition"
                    >
                      <span>{window.loc('مرحله بعد: وضعیت استریمر 👑', 'Next: Streamer Status 👑')}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setStep('FEMALE_PHOTO');
                }}
                className="w-full py-2 text-xs text-slate-400 hover:text-white"
              >
                بازگشت به انتخاب عکس
              </button>
            </div>
          )}

          {/* ================= STEP 4: FEMALE STREAMER OPTION & FINISH ================= */}
          {step === 'FEMALE_STREAMER_OPTION' && (
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 rounded-3xl bg-gradient-to-tr from-amber-500/10 via-purple-600/10 to-pink-500/10 border-2 border-amber-500/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/40">
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-xs text-white">درخواست مجوز اجرای لایو (Live Host)</h3>
                    <p className="text-[10px] text-slate-400">امکان دریافت هدایای مالی، برودکست زنده و روم خصوصی</p>
                  </div>
                </div>

                {/* Switch checkbox */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <label htmlFor="streamerOpt" className="text-xs font-bold text-amber-200 cursor-pointer">
                    مایلم به عنوان میزبان رسمی لایو فعالیت کنم (نیازمند تایید مدیریت)
                  </label>
                  <input
                    type="checkbox"
                    id="streamerOpt"
                    checked={wantToBeStreamer}
                    onChange={(e) => setWantToBeStreamer(e.target.checked)}
                    className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>

                <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                  {wantToBeStreamer ? (
                    <span className="text-amber-300">
                      ℹ️ با فعال کردن این گزینه، اطلاعات شما جهت تایید اجرای لایو به مدیریت ارسال می‌شود. شما می‌توانید بلافاصله وارد برنامه شوید، اما قابلیت برودکست و اجرای زنده پس از تایید مدیریت فعال خواهد شد.
                    </span>
                  ) : (
                    <span>
                      ℹ️ بدون فعال‌سازی این گزینه، به عنوان کاربر عادی وارد برنامه می‌شوید و می‌توانید در لایوها حضور داشته و تعامل داشته باشید.
                    </span>
                  )}
                </div>
              </div>

              {/* Finish Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => finishOnboarding({
                  gender: 'female',
                  is_streamer: false, // Must be approved by admin
                  kyc_status: wantToBeStreamer ? 'pending' : 'none',
                  is_verified: false,
                  status: 'approved'
                })}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black text-xs shadow-lg shadow-pink-500/40 hover:opacity-95 active:scale-98 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>در حال ذخیره و ورود...</span>
                ) : (
                  <>
                    <span>تکمیل ثبت‌نام و ورود به برنامه V.LIVE ✨</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
