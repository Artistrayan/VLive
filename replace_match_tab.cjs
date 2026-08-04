const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const matchTabStartStr = "{/* TAB: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}";
const matchTabEndStr = "        {/* TAB 2: MESSAGES & CHAT TAB */}";

const startIndex = content.indexOf(matchTabStartStr);
const endIndex = content.indexOf(matchTabEndStr);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find match tab boundaries in App.jsx");
  process.exit(1);
}

const newMatchTabJsx = `{/* TAB: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}
        {activeTab === 'match' && (
          <div className="space-y-4 max-w-md mx-auto animate-fadeIn pb-16 px-1">
            
            {/* 1. TOP HEADER (موجودی کیف پول بالا راست + لوگو وسط بالا + قوانین بالا چپ) */}
            <div className="card-3d p-3 rounded-3xl bg-slate-900/95 border border-pink-500/30 flex items-center justify-between gap-2 backdrop-blur-xl shadow-[0_0_35px_rgba(236,72,153,0.25)]">
              
              {/* Top Left: Rules Modal Button */}
              <button
                onClick={() => setIsMatchRulesModalOpen(true)}
                className="px-3 py-1.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-amber-500/30 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold shadow"
                title="قوانین و شرایط Match"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>قوانین</span>
              </button>

              {/* Top Center: App Logo (لوگو برنامه وسط بالا) */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMatchMode('random')}>
                <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/40 animate-pulse">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-1">
                    <span>V.LIVE</span>
                    <span className="text-pink-500 font-extrabold text-xs">MATCH</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">پخش آنلاین & مچ فوری</p>
                </div>
              </div>

              {/* Top Right: Wallet Balance (موجودی کیف پول بالا سمت راست) */}
              <button 
                onClick={() => setActiveTab('wallet')}
                className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 hover:from-amber-500/30 hover:to-pink-500/30 text-amber-300 border border-amber-500/40 active:scale-95 transition flex items-center gap-1.5 text-xs font-black shadow-md"
                title="افزایش موجودی سکه"
              >
                <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>{userCoins.toLocaleString()}</span>
                <Plus className="w-3.5 h-3.5 text-emerald-400 bg-emerald-500/20 rounded-full" />
              </button>

            </div>

            {/* 2. TOP MODE SWITCHER BAR (دو گزینه بالای صفحه: رندوم پیش فرض و انتخاب دستی اسکرول) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
              <button
                onClick={() => setMatchMode('random')}
                className={\`py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 \${
                  matchMode === 'random' 
                    ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-lg shadow-pink-500/30 ring-1 ring-pink-400/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }\`}
              >
                <Shuffle className="w-4 h-4" />
                <span>🎲 رندوم (پیش فرض)</span>
              </button>
              
              <button
                onClick={() => setMatchMode('manual')}
                className={\`py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 \${
                  matchMode === 'manual' 
                    ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-lg shadow-pink-500/30 ring-1 ring-pink-400/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }\`}
              >
                <Flame className="w-4 h-4" />
                <span>👈👉 انتخاب دستی (اسکرول)</span>
              </button>
            </div>

            {/* 3. MODE 1: RANDOM MATCH (صفحه پیش فرض / رندوم) */}
            {matchMode === 'random' && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* A. SEARCH FILTER BAR (زیرش فیلتر جستجو سه تا ایکون زن ۱۰ سکه و مرد ۱۰ سکه و هردو رایگان) */}
                <div className="card-3d p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg space-y-2 dir-rtl">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                    <span className="flex items-center gap-1.5 text-pink-400">
                      <Filter className="w-3.5 h-3.5" />
                      <span>فیلتر جنسیت جستجو:</span>
                    </span>
                    <span className="text-[11px] text-slate-400">انتخاب ترجیح مچینگ</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* 1. Woman Filter (10 Coins) */}
                    <button
                      onClick={() => {
                        setMatchGenderFilter('female');
                        showToast('👩 فیلتر زن انتخاب شد (۱۰ سکه برای هر تماس)');
                      }}
                      className={\`p-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center gap-1 border \${
                        matchGenderFilter === 'female'
                          ? 'bg-gradient-to-b from-pink-500/30 to-purple-600/30 border-pink-500 text-pink-300 shadow-md shadow-pink-500/20 ring-1 ring-pink-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }\`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-base">👩</span>
                        <span>زن</span>
                      </div>
                      <span className={\`text-[10px] px-2 py-0.5 rounded-full font-bold \${matchGenderFilter === 'female' ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-400'}\`}>
                        ۱۰ سکه
                      </span>
                    </button>

                    {/* 2. Man Filter (10 Coins) */}
                    <button
                      onClick={() => {
                        setMatchGenderFilter('male');
                        showToast('👨 فیلتر مرد انتخاب شد (۱۰ سکه برای هر تماس)');
                      }}
                      className={\`p-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center gap-1 border \${
                        matchGenderFilter === 'male'
                          ? 'bg-gradient-to-b from-cyan-500/30 to-blue-600/30 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }\`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-base">👨</span>
                        <span>مرد</span>
                      </div>
                      <span className={\`text-[10px] px-2 py-0.5 rounded-full font-bold \${matchGenderFilter === 'male' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400'}\`}>
                        ۱۰ سکه
                      </span>
                    </button>

                    {/* 3. Both Filter (Free) */}
                    <button
                      onClick={() => {
                        setMatchGenderFilter('both');
                        showToast('👥 فیلتر هردو انتخاب شد (رایگان)');
                      }}
                      className={\`p-2 rounded-xl text-xs font-black transition flex flex-col items-center justify-center gap-1 border \${
                        matchGenderFilter === 'both'
                          ? 'bg-gradient-to-b from-emerald-500/30 to-teal-600/30 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }\`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-base">👥</span>
                        <span>هردو</span>
                      </div>
                      <span className={\`text-[10px] px-2 py-0.5 rounded-full font-bold \${matchGenderFilter === 'both' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}\`}>
                        رایگان
                      </span>
                    </button>
                  </div>
                </div>

                {/* B. CENTER GRAPHIC (وسط صفحه لوگو بزرگ برنامه به صورت ۳ بعدی به صورت چشمک زن و دورش عکس‌های کاربران رندوم چشمک زن) */}
                <div className="relative min-h-[310px] flex items-center justify-center my-4 overflow-hidden py-4">
                  
                  {/* Radar Wave Rings */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 rounded-full border border-pink-500/20 animate-ping" />
                    <div className="w-56 h-56 rounded-full border border-purple-500/30 animate-pulse" />
                    <div className="w-40 h-40 rounded-full border border-cyan-500/20" />
                  </div>

                  {/* Surrounding Floating Random User Avatars (دور لوگو عکس‌های چشمک زن رندوم کاربران) */}
                  {matchDeckProfiles.slice(0, 6).map((profile, i) => {
                    const angles = [0, 60, 120, 180, 240, 300];
                    const radius = 120;
                    const angleRad = (angles[i] * Math.PI) / 180;
                    const x = Math.cos(angleRad) * radius;
                    const y = Math.sin(angleRad) * radius;

                    return (
                      <div
                        key={profile.id || i}
                        style={{
                          transform: \`translate(\${x}px, \${y}px)\`,
                          animationDelay: \`\${i * 0.4}s\`
                        }}
                        className="absolute z-10 w-13 h-13 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(236,72,153,0.5)] animate-pulse cursor-pointer hover:scale-125 transition duration-300"
                        onClick={() => {
                          setSelectedUser(profile);
                          setIsUserProfileModalOpen(true);
                        }}
                        title={profile.name}
                      >
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-full h-full rounded-full object-cover border-2 border-slate-950"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-ping" />
                      </div>
                    );
                  })}

                  {/* Center 3D Blinking App Logo (لوگو بزرگ برنامه به صورت سه بعدی به صورت چشمک زن) */}
                  <div className="relative z-20 flex flex-col items-center justify-center">
                    <div 
                      onClick={() => startRandomMatchSearch()}
                      className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-500 p-1 border-2 border-pink-300/60 shadow-[0_0_60px_rgba(236,72,153,0.7)] animate-bounce cursor-pointer group active:scale-95 transition flex items-center justify-center"
                    >
                      <div className="w-full h-full bg-slate-950/90 backdrop-blur-md rounded-[22px] flex flex-col items-center justify-center gap-1.5 p-2">
                        <Flame className="w-14 h-14 text-pink-400 group-hover:scale-110 transition duration-300 animate-pulse drop-shadow-[0_0_20px_rgba(236,72,153,0.9)]" />
                        <span className="text-[10px] font-black text-white uppercase tracking-wider bg-pink-500/30 px-2.5 py-0.5 rounded-full border border-pink-500/50">
                          V.LIVE MATCH
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-black text-slate-300 mt-3 flex items-center gap-1.5 bg-slate-900/80 px-3.5 py-1 rounded-full border border-slate-800 shadow dir-rtl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>آماده برای مچ فوری تصویری</span>
                    </p>
                  </div>

                </div>

                {/* SEARCHING RADAR OVERLAY STATE */}
                {matchState === 'searching' && (
                  <div className="card-3d p-6 rounded-3xl bg-slate-900/95 border border-pink-500/50 backdrop-blur-xl shadow-2xl text-center space-y-5 animate-fadeIn dir-rtl">
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="w-full h-full rounded-full border-4 border-pink-500 border-t-transparent animate-spin shadow-lg" />
                      <Flame className="w-10 h-10 text-pink-400 absolute animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">در حال جستجو و مچینگ کاربر...</h4>
                      <p className="text-xs text-slate-400">اتصال رمزنگاری‌شده 1080p Full HD</p>
                    </div>

                    {/* Controls during search: End search and Next */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => {
                          setMatchState('idle');
                          showToast('❌ جستجوی مچ لغو شد');
                        }}
                        className="py-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-black text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        <span>قطع جستجو</span>
                      </button>

                      <button
                        onClick={() => {
                          startRandomMatchSearch();
                        }}
                        className="py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>مچ بعدی (تسریع)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* C. BOTTOM AREA (پایین صفحه ایکون بزرگ دوربین برجسته و ۳ بعدی + بالای ایکون دوربین عدد ۳ رایگان محدودیت روزانه) */}
                {matchState === 'idle' && (
                  <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                    
                    {/* Daily Free Quota Badge / Filter Display above Camera */}
                    <div className="px-4 py-1.5 rounded-full bg-slate-900/90 border border-pink-500/40 backdrop-blur-md shadow-lg flex items-center gap-2 text-xs font-black animate-pulse dir-rtl">
                      {freeMatchCallsLeft > 0 ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <span>🎁</span>
                          <span>{freeMatchCallsLeft} رایگان</span>
                          <span className="text-[10px] text-slate-400">(محدودیت روزانه)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <span>هزینه انتخاب فیلتر:</span>
                          <span className="text-white bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/40 font-extrabold">
                            {matchGenderFilter === 'both' ? '🆓 رایگان' : '💰 ۱۰ سکه'}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Large Elevated 3D Camera Icon (ایکون بزرگ دوربین برجسته و سه بعدی) */}
                    <button
                      onClick={() => startRandomMatchSearch()}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-1.5 shadow-[0_12px_45px_rgba(236,72,153,0.6)] active:scale-90 transition duration-300 group relative"
                      title="شروع تماس تصویری مچ"
                    >
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center border-2 border-white/20 group-hover:bg-slate-900 transition">
                        <Video className="w-10 h-10 text-white group-hover:scale-110 transition drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]" />
                      </div>
                      <div className="absolute -inset-1 rounded-full border-2 border-pink-500/50 animate-ping pointer-events-none" />
                    </button>
                    
                    <span className="text-[11px] font-bold text-slate-400">برای شروع مچ لمس کنید</span>
                  </div>
                )}

                {/* D. RULES SUMMARY BANNER */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 dir-rtl">
                  <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800/80 pb-2">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>خلاصه قوانین مهم سیستم Match</span>
                    </span>
                    <button 
                      onClick={() => setIsMatchRulesModalOpen(true)}
                      className="text-[10px] text-pink-400 underline hover:text-pink-300"
                    >
                      مشاهده متن کامل ➔
                    </button>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                    <li>۳ تماس رایگان روزانه ذخیره نمی‌شود و انتهای روز بازنشانی می‌گردد.</li>
                    <li>زمان هر تماس رایگان ۳۰ ثانیه می‌باشد.</li>
                    <li>استریمرهای تایید شده: ۲۰ ثانیه اول رایگان، سپس کسر سکه به‌صورت دقیقه‌ای.</li>
                  </ul>
                </div>

              </div>
            )}

            {/* 4. MODE 2: MANUAL SELECTION SWIPE (صفحه انتخاب دستی با اسکرول به چپ تایید و به راست رد کردن) */}
            {matchMode === 'manual' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Helper Instructions Banner */}
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 dir-rtl">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span>👈 اسکرول چپ: تایید (Like)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <span>اسکرول راست: رد کردن (Pass) 👉</span>
                  </span>
                </div>

                {/* Interactive Swipeable Card Deck */}
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? (
                  <div
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      setIsSwipeDragging(true);
                      swipeStartPos.current = { x: touch.clientX, y: touch.clientY };
                    }}
                    onTouchMove={(e) => {
                      if (!isSwipeDragging) return;
                      const touch = e.touches[0];
                      setSwipeDragPos({
                        x: touch.clientX - swipeStartPos.current.x,
                        y: touch.clientY - swipeStartPos.current.y
                      });
                    }}
                    onTouchEnd={() => {
                      if (!isSwipeDragging) return;
                      setIsSwipeDragging(false);
                      // Left swipe (< -70): Approve / Like
                      // Right swipe (> 70): Reject / Pass
                      if (swipeDragPos.x < -70) triggerMatchAction('like');
                      else if (swipeDragPos.x > 70) triggerMatchAction('reject');
                      else if (swipeDragPos.y < -70) triggerMatchAction('superlike');
                      else setSwipeDragPos({ x: 0, y: 0 });
                    }}
                    onMouseDown={(e) => {
                      setIsSwipeDragging(true);
                      swipeStartPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    onMouseMove={(e) => {
                      if (!isSwipeDragging) return;
                      setSwipeDragPos({
                        x: e.clientX - swipeStartPos.current.x,
                        y: e.clientY - swipeStartPos.current.y
                      });
                    }}
                    onMouseUp={() => {
                      if (!isSwipeDragging) return;
                      setIsSwipeDragging(false);
                      if (swipeDragPos.x < -70) triggerMatchAction('like');
                      else if (swipeDragPos.x > 70) triggerMatchAction('reject');
                      else if (swipeDragPos.y < -70) triggerMatchAction('superlike');
                      else setSwipeDragPos({ x: 0, y: 0 });
                    }}
                    style={{
                      transform: \`translate(\${swipeDragPos.x}px, \${swipeDragPos.y}px) rotate(\${swipeDragPos.x * 0.05}deg)\`,
                      transition: isSwipeDragging ? 'none' : 'transform 0.3s ease'
                    }}
                    className="relative min-h-[460px] sm:min-h-[500px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.3)] flex flex-col justify-end select-none cursor-grab active:cursor-grabbing group"
                  >
                    {/* Background Blur */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 scale-125 pointer-events-none"
                      style={{ backgroundImage: \`url(\${matchDeckProfiles[matchCardIndex].avatar})\` }}
                    />

                    {/* Main Image */}
                    <img 
                      src={matchDeckProfiles[matchCardIndex].avatar} 
                      alt={matchDeckProfiles[matchCardIndex].name} 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-95 pointer-events-none group-hover:scale-105 transition duration-700" 
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                    {/* Visual Gesture Stamps */}
                    {isSwipeDragging && swipeDragPos.x < -30 && (
                      <div className="absolute top-12 right-6 z-30 px-5 py-2 rounded-2xl border-4 border-emerald-400 bg-emerald-500/20 text-emerald-300 font-black text-2xl uppercase tracking-widest rotate-[12deg] backdrop-blur-md shadow-2xl animate-pulse">
                        ❤️ تایید / LIKE
                      </div>
                    )}
                    {isSwipeDragging && swipeDragPos.x > 30 && (
                      <div className="absolute top-12 left-6 z-30 px-5 py-2 rounded-2xl border-4 border-rose-500 bg-rose-500/20 text-rose-300 font-black text-2xl uppercase tracking-widest rotate-[-12deg] backdrop-blur-md shadow-2xl animate-pulse">
                        ❌ رد / PASS
                      </div>
                    )}
                    {isSwipeDragging && swipeDragPos.y < -30 && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl border-4 border-amber-400 bg-amber-500/20 text-amber-300 font-black text-2xl uppercase tracking-widest backdrop-blur-md shadow-2xl animate-pulse">
                        ⭐ سوپر لایک
                      </div>
                    )}

                    {/* Profile Info & 3D Actions Bar */}
                    <div className="relative z-20 p-5 space-y-3 pointer-events-auto dir-rtl">
                      <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                          <span>{matchDeckProfiles[matchCardIndex].name}</span>
                          <span className="px-2.5 py-0.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold">
                            {matchDeckProfiles[matchCardIndex].age}
                          </span>
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-slate-300 font-bold mt-1">
                          <span>📍 {matchDeckProfiles[matchCardIndex].city}</span>
                          <span>•</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            آنلاین
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="grid grid-cols-5 gap-2 pt-2">
                        <button 
                          onClick={() => triggerMatchAction('reject')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center shadow-lg active:scale-90 transition"
                          title="رد کردن"
                        >
                          <X className="w-6 h-6" />
                        </button>

                        <button 
                          onClick={() => triggerMatchAction('gift')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 flex items-center justify-center shadow-lg active:scale-90 transition"
                          title="ارسال هدیه"
                        >
                          <Gift className="w-6 h-6 animate-bounce" />
                        </button>

                        <button 
                          onClick={() => triggerMatchAction('superlike')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center shadow-lg active:scale-90 transition"
                          title="سوپر لایک"
                        >
                          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                        </button>

                        <button 
                          onClick={() => triggerMatchAction('like')}
                          className="h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)] active:scale-90 transition"
                          title="تایید و لایک"
                        >
                          <Heart className="w-7 h-7 fill-white" />
                        </button>

                        <button 
                          onClick={() => {
                            const target = matchDeckProfiles[matchCardIndex];
                            handleInitiateCall(target, 'video', '1on1');
                          }}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center shadow-lg active:scale-90 transition"
                          title="تماس تصویری"
                        >
                          <Video className="w-6 h-6" />
                        </button>
                      </div>

                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl dir-rtl">
                    <h4 className="text-lg font-black text-white">تمام پروفایل‌ها دیده‌شدند!</h4>
                    <p className="text-xs text-slate-400">برای بازنشانی لیست کلیک کنید.</p>
                    <button
                      onClick={() => setMatchCardIndex(0)}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition"
                    >
                      بازنشانی لیست 🔄
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>
        )}
`;

