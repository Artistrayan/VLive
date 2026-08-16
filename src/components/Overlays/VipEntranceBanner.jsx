import React, { useEffect, useState } from 'react';
import { Crown, Sparkles, Star } from 'lucide-react';

export default function VipEntranceBanner({ vipUser, onComplete }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!vipUser) return;
    setVisible(true);

    const timerHide = setTimeout(() => {
      setVisible(false);
    }, 3800);

    const timerDone = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4300);

    return () => {
      clearTimeout(timerHide);
      clearTimeout(timerDone);
    };
  }, [vipUser, onComplete]);

  if (!vipUser) return null;

  const {
    name = 'VIP User',
    avatar = '',
    plan = 'VIP Status',
    level = 5
  } = vipUser;

  return (
    <div className={`fixed top-16 inset-x-0 z-[90] flex justify-center pointer-events-none transition-all duration-700 ${
      visible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-12 opacity-0 scale-90'
    }`}>
      <div className="relative mx-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-500/95 via-yellow-400/95 to-amber-600/95 border-2 border-yellow-200 shadow-[0_0_35px_rgba(245,158,11,0.9)] backdrop-blur-xl flex items-center gap-3 animate-pulse">
        
        {/* Crown & Avatar with Animated Ring */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-300 via-yellow-100 to-amber-500 shadow-md">
            <img
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <Crown className="w-4 h-4 text-slate-950 fill-yellow-300 absolute -top-2 -right-1 drop-shadow" />
        </div>

        {/* Text Details */}
        <div className="text-right">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-950 font-sans tracking-wide">
              {name}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-950 text-amber-300 text-[8px] font-black border border-amber-400">
              {plan}
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-900 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>{window.loc('وارد لایواستریم شد ✨', 'entered the live stream ✨')}</span>
          </p>
        </div>

        {/* Level Badge */}
        <div className="px-2.5 py-1 rounded-full bg-slate-950 text-yellow-300 font-mono font-black text-[10px] border border-amber-400/60 flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
          <span>Lvl {level}</span>
        </div>

      </div>
    </div>
  );
}
