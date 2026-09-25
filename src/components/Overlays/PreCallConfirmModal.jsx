import React from 'react';
import { Coins, Video, CheckCircle2 } from 'lucide-react';
import { giftBoxService } from '../../services/giftBoxService';

export default function PreCallConfirmModal({
  preCallConfirmHost,
  isRtl,
  loc,
  userCoins,
  setPreCallConfirmHost,
  handleStartCallDirect,
  currentUser
}) {
  if (!preCallConfirmHost) return null;

  const target = preCallConfirmHost.user || preCallConfirmHost;
  const targetName = target?.name || target?.username || 'User';
  const targetAvatar = target?.avatar || '';
  const callType = preCallConfirmHost.type || preCallConfirmHost.callType || 'video';
  const tariffRate = preCallConfirmHost.tariffRate || target?.tariffPerMin || 100;

  const userAssets = giftBoxService.getUserAssets(currentUser?.id);
  const hasCameraVoucher = callType === 'video' && userAssets.cameras > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
      <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-lg flex items-center justify-center overflow-hidden bg-slate-800">
          {targetAvatar ? (
            <img src={targetAvatar} alt={targetName} className="w-full h-full object-cover rounded-[22px]" />
          ) : (
            <span className="text-xl font-black text-white">{targetName.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div>
          <h3 className="text-base font-black text-white">{loc('تایید تماس اختیاری با', 'Confirm call with')} {targetName}</h3>
          <p className="text-xs text-slate-400 mt-1">
            {hasCameraVoucher 
              ? loc('✨ شما ۱ کوپن دوربین دارید! ۱ دقیقه اول این تماس رایگان خواهد بود.', '✨ You have a Camera Voucher! 1st minute is free.')
              : loc('این کاربر برای پاسخگویی به تماس، هزینه تعیین کرده است.', 'This user has set a fee to answer the call.')}
          </p>
        </div>

        {hasCameraVoucher && (
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>{loc('کوپن دوربین فعال (۱ دقیقه رایگان)', 'Camera Voucher (1 Min Free)')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-200 text-[10px] font-mono font-black">
              {userAssets.cameras} {loc('عدد', 'left')}
            </span>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-right">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{loc('نرخ تماس بعد از دقیقه اول:', 'Rate after 1st min:')}</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {tariffRate} {loc('سکه در دقیقه', 'Coins/min')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{loc('موجودی کیف پول شما:', 'Your wallet balance:')}</span>
            <span className="font-bold text-emerald-400">{(userCoins || 0).toLocaleString()} {loc('سکه', 'coins')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setPreCallConfirmHost(null)}
            className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
          >
            {loc('انصراف', 'Cancel')}
          </button>
          <button
            onClick={() => handleStartCallDirect(target, callType)}
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <span>{loc('برقراری تماس', 'Start Call')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
