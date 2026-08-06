import React from 'react';
import { Crown, ShieldAlert, X, Clock, CreditCard } from 'lucide-react';

export default function VipAndRewardModals(props) {
  const {
    isLevelUpModalOpen,
    setIsLevelUpModalOpen = (() => {}),
    isRtl,
    userLevel = 12,
    levelUpModalData = { newLevel: 12, title: 'VIP Star', rewards: '5,000 Coins + VIP Badge' },
    isReferralRulesModalOpen,
    setIsReferralRulesModalOpen = (() => {}),
    isVipModalOpen,
    setIsVipModalOpen = (() => {}),
    userCoins = 10000,
    setUserCoins = (() => {}),
    setVipPlan = (() => {}),
    setVipExpireDays = (() => {}),
    setIsVipMonthlyClaimed = (() => {}),
    isVipCelebrationOpen,
    setIsVipCelebrationOpen = (() => {}),
    vipPlan = 'FREE',
    vipExpireDays = 30,
    showToast = (() => {})
  } = props;

  const [localSelectedVipPlan, setLocalSelectedVipPlan] = React.useState('GOLD');
  const selectedVipPlan = props.selectedVipPlan !== undefined ? props.selectedVipPlan : localSelectedVipPlan;
  const setSelectedVipPlan = props.setSelectedVipPlan || setLocalSelectedVipPlan;

  const [localSelectedVipDuration, setLocalSelectedVipDuration] = React.useState('1m');
  const selectedVipDuration = props.selectedVipDuration !== undefined ? props.selectedVipDuration : localSelectedVipDuration;
  const setSelectedVipDuration = props.setSelectedVipDuration || setLocalSelectedVipDuration;

  const [localSelectedVipPayMethod, setLocalSelectedVipPayMethod] = React.useState('coins');
  const selectedVipPayMethod = props.selectedVipPayMethod !== undefined ? props.selectedVipPayMethod : localSelectedVipPayMethod;
  const setSelectedVipPayMethod = props.setSelectedVipPayMethod || setLocalSelectedVipPayMethod;
  return (
    <>
      {/* 16. LEVEL UP CELEBRATION ANIMATION MODAL */}
      {isLevelUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full pointer-events-none" />
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-1 mx-auto shadow-[0_0_30px_rgba(245,158,11,0.8)] animate-bounce flex items-center justify-center text-4xl">
              👑
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-amber-300">{window.loc('🎆 LEVEL UP! ارتقای سطح!', '🎆 LEVEL UP! Upgrade!')}</h3>
              <p className="text-sm font-bold text-white">{window.loc('شما به Level', 'You to Level')} {userLevel} {window.loc('دست یافتید!', 'You got it!')}</p>
              <p className="text-xs text-slate-300">{levelUpModalData?.rewardText}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs font-bold text-amber-400">
              {window.loc('🎁 پاداش ارتقا: +200 سکه واریز شد!', '🎁 Upgrade bonus: +200 coins deposited!')}
            </div>
            <button
              onClick={() => setIsLevelUpModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition"
            >
              {window.loc('دریافت پاداش و ادامه 🚀', 'Get rewards and continue 🚀')}
            </button>
          </div>
        </div>
      )}

      {/* 17. REFERRAL TERMS & ANTI-FRAUD RULES MODAL */}
      {isReferralRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-cyan-500/50 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                {window.loc('سند قوانین جامع سیستم دعوت (Referral Terms & Rules)', 'Referral Terms & Rules')}
              </h3>
              <button onClick={() => setIsReferralRulesModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-1">
              <p>{window.loc('۱. سیستم دعوت پلتفرم V.Live برای پاداش‌دهی به کاربران واقعی طراحی شده است.', '1. The invitation system of the V.Live platform is designed to reward real users.')}</p>
              <p>{window.loc('۲. هر حساب تنها یک بار می‌تواند از کد معرف استفاده کند.', '2. Each account can use the identifier code only once.')}</p>
              <p>{window.loc('۳. پاداش دعوت پس از احراز حداقل ۱۰ دقیقه فعالیت کاربر جدید در اپلیکیشن آزاد خواهد شد.', '3. The invitation reward will be released after at least 10 minutes of activity of the new user in the application.')}</p>
              <p>{window.loc('۴. هرگونه سوءاستفاده، ساخت اکانت تکراری با ربات یا فیک، موجب مسدودی حساب و ضبط درآمد می‌شود.', '4. Any abuse, creation of a duplicate account with a robot or fake account will result in the account being blocked and income forfeited.')}</p>
            </div>
            <button
              onClick={() => setIsReferralRulesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              {window.loc('متوجه شدم و قبول دارم ✓', 'I understand and agree ✓')}
            </button>
          </div>
        </div>
      )}

      {/* VIP SYSTEM MODAL */}
      {isVipModalOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-4xl card-3d p-4 sm:p-6 border-2 border-amber-500/50 bg-slate-900/98 rounded-3xl space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(245,158,11,0.3)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                </div>
                <div>
                  <h2 className="text-lg font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    V.Live Premium VIP Club
                  </h2>
                  <p className="text-xs text-slate-300 font-medium">{window.loc('سطوح عضویت ویژه، امکانات اختصاصی و پاداش‌ها', 'Special membership levels, exclusive features and rewards')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVipModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* VIP PLANS GRID */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* SILVER VIP */}
                <div 
                  onClick={() => setSelectedVipPlan('silver')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'silver' ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-slate-300 shadow-[0_0_25px_rgba(255,255,255,0.2)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                >
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-slate-700 text-white font-black text-[10px] shadow-md">
                    {window.loc('مبتدی 🥈', 'Beginner 🥈')}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg">🥈</span>
                      <span className="text-xs font-mono font-black text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                        300 Coins
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-200">Silver VIP</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{window.loc('قاب نقره‌ای چت + ۲X سرعت سکه‌ها', 'Silver frame chat + 2X speed of coins')}</p>
                  </div>
                  <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'silver' ? 'bg-slate-200 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                    {selectedVipPlan === 'silver' ? window.loc('انتخاب شده ✓', 'Selected ✓') : window.loc('انتخاب Silver', 'Choose Silver')}
                  </div>
                </div>

                {/* GOLD VIP */}
                <div 
                  onClick={() => setSelectedVipPlan('gold')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'gold' ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-yellow-950/80 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 'bg-slate-950/80 border-amber-900/60 hover:border-amber-600'}`}
                >
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] shadow-md">
                    {window.loc('محبوب‌ترین 👑', 'The most popular 👑')}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg">👑</span>
                      <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                        500 Coins
                      </span>
                    </div>
                    <h4 className="text-base font-black text-amber-300">Gold VIP</h4>
                    <p className="text-[11px] text-slate-300 font-medium">{window.loc('ورود طلایی ۳D + تماس HD + نشان VIP', '3D Golden Login + HD Call + VIP Badge')}</p>
                  </div>
                  <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'gold' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                    {selectedVipPlan === 'gold' ? window.loc('انتخاب شده ✓', 'Selected ✓') : window.loc('انتخاب Gold', 'Select Gold')}
                  </div>
                </div>

                {/* DIAMOND VIP */}
                <div 
                  onClick={() => setSelectedVipPlan('diamond')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'diamond' ? 'bg-gradient-to-br from-cyan-950/80 via-slate-900 to-blue-950/80 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'bg-slate-950/80 border-cyan-900/60 hover:border-cyan-600'}`}
                >
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black text-[10px] shadow-md">
                    {window.loc('فوق‌العاده 💎', 'wonderful 💎')}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg">🥇</span>
                      <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                        1,000 Coins
                      </span>
                    </div>
                    <h4 className="text-base font-black text-cyan-300">Diamond VIP</h4>
                    <p className="text-[11px] text-slate-300 font-medium">{window.loc('۵X بوست پروفایل + لایو Pinned + نشان Diamond', '5X profile boost + Live Pinned + Diamond badge')}</p>
                  </div>
                  <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'diamond' ? 'bg-gradient-to-r from-cyan-500 to-blue-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                    {selectedVipPlan === 'diamond' ? window.loc('انتخاب شده ✓', 'Selected ✓') : window.loc('انتخاب Diamond', 'Choose Diamond')}
                  </div>
                </div>

                {/* ELITE VIP */}
                <div 
                  onClick={() => setSelectedVipPlan('elite')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'elite' ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]' : 'bg-slate-950/80 border-purple-900/60 hover:border-purple-600'}`}
                >
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-[10px] shadow-md">
                    {window.loc('خاص با دعوت 💠', 'Special by invitation 💠')}
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-lg">💠</span>
                      <span className="text-xs font-mono font-black text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/40">
                        {window.loc('ادمین / دعوت', 'admin/invitation')}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-purple-300">Elite VIP</h4>
                    <p className="text-[11px] text-slate-300 font-medium">{window.loc('پشتیبانی ۲۴/۷ + قاب‌های کمیاب', '24/7 support + rare frames')}</p>
                  </div>
                  <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'elite' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                    {selectedVipPlan === 'elite' ? window.loc('انتخاب شده ✓', 'Selected ✓') : window.loc('درخواست Elite', 'Elite application')}
                  </div>
                </div>
              </div>

              {/* DURATION & CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {window.loc('مدت زمان اشتراک', 'Subscription period')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { duration: 1, label: window.loc('۱ ماهه', '1 month'), badge: window.loc('عادی', 'normal') },
                      { duration: 3, label: window.loc('۳ ماهه', '3 months'), badge: window.loc('۱۵٪ تخفیف', '15% discount') },
                      { duration: 6, label: window.loc('۶ ماهه', '6 months'), badge: window.loc('۲۵٪ تخفیف', '25% discount') },
                      { duration: 12, label: window.loc('۱۲ ماهه', '12 months'), badge: window.loc('۴۰٪ تخفیف 🔥', '40% discount 🔥') }
                    ].map(item => (
                      <button
                        key={item.duration}
                        onClick={() => setSelectedVipDuration(item.duration)}
                        className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between ${selectedVipDuration === item.duration ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                      >
                        <span className="font-bold text-white">{item.label}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">{item.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    {window.loc('روش پرداخت', 'payment method')}
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <button
                      onClick={() => setSelectedVipPayMethod('in_app')}
                      className={`p-2.5 rounded-xl border text-center transition ${selectedVipPayMethod === 'in_app' ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      {window.loc('پرداخت درون‌برنامه‌ای', 'In-app payment')}
                    </button>
                    <button
                      onClick={() => setSelectedVipPayMethod('usdt')}
                      className={`p-2.5 rounded-xl border text-center transition ${selectedVipPayMethod === 'usdt' ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      USDT
                    </button>
                    <button
                      onClick={() => setSelectedVipPayMethod('coins')}
                      className={`p-2.5 rounded-xl border text-center transition ${selectedVipPayMethod === 'coins' ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                    >
                      {window.loc('سکه‌ها', 'coins')}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const basePrices = { silver: 300, gold: 500, diamond: 1000 };
                      const discountMultipliers = { 1: 1.0, 3: 0.85, 6: 0.75, 12: 0.60 };
                      const monthlyCost = basePrices[selectedVipPlan] || 500;
                      const totalBaseCoins = monthlyCost * selectedVipDuration;
                      const finalCoinsCost = Math.round(totalBaseCoins * (discountMultipliers[selectedVipDuration] || 1.0));
                      if (selectedVipPayMethod === 'coins') {
                        if (userCoins < finalCoinsCost) {
                          showToast(window.loc(`موجودی سکه کافی نیست! هزینه: ${finalCoinsCost} سکه`, `موجودی سکه کافی نیست! هزینه: ${finalCoinsCost} سکه`));
                          return;
                        }
                        setUserCoins(prev => prev - finalCoinsCost);
                      }
                      setVipPlan(selectedVipPlan);
                      setVipExpireDays(selectedVipDuration * 30);
                      setIsVipMonthlyClaimed(false);
                      setIsVipModalOpen(false);
                      setIsVipCelebrationOpen(true);
                      showToast(window.loc(`👑 اشتراک ${selectedVipPlan.toUpperCase()} با موفقیت فعال شد!`, `👑 اشتراک ${selectedVipPlan.toUpperCase()} با موفقیت فعال شد!`));
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    {window.loc('تایید و فعال‌سازی اشتراک', 'Subscription confirmation and activation')} {selectedVipPlan.toUpperCase()} ({selectedVipDuration} {window.loc('ماهه)', 'month)')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIP CELEBRATION CONGRATULATIONS MODAL */}
      {isVipCelebrationOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-md card-3d p-6 sm:p-8 border-2 border-amber-400 bg-slate-900 rounded-3xl text-center space-y-5 shadow-[0_0_60px_rgba(245,158,11,0.5)] relative overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-0.5 shadow-xl animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                <Crown className="w-10 h-10 text-amber-400 fill-amber-400/30" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                {window.loc('تبریک! شما عضو VIP شُدید 👑', 'Congratulations! You have become a VIP member')}
              </h2>
              <p className="text-xs text-slate-200 font-bold leading-relaxed">
                {window.loc('اشتراک', 'Subscription')} <span className="text-amber-300 font-black capitalize">{vipPlan} VIP</span> {window.loc('به مدت', 'for the duration')} <span className="text-emerald-400 font-mono font-black">{vipExpireDays} {window.loc('روز', 'day')}</span> {window.loc('برای حساب شما فعال شد.', 'Activated for your account.')}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300 text-right space-y-1.5">
              <p className="font-bold text-amber-300">{window.loc('امکانات فعال شده:', 'Enabled features:')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ نشان 👑 روی نام شما در تمام چت‌ها و لایوها', '✅ Sign 👑 on your name in all chats and live')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ بوست دیده شدن پروفایل در Discover', '✅ Boost profile visibility in Discover')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ استریم و تماس با کیفیت HD 1080p', '✅ Stream and call with HD 1080p quality')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ حذف کامل تمامی تبلیغات', '✅ Complete removal of all ads')}</p>
            </div>
            <button
              onClick={() => setIsVipCelebrationOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              {window.loc('ورود به دنیای VIP 🚀', 'Enter the VIP world 🚀')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
