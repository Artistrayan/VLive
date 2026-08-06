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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
      <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-lg">
          <img src={preCallConfirmHost.user?.avatar} alt={preCallConfirmHost.user?.name} className="w-full h-full object-cover rounded-[22px]" />
        </div>

        <div>
          <h3 className="text-base font-black text-white">{loc('تایید تماس خصوصی پولی با', 'Confirm paid private contact with')} {preCallConfirmHost.user?.name}</h3>
          <p className="text-xs text-slate-400 mt-1">{loc('این استریمر برای پاسخگویی به تماس، هزینه تعیین کرده است.', 'This streamer has set a fee to answer the call.')}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-right">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{loc('نرخ تماس:', 'call rate:')}</span>
            <span className="font-bold text-amber-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" /> {preCallConfirmHost.tariffRate} {loc('سکه در هر دقیقه', 'Coins per minute')}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">{loc('موجودی کیف پول شما:', 'Your wallet balance:')}</span>
            <span className="font-bold text-emerald-400">{(userCoins || 0).toLocaleString()} {loc('سکه', 'coin')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setPreCallConfirmHost(null)}
            className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
          >
            {loc('انصراف', 'opt out')}
          </button>
          <button
            onClick={() => handleStartCallDirect(preCallConfirmHost.user, preCallConfirmHost.type, preCallConfirmHost.mode, true, preCallConfirmHost.tariffRate)}
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg"
          >
            {loc('تایید و اتصال تماس', 'Confirm and connect the call')}
          </button>
        </div>
      </div>
    </div>
  );
}