content = content.substring(0, startIndex) + newMatchTabJsx + "\n" + content.substring(endIndex);

// Add the Rules Modal before final closing tag of container if not existing
if (!content.includes('isMatchRulesModalOpen &&')) {
  const modalJsx = `
      {/* MATCH RULES & TERMS MODAL */}
      {isMatchRulesModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/40 p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">قوانین و شرایط کامل Match</h3>
                  <p className="text-[11px] text-slate-400">راهنمای کامل سیستم مچ هوشمند V.LIVE</p>
                </div>
              </div>
              <button
                onClick={() => setIsMatchRulesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-amber-400 flex items-center gap-1.5">
                  <span>🎁</span>
                  <span>۱. سهمیه ۳ تماس رایگان روزانه</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  هر کاربر در روز دارای ۳ تماس رایگان است. در صورت عدم استفاده در طول روز، این سهمیه ذخیره نخواهد شد و پایان هر روز بازنشانی می‌شود.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-cyan-400 flex items-center gap-1.5">
                  <span>⏱️</span>
                  <span>۲. زمان تماس رایگان (۳۰ ثانیه)</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  مدت زمان هر تماس رایگان مچینگ حداکثر ۳۰ ثانیه می‌باشد. پس از ۳۰ ثانیه تماس به‌صورت خودکار خاتمه می‌یابد.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-pink-400 flex items-center gap-1.5">
                  <span>⭐</span>
                  <span>۳. استثنای استریمرهای تایید شده</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  کاربران تایید شده استریمر شامل محدودیت تماس رایگان استاندارد نبوده و تابع قوانین اختصاصی استریمرها می‌باشند.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="font-black text-emerald-400 flex items-center gap-1.5">
                  <span>💎</span>
                  <span>۴. قوانین تماس تصویری با استریمرها</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  در تماس با استریمر، ۲۰ ثانیه اول کاملاً رایگان است. بعد از ۲۰ ثانیه، سکه به‌صورت دقیقه‌ای از موجودی کاربر مقابل کسر می‌شود. در صورت کمبود موجودی، تماس خودکار قطع خواهد شد.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMatchRulesModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition"
            >
              متوجه شدم و تایید می‌کنم
            </button>
          </div>
        </div>
      )}
  `;

  const endAppIndex = content.lastIndexOf('</div>');
  if (endAppIndex !== -1) {
    content = content.substring(0, endAppIndex) + modalJsx + "\n" + content.substring(endAppIndex);
  }
}

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully replaced Match Tab in App.jsx");
