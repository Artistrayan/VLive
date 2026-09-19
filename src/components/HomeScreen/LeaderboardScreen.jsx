import React, { useState } from 'react';
import { Trophy, Award, TrendingUp, Users, Gift, Video } from 'lucide-react';

export default function LeaderboardScreen({ loc }) {
  const [timeframe, setTimeframe] = useState('weekly'); // weekly, monthly, alltime
  const [category, setCategory] = useState('level'); // level, popularity, gifts_received, gifts_given, purchases, calls

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-4 space-y-4">
      <h2 className="text-xl font-black text-center">{loc('برترین‌ها', 'Leaderboard')}</h2>
      
      {/* Timeframe Tabs */}
      <div className="flex bg-slate-900 rounded-full p-1">
        {['weekly', 'monthly', 'alltime'].map(t => (
          <button key={t} onClick={() => setTimeframe(t)} className={`flex-1 py-2 text-xs font-bold rounded-full ${timeframe === t ? 'bg-pink-600 text-white' : 'text-slate-400'}`}>
            {loc(t === 'weekly' ? 'هفتگی' : t === 'monthly' ? 'ماهانه' : 'کلی', t === 'weekly' ? 'Weekly' : t === 'monthly' ? 'Monthly' : 'All-time')}
          </button>
        ))}
      </div>

      {/* Category Tabs (Simplified as buttons) */}
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        {[
          {id: 'level', label: 'سطح'},
          {id: 'popularity', label: 'محبوبیت'},
          {id: 'gifts_received', label: 'هدایای دریافتی'},
          {id: 'gifts_given', label: 'هدایای ارسالی'},
          {id: 'purchases', label: 'خریدها'},
          {id: 'calls', label: 'تماس تصویری'}
        ].map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)} className={`py-2 px-1 rounded-lg ${category === cat.id ? 'bg-cyan-600' : 'bg-slate-900'} text-center font-bold`}>
            {loc(cat.label, cat.label)}
          </button>
        ))}
      </div>

      {/* Podium & List */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-center text-slate-500 text-xs py-10">{loc('در حال بارگذاری لیست...', 'Loading leaderboard...')}</p>
      </div>
    </div>
  );
}
