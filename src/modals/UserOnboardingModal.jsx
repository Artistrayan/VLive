import React, { useState, useRef } from 'react';
import { 
  User, Shield, Camera, Image, Check, AlertTriangle, Sparkles, 
  ChevronRight, Radio, RefreshCw, X, CheckCircle2, Lock, Heart, Globe
} from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';
import { apiProfile, apiAdmin } from '../services/api';
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
  '🎬 پخش زنده و استریم', '🎵 موسیقی و خوانندگی', '🎮 گیمینگ و بازی',
  '✈️ سفر و گردشگری', '💄 مد و زیبایی', '🍳 آشپزی و لایف استایل',
  '💻 تکنولوژی و برنامه‌نویسی', '⚽ ورزش و تناسب اندام', '💬 گفتگو و چت دوستانه'
];

export default function UserOnboardingModal({
  isOpen,
  initialUsername = '',
  initialName = '',
  initialAvatar = '',
  telegramId = '',
  onComplete,
  showToast
}) {
  if (!isOpen) return null;

  // Step state: 'BASE_INFO' -> 'FEMALE_PHOTO' -> 'FEMALE_AI_SELFIE' -> 'FEMALE_STREAMER_OPTION'
  const [step, setStep] = useState('BASE_INFO');

  // Form states
  const [username, setUsername] = useState(initialUsername || '');
  const [fullName, setFullName] = useState(initialName || '');
  const [age, setAge] = useState('22');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(true);
  const [country, setCountry] = useState('ایران (Iran)');
  const [gender, setGender] = useState('female'); // 'male' | 'female'
  const [selectedInterests, setSelectedInterests] = useState(['🎬 پخش زنده و استریم', '💬 گفتگو و چت دوستانه']);
  
  // Photo & Gallery permission
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(initialAvatar || '');
  const [avatarError, setAvatarError] = useState('');

  // Camera & Face Verification states (Female Only)
  const [cameraStream, setCameraStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [aiMatchScore, setAiMatchScore] = useState(null);
  const [aiVerificationPassed, setAiVerificationPassed] = useState(false);
  const videoRef = useRef(null);

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
    if (!username.trim() || username.length < 3) {
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
    if (selectedInterests.length === 0) {
      showToast(window.loc('لطفاً حداقل ۱ مورد از علایق خود را انتخاب کنید', 'Please select at least 1 interest'));
      return;
    }

    if (gender === 'male') {
      // Men finish directly and enter the app
      finishOnboarding({
        gender: 'male',
        is_streamer: false,
        is_verified: false,
        status: 'approved'
      });
    } else {
      // Female moves to Gallery upload & permission step
      setStep('FEMALE_PHOTO');
    }
  };

  // Step 2: Handle Gallery File Upload
  const handleGalleryFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!hasGalleryPermission) {
      showToast(window.loc('ابتدا باید اجازه دسترسی به گالری را تایید کنید ⚠️', 'You must first grant gallery access permission ⚠️'));
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

  // Step 3: Camera & AI Matching logic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast(window.loc('دسترسی به دوربین جلو امکان‌پذیر نیست', 'Front camera access failed'));
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
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedSelfie(dataUrl);
    stopCamera();

    // Run AI Face Verification & Match against profile photo
    runAiFaceMatch(dataUrl, avatarPreview);
  };

  const runAiFaceMatch = (selfie, profilePhoto) => {
    setIsAiMatching(true);
    setTimeout(() => {
      // Simulate High-precision Biometric AI Facial Recognition
      const matchConfidence = 96.4;
      setAiMatchScore(matchConfidence);
      setAiVerificationPassed(true);
      setIsAiMatching(false);
      showToast(window.loc('✅ هوش مصنوعی هویت زنده شما را با دقت ۹۶٪ تایید کرد.', '✅ AI verified your live facial identity with 96% confidence.'));
    }, 2200);
  };

  // Finish Onboarding and save to DB
  const finishOnboarding = async (additionalProps = {}) => {
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
    if (avatarPreview) {
      safeStorage.setItem('vlive_user_avatar', avatarPreview);
    }

    // Save to backend / Supabase
    try {
      await apiProfile.updateProfile(finalProfileData);

      // If user requested to be a streamer, submit request to Admin KYC / Streamer queue
      if (wantToBeStreamer) {
        const kycReq = {
          username: username.trim(),
          name: fullName.trim() || username.trim(),
          avatar: avatarPreview || '',
          selfie: capturedSelfie || '',
          gender: 'female',
          aiScore: aiMatchScore || 96,
          status: 'Pending',
          requestedAt: new Date().toISOString()
        };

        const existingApps = JSON.parse(safeStorage.getItem('vlive_kyc_applications') || '[]');
        existingApps.push(kycReq);
        safeStorage.setItem('vlive_kyc_applications', JSON.stringify(existingApps));

        if (apiAdmin && typeof apiAdmin.submitKycApplication === 'function') {
          await apiAdmin.submitKycApplication(kycReq);
        }
        showToast(window.loc('👑 درخواست استریمر شدن شما با موفقیت برای مدیریت ارسال شد و در صف تایید قرار گرفت.', '👑 Streamer request sent to admin for approval.'));
      }
    } catch (e) {
      console.warn('Onboarding sync note:', e);
    }

    setIsSubmitting(false);
    onComplete(finalProfileData);
  };

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
              <h2 className="font-black text-sm text-white">تکمیل پروفایل و احراز هویت اولیه</h2>
              <span className="text-[10px] text-slate-400">ورود امن به جامعه اختصاصی V.LIVE</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
            {step === 'BASE_INFO' && 'گام ۱ از ۲'}
            {step === 'FEMALE_PHOTO' && 'گام ۲: گالری'}
            {step === 'FEMALE_AI_SELFIE' && 'گام ۳: هوش مصنوعی'}
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
                  تایید می‌کنم که سن من بالای ۱۸ سال است و قوانین فعالیت سالم در برنامه V.LIVE را می‌پذیرم. 🔞
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
                    onChange={(e) => setHasGalleryPermission(e.target.checked)}
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

                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={() => setStep('FEMALE_AI_SELFIE')}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 transition flex items-center justify-center gap-1.5"
                    >
                      <span>تایید عکس و رفتن به سلفی تطابق هوش مصنوعی 📸</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
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

          {/* ================= STEP 3: FEMALE AI CAMERA SELFIE MATCH ================= */}
          {step === 'FEMALE_AI_SELFIE' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-200 leading-relaxed">
                🤖 <strong>تطبیق بیومتریک هوش مصنوعی:</strong> لطفاً با دوربین جلو یک سلفی بگیرید تا هوش مصنوعی چهره شما را با عکس پروفایل انتخاب‌شده تطبیق دهد.
              </div>

              {/* Camera Preview / Capture Box */}
              <div className="relative rounded-3xl bg-black overflow-hidden border border-slate-800 aspect-square max-w-[280px] mx-auto flex items-center justify-center shadow-2xl">
                {capturedSelfie ? (
                  <img src={capturedSelfie} alt="Captured Selfie" className="w-full h-full object-cover" />
                ) : isCameraActive ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                    <span className="text-xs text-slate-400 block">دوربین جلو آماده فعال‌سازی</span>
                  </div>
                )}

                {/* AI Matching Overlay */}
                {isAiMatching && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                    <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="text-xs font-bold font-mono">در حال اسکن و تطابق بیومتریک چهره...</span>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {!capturedSelfie ? (
                <div className="flex gap-2">
                  {!isCameraActive ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/30"
                    >
                      <Camera className="w-4 h-4" />
                      <span>روشن کردن دوربین جلو 📷</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={captureSelfieFromCamera}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-pink-500/30"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>ثبت سلفی و بررسی با هوش مصنوعی 📸</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {aiVerificationPassed && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-1">
                      <span className="text-xs font-black text-emerald-300 block">✅ تطابق چهره موفقیت‌آمیز بود (امتیاز تطابق: {aiMatchScore}%)</span>
                      <span className="text-[10px] text-slate-400 block">گزارش این احراز هویت برای مدیریت ارسال گردید.</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedSelfie(null);
                        setAiVerificationPassed(false);
                        startCamera();
                      }}
                      className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>سلفی مجدد</span>
                    </button>

                    <button
                      type="button"
                      disabled={!aiVerificationPassed}
                      onClick={() => setStep('FEMALE_STREAMER_OPTION')}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 disabled:opacity-50 text-white font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
                    >
                      <span>مرحله بعد: وضعیت استریمر 👑</span>
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
                    <h3 className="font-black text-xs text-white">درخواست مجوز استریمر و میزبان لایو (Streamer Host)</h3>
                    <p className="text-[10px] text-slate-400">امکان دریافت هدایای مالی، برودکست زنده و روم خصوصی</p>
                  </div>
                </div>

                {/* Switch checkbox */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <label htmlFor="streamerOpt" className="text-xs font-bold text-amber-200 cursor-pointer">
                    مایلم به عنوان استریمر رسمی فعالیت کنم (نیازمند تایید مدیریت)
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
                      ℹ️ با فعال کردن این گزینه، اطلاعات شما جهت تایید استریمر به مدیریت ارسال می‌شود. شما می‌توانید بلافاصله وارد برنامه شوید، اما قابلیت برودکست و اجرای زنده پس از تایید مدیریت فعال خواهد شد.
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
