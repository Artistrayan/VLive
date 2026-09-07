import React, { useState, useEffect, useRef } from 'react';
import { Gift, Sparkles, X } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

/**
 * FloatingDailyGift
 * Draggable, animated daily gift icon that floats on screen.
 * Automatically hides for 24 hours when claimed, and reappears after 24 hours.
 */
export default function FloatingDailyGift({ onClick, userId, onClaimSuccess }) {
  const [isVisible, setIsVisible] = useState(false);
  const [pos, setPos] = useState(() => {
    // Default to center-right or center of screen
    const defaultX = typeof window !== 'undefined' ? Math.max(20, window.innerWidth - 80) : 280;
    const defaultY = typeof window !== 'undefined' ? Math.floor(window.innerHeight * 0.45) : 320;
    return { x: defaultX, y: defaultY };
  });

  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0, touchX: 0, touchY: 0 });
  const dragDistanceRef = useRef(0);

  // Check 24-hour eligibility
  const checkEligibility = () => {
    const uid = userId || 'me';
    const storageKey = `vlive_last_daily_gift_${uid}`;
    const lastClaim = parseInt(safeStorage.getItem(storageKey) || '0', 10);
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

    if (!lastClaim || (now - lastClaim) >= TWENTY_FOUR_HOURS) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    checkEligibility();

    // Check periodically every minute
    const interval = setInterval(checkEligibility, 60000);

    const handleClaimed = () => {
      checkEligibility();
    };

    window.addEventListener('vlive_daily_reward_claimed', handleClaimed);
    return () => {
      clearInterval(interval);
      window.removeEventListener('vlive_daily_reward_claimed', handleClaimed);
    };
  }, [userId]);

  // Touch and Mouse Drag handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragDistanceRef.current = 0;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startPosRef.current = {
      x: pos.x,
      y: pos.y,
      touchX: clientX,
      touchY: clientY,
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - startPosRef.current.touchX;
    const deltaY = clientY - startPosRef.current.touchY;
    dragDistanceRef.current = Math.hypot(deltaX, deltaY);

    const winW = typeof window !== 'undefined' ? window.innerWidth : 400;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 700;

    const newX = Math.min(Math.max(10, startPosRef.current.x + deltaX), winW - 70);
    const newY = Math.min(Math.max(70, startPosRef.current.y + deltaY), winH - 120);

    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    // If it was a tap/click without dragging
    if (dragDistanceRef.current < 8) {
      if (typeof onClick === 'function') {
        onClick();
      }
    }
  };

  useEffect(() => {
    const onMove = (e) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        zIndex: 9999,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      className="cursor-grab active:cursor-grabbing animate-fadeIn group select-none"
    >
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Glowing Pulsing Ring */}
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-yellow-400 opacity-70 blur-md animate-pulse group-hover:opacity-100 transition duration-300" />
        
        {/* Main Floating Gift Box Card */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-pink-500 to-rose-600 p-0.5 shadow-2xl shadow-pink-600/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center">
          <div className="w-full h-full rounded-[14px] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden border border-amber-300/40">
            
            {/* Animated Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            
            {/* Gift Icon & Sparkle */}
            <div className="relative">
              <Gift className="w-7 h-7 text-amber-300 animate-bounce" />
              <Sparkles className="w-3.5 h-3.5 text-yellow-200 absolute -top-1 -right-1 animate-spin text-[10px]" style={{ animationDuration: '4s' }} />
            </div>
            
            {/* Label */}
            <span className="text-[9px] font-black text-amber-300 mt-0.5 tracking-tight">
              {window.loc ? window.loc('هدیه', 'GIFT') : 'GIFT'}
            </span>
          </div>
        </div>

        {/* Top Floating Notification Badge */}
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 border border-white text-[9px] font-bold text-white flex items-center justify-center shadow animate-ping" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 border border-white text-[9px] font-bold text-white flex items-center justify-center shadow">
          1
        </div>
      </div>
    </div>
  );
}
