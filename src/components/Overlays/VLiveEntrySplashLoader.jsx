import React, { useState, useEffect } from 'react';

export default function VLiveEntrySplashLoader({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress loading bar from 0% to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment smoothly
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + step, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 400); // Slight delay for 100% display
      return () => clearTimeout(timeout);
    }
  }, [progress, onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 overflow-hidden select-none dir-ltr font-sans">
      {/* Background Ambient Spotlights & Neon Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/30 via-purple-600/20 to-transparent blur-3xl pointer-events-none animate-pulse" />
      <div 
        className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-tl from-cyan-500/30 via-blue-600/20 to-transparent blur-3xl pointer-events-none animate-pulse"
        style={{ animationDelay: '1.5s' }} 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 max-w-sm w-full mx-auto text-center">
        
        {/* RELATIVELY LARGE LOGO IMAGE */}
        <div className="relative group">
          {/* Intense Outer Glow Aura */}
          <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 blur-2xl opacity-80 animate-pulse transition duration-1000" />
          
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-[36px] p-1.5 bg-gradient-to-tr from-pink-500 via-purple-500 via-cyan-400 to-pink-600 shadow-[0_0_60px_rgba(236,72,153,0.7)] overflow-hidden">
            <img 
              src="/vlive_logo.jpg" 
              alt="V.LIVE Logo" 
              className="w-full h-full rounded-[30px] object-cover border-2 border-slate-950 shadow-2xl"
              onError={(e) => {
                // Fallback if public path isn't loaded
                e.target.onerror = null;
                e.target.src = '/src/assets/vlive_logo.jpg';
              }}
            />
          </div>
        </div>

        {/* 3D EMBOSSED & SHINY V.LIVE TEXT */}
        <div className="relative pt-2">
          <h1 
            className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-500 uppercase drop-shadow-2xl"
            style={{
              textShadow: `
                0 1px 0 #f472b6,
                0 2px 0 #ec4899,
                0 3px 0 #db2777,
                0 4px 0 #be185d,
                0 5px 0 #9d174d,
                0 6px 0 #831843,
                0 8px 15px rgba(0, 0, 0, 0.95),
                0 0 25px rgba(236, 72, 153, 0.9),
                0 0 50px rgba(168, 85, 247, 0.8)
              `,
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            V.LIVE
          </h1>
          {/* Metallic Glossy Highlight Beam overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm opacity-50 pointer-events-none transform -skew-x-12 animate-pulse" />
        </div>

        {/* NEON LOADING PROGRESS BAR */}
        <div className="w-full max-w-xs space-y-2 pt-4">
          <div className="relative w-full h-3.5 rounded-full bg-slate-900 border border-pink-500/40 p-0.5 shadow-[0_0_20px_rgba(236,72,153,0.4)] overflow-hidden">
            {/* Glowing Bar Fill */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(236,72,153,0.9)] transition-all duration-200 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer Light Reflection */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Percentage Indicator */}
          <div className="flex items-center justify-between text-xs font-mono font-bold px-1">
            <span className="text-pink-400/80 tracking-widest text-[11px]">LOADING</span>
            <span className="text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
