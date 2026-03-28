// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\leaderboard\page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Zap, Star, Globe, Calendar, Crown, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';
import { progressAPI } from '@/lib/apiClient';

export default function Leaderboard() {
  const [data, setData] = useState<{global: any[], weekly: any[]}>({ global: [], weekly: [] });
  const [tab, setTab] = useState<'global' | 'weekly'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await progressAPI.getLeaderboard();
        setData(res.data);
      } catch (err) {
        console.error("Leaderboard load fail:", err);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white/20 font-mono text-sm animate-pulse">LOADING RANKINGS...</div>;

  const list = tab === 'global' ? data.global : data.weekly;

  return (
    <AuthGuard>
      <div className="container py-12 pb-24 max-w-4xl layer-10">
         <header className="text-center mb-24">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
               <div className="w-20 h-20 rounded-[2.5rem] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-10 text-blue-500 relative group overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />
                  <Trophy className="w-10 h-10 relative z-10" />
               </div>
               <h1 className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tight mb-6">
                  PERFORMANCE <span className="text-blue-500">LEADERBOARD</span>
               </h1>
               <p className="text-gray-500 text-[15px] font-light max-w-lg mx-auto leading-relaxed">System-wide performance synchronization. Advance through the sectors to establish architectural dominance.</p>
            </motion.div>
         </header>

         {/* Tabs */}
         <div className="flex p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl w-fit mx-auto mb-20">
            <button onClick={() => setTab('weekly')} className={`px-10 py-3 rounded-xl text-[10px] font-bold tracking-[0.3em] transition-all duration-300 ${tab === 'weekly' ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-gray-600 hover:text-gray-400'}`}>
               <Calendar className="w-4 h-4 inline mr-2 -mt-0.5" /> WEEKLY SYNC
            </button>
            <button onClick={() => setTab('global')} className={`px-10 py-3 rounded-xl text-[10px] font-bold tracking-[0.3em] transition-all duration-300 ${tab === 'global' ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-gray-600 hover:text-gray-400'}`}>
               <Globe className="w-4 h-4 inline mr-2 -mt-0.5" /> GLOBAL UPTIME
            </button>
         </div>

         {/* Rankings */}
         <div className="space-y-4">
            <AnimatePresence mode="wait">
               {list.map((entry, index) => (
                  <motion.div 
                     key={entry._id}
                     initial={{ opacity: 0, x: -30 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 30 }}
                     transition={{ delay: index * 0.05 }}
                     className={`p-6 flex items-center gap-8 border transition-all duration-500 rounded-2xl ${index === 0 ? 'bg-blue-500/5 border-blue-500/20 shadow-2xl shadow-blue-500/5' : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                  >
                     <div className="w-12 text-2xl font-bold text-gray-800 tracking-tighter tabular-nums">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                     </div>
                     
                     <div className="relative">
                        <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 p-0.5 transition-all duration-500 ${index === 0 ? 'border-amber-500/50 bg-amber-500/10 scale-110 shadow-xl shadow-amber-500/10' : 'border-white/10 bg-white/10'}`}>
                           <img 
                             src={entry.userId?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + entry.firebaseUID} 
                             alt="" 
                             className="w-full h-full object-cover rounded-[14px]"
                           />
                        </div>
                        {index === 0 && <Crown className="absolute -top-3.5 -right-3.5 w-7 h-7 text-amber-500 rotate-12 drop-shadow-xl animate-pulse" />}
                     </div>

                     <div className="flex-1">
                        <h4 className="text-lg font-bold text-white flex items-center gap-3 tracking-tight uppercase">
                           {entry.userId?.displayName || 'Anonymous Developer'}
                           {index < 3 && <ShieldCheck className={`w-4 h-4 ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-blue-300' : 'text-orange-400'}`} />}
                        </h4>
                        <div className="flex items-center gap-5 mt-2">
                           <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em]">Active Streak</span>
                           <span className="text-[10px] font-bold text-emerald-500/80 tracking-widest">{entry.streak} DAYS</span>
                        </div>
                     </div>

                     <div className="text-right">
                        <div className="flex items-center justify-end gap-3 mb-1">
                           <Zap className={`w-4 h-4 ${index === 0 ? 'text-blue-400' : 'text-gray-700'}`} />
                           <span className={`text-2xl font-bold tracking-tight tabular-nums ${index === 0 ? 'text-white' : 'text-gray-300'}`}>{tab === 'global' ? entry.xp : entry.weeklyXP}</span>
                        </div>
                        <p className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">Architect XP</p>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
            
            {list.length === 0 && (
               <div className="py-24 text-center text-gray-800 font-bold text-[10px] tracking-[0.4em] uppercase border border-dashed border-white/5 rounded-3xl">No performance data archived.</div>
            )}
         </div>

         {/* Info Card */}
         <div className="mt-24 p-12 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />
            <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center shrink-0 shadow-inner group-hover:border-blue-500/20 transition-all">
               <Star className="w-10 h-10 text-gray-800 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex-1 text-center md:text-left">
               <h4 className="text-xl font-bold text-white mb-3 tracking-tight uppercase">Prime Performance Rewards</h4>
               <p className="text-[15px] text-gray-500 leading-relaxed font-light">Top-tier architects receive exclusive neural badges and 2.0x XP multipliers. Sector reset synchronized: Sunday 00:00 UTC.</p>
            </div>
            <Link href="/practice" className="px-10 py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3">
               Acquire Status <ArrowUpRight className="w-4 h-4" />
            </Link>
         </div>
      </div>
    </AuthGuard>
  );
}
