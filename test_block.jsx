export default function Test() { return ( <>
{activeStoryView && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-3 sm:p-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          {/* Top Progress & User Info Header */}
          <div className="w-full max-w-md space-y-3 relative z-20">
            {/* Story Progress Bars */}
            <div className="flex gap-1.5 w-full">
              {activeStoryView.group.items.map((item, idx) => (
                <div key={item.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-400 transition-all duration-75"
                    style={{
                      width: idx < activeStoryView.currentIndex ? '100%' : idx === activeStoryView.currentIndex ? `${activeStoryView.progress}%` : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* User Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={activeStoryView.group.user.avatar} alt={activeStoryView.group.user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500" />
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                    {activeStoryView.group.user.name}
                    {activeStoryView.group.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  </h4>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {activeStoryView.group.items[activeStoryView.currentIndex]?.time || loc('هم‌اکنون', 'right now')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeStoryView.group.isMe && (
                  <button
                    onClick={() => setIsStoryViewersOpen(true)}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 border border-white/20"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>{activeStoryView.group.items[activeStoryView.currentIndex]?.views || 0} {loc('بازدید', 'visit')}</span>
                  </button>
                )}
                <button
                  onClick={handleCloseStory}
                  className="p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Story Content Container */}
          <div className="relative w-full max-w-md flex-1 my-3 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-950 border border-slate-800 shadow-2xl">
            {/* Story Image / Media */}
            <img 
              src={activeStoryView.group.items[activeStoryView.currentIndex]?.url} 
              alt="Story Content" 
              className="w-full h-full object-cover"
            />

            {/* Interactive Poll Sticker Overlay */}
            {activeStoryView.group.items[activeStoryView.currentIndex]?.hasPoll && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/85 backdrop-blur-md p-4 rounded-3xl border border-pink-500/50 w-64 text-center space-y-3 shadow-2xl z-20">
                <span className="text-xs font-black text-pink-400">{loc('📊 نظرسنجی زنده استوری', '📊 Live story poll')}</span>
                <p className="text-sm font-bold text-white">{activeStoryView.group.items[activeStoryView.currentIndex]?.pollQuestion}</p>
                <div className="space-y-2">
                  {activeStoryView.group.items[activeStoryView.currentIndex]?.pollOptions?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => showToast(window.loc(`رای شما به "${opt}" ثبت شد!`, `رای شما به "${opt}" ثبت شد!`))}
                      className="w-full py-2 bg-slate-950/60 rounded-xl border border-white/20 text-white font-bold backdrop-blur-md hover:bg-pink-500/80 transition"
                    >
                      {opt}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const next = !isStreamerFollowed;
                      setIsStreamerFollowed(next);
                      showToast(next ? window.loc(`با موفقیت ${viewingStream.host} دنبال شد 👤`, `با موفقیت ${viewingStream.host} دنبال شد 👤`) : window.loc(`دنبال کردن لغو شد`, `دنبال کردن لغو شد`));
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black shadow transition ml-1 ${
                    isStreamerFollowed 
                      ? 'bg-slate-800 text-slate-300 border border-slate-700' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  }`}
                >
                  {isStreamerFollowed ? loc('دنبال شده', 'Followed') : loc('+ دنبال کردن', '+ follow')}
                </button>
                </div>
              

              {/* ================= EXPANDABLE LIVE INFORMATION PANEL ================= */}
            {isLiveInfoPanelOpen && (
              <div className="absolute top-16 left-4 z-40 max-w-sm w-full bg-slate-950/95 border border-pink-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3 dir-rtl text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-pink-400" />
                    <span>{loc('اطلاعات لایواستریم & قوانین', 'Livestream info & rules')}</span>
                  </h3>
                  <button onClick={() => setIsLiveInfoPanelOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('عنوان استریم:', 'Stream title:')}</span>
                    <p className="font-bold text-white">{viewingStream.title || loc('لایواستریم اختصاصی V.LIVE', 'Exclusive V.LIVE live stream')}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('دسته‌بندی', 'categorization')}</span>
                      <span className="font-bold text-cyan-300">{viewingStream.category || 'General'}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('زبان', 'language')}</span>
                      <span className="font-bold text-emerald-300">{loc('🇮🇷 فارسی', '🇮🇷 Persian')}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block">{loc('کشور', 'the country')}</span>
                      <span className="font-bold text-amber-300">{loc('ایران 🇮🇷', 'Iran 🇮🇷')}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('برچسب‌ها:', 'Tags:')}</span>
                    <p className="text-[11px] font-mono text-cyan-300">{viewingStream.tags || '#vlive #stream #live'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-pink-400 font-bold block">{loc('توضیحات استریمر:', 'Streamer description:')}</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {viewingStream.description || loc('به پخش زنده خوش آمدید! برای حمایت می‌توانید هدیه ارسال کنید و در چت گفتگو نمایید.', 'Welcome to the live stream! To support, you can send a gift and talk in the chat.')}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                    <span className="font-black text-amber-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{loc('قوانین روم و چت زنده:', 'Room rules and live chat:')}</span>
                    </span>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5 text-[10px]">
                      <li>{loc('احترام متقابل به استریمر و سایر بینندگان الزامی است.', 'Mutual respect for the streamer and other viewers is required.')}</li>
                      <li>{loc('ارسال لینک‌های مشکوک، تبلیغات و پیام‌های تکراری ممنوع است.', 'It is forbidden to send suspicious links, advertisements and duplicate messages.')}</li>
                      <li>{loc('هوش مصنوعی هوشمند تمام پیام‌ها را بررسی می‌کند.', 'Intelligent artificial intelligence checks all messages.')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ================= EXPANDABLE LIVE MEMBERS PANEL ================= */}
            {isLiveMembersOpen && (
              <div className="absolute top-16 right-4 z-40 max-w-xs w-full bg-slate-950/95 border border-purple-500/40 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-3 dir-rtl text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>{loc('اعضای آنلاین روم (', 'Rome Online Members (')}{(viewingStream.viewers || 3820).toLocaleString()})</span>
                  </h3>
                  <button onClick={() => setIsLiveMembersOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-300 max-h-60 overflow-y-auto custom-scrollbar">
                  <span className="text-[10px] font-bold text-amber-400 block">{loc('👑 حامیان برتر (Top Supporters):', '👑 Top Supporters:')}</span>
                  <div className="space-y-1">
                    {[
                      { name: 'Arash_VIP', coins: '12,500 🪙', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80' },
                      { name: 'Sahar_Royal', coins: '8,200 🪙', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' }
                    ].map((sup, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <img src={sup.avatar} alt={sup.name} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-white text-[11px]">{sup.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-400">{sup.coins}</span>
                      </div>
                    ))}
                  </div>

                  <span className="text-[10px] font-bold text-cyan-400 block pt-1">{loc('🎙️ مهمانان فعال روم:', '🎙️ active guests of Rome:')}</span>
                  {guestRequestStatus === 'accepted' ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-emerald-500/30">
                      <span className="font-bold text-emerald-300 text-[11px]">{loc('شما (مهمان صوتی)', 'you (audio guest)')}</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">{loc('متصل', 'connected')}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500">{loc('هیچ مهمان فعالی روی استیج نیست.', 'There are no active guests on stage.')}</p>
                  )}
                </div>
              </div>
            )}

            {/* ================= CHAT OVERLAY & CONTROLS ================= */}
            <div className="absolute bottom-4 left-4 right-4 z-20 space-y-2">
              
              {/* PINNED MESSAGES BANNER */}
              {streamPinnedMessages.length > 0 && (
                <div className="p-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md flex items-center justify-between text-xs text-amber-200 dir-rtl">
                  <div className="flex items-center gap-1.5 truncate">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                    <span className="font-black text-[10px] text-amber-400 shrink-0">{loc('سنجاق‌شده:', 'Pinned:')}</span>
                    <span className="truncate text-[11px]">{streamPinnedMessages[0].text}</span>
                  </div>
                  <button onClick={() => setStreamPinnedMessages([])} className="text-slate-400 hover:text-white p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* CHAT MESSAGES DISPLAY BOX */}
              {!isHideStreamChat && (
                <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-950/85 rounded-3xl backdrop-blur-xl border border-slate-800/80 dir-rtl text-right custom-scrollbar">
                  {streamChatMessages.map((msg) => (
                    <div key={msg.id || Math.random()} className="text-xs group flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-pink-400 hover:underline cursor-pointer" onClick={() => setSelectedUserProfile({ name: msg.user })}>
                          {msg.user}:
                        </span>
                        <span className="text-white font-medium leading-relaxed">{msg.text}</span>
                        {msg.isVip && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black border border-amber-500/30">
                            VIP
                          </span>
                        )}
                      </div>

                      {/* Quick Hover Message Actions */}
                      <div className="hidden group-hover:flex items-center gap-1 text-[10px] shrink-0">
                        <button 
                          onClick={() => {
                            navigator.clipboard?.writeText(msg.text);
                            showToast(loc('متن پیام کپی شد', 'The text of the message was copied'));
                          }}
                          className="text-slate-400 hover:text-white"
                          title={loc('کپی', 'copy')}
                        >
                          {loc('کپی', 'copy')}
                        </button>
                        <button 
                          onClick={() => {
                            showToast(window.loc(`ترجمه: ${msg.text}`, `ترجمه: ${msg.text}`));
                          }}
                          className="text-cyan-400 hover:text-cyan-300 font-bold"
                          title={loc('ترجمه', 'Translation')}
                        >
                          🌐
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* FLOATING SOUNDBOARD & GIFT TOOLBAR */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar dir-rtl">
                <button 
                  onClick={() => playSoundEffect('applause')}
                  className="px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-purple-900"
                >
                  <ThumbsUp className="w-3 h-3 text-purple-300" />
                  {loc('تشویق 👏', 'Cheers 👏')}
                </button>
                <button 
                  onClick={() => playSoundEffect('cheer')}
                  className="px-3 py-1 rounded-xl bg-pink-950/80 border border-pink-500/40 text-pink-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-pink-900"
                >
                  <Sparkles className="w-3 h-3 text-pink-300" />
                  {loc('هورا 🎉', 'Hooray 🎉')}
                </button>
                <button 
                  onClick={() => playSoundEffect('horn')}
                  className="px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-[10px] font-bold shrink-0 flex items-center gap-1 hover:bg-cyan-900"
                >
                  <Radio className="w-3 h-3 text-cyan-300" />
                  {loc('بوق 🎺', 'Horn 🎺')}
                </button>
                <button 
                  onClick={handleOpenLuckyBox}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-[10px] font-black shrink-0 flex items-center gap-1 shadow-md hover:brightness-110"
                >
                  <Gift className="w-3 h-3 text-slate-950" />
                  {loc('جعبه شانس (100c) 🎁', 'Lucky box (100c) 🎁')}
                </button>
                <button 
                  onClick={() => setIsHideStreamChat(!isHideStreamChat)}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-bold shrink-0"
                >
                  {isHideStreamChat ? loc('نمایش چت', 'Show chat') : loc('مخفی چت', 'hidden chat')}
                </button>
              </div>

              {/* Floating Animated Hearts */}
              <div className="absolute bottom-16 right-4 pointer-events-none w-24 h-48 overflow-hidden z-30">
                {floatingHearts.map(h => (
                  <div 
                    key={h.id} 
                    className="absolute bottom-0 text-xl animate-bounce transition-all duration-1000"
                    style={{ left: `${h.left}%`, color: h.color, opacity: 0.9 }}
                  >
                    ❤️
                  </div>
                ))}
              </div>

              {/* CHAT INPUT BAR & LIKE / GIFT BUTTONS */}
              <div className="flex items-center gap-2 dir-rtl">
                <input 
                  type="text" 
                  value={streamChatInput}
                  onChange={e => setStreamChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendStreamChat()}
                  placeholder={loc('ارسال پیام زنده در لایواستریم...', 'Send a live message on Livestream...')}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-white outline-none focus:border-pink-500"
                />
                
                <button 
                  onClick={handleSendStreamChat}
                  className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-lg"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>

                <button 
                  onClick={handleLikeStream}
                  className="p-2.5 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 active:scale-90 transition flex items-center gap-1"
                  title={loc('ارسال لایک زنده', 'Send live likes')}
                >
                  <Heart className="w-5 h-5 fill-red-500 text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black text-red-300">{streamLikes}</span>
                </button>

                <button onClick={() => setIsGiftCatalogOpen(true)} className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30">
                  <Gift className="w-5 h-5 text-amber-400 animate-bounce" />
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      
      

      
</> ); }