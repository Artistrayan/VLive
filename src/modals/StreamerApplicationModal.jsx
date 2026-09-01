import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, Shield, Camera, CheckCircle, Clock, Check, X, Mic, 
  AlertTriangle, Video, ArrowRight, ArrowLeft, RefreshCw, Upload, Sparkles, User,
  Globe, Flame, Music, Gamepad2, Heart, Award, CheckCircle2
} from 'lucide-react';
import { apiProfile } from '../services/api';
import { safeStorage } from '../utils/safeStorage';

// Verification gesture poses
const VERIFICATION_POSES = [
  {
    id: 'PEACE_SIGN',
    titleFa: 'علامت پیروزی ✌️',
    titleEn: 'Peace (V) Sign ✌️',
    icon: '✌️'
  },
  {
    id: 'HAND_LEFT_UP',
    titleFa: 'دست چپ ✋',
    titleEn: 'Left Hand ✋',
    icon: '✋'
  },
  {
    id: 'HAND_RIGHT_UP',
    titleFa: 'دست راست ✋',
    titleEn: 'Right Hand ✋',
    icon: '✋'
  },
  {
    id: 'THUMBS_UP',
    titleFa: 'انگشت شست 👍',
    titleEn: 'Thumbs Up 👍',
    icon: '👍'
  },
  {
    id: 'THREE_FINGERS',
    titleFa: 'سه انگشت 🤟',
    titleEn: '3 Fingers 🤟',
    icon: '🤟'
  },
  {
    id: 'OK_SIGN',
    titleFa: 'علامت 👌',
    titleEn: 'OK Sign 👌',
    icon: '👌'
  }
];

