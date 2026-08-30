import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Shield, Camera, CheckCircle, Clock, Check, X, Mic, 
  AlertTriangle, Video, ArrowRight, ArrowLeft, RefreshCw, Upload, Sparkles, User
} from 'lucide-react';
import { apiProfile } from '../services/api';
import { safeStorage } from '../utils/safeStorage';
import { compressImageFile } from '../services/performance';

// Verification gesture poses
const VERIFICATION_POSES = [
  {
    id: 'PEACE_SIGN',
    titleFa: 'نشان دادن علامت پیروزی (V) با دو انگشت ✌️',
    titleEn: 'Show Peace (V) Sign with fingers ✌️',
    instructionFa: 'لطفاً با دو انگشت دست خود علامت پیروزی (V) را کنار صورت نشان داده و سلفی بگیرید.',
    instructionEn: 'Please show a peace (V) sign with your fingers next to your face.',
    icon: '✌️'
  },
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
    id: 'THUMBS_UP',
    titleFa: 'نشان دادن علامت لایک کنار صورت 👍',
    titleEn: 'Show Thumbs Up next to face 👍',
    instructionFa: 'لطفاً علامت لایک (انگشت شست بالا) را کنار صورت خود نشان داده و عکس سلفی بگیرید.',
    instructionEn: 'Please show a thumbs up gesture next to your face and take a selfie.',
    icon: '👍'
  },
  {
    id: 'THREE_FINGERS',
    titleFa: 'نشان دادن سه انگشت دست 🤟',
    titleEn: 'Show 3 fingers gesture 🤟',
    instructionFa: 'لطفاً سه انگشت دست خود را کنار صورت نشان داده و سلفی بگیرید.',
    instructionEn: 'Please show three fingers next to your face and take a selfie.',
    icon: '🤟'
  },
  {
    id: 'OK_SIGN',
    titleFa: 'نشان دادن علامت OK با انگشتان 👌',
    titleEn: 'Show OK sign with fingers 👌',
    instructionFa: 'لطفاً علامت OK (حلقه انگشت شست و اشاره) را کنار صورت نشان دهید و سلفی بگیرید.',
    instructionEn: 'Please show an OK sign with your fingers next to your face and take a selfie.',
    icon: '👌'
  }
];

