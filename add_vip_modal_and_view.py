import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. UPDATE WALLET SUBTAB VIP (Line where walletSubTab === 'vip' or subtab 13 is rendered)
wallet_vip_target = """{/* 13. VIP PAYMENTS & PROFILE BOOSTS */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-3">
                  <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    ۱۳. خرید اشتراک VIP و پروموت (VIP Payment & Boosts)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <h4 className="font-bold text-white">اشتراک VIP ماهیانه</h4>
                      <p className="text-amber-400 font-black font-mono">500 Coins</p>
                      <button 
                        onClick={() => {
                          if (userCoins < 500) { showToast('موجودی سکه کافی نیست!'); return; }
                          setUserCoins(p => p - 500);
                          showToast('👑 اشتراک VIP برای شما فعال شد!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold"
                      >
                        خرید VIP
                      </button>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <h4 className="font-bold text-white">بوست پروفایل (Profile Boost)</h4>
                      <p className="text-amber-400 font-black font-mono">200 Coins</p>
                      <button 
                        onClick={() => {
                          if (userCoins < 200) { showToast('موجودی سکه کافی نیست!'); return; }
                          setUserCoins(p => p - 200);
                          showToast('🚀 پروفایل شما به صورت ویژه نمایش داده شد!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-purple-600 text-white font-bold"
                      >
                        بوست ۲۴ ساعته
                      </button>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                      <h4 className="font-bold text-white">پروموت لایو استریم</h4>
                      <p className="text-amber-400 font-black font-mono">1,000 Coins</p>
                      <button 
                        onClick={() => {
                          if (userCoins < 1000) { showToast('موجودی سکه کافی نیست!'); return; }
                          setUserCoins(p => p - 1000);
                          showToast('🎥 لایو شما در بالای صفحه اول سنجاق شد!');
                        }}
                        className="w-full py-1.5 rounded-xl bg-pink-600 text-white font-bold"
                      >
                        سنجاق لایو
                      </button>
                    </div>
                  </div>
                </div>"""

