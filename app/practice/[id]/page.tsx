// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\practice\[id]\page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { practiceAPI } from "@/lib/apiClient";
import { ProblemSolver } from "@/components/ProblemSolver";

export default function ProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        try {
          const res = await practiceAPI.getOne(id);
          setProblem(res.data);
        } catch (err) {
          console.error("Failed to fetch problem:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-bg font-bold text-gray-800 animate-pulse text-[10px] tracking-[0.3em] uppercase">Initializing Architectural Grid...</div>;
  if (!problem) return <div className="min-h-screen bg-brand-bg flex items-center justify-center text-white font-bold uppercase tracking-widest">Module Not Found</div>;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-bg">
        <header className="py-4 px-8 border-b border-white/5 flex items-center gap-6 bg-brand-bg/80 backdrop-blur-2xl sticky top-0 z-50">
           <Link href="/practice" className="p-2 -ml-2 text-gray-600 hover:text-white transition-all bg-white/5 rounded-lg border border-white/5">
              <ChevronLeft className="w-5 h-5" />
           </Link>
           <div>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-0.5">{problem.topic} Environment</p>
              <h1 className="text-sm font-bold text-white uppercase tracking-tight">{problem.title}</h1>
           </div>
           <div className="ml-auto flex items-center gap-4">
              <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-lg text-[10px] font-bold text-blue-400 uppercase tracking-widest hidden sm:block">⚡ {problem.xpReward} XP Reward</div>
           </div>
        </header>

        <div className="p-6 h-[calc(100vh-68px)]">
           <ProblemSolver problem={problem} uid={uid} onSuccess={() => {}} />
        </div>
      </div>
    </AuthGuard>
  );
}
