// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\roadmap\page.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { roadmapAPI } from "@/lib/apiClient";
import { RoadmapTree } from "@/components/RoadmapTree";

export default function RoadmapPage() {
  const [roadmapData, setRoadmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const res = await roadmapAPI.getProgress(u.uid);
          setRoadmapData(res.data);
        } catch (err) {
          console.error("Failed to fetch roadmap data:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthGuard>
      <div className="container py-20 pb-40">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Strategic Mapping</p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight leading-none">
            ARCHITECT YOUR <span className="text-blue-500">EXPERTISE</span>
          </h1>
          <p className="text-gray-500 text-[15px] max-w-2xl leading-relaxed font-light">
            A dynamic intelligence grid mapping your current proficiency across all technical sectors. Resolve core modules to unlock advanced operational status.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full bg-blue-500" />
            </div>
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.4em] animate-pulse">Synchronizing Neural Path...</p>
          </div>
        ) : (
          <div className="space-y-32">
            {roadmapData.map((topicData) => (
              <RoadmapTree key={topicData.topic} data={topicData} />
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-32">
          <div className="p-12 text-center rounded-3xl border border-white/5 bg-white/[0.01] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
            <Zap className="w-12 h-12 mx-auto mb-8 text-blue-500 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">CONTINUE YOUR PATH</h3>
            <p className="text-sm text-gray-500 mb-12 max-w-lg mx-auto font-light leading-relaxed">System parameters indicate continuous activity yields maximum retention. Advance to the high-level intelligence center to continue.</p>
            <Link href="/learn" className="inline-flex px-10 py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10">Return to Modules Center</Link>
          </div>
        </motion.div>
      </div>
    </AuthGuard>
  );
}
