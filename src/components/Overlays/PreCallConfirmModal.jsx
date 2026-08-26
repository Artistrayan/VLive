import React from 'react';
import { Coins } from 'lucide-react';

export default function PreCallConfirmModal({
  preCallConfirmHost,
  isRtl,
  loc,
  userCoins,
  setPreCallConfirmHost,
  handleStartCallDirect
}) {
  if (!preCallConfirmHost) return null;

  const target = preCallConfirmHost.user || preCallConfirmHost;
  const targetName = target?.name || target?.username || 'User';
  const targetAvatar = target?.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='1.5'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M20 21a8 8 0 1 0-16 0'/%3E%3C/svg%3E`;
  const callType = preCallConfirmHost.type || preCallConfirmHost.callType || 'video';
  const tariffRate = preCallConfirmHost.tariffRate || target?.tariffPerMin || 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
      <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-lg">
          <img src={targetAvatar} alt={targetName} className="w-full h-full object-cover rounded-[22px]" />
        </div>

        <div>
          <h3 className="text-base font-black text-white">{loc('تایید تماس خصوصی با', 'Confirm private contact with')} {targetName}</h3>
          <p className="text-xs text-slate-400 mt-1">{loc('این کاربر برای پاسخگویی به تماس، هزینه تعیین کرده است.', 'This user has set a fee to answer the call.')}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-right">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{loc('نرخ تماس:', 'Call rate:')}</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {tariffRate} {loc('سکه در هر دقیقه', 'Coins per min')}
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
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg hover:opacity-90 active:scale-95 transition"
          >
            {loc('تایید و برقراری تماس', 'Confirm & Start Call')}
          </button>
        </div>
      </div>
    </div>
  );
}
