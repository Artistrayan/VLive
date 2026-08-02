import React from 'react';
import { 
  Flame, Shuffle, Sliders, X, Gift, Star, Heart, MessageSquare, Video, 
  RefreshCw, MapPin, CheckCircle2, Crown, Zap, Clock, BadgeCheck 
} from 'lucide-react';

export default function MatchPage({
  matchDeckProfiles,
  matchCardIndex,
  setMatchCardIndex,
  matchSubTab,
  setMatchSubTab,
  isSwipeDragging,
  setIsSwipeDragging,
  swipeDragPos,
  setSwipeDragPos,
  swipeStartPos,
  handleRandomMatch,
  setIsMatchFilterOpen,
  triggerMatchAction,
  setIsMatchModalOpen,
  setActiveTab,
  showToast,
  handleInitiateCall,
  matchState,
  setMatchState,
  freeMatchCallsLeft,
  setFreeMatchCallsLeft,
  matchedMatchUser,
  setMatchedMatchUser,
  matchCallSeconds,
  setMatchCallSeconds,
  usersList,
  currentUsername,
  setMatchResultPopup
}) {
  return (
    <div className="space-y-4 max-w-md mx-auto animate-fadeIn pb-12">
      
      {/* 1. Top Header & Smart Filter Bar */}
      <div className="card-3d p-3.5 rounded-3xl bg-slate-900/90 border border-pink-500/30 flex items-center justify-between gap-3 backdrop-blur-xl shadow-[0_0_40px_rgba(236,72,153,0.2)]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-1.5">
              <span>V.Live Match</span>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">VIP</span>
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{matchDeckProfiles.length} Online Matches</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomMatch}
            className="px-3 py-2 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold shadow-md"
            title="Random Discovery"
          >
            <Shuffle className="w-4 h-4 text-indigo-400" />
            <span className="hidden xs:inline">🎲 Random</span>
          </button>
          <button
            onClick={() => setIsMatchFilterOpen(true)}
            className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-pink-400 border border-slate-700 active:scale-95 transition flex items-center gap-1.5 shadow-md"
            title="Smart Match Filters"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Sub-Tabs Switcher */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
        <button
          onClick={() => setMatchSubTab('swipe')}
          className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'swipe' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span>🔥</span>
          <span>Match Deck</span>
        </button>
        <button
          onClick={() => setMatchSubTab('roulette')}
          className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'roulette' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span>🎲</span>
          <span>30s Video</span>
        </button>
        <button
          onClick={() => setMatchSubTab('likes')}
          className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'likes' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <span>👑</span>
          <span>Liked You</span>
        </button>
      </div>

      {/* 3. SUB-TAB 1: SWIPE MATCH DECK */}
      {matchSubTab === 'swipe' && (
        <div className="space-y-4">
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
                if (swipeDragPos.x > 80) triggerMatchAction('like');
                else if (swipeDragPos.x < -80) triggerMatchAction('reject');
                else if (swipeDragPos.y < -80) triggerMatchAction('superlike');
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
                if (swipeDragPos.x > 80) triggerMatchAction('like');
                else if (swipeDragPos.x < -80) triggerMatchAction('reject');
                else if (swipeDragPos.y < -80) triggerMatchAction('superlike');
                else setSwipeDragPos({ x: 0, y: 0 });
              }}
              onMouseLeave={() => {
                if (isSwipeDragging) {
                  setIsSwipeDragging(false);
                  setSwipeDragPos({ x: 0, y: 0 });
                }
              }}
              style={{
                transform: `translate(${swipeDragPos.x}px, ${swipeDragPos.y}px) rotate(${swipeDragPos.x * 0.05}deg)`,
                transition: isSwipeDragging ? 'none' : 'transform 0.3s ease'
              }}
              className="relative min-h-[480px] sm:min-h-[520px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-[0_0_60px_rgba(236,72,153,0.3)] flex flex-col justify-end select-none touch-none cursor-grab active:cursor-grabbing group"
            >
              {/* Blurred Image Backdrop for Depth */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-45 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${matchDeckProfiles[matchCardIndex].avatar})` }}
              />

              {/* Main Profile Photo */}
              <img 
                src={matchDeckProfiles[matchCardIndex].avatar} 
                alt={matchDeckProfiles[matchCardIndex].name} 
                className="absolute inset-0 w-full h-full object-cover filter brightness-95 pointer-events-none group-hover:scale-105 transition duration-700" 
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

              {/* Gesture Stamps */}
              {isSwipeDragging && swipeDragPos.x > 30 && (
                <div className="absolute top-12 left-6 z-30 px-5 py-2 rounded-2xl border-4 border-emerald-400 bg-emerald-500/20 text-emerald-300 font-black text-2xl uppercase tracking-widest rotate-[-12deg] backdrop-blur-md shadow-2xl animate-pulse">
                  ❤️ LIKE
                </div>
              )}
              {isSwipeDragging && swipeDragPos.x < -30 && (
                <div className="absolute top-12 right-6 z-30 px-5 py-2 rounded-2xl border-4 border-rose-500 bg-rose-500/20 text-rose-300 font-black text-2xl uppercase tracking-widest rotate-[12deg] backdrop-blur-md shadow-2xl animate-pulse">
                  ❌ PASS
                </div>
              )}
              {isSwipeDragging && swipeDragPos.y < -30 && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl border-4 border-amber-400 bg-amber-500/20 text-amber-300 font-black text-2xl uppercase tracking-widest backdrop-blur-md shadow-2xl animate-pulse">
                  ⭐ SUPER LIKE
                </div>
              )}

              {/* Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-black flex items-center gap-1.5 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{matchDeckProfiles[matchCardIndex].distance}</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  {matchDeckProfiles[matchCardIndex].isVerified && (
                    <div className="px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/40 text-blue-300 text-xs font-black flex items-center gap-1 shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Verified</span>
                    </div>
                  )}
                  {matchDeckProfiles[matchCardIndex].isVip && (
                    <div className="px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-1 shadow-lg">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>VIP</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Info Section at Bottom */}
              <div className="relative z-20 p-5 space-y-3.5 pointer-events-auto">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                      <span>{matchDeckProfiles[matchCardIndex].name}</span>
                      <span className="px-2.5 py-0.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold">
                        {matchDeckProfiles[matchCardIndex].age}
                      </span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200 font-bold mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      {matchDeckProfiles[matchCardIndex].city}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Active Now
                    </span>
                  </div>
                </div>

                {/* Interest Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {matchDeckProfiles[matchCardIndex].interests.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ACTION BUTTONS BAR */}
                <div className="grid grid-cols-6 gap-2 pt-2">
                  
                  {/* 1. Pass / Reject */}
                  <button 
                    onClick={() => triggerMatchAction('reject')}
                    className="h-12 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                    title="Pass"
                  >
                    <X className="w-6 h-6 group-hover:scale-110 transition" />
                  </button>

                  {/* 2. Instant Gift */}
                  <button 
                    onClick={() => triggerMatchAction('gift')}
                    className="h-12 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                    title="Send Virtual Gift"
                  >
                    <Gift className="w-6 h-6 group-hover:scale-110 transition animate-bounce" />
                  </button>

                  {/* 3. Super Like */}
                  <button 
                    onClick={() => triggerMatchAction('superlike')}
                    className="h-12 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                    title="Super Like"
                  >
                    <Star className="w-6 h-6 group-hover:scale-110 transition text-amber-400 fill-amber-400" />
                  </button>

                  {/* 4. Like */}
                  <button 
                    onClick={() => triggerMatchAction('like')}
                    className="h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)] active:scale-90 transition group"
                    title="Like"
                  >
                    <Heart className="w-7 h-7 fill-white group-hover:scale-125 transition" />
                  </button>

                  {/* 5. Direct Message */}
                  <button 
                    onClick={() => {
                      const target = matchDeckProfiles[matchCardIndex];
                      setIsMatchModalOpen(false);
                      setActiveTab('messages');
                      showToast(`💬 Opened chat with @${target.name || target.username}`);
                    }}
                    className="h-12 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                    title="Chat"
                  >
                    <MessageSquare className="w-6 h-6 group-hover:scale-110 transition" />
                  </button>

                  {/* 6. Video Call */}
                  <button 
                    onClick={() => {
                      const target = matchDeckProfiles[matchCardIndex];
                      handleInitiateCall(target, 'video', '1on1');
                      setIsMatchModalOpen(false);
                      showToast(`📹 Calling ${target.name}...`);
                    }}
                    className="h-12 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                    title="1on1 Video Call"
                  >
                    <Video className="w-6 h-6 group-hover:scale-110 transition" />
                  </button>

                </div>

              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center space-y-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center text-4xl animate-bounce shadow-lg">
                ✨
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">All Profiles Viewed!</h4>
                <p className="text-xs text-slate-400">Refresh the deck or adjust smart filters to discover more matches.</p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setMatchCardIndex(0)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Refresh Deck</span>
                </button>
                <button
                  onClick={() => setIsMatchFilterOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 hover:bg-slate-700 active:scale-95 transition flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-pink-400" />
                  <span>Adjust Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: 30S VIDEO ROULETTE */}
      {matchSubTab === 'roulette' && (
        <div className="card-3d p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 text-center">
          {matchState === 'idle' && (
            <div className="space-y-4 py-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center shadow-lg">
                <Video className="w-10 h-10 text-pink-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">30s Live Video Roulette</h4>
                <p className="text-xs text-slate-400">Instant video call pairing with verified online users.</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 flex items-center justify-between">
                <span>Daily Free Quota:</span>
                <span className="text-white bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/40">{freeMatchCallsLeft} / 3</span>
              </div>
              <button
                onClick={() => {
                  if (freeMatchCallsLeft <= 0) {
                    showToast('⚠️ Daily free roulette quota reached.');
                    return;
                  }
                  setMatchState('searching');
                  setTimeout(() => {
                    const realPartners = (Array.isArray(usersList) && usersList.length > 0)
                      ? usersList.filter(u => u && u.username !== currentUsername && u.user_type !== 'TEST_USER' && u.user_type !== 'DEMO_USER' && (u.status === 'approved' || u.isApproved !== false))
                      : [
                          { name: 'Sara Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true },
                          { name: 'Elnaz Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', city: 'Shiraz', isVerified: true },
                          { name: 'Sahar Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true }
                        ];
                    const randomPartner = realPartners[Math.floor(Math.random() * realPartners.length)] || realPartners[0];
                    setMatchedMatchUser(randomPartner);
                    setMatchState('connected');
                    setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
                    setMatchCallSeconds(30);
                    showToast(`🎉 Connected with @${randomPartner.name || randomPartner.username}!`);
                  }, 2200);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Start 30s Video Roulette</span>
              </button>
            </div>
          )}

          {matchState === 'searching' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-500 border-t-transparent animate-spin shadow-lg" />
              <h4 className="text-sm font-black text-white">Matching with Random Partner...</h4>
              <p className="text-xs text-slate-400">Connecting video stream in 4K resolution...</p>
            </div>
          )}

          {matchState === 'connected' && matchedMatchUser && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/40 shadow-2xl flex items-center justify-center">
                <img src={matchedMatchUser.avatar} alt={matchedMatchUser.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/40 text-pink-400 font-black text-xs flex items-center gap-1.5 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{matchCallSeconds}s</span>
                </div>

                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white flex items-center gap-1">
                      {matchedMatchUser.name}
                      {matchedMatchUser.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                    </h4>
                    <p className="text-[10px] text-slate-300 font-bold">📍 {matchedMatchUser.city}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMatchState('idle');
                      showToast('📞 Call ended.');
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg active:scale-95 transition"
                  >
                    End Call
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: WHO LIKED YOU (VIP) */}
      {matchSubTab === 'likes' && (
        <div className="space-y-3">
          <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black">
                👑
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Who Liked Your Profile</h4>
                <p className="text-[10px] text-slate-400">See all active members who swiped right on you</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">VIP Perk</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {matchDeckProfiles.slice(0, 4).map((p, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
                <img src={p.avatar} alt={p.name} className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-pink-500/80 backdrop-blur-md text-white text-[9px] font-black flex items-center gap-1 shadow">
                  ❤️ Liked You
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                  <h5 className="text-xs font-black text-white flex items-center gap-1">
                    {p.name}, {p.age}
                  </h5>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <button 
                      onClick={() => setMatchResultPopup(p)}
                      className="py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-[10px] shadow"
                    >
                      Match ❤️
                    </button>
                    <button 
                      onClick={() => {
                        handleInitiateCall(p, 'video', '1on1');
                        showToast(`📹 Calling ${p.name}...`);
                      }}
                      className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-[10px]"
                    >
                      Video 📹
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
