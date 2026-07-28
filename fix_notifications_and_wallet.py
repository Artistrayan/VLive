import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. FIX NOTIFICATION MODALS
notif_start = content.find('{/* MODAL: REDESIGNED NOTIFICATIONS SYSTEM */}')
notif_end = content.find('{/* MODAL: COMPLETE REDESIGNED 18-SECTION GLASSMORPHISM SETTINGS */}')

if notif_start != -1 and notif_end != -1:
    new_notif_code = """{/* MODAL: REDESIGNED NOTIFICATIONS SYSTEM */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 animate-fadeIn" dir="rtl">
          <div className="w-full max-w-xl card-3d p-4 sm:p-6 border border-pink-500/40 bg-slate-900/98 rounded-3xl space-y-4 max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(236,72,153,0.25)]">
            
            {/* 1. HEADER (عنوان + دکمه‌ها) */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Bell className="w-5 h-5 text-pink-400 animate-pulse" />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-black bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent truncate">
                      اعلان‌ها (Notifications)
                    </h2>
                    {notificationsList.filter(n => n.unread).length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white font-black text-xs shadow-md animate-bounce shrink-0">
                        {notificationsList.filter(n => n.unread).length} جدید
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate">هشدارها، هدایا، پیام‌ها و لایو استریم‌ها</p>
                </div>
              </div>

              {/* Header Right Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Mark All as Read Button */}
                <button 
                  onClick={() => {
                    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
                    showToast('تمام اعلان‌ها به عنوان خوانده‌شده علامت زده شدند');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white text-xs font-bold transition flex items-center gap-1 border border-slate-700/80 shadow-sm"
                  title="علامت زدن به عنوان خوانده‌شده"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">خواندن همه</span>
                </button>

                {/* Notification Settings Toggle Button */}
                <button 
                  onClick={() => setIsNotifSettingsOpen(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-slate-700/80 transition"
                  title="تنظیمات اعلان‌ها"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                </button>

                {/* Close Button */}
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-rose-300 hover:text-white transition border border-slate-700/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. CATEGORY TABS (دسته‌بندی اعلان‌ها) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar border-b border-slate-800/80">
              {[
                { id: 'all', label: '📋 همه', count: notificationsList.length },
                { id: 'likes', label: '❤️ لایک‌ها', count: notificationsList.filter(n => n.type === 'likes').length },
                { id: 'follows', label: '👥 فالوها', count: notificationsList.filter(n => n.type === 'follows').length },
                { id: 'messages', label: '💬 پیام‌ها', count: notificationsList.filter(n => n.type === 'messages').length },
                { id: 'live', label: '🎥 لایو', count: notificationsList.filter(n => n.type === 'live').length },
                { id: 'gifts', label: '🎁 هدایا', count: notificationsList.filter(n => n.type === 'gifts').length },
                { id: 'earnings', label: '💰 درآمد', count: notificationsList.filter(n => n.type === 'earnings').length },
                { id: 'system', label: '⚙️ سیستم', count: notificationsList.filter(n => n.type === 'system').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setNotificationFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${notificationFilterTab === tab.id ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md border border-pink-400' : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'}`}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${notificationFilterTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* NOTIFICATIONS CONTENT LIST GROUPED BY TIMELINE */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-1 no-scrollbar">
              {['today', 'yesterday', 'older'].map(groupKey => {
                const groupItems = notificationsList.filter(n => {
                  const matchesFilter = notificationFilterTab === 'all' || n.type === notificationFilterTab;
                  return matchesFilter && n.group === groupKey;
                });

                if (groupItems.length === 0) return null;

                const groupTitle = groupKey === 'today' ? '🌟 امروز (Today)' : (groupKey === 'yesterday' ? '📅 دیروز (Yesterday)' : '📜 قدیمی‌تر (Older)');

                return (
                  <div key={groupKey} className="space-y-2.5">
                    {/* Group Header */}
                    <div className="flex items-center justify-between text-xs font-black text-slate-200 bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-800/80">
                      <span>{groupTitle}</span>
                      <span className="text-pink-300 font-mono text-xs bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30">{groupItems.length} اعلان</span>
                    </div>

                    {/* Group Items */}
                    <div className="space-y-2.5">
                      {groupItems.map(item => {
                        // Helper Icon & Colors for Each Type
                        let IconComponent = Bell;
                        let badgeBg = 'bg-pink-500/20 text-pink-300 border-pink-500/40';

                        if (item.type === 'messages') {
                          IconComponent = MessageSquare;
                          badgeBg = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                        } else if (item.type === 'likes') {
                          IconComponent = Heart;
                          badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                        } else if (item.type === 'follows') {
                          IconComponent = UserPlus;
                          badgeBg = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                        } else if (item.type === 'live') {
                          IconComponent = Radio;
                          badgeBg = 'bg-red-500/20 text-red-300 border-red-500/40';
                        } else if (item.type === 'gifts') {
                          IconComponent = Gift;
                          badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                        } else if (item.type === 'earnings') {
                          IconComponent = DollarSign;
                          badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                        } else if (item.type === 'system') {
                          IconComponent = ShieldCheck;
                          badgeBg = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
                        }

                        return (
                          <div 
                            key={item.id}
                            onClick={() => {
                              setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                              if (item.actionType === 'chat') {
                                setActiveTab('messages');
                                setIsNotificationsOpen(false);
                                showToast(`گفتگو با @${item.sender || 'کاربر'} باز شد`);
                              } else if (item.actionType === 'join_live') {
                                setStreamSubTab('lives');
                                setActiveTab('streams');
                                setIsNotificationsOpen(false);
                                showToast(`در حال ورود به لایو استریم...`);
                              }
                            }}
                            className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all cursor-pointer card-3d ${item.unread ? 'bg-gradient-to-r from-pink-950/40 via-slate-900 to-purple-950/40 border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.2)]' : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'}`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar or Icon Badge */}
                              <div className="relative shrink-0">
                                {item.avatar ? (
                                  <img 
                                    src={item.avatar} 
                                    alt="User" 
                                    className="w-11 h-11 rounded-2xl object-cover border border-slate-700 shadow-md" 
                                  />
                                ) : (
                                  <div className={`w-11 h-11 rounded-2xl border ${badgeBg} flex items-center justify-center shadow-md`}>
                                    <IconComponent className="w-5 h-5" />
                                  </div>
                                )}

                                {/* Badge overlay on avatar */}
                                {item.avatar && (
                                  <span className={`absolute -bottom-1 -left-1 p-1 rounded-full border ${badgeBg} bg-slate-950`}>
                                    <IconComponent className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>

                              {/* Notification Title & Body */}
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1">
                                  <h4 className="text-xs font-black text-white truncate flex items-center gap-1.5 min-w-0 flex-1">
                                    <span>{item.title}</span>
                                    {item.unread && (
                                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping inline-block shrink-0" />
                                    )}
                                  </h4>
                                  <span className="text-[11px] text-amber-300 font-mono bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800 shrink-0">{item.time}</span>
                                </div>

                                <p className="text-xs text-slate-200 leading-relaxed font-medium">{item.body}</p>

                                {/* GIFT ITEM SPECIAL EMBEDDED BADGE */}
                                {item.type === 'gifts' && item.giftName && (
                                  <div className="mt-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 font-bold flex items-center justify-between flex-wrap gap-1.5">
                                    <span>فرستنده: @{item.sender}</span>
                                    <span>هدیه: {item.giftName}</span>
                                    <span className="text-emerald-400 font-black font-mono">{item.giftValue}</span>
                                  </div>
                                )}

                                {/* ACTION BUTTONS */}
                                {item.actionType === 'follow' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, isFollowing: !n.isFollowing } : n));
                                        showToast(item.isFollowing ? `آنفالو شد @${item.sender}` : `اکنون @${item.sender} را دنبال می‌کنید`);
                                      }}
                                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${item.isFollowing ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'}`}
                                    >
                                      {item.isFollowing ? <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> : <UserPlus className="w-3.5 h-3.5" />}
                                      <span>{item.isFollowing ? 'دنبال شده' : 'فالو متقابل'}</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'join_live' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setStreamSubTab('lives');
                                        setActiveTab('streams');
                                        setIsNotificationsOpen(false);
                                        showToast('در حال ورود به لایو استریم...');
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 animate-pulse"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                      <span>ورود به لایو استریم</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'call_back' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveChatCall({
                                          type: item.title.includes('Video') ? 'video' : 'voice',
                                          user: { name: item.sender || 'سارا', avatar: item.avatar }
                                        });
                                        setIsNotificationsOpen(false);
                                        showToast(`تماس با @${item.sender || 'کاربر'}...`);
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <PhoneCall className="w-3.5 h-3.5" />
                                      <span>تماس مجدد</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'renew_vip' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsNotificationsOpen(false);
                                        setIsSettingsModalOpen(true);
                                        showToast('فرآیند تمدید اشتراک VIP باز شد!');
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <Crown className="w-3.5 h-3.5 text-slate-950" />
                                      <span>تمدید اشتراک VIP</span>
                                    </button>
                                  </div>
                                )}

                                {item.actionType === 'claimed_mission' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <span className="text-xs text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      پاداش دریافت شد (+۲۰۰ سکه)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* EMPTY STATE */}
              {notificationsList.filter(n => notificationFilterTab === 'all' || n.type === notificationFilterTab).length === 0 && (
                <div className="py-12 text-center space-y-3 bg-slate-950/80 rounded-3xl border border-slate-800">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
                  <p className="text-xs text-slate-300 font-bold">هیچ اعلانی در این دسته‌بندی یافت نشد</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 20. NOTIFICATION SETTINGS (تنظیمات اعلان‌ها) */}
      {isNotifSettingsOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
          <div className="w-full max-w-md card-3d p-6 border border-purple-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">تنظیمات دریافت اعلان‌ها</h3>
                  <p className="text-xs text-slate-300 font-medium">سفارشی‌سازی هشدارهای پوش و درون‌برنامه‌ای</p>
                </div>
              </div>

              <button 
                onClick={() => setIsNotifSettingsOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Toggle Switches for Categories */}
            <div className="space-y-2.5 text-xs">
              {[
                { key: 'messages', label: '💬 Messages (پیام‌ها)', desc: 'Direct chat messages & group mentions' },
                { key: 'likes', label: '❤️ Likes (لایک‌ها)', desc: 'Likes on your stage photos & moments' },
                { key: 'follows', label: '👥 Follows (فالوها)', desc: 'New followers & profile visits' },
                { key: 'lives', label: '🎥 Live Broadcasts (لایوها)', desc: 'When your favorite streamers go live' },
                { key: 'gifts', label: '🎁 Gifts (هدایا)', desc: 'When someone sends you gifts' },
                { key: 'calls', label: '📞 Calls (تماس‌ها)', desc: 'Private voice & video call requests' },
                { key: 'earnings', label: '💰 Earnings (درآمد)', desc: 'Coin deposits & USDT cashout status' },
                { key: 'competitions', label: '🏆 Competitions (مسابقات)', desc: 'Rankings, PK Battles & leaderboard updates' },
                { key: 'system', label: '📢 System Announcements (اطلاعیه‌ها)', desc: 'App updates, maintenance & security alerts' }
              ].map(toggle => (
                <div key={toggle.key} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-white text-xs">{toggle.label}</p>
                    <p className="text-xs text-slate-300 truncate">{toggle.desc}</p>
                  </div>

                  <button
                    onClick={() => setNotifSettings(prev => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 flex items-center ${notifSettings[toggle.key] ? 'bg-pink-600 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setIsNotifSettingsOpen(false);
                showToast('تنظیمات اعلان‌ها با موفقیت ذخیره شد!');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              ذخیره تنظیمات اعلان‌ها
            </button>
          </div>
        </div>
      )}"""

    content = content[:notif_start] + new_notif_code + "\n\n      " + content[notif_end:]
    print("✅ Notification Modals updated successfully!")

