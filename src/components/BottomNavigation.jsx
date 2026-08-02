import React from 'react';
import { Home, Flame, Video, MessageSquare, User } from 'lucide-react';

export default function BottomNavigation({
  activeTab,
  streamSubTab,
  isMatchModalOpen,
  onNavigateHome,
  onNavigateMatch,
  onStartLive,
  onNavigateMessages,
  onNavigateProfile
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-around">
      {/* 1. Home (🏠) */}
      <button 
        onClick={onNavigateHome}
        className={activeTab === 'streams' && streamSubTab === 'lives'
          ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
          : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
        }
        title="Home"
      >
        {activeTab === 'streams' && streamSubTab === 'lives' ? (
          <Home className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
        ) : (
          <>
            <Home className="w-5 h-5" />
            <span className="text-[9px] tracking-wide">Home</span>
          </>
        )}
      </button>

      {/* 2. Match (🔥) */}
      <button 
        onClick={onNavigateMatch}
        className={activeTab === 'match' || isMatchModalOpen
          ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
          : "flex flex-col items-center gap-1 p-2 rounded-2xl text-pink-400 hover:text-pink-300 transition-all duration-300 group"
        }
        title="Match"
      >
        {activeTab === 'match' || isMatchModalOpen ? (
          <Flame className="w-6 h-6 font-black group-hover:scale-110 transition duration-300 text-white animate-pulse" />
        ) : (
          <>
            <Flame className="w-5 h-5 text-pink-400 group-hover:scale-110 transition duration-300" />
            <span className="text-[9px] font-bold tracking-wide text-pink-400">Match</span>
          </>
        )}
      </button>

      {/* 3. Live Broadcast Center (📺) */}
      <button 
        onClick={onStartLive}
        className="relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
        title="Go Live"
      >
        <Video className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
      </button>

      {/* 4. Messages (💬) */}
      <button 
        onClick={onNavigateMessages}
        className={activeTab === 'messages'
          ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
          : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
        }
        title="Messages"
      >
        {activeTab === 'messages' ? (
          <MessageSquare className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
        ) : (
          <>
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] tracking-wide">Messages</span>
          </>
        )}
      </button>

      {/* 5. Profile (👤) */}
      <button 
        onClick={onNavigateProfile}
        className={activeTab === 'profile'
          ? "relative -top-5 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.8)] border-2 border-white/30 active:scale-95 transition-all duration-300 group"
          : "flex flex-col items-center gap-1 p-2 rounded-2xl text-slate-400 hover:text-slate-200 transition-all duration-300"
        }
        title="Profile"
      >
        {activeTab === 'profile' ? (
          <User className="w-6 h-6 font-black group-hover:scale-110 transition duration-300" />
        ) : (
          <>
            <User className="w-5 h-5" />
            <span className="text-[9px] tracking-wide">Profile</span>
          </>
        )}
      </button>
    </nav>
  );
}
