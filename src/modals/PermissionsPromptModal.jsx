import React from 'react';
import { 
  ShieldCheck, Camera, Mic, Bell, Image, FileText, CheckCircle2, Check 
} from 'lucide-react';

export default function PermissionsPromptModal({
  isOpen,
  onAcceptAll,
  onAcceptBasic,
  loc,
  isRtl
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn overflow-y-auto" dir={isRtl ? "rtl" : "ltr"}>
      <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-cyan-500/40 p-5 space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-right relative overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="font-black text-sm text-white">
              {loc('دسترسی‌های سیستم و قوانین V.LIVE', 'System Permissions & Terms')}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {loc('جهت استفاده از لایواستریم، تماس مستقیم و اعلان‌ها', 'For live streaming, direct calls & notifications')}
            </p>
          </div>
        </div>

        {/* Permissions List */}
        <div className="space-y-2 text-xs text-slate-300">
          {/* 1. Camera */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-[11px]">{loc('دسترسی به دوربین', 'Camera Access')}</h4>
                <p className="text-[10px] text-slate-400">{loc('پخش زنده HD/4K و تماس تصویری', 'HD/4K live & video calls')}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
              {loc('الزامی', 'Required')}
            </span>
          </div>

          {/* 2. Microphone */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-[11px]">{loc('دسترسی به میکروفون', 'Microphone Access')}</h4>
                <p className="text-[10px] text-slate-400">{loc('صدای شفاف استریم و مکالمات', 'Clear voice chat & live audio')}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
              {loc('الزامی', 'Required')}
            </span>
          </div>

          {/* 3. Notifications */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-[11px]">{loc('اعلان‌ها', 'Notifications')}</h4>
                <p className="text-[10px] text-slate-400">{loc('اطلاع از لایوها و پیام‌های جدید', 'Alerts for live streams & messages')}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
              {loc('توصیه‌شده', 'Recommended')}
            </span>
          </div>

          {/* 4. Gallery / Storage */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-[11px]">{loc('گالری و رسانه', 'Media & Storage')}</h4>
                <p className="text-[10px] text-slate-400">{loc('آپلود تصویر پروفایل و عکس در چت', 'Upload avatar & chat photos')}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold shrink-0">
              {loc('اختیاری', 'Optional')}
            </span>
          </div>

          {/* 5. Rules */}
          <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-amber-300 text-[11px]">{loc('قوانین و شرایط استفاده', 'Terms & Platform Rules')}</h4>
                <p className="text-[10px] text-slate-400">{loc('احترام متقابل و رعایت قوانین استریم', 'Community guidelines & respect')}</p>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onAcceptAll}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-black text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 font-black" />
            <span>{loc('تایید قوانین و اعطای کامل دسترسی‌ها', 'Accept Rules & Grant All Permissions')}</span>
          </button>
          
          <button
            onClick={onAcceptBasic}
            className="w-full py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white font-bold text-[11px] transition"
          >
            {loc('ذخیره و ورود با دسترسی پایه', 'Save & Enter with Basic Access')}
          </button>
        </div>

      </div>
    </div>
  );
}
