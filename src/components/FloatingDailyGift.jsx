import React, { useState, useEffect, useRef } from 'react';
import { Gift, Sparkles } from 'lucide-react';
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
        
        {/* Dynamic Glowing Aura */}
        <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 opacity-40 blur-xl animate-[pulse_3s_ease-in-out_infinite] group-hover:opacity-70 transition duration-500" />
        <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-orange-400 opacity-60 blur-md animate-spin group-hover:opacity-100 transition duration-300" style={{ animationDuration: '8s' }} />
        
        {/* Advanced 3D Sphere */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 p-[2px] shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
          <div className="w-full h-full rounded-full bg-slate-900/80 backdrop-blur-xl flex flex-col items-center justify-center relative overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] border border-yellow-300/50">
            
            {/* Inner Glare / Reflection */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[2px] pointer-events-none" />
            
            {/* Animated Laser Sweep */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-100/40 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
            
            {/* Gift Icon & Sparkles */}
            <div className="relative transform group-hover:rotate-12 transition-transform duration-300 mt-0.5">
              <Gift className="w-7 h-7 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" />
              <Sparkles className="w-4 h-4 text-white absolute -top-2 -right-2 animate-ping" style={{ animationDuration: '2s' }} />
              <Sparkles className="w-3 h-3 text-amber-200 absolute -bottom-1 -left-2 animate-pulse" />
            </div>
            
            {/* Label */}
            <span className="text-[9px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400 mt-1 tracking-widest drop-shadow-sm uppercase">
              {window.loc ? window.loc('هدیه', 'GIFT') : 'GIFT'}
            </span>
          </div>
        </div>

        {/* Floating Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 border-2 border-slate-900 text-[10px] font-black text-white flex items-center justify-center shadow-lg shadow-rose-500/50 animate-bounce">
          1
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
