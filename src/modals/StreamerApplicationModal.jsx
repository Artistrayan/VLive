import React, { useState, useEffect } from 'react';
import { Star, Shield, Camera, Info, FileText, CheckCircle, Clock, Check, X, Mic, AlertTriangle, Video, ArrowRight, ArrowLeft } from 'lucide-react';
import { apiProfile } from '../services/api';
import { safeStorage } from '../utils/safeStorage';

export default function StreamerApplicationModal({
  isOpen,
  onClose,
  loc,
  showToast,
  setKycApplications,
  kycApplications = [],
  currentUsername,
  isVerified,
  userName
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
  
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [camTested, setCamTested] = useState(false);
  const [micTested, setMicTested] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsReapplying(false);
      setStep(1);
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const renderStatusPage = () => {
    return (
      <div className="space-y-6 p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
            {existingApp?.status === 'Pending' && <Clock className="w-10 h-10 text-amber-500 animate-pulse" />}
            {existingApp?.status === 'Approved' && <CheckCircle className="w-10 h-10 text-emerald-500" />}
            {existingApp?.status === 'Rejected' && <X className="w-10 h-10 text-rose-500" />}
            {existingApp?.status === 'Correction' && <AlertTriangle className="w-10 h-10 text-orange-500" />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              {existingApp?.status === 'Pending' && loc('درخواست در حال بررسی است', 'Application Pending Review')}
              {existingApp?.status === 'Approved' && loc('درخواست شما تایید شده است ✨', 'Application Approved ✨')}
              {existingApp?.status === 'Rejected' && loc('وضعیت درخواست: رد شد', 'Application Status: Rejected')}
              {existingApp?.status === 'Correction' && loc('نیاز به بازبینی و اصلاح مدارک', 'Needs Correction')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {existingApp?.status === 'Pending' && loc('درخواست شما برای نشان استریمر ثبت شده و توسط مدیریت در حال بررسی است. شما می‌توانید در صورت نیاز درخواست خود را ویرایش یا مجدداً ثبت نمایید.', 'Your streamer badge application has been submitted and is under review. You can also re-apply or update your details if needed.')}
              {existingApp?.status === 'Approved' && loc('تبریک! شما به عنوان استریمر رسمی پلتفرم تایید شده‌اید و دسترسی استودیو لایو برای شما فعال است.', 'Congratulations! You have been approved as an official streamer.')}
              {existingApp?.status === 'Rejected' && loc('درخواست قبلی شما پذیرفته نشده است. شما می‌توانید با تصحیح اطلاعات یا تست مجدد تجهیزات، همین حالا درخواست جدید ثبت کنید.', 'Your previous application was not approved. You can submit a new application now with updated details.')}
              {existingApp?.status === 'Correction' && loc('درخواست شما نیاز به بازبینی و اصلاح دارد. لطفاً موارد ذکر شده را بررسی کرده و فرم را مجدداً ارسال نمایید.', 'Your application requires correction. Please review the note and resubmit.')}
            </p>
          </div>
          
          {existingApp?.rejectionReason && (
            <div className="w-full p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-right space-y-1">
              <span className="font-bold block text-rose-400">{loc('علت اعلام‌شده از سوی مدیریت:', 'Reason from Admin:')}</span>
              <p>{existingApp.rejectionReason}</p>
            </div>
          )}
          
          {existingApp?.correctionMessage && (
            <div className="w-full p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs text-right space-y-1">
              <span className="font-bold block text-orange-400">{loc('پیام اصلاحیه مدیریت:', 'Admin Correction Note:')}</span>
              <p>{existingApp.correctionMessage}</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2.5">
          {/* Re-apply action button for all rejected, correction, or pending requests */}
          {existingApp?.status !== 'Approved' && (
            <button
              onClick={() => {
                setIsReapplying(true);
                setStep(1);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>{loc('ثبت و ارسال مجدد درخواست استریمر', 'Re-apply for Streamer')}</span>
            </button>
          )}

          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition">
            {loc('بستن پنجره', 'Close Window')}
          </button>
        </div>
      </div>
    );
  };

  const submitApplication = async () => {
    if (!streamCategory || !streamTopic || !description || !rulesAccepted || !camTested || !micTested) {
      showToast(loc('لطفا تمام مراحل را کامل کنید.', 'Please complete all steps.'));
      return;
    }
    
    const newApp = {
      id: Math.floor(Math.random() * 90000) + 10000,
      username,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      streamCategory,
      streamTopic,
      description,
      rulesAcceptedAt: new Date().toISOString(),
      camTested,
      micTested,
      videoDemoUrl: '',
      docUrl: ''
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
    
    setIsReapplying(false);
    showToast(loc('✨ درخواست استریمر شما با موفقیت ثبت شد و در صف بررسی قرار گرفت', '✨ Streamer application submitted successfully and placed in review queue'));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۱. بررسی پروفایل و شرایط اولیه', '1. Profile Check & Requirements')}</h4>
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
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">{loc('وضعیت احراز هویت اولیه', 'Identity Status')}</span>
                {isVerified ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                    <span>{loc('تایید شده', 'Verified')}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-cyan-400 font-bold">
                    <span>{loc('همراه با درخواست بررسی می‌شود', 'Reviewed with application')}</span>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
              <Star className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{loc('پس از تایید، نشان ستاره طلایی و قابلیت شروع لایو به پروفایل شما اضافه خواهد شد.', 'Once approved, the streamer badge and live broadcast access will be activated.')}</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۲. اطلاعات استریم', '2. Stream Information')}</h4>
            
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
            <h4 className="font-bold text-white mb-2">{loc('۳. قوانین و مقررات استریمری', '3. Rules and Regulations')}</h4>
            <div className="h-44 overflow-y-auto p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>۱. {loc('حفظ احترام مخاطبان و رعایت حریم خصوصی الزامی است.', 'Respecting privacy and community members is mandatory.')}</p>
              <p>۲. {loc('انتشار هرگونه محتوای هنجارشکنانه یا غیرقانونی موجب مسدودی حساب می‌شود.', 'Inappropriate or illegal content leads to ban.')}</p>
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
      case 4:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۴. تست تجهیزات و اتصال', '4. Equipment Test')}</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setCamTested(true)} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${camTested ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/40'}`}>
                <Video className="w-7 h-7" />
                <span className="text-xs font-bold">{loc('تست دوربین', 'Test Camera')}</span>
                {camTested ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-cyan-400">{loc('کلیک برای تایید ✅', 'Click to verify ✅')}</span>}
              </button>
              
              <button onClick={() => setMicTested(true)} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition ${micTested ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/40'}`}>
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
            <h4 className="font-bold text-white mb-2">{loc('۵. بازبینی نهایی و ارسال', '5. Final Review')}</h4>
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs text-slate-400">{loc('موضوع استریم:', 'Stream Topic:')}</span>
                <span className="text-xs text-white font-bold">{streamTopic}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs text-slate-400">{loc('دسته‌بندی:', 'Category:')}</span>
                <span className="text-xs text-cyan-400 font-bold">{streamCategory}</span>
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
    if (step === 3 && !rulesAccepted) return true;
    if (step === 4 && (!camTested || !micTested)) return true;
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
              <p className="text-[10px] text-slate-400">{loc('تایید هویت و دسترسی استودیو', 'Identity & Studio Access')}</p>
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
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${step === s ? 'bg-cyan-500 text-white' : step > s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 5 && <div className={`w-10 h-1 mx-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
                </div>
              ))}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {renderStep()}
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-between gap-3 bg-slate-950/50">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-sm flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  {loc('قبلی', 'Previous')}
                </button>
              ) : (
                <div />
              )}
              
              {step < 5 ? (
                <button onClick={() => setStep(s => s + 1)} disabled={isNextDisabled()} className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2">
                  {loc('بعدی', 'Next')}
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={submitApplication} disabled={isNextDisabled()} className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {loc('ارسال درخواست', 'Submit Application')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
