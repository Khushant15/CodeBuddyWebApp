"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuthGuard } from "@/components/AuthGuard";
import {
  BookOpen, Bug, FolderOpen, Map, BarChart3, MessageCircle,
  Trophy, Flame, Target, Clock, ArrowRight, Zap, Code2
} from "lucide-react";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { AIChat } from "@/components/AIChat";
import { getOrCreateUserProfile, updateStreak, xpToLevel, type UserProfile } from "@/lib/userService";
import { trackSessionStart } from "@/lib/analytics";

export default function HomePage() {
  const [userName, setUserName] = useState("Developer");
  const [showChat, setShowChat] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUserName(u.displayName || u.email?.split("@")[0] || "Developer");
        await updateStreak(u.uid);
        const p = await getOrCreateUserProfile(u.uid, u.email || "", u.displayName || "Developer");
        setProfile(p);
        trackSessionStart(u.uid);
      }
    });
    return unsub;
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <AuthGuard>
      <div className="container py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">{greeting}</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                WELCOME BACK, <span className="text-blue-500">{userName}</span>
              </h1>
              <p className="text-gray-500 mt-6 text-[15px] font-light max-w-xl">Continue your architectural journey towards master status.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/[0.02] border border-white/5 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{profile?.streak ?? 0} DAY STREAK</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{profile?.xp ?? 0} XP · LV.{xpToLevel(profile?.xp ?? 0)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 relative layer-10">
          {stats.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <div className="p-8 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/5 ${s.iconBg}`}>
                  <s.icon className={`w-6 h-6 ${s.iconColor}`} />
                </div>
                <div className="text-3xl font-bold text-white tracking-tighter tabular-nums">{s.value}</div>
                <div className="text-[10px] text-gray-700 mt-2 font-bold uppercase tracking-[0.3em]">{s.title}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-20 layer-10">
          <h2 className="text-[10px] font-bold tracking-[0.4em] text-gray-800 mb-8 uppercase">Operational Core</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((a, i) => (
              <motion.div key={a.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                {a.href === "#ai" ? (
                  <button onClick={() => setShowChat(true)} className="w-full text-left group h-full">
                    <div className="p-10 rounded-[40px] h-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-blue-500/20 transition-all flex flex-col justify-between">
                      <div className="flex items-start gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5 ${a.iconBg}`}>
                          <a.icon className={`w-6 h-6 ${a.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors uppercase">{a.title}</h3>
                          <p className="text-[13px] text-gray-500 mt-3 leading-relaxed font-light">{a.desc}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 mt-10 text-[10px] font-bold uppercase tracking-[0.2em] ${a.linkColor} group-hover:translate-x-1 transition-transform`}>
                        Execute Protocol <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <Link href={a.href} className="group h-full block">
                    <div className="p-10 rounded-[40px] h-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-blue-500/20 transition-all flex flex-col justify-between">
                      <div className="flex items-start gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5 ${a.iconBg}`}>
                          <a.icon className={`w-6 h-6 ${a.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors uppercase">{a.title}</h3>
                          <p className="text-[13px] text-gray-500 mt-3 leading-relaxed font-light">{a.desc}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        {a.progress !== undefined && (
                          <div className="mt-10">
                            <div className="flex justify-between text-[9px] font-bold text-gray-800 mb-2 tracking-[0.2em] uppercase">
                              <span>Architect status</span>
                              <span className="text-blue-400">{a.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${a.progress}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-2 mt-10 text-[10px] font-bold uppercase tracking-[0.2em] ${a.linkColor} group-hover:translate-x-1 transition-transform`}>
                        {a.progress === 0 ? "Initialize" : "Resume Status"} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA cards row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-2 gap-8 mb-24 layer-10">
          {/* Daily challenge */}
          <div className="p-12 rounded-[48px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-all" />
            <div className="flex items-center gap-4 mb-8">
              <Zap className="w-6 h-6 text-blue-500" />
              <span className="text-[10px] font-bold tracking-[0.4em] text-gray-800 uppercase">Tactical Resolution</span>
            </div>
            <p className="text-base text-gray-500 mb-12 leading-relaxed font-light max-w-sm">Synthesize complex logic through daily algorithmic loops. Maintain your status streak to unlock elite rewards.</p>
            <div className="flex gap-6 flex-wrap relative z-10">
              <Link href="/practice" className="px-8 py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3">
                Initialize Entry <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/dashboard" className="px-8 py-4 rounded-xl border border-white/5 text-gray-400 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Analytics</Link>
            </div>
          </div>

        {/* AI assistant */}
          <div className="p-12 rounded-[48px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all" />
            <div className="flex items-center gap-4 mb-8">
              <MessageCircle className="w-6 h-6 text-indigo-400" />
              <span className="text-[10px] font-bold tracking-[0.4em] text-gray-800 uppercase">Neural Intelligence</span>
            </div>
            <p className="text-base text-gray-500 mb-12 leading-relaxed font-light max-w-sm">Stuck in an architectural loop? Access real-time high-level insights from the CodeBuddy Core AI.</p>
            <button onClick={() => setShowChat(true)} className="px-8 py-4 rounded-xl bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-3 relative z-10">
              Query Core AI <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* External Resources */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-24">
          <div className="p-12 rounded-[48px] border border-white/5 bg-blue-500/[0.02] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                     <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.4em] text-gray-800 uppercase">Elite Preparation</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">Master the <span className="text-blue-500">Interview</span></h2>
                <p className="text-gray-500 text-sm leading-relaxed font-light mb-10">
                  Ready to secure your position? Accelerate your career growth with PrepBuddy, our curated portal for high-level interview synthesis and technical preparation.
                </p>
                <Link href="https://prepbuddy-sooty.vercel.app/" target="_blank" className="btn-primary inline-flex px-10 py-4 text-[11px] uppercase tracking-[0.2em] font-bold shadow-2xl shadow-blue-500/20">
                  Access PrepBuddy <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="w-full max-w-sm h-64 rounded-[40px] bg-white/[0.01] border border-white/5 flex items-center justify-center overflow-hidden relative group-hover:border-blue-500/10 transition-all">
                <Code2 className="w-20 h-20 text-blue-500/20 group-hover:text-blue-500/40 transition-all" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Chat modal */}
        {showChat && <AIChat onClose={() => setShowChat(false)} />}
      </div>
    </AuthGuard>
  );
}

const stats = [
  { title: "Day Streak",     value: "0",  icon: Flame,    iconBg: "bg-white/5", iconColor: "text-orange-400" },
  { title: "Total Synth",    value: "0",  icon: Trophy,   iconBg: "bg-white/5", iconColor: "text-blue-500"   },
  { title: "Sync Progress",  value: "0%", icon: Target,   iconBg: "bg-white/5", iconColor: "text-indigo-400"  },
  { title: "Total Uptime",   value: "0h", icon: Clock,    iconBg: "bg-white/5", iconColor: "text-blue-400" },
];

const quickActions = [
  { title: "Learning",       desc: "Python, HTML, CSS interactive modules",    icon: BookOpen,     href: "/learn",     iconBg: "bg-blue-500/10",   iconColor: "text-blue-400",   linkColor: "text-blue-500",   progress: 0 },
  { title: "Practice Lab",   desc: "Solve industrial debugging challenges",       icon: Bug,          href: "/practice",  iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400", linkColor: "text-indigo-500", progress: 0 },
  { title: "Projects",       desc: "Build professional SaaS applications",      icon: FolderOpen,   href: "/projects",  iconBg: "bg-blue-500/10",   iconColor: "text-blue-400",   linkColor: "text-blue-500",   progress: 0 },
  { title: "Pathways",       desc: "Follow structured career learning paths",   icon: Map,          href: "/roadmap",   iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400", linkColor: "text-indigo-500" },
  { title: "Insights",       desc: "View detailed growth & achievements",       icon: BarChart3,    href: "/dashboard", iconBg: "bg-blue-500/10",   iconColor: "text-blue-400",   linkColor: "text-blue-500" },
  { title: "Assistant",      desc: "Get instant AI architectural guidance",     icon: MessageCircle,href: "#ai",         iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400", linkColor: "text-indigo-500"   },
];