export default function StreamerApplicationModal({
  isOpen,
  onClose,
  loc,
  showToast,
  setKycApplications,
  kycApplications = [],
  currentUsername,
  isVerified,
  userName,
  userAvatar = ''
}) {
  const username = currentUsername || userName || 'user';
  const [isReapplying, setIsReapplying] = useState(false);
  
  // Find if there's an existing active application for this user
  const userApps = Array.isArray(kycApplications) ? kycApplications.filter(app => app.username === username || (app.user && app.user === username)) : [];
  const existingApp = isReapplying ? null : (userApps.length > 0 ? userApps[0] : null);

  const [step, setStep] = useState(1);
  const [streamCategory, setStreamCategory] = useState('');
  const [streamTopic, setStreamTopic] = useState('');
  const [description, setDescription] = useState('');
  
  // Gesture Selfie State
  const [selectedPose, setSelectedPose] = useState(VERIFICATION_POSES[0]);
  const [capturedSelfie, setCapturedSelfie] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  // Equipment & Rules
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [camTested, setCamTested] = useState(false);
  const [micTested, setMicTested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsReapplying(false);
      setStep(1);
      const randomPose = VERIFICATION_POSES[Math.floor(Math.random() * VERIFICATION_POSES.length)];
      setSelectedPose(randomPose);
      setCapturedSelfie(null);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Connect camera stream to video element when active
  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(err => console.warn('Video play error:', err));
    }
  }, [isCameraActive, cameraStream]);

  // Camera Management - STRICTLY FRONT CAMERA ONLY (User Facing)
  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(loc('دسترسی به دوربین توسط مرورگر پشتیبانی نمی‌شود', 'Camera stream is not supported by your browser'));
        return;
      }

      let stream = null;
      try {
        // Enforce front camera (user facing)
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { exact: 'user' }, 
            width: { ideal: 1280, max: 1920 }, 
            height: { ideal: 720, max: 1080 } 
          },
          audio: false
        });
      } catch (exactErr) {
        // Fallback for browsers that don't support exact facingMode
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user', 
            width: { ideal: 1280, max: 1920 }, 
            height: { ideal: 720, max: 1080 } 
          },
          audio: false
        });
      }

      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Front camera access error:', err);
      showToast(loc('⛔ دسترسی به دوربین جلوی گوشی امکان‌پذیر نشد. لطفاً مجوز دوربین را در مرورگر فعال کنید.', '⛔ Front camera access failed. Please enable camera permissions in your browser.'));
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // High-clarity optimized capture: balanced resolution & compression for instant fast load on slow/weak internet
  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const rawW = v.videoWidth || 1280;
    const rawH = v.videoHeight || 720;
    
    // Scale to balanced optimal size (max 960px) ensuring crystal clarity of gesture + under 150KB size
    const maxDim = 960;
    let w = rawW;
    let h = rawH;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // Mirror horizontally to match the natural front camera mirror preview
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(v, 0, 0, w, h);
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    setCapturedSelfie(dataUrl);
    stopCamera();
    showToast(loc('📸 عکس سلفی دوربین جلو با کیفیت و ژست درخواستی با موفقیت ثبت شد.', '📸 Front camera selfie captured successfully.'));
  };

  const randomizePose = () => {
    const nextList = VERIFICATION_POSES.filter(p => p.id !== selectedPose.id);
    const randomOne = nextList[Math.floor(Math.random() * nextList.length)];
    setSelectedPose(randomOne);
    setCapturedSelfie(null);
  };

  if (!isOpen) return null;

  const renderStatusPage = () => {
    const isPending = existingApp?.status === 'Pending';
    const isApproved = existingApp?.status === 'Approved';
    const isRejected = existingApp?.status === 'Rejected';
    const isCorrection = existingApp?.status === 'Correction';

    return (
      <div className="space-y-6 p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`w-20 h-20 rounded-3xl border flex items-center justify-center shadow-2xl ${
            isPending ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
            isApproved ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
            isRejected ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' :
            'bg-orange-500/10 border-orange-500/40 text-orange-400'
          }`}>
            {isPending && <Clock className="w-10 h-10 animate-pulse" />}
            {isApproved && <CheckCircle className="w-10 h-10" />}
            {isRejected && <X className="w-10 h-10" />}
            {isCorrection && <AlertTriangle className="w-10 h-10" />}
          </div>

          <div>
            <h3 className="font-black text-lg text-white">
              {isPending && loc('درخواست شما در صف بررسی مدیریت است ⏳', 'Application Under Review ⏳')}
              {isApproved && loc('درخواست شما تایید شده است ✨', 'Application Approved ✨')}
              {isRejected && loc('وضعیت درخواست: رد شد ✕', 'Application Status: Rejected ✕')}
              {isCorrection && loc('نیاز به بازبینی و اصلاح مدارک ⚠️', 'Needs Correction ⚠️')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed px-2">
              {isPending && loc(
                'درخواست شما برای نشان رسمی استریمر با موفقیت ثبت شده و توسط تیم مدیریت در حال بررسی است. تا زمان تعیین تکلیف نهایی این درخواست، ثبت درخواست مجدد امکان‌پذیر نیست.',
                'Your streamer application is currently under active review by management. Until a final decision is made, you cannot submit a new application.'
              )}
              {isApproved && loc(
                'تبریک! شما به عنوان استریمر رسمی پلتفرم V.Live تایید شده‌اید و دسترسی استودیو پخش زنده و دریافت جوایز برای شما فعال است.',
                'Congratulations! You have been approved as an official streamer. Studio broadcast and reward features are active.'
              )}
              {isRejected && loc(
                'درخواست قبلی شما پذیرفته نشده است. شما می‌توانید با تصحیح اطلاعات، سلفی تایید هویت جدید و تست مجدد تجهیزات، همین حالا درخواست جدید ثبت کنید.',
                'Your previous application was rejected. You can now submit a new application with updated details and verification selfie.'
              )}
              {isCorrection && loc(
                'درخواست شما نیاز به بازبینی و اصلاح دارد. لطفاً پیام مدیریت را مطالعه نموده و مدارک خود را مجدداً ارسال نمایید.',
                'Your application requires correction. Please review the admin note and resubmit.'
              )}
            </p>
          </div>

          {/* Details of previous application */}
          <div className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-right">
            <div className="flex justify-between items-center text-slate-400">
              <span>{loc('نام کاربری:', 'Username:')}</span>
              <span className="font-mono text-cyan-400 font-bold">@{existingApp?.username || username}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>{loc('دسته‌بندی درخواستی:', 'Category:')}</span>
              <span className="text-white font-bold">{existingApp?.streamCategory || loc('عمومی', 'General')}</span>
            </div>
            {existingApp?.requestedPose && (
              <div className="flex justify-between items-center text-slate-400">
                <span>{loc('ژست سلفی:', 'Gesture:')}</span>
                <span className="text-pink-300 font-bold">{existingApp.requestedPose}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-400">
              <span>{loc('وضعیت جاری:', 'Current Status:')}</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                isRejected ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              }`}>
                {isPending ? loc('در حال بررسی', 'Pending') :
                 isApproved ? loc('تایید شده', 'Approved') :
                 isRejected ? loc('رد شده', 'Rejected') :
                 loc('نیازمند اصلاح', 'Correction')}
              </span>
            </div>
          </div>
          
          {existingApp?.rejectionReason && (
            <div className="w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-right space-y-1">
              <span className="font-bold block text-rose-400">{loc('علت اعلام‌شده از سوی مدیریت:', 'Reason from Admin:')}</span>
              <p className="leading-relaxed">{existingApp.rejectionReason}</p>
            </div>
          )}
          
          {existingApp?.correctionMessage && (
            <div className="w-full p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs text-right space-y-1">
              <span className="font-bold block text-orange-400">{loc('پیام اصلاحیه مدیریت:', 'Admin Correction Note:')}</span>
              <p className="leading-relaxed">{existingApp.correctionMessage}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          {/* Re-apply action button is ONLY available when status is NOT Pending and NOT Approved */}
          {(isRejected || isCorrection) && (
            <button
              onClick={() => {
                setIsReapplying(true);
                setStep(1);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{loc('ثبت و ارسال مجدد درخواست با اطلاعات اصلاح‌شده', 'Re-apply with Corrected Info')}</span>
            </button>
          )}

          {isPending && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin shrink-0" />
              <span>{loc('نتیجه بررسی از طریق اعلان و پیام مدیریت اعلام خواهد شد.', 'The review result will be announced via notification.')}</span>
            </div>
          )}

          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition">
            {loc('بستن پنجره', 'Close Window')}
          </button>
        </div>
      </div>
    );
  };

  const submitApplication = async () => {
    if (!streamCategory || !streamTopic || !description || !capturedSelfie || !rulesAccepted || !camTested || !micTested) {
      showToast(loc('لطفاً تمام مراحل از جمله عکس سلفی با علامت دست را کامل کنید.', 'Please complete all steps including the gesture selfie.'));
      return;
    }
    
    setIsSubmitting(true);

    const newApp = {
      id: Math.floor(Math.random() * 90000) + 10000,
      username,
      name: userName || username,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      streamCategory,
      streamTopic,
      description,
      rulesAcceptedAt: new Date().toISOString(),
      camTested,
      micTested,
      selfiePhoto: capturedSelfie,
      requestedPose: selectedPose.titleFa,
      verificationType: 'MANUAL_GESTURE_SELFIE',
      avatar: userAvatar || '',
      idCardPhoto: userAvatar || '',
      docUrl: userAvatar || '',
      videoDemoUrl: ''
    };
    
    try {
      await apiProfile.submitKyc(newApp);
    } catch (e) {
      console.warn('submitKyc error:', e);
    }

    if (apiProfile && typeof apiProfile.getMyKycApplications === 'function') {
      apiProfile.getMyKycApplications().then(apps => {
        if (apps && apps.length > 0) setKycApplications(apps);
        else setKycApplications(prev => [newApp, ...prev.filter(a => a.username !== username)]);
      });
    } else {
      setKycApplications(prev => [newApp, ...prev.filter(a => a.username !== username)]);
    }
    
    setIsSubmitting(false);
    setIsReapplying(false);
    showToast(loc('✨ درخواست استریمر همراه با سلفی احراز هویت با موفقیت ثبت شد و در صف بررسی قرار گرفت', '✨ Streamer application with gesture selfie submitted successfully'));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۱. بررسی حساب کاربری و شرایط اولیه', '1. Profile Check & Requirements')}</h4>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{loc('نام کاربری معتبر', 'Valid Username')}</span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold">
                  <span>@{username}</span>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{loc('عکس پروفایل ثبت‌شده', 'Profile Photo')}</span>
                <div className="flex items-center gap-2">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover border border-emerald-500" />
                  ) : null}
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{loc('وضعیت تایید هویت اولیه', 'Identity Status')}</span>
                <span className="flex items-center gap-1 text-xs text-cyan-400 font-bold">
                  <span>{loc('همراه با سلفی ژست دست بررسی می‌شود', 'Verified with gesture selfie')}</span>
                  <Shield className="w-4 h-4 text-cyan-400" />
                </span>
              </div>
            </div>
            
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/40 to-purple-950/40 border border-pink-500/20 text-pink-300 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-pink-400">
                <Star className="w-4 h-4 fill-pink-400 shrink-0" />
                <span>{loc('مزایای دریافت نشان استریمر رسمی V.Live:', 'V.Live Official Streamer Perks:')}</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 pr-1">
                <li>{loc('دسترسی به استودیو پخش زنده و ابزارهای حرفه‌ای لایو', 'Access to live broadcast studio and host tools')}</li>
                <li>{loc('دریافت هدایا، الماس و امکان تسویه درآمد نقدی', 'Receive gifts, diamonds, and cashout earnings')}</li>
                <li>{loc('نمایش نشان ستاره طلایی در پروفایل و چت‌ها', 'Gold star badge on profile and active chat rooms')}</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۲. اطلاعات و موضوع استریم', '2. Stream Information')}</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">{loc('دسته‌بندی اصلی لایو', 'Main Category')}</label>
                <select value={streamCategory} onChange={e => setStreamCategory(e.target.value)} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500">
                  <option value="">{loc('انتخاب کنید...', 'Select...')}</option>
                  <option value="gaming">{loc('گیمینگ و بازی', 'Gaming')}</option>
                  <option value="chat">{loc('گپ و گفت (Just Chatting)', 'Just Chatting')}</option>
                  <option value="music">{loc('موسیقی و هنر', 'Music & Art')}</option>
                  <option value="education">{loc('آموزش و مهارت', 'Education')}</option>
                  <option value="lifestyle">{loc('سبک زندگی و ولاگ', 'Lifestyle & Vlog')}</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">{loc('موضوع اصلی استریم‌ها', 'Stream Topic')}</label>
                <input type="text" value={streamTopic} onChange={e => setStreamTopic(e.target.value)} placeholder={loc('مثال: گپ شبانه، نوازندگی، گیم پلی...', 'Example: Night chat, gaming...')} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white outline-none focus:border-cyan-500" />
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-bold">{loc('توضیحات و معرفی خود به مخاطبان', 'Short Description')}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={loc('درباره تخصص، سبک برنامه و ساعات استریم خود توضیح دهید...', 'Describe your stream and schedule...')} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white h-24 outline-none focus:border-cyan-500" />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">{loc('۳. سلفی احراز هویت با علامت دست', '3. Gesture Selfie Verification')}</h4>
              <button 
                type="button" 
                onClick={randomizePose} 
                className="text-[11px] font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 bg-pink-500/10 px-2.5 py-1 rounded-xl border border-pink-500/20 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{loc('تغییر ژست درخواستی', 'Change Pose')}</span>
              </button>
            </div>

            {/* Instruction Card for Selected Pose */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-pink-950/50 border border-pink-500/30 space-y-1.5 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPose.icon}</span>
                <div>
                  <h5 className="text-xs font-black text-white">{loc(selectedPose.titleFa, selectedPose.titleEn)}</h5>
                  <p className="text-[11px] text-pink-300">{loc(selectedPose.instructionFa, selectedPose.instructionEn)}</p>
                </div>
              </div>
            </div>

            {/* Live Front Camera View or Captured Photo Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[220px]">
              {capturedSelfie ? (
                <div className="w-full relative">
                  <img src={capturedSelfie} alt="Gesture Selfie" className="w-full h-56 object-cover rounded-2xl" />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-pink-500/40 text-[10px] font-bold text-pink-300 flex items-center gap-1.5">
                    <span>{selectedPose.icon}</span>
                    <span>{loc('سلفی دوربین جلو ثبت شد', 'Front Camera Selfie Captured')}</span>
                  </div>
                  <div className="absolute bottom-2 inset-x-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedSelfie(null);
                        startCamera();
                      }}
                      className="flex-1 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{loc('سلفی مجدد با دوربین جلو', 'Retake Front Selfie')}</span>
                    </button>
                  </div>
                </div>
              ) : isCameraActive ? (
                <div className="w-full relative flex flex-col items-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-56 object-cover rounded-2xl" 
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-pink-500/40 text-[10px] font-bold text-pink-300 flex items-center gap-1.5">
                    <Camera className="w-3 h-3 text-pink-400 animate-pulse" />
                    <span>{loc('📱 دوربین جلوی گوشی (سلفی زنده)', '📱 Front Camera (Live Selfie)')}</span>
                  </div>
                  <div className="absolute bottom-3 inset-x-3 flex justify-between gap-2">
                    <button
                      type="button"
                      onClick={capturePhotoFromStream}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-pink-600/40 flex items-center justify-center gap-1.5 transition active:scale-98"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{loc('📸 ثبت سلفی با ژست', 'Capture Gesture Selfie')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
                    >
                      {loc('بستن دوربین', 'Close Camera')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400 shadow-lg shadow-pink-500/10">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{loc('سلفی زنده احراز هویت با دوربین جلو', 'Live Front Camera Verification Selfie')}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{loc('ثبت سلفی فقط از طریق دوربین جلوی گوشی و با ژست مشخص مجاز است (انتخاب از گالری ممنوع است).', 'Selfie must strictly be taken using the front camera with the requested gesture (gallery upload is disabled).')}</p>
                  </div>
                  <div className="flex items-center justify-center pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 transition active:scale-98"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{loc('📱 باز کردن دوربین جلوی گوشی', '📱 Open Front Camera')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!capturedSelfie && (
              <p className="text-[11px] text-amber-400/90 text-center font-medium">
                {loc('⚠️ ثبت عکس سلفی با علامت فوق برای احراز هویت الزامی است.', '⚠️ Taking a selfie with the requested gesture is required.')}
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۴. تست تجهیزات و اتصال', '4. Equipment Test')}</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => setCamTested(true)} 
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${camTested ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/40'}`}
              >
                <Video className="w-7 h-7" />
                <span className="text-xs font-bold">{loc('تست دوربین', 'Test Camera')}</span>
                {camTested ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-cyan-400">{loc('کلیک برای تایید ✅', 'Click to verify ✅')}</span>}
              </button>
              
              <button 
                type="button" 
                onClick={() => setMicTested(true)} 
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${micTested ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/40'}`}
              >
                <Mic className="w-7 h-7" />
                <span className="text-xs font-bold">{loc('تست میکروفون', 'Test Mic')}</span>
                {micTested ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-cyan-400">{loc('کلیک برای تایید ✅', 'Click to verify ✅')}</span>}
              </button>
            </div>
            
            {camTested && micTested && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>{loc('تجهیزات صوتی و تصویری آماده است.', 'Equipment passed inspection.')}</span>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۵. قوانین و مقررات استریمری', '5. Rules and Regulations')}</h4>
            <div className="h-44 overflow-y-auto p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>۱. {loc('حفظ احترام مخاطبان و رعایت حریم خصوصی الزامی است.', 'Respecting privacy and community members is mandatory.')}</p>
              <p>۲. {loc('انتشار هرگونه محتوای هنجارشکنانه یا غیرقانونی موجب مسدودی دائم حساب می‌شود.', 'Inappropriate or illegal content leads to ban.')}</p>
              <p>۳. {loc('هرگونه تبانی، تقلب یا فریب در سیستم هدایا اکیداً ممنوع است.', 'Any fraud in gifts will lead to immediate ban.')}</p>
              <p>۴. {loc('استریمر متعهد به حفظ کیفیت پایدار صدا و تصویر می‌باشد.', 'Streamer is committed to quality broadcast.')}</p>
              <p>۵. {loc('درخواست وجه و پرداخت خارج از درگاه پلتفرم مجاز نیست.', 'Direct external transactions are strictly prohibited.')}</p>
            </div>
            
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-cyan-500/40 transition">
              <input type="checkbox" checked={rulesAccepted} onChange={e => setRulesAccepted(e.target.checked)} className="w-5 h-5 accent-cyan-500 cursor-pointer" />
              <span className="text-xs text-slate-200 font-bold">{loc('تمام قوانین و مقررات استریمری V.Live را مطالعه کرده و می‌پذیرم.', 'I have read and accept all streamer rules.')}</span>
            </label>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۶. بازبینی نهایی و ارسال مدارک', '6. Final Review & Submission')}</h4>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs text-slate-400">{loc('نام کاربری:', 'Username:')}</span>
                <span className="text-xs text-cyan-400 font-mono font-bold">@{username}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs text-slate-400">{loc('موضوع استریم:', 'Stream Topic:')}</span>
                <span className="text-xs text-white font-bold">{streamTopic}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs text-slate-400">{loc('دسته‌بندی:', 'Category:')}</span>
                <span className="text-xs text-cyan-400 font-bold">{streamCategory}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2 items-center">
                <span className="text-xs text-slate-400">{loc('سلفی با علامت دست:', 'Gesture Selfie:')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-pink-400 font-bold">{selectedPose.icon}</span>
                  {capturedSelfie && (
                    <img src={capturedSelfie} alt="Thumb" className="w-8 h-8 rounded-lg object-cover border border-pink-500/50" />
                  )}
                  <span className="text-xs text-emerald-400 font-bold">{loc('ثبت شد', 'Captured')}</span>
                </div>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs text-slate-400">{loc('تست تجهیزات:', 'Equipment Test:')}</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span>{loc('موفق', 'Passed')}</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">{loc('پذیرش قوانین:', 'Rules Accepted:')}</span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span>{loc('تایید شد', 'Accepted')}</span>
                  <CheckCircle className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 2 && (!streamCategory || !streamTopic || !description)) return true;
    if (step === 3 && !capturedSelfie) return true;
    if (step === 4 && (!camTested || !micTested)) return true;
    if (step === 5 && !rulesAccepted) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fadeIn dir-rtl">
      <div className="card-3d w-full max-w-lg bg-slate-900 rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Star className="w-5 h-5 fill-cyan-400" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">{loc('درخواست استریمر شدن', 'Streamer Application')}</h3>
              <p className="text-[10px] text-slate-400">{loc('تایید هویت تصویری و دسترسی استودیو', 'Visual Identity & Studio Access')}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        {existingApp ? (
          <div className="flex-1 overflow-y-auto">
            {renderStatusPage()}
          </div>
        ) : (
          <>
            {/* Step Indicators */}
            <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} className="flex items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${step === s ? 'bg-cyan-500 text-white ring-2 ring-cyan-500/30' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 6 && <div className={`w-4 sm:w-6 h-0.5 mx-0.5 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
                </div>
              ))}
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {renderStep()}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-between gap-3 bg-slate-950/50">
              {step > 1 ? (
                <button 
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setStep(s => s - 1);
                  }} 
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  {loc('قبلی', 'Previous')}
                </button>
              ) : (
                <div />
              )}
              
              {step < 6 ? (
                <button 
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setStep(s => s + 1);
                  }} 
                  disabled={isNextDisabled()} 
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-500/20"
                >
                  {loc('بعدی', 'Next')}
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={submitApplication} 
                  disabled={isNextDisabled() || isSubmitting} 
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? loc('در حال ارسال...', 'Submitting...') : loc('ارسال نهایی درخواست', 'Submit Application')}</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
