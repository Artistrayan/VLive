import React from 'react';
import VisualSectionWrapper from '../VisualUiEditor/VisualSectionWrapper';
import { VerifiedBadge } from '../CommonBadges';
import { 
  Search, Plus, Filter, MessageSquare, PhoneCall, Video, Pin, BellOff, Trash2, 
  CheckCheck, Send, Mic, Image, Paperclip, Smile, Gift, Sparkles, X, ChevronRight,
  Shield, Check, UserPlus, Phone, Camera, User, Users, Archive, VolumeX, ChevronLeft,
  MoreVertical, Lock, AlertTriangle, Ban, Globe, Bot, MapPin, DollarSign, MicOff
} from 'lucide-react';

export default function ChatTab(props) {
  const {
    activeTab,
    userAvatar, userName, totalUnreadMessages,
    msgSearchQuery, setMsgSearchQuery,
    msgSearchField, setMsgSearchField,
    msgFilterTab, setMsgFilterTab,
    isCreateGroupModalOpen, setIsCreateGroupModalOpen,
    newGroupName, setNewGroupName,
    newGroupDesc, setNewGroupDesc,
    isNewChatModalOpen, setIsNewChatModalOpen,
    isChatGalleryOpen, setIsChatGalleryOpen,
    isSendGiftInChatOpen, setIsSendGiftInChatOpen,
    conversations, setConversations,
    activeConversationId, setActiveConversationId,
    isChatSearchOpen, setIsChatSearchOpen,
    activeChatCall, setActiveChatCall,
    userCoins: propUserCoins, setUserCoins: propSetUserCoins,
    showToast = (() => {}), loc = ((a, b) => b || a), isRtl
  } = props;

  const [localIsSendCoinsInChatOpen, setLocalIsSendCoinsInChatOpen] = React.useState(false);
  const isSendCoinsInChatOpen = props.isSendCoinsInChatOpen !== undefined ? props.isSendCoinsInChatOpen : localIsSendCoinsInChatOpen;
  const setIsSendCoinsInChatOpen = props.setIsSendCoinsInChatOpen || setLocalIsSendCoinsInChatOpen;

  const [sendCoinsInChatAmount, setSendCoinsInChatAmount] = React.useState(100);
  const [localUserCoins, setLocalUserCoins] = React.useState(5000);
  const userCoins = propUserCoins !== undefined ? propUserCoins : localUserCoins;
  const setUserCoins = propSetUserCoins || setLocalUserCoins;

  const setIsDepositModalOpen = props.setIsDepositModalOpen || (() => showToast('Deposit modal opened'));
  
  const [showChatOptionsMenu, setShowChatOptionsMenu] = React.useState(false);
  const [isChatLocked, setIsChatLocked] = React.useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = React.useState(false);
  const [chatCallSeconds, setChatCallSeconds] = React.useState(45);
  const [isChatCallMuted, setIsChatCallMuted] = React.useState(false);

  const handleInitiateCall = props.handleInitiateCall || ((type) => showToast(`Starting ${type} call...`));
  const [pinnedMessage, setPinnedMessage] = React.useState(props.pinnedMessage || null);
  const t = props.t || ((key) => key);
  const langCode = props.langCode || 'fa';
  const handleTranslateChatMessage = props.handleTranslateChatMessage || ((msg) => showToast('Translated message'));
  const [showAiAssistant, setShowAiAssistant] = React.useState(false);
  const [directInputText, setDirectInputText] = React.useState('');
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);
  const [audioRecordingSeconds] = React.useState(0);
  const handleSendDirectMessage = props.handleSendDirectMessage || (() => {
    if (directInputText.trim()) {
      showToast('Message sent');
      setDirectInputText('');
    }
  });


  if (activeTab !== 'messages') return null;

  return (
    <>
        {/* TAB 2: COMPLETE REDESIGNED MESSAGES & DIRECT CHAT SYSTEM */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* 1. HEADER: USER AVATAR, TITLE, SEARCH & CREATION ACTIONS */}
            <VisualSectionWrapper pageId="messages" sectionId="messages_header" defaultLabel="Chat Header & Filter Tags">
            <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/40 shadow-md" 
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                      {window.loc('💬 Messages (پیام‌ها)', '💬 Messages')}
                    </h2>
                    {totalUnreadMessages > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-black text-[10px] shadow-lg animate-pulse">
                        {totalUnreadMessages} New
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Secure Encrypted Chat & LiveKit Calls</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                  className={"p-2.5 rounded-2xl border transition " + (isChatSearchOpen ? "bg-pink-500 text-white border-pink-400" : "bg-slate-950 text-slate-300 border-slate-800 hover:border-pink-500/40")}
                  title="Search Messages"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/30 transition shadow-md"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Create Group</span>
                </button>

                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl btn-neon-pink text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>
            </div>

            {/* 2. ADVANCED SEARCH BAR (NAME, ID, PHONE, CITY) */}
            {isChatSearchOpen && (
              <div className="card-3d p-3 rounded-2xl bg-slate-900 border border-pink-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Search className="w-4 h-4 text-pink-400 shrink-0" />
                  <input 
                    type="text"
                    value={msgSearchQuery}
                    onChange={e => setMsgSearchQuery(e.target.value)}
                    placeholder="Search by Name, Username ID, City, or Phone..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                  />
                  {msgSearchQuery && (
                    <button onClick={() => setMsgSearchQuery('')} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold text-slate-400">
                  <span className="text-slate-500 shrink-0">Filter By:</span>
                  {[
                    { id: 'all', label: 'All Fields' },
                    { id: 'name', label: 'Name' },
                    { id: 'id', label: 'Username ID' },
                    { id: 'city', label: window.loc('City (شهر)', 'City') },
                    { id: 'phone', label: 'Phone' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setMsgSearchField(f.id)}
                      className={"px-2.5 py-1 rounded-lg shrink-0 transition " + (msgSearchField === f.id ? "bg-pink-600 text-white font-black" : "bg-slate-950 border border-slate-800 hover:text-slate-200")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            </VisualSectionWrapper>

            {/* 3. CATEGORY TABS: ALL, PRIVATE, GROUPS, CALLS, ARCHIVED */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {[
                { id: 'all', label: 'All', icon: MessageSquare, badge: conversations.length },
                { id: 'private', label: window.loc('Private (خصوصی)', 'Private'), icon: User, badge: conversations.filter(c => !c.isGroup && !c.archived).length },
                { id: 'groups', label: window.loc('Groups (گروه‌ها)', 'Groups'), icon: Users, badge: conversations.filter(c => c.isGroup).length },
                { id: 'calls', label: window.loc('Calls (تماس‌ها)', 'Calls'), icon: Phone, badge: conversations.filter(c => c.type === 'call').length },
                { id: 'archived', label: window.loc('Archived (بایگانی)', 'Archived'), icon: Archive, badge: conversations.filter(c => c.archived).length }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = msgFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMsgFilterTab(tab.id)}
                    className={"px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0 transition border " + (isActive ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/20" : "bg-slate-900/80 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200")}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={"px-2 py-0.5 rounded-full text-[9px] " + (isActive ? "bg-white/20 text-white font-black" : "bg-slate-950 text-slate-400")}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MAIN MESSAGES LAYOUT: SIDEBAR + CHAT THREAD */}
            <div className="card-3d rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden h-[620px] flex flex-col md:flex-row shadow-2xl relative">
              
              {/* CONVERSATIONS LIST SIDEBAR */}
              <div className={"w-full md:w-80 border-r border-slate-800/80 flex flex-col bg-slate-950 " + (activeConversationId ? "hidden md:flex" : "flex")}>
                <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Recent Conversations</span>
                  <span className="text-[10px] text-pink-400">Live Sync</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {conversations
                    .filter(conv => {
                      if (msgFilterTab === 'private' && (conv.isGroup || conv.archived)) return false;
                      if (msgFilterTab === 'groups' && !conv.isGroup) return false;
                      if (msgFilterTab === 'calls' && conv.type !== 'call') return false;
                      if (msgFilterTab === 'archived' && !conv.archived) return false;
                      if (msgFilterTab === 'all' && conv.archived) return false;

                      if (msgSearchQuery.trim()) {
                        const q = msgSearchQuery.toLowerCase();
                        const nameMatch = conv.user.name?.toLowerCase().includes(q);
                        const idMatch = conv.user.username?.toLowerCase().includes(q);
                        const cityMatch = conv.user.city?.toLowerCase().includes(q);
                        const phoneMatch = conv.user.phone?.includes(q);

                        if (msgSearchField === 'name') return nameMatch;
                        if (msgSearchField === 'id') return idMatch;
                        if (msgSearchField === 'city') return cityMatch;
                        if (msgSearchField === 'phone') return phoneMatch;
                        return nameMatch || idMatch || cityMatch || phoneMatch;
                      }

                      return true;
                    })
                    .map(conv => {
                      const isSelected = activeConversationId === conv.id;
                      return (
                        <button
                          key={conv.id}
                          onClick={() => {
                            setActiveConversationId(conv.id);
                            setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                          }}
                          className={"w-full p-3 rounded-2xl flex items-center gap-3 transition text-left border relative group " + (isSelected ? "bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-transparent border-pink-500/50 shadow-md" : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700")}
                        >
                          <div className="relative shrink-0">
                            <img src={conv.user.avatar} alt={conv.user.name} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700" />
                            {conv.user.online && !conv.isGroup && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                            )}
                            {conv.isGroup && (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-purple-600 text-white ring-2 ring-slate-950">
                                <Users className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                                {conv.user.name}
                                {conv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                                {conv.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono shrink-0">{conv.lastTime}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <p className="text-slate-400 truncate flex-1 pr-2">
                                {conv.lastMessage}
                              </p>

                              {conv.unreadCount > 0 ? (
                                <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-slate-950 font-black text-[9px] shrink-0 shadow-sm">
                                  {conv.unreadCount}
                                </span>
                              ) : conv.muted ? (
                                <VolumeX className="w-3 h-3 text-slate-600 shrink-0" />
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* CHAT THREAD VIEW */}
              <div className={"flex-1 flex flex-col bg-slate-950/60 relative " + (!activeConversationId ? "hidden md:flex" : "flex")}>
                {activeConversationId ? (
                  (() => {
                    const currentConv = conversations.find(c => c.id === activeConversationId);
                    if (!currentConv) return null;

                    return (
                      <>
                        {/* 1. CHAT THREAD TOP HEADER */}
                        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-2 z-10">
                          <div className="flex items-center gap-3 min-w-0">
                            <button 
                              onClick={() => setActiveConversationId(null)}
                              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="relative shrink-0">
                              <img src={currentConv.user.avatar} alt={currentConv.user.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/30" />
                              {currentConv.user.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-xs font-bold text-white truncate">{currentConv.user.name}</h3>
                                {currentConv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                              </div>
                              <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                🟢 Online & Ready
                              </p>
                            </div>
                          </div>

                          {/* Direct Action Buttons in Header */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                handleInitiateCall(currentConv.user, 'voice', '1on1');
                                showToast("Initiating Voice Call with " + currentConv.user.name + "...");
                              }}
                              className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Voice Call"
                            >
                              <Phone className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                handleInitiateCall(currentConv.user, 'video', '1on1');
                                showToast("Initiating 4K Video Call with " + currentConv.user.name + "...");
                              }}
                              className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white font-bold transition shadow-md"
                              title="Video Call"
                            >
                              <Video className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setIsSendGiftInChatOpen(true)}
                              className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Send Gift"
                            >
                              <Gift className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setShowChatOptionsMenu(!showChatOptionsMenu)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {showChatOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs font-semibold space-y-1 animate-fadeIn">
                                  <button
                                    onClick={() => {
                                      setIsChatLocked(!isChatLocked);
                                      setShowChatOptionsMenu(false);
                                      showToast(isChatLocked ? 'Chat unlocked' : '🔒 Chat locked with passcode security');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-300 flex items-center gap-2"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    {isChatLocked ? 'Unlock Chat' : '🔒 Lock Chat'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setIsChatGalleryOpen(true);
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <Image className="w-3.5 h-3.5 text-cyan-400" />
                                    Media Gallery
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('Chat muted');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                                    Mute Notifications
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User reported to moderation');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-400 flex items-center gap-2"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Report User
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User blocked');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-rose-400 flex items-center gap-2"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    Block User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PINNED MESSAGE BANNER */}
                        {pinnedMessage && (
                          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
                            <div className="flex items-center gap-2 truncate">
                              <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                              <span className="font-bold text-[10px] text-amber-400">Pinned:</span>
                              <span className="truncate text-[11px]">{pinnedMessage.text}</span>
                            </div>
                            <button onClick={() => setPinnedMessage(null)} className="p-1 text-slate-400 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* MESSAGES SCROLL AREA */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 custom-scrollbar">
                          {currentConv.messages.map(msg => {
                            const isMe = msg.sender === 'me';
                            return (
                              <div 
                                key={msg.id} 
                                className={"flex flex-col " + (isMe ? "items-end" : "items-start") + " group transition"}
                              >
                                {msg.senderName && !isMe && (
                                  <span className="text-[9px] font-bold text-purple-400 mb-0.5 px-1">{msg.senderName}</span>
                                )}

                                <div className="relative group max-w-[82%]">
                                  <div 
                                    className={"p-3.5 rounded-3xl text-xs space-y-1.5 shadow-xl transition-all duration-300 relative border " + (isMe ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-br-xs border-pink-400/40" : "bg-slate-900/90 text-slate-100 rounded-bl-xs border-slate-800")}
                                  >
                                    {msg.type === 'gift' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-amber-300 font-bold">
                                        <span className="text-2xl">👑</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-amber-400 font-black">+500 Coins Value</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'coins' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                                        <span className="text-2xl">💸</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-emerald-400 font-black">Direct Transfer Completed</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'voice' ? (
                                      <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                                        <button className="w-8 h-8 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                                          ▶
                                        </button>
                                        <div className="flex-1 h-3 flex items-center gap-0.5">
                                          {[40, 70, 30, 90, 100, 60, 80, 50, 90, 40, 70, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-pink-400/60 rounded-full" style={{ height: h + "%" }} />
                                          ))}
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-300">0:12</span>
                                      </div>
                                     ) : (
                                       <>
                                         <p className="leading-relaxed whitespace-pre-wrap">
                                           {msg.translated && msg.translation ? (
                                             <span className="block">{msg.translation}</span>
                                           ) : (
                                             msg.text
                                           )}
                                         </p>
                                         {msg.translated && msg.translation && (
                                           <span className="inline-flex items-center gap-1 text-[9px] text-cyan-300 font-mono bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 w-fit mt-1">
                                             <Globe className="w-2.5 h-2.5 text-cyan-400" />
                                             🌐 {t('translated', window.loc('ترجمه‌شده', 'Translated'))} ({msg.translationLang || langCode})
                                           </span>
                                         )}
                                       </>
                                     )}

                                    {msg.reactions && msg.reactions.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 shrink-0 w-fit text-[11px]">
                                        {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-end gap-1 text-[8px] text-slate-300 pt-1">
                                      <span>{msg.time}</span>
                                      {isMe && (
                                        <CheckCheck className="w-3 h-3 text-cyan-300" title="Read" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="hidden group-hover:flex items-center gap-1.5 absolute -top-3 right-2 bg-slate-900/95 border border-slate-700/80 rounded-full px-2.5 py-1 shadow-2xl text-[10px] z-20 backdrop-blur-md">
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '❤️'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Heart"
                                    >
                                      ❤️
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '🔥'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Fire"
                                    >
                                      🔥
                                    </button>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard?.writeText(msg.text);
                                        showToast(window.loc('متن پیام کپی شد 📋', 'The text of the message was copied 📋'));
                                      }}
                                      className="text-slate-300 hover:text-white font-bold"
                                      title={window.loc('کپی متن', 'Copy text')}
                                    >
                                      📋
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setPinnedMessage(msg);
                                        showToast(window.loc('پیام سنجاق شد 📌', 'The message has been pinned'));
                                      }}
                                      className="text-amber-400 hover:text-white"
                                      title={window.loc('سنجاق پیام', 'Message pin')}
                                    >
                                      📌
                                    </button>
                                    <button 
                                      onClick={() => handleTranslateChatMessage(msg.id, msg.text)}
                                      className="text-cyan-400 hover:text-white font-bold"
                                      title={window.loc('ترجمه پیام', 'Translation of the message')}
                                    >
                                      🌍
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.filter(m => m.id !== msg.id)
                                            };
                                          }
                                          return c;
                                        }));
                                        showToast(window.loc('پیام حذف شد 🗑️', 'The message was deleted 🗑️'));
                                      }}
                                      className="text-rose-400 hover:text-rose-300 font-bold"
                                      title={window.loc('حذف پیام', 'Delete message')}
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* POPOVERS: AI ASSISTANT, EMOJIS, ATTACHMENTS */}
                        {showAiAssistant && (
                          <div className="p-3 bg-slate-900 border-t border-purple-500/40 space-y-2 animate-fadeIn z-20">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                              <span className="flex items-center gap-1.5">
                                <Bot className="w-4 h-4 text-purple-400" />
                                {window.loc('🤖 AI Chat Assistant (هوش مصنوعی)', '🤖 AI Chat Assistant')}
                              </span>
                              <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-bold">
                              {[
                                'Thanks for your live! 💖',
                                "Let's do a video call 📹",
                                'How are you doing today? 😊',
                                'Sent you a gift! 🎁'
                              ].map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(suggestion);
                                    setShowAiAssistant(false);
                                  }}
                                  className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white transition text-left truncate"
                                >
                                  ✨ {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showEmojiPicker && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 animate-fadeIn z-20">
                            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-300">
                              <span>😀 Emojis & Quick Reaction</span>
                              <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xl">
                              {['😀', '😂', '😍', '🔥', '👑', '💖', '👍', '🏎️', '🎉', '🚀', '💎', '🌹', '💯', '✨', '👏'].map((emoji, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="hover:scale-125 transition p-1"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showAttachmentMenu && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs font-bold animate-fadeIn z-20">
                            <button onClick={() => { showToast('Attach photo'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-pink-400 hover:border-pink-500 flex flex-col items-center gap-1">
                              <Image className="w-5 h-5" /> Photo
                            </button>
                            <button onClick={() => { showToast('Attach video'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-purple-400 hover:border-purple-500 flex flex-col items-center gap-1">
                              <Video className="w-5 h-5" /> Video
                            </button>
                            <button onClick={() => { showToast('Attach file'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 hover:border-cyan-500 flex flex-col items-center gap-1">
                              <Paperclip className="w-5 h-5" /> File
                            </button>
                            <button onClick={() => { showToast('Share location'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500 flex flex-col items-center gap-1">
                              <MapPin className="w-5 h-5" /> Location
                            </button>
                          </div>
                        )}

                        {isRecordingAudio ? (
                          <div className="p-3 bg-pink-950/80 border-t border-pink-500/50 flex items-center justify-between text-xs font-bold animate-pulse z-20">
                            <div className="flex items-center gap-2 text-pink-300">
                              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
                              <span>Recording Voice Note... ({audioRecordingSeconds}s)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setIsRecordingAudio(false)} 
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-[10px] hover:text-white"
                              >
                                Cancel
                              </button>

                              <button 
                                onClick={() => {
                                  setIsRecordingAudio(false);
                                  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                  setConversations(prev => prev.map(c => {
                                    if (c.id === activeConversationId) {
                                      const newMsg = {
                                        id: Date.now(),
                                        sender: 'me',
                                        text: '🎤 Voice Note (0:12)',
                                        type: 'voice',
                                        time: nowTime
                                      };
                                      return { ...c, lastMessage: '🎤 Voice Note', lastTime: nowTime, messages: [...c.messages, newMsg] };
                                    }
                                    return c;
                                  }));
                                  showToast('Voice note sent!');
                                }}
                                className="px-4 py-1.5 rounded-xl btn-neon-pink text-[10px] text-white font-black"
                              >
                                Send Voice
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-2 z-10 flex-wrap sm:flex-nowrap">
                            <button 
                              onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); setShowAiAssistant(false); }}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                              title="Emoji"
                            >
                              <Smile className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); setShowAiAssistant(false); }}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400 transition"
                              title="Attachment"
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => { setShowAiAssistant(!showAiAssistant); setShowEmojiPicker(false); setShowAttachmentMenu(false); }}
                              className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition shadow-md"
                              title="AI Assistant"
                            >
                              <Bot className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => setIsSendCoinsInChatOpen(true)}
                              className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition font-black text-xs hidden sm:flex items-center gap-1"
                              title="Send Coins"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>

                            <input 
                              type="text"
                              value={directInputText}
                              onChange={e => setDirectInputText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendDirectMessage()}
                              placeholder={window.loc('Write a message... (تایپ پیام)', 'Write a message...')}
                              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500/80 transition"
                            />

                            <button 
                              onClick={() => setIsRecordingAudio(true)}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                              title="Record Voice"
                            >
                              <Mic className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={handleSendDirectMessage}
                              className="p-2.5 rounded-2xl btn-neon-pink shadow-lg hover:scale-105 active:scale-95 transition"
                            >
                              <Send className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 space-y-3 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 shadow-xl animate-bounce">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Select a conversation to start messaging</h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Send text, voice notes, photos, gifts, or start a 4K LiveKit video call with hosts directly inside V.Live.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* IN-CHAT ACTIVE CALL OVERLAY MODAL */}
            {activeChatCall && (
              <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-8 text-white animate-fadeIn">
                <div className="text-center space-y-2 mt-8">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 justify-center mx-auto w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live LiveKit {activeChatCall.type === 'video' ? '4K Video' : 'HD Voice'} Call Active
                  </span>
                  <h3 className="text-2xl font-black">{activeChatCall.user.name}</h3>
                  <p className="text-sm text-slate-400 font-mono">Duration: {Math.floor(chatCallSeconds / 60).toString().padStart(2, '0')}:{(chatCallSeconds % 60).toString().padStart(2, '0')}</p>
                </div>

                <div className="relative my-auto flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full ring-4 ring-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.5)] overflow-hidden animate-pulse">
                    <img src={activeChatCall.user.avatar} alt={activeChatCall.user.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setIsChatCallMuted(!isChatCallMuted)}
                    className={"p-4 rounded-full border transition " + (isChatCallMuted ? "bg-rose-600 text-white border-rose-500" : "bg-slate-900 text-slate-200 border-slate-700")}
                  >
                    {isChatCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button 
                    onClick={() => {
                      setActiveChatCall(null);
                      showToast('Call ended');
                    }}
                    className="p-5 rounded-full bg-rose-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition ring-4 ring-rose-500/40"
                    title="End Call"
                  >
                    <Phone className="w-8 h-8 rotate-[135deg]" />
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND COINS MODAL */}
            {isSendCoinsInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      💸 Send Coins Direct Transfer
                    </h3>
                    <button onClick={() => setIsSendCoinsInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Send coins instantly from your balance ({userCoins.toLocaleString()} Coins) to recipient wallet.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block font-bold">Coins Amount</label>
                    <input 
                      type="number"
                      value={sendCoinsInChatAmount}
                      onChange={e => setSendCoinsInChatAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (userCoins < sendCoinsInChatAmount) {
                        showToast('Insufficient coins balance!');
                        setIsDepositModalOpen(true);
                        return;
                      }

                      setUserCoins(prev => prev - sendCoinsInChatAmount);
                      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                      setConversations(prev => prev.map(c => {
                        if (c.id === activeConversationId) {
                          const newMsg = {
                            id: Date.now(),
                            sender: 'me',
                            text: "Sent +" + sendCoinsInChatAmount + " Coins 💸",
                            type: 'coins',
                            time: nowTime
                          };
                          return { ...c, lastMessage: "Sent +" + sendCoinsInChatAmount + " Coins", lastTime: nowTime, messages: [...c.messages, newMsg] };
                        }
                        return c;
                      }));

                      setIsSendCoinsInChatOpen(false);
                      showToast("Successfully sent " + sendCoinsInChatAmount + " Coins!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition"
                  >
                    Confirm & Send Coins
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND GIFT MODAL */}
            {isSendGiftInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/40 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      🎁 Send Gift in Direct Chat
                    </h3>
                    <button onClick={() => setIsSendGiftInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { name: 'Rose', icon: '🌹', coins: 10 },
                      { name: 'Heart', icon: '❤️', coins: 50 },
                      { name: 'Diamond', icon: '💎', coins: 500 },
                      { name: 'Crown', icon: '👑', coins: 2500 }
                    ].map((g, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (userCoins < g.coins) {
                            showToast('Insufficient coin balance!');
                            setIsDepositModalOpen(true);
                            return;
                          }

                          setUserCoins(prev => prev - g.coins);
                          const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                          setConversations(prev => prev.map(c => {
                            if (c.id === activeConversationId) {
                              const newMsg = {
                                id: Date.now(),
                                sender: 'me',
                                text: "Sent " + g.name + " " + (g.emoji || '🎁'),
                                type: 'gift',
                                time: nowTime
                              };
                              return { ...c, lastMessage: "Sent " + g.name + " " + (g.emoji || '🎁'), lastTime: nowTime, messages: [...c.messages, newMsg] };
                            }
                            return c;
                          }));

                          setIsSendGiftInChatOpen(false);
                          showToast("Sent " + g.name + " " + (g.emoji || '🎁') + "!");
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 space-y-1 transition"
                      >
                        <span className="text-2xl flex items-center justify-center text-amber-300">
                          {g.emoji ? g.emoji : <g.icon className="w-6 h-6 mx-auto" />}
                        </span>
                        <p className="font-bold text-white text-[11px]">{g.name}</p>
                        <span className="text-[10px] text-amber-300 font-black">{g.coins} Coins</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREATE GROUP MODAL */}
            {isCreateGroupModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      {window.loc('👥 Create New Group (ساخت گروه جدید)', '👥 Create New Group')}
                    </h3>
                    <button onClick={() => setIsCreateGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">{window.loc('Group Name (نام گروه)', 'Group Name')}</label>
                      <input 
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="e.g. VIP Streamers Club"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">{window.loc('Description (توضیحات)', 'Description')}</label>
                      <input 
                        type="text"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                        placeholder="Group purpose & rules..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newGroupName.trim()) {
                        showToast('Please enter a group name');
                        return;
                      }

                      const newGroup = {
                        id: "group_" + Date.now(),
                        type: 'group',
                        isGroup: true,
                        groupName: newGroupName,
                        user: {
                          username: "group_" + Date.now(),
                          name: newGroupName,
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                          isVerified: true,
                          role: 'Group Admin',
                          online: true
                        },
                        lastMessage: 'Group created',
                        lastTime: 'Just now',
                        unreadCount: 0,
                        messages: [
                          { id: 1, sender: 'them', senderName: 'System', text: "Group \"" + newGroupName + "\" created successfully.", time: 'Just now', status: 'read', type: 'text' }
                        ]
                      };

                      setConversations(prev => [newGroup, ...prev]);
                      setIsCreateGroupModalOpen(false);
                      setNewGroupName('');
                      setNewGroupDesc('');
                      showToast("Group \"" + newGroupName + "\" created successfully!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition"
                  >
                    Create Group Now
                  </button>
                </div>
              </div>
            )}

            {/* MEDIA GALLERY MODAL */}
            {isChatGalleryOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-cyan-400" />
                      🖼️ Shared Media Gallery
                    </h3>
                    <button onClick={() => setIsChatGalleryOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                    ].map((img, i) => (
                      <img key={i} src={img} alt="media" className="w-full h-24 rounded-2xl object-cover ring-1 ring-slate-800" />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
    </>
  );
}
