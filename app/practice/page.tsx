// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\practice\page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Zap, Target, Trophy, ChevronRight, Lock, Code, Layout, Globe, Terminal, Hash, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { practiceAPI, progressAPI } from '@/lib/apiClient';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function PracticeArena() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterDiff, setFilterDiff] = useState('all');
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const [pRes, sRes] = await Promise.all([
            practiceAPI.getProblems(),
            progressAPI.getStats(u.uid)
          ]);
          setProblems(pRes.data.data || []);
          setSolvedIds(sRes.data.solvedProblems || []);
        } catch (err) {
          console.error("Failed to load practice data:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const topics = ['all', 'python', 'javascript', 'html', 'css', 'react', 'node', 'dsa'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Professional'];

  const filtered = problems.filter(p => 
    (filterTopic === 'all' || p.topic.toLowerCase() === filterTopic.toLowerCase()) &&
    (filterDiff === 'all' || p.difficulty.toLowerCase() === filterDiff.toLowerCase())
  );

  return (
    <AuthGuard>
      <div className="container py-12 pb-24">
        {/* Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 layer-10">
            <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
               <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-3">Tactical Environment</p>
               <h1 className="font-heading text-5xl md:text-6xl font-800 text-white tracking-tight uppercase leading-[1.1]">
                  REFINE YOUR <span className="text-blue-500">CRAFT</span>
               </h1>
               <p className="text-gray-500 max-w-md text-sm mt-6 font-light leading-relaxed">Synthesize world-class algorithms with real-time feedback loops and AI-powered architectural support.</p>
            </motion.div>
            
            <div className="flex items-center gap-4">
               <div className="glass-panel p-6 px-10 border-white/5 text-center bg-brand-bg-secondary/40 shadow-sm min-w-[160px]">
                  <div className="text-3xl font-heading font-800 text-blue-500">{solvedIds.length}</div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Decoded</div>
               </div>
               <div className="glass-panel p-6 px-10 border-white/5 text-center bg-brand-bg-secondary/40 shadow-sm min-w-[160px]">
                  <div className="text-3xl font-heading font-800 text-white">{problems.length}</div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Available</div>
               </div>
            </div>
         </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 mb-12 glass-panel p-2 border-white/5 layer-10 bg-brand-bg-secondary/40">
           <div className="flex-1 flex items-center px-6 gap-4 text-gray-600 group">
              <Search className="w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input type="text" placeholder="FILTER MODULES..." className="bg-transparent border-none focus:ring-0 text-[10px] font-bold tracking-widest w-full placeholder:text-gray-700 uppercase" />
           </div>
           <div className="h-8 w-[1px] bg-white/5 hidden md:block" />
           <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar">
              {topics.map(t => (
                <button key={t} onClick={() => setFilterTopic(t)} className={`px-5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.15em] transition-all ${filterTopic === t ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>
                  {t}
                </button>
              ))}
           </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[1,2,3,4,5,6].map(i => <div key={i} className="glass-panel h-48 border-white/5" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => {
                const isSolved = solvedIds.includes(p._id);
                return (
                  <motion.div key={p._id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                    <Link href={`/practice/${p._id}`} className="group">
                      <div className={`glass-panel p-8 h-full flex flex-col border-white/5 hover:border-blue-500/20 transition-all bg-brand-bg-secondary/40 relative ${isSolved ? 'border-emerald-500/20' : ''}`}>
                        <div className="flex items-center justify-between mb-6">
                           <div className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${p.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-400/10' : p.difficulty === 'Intermediate' ? 'text-blue-400 bg-blue-400/10' : 'text-indigo-400 bg-indigo-400/10'}`}>
                             {p.difficulty}
                           </div>
                           <div className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">{p.topic}</div>
                        </div>

                        <h3 className="font-heading text-lg font-700 text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{p.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-8 font-light">{p.desc}</p>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-5">
                              <span className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 tracking-widest uppercase">
                                <Zap className="w-3.5 h-3.5 text-blue-500" /> {p.xpReward} XP
                              </span>
                              {isSolved && (
                                <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400 tracking-widest uppercase">
                                  <CheckCircle className="w-3.5 h-3.5" /> DECODED
                                </span>
                              )}
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
