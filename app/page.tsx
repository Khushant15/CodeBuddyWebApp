"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Zap, Trophy, Bug, BookOpen, Star, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function LandingPage() {
  const router = useRouter();
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.replace("/home");
    });
    return unsub;
  }, [router]);

  return (
    <div className="min-h-screen selection:bg-blue-500/20">
      {/* HERO */}
      <section className="container pt-24 pb-24 md:pt-32 md:pb-40 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="text-center max-w-5xl mx-auto layer-10"
        >
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-3xl mb-12 group cursor-default hover:border-white/10 transition-all shadow-inner"
           >
             <Sparkles className="w-4 h-4 text-blue-400" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-white transition-colors">Powered by Groq AI · Ultra-fast responses</span>
           </motion.div>

           <h1 className="leading-[1.1] mb-10 tracking-tight">
             <span className="block text-5xl md:text-8xl lg:text-[9.5rem] font-bold text-white uppercase">LEVEL UP</span>
             <span className="block text-5xl md:text-8xl lg:text-[9.5rem] font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase">YOUR CODE</span>
           </h1>

           <p className="text-lg md:text-2xl text-gray-500 max-w-3xl mx-auto mb-16 leading-relaxed font-light">
             The interactive coding platform where you learn by doing. 
             Earn <span className="text-white font-medium">XP</span>, crush challenges, and unlock your <span className="text-blue-400 font-medium">developer potential</span>.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
             <Link href="/signup" className="px-10 py-5 rounded-2xl bg-blue-500 text-white text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3">
               Start Coding Free <ArrowRight className="w-5 h-5" />
             </Link>
             <Link href="/learn" className="px-10 py-5 rounded-2xl border border-white/5 bg-white/[0.02] text-gray-400 text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all w-full sm:w-auto min-w-[240px] flex items-center justify-center gap-3">
               Explore Tracks <Code2 className="w-5 h-5" />
             </Link>
           </div>
         </motion.div>

         {/* Floating Terminal Decor */}
         <motion.div 
           initial={{ opacity: 0, y: 50 }} 
           animate={{ opacity: 1, y: 0 }} 
           transition={{ duration: 0.8, delay: 0.3 }} 
           className="mt-32 max-w-5xl mx-auto rounded-[32px] p-1 border border-white/5 bg-white/[0.01] shadow-2xl relative group layer-10"
         >
           <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="rounded-[30px] overflow-hidden bg-[#0B1120]/80 border border-white/5">
             <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-white/5" />
                 <div className="w-3 h-3 rounded-full bg-white/5" />
                 <div className="w-3 h-3 rounded-full bg-white/5" />
               </div>
               <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em]">codebuddy ~ python</span>
               <div className="w-12 h-1 bg-white/5 rounded-full" />
             </div>
             <div className="p-12 text-gray-500 font-mono text-[13px] leading-relaxed">
               <div className="flex gap-4"><span className="text-blue-500">{" $ "}</span> <span className="text-white">codebuddy init --user=developer</span></div>
               <div className="text-blue-500/40 mt-2 ml-10 italic">✓ Account created — welcome aboard</div>
               <div className="flex gap-4 mt-6"><span className="text-blue-500">{" $ "}</span> <span className="text-white">learn python --track=beginner</span></div>
               <div className="text-gray-600 mt-2 ml-10">✓ Loading 20 interactive lessons...</div>
               <div className="text-gray-600 ml-10">✓ AI assistant ready</div>
               <div className="flex gap-4 mt-8"><span className="text-blue-500">{" $ "}</span> <span className="w-2.5 h-5 bg-blue-500/50 animate-pulse inline-block" /></div>
             </div>
           </div>
         </motion.div>
       </section>

       {/* STATS BAR */}
       <section className="bg-white/[0.01] border-y border-white/5 py-32 relative layer-10">
         <div className="container mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
             {[
               { label: "Lessons", value: "50+", color: "text-white" },
               { label: "Challenges", value: "30+", color: "text-blue-500" },
               { label: "AI Powered", value: "Groq", color: "text-indigo-400" },
               { label: "Tracks", value: "3", color: "text-white" },
             ].map((s, i) => (
               <motion.div key={s.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                 <div className={`text-5xl font-bold ${s.color} mb-4 tracking-tighter tabular-nums text-glow-blue uppercase`}>{s.value}</div>
                 <div className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">{s.label}</div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>

       {/* FEATURES */}
       <section className="container py-40 relative layer-10">
         <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-32">
           <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Why CodeBuddy?</p>
           <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 uppercase tracking-tight leading-none">EVERYTHING YOU NEED TO <span className="text-blue-500">GO FROM ZERO</span></h2>
           <p className="text-gray-500 max-w-3xl mx-auto text-xl font-light leading-relaxed">— in one place. Engineered for rapid skill acquisition and industrial-level code optimization.</p>
         </motion.div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {features.map((f, i) => (
             <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
               <div className="p-12 rounded-[40px] h-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-blue-500/20 transition-all group">
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-white/5 group-hover:border-blue-500/30 transition-all ${f.iconBg} shadow-inner`}>
                   <f.icon className={`w-8 h-8 ${f.iconColor}`} />
                 </div>
                 <h3 className="text-xl font-bold tracking-tight text-white mb-6 uppercase transition-colors">{f.title}</h3>
                 <p className="text-[15px] text-gray-500 leading-relaxed font-light">{f.desc}</p>
               </div>
             </motion.div>
           ))}
         </div>
       </section>

       {/* CTA */}
       <section className="container pb-40 relative layer-10">
         <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
           <div className="p-20 md:p-32 rounded-[64px] text-center border border-white/5 bg-white/[0.01] relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-500/[0.02] opacity-50" />
             <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
             <div className="relative z-10">
               <Star className="w-16 h-16 mx-auto mb-10 text-blue-500" />
               <h2 className="text-4xl md:text-8xl font-bold text-white mb-10 tracking-tight uppercase leading-none text-glow-blue">READY TO <span className="text-blue-500">SHIP CODE?</span></h2>
               <p className="text-gray-500 max-w-3xl mx-auto mb-16 text-xl md:text-2xl font-light leading-relaxed">Join thousands of developers leveling up their skills with CodeBuddy's interactive platform.</p>
               <Link href="/signup" className="inline-flex px-16 py-6 rounded-2xl bg-blue-500 text-white text-[15px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/30">
                 Get Started Free <ArrowRight className="w-6 h-6 ml-4" />
               </Link>
             </div>
           </div>
         </motion.div>
       </section>
     </div>
   );
 }
 
 const features = [
   { title: "Interactive Lessons", desc: "Step-by-step tracks for Python, HTML, & CSS with real-time feedback and AI debugging layers.", icon: BookOpen, iconBg: "bg-white/3", iconColor: "text-blue-400" },
   { title: "Debug Challenges", desc: "Real-world debugging puzzles that sharpen your problem-solving skills and pattern recognition.", icon: Bug, iconBg: "bg-white/3", iconColor: "text-indigo-400" },
   { title: "XP & Achievements", desc: "Earn experience points, level up your profile, and unlock badges as you complete milestones.", icon: Trophy, iconBg: "bg-white/3", iconColor: "text-blue-500" },
   { title: "AI Coding Assistant", desc: "Powered by Groq's ultra-fast AI. Get explanations, code reviews, and debugging help instantly.", icon: Zap, iconBg: "bg-white/3", iconColor: "text-blue-400" },
   { title: "Learning Tracks", desc: "Structured paths from beginner to advanced. Follow Python, HTML, or CSS tracks at your own pace.", icon: Code2, iconBg: "bg-white/3", iconColor: "text-indigo-400" },
   { title: "Progress Dashboard", desc: "Visual analytics showing your streak, XP gain, weekly activity, and goal completion rates.", icon: Star, iconBg: "bg-white/3", iconColor: "text-blue-500" },
 ];
