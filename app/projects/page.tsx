"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { FolderOpen, Lock, Clock, Trophy, ArrowRight, Code2, Globe, Palette, Loader2, Filter, Search } from "lucide-react";
import Link from "next/link";
import { projectsAPI } from "@/lib/apiClient";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('all');
  const [tech, setTech] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [difficulty, tech]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getAll(difficulty, tech);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const techs = ['all', 'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'Socket.io'];

  return (
    <AuthGuard>
      <div className="container py-20 pb-40 layer-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <p className="text-[11px] font-mono font-900 text-[var(--neon-green)] uppercase tracking-[0.4em] mb-4">Applied Engineering</p>
          <h1 className="font-heading text-4xl md:text-7xl font-900 text-white mb-6 uppercase tracking-tight leading-none">
            PROJECTS <span className="gradient-heading">ARCHIVE</span>
          </h1>
          <p className="text-white/40 text-[15px] max-w-2xl leading-relaxed font-light">
            Transmute theoretical knowledge into tangible infrastructure. Each project protocol initializes upon completion of requisite learning modules.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 mb-16 glass-panel p-2 rounded-2.5xl border-white/5">
           <div className="flex-1 flex items-center px-6 gap-4 text-white/20 group">
              <Search className="w-5 h-5 group-focus-within:text-[var(--neon-green)] transition-colors" />
              <input type="text" placeholder="INITIALIZE SCAN..." className="bg-transparent border-none focus:ring-0 text-xs font-heading font-800 tracking-widest w-full placeholder:text-white/10 uppercase" />
           </div>
           <div className="h-8 w-[1px] bg-white/5 hidden md:block" />
           <div className="flex gap-3 p-1 overflow-x-auto no-scrollbar">
              {difficulties.map(d => (
                <button 
                  key={d} 
                  onClick={() => setDifficulty(d)} 
                  className={`px-6 py-2.5 rounded-2xl text-[9px] font-heading font-900 uppercase tracking-[0.2em] transition-all duration-500 ${difficulty === d ? 'bg-white/10 text-white border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-white/20 hover:text-white/40'}`}
                >
                  {d}
                </button>
              ))}
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[var(--neon-green)] animate-spin mb-4" />
            <p className="text-xs font-mono text-white/20 uppercase tracking-widest">Accessing Neural Database...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {projects.map((p, i) => (
                <motion.div key={p._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/projects/${p._id}`} className="group h-full">
                    <div className={`glass-card p-8 h-full flex flex-col border-white/5 hover:border-[var(--neon-green)]/30 transition-all duration-500 relative overflow-hidden`}>
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--neon-green)]/5 blur-[50px] rounded-full group-hover:bg-[var(--neon-green)]/10 transition-all duration-700" />
                      
                      <div className="flex items-start gap-5 mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/5 group-hover:border-[var(--neon-green)]/40 transition-colors`}>
                          <Code2 className={`w-6 h-6 text-white/30 group-hover:text-[var(--neon-green)] transition-colors`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-heading font-900 uppercase tracking-widest ${p.difficulty === 'Beginner' ? 'text-[var(--neon-green)] bg-[var(--neon-green)]/10' : p.difficulty === 'Intermediate' ? 'text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10' : 'text-[var(--neon-violet)] bg-[var(--neon-violet)]/10'}`}>{p.difficulty}</span>
                            <span className="px-3 py-1 rounded-full text-[9px] font-heading font-900 uppercase tracking-widest bg-white/5 text-white/40">{p.techStack[0]}</span>
                          </div>
                          <h3 className="text-xl font-heading font-800 tracking-tight text-white uppercase group-hover:text-[var(--neon-green)] transition-colors truncate">{p.title}</h3>
                        </div>
                      </div>

                      <p className="text-[13px] text-white/40 leading-relaxed mb-8 flex-1 font-light line-clamp-2">{p.description}</p>

                      <div className="mb-8">
                        <p className="text-[9px] font-heading font-900 text-white/20 uppercase tracking-[0.3em] mb-4">Core Outcomes</p>
                        <div className="flex flex-wrap gap-2">
                          {p.learningOutcomes.slice(0, 3).map((s: string) => (
                            <span key={s} className="text-[9px] font-mono px-3 py-1 rounded-full bg-white/5 text-white/30 truncate max-w-full">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                        <div className="flex items-center gap-6 text-[10px] font-heading font-900 text-white/30 uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{p.estimatedTime}</span>
                          <span className="flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-[var(--neon-yellow)]" />+{p.xpReward} XP</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-[var(--neon-green)] group-hover:border-[var(--neon-green)]/30 group-hover:bg-[var(--neon-green)]/10 transition-all duration-500 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                           <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