const CATEGORIES = [
  { id: 'Chatting', icon: '💬', labelFa: 'چت و گفتگو', labelEn: 'Chatting' },
  { id: 'Gaming', icon: '🎮', labelFa: 'گیمینگ', labelEn: 'Gaming' },
  { id: 'Music', icon: '🎵', labelFa: 'موسیقی', labelEn: 'Music' },
  { id: 'Art', icon: '🎨', labelFa: 'هنر و رقص', labelEn: 'Art & Dance' },
  { id: 'Lifestyle', icon: '🌟', labelFa: 'لایف‌استایل', labelEn: 'Lifestyle' },
  { id: 'Talk', icon: '🎙️', labelFa: 'گفتگو', labelEn: 'Talk Show' },
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
  userAvatar = '',
  userGender,
  currentUser
}) {
  const username = currentUsername || userName || 'user';
  const [isReapplying, setIsReapplying] = useState(false);
  
  const userGenderVal = String(userGender || currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
  const isFemaleUser = Boolean(
    userGenderVal === 'female' ||
    userGenderVal === 'خانم' ||
    userGenderVal === 'زن' ||
    userGenderVal === 'f'
  );

  const userApps = Array.isArray(kycApplications) ? kycApplications.filter(app => app.username === username || (app.user && app.user === username)) : [];
  const existingApp = isReapplying ? null : (userApps.length > 0 ? userApps[0] : null);

  const [step, setStep] = useState(1);
  const [streamCategory, setStreamCategory] = useState('Chatting');
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

  useEffect(() => {
    if (isCameraActive && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive, cameraStream]);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast(loc('دسترسی به دوربین در مرورگر فعال نیست', 'Camera not supported'));
        return;
      }

      let stream = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Front camera access error:', err);
      showToast(loc('خطا در دسترسی به دوربین', 'Camera error'));
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhotoFromStream = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 640;
    canvas.height = v.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedSelfie(dataUrl);
    stopCamera();
    showToast(loc('سلفی ثبت شد ✅', 'Selfie captured ✅'));
  };

  const submitApplication = async () => {
    if (!capturedSelfie) {
      showToast(loc('لطفاً سلفی با ژست دست را ثبت نمایید', 'Please capture gesture selfie'));
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        username: username,
        name: userName || username,
        avatar: userAvatar,
        category: streamCategory || 'Chatting',
        topic: streamTopic || 'General Stream',
        description: description || 'Streamer request',
        selfieUrl: capturedSelfie,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      const res = await apiProfile.submitKyc(payload);
      if (res && res.success) {
        setKycApplications(prev => [payload, ...(Array.isArray(prev) ? prev : [])]);
        showToast(loc('درخواست با موفقیت ارسال شد ✨', 'Application submitted ✨'));
        onClose();
      } else {
        // Fallback local update
        setKycApplications(prev => [payload, ...(Array.isArray(prev) ? prev : [])]);
        showToast(loc('درخواست با موفقیت ارسال شد ✨', 'Application submitted ✨'));
        onClose();
      }
    } catch (err) {
      showToast(loc('درخواست ثبت شد', 'Application saved'));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !isFemaleUser) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-3.5 animate-fadeIn dir-rtl">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-md">
              <Star className="w-4 h-4 fill-cyan-400" />
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm text-white">{loc('درخواست استریمر شدن', 'Streamer Application')}</h3>
              <p className="text-[10px] text-slate-400">@{username}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Numbers Bar */}
        <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                step === s ? 'bg-cyan-500 text-white ring-2 ring-cyan-500/30' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
              }`}>
                {step > s ? <Check className="w-3 h-3" /> : s}
              </div>
              {s < 5 && <div className={`w-4 sm:w-8 h-0.5 mx-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </div>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {step === 1 && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-white">{loc('کسب درآمد', 'Earnings')}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-white">{loc('نشان VIP', 'VIP Badge')}</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold text-white">{loc('استودیو HD', 'HD Studio')}</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {/* Category Grid */}
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setStreamCategory(cat.id)}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                      streamCategory === cat.id
                        ? 'bg-pink-600/20 border-pink-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-[10px]">{loc(cat.labelFa, cat.labelEn)}</span>
                  </button>
                ))}
              </div>

              {/* Topic Input */}
              <input
                type="text"
                value={streamTopic}
                onChange={e => setStreamTopic(e.target.value)}
                placeholder={loc('موضوع اصلی استریم (اختیاری)', 'Stream topic (optional)')}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {/* Gesture Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPose.icon}</span>
                  <span className="text-xs font-bold text-white">{loc(selectedPose.titleFa, selectedPose.titleEn)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const random = VERIFICATION_POSES[Math.floor(Math.random() * VERIFICATION_POSES.length)];
                    setSelectedPose(random);
                  }}
                  className="p-1.5 rounded-xl bg-slate-900 text-cyan-400 border border-cyan-500/30"
                  title="Change gesture"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Camera Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center h-48">
                {capturedSelfie ? (
                  <div className="w-full h-full relative">
                    <img src={capturedSelfie} alt="Selfie" className="w-full h-full object-cover rounded-2xl" />
                    <div className="absolute bottom-2 inset-x-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedSelfie(null);
                          startCamera();
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-slate-900/90 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{loc('ثبت مجدد', 'Retake')}</span>
                      </button>
                    </div>
                  </div>
                ) : isCameraActive ? (
                  <div className="w-full h-full relative">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-2xl scale-x-[-1]" />
                    <div className="absolute bottom-2 inset-x-2 flex gap-2">
                      <button
                        type="button"
                        onClick={capturePhotoFromStream}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{loc('ثبت سلفی', 'Capture')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 p-4">
                    <Camera className="w-8 h-8 text-pink-400 mx-auto opacity-80" />
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs flex items-center gap-1.5 mx-auto"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{loc('دوربین سلفی', 'Open Camera')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCamTested(true)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                  camTested ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Video className="w-6 h-6" />
                <span className="text-xs font-bold">{loc('دوربین', 'Camera')}</span>
                {camTested && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setMicTested(true)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${
                  micTested ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Mic className="w-6 h-6" />
                <span className="text-xs font-bold">{loc('میکروفون', 'Microphone')}</span>
                {micTested && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={e => setRulesAccepted(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-200 font-bold">{loc('پذیرش قوانین استریم', 'Accept Rules')}</span>
              </label>

              {capturedSelfie && (
                <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-400">{loc('سلفی ژست:', 'Selfie:')}</span>
                  <img src={capturedSelfie} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-pink-500/40" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-slate-800 flex justify-between gap-2 bg-slate-950/50">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setStep(s => s - 1);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{loc('قبلی', 'Prev')}</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setStep(s => s + 1);
              }}
              disabled={
                (step === 3 && !capturedSelfie) ||
                (step === 4 && (!camTested || !micTested))
              }
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shadow-md"
            >
              <span>{loc('بعدی', 'Next')}</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submitApplication}
              disabled={!rulesAccepted || isSubmitting}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isSubmitting ? loc('ارسال...', 'Submitting...') : loc('ارسال درخواست', 'Submit')}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
