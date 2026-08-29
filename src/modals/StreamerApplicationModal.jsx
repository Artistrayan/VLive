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
  kycApplications,
  currentUsername,
  isVerified,
  userName
}) {
  const username = currentUsername || userName || 'user';
  
  // Find if there's an existing application
  const existingApp = kycApplications.find(app => app.username === username);

  const [step, setStep] = useState(1);
  const [streamCategory, setStreamCategory] = useState('');
  const [streamTopic, setStreamTopic] = useState('');
  const [description, setDescription] = useState('');
  
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [camTested, setCamTested] = useState(false);
  const [micTested, setMicTested] = useState(false);
  
  if (!isOpen) return null;

  const renderStatusPage = () => {
    return (
      <div className="space-y-6 p-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            {existingApp?.status === 'Pending' && <Clock className="w-10 h-10 text-amber-500 animate-pulse" />}
            {existingApp?.status === 'Approved' && <CheckCircle className="w-10 h-10 text-emerald-500" />}
            {existingApp?.status === 'Rejected' && <X className="w-10 h-10 text-rose-500" />}
            {existingApp?.status === 'Correction' && <AlertTriangle className="w-10 h-10 text-orange-500" />}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              {existingApp?.status === 'Pending' && loc('درخواست در حال بررسی', 'Application Pending Review')}
              {existingApp?.status === 'Approved' && loc('درخواست تایید شد', 'Application Approved')}
              {existingApp?.status === 'Rejected' && loc('درخواست رد شد', 'Application Rejected')}
              {existingApp?.status === 'Correction' && loc('نیاز به اصلاح', 'Needs Correction')}
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              {existingApp?.status === 'Pending' && loc('درخواست شما برای نشان استریمر ثبت شده و توسط مدیریت در حال بررسی است. لطفا شکیبا باشید.', 'Your streamer badge application has been submitted and is under review by admin. Please be patient.')}
              {existingApp?.status === 'Approved' && loc('تبریک! شما به عنوان استریمر تایید شدید.', 'Congratulations! You have been approved as a streamer.')}
              {existingApp?.status === 'Rejected' && loc('متاسفانه درخواست شما رد شد.', 'Unfortunately, your application was rejected.')}
              {existingApp?.status === 'Correction' && loc('درخواست شما نیاز به اصلاح دارد.', 'Your application requires correction.')}
            </p>
          </div>
          
          {existingApp?.rejectionReason && (
            <div className="w-full p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              <span className="font-bold">{loc('دلیل رد:', 'Rejection Reason:')} </span>
              {existingApp.rejectionReason}
            </div>
          )}
          
          {existingApp?.correctionMessage && (
            <div className="w-full p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-sm">
              <span className="font-bold">{loc('پیام مدیریت:', 'Admin Message:')} </span>
              {existingApp.correctionMessage}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-slate-800 text-white font-bold text-sm">
            {loc('بستن', 'Close')}
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
        if (apps) setKycApplications(apps);
      });
    } else {
      setKycApplications(prev => [newApp, ...prev]);
    }
    
    showToast(loc('✅ درخواست شما با موفقیت ثبت شد', '✅ Your application was successfully submitted'));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۱. بررسی پروفایل', '1. Profile Check')}</h4>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{loc('نام کاربری', 'Username')}</span>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{loc('عکس پروفایل', 'Profile Photo')}</span>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{loc('احراز هویت (KYC)', 'Identity Verification (KYC)')}</span>
                {isVerified ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-400">{loc('تایید نشده', 'Unverified')}</span>
                    <X className="w-5 h-5 text-rose-500" />
                  </div>
                )}
              </div>
            </div>
            {!isVerified && (
              <p className="text-xs text-rose-400 text-center">
                {loc('برای ارسال درخواست، ابتدا باید مدارک هویت خود را تایید کنید.', 'To apply, you must first verify your identity documents.')}
              </p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۲. اطلاعات استریم', '2. Stream Information')}</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{loc('دسته‌بندی اصلی', 'Main Category')}</label>
                <select value={streamCategory} onChange={e => setStreamCategory(e.target.value)} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white">
                  <option value="">{loc('انتخاب کنید...', 'Select...')}</option>
                  <option value="gaming">{loc('گیمینگ و بازی', 'Gaming')}</option>
                  <option value="chat">{loc('گپ و گفت (Just Chatting)', 'Just Chatting')}</option>
                  <option value="music">{loc('موسیقی و هنر', 'Music & Art')}</option>
                  <option value="education">{loc('آموزش و مهارت', 'Education')}</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">{loc('موضوع استریم', 'Stream Topic')}</label>
                <input type="text" value={streamTopic} onChange={e => setStreamTopic(e.target.value)} placeholder={loc('مثال: گپ شبانه...', 'Example: Night chat...')} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white" />
              </div>
              
              <div>
                <label className="text-xs text-slate-400 block mb-1">{loc('توضیحات کوتاه', 'Short Description')}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={loc('درباره استریم خود توضیح دهید...', 'Describe your stream...')} className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white h-24" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۳. قوانین و مقررات', '3. Rules and Regulations')}</h4>
            <div className="h-48 overflow-y-auto p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 space-y-3">
              <p>1. {loc('حفظ حریم خصوصی دیگران الزامی است.', 'Respecting others privacy is mandatory.')}</p>
              <p>2. {loc('محتوای نامناسب و خارج از قوانین پلتفرم ممنوع است.', 'Inappropriate content outside platform rules is forbidden.')}</p>
              <p>3. {loc('هرگونه تقلب در هدایا باعث مسدودی حساب می‌شود.', 'Any fraud in gifts will lead to account ban.')}</p>
              <p>4. {loc('استریمر متعهد به حفظ کیفیت محتوا می‌باشد.', 'The streamer is committed to maintaining content quality.')}</p>
              <p>5. {loc('درخواست واریز وجه خارج از سیستم مجاز نیست.', 'Requesting payments outside the system is not allowed.')}</p>
            </div>
            
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-800 cursor-pointer">
              <input type="checkbox" checked={rulesAccepted} onChange={e => setRulesAccepted(e.target.checked)} className="w-5 h-5 accent-cyan-500" />
              <span className="text-sm text-slate-200">{loc('تمام قوانین استریمری را خوانده و می‌پذیرم.', 'I have read and accept all streamer rules.')}</span>
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۴. تست تجهیزات', '4. Equipment Test')}</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setCamTested(true)} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${camTested ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <Video className="w-8 h-8" />
                <span className="text-sm font-bold">{loc('تست دوربین', 'Test Camera')}</span>
                {camTested && <CheckCircle className="w-4 h-4" />}
              </button>
              
              <button onClick={() => setMicTested(true)} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${micTested ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <Mic className="w-8 h-8" />
                <span className="text-sm font-bold">{loc('تست میکروفون', 'Test Mic')}</span>
                {micTested && <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-white mb-2">{loc('۵. بازبینی نهایی', '5. Final Review')}</h4>
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">{loc('وضعیت احراز هویت:', 'KYC Status:')}</span>
                <span className="text-xs text-emerald-400 font-bold">{loc('تایید شده', 'Verified')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">{loc('موضوع استریم:', 'Stream Topic:')}</span>
                <span className="text-xs text-white">{streamTopic}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-400">{loc('تست تجهیزات:', 'Equipment Test:')}</span>
                <span className="text-xs text-emerald-400 font-bold">{loc('موفق', 'Passed')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">{loc('پذیرش قوانین:', 'Rules Accepted:')}</span>
                <span className="text-xs text-emerald-400 font-bold">{loc('بله', 'Yes')}</span>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !isVerified) return true;
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
