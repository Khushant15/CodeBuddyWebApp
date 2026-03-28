"use client";
import { motion } from "framer-motion";
import { Users, Target, Code2, Zap, Globe, Star, ShieldCheck, Activity, Cpu, Network, Mail, MapPin, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container py-20 pb-40 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mb-32 text-center max-w-5xl mx-auto relative z-10"
      >
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-mono font-900 text-blue-500 uppercase tracking-widest mb-8">
           <Cpu className="w-3.5 h-3.5" /> Core Protocol: About Us
        </div>
        <h1 className="text-5xl md:text-8xl font-heading font-900 text-white mb-10 uppercase tracking-tighter leading-none">
          ABOUT <span className="gradient-text">CODEBUDDY</span>
        </h1>
        <p className="text-white/40 text-lg md:text-2xl leading-relaxed font-light italic max-w-4xl mx-auto">
          CodeBuddy is an interactive learning platform designed to make coding interactive, fun, and effective. Whether you&apos;re a beginner or experienced developer, CodeBuddy helps you improve through real projects, debugging challenges, and a supportive developer community.
        </p>
      </motion.div>

      {/* Mission + Vision Nodes */}
      <div className="grid lg:grid-cols-2 gap-10 mb-32 relative z-10">
        {[
          { title: "OUR MISSION", icon: Target, text: "To empower developers worldwide by providing an engaging and practical learning experience that builds both knowledge and confidence in coding.", color: "blue" },
          { title: "OUR VISION", icon: Globe, text: "To create a global community of developers who continuously learn, collaborate, and achieve their programming goals in a fun and rewarding way.", color: "indigo" },
        ].map((item, i) => (
          <motion.div 
            key={item.title} 
            initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-panel p-16 rounded-[48px] border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all h-full group relative overflow-hidden text-center sm:text-left">
               <div className={`absolute top-0 right-0 w-48 h-48 bg-${item.color}-500/5 blur-[80px] rounded-full group-hover:bg-${item.color}-500/10 transition-all duration-700 pointer-events-none`} />
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 border border-white/5 bg-white/5 mx-auto sm:mx-0">
                <item.icon className="w-7 h-7 text-white/40 group-hover:text-blue-400 transition-colors" />
              </div>
              <h3 className="text-[12px] font-heading font-900 tracking-[0.4em] mb-8 uppercase text-white/20">{item.title}</h3>
              <p className="text-white/60 text-lg leading-relaxed font-light italic">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Industrial Differentiators */}
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        className="mb-32 relative z-10"
      >
        <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-900 tracking-tight text-white uppercase">
              WHAT MAKES <span className="gradient-text">US DIFFERENT</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600/30 rounded-full mt-6" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentiators.map((d, i) => (
            <motion.div 
              key={d.title} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }} 
              viewport={{ once: true }}
            >
              <div className="glass-panel p-10 rounded-[32px] border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all h-full group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/5 bg-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <d.icon className="w-6 h-6 text-white/20 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-[14px] font-heading font-900 tracking-tight text-white mb-4 uppercase group-hover:text-blue-400 transition-colors">{d.title}</h4>
                <p className="text-[13px] text-white/30 leading-relaxed font-light italic">{d.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Creator Profile Nodes */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }}
      >
        <div className="glass-panel p-16 rounded-[64px] border-white/5 bg-white/[0.01] max-w-4xl mx-auto relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-all duration-700 pointer-events-none" />
          
          <div className="grid md:grid-cols-12 gap-12 items-center relative z-10">
            <div className="md:col-span-4 flex justify-center md:justify-start">
                <div className="w-44 h-44 rounded-[56px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-blue-500/40 transition-all duration-500">
                    <Sparkles className="w-16 h-16 text-blue-500/30 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent pointer-events-none" />
                </div>
            </div>
            
            <div className="md:col-span-8 space-y-7">
                <div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono font-900 text-blue-500 uppercase tracking-[0.3em] mb-4">
                      <ShieldCheck className="w-3 h-3" /> Built by a Developer
                   </div>
                   <h3 className="text-4xl font-heading font-900 text-white uppercase tracking-tight">Khushant Sharma</h3>
                   <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest mt-2">
                       <MapPin className="w-3.5 h-3.5" /> Mumbai, India
                   </div>
                </div>
                
                <p className="text-white/40 text-[16px] leading-relaxed font-light italic">
                    Full-stack developer passionate about making coding education accessible and engaging for everyone.
                </p>
                
                <div className="flex flex-wrap gap-4">
                    <a href="mailto:khushantsharma766@gmail.com" className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group/link shadow-sm">
                        <Mail className="w-4.5 h-4.5 text-white/20 group-hover/link:text-blue-400" />
                        <span className="text-[12px] font-heading font-900 text-white/40 uppercase tracking-widest group-hover/link:text-white">khushantsharma766@gmail.com</span>
                    </a>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const differentiators = [
  { title: "Interactive Learning", desc: "XP, streaks, and achievements make every lesson rewarding and motivating.", icon: Star },
  { title: "AI-Powered Help", desc: "Groq-powered AI assistant gives instant, context-aware coding help.", icon: Zap },
  { title: "Real Challenges", desc: "Debug actual code bugs, not toy examples — just like on the job.", icon: Code2 },
  { title: "Progress Tracking", desc: "Detailed analytics on your learning habits, streaks, and achievements.", icon: Activity },
  { title: "Structured Paths", desc: "Carefully curated tracks from beginner to advanced — no guesswork.", icon: Network },
  { title: "Community First", desc: "Built for and by developers. Open feedback loop and continuous improvement.", icon: Users },
];