# New VIP view snippet
new_vip_inline_block = """{/* REDESIGNED REAL 3-TIER + ELITE VIP SYSTEM SECTION */}
                <div className="space-y-6" dir="rtl">
                  
                  {/* 1. VIP HEADER BANNER (👑 V.Live Premium - Neon Gold) */}
                  <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-yellow-950/90 to-amber-900 border-2 border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4 text-right">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shrink-0 animate-pulse">
                          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                            <Crown className="w-8 h-8 text-amber-400 fill-amber-400/20" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                              V.Live Premium
                            </h2>
                            <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-mono text-xs font-black">
                              VIP Club 👑
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-200 font-bold mt-1">
                            Unlock Exclusive Features • ارتقای بهشت استریمرها و کاربران ویژه
                          </p>
                        </div>
                      </div>

                      {/* VIP Status Card */}
                      <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-950/90 border border-amber-500/40 flex items-center justify-between gap-4 shadow-inner">
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-400 font-bold">وضعیت اشتراک (VIP Status)</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-amber-300 capitalize flex items-center gap-1">
                              {vipPlan === 'silver' && '🥉 Silver VIP'}
                              {vipPlan === 'gold' && '🥈 Gold VIP'}
                              {vipPlan === 'diamond' && '🥇 Diamond VIP'}
                              {vipPlan === 'elite' && '💠 Elite VIP'}
                              {vipPlan === 'none' && 'غیرفعال (Free Member)'}
                            </span>
                            {vipPlan !== 'none' && (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                                {vipExpireDays} روز باقی‌مانده
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setIsVipModalOpen(true);
                            showToast('صفحه تمدید و ارتقای اشتراک VIP باز شد');
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs shadow-md transition transform active:scale-95 shrink-0 flex items-center gap-1.5"
                        >
                          <Crown className="w-3.5 h-3.5 fill-slate-950" />
                          <span>{vipPlan === 'none' ? 'خرید VIP' : 'تمدید VIP (Renew)'}</span>
                        </button>
                      </div>
                    </div>

                    {/* MONTHLY REWARD CLAIM BOX FOR ACTIVE VIPS */}
                    {vipPlan !== 'none' && (
                      <div className="mt-5 pt-4 border-t border-amber-500/30 flex items-center justify-between flex-wrap gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-amber-500/20">
                        <div className="flex items-center gap-2 text-xs">
                          <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
                          <div>
                            <span className="font-black text-amber-300">هدایای ماهانه VIP (Monthly Gift): </span>
                            <span className="text-slate-200">۵۰۰ سکه رایگان + ۵۰ الماس + قاب طلایی اختصاصی</span>
                          </div>
                        </div>

                        {isVipMonthlyClaimed ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            هدیه این ماه دریافت شد
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setUserCoins(prev => prev + 500);
                              setIsVipMonthlyClaimed(true);
                              safeStorage.setItem('vlive_vip_monthly_claimed', 'true');
                              showToast('🎁 ۵۰۰ سکه + ۵۰ الماس + قاب طلایی ماهانه به شما اهدا شد!');
                            }}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            دریافت هدیه ماهانه
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. VIP PLANS SELECTOR (پلن‌ها) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        ۲. انتخاب سطح اشتراک VIP (Subscription Tiers)
                      </h3>
                      <span className="text-xs text-slate-300 font-medium">سطح دلخواه خود را انتخاب کنید</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* SILVER PLAN */}
                      <div 
                        onClick={() => setSelectedVipPlan('silver')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'silver' ? 'bg-slate-900 border-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.25)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg">🥉</span>
                            <span className="text-xs font-mono font-black text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                              300 Coins / mo
                            </span>
                          </div>
                          <h4 className="text-base font-black text-slate-200">Silver VIP</h4>
                          <p className="text-[11px] text-slate-300 font-medium">مناسب برای شروع و مرور بدون تبلیغات</p>
                          <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-slate-800">
                            <li className="flex items-center gap-1.5">✅ بدون تبلیغات (No Ads)</li>
                            <li className="flex items-center gap-1.5">👑 نشان VIP نقره‌ای</li>
                            <li className="flex items-center gap-1.5">📞 تماس تصویری HD</li>
                            <li className="flex items-center gap-1.5">🎧 اولویت در پشتیبانی</li>
                          </ul>
                        </div>

                        <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'silver' ? 'bg-slate-200 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'}`}>
                          {selectedVipPlan === 'silver' ? 'انتخاب شده ✓' : 'انتخاب Silver'}
                        </div>
                      </div>

                      {/* GOLD PLAN (POPULAR) */}
                      <div 
                        onClick={() => setSelectedVipPlan('gold')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'gold' ? 'bg-slate-900 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                      >
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] shadow-md">
                          محبوب‌ترین ⭐
                        </span>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-lg">🥈</span>
                            <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                              500 Coins / mo
                            </span>
                          </div>
                          <h4 className="text-base font-black text-amber-300">Gold VIP</h4>
                          <p className="text-[11px] text-slate-300 font-medium">بهترین گزینه برای کاربران فعال و استریمرها</p>
                          <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-slate-800">
                            <li className="flex items-center gap-1.5 text-amber-200 font-bold">✅ همه امکانات Silver +</li>
                            <li className="flex items-center gap-1.5">🎁 ارسال هدایای ویژه VIP</li>
                            <li className="flex items-center gap-1.5">🚪 ورود به اتاق‌های VIP</li>
                            <li className="flex items-center gap-1.5">🎥 افزایش کیفیت لایو (1080p)</li>
                            <li className="flex items-center gap-1.5">🖼️ فریم اختصاصی طلایی</li>
                          </ul>
                        </div>

                        <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'gold' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                          {selectedVipPlan === 'gold' ? 'انتخاب شده ✓' : 'انتخاب Gold'}
                        </div>
                      </div>

                      {/* DIAMOND PLAN */}
                      <div 
                        onClick={() => setSelectedVipPlan('diamond')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'diamond' ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'}`}
                      >
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] shadow-md">
                          ارزش فوق‌العاده 💎
                        </span>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-lg">🥇</span>
                            <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
                              1,000 Coins / mo
                            </span>
                          </div>
                          <h4 className="text-base font-black text-cyan-300">Diamond VIP</h4>
                          <p className="text-[11px] text-slate-300 font-medium">تجربه شاهانه با بیشترین پروموت و بوست</p>
                          <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-slate-800">
                            <li className="flex items-center gap-1.5 text-cyan-200 font-bold">✅ همه امکانات Gold +</li>
                            <li className="flex items-center gap-1.5">📞 تماس خصوصی اختصاصی</li>
                            <li className="flex items-center gap-1.5">🔥 ۵X دیده شدن در Discover</li>
                            <li className="flex items-center gap-1.5">🚀 Boost لایو در بالای لیست</li>
                            <li className="flex items-center gap-1.5">💎 نشان و Badge Diamond</li>
                          </ul>
                        </div>

                        <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'diamond' ? 'bg-gradient-to-r from-cyan-500 to-blue-400 text-slate-950 font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                          {selectedVipPlan === 'diamond' ? 'انتخاب شده ✓' : 'انتخاب Diamond'}
                        </div>
                      </div>

                      {/* ELITE VIP (EXCLUSIVE BY INVITATION) */}
                      <div 
                        onClick={() => setSelectedVipPlan('elite')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d flex flex-col justify-between space-y-3 relative ${selectedVipPlan === 'elite' ? 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.3)]' : 'bg-slate-950/80 border-purple-900/60 hover:border-purple-600'}`}
                      >
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-[10px] shadow-md">
                          خاص با دعوت 💠
                        </span>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-lg">💠</span>
                            <span className="text-xs font-mono font-black text-purple-300 bg-purple-500/20 px-2.5 py-0.5 rounded-full border border-purple-400/40">
                              ادمین / دعوت
                            </span>
                          </div>
                          <h4 className="text-base font-black text-purple-300">Elite VIP</h4>
                          <p className="text-[11px] text-slate-300 font-medium">سطح فوق‌العاده اختصاصی مدیران و سفیران</p>
                          <ul className="text-xs text-slate-200 space-y-1.5 pt-1 border-t border-purple-900/60">
                            <li className="flex items-center gap-1.5 text-purple-200 font-bold">💠 نشان و تگ اختصاصی Elite</li>
                            <li className="flex items-center gap-1.5">☎️ پشتیبانی اختصاصی ۲۴/۷</li>
                            <li className="flex items-center gap-1.5">🚀 دسترسی زودتر به قابلیت‌ها</li>
                            <li className="flex items-center gap-1.5">🖼️ قاب‌های نایاب پروفایل</li>
                          </ul>
                        </div>

                        <div className={`w-full py-2 rounded-xl text-xs font-bold text-center transition ${selectedVipPlan === 'elite' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black shadow-md' : 'bg-slate-900 text-slate-400'}`}>
                          {selectedVipPlan === 'elite' ? 'انتخاب شده ✓' : 'درخواست Elite'}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. DURATION & PAYMENT OPTIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* DURATION SELECTOR */}
                    <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        ۳. مدت زمان اشتراک (Subscription Duration)
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { duration: 1, label: '۱ ماهه', discount: '0%', badge: 'عادی' },
                          { duration: 3, label: '۳ ماهه', discount: '15%', badge: '۱۵٪ تخفیف' },
                          { duration: 6, label: '۶ ماهه', discount: '25%', badge: '۲۵٪ تخفیف' },
                          { duration: 12, label: '۱۲ ماهه (سالانه)', discount: '40%', badge: '۴۰٪ تخفیف ویژه 🔥' }
                        ].map(item => (
                          <button
                            key={item.duration}
                            onClick={() => setSelectedVipDuration(item.duration)}
                            className={`p-3 rounded-2xl border text-right transition flex flex-col justify-between space-y-1 ${selectedVipDuration === item.duration ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-white">{item.label}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {item.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {item.duration * 30} روز اعتبار
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* PAYMENT METHOD SELECTOR */}
                    <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-amber-400" />
                          ۴. روش پرداخت (Payment Method)
                        </h4>

                        <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                          <button
                            onClick={() => setSelectedVipPayMethod('in_app')}
                            className={`p-3 rounded-2xl border text-center transition space-y-1 ${selectedVipPayMethod === 'in_app' ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                          >
                            <CreditCard className="w-5 h-5 mx-auto text-amber-400" />
                            <span className="block text-[11px] font-bold">پرداخت در برنامه‌ای</span>
                          </button>

                          <button
                            onClick={() => setSelectedVipPayMethod('usdt')}
                            className={`p-3 rounded-2xl border text-center transition space-y-1 ${selectedVipPayMethod === 'usdt' ? 'bg-emerald-500/10 border-emerald-400 text-emerald-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                          >
                            <DollarSign className="w-5 h-5 mx-auto text-emerald-400" />
                            <span className="block text-[11px] font-bold">USDT (TRC20)</span>
                          </button>

                          <button
                            onClick={() => setSelectedVipPayMethod('coins')}
                            className={`p-3 rounded-2xl border text-center transition space-y-1 ${selectedVipPayMethod === 'coins' ? 'bg-amber-500/10 border-amber-400 text-amber-300 font-bold shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
                          >
                            <CoinsIcon className="w-5 h-5 mx-auto text-amber-400" />
                            <span className="block text-[11px] font-bold">سکه‌های من</span>
                          </button>
                        </div>
                      </div>

                      {/* FINAL PAYMENT CTA BUTTON */}
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        {selectedVipPlan === 'elite' ? (
                          <button
                            onClick={() => {
                              setVipEliteRequested(true);
                              showToast('درخواست فعال‌سازی Elite VIP برای مدیریت ارسال شد');
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-black text-xs shadow-lg hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Shield className="w-4 h-4" />
                            <span>{vipEliteRequested ? 'درخواست در حال بررسی مدیران...' : 'ارسال درخواست فعال‌سازی Elite VIP'}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const basePrices = { silver: 300, gold: 500, diamond: 1000 };
                              const discountMultipliers = { 1: 1.0, 3: 0.85, 6: 0.75, 12: 0.60 };
                              const monthlyCost = basePrices[selectedVipPlan] || 500;
                              const totalBaseCoins = monthlyCost * selectedVipDuration;
                              const finalCoinsCost = Math.round(totalBaseCoins * (discountMultipliers[selectedVipDuration] || 1.0));

                              if (selectedVipPayMethod === 'coins') {
                                if (userCoins < finalCoinsCost) {
                                  showToast(`موجودی سکه کافی نیست! هزینه: ${finalCoinsCost} سکه`);
                                  return;
                                }
                                setUserCoins(prev => prev - finalCoinsCost);
                              }

                              setVipPlan(selectedVipPlan);
                              setVipExpireDays(selectedVipDuration * 30);
                              setIsVipMonthlyClaimed(false);
                              safeStorage.setItem('vlive_vip_plan', selectedVipPlan);
                              safeStorage.setItem('vlive_vip_expire_days', (selectedVipDuration * 30).toString());
                              safeStorage.setItem('vlive_vip_monthly_claimed', 'false');

                              setIsVipCelebrationOpen(true);
                              showToast(`👑 اشتراک ${selectedVipPlan.toUpperCase()} با موفقیت فعال شد!`);
                            }}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 transition active:scale-95 flex items-center justify-center gap-2 animate-pulse"
                          >
                            <Crown className="w-4 h-4 fill-slate-950" />
                            <span>تایید و فعال‌سازی اشتراک {selectedVipPlan.toUpperCase()} ({selectedVipDuration} ماهه)</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* 4. 10 VIP BENEFITS GRID (مزایای ۱۰ گانه) */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="border-b border-slate-800 pb-2.5">
                      <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        ۴. لیست کامل مزایا و امکانات VIP (10 Privileges)
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">تمامی قابلیت‌هایی که بلافاصله بعد از خرید در کل برنامه فعال می‌شوند</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                      {[
                        { icon: Crown, title: 'Badge اختصاصی', desc: 'نشان طلایی کنار نام در تمام چت‌ها و لایوها' },
                        { icon: Sparkles, title: 'افکت ویژه پروفایل', desc: 'فریم‌های متحرک نئونی و طلایی' },
                        { icon: Radio, title: 'کیفیت بالاتر لایو', desc: 'پخش استریم با وضوح 1080p / 4K' },
                        { icon: PhoneCall, title: 'تماس تصویری HD', desc: 'مکالمات تصویری بدون تاخیر با بالاترین کیفیت' },
                        { icon: ShieldCheck, title: 'حذف کامل تبلیغات', desc: 'تجربه کاملا روان بدون اسپم و تبلیغ' },
                        { icon: Flame, title: 'نمایش بیشتر در Discover', desc: '۲X تا ۵X دیده شدن بیشتر در تب کشف' },
                        { icon: Star, title: 'اولویت در نتایج', desc: 'بالانشینی در نتایج جستجو و لیست اعضا' },
                        { icon: Gift, title: 'هدایای انحصاری', desc: 'دسترسی به ۵+ هدیه اختصاصی VIP' },
                        { icon: Palette, title: 'تم‌های اختصاصی', desc: 'پوسته‌ها و تم‌های طلایی و نئونی' },
                        { icon: Gift, title: 'هدیه ماهانه', desc: '۵۰۰ سکه + ۵۰ الماس + قاب رایگان هر ماه' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 hover:border-amber-500/40 transition">
                          <item.icon className="w-5 h-5 text-amber-400" />
                          <h5 className="font-black text-white text-xs">{item.title}</h5>
                          <p className="text-[10px] text-slate-300 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. STREAMERS VS VIEWERS BENEFITS CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* STREAMERS BENEFITS */}
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 border border-amber-500/30 space-y-3">
                      <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
                        <Radio className="w-5 h-5 text-amber-400" />
                        <h4 className="text-xs font-black text-amber-300">مزایای اختصاصی استریمرهای VIP</h4>
                      </div>
                      <ul className="text-xs text-slate-200 space-y-2">
                        <li className="flex items-center gap-2">⭐ <strong>لایو در اولویت نمایش:</strong> سنجاق شدن استریم در بالای صفحه اول</li>
                        <li className="flex items-center gap-2">💰 <strong>کارمزد کمتر روی هدایا:</strong> فقط ۱۰٪ کارمزد پلتفرم به جای ۲۰٪</li>
                        <li className="flex items-center gap-2">🔒 <strong>امکان ایجاد لایو خصوصی:</strong> اتاق‌های اختصاصی فقط برای VIPها</li>
                        <li className="flex items-center gap-2">📊 <strong>ابزارهای حرفه‌ای‌تر:</strong> آنالیتیکس پیشرفته و ابزار مدیریت چت</li>
                      </ul>
                    </div>

                    {/* VIEWERS BENEFITS */}
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-slate-900 border border-purple-500/30 space-y-3">
                      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-2">
                        <UserCheck className="w-5 h-5 text-purple-400" />
                        <h4 className="text-xs font-black text-purple-300">مزایای اختصاصی کاربران VIP</h4>
                      </div>
                      <ul className="text-xs text-slate-200 space-y-2">
                        <li className="flex items-center gap-2">💬 <strong>پیام بدون محدودیت:</strong> گفتگو با استریمرها بدون فیلتر اسپم</li>
                        <li className="flex items-center gap-2">📞 <strong>تماس تصویری با کیفیت بالاتر:</strong> تماس 4K با شفافیت کریستالی</li>
                        <li className="flex items-center gap-2">✨ <strong>استیکرها و ایموجی‌های اختصاصی:</strong> پکیج ایموجی‌های نایاب VIP</li>
                        <li className="flex items-center gap-2">🖼️ <strong>قاب و پس‌زمینه اختصاصی:</strong> تزیینات نئونی پروفایل و چت</li>
                      </ul>
                    </div>

                  </div>

                  {/* 6. PLAN COMPARISON MATRIX TABLE (جدول مقایسه) */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3 overflow-x-auto">
                    <h3 className="text-xs font-black text-amber-300 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-amber-400" />
                      ۶. جدول مقایسه کامل قابلیت‌های پلن‌های VIP
                    </h3>

                    <table className="w-full text-right text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-300 font-black">
                          <th className="p-2.5">قابلیت</th>
                          <th className="p-2.5 text-center text-slate-300">Silver 🥉</th>
                          <th className="p-2.5 text-center text-amber-300">Gold 🥈</th>
                          <th className="p-2.5 text-center text-cyan-300">Diamond 🥇</th>
                          <th className="p-2.5 text-center text-purple-300">Elite 💠</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-200">
                        <tr>
                          <td className="p-2.5 font-bold">حذف تبلیغات</td>
                          <td className="p-2.5 text-center text-emerald-400">✅</td>
                          <td className="p-2.5 text-center text-emerald-400">✅</td>
                          <td className="p-2.5 text-center text-emerald-400">✅</td>
                          <td className="p-2.5 text-center text-emerald-400">✅</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Badge VIP</td>
                          <td className="p-2.5 text-center text-slate-300">✅ Silver</td>
                          <td className="p-2.5 text-center text-amber-300 font-bold">✅ Gold</td>
                          <td className="p-2.5 text-center text-cyan-300 font-bold">✅ Diamond</td>
                          <td className="p-2.5 text-center text-purple-300 font-bold">✅ Elite 💠</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Boost Profile</td>
                          <td className="p-2.5 text-center text-rose-400">❌</td>
                          <td className="p-2.5 text-center text-amber-300 font-bold">✅ 2X</td>
                          <td className="p-2.5 text-center text-cyan-300 font-bold">✅ 5X</td>
                          <td className="p-2.5 text-center text-purple-300 font-bold">✅ 10X Top</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">Boost Live Stream</td>
                          <td className="p-2.5 text-center text-rose-400">❌</td>
                          <td className="p-2.5 text-center text-amber-300">✅</td>
                          <td className="p-2.5 text-center text-cyan-300 font-bold">✅ Pinned Top</td>
                          <td className="p-2.5 text-center text-purple-300 font-bold">✅ Always #1</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">هدیه ماهانه (Coins)</td>
                          <td className="p-2.5 text-center text-rose-400">❌</td>
                          <td className="p-2.5 text-center text-amber-300 font-mono">500 Coins</td>
                          <td className="p-2.5 text-center text-cyan-300 font-mono font-bold">1,000 Coins</td>
                          <td className="p-2.5 text-center text-purple-300 font-mono font-bold">2,500 Coins</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">پشتیبانی ویژه</td>
                          <td className="p-2.5 text-center text-slate-300">اولویت عادی</td>
                          <td className="p-2.5 text-center text-amber-300">✅ سریع</td>
                          <td className="p-2.5 text-center text-cyan-300 font-bold">✅ آنی VIP</td>
                          <td className="p-2.5 text-center text-purple-300 font-bold">✅ ۲۴/۷ Concierge</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">تم و قاب اختصاصی</td>
                          <td className="p-2.5 text-center text-rose-400">❌</td>
                          <td className="p-2.5 text-center text-slate-300">قاب طلایی</td>
                          <td className="p-2.5 text-center text-cyan-300 font-bold">✅ قاب و تم اختصاصی</td>
                          <td className="p-2.5 text-center text-purple-300 font-bold">✅ نایاب نئونی</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* 7. FULL APP INTEGRATION CALLOUT BANNER */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-900 border border-pink-500/30 text-xs space-y-2">
                    <p className="font-black text-pink-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-pink-400" />
                      اتصال فعال VIP در تمام بخش‌های V.Live:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">🏠 Home: نمایش بیشتر</div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">🔍 Discover: اولویت جستجو</div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">🎥 Live: اولویت استریم</div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">💬 Messages: پیام نامحدود</div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">👤 Profile: قاب نئونی 👑</div>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">👛 Wallet: هدیه ماهانه</div>
                    </div>
                  </div>

                </div>"""

if wallet_vip_target in content:
    content = content.replace(wallet_vip_target, new_vip_inline_block)
    print("✅ Updated Wallet Subtab VIP!")
else:
    print("❌ Could not find wallet_vip_target")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Part 2 complete.")
