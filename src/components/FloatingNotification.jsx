import React from 'react';
import { Bell } from 'lucide-react';

export default function FloatingNotification({ 
  hasUnread, 
  unreadCount, 
  onClick, 
  onMarkRead 
}) {
  if (!hasUnread) return null;

  return (
    <div 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] cursor-pointer group"
      onClick={() => {
        if (onClick) onClick();
        if (onMarkRead) onMarkRead();
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full animate-ping opacity-60" style={{ animationDuration: '2s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full animate-pulse opacity-40 blur-md"></div>
        
        <div className="relative w-14 h-14 rounded-full bg-slate-900/90 backdrop-blur-md border border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
          <Bell className="w-6 h-6 text-pink-400 fill-pink-400/20 animate-[swing_2s_ease-in-out_infinite] group-hover:text-white transition-colors" style={{ transformOrigin: 'top center' }} />
        </div>

        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 z-10 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-mono text-[10px] font-black border-2 border-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-125 transition-transform duration-300">
            {unreadCount}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes swing {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-10deg); }
          30% { transform: rotate(5deg); }
          40% { transform: rotate(-5deg); }
          50% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}} />
    </div>
  );
}
