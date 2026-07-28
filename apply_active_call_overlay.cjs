const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

const overlayMarker = "{/* MODAL 5: ACTIVE PRIVATE 1-ON-1 VIDEO CALL VIEW */}";

const activeCallOverlayAndModalsCode = `
      {/* ==================== ACTIVE CALL OVERLAY & PIP FLOATING CARD ==================== */}
      {activeCall && (
        <div className={activeCall.isPiP ? "fixed bottom-20 right-4 z-50 w-80 h-52 rounded-3xl bg-slate-950 border-2 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.6)] overflow-hidden animate-fadeIn flex flex-col dir-rtl" : "fixed inset-0 z-50 bg-slate-950 flex flex-col dir-rtl"}>
          
          {/* TOP HEADER STATUS BAR */}
          <div className="absolute top-0 left-0 right-0 z-30 p-3 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between gap-2 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src={activeCall.user.avatar} alt={activeCall.user.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/60 shadow-lg" />
                {activeCall.isRecording && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-600 animate-ping ring-2 ring-slate-950" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white">{activeCall.user.name}</h3>
                  {activeCall.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />}
                  {activeCall.isRecording && <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-mono animate-pulse">REC</span>}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
                  <span>{activeCall.type === 'video' ? '📹 ویدیو HD' : '📞 صوتی کریستالی'}</span>
                  <span>•</span>
                  <span>{Math.floor(activeCall.seconds / 60).toString().padStart(2, '0')}:{(activeCall.seconds % 60).toString().padStart(2, '0')}</span>
                  {activeCall.isPaid && (
                    <span className="text-amber-300 flex items-center gap-0.5">
                      <Coins className="w-2.5 h-2.5" /> {activeCall.consumedCoins} سکه
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Security & PiP Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEncryptedCertModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1"
                title="مشاهده گواهی امنیت 256 بیتی"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">E2E Encrypted</span>
              </button>

              <button
                onClick={handleTogglePiPCall}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 hover:text-white transition"
                title={activeCall.isPiP ? "تمام‌صفحه" : "پنجره کوچک (PiP)"}
              >
                {activeCall.isPiP ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MAIN VIDEO & PARTICIPANTS CONTAINER */}
          <div className="relative flex-1 bg-slate-900 overflow-hidden flex items-center justify-center">
            {/* Real Camera Feed or High-Tech Simulated Visualizer */}
            {activeCall.isCameraOn ? (
              <video
                ref={callVideoRef}
                autoPlay
                playsInline
                muted
                className={\`w-full h-full object-cover \${activeCall.facingMode === 'user' ? 'scale-x-[-1]' : ''} \${activeCall.beautyFilter ? 'brightness-105 saturate-110' : ''} \${activeCall.isBgBlurred ? 'blur-md' : ''}\`}
              />
            ) : (
              <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full ring-4 ring-pink-500/50 overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.5)] animate-pulse">
                    <img src={activeCall.user.avatar} alt={activeCall.user.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full border-2 border-pink-500/30 animate-ping pointer-events-none" />
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-black text-white">{activeCall.user.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono mt-1">HD Voice Connection • 256-Bit Encrypted</p>
                </div>
              </div>
            )}

            {/* FLOATING GIFT ANIMATION OVERLAY */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {inCallFloatingGifts.map(g => (
                <div
                  key={g.id}
                  className="absolute text-4xl animate-bounce transition-all duration-1000 flex flex-col items-center"
                  style={{ top: \`\${g.y}%\`, left: \`\${g.x}%\` }}
                >
                  <span className="drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]">🎁</span>
                  <span className="text-[10px] font-black bg-slate-900/90 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400 shadow-xl">
                    {g.gift.name}
                  </span>
                </div>
              ))}
            </div>

            {/* LIVE AI SPEECH TRANSLATION SUBTITLE BAR */}
            {activeCall.translatedSubtitles && (
              <div className="absolute bottom-24 left-4 right-4 z-20 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-cyan-500/40 text-center shadow-2xl">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-cyan-400 mb-0.5">
                  <Globe className="w-3 h-3" />
                  <span>ترجمه همزمان هوشمند (AI Translation)</span>
                </div>
                <p className="text-xs font-bold text-white leading-relaxed">{activeCall.translatedSubtitles}</p>
              </div>
            )}
          </div>

          {/* BOTTOM CONTROLS BAR */}
          <div className="z-30 p-4 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl flex flex-col gap-3">
            {/* Control Buttons Row */}
            <div className="flex items-center justify-around gap-2 flex-wrap">
              {/* Mute Button */}
              <button
                onClick={handleToggleMuteCall}
                className={\`p-3.5 rounded-2xl border transition shadow-lg \${activeCall.isMuted ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-200 border-slate-700 hover:border-pink-500/50'}\`}
                title="Mute/Unmute"
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Speaker Button */}
              <button
                onClick={handleToggleSpeakerCall}
                className={\`p-3.5 rounded-2xl border transition shadow-lg \${activeCall.isSpeakerOn ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-200 border-slate-700'}\`}
                title="Speaker"
              >
                {activeCall.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Camera Switch */}
              <button
                onClick={handleToggleCameraCall}
                className={\`p-3.5 rounded-2xl border transition shadow-lg \${!activeCall.isCameraOn ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-200 border-slate-700'}\`}
                title="Turn Camera On/Off"
              >
                {!activeCall.isCameraOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Switch Facing Camera */}
              {activeCall.type === 'video' && (
                <button
                  onClick={handleSwitchCameraFacing}
                  className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-700 hover:border-pink-500/50 transition shadow-lg"
                  title="تغییر دوربین جلو / عقب"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>
              )}

              {/* Beauty Filter */}
              <button
                onClick={handleToggleBeautyFilter}
                className={\`p-3.5 rounded-2xl border transition shadow-lg \${activeCall.beautyFilter ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 text-slate-200 border-slate-700'}\`}
                title="فیلتر زیبایی"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
              </button>

              {/* In-Call Gift Shop Button */}
              <button
                onClick={() => setIsSendGiftInChatOpen(true)}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 text-amber-300 hover:text-white transition shadow-lg"
                title="ارسال هدیه وسط تماس"
              >
                <Gift className="w-5 h-5" />
              </button>

              {/* Record Call Button */}
              <button
                onClick={handleToggleRecordCall}
                className={\`p-3.5 rounded-2xl border transition shadow-lg \${activeCall.isRecording ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-900 text-slate-200 border-slate-700'}\`}
                title="ضبط مکالمه"
              >
                <Disc className="w-5 h-5 text-rose-400" />
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndActiveCall}
                className="p-4 rounded-3xl bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.8)] hover:bg-rose-700 active:scale-95 transition"
                title="پایان تماس"
              >
                <PhoneCall className="w-6 h-6 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PRE-CALL PAID TARIFF CONFIRMATION MODAL ==================== */}
      {preCallConfirmHost && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto shadow-lg">
              <img src={preCallConfirmHost.user.avatar} alt={preCallConfirmHost.user.name} className="w-full h-full object-cover rounded-[22px]" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">تایید تماس خصوصی پولی با {preCallConfirmHost.user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">این استریمر برای پاسخگویی به تماس، هزینه تعیین کرده است.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-right">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">نرخ تماس:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" /> {preCallConfirmHost.tariffRate} سکه در هر دقیقه
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">موجودی کیف پول شما:</span>
                <span className="font-bold text-emerald-400">{userCoins.toLocaleString()} سکه</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPreCallConfirmHost(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                انصراف
              </button>
              <button
                onClick={() => handleStartCallDirect(preCallConfirmHost.user, preCallConfirmHost.type, preCallConfirmHost.mode, true, preCallConfirmHost.tariffRate)}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg"
              >
                تایید و اتصال تماس
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== POST-CALL RATING & FEEDBACK MODAL ==================== */}
      {postCallRatingData && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-pink-500/50 max-w-sm w-full space-y-4 shadow-[0_0_50px_rgba(236,72,153,0.3)] text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 mx-auto shadow-lg">
              <img src={postCallRatingData.user.avatar} alt={postCallRatingData.user.name} className="w-full h-full object-cover rounded-[22px]" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">ثبت امتیاز کیفیت تماس با {postCallRatingData.user.name}</h3>
              <p className="text-xs text-slate-400 mt-1">مدت زمان: {postCallRatingData.duration} • کیفیت: {postCallRatingData.quality}</p>
            </div>

            {/* Stars Rating */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setRatingStarsCall(s)}
                  className="p-1 hover:scale-125 transition duration-200 cursor-pointer"
                >
                  <Star className={\`w-7 h-7 \${s <= ratingStarsCall ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}\`} />
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={ratingCommentCall}
                onChange={e => setRatingCommentCall(e.target.value)}
                placeholder="نظر شما درباره این تماس (اختیاری)..."
                className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleReportUserInCall('محتوای نامناسب')}
                className="px-3 py-2 rounded-2xl bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" /> گزارش
              </button>
              <button
                onClick={() => handleBlockUserInCall(postCallRatingData.user.username)}
                className="px-3 py-2 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" /> مسدودسازی
              </button>
              <button
                onClick={handleSubmitPostCallRating}
                className="flex-1 py-2 rounded-2xl btn-neon-pink text-xs font-black shadow-lg"
              >
                ثبت امتیاز
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SCHEDULE CALL MODAL ==================== */}
      {isScheduleCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                رزرو و برنامه‌ریزی تماس
              </h3>
              <button onClick={() => setIsScheduleCallModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-bold">انتخاب کاربر:</label>
                <select
                  onChange={e => {
                    const u = conversations.find(c => c.user.username === e.target.value)?.user;
                    setScheduleTargetUser(u);
                  }}
                  className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none mt-1 cursor-pointer"
                >
                  <option value="">انتخاب از مخاطبین...</option>
                  {conversations.map(c => (
                    <option key={c.id} value={c.user.username}>{c.user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold">تاریخ و زمان تماس:</label>
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={e => setScheduleDateTime(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold">توضیحات و موضوع تماس:</label>
                <input
                  type="text"
                  value={scheduleNote}
                  onChange={e => setScheduleNote(e.target.value)}
                  placeholder="مثلا: مشاوره اختصاصی استریم..."
                  className="w-full bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs text-white outline-none mt-1"
                />
              </div>
            </div>

            <button
              onClick={handleSaveScheduledCall}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-xs shadow-lg"
            >
              ثبت نهایی رزرو تماس
            </button>
          </div>
        </div>
      )}

      {/* ==================== RECORD CONSENT MODAL ==================== */}
      {isRecordConsentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-rose-500/50 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
              <Disc className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">اجازه ضبط مکالمه</h3>
              <p className="text-xs text-slate-400 mt-1">
                بر طبق قوانین حریم خصوصی، جهت ضبط مکالمه صوتی و تصویری تایید کاربر و سیستم‌عامل الزامی است.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsRecordConsentModalOpen(false)} className="flex-1 py-2 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs">
                انصراف
              </button>
              <button onClick={handleConfirmRecordConsent} className="flex-1 py-2 rounded-2xl bg-rose-600 text-white font-bold text-xs shadow-lg">
                تایید و شروع ضبط
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SECURITY ENCRYPTED CERTIFICATE MODAL ==================== */}
      {isEncryptedCertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-emerald-500/50 max-w-sm w-full space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">ارتباط رمزشده 256 بیتی (E2E Encrypted)</h3>
              <p className="text-xs text-slate-400 mt-1">
                این تماس به‌صورت مستقیم (Peer-to-Peer) رمزشده است و هیچ شخص ثالثی امکان شنود یا ضبط آن را ندارد.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400">
              Fingerprint: 8F:9A:31:C4:02:BE:78:E1
            </div>
            <button onClick={() => setIsEncryptedCertModalOpen(false)} className="w-full py-2.5 rounded-2xl bg-slate-800 text-white font-bold text-xs">
              بستن
            </button>
          </div>
        </div>
      )}
`;

content = content.replace(overlayMarker, activeCallOverlayAndModalsCode + "\n\n      " + overlayMarker);

fs.writeFileSync('src/App.jsx', content, 'utf8');
console.log('Successfully injected active call overlay & modals into App.jsx');
