import React, { useState, useEffect } from 'react';
import { 
  BarChart2, Users, Video, DollarSign
} from 'lucide-react';
import { apiAdmin } from '../../services/api';

export default function AnalyticsCenter({
  usersList = [],
  streamsList = [],
  transactionsList = [],
  loc = ((a, b) => b || a)
}) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStreams: 0,
    totalTx: 0,
    revenue: 0
  });

  useEffect(() => {
    // Quick real calculations
    const totalUsers = usersList.length;
    const activeStreams = streamsList.length;
    
    // We could fetch real transactions
    // For now, let's just use what we have or fetch
    setStats({
      totalUsers,
      activeStreams,
      totalTx: 0,
      revenue: 0
    });
  }, [usersList, streamsList]);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-amber-400" />
            <span> Real Analytics Center</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800">
          <span className="text-amber-400 mb-2 block"><Users className="w-5 h-5"/></span>
          <span className="text-[10px] text-slate-400">Total Users</span>
          <p className="text-xl font-black text-white">{stats.totalUsers}</p>
        </div>
        <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800">
          <span className="text-rose-400 mb-2 block"><Video className="w-5 h-5"/></span>
          <span className="text-[10px] text-slate-400">Active Streams</span>
          <p className="text-xl font-black text-white">{stats.activeStreams}</p>
        </div>
      </div>
    </div>
  );
}
