import React from 'react';
import { Coins, Phone, Video } from 'lucide-react';

export default function PreCallConfirmModal({
  preCallConfirmHost,
  isRtl,
  loc,
  userBalance,
  setPreCallConfirmHost,
  setIsBuyCoinsModalOpen,
  handleConfirmAndStartCall
}) {
  if (!preCallConfirmHost) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
      <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-lg">
          <img src={preCallConfirmHost.user?.avatar} alt={preCallConfirmHost.user?.name} className="w-full h-full object-cover rounded-[22px]" />
        </div>
        <div>
          <h3 className="text-base font-black text-white">{loc('تایید تعرفه و شروع تماس با', 'Confirm tariff and start calling with')} {preCallConfirmHost.user?.name}</h3>
          <p className="text-xs text-amber-300 font-mono mt-1 flex items-center justify-center gap-1">
            <Coins className="w-3.5 h-3.5" />
            {preCallConfirmHost.rate} {loc('سکه در دقیقه', 'coins per minute')}
          </p>
        </div>
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5 text-right">
          <div className="flex justify-between text-slate-400">
            <span>{loc('نوع تماس:', 'Call type:')}</span>
            <span className="text-white font-bold flex items-center gap-1">
              {preCallConfirmHost.callType === 'video' ? <Video className="w-3 h-3 text-pink-400" /> : <Phone className="w-3 h-3 text-cyan-400" />}
              {preCallConfirmHost.callType === 'video' ? loc('ویدیویی HD', 'HD video') : loc('صوتی کریستالی', 'Crystal audio')}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{loc('موجودی فعلی شما:', 'Your current balance:')}</span>
            <span className="text-amber-400 font-bold font-mono">{userBalance} {loc('سکه', 'coin')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setPreCallConfirmHost(null)}
            className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold"
          >
            {loc('انصراف', 'Cancellation')}
          </button>
          {userBalance < preCallConfirmHost.rate ? (
            <button
              onClick={() => { setPreCallConfirmHost(null); setIsBuyCoinsModalOpen(true); }}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg"
            >
              {loc('شارژ کیف پول', 'Charge wallet')}
            </button>
          ) : (
            <button
              onClick={() => handleConfirmAndStartCall(preCallConfirmHost)}
              className="flex-1 py-2.5 rounded-2xl btn-neon-pink text-xs font-black shadow-lg"
            >
              {loc('تایید و برقراری تماس', 'Confirm and connect the call')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
