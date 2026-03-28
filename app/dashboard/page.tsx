// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\dashboard\page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Flame, Award, ChevronRight, Play, Rocket, Target, Star, Brain, ArrowUpRight, BarChart3 } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { progressAPI, aiAPI } from '@/lib/apiClient';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const res = await progressAPI.getStats(u.uid);
          setStats(res.data);
          const aiRes = await aiAPI.suggest(res.data);
          setSuggestion(aiRes.data);
        } catch (err) {
          console.error("Dashboard load fail:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-6">
      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-full h-full bg-blue-500" />
      </div>
      <div className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.4em] animate-pulse">Initializing Interface...</div>
    </div>
  );

  const totalLessons = stats?.completedLessons?.length || 0;
  const totalProblems = stats?.solvedProblems?.length || 0;
  const streakCount = stats?.streak || 0;
  const xpCount = stats?.xp || 0;

  return (
    <AuthGuard>
      <div className="container py-12 pb-24">
        {/* Header Section */}
        <div className="grid lg:grid-cols-[1fr,420px] gap-10 mb-16">
           <motion.div initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-3">Intelligence Overview</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 uppercase tracking-tight leading-none">
                 WELCOME BACK, <span className="text-blue-500">DEVELOPER</span>
              </h1>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                 {[
                    { label: 'XP', value: xpCount, icon: Zap, color: 'text-blue-400', bg: 'bg-blue-500/5' },
                    { label: 'Streak', value: `${streakCount}d`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/5' },
                    { label: 'Solved', value: totalProblems, icon: Target, color: 'text-indigo-400', bg: 'bg-indigo-500/5' },
                    { label: 'Certificates', value: Object.values(stats?.testScores || {}).filter((s:any) => s >= 70).length, icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/5' }
                 ].map((item, i) => (
                    <div key={i} className={`p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group`}>
                       <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                       </div>
                       <p className="text-2xl font-bold text-white tracking-tight">{item.value}</p>
                       <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1.5">{item.label}</p>
                    </div>
                 ))}
              </div>
           </motion.div>

           {/* Next Step AI Widget */}
           <motion.div initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} className="p-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 relative overflow-hidden group flex flex-col">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                       <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Neural Advisor</span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-4 leading-tight tracking-tight uppercase">{suggestion?.suggestion || "Initiate Python Core"}</h3>
                 <p className="text-[13px] text-gray-500 mb-10 leading-relaxed font-light italic">"{suggestion?.reason || "Operational parameters suggest continuing your current trajectory to maximize XP yields."}"</p>
                 <Link href="/roadmap" className="mt-auto px-6 py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group/btn">
                    Launch Next Module <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                 </Link>
              </div>
           </motion.div>
        </div>

        {/* Content Tabs */}
        <div className="grid lg:grid-cols-[1fr,380px] gap-16">
           <div className="space-y-16">
              {/* Mastery Overviews */}
              <section>
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] flex items-center gap-3">
                       <BarChart3 className="w-4 h-4 text-blue-500" /> Operational Proficiency
                    </h2>
                 </div>
                 <div className="grid gap-5">
                    {['python', 'javascript', 'html', 'css', 'dsa'].map((t) => (
                       <div key={t} className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                          <div className="flex items-center justify-between mb-5">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">{t} Environment</span>
                             </div>
                             <span className="text-[10px] font-bold text-gray-700 uppercase">Module Level {stats?.currentLevel?.[t] || 1}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: t === 'python' ? '65%' : t === 'javascript' ? '40%' : '15%' }} className="h-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
                          </div>
                       </div>
                    ))}
                 </div>
              </section>

              {/* Achievements */}
              <section>
                 <h2 className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <Award className="w-4 h-4 text-blue-500" /> My Achievements
                 </h2>
                 <div className="flex flex-wrap gap-6">
                    {stats?.badges?.length > 0 ? stats.badges.map((b: string) => (
                       <div key={b} className="group relative">
                          <div className="w-20 h-20 rounded-[24px] bg-white/[0.02] border border-white/10 flex items-center justify-center p-4 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all">
                             <Star className="w-full h-full text-gray-800 group-hover:text-amber-500 transition-colors" />
                          </div>
                          <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-4 py-2 rounded-xl text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold uppercase tracking-widest shadow-2xl">{b}</div>
                       </div>
                    )) : (
                      <p className="text-[12px] text-gray-700 italic font-light tracking-wide px-4 py-8 border border-dashed border-white/5 rounded-2xl w-full text-center uppercase">No active lessons archived. Start a track to begin.</p>
                    )}
                 </div>
              </section>
           </div>

           {/* Stats / Activity Side */}
           <aside className="space-y-10">
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.01]">
                 <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em] mb-10">Neural Log Feed</h3>
                 <div className="space-y-8">
                    {[1,2,3].map(i => (
                       <div key={i} className="flex gap-5 group items-center">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all">
                             <Zap className="w-4 h-4 text-gray-800 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <div>
                             <p className="text-[11px] font-bold text-gray-400 leading-tight uppercase tracking-tight group-hover:text-white transition-colors">Lesson Completed</p>
                             <p className="text-[9px] font-bold text-gray-800 uppercase tracking-widest mt-1.5">{i}h AGO</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button className="w-full mt-12 py-3.5 rounded-xl border border-white/10 text-[10px] font-bold text-gray-700 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">Full Log History</button>
              </div>

              <div className="p-8 rounded-2xl bg-blue-600 border border-blue-400 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full pointer-events-none" />
                 <Rocket className="w-7 h-7 text-white mb-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 <h4 className="text-white text-base font-bold mb-3 uppercase tracking-tight">ELEVATE TO PRIME</h4>
                 <p className="text-[12px] text-blue-100 leading-relaxed mb-10 font-medium">Unlock hyper-intelligent AI coaching and elite-tier certifications.</p>
                 <button className="w-full bg-white text-blue-600 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-blue-50 shadow-xl transition-all">INITIATE UPGRADE</button>
              </div>
           </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
