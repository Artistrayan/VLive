import React from 'react';
import { safeStorage } from '../utils/safeStorage';
import { apiNotifications } from '../services/api';
import { 
  Bell, X, Check, CheckCheck, Trash2, Settings, PhoneCall, Crown, CheckCircle2,
  Gift, Heart, UserPlus, Video, DollarSign, MessageSquare, AlertCircle, Shield
} from 'lucide-react';

export default function NotificationsModal(props) {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen = (() => {}),
    isNotifSettingsOpen,
    setIsNotifSettingsOpen = (() => {}),
    isRtl,
    notificationsList = [],
    setNotificationsList = (() => {}),
    notifSettings = {},
    setNotifSettings = (() => {}),
    setActiveChatCall = (() => {}),
    setIsSettingsModalOpen = (() => {}),
    showToast = (() => {})
  } = props;

  const [localNotificationFilterTab, setLocalNotificationFilterTab] = React.useState('all');
  const notificationFilterTab = props.notificationFilterTab !== undefined ? props.notificationFilterTab : localNotificationFilterTab;
  const setNotificationFilterTab = props.setNotificationFilterTab || setLocalNotificationFilterTab;
  if (!isNotificationsOpen && !isNotifSettingsOpen) return null;

  const filterOptions = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'message', label: 'Messages', icon: MessageSquare },
    { id: 'gift', label: 'Gifts', icon: Gift },
    { id: 'call', label: 'Calls', icon: PhoneCall },
    { id: 'system', label: 'System', icon: Shield },
    { id: 'vip', label: 'VIP', icon: Crown }
  ];

  return (
    <>
      {/* MAIN NOTIFICATIONS MODAL */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-xl card-3d p-4 sm:p-6 border border-pink-500/40 bg-slate-900/98 rounded-3xl space-y-4 max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(236,72,153,0.25)]">
            
            {/* 1. HEADER */}
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
                      {window.loc('اعلان‌ها (Notifications)', 'Notifications')}
                    </h2>
                    {notificationsList.filter(n => n.unread).length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white font-black text-xs shadow-md animate-bounce shrink-0">
                        {notificationsList.filter(n => n.unread).length} {window.loc('جدید', 'new')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate">{window.loc('هشدارها، هدایا، پیام‌ها و لایو استریم‌ها', 'Alerts, giveaways, messages and live streams')}</p>
                </div>
              </div>

              {/* Header Right Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    if (props.onSwitchMainTab) props.onSwitchMainTab('messages');
                  }}
                  className="px-2.5 py-2 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500 hover:text-white transition shadow-sm text-xs font-bold flex items-center gap-1"
                  title="Open Messages"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{window.loc('پیام‌ها', 'Messages')}</span>
                </button>
                <button
                  onClick={() => setIsNotifSettingsOpen(true)}
                  className="p-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow-sm"
                  title="Notification Settings"
                >
                  <Settings className="w-4 h-4 text-purple-400" />
                </button>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. FILTER TABS & QUICK ACTIONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80">
                {filterOptions.map(tab => {
                  const Icon = tab.icon;
                  const isActive = notificationFilterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setNotificationFilterTab(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-pink-600 text-white shadow-md scale-105'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 justify-end">
                <button
                  onClick={() => {
                    apiNotifications.markAllAsRead();
                    setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
                    showToast(window.loc('همه اعلان‌ها خوانده شدند!', 'All notices have been read!'));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1 transition"
                  title="Mark All as Read"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Mark Read</span>
                </button>
                <button
                  onClick={() => {
                    apiNotifications.clearAll();
                    setNotificationsList([]);
                    showToast(window.loc('تاریخچه اعلان‌ها پاکسازی شد', 'Notification history cleared'));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-rose-950/40 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 transition"
                  title="Clear All Notifications"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            </div>

            {/* 3. NOTIFICATIONS LIST */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {['Today', 'Yesterday', 'Earlier'].map(group => {
                const groupItems = notificationsList.filter(n => {
                  const matchGroup = (n.timeGroup || 'Today') === group;
                  const matchFilter = 
                    notificationFilterTab === 'all' || 
                    n.type === notificationFilterTab ||
                    (notificationFilterTab === 'call' && (n.type === 'incoming_call' || n.type === 'missed_call' || n.type === 'call_back' || n.type === 'call')) ||
                    (notificationFilterTab === 'message' && (n.type === 'chat' || n.type === 'new_message' || n.type === 'message'));
                  return matchGroup && matchFilter;
                });

                if (groupItems.length === 0) return null;

                return (
                  <div key={group} className="space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-1">
                      {group === 'Today' ? window.loc('امروز', 'today') : group === 'Yesterday' ? window.loc('دیروز', 'yesterday') : window.loc('گذشته', 'the past')}
                    </span>
                    <div className="space-y-2">
                      {groupItems.map(item => {
                        let IconComp = Bell;
                        let iconBg = 'bg-pink-500/10 text-pink-400 border-pink-500/30';
                        if (item.type === 'gift') {
                          IconComp = Gift;
                          iconBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                        } else if (item.type === 'call' || item.type === 'incoming_call' || item.type === 'missed_call' || item.type === 'call_back') {
                          IconComp = PhoneCall;
                          iconBg = item.type === 'missed_call' || item.title?.includes('دست رفته')
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                        } else if (item.type === 'message' || item.type === 'chat' || item.type === 'new_message') {
                          IconComp = MessageSquare;
                          iconBg = 'bg-pink-500/10 text-pink-400 border-pink-500/30';
                        } else if (item.type === 'vip') {
                          IconComp = Crown;
                          iconBg = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                        } else if (item.type === 'system') {
                          IconComp = Shield;
                          iconBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
                        }

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (item.unread) {
                                apiNotifications.markAsRead(item.id);
                              }
                              setNotificationsList(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
                              if (item.type === 'message' || item.type === 'chat' || item.actionType === 'open_chat') {
                                setIsNotificationsOpen(false);
                                if (props.onSwitchMainTab) props.onSwitchMainTab('messages');
                                if (props.onOpenChat) {
                                  const targetId = item.raw?.metadata?.sender_id || item.raw?.metadata?.sender_username || item.raw?.metadata?.conversation_id;
                                  if (targetId) props.onOpenChat(targetId);
                                }
                              }
                            }}
                            className={`p-3.5 rounded-2xl border transition relative group cursor-pointer ${
                              item.unread
                                ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-pink-950/20 border-pink-500/40 shadow-sm'
                                : 'bg-slate-950/80 border-slate-800/80 opacity-90 hover:opacity-100'
                            }`}
                          >
                            {item.unread && (
                              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                            )}
                            <div className="flex items-start gap-3">
                              <div className={`p-2.5 rounded-2xl border shrink-0 ${iconBg}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-xs font-black text-white truncate">{item.title}</h4>
                                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">{item.time}</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>

                                {/* Action Buttons Inside Cards */}
                                {(item.actionType === 'call_back' || item.type === 'call' || item.type === 'incoming_call') && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveChatCall({
                                          type: item.title.includes('Video') || item.title.includes('تصویری') ? 'video' : 'voice',
                                          user: { name: item.sender || window.loc('کاربر', 'User'), avatar: item.avatar }
                                        });
                                        setIsNotificationsOpen(false);
                                        showToast(window.loc(`تماس با ${item.sender || window.loc('کاربر', 'User')}...`, `Call with ${item.sender || window.loc('User', 'User')}...`));
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <PhoneCall className="w-3.5 h-3.5" />
                                      <span>{window.loc('تماس مجدد', 'call back')}</span>
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
                                        showToast(window.loc('فرآیند تمدید اشتراک VIP باز شد!', 'VIP subscription renewal process is open!'));
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <Crown className="w-3.5 h-3.5 text-slate-950" />
                                      <span>{window.loc('تمدید اشتراک VIP', 'Renewal of VIP subscription')}</span>
                                    </button>
                                  </div>
                                )}
                                {item.actionType === 'claimed_mission' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <span className="text-xs text-emerald-300 font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      {window.loc('پاداش دریافت شد (+۲۰۰ سکه)', 'Reward received (+200 coins)')}
                                    </span>
                                  </div>
                                )}
                                {item.actionType === 'kyc_approved' && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsNotificationsOpen(false);
                                        if (props.setIsLiveStudioOpen) props.setIsLiveStudioOpen(true);
                                        else if (props.onSwitchMainTab) props.onSwitchMainTab('live');
                                        showToast(window.loc('🚀 استودیو پخش زنده آماده است!', '🚀 Live studio is ready!'));
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <Video className="w-3.5 h-3.5" />
                                      <span>{window.loc('شروع اجرای زنده', 'Start Live Stream')}</span>
                                    </button>
                                  </div>
                                )}
                                {(item.actionType === 'kyc_correction' || item.actionType === 'kyc_rejected') && (
                                  <div className="pt-1.5 flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsNotificationsOpen(false);
                                        if (props.setIsBecomeStreamerModalOpen) props.setIsBecomeStreamerModalOpen(true);
                                      }}
                                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-pink-500/40 text-pink-300 font-black text-xs shadow-md flex items-center gap-1.5"
                                    >
                                      <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
                                      <span>{window.loc('مشاهده وضعیت و بازبینی مدارک', 'View Status & Review')}</span>
                                    </button>
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
              {notificationsList.filter(n => 
                notificationFilterTab === 'all' || 
                n.type === notificationFilterTab ||
                (notificationFilterTab === 'call' && (n.type === 'incoming_call' || n.type === 'missed_call' || n.type === 'call_back' || n.type === 'call')) ||
                (notificationFilterTab === 'message' && (n.type === 'chat' || n.type === 'new_message' || n.type === 'message'))
              ).length === 0 && (
                <div className="py-12 text-center space-y-3 bg-slate-950/80 rounded-3xl border border-slate-800">
                  <Bell className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
                  <p className="text-xs text-slate-300 font-bold">{window.loc('هیچ اعلانی در این دسته‌بندی یافت نشد', 'No announcements were found in this category')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOTIFICATION SETTINGS */}
      {isNotifSettingsOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
          <div className="w-full max-w-md card-3d p-6 border border-purple-500/40 bg-slate-900 rounded-3xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <Settings className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{window.loc('تنظیمات دریافت اعلان‌ها', 'Settings for receiving notifications')}</h3>
                  <p className="text-xs text-slate-300 font-medium">{window.loc('سفارشی‌سازی هشدارهای پوش و درون‌برنامه‌ای', 'Customize push and in-app alerts')}</p>
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
                { key: 'messages', label: window.loc('💬 Messages (پیام‌ها)', '💬 Messages'), desc: 'Direct chat messages & group mentions' },
                { key: 'likes', label: window.loc('❤️ Likes (لایک‌ها)', '❤️ Likes'), desc: 'Likes on your stage photos & moments' },
                { key: 'follows', label: window.loc('👥 Follows (فالوها)', '👥 Follows'), desc: 'New followers & profile visits' },
                { key: 'lives', label: window.loc('🎥 Live Broadcasts (لایوها)', '🎥 Live Broadcasts'), desc: 'When your favorite streamers go live' },
                { key: 'gifts', label: window.loc('🎁 Gifts (هدایا)', '🎁 Gifts'), desc: 'When someone sends you gifts' },
                { key: 'calls', label: window.loc('📞 Calls (تماس‌ها)', '📞 Calls'), desc: 'Private voice & video call requests' },
                { key: 'earnings', label: window.loc('💰 Earnings (درآمد)', '💰 Earnings'), desc: 'Coin deposits & USDT cashout status' },
                { key: 'competitions', label: window.loc('🏆 Competitions (مسابقات)', '🏆 Competitions'), desc: 'Rankings, PK Battles & leaderboard updates' },
                { key: 'system', label: window.loc('📢 System Announcements (اطلاعیه‌ها)', '📢 System Announcements'), desc: 'App updates, maintenance & security alerts' }
              ].map(toggle => (
                <div key={toggle.key} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-bold text-white text-xs">{toggle.label}</p>
                    <p className="text-xs text-slate-300 truncate">{toggle.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = { ...notifSettings, [toggle.key]: !notifSettings[toggle.key] };
                      setNotifSettings(updated);
                      safeStorage.setItem('vlive_notif_settings', JSON.stringify(updated));
                    }}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 flex items-center ${notifSettings[toggle.key] ? 'bg-pink-600 justify-end' : 'bg-slate-800 justify-start'}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                safeStorage.setItem('vlive_notif_settings', JSON.stringify(notifSettings));
                setIsNotifSettingsOpen(false);
                showToast(window.loc('تنظیمات اعلان‌ها با موفقیت ذخیره شد!', 'Notification settings saved successfully!'));
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              {window.loc('ذخیره تنظیمات اعلان‌ها', 'Save notification settings')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