# 2. FIX WALLET SECTION TEXT CONTRAST & READABILITY
wallet_start = content.find("activeTab === 'earnings' || activeTab === 'wallet'")
wallet_end = content.find("activeTab === 'profile'")

if wallet_start != -1 and wallet_end != -1:
    wallet_block = content[wallet_start:wallet_end]

    # Improve unselected wallet tab chips readability
    wallet_block = wallet_block.replace(
        "bg-slate-950 border-slate-800 text-slate-400 hover:text-white",
        "bg-slate-900 border-slate-700 text-slate-200 hover:text-white font-bold text-xs shadow-sm"
    )

    # Improve text-slate-400 contrast in wallet to text-slate-200
    wallet_block = wallet_block.replace("text-slate-400", "text-slate-200")

    # Replace small text-[10px] with text-xs for better legibility
    wallet_block = wallet_block.replace("text-[10px]", "text-xs")
    wallet_block = wallet_block.replace("text-[9px]", "text-[11px]")

    # Improve badge backgrounds and borders for high contrast
    wallet_block = wallet_block.replace("bg-amber-500/20 text-amber-300", "bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold")
    wallet_block = wallet_block.replace("bg-cyan-500/20 text-cyan-300", "bg-cyan-500/25 text-cyan-200 border border-cyan-400/40 font-bold")
    wallet_block = wallet_block.replace("bg-emerald-500/20 text-emerald-300", "bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 font-bold")
    wallet_block = wallet_block.replace("bg-rose-500/20 text-rose-300", "bg-rose-500/25 text-rose-200 border border-rose-400/40 font-bold")

    content = content[:wallet_start] + wallet_block + content[wallet_end:]
    print("✅ Wallet Section readability and colors updated successfully!")

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done writing src/App.jsx!")
