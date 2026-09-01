import { QRCodeSVG as QRCode } from 'qrcode.react';
import { apiVip, apiSupport } from '../services/api';
import { supabase } from '../supabaseClient';
import React, { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
// from 'react';
import { Crown, ShieldAlert, X, Clock, CreditCard, FileText, CheckCircle2, HelpCircle } from 'lucide-react';

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

  const [localSelectedVipPlan, setLocalSelectedVipPlan] = React.useState('gold');
  const selectedVipPlan = props.selectedVipPlan !== undefined ? props.selectedVipPlan : localSelectedVipPlan;
  const setSelectedVipPlan = props.setSelectedVipPlan || setLocalSelectedVipPlan;

  const [localSelectedVipDuration, setLocalSelectedVipDuration] = React.useState(1);
  const selectedVipDuration = props.selectedVipDuration !== undefined ? props.selectedVipDuration : localSelectedVipDuration;
  const setSelectedVipDuration = props.setSelectedVipDuration || setLocalSelectedVipDuration;

  const [localSelectedVipPayMethod, setLocalSelectedVipPayMethod] = React.useState('coins');
  const selectedVipPayMethod = props.selectedVipPayMethod !== undefined ? props.selectedVipPayMethod : localSelectedVipPayMethod;
  const setSelectedVipPayMethod = props.setSelectedVipPayMethod || setLocalSelectedVipPayMethod;

  const [vipModalTab, setVipModalTab] = React.useState('plans'); // 'plans' | 'rules'
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
              {window.loc('عالیه! دریافت پاداش', 'Awesome! Claim reward')}
            </button>
          </div>
        </div>
      )}

      {/* REFERRAL RULES MODAL */}
      {isReferralRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-slate-700 max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                {window.loc('قوانین و شرایط زیرمجموعه‌گیری', 'Referral System Rules')}
              </h3>
              <button onClick={() => setIsReferralRulesModalOpen(false)} className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>۱. {window.loc('به ازای هر کاربری که با کد دعوت شما ثبت‌نام کند، ۱۰۰ سکه پاداش آنی دریافت می‌کنید.', 'For each user who registers using your referral code, you will instantly receive 100 coins reward.')}</p>
              <p>۲. {window.loc('۱۰٪ از تمام خریدهای سکه زیرمجموعه‌های شما به حساب کیف‌پول تتر شما اضافه خواهد شد.', '10% of all coin purchases by your referrals will be added to your USDT wallet.')}</p>
              <p>۳. {window.loc('هرگونه تقلب یا ساخت اکانت‌های فیک منجر به مسدودی دائم اکانت خواهد شد.', 'Any fraud or creation of fake accounts will lead to permanent account suspension.')}</p>
            </div>
            <button
              onClick={() => setIsReferralRulesModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
            >
              {window.loc('متوجه شدم', 'I Understand')}
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
                  <p className="text-xs text-slate-300 font-medium">{window.loc('سطوح عضویت ویژه، امکانات اختصاصی و قوانین کامل', 'Special membership levels, exclusive features & rules')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVipModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SWITCHER: Plans vs Rules */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setVipModalTab('plans')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${vipModalTab === 'plans' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <Crown className="w-4 h-4" />
                {window.loc('خرید و فعال‌سازی اشتراک', 'Purchase & Activation')}
              </button>
              <button
                onClick={() => setVipModalTab('rules')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${vipModalTab === 'rules' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <FileText className="w-4 h-4" />
                {window.loc('قوانین و مقررات VIP', 'VIP Rules & Policy')}
              </button>
            </div>

            {/* TAB CONTENT: VIP RULES */}
            {vipModalTab === 'rules' && (
              <div className="space-y-4 py-2 animate-fadeIn text-xs text-slate-300">
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    {window.loc('قوانین و مقررات رسمی اشتراک VIP در V.Live', 'Official V.Live VIP Membership Terms')}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {window.loc('جهت حفظ امنیت پلتفرم و ارائه بهترین کیفیت خدمات به اعضای ویژه، قوانین زیر برای تمامی اشتراک‌های VIP لازم‌الاجرا می‌باشد:', 'To ensure security and provide premium services, the following terms govern all VIP memberships:')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {window.loc('۱. مدت زمان و انقضای اشتراک', '1. Period & Expiry')}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {window.loc('اشتراک‌های VIP بر اساس دوره خریداری شده (۱، ۳، ۶ یا ۱۲ ماه) فعال شده و پس از انقضا به صورت خودکار غیرفعال می‌گردند.', 'Subscriptions remain active for the chosen duration (1, 3, 6, 12 months) and expire automatically at the end of the term.')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {window.loc('۲. قطعی بودن خرید (عدم استرداد)', '2. Finality & Non-Refundable')}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {window.loc('تمامی خریدهای سکه و فعال‌سازی‌های VIP قطعی بوده و وجه پرداخت شده قابل بازگشت نمی‌باشد.', 'All coin purchases and VIP activations are final and strictly non-refundable.')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {window.loc('۳. رفتار منصفانه و ضد تقلب', '3. Fair Use & Anti-Fraud')}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {window.loc('سوءاستفاده از بج 👑 یا فریب کاربران در لایواستریم‌ها موجب تعلیق حساب کاربر بدون بازگشت وجه خواهد شد.', 'Misuse of VIP status or fraudulent behavior in live streams will lead to permanent suspension without refund.')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {window.loc('۴. اولویت پشتیبانی ۲۴/۷', '4. Priority Support')}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {window.loc('تیکت‌ها و درخواست‌های واریز/برداشت کاربران VIP در اولویت اول تیم پشتیبانی V.Live بررسی می‌شود.', 'VIP member support tickets and deposit/withdrawal requests are processed with highest priority.')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-amber-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    {window.loc('سوالات متداول اشتراک VIP', 'VIP Frequently Asked Questions')}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {window.loc('در صورت بروز مشکل در واریز تتر یا فعال‌سازی، کد پیگیری (TX Hash) خود را از طریق مرکز پشتیبانی ارسال نمایید.', 'If you encounter any issues with USDT payments, send your TX Hash via the Help Center support ticket system.')}
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: VIP PLANS & ACTIVATION */}
            {vipModalTab === 'plans' && (
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
                          2,000 Coins
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
                  {/* DURATION SELECTOR */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {window.loc('مدت زمان اشتراک', 'Subscription Period')}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { duration: 1, label: window.loc('۱ ماهه', '1 Month'), badge: window.loc('عادی', 'Standard') },
                        { duration: 3, label: window.loc('۳ ماهه', '3 Months'), badge: window.loc('۱۵٪ تخفیف', '15% Off') },
                        { duration: 6, label: window.loc('۶ ماهه', '6 Months'), badge: window.loc('۲۵٪ تخفیف', '25% Off') },
                        { duration: 12, label: window.loc('۱۲ ماهه', '12 Months'), badge: window.loc('۴۰٪ تخفیف 🔥', '40% Off 🔥') }
                      ].map(item => (
                        <button
                          key={item.duration}
                          onClick={() => setSelectedVipDuration(item.duration)}
                          className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between ${Number(selectedVipDuration) === item.duration ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                          <span className="font-bold text-white">{item.label}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">{item.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  
                  {/* PAYMENT METHOD SELECTOR & ACTION */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        {window.loc('روش پرداخت', 'Payment Method')}
                      </h4>

                      {/* Payment Method Selector Tabs */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setSelectedVipPayMethod('coins')}
                          className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${selectedVipPayMethod === 'coins' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                          <span>🪙</span>
                          <span>{window.loc('با سکه', 'With Coins')}</span>
                        </button>
                        <button
                          onClick={() => setSelectedVipPayMethod('usdt')}
                          className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${selectedVipPayMethod === 'usdt' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                          <span>💵</span>
                          <span>{window.loc('تتر (USDT)', 'USDT TRC20')}</span>
                        </button>
                      </div>

                      {/* COINS METHOD VIEW */}
                      {selectedVipPayMethod === 'coins' && (
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>{window.loc('موجودی سکه شما:', 'Your Coins:')}</span>
                            <span className="font-mono font-black text-amber-400">{userCoins.toLocaleString()} 🪙</span>
                          </div>
                          {(() => {
                            const basePrices = { silver: 300, gold: 500, diamond: 1000, elite: 2000 };
                            const dur = Number(selectedVipDuration) || 1;
                            const multipliers = { 1: 1.0, 3: 0.85, 6: 0.75, 12: 0.60 };
                            const planKey = (selectedVipPlan || 'gold').toLowerCase();
                            const monthly = basePrices[planKey] || 500;
                            const totalCoins = Math.round(monthly * dur * (multipliers[dur] || 1.0));
                            return (
                              <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold">
                                <span className="text-amber-300">{window.loc('هزینه اشتراک:', 'Subscription Price:')}</span>
                                <span className="font-mono font-black text-emerald-400 text-sm">{totalCoins.toLocaleString()} Coins</span>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* USDT METHOD VIEW */}
                      {selectedVipPayMethod === 'usdt' && (
                        <div className="space-y-3">
                          <div className="flex flex-col gap-2">
                             <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300">
                                <strong>{window.loc('راهنمای پرداخت تتر:', 'USDT Payment Guide:')}</strong> {window.loc('لطفاً دقیقاً معادل دلاری پلن را به آدرس زیر واریز کنید و سپس کد هش تراکنش (TXID) را وارد نمایید.', 'Please deposit the exact USD equivalent of the plan to the address below, then enter the TXID.')}
                             </div>
                          </div>
                          <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-xl flex flex-col items-center justify-center space-y-2.5">
                            <span className="text-emerald-400 font-bold text-xs">{window.loc('اسکن QR یا کپی آدرس تتر TRC20', 'Scan QR Code or copy TRC20 address')}</span>
                            <div className="p-2 bg-white rounded-xl">
                              <QRCode value={APP_CONFIG.TRON_PAYMENT_ADDRESS} size={100} />
                            </div>
                            <div className="text-center w-full">
                              <span className="text-[10px] text-slate-400 block mb-1">آدرس کیف‌پول USDT (شبکه TRC20):</span>
                              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-300 break-all select-all text-center">
                                {APP_CONFIG.TRON_PAYMENT_ADDRESS}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[11px] text-slate-300 font-bold">{window.loc('کد پیگیری تراکنش (TX Hash):', 'Transaction Hash (TXID):')}</label>
                            <input
                              type="text"
                              id="vipTxHashInput"
                              placeholder="e.g. 5d41402abc4b2a76b9719d911017c592..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div className="flex gap-2">
                             <label className="text-[10px] flex items-center gap-2 cursor-pointer text-slate-400">
                                <input type="checkbox" id="vipManualModeCheck" className="rounded bg-slate-900 border-slate-700" />
                                <span>{window.loc('تایید دستی توسط پشتیبانی (در صورت خطا در شبکه)', 'Manual verification by support (Fallback)')}</span>
                             </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CONFIRMATION BUTTON */}
                    <button
                      disabled={isSubmitting}
                      onClick={async () => {
                        const planKey = (selectedVipPlan || 'gold').toLowerCase();
                        const dur = Number(selectedVipDuration) || 1;

                        if (selectedVipPayMethod === 'usdt') {
                          const txInput = document.getElementById('vipTxHashInput')?.value?.trim();
                          if (!txInput || txInput.length < 10) {
                            showToast(window.loc('لطفاً کد پیگیری (TX Hash) معتبر وارد کنید', 'Please enter a valid TX Hash'));
                            return;
                          }

                          const isManualMode = document.getElementById('vipManualModeCheck')?.checked;

                          setIsSubmitting(true);
                          try {
                            if (isManualMode) {
                              const ticketRes = await apiSupport.submitTicket({
                                subject: `خرید VIP (${planKey.toUpperCase()} - ${dur} ماهه)`,
                                message: `درخواست فعال‌سازی اشتراک VIP با تتر (USDT TRC20).
کد پیگیری (TXID): ${txInput}
پلن انتخابی: ${planKey.toUpperCase()}
مدت زمان: ${dur} ماه
MODE: MANUAL FALLBACK`,
                                category: 'VIP Purchase'
                              });

                              if (ticketRes && ticketRes.success !== false) {
                                setIsVipModalOpen(false);
                                showToast(window.loc('✅ درخواست فعال‌سازی دستی با موفقیت ثبت شد. ادمین به زودی آن را تایید خواهد کرد.', '✅ Manual activation request submitted. Admin will process it shortly.'));
                              } else {
                                showToast(window.loc('خطا در ثبت درخواست دستی: ', 'Error submitting manual request: ') + (ticketRes?.error || ''));
                              }
                            } else {
                              // Auto Verification
                              showToast(window.loc('⏳ در حال بررسی تراکنش در شبکه TRON...', '⏳ Verifying transaction on TRON network...'));
                              
                              let token = localStorage.getItem('vlive_auth_token') || localStorage.getItem('vlive_token');
                              if (!token) {
                                try {
                                  const { data: sessionData } = await supabase.auth.getSession();
                                  token = sessionData?.session?.access_token || '';
                                } catch (e) {}
                              }
                              const tgInitData = window?.Telegram?.WebApp?.initData || '';
                              if (!token && !tgInitData) throw new Error('Unauthorized: Session required');

                              const headers = { 'Content-Type': 'application/json' };
                              if (token) headers['Authorization'] = 'Bearer ' + token;
                              if (tgInitData) headers['x-telegram-init-data'] = tgInitData;

                              const res = await fetch('/api/payments/verify-usdt', {
                                method: 'POST',
                                headers,
                                body: JSON.stringify({
                                  txid: txInput,
                                  plan: planKey,
                                  durationMonths: dur
                                })
                              });
                              
                              const data = await res.json();
                              
                              if (data.success) {
                                setVipPlan(planKey);
                                setVipExpireDays(dur * 30);
                                setIsVipMonthlyClaimed(false);
                                setIsVipModalOpen(false);
                                setIsVipCelebrationOpen(true);
                                showToast(window.loc(`👑 اشتراک VIP ${planKey.toUpperCase()} با موفقیت فعال شد!`, `👑 VIP Plan ${planKey.toUpperCase()} successfully activated!`));
                              } else {
                                showToast(window.loc('خطا در تایید خودکار پرداخت: ', 'Error in auto verification: ') + (data.error || 'Failed'));
                              }
                            }
                          } catch (err) {
                            showToast(window.loc('خطای غیرمنتظره', 'Unexpected error: ') + err.message);
                          } finally {
                            setIsSubmitting(false);
                          }
                          return;
                        }

                        // Coins Payment Method (REAL SUPABASE RPC)
                        const basePrices = { silver: 300, gold: 500, diamond: 1000, elite: 2000 };
                        const multipliers = { 1: 1.0, 3: 0.85, 6: 0.75, 12: 0.60 };
                        const monthly = basePrices[planKey] || 500;
                        const finalCoinsCost = Math.round(monthly * dur * (multipliers[dur] || 1.0));

                        if (userCoins < finalCoinsCost) {
                          showToast(window.loc(`موجودی سکه کافی نیست! هزینه: ${finalCoinsCost.toLocaleString()} سکه. لطفا با تتر شارژ کنید.`, `Insufficient coins! Cost: ${finalCoinsCost.toLocaleString()} Coins. Please recharge via USDT.`));
                          setSelectedVipPayMethod('usdt');
                          return;
                        }

                        setIsSubmitting(true);
                        try {
                          const res = await apiVip.purchasePlan({
                            plan: planKey,
                            durationMonths: dur
                          });

                          if (res && res.success) {
                            if (typeof res.remaining_coins === 'number') {
                              setUserCoins(res.remaining_coins);
                            } else {
                              setUserCoins(prev => Math.max(0, prev - finalCoinsCost));
                            }
                            setVipPlan(planKey);
                            setVipExpireDays(dur * 30);
                            setIsVipMonthlyClaimed(false);
                            setIsVipModalOpen(false);
                            setIsVipCelebrationOpen(true);
                            showToast(window.loc(`👑 اشتراک VIP ${(selectedVipPlan || 'gold').toUpperCase()} با موفقیت در دیتابیس فعال شد!`, `👑 VIP Plan ${(selectedVipPlan || 'gold').toUpperCase()} successfully activated in DB!`));
                          } else {
                            showToast(window.loc('خطا در فعال‌سازی اشتراک: ', 'Error activating subscription: ') + (res?.error || ''));
                          }
                        } catch (err) {
                          showToast(window.loc('خطای غیرمنتظره در فعال‌سازی VIP', 'Unexpected error activating VIP'));
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className={`w-full mt-3 py-3 rounded-2xl font-black text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2 ${selectedVipPayMethod === 'usdt' ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 hover:brightness-110' : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110'}`}
                    >
                      {isSubmitting ? (
                        <span>{window.loc('در حال پردازش تراکنش...', 'Processing transaction...')}</span>
                      ) : (
                        <span>
                          {selectedVipPayMethod === 'usdt' 
                            ? window.loc('بررسی پرداخت و فعال‌سازی خودکار تتر', 'Verify Payment & Activate Auto (USDT)')
                            : `${window.loc('تایید و پرداخت با سکه', 'Confirm & Pay with Coins')} (${(selectedVipPlan || 'gold').toUpperCase()})`
                          }
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                {window.loc('تبریک! شما عضو VIP شُدید 👑', 'Congratulations! You are now a VIP member')}
              </h2>
              <p className="text-xs text-slate-200 font-bold leading-relaxed">
                {window.loc('اشتراک', 'Subscription')} <span className="text-amber-300 font-black capitalize">{vipPlan} VIP</span> {window.loc('به مدت', 'for duration of')} <span className="text-emerald-400 font-mono font-black">{vipExpireDays} {window.loc('روز', 'days')}</span> {window.loc('برای حساب شما فعال شد.', 'is now active on your account.')}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs text-slate-300 text-right space-y-1.5">
              <p className="font-bold text-amber-300">{window.loc('امکانات فعال شده در سیستم:', 'Enabled features on your profile:')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ نشان 👑 روی نام شما در تمام چت‌ها و لایوها', '✅ Sign 👑 on your name in all chats and live streams')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ بوست دیده شدن پروفایل در Discover', '✅ Boost profile visibility in Discover tab')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ استریم و تماس با کیفیت HD 1080p', '✅ HD 1080p stream and call quality')}</p>
              <p className="flex items-center gap-1.5">{window.loc('✅ اولویت پشتیبانی ۲۴/۷ تیکت‌ها', '✅ Priority 24/7 support ticketing')}</p>
            </div>
            <button
              onClick={() => setIsVipCelebrationOpen(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              {window.loc('ورود به دنیای VIP 🚀', 'Enter VIP Experience 🚀')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
