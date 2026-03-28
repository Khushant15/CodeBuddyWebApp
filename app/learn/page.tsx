"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code, Globe, Palette, ArrowRight, Clock, Lock, BookOpen, Zap, Database, CheckCircle, Terminal, Layout, Layers, Hash } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { progressAPI, lessonsAPI } from "@/lib/apiClient";
import { TracksGrid } from "@/components/TracksGrid";

export default function LearnPage() {
  const [stats, setStats] = useState<any>(null);
  const [tracksProgress, setTracksProgress] = useState<any>({});
  const [trackTotals, setTrackTotals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const [progRes, countsRes] = await Promise.all([
            progressAPI.getStats(u.uid),
            lessonsAPI.getCounts()
          ]);
          setStats(progRes.data);
          setTrackTotals(countsRes.data);
          
          // Basic progress mapping
          const prog: any = {};
          const allTracks = ['python', 'html', 'css', 'javascript', 'react', 'node', 'dsa'];
          for (const t of allTracks) {
             const done = progRes.data.completedLessons?.filter((l: string) => l.startsWith(t)).length || 0;
             prog[t] = done;
          }
          setTracksProgress(prog);
        } catch (err) {
          console.error("Failed to fetch learn stats:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const sysStats = [
    { label: "Lessons Done", value: stats?.completedLessons?.length || "0", color: "text-white" },
    { label: "Active Tracks", value: "7", color: "text-blue-500" },
    { label: "Total XP", value: stats?.xp || "0", color: "text-indigo-400" },
    { label: "Streak", value: (stats?.streak || "0") + "d", color: "text-white" },
  ];

  return (
    <AuthGuard>
    <div className="container py-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-2">Learning System</p>
        <h1 className="font-heading text-3xl md:text-5xl font-800 text-white mb-4 uppercase tracking-tight">
          LEARN TO <span className="text-blue-500">CODE</span>
        </h1>
        <p className="text-slate-500 max-w-xl text-sm leading-relaxed font-light">
          A structures, multi-track curriculum engineered for modern software engineering. From foundational logic to professional SaaS mastery.
        </p>
      </motion.div>

      {/* Stats Dashboard */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {sysStats.map((s, i) => (
          <div key={s.label} className="p-6 rounded-xl bg-[#0f172a] border border-slate-700 hover:border-blue-500/20 transition-all duration-300">
            <div className={`text-2xl font-heading font-800 ${s.color}`}>{s.value}</div>
            <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Tracks Section */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">AVAILABLE TRACKS</h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Ecosystem Live
          </div>
        </div>
        
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-[#0f172a] border border-slate-700 animate-pulse" />
              ))}
           </div>
        ) : (
          <TracksGrid tracksProgress={tracksProgress} trackTotals={trackTotals} />
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="glass-panel p-10 text-center relative overflow-hidden bg-brand-bg-secondary/40 border-white/5">
          <BookOpen className="w-10 h-10 mx-auto mb-6 text-blue-500/40" />
          <h3 className="font-heading text-2xl font-800 tracking-tight text-white mb-3 uppercase">INDUSTRIAL CURRICULUM</h3>
          <p className="text-sm text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed font-light">Every track contains interactive architecture, live code examples, and technical assessments that automatically track your progress on the roadmap.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/roadmap" className="btn-primary px-8 py-3 text-[11px]">View Roadmap</Link>
            <Link href="/practice" className="btn-secondary px-8 py-3 text-[11px]">Practice Arena</Link>
          </div>
        </div>
      </motion.div>
    </div>
    </AuthGuard>
  );
}
