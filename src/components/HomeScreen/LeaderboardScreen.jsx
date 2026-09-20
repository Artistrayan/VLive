import React, { useState } from 'react';
import { Trophy, Share2, Medal } from 'lucide-react';

export default function LeaderboardScreen({ loc }) {
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('level');

  const handleShare = (rank, name) => {
    const text = loc(
      `من در رتبه ${rank} برترین‌های ${category} هستم!`,
      `I am ranked ${rank} in ${category} leaderboard!`
    );
    if (navigator.share) {
      navigator.share({ title: 'V.Live Leaderboard', text, url: window.location.href });
    } else {
      alert(text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-4 space-y-4">
      <h2 className="text-xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">
        {loc('برترین‌های V.Live', 'V.Live Leaderboard')}
      </h2>

      {/* Timeframe Tabs */}
      <div className="flex bg-slate-900 rounded-2xl p-1">
        {['weekly', 'monthly', 'alltime'].map(t => (
          <button key={t} onClick={() => setTimeframe(t)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${timeframe === t ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' : 'text-slate-400'}`}>
            {loc(t === 'weekly' ? 'هفتگی' : t === 'monthly' ? 'ماهانه' : 'کلی', t === 'weekly' ? 'Weekly' : t === 'monthly' ? 'Monthly' : 'All-time')}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {[
          {id: 'level', label: 'سطح'},
          {id: 'popularity', label: 'محبوبیت'},
          {id: 'gifts_received', label: 'هدایای دریافتی'},
          {id: 'gifts_given', label: 'هدایای ارسالی'},
          {id: 'purchases', label: 'خریدها'},
          {id: 'calls', label: 'تماس تصویری'}
        ].map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className={`py-2 rounded-lg ${category === cat.id ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400'} font-bold`}>
            {loc(cat.label, cat.label)}
          </button>
        ))}
      </div>

      {/* Podium - Placeholder for actual logic */}
      <div className="flex justify-center items-end gap-2 py-6">
        {[2, 1, 3].map((pos) => (
          <div key={pos} className={`flex flex-col items-center ${pos === 1 ? 'scale-110' : 'opacity-80'}`}>
            <Medal className={`w-8 h-8 ${pos === 1 ? 'text-amber-400' : pos === 2 ? 'text-slate-300' : 'text-orange-700'}`} />
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600"></div>
            <span className="text-xs font-bold mt-1">N/A</span>
          </div>
        ))}
      </div>

      {/* List - Placeholder for actual logic */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <p className="text-center text-slate-500 text-xs py-10">{loc('لیست در حال بارگذاری...', 'Loading list...')}</p>
      </div>

      {/* Share Button (Example for rank 1) */}
      <button onClick={() => handleShare(1, 'User')} className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-xs">
        <Share2 className="w-4 h-4" />
        {loc('اشتراک‌گذاری رتبه', 'Share Rank')}
      </button>
    </div>
  );
}
