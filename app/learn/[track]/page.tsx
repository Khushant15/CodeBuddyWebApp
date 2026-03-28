// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\learn\[track]\page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { BookOpen, Clock, Trophy, ChevronRight, Play, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { lessonsAPI, progressAPI } from "@/lib/apiClient";

export default function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track } = use(params);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const [lRes, pRes] = await Promise.all([
            lessonsAPI.getAll(track),
            progressAPI.getStats(u.uid)
          ]);
          setLessons(lRes.data.data || []);
          setCompletedIds(pRes.data.completedLessons || []);
        } catch (err) {
          console.error("Failed to fetch track data:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [track]);

  const chapters = Array.from(new Set(lessons.map(l => l.chapter)));

  return (
    <AuthGuard>
      <div className="container py-12">
        <div className="flex items-center gap-4 mb-10">
           <Link href="/learn" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 transition-all border border-white/5">
              <ArrowLeft className="w-5 h-5" />
           </Link>
           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Learning Track</p>
              <h1 className="font-heading text-3xl md:text-4xl font-800 text-white uppercase tracking-tight">
                {track} <span className="text-blue-500">CURRICULUM</span>
              </h1>
           </motion.div>
        </div>

        <div className="grid lg:grid-cols-[1fr,360px] gap-12">
          <div className="space-y-16 layer-10">
            {chapters.map((chapterName, ci) => (
              <motion.div key={chapterName} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }} viewport={{ once: true }}>
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-[11px] font-bold text-blue-400 border border-blue-500/20">
                      {(ci + 1).toString().padStart(2, '0')}
                   </div>
                   <h2 className="font-heading text-xl font-800 text-white tracking-tight uppercase">{chapterName}</h2>
                </div>

                <div className="grid gap-4">
                  {lessons.filter(l => l.chapter === chapterName).map((lesson, li) => {
                    const isDone = completedIds.includes(lesson.slug);
                    
                    // Progressive Lock Logic
                    const chapterLessons = lessons.filter(l => l.chapter === chapterName);
                    // Global index check to account for across-chapter dependencies
                    const globalIndex = lessons.findIndex(l => l.slug === lesson.slug);
                    const isLocked = globalIndex > 0 && !completedIds.includes(lessons[globalIndex - 1].slug);

                    return (
                      <div key={lesson.slug} className="relative">
                        <Link 
                          href={isLocked ? "#" : `/learn/${track}/${lesson.slug}`}
                          className={isLocked ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"}
                        >
                          <div className={`glass-panel p-6 group transition-all border-white/5 bg-brand-bg-secondary/40 
                            ${isDone ? 'border-emerald-500/20' : isLocked ? 'opacity-30 grayscale-[0.5]' : 'hover:border-blue-500/30'} 
                            relative overflow-hidden`}>
                            
                            {isLocked && (
                              <div className="absolute top-0 right-0 p-2 bg-white/5 rounded-bl-xl border-b border-l border-white/5 flex items-center gap-2">
                                <Lock className="w-3 h-3 text-gray-600" />
                                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Locked</span>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 
                                  ${isDone ? 'bg-emerald-500/10 border-emerald-500/20' : 
                                    isLocked ? 'bg-white/5 border-white/5' : 
                                    'bg-blue-500/5 border-blue-500/10 group-hover:bg-blue-500/10'}`}>
                                    {isDone ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : 
                                     isLocked ? <Lock className="w-4 h-4 text-gray-800" /> :
                                     <Play className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />}
                                 </div>
                                 <div className={isLocked ? 'blur-[0.5px]' : ''}>
                                    <h3 className={`text-[15px] font-bold tracking-tight transition-all uppercase 
                                      ${isDone ? 'text-gray-500' : isLocked ? 'text-gray-700' : 'text-white'}`}>
                                      {lesson.title}
                                    </h3>
                                    <div className="flex items-center gap-6 mt-1.5 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                       <span className="flex items-center gap-2">
                                          <Clock className="w-3.5 h-3.5" /> 
                                          {lesson.metadata?.estimatedTime || '15 min'}
                                       </span>
                                       <span className="flex items-center gap-2 text-blue-500/60">
                                          <Trophy className="w-3.5 h-3.5" /> 
                                          +{lesson.xpReward} XP
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              {!isLocked && <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

           {/* Stats Sidebar */}
          <aside className="space-y-8 layer-10">
             <div className="glass-panel p-8 border-white/5 bg-brand-bg-secondary/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-all duration-700" />
                <h3 className="text-[10px] font-bold text-gray-600 mb-8 uppercase tracking-[0.3em]">Track Progress</h3>
                <div className="space-y-10">
                   <div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-3 uppercase tracking-widest">
                         <span>COMPLETION</span>
                         <span className="text-blue-500">{Math.round((completedIds.length / lessons.length) * 100 || 0)}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                          className="h-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.2)]" 
                          initial={{ width: 0 }}
                          animate={{ width: `${(completedIds.length / lessons.length) * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                         />
                      </div>
                   </div>
                   <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/5">
                      <div className="flex flex-col gap-1.5">
                         <div className="text-3xl font-heading font-800 text-white leading-none">{completedIds.length}</div>
                         <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Completed</div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                         <div className="text-3xl font-heading font-800 text-gray-800 leading-none">{lessons.length}</div>
                         <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Total Units</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 bg-blue-500/5 border-blue-500/10 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/10">
                   <BookOpen className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-[10px] font-bold text-white mb-3 uppercase tracking-widest">Pro Tip</h3>
                <p className="text-xs leading-relaxed text-gray-500 font-light">Complete lessons to earn XP and unlock the next module. 100% completion reveals a <span className="text-blue-400 font-medium">Mastery Certificate</span>.</p>
             </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
