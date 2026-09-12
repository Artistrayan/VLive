            {/* MAIN SYSTEM DISPLAY */}
            {matchMode === 'random' ? <div className="flex-1 flex flex-col justify-center space-y-5 py-4 w-full relative z-10">
                {matchState === 'idle' && <div className="space-y-4 text-center">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                      <Radio className="w-10 h-10 text-cyan-400 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white">{loc('رادار آنلاین', 'Live Radar')}</h4>
                      <p className="text-xs text-slate-400">
                        {loc('جستجوی رندوم کاربران آنلاین.', 'Random search for online users.')}
                      </p>
                    </div>

                    {!isUserSuperAdmin && <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 text-right space-y-1">
                      <p className="font-bold text-amber-400">📜 {loc('تماس رایگان ۲۰ ثانیه‌ای:', 'Free 20s Calls:')} {freeMatchCallsLeft} / 3</p>
                      <p>• {loc('در صورت اتمام سهمیه، هزینه به صورت دقیقه‌ای کسر می‌شود.', 'If quota ends, calls are charged per minute.')}</p>
                    </div>}

                    <button onClick={() => startRandomMatchSearch()} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition">
                      {loc('🚀 شروع جستجوی رادار', 'Start Radar Search')}
                    </button>
                  </div>}

                {matchState === 'searching' && <div className="py-12 text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full border-2 border-cyan-400 border-dashed animate-spin-slow flex items-center justify-center relative shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                       <Radio className="w-8 h-8 text-cyan-400 animate-ping absolute" />
                    </div>
                    <h4 className="text-sm font-black text-white">{loc('در حال اسکن رادار...', 'Scanning Radar...')}</h4>
                  </div>}

                {matchState === 'connected' && matchedMatchUser && <div className="space-y-4 px-2">
                    <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-slate-950 border border-cyan-400/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                      <img src={matchedMatchUser.avatar || ''} alt={matchedMatchUser.name || matchedMatchUser.username || 'User'} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 right-6 text-center space-y-4">
                        <div>
                          <h4 className="text-lg font-black text-white flex items-center justify-center gap-1">
                            {matchedMatchUser?.name || matchedMatchUser?.username || loc('کاربر آنلاین', 'Online User')}
                            {matchedMatchUser?.isVerified && <span className="text-blue-400 text-sm">✔</span>}
                          </h4>
                          <p className="text-xs text-cyan-300 font-bold mt-1 flex items-center justify-center gap-1">
                             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                             {loc('آنلاین', 'Online')}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4">
                          <button onClick={() => {
                            setMatchState('idle');
                          }} className="w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition shadow-lg">
                            <X className="w-6 h-6" />
                          </button>
                          
                          <button onClick={() => {
                            handleStartCallDirect(matchedMatchUser, 'video', true);
                            setMatchState('idle');
                          }} className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition">
                            <Heart className="w-8 h-8 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div> : (/* CARD SWIPE MODE */
            <div className="flex-1 flex flex-col justify-center items-center overflow-hidden py-1 w-full relative z-10">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? <div className="relative w-full max-w-xs aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-2xl flex flex-col justify-end transition-transform duration-200 group" style={{
                transform: `translate(${swipeDragPos.x}px, ${swipeDragPos.y}px) rotate(${swipeDragPos.x * 0.05}deg)`
              }} onTouchStart={handleTouchStart} onMouseDown={e => handleTouchStart({
                touches: [{
                  clientX: e.clientX,
                  clientY: e.clientY
                }]
              })} onTouchMove={handleTouchMove} onMouseMove={e => handleTouchMove({
                touches: [{
                  clientX: e.clientX,
                  clientY: e.clientY
                }]
              })} onTouchEnd={handleTouchEnd} onMouseUp={handleTouchEnd} onMouseLeave={handleTouchEnd}>
                    
                    {matchAnimationEffect && <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm animate-fadeIn">
                        {matchAnimationEffect === 'like' && <Heart className="w-32 h-32 text-pink-500 fill-pink-500 animate-bounce" />}
                        {matchAnimationEffect === 'reject' && <X className="w-32 h-32 text-red-500 animate-ping" />}
                        {matchAnimationEffect === 'superlike' && <Star className="w-32 h-32 text-amber-400 fill-amber-400 animate-pulse" />}
                      </div>}

                    {/* Background Blur & Photo */}
                    <img src={matchDeckProfiles[matchCardIndex]?.avatar || ''} alt={matchDeckProfiles[matchCardIndex]?.name || 'Match'} className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition duration-700 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <div className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-white text-xs font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{matchDeckProfiles[matchCardIndex].distance}</span>
                      </div>
                      {matchDeckProfiles[matchCardIndex].isVip && <span className="px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-black flex items-center gap-1">
                          👑 VIP
                        </span>}
                    </div>

                    {/* Card Details Info */}
                    <div className="relative z-10 p-5 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5 drop-shadow-md">
                            {matchDeckProfiles[matchCardIndex]?.name || ''}{matchDeckProfiles[matchCardIndex]?.age ? `, ${matchDeckProfiles[matchCardIndex]?.age}` : ''}
                            {matchDeckProfiles[matchCardIndex]?.isVerified && <span className="text-blue-400 text-sm">✔</span>}
                          </h2>
                        </div>
                        <p className="text-xs text-slate-300 font-bold flex items-center gap-1 mt-0.5 drop-shadow-md">
                          <span>📍</span> {matchDeckProfiles[matchCardIndex]?.city || ''}
                        </p>
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="grid grid-cols-4 gap-2 pt-2">
                        {/* Reject */}
                        <button onClick={() => {
                      setMatchAnimationEffect('reject');
                      setTimeout(() => {
                        setMatchCardIndex(prev => prev + 1);
                        setMatchAnimationEffect(null);
                      }, 300);
                    }} className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-red-400 hover:bg-red-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition" title="Reject">
                          <span className="text-lg">❌</span>
                          <span className="text-[9px]">Pass</span>
                        </button>

                        {/* Super Like */}
                        <button onClick={() => {
                      setMatchAnimationEffect('superlike');
                      showToast(`⭐ Super Liked @${matchDeckProfiles[matchCardIndex].name}!`);
                      setTimeout(() => {
                        setMatchCardIndex(prev => prev + 1);
                        setMatchAnimationEffect(null);
                      }, 300);
                    }} className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-amber-400 hover:bg-amber-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition" title="Super Like">
                          <span className="text-lg">⭐</span>
                          <span className="text-[9px]">Super</span>
                        </button>

                        {/* Like */}
                        <button onClick={() => {
                      setMatchAnimationEffect('like');
                      const target = matchDeckProfiles[matchCardIndex];
                      setTimeout(() => {
                        showToast(`❤️ Liked @${target.name}!`);
                        setMatchCardIndex(prev => prev + 1);
                        setMatchAnimationEffect(null);
                      }, 300);
                    }} className="py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg shadow-pink-500/30 active:scale-95 transition" title="Like">
                          <span className="text-lg">❤️</span>
                          <span className="text-[9px]">Like</span>
                        </button>

                        {/* Video Call */}
                        <button onClick={() => {
                      const target = matchDeckProfiles[matchCardIndex];
                      handleInitiateCall(target, 'video');
                    }} className="py-3 rounded-2xl bg-slate-900/90 border border-slate-700 text-cyan-400 hover:bg-cyan-500/20 font-bold flex flex-col items-center justify-center gap-0.5 shadow-lg active:scale-95 transition" title="Video Call">
                          <span className="text-lg">📹</span>
                          <span className="text-[9px]">Video</span>
                        </button>
                      </div>

                    </div>
                  </div> : <div className="text-center space-y-4 my-auto py-16">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-3xl animate-bounce">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">{loc('همه کارت‌ها دیده شدند!', 'All profiles viewed!')}</h4>
                      <p className="text-xs text-slate-400">{loc('برای مشاهده مجدد کارت‌های جدید کلیک کنید.', 'Refresh deck to see new profiles.')}</p>
                    </div>
                    <button onClick={() => setMatchCardIndex(0)} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition">
                      {loc('🔄 بارگذاری مجدد', '🔄 Refresh Deck')}
                    </button>
                  </div>}
              </div>)}
