// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\tests\page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, ArrowRight, Lock, CheckCircle, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { testsAPI, progressAPI } from '@/lib/apiClient';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export default function TestsHub() {
  const [tests, setTests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const [tRes, pRes] = await Promise.all([
            testsAPI.getAll(),
            progressAPI.getStats(u.uid)
          ]);
          setTests(tRes.data.data || []);
          setStats(pRes.data);
        } catch (err) {
          console.error("Failed to load tests:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const getStatus = (testSlug: string) => {
    if (!stats?.testScores) return 'Available';
    const score = stats.testScores[testSlug];
    if (score !== undefined) return score >= 70 ? 'Passed' : 'Try Again';
    return 'Available';
  };

  return (
    <AuthGuard>
      <div className="container py-20 pb-32">
        <header className="mb-20">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Exam Center</p>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase leading-none">
                 SKILL <span className="text-blue-500">CERTIFICATES</span>
              </h1>
              <p className="text-gray-500 max-w-sm text-lg mt-6 font-light leading-relaxed">Validate your coding knowledge and earn industry-recognized certifications.</p>
           </motion.div>
        </header>

        <div className="grid lg:grid-cols-[1fr,350px] gap-16">
          <div className="space-y-8">
            {tests.length === 0 ? (
              <div className="p-20 rounded-[40px] border border-white/5 bg-white/[0.01] text-center text-gray-800 font-bold text-[10px] tracking-[0.4em] uppercase">No exams currently available</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {tests.map((test, i) => {
                  const status = getStatus(test.slug);
                  const isPassed = status === 'Passed';
                  return (
                    <motion.div key={test.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                       <Link href={`/tests/${test.slug}`}>
                          <div className={`p-8 rounded-[40px] border transition-all group h-full flex flex-col ${isPassed ? 'border-green-500/20 bg-green-500/[0.02]' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]'}`}>
                             <div className="flex items-center justify-between mb-8">
                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${test.difficulty === 'Beginner' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>{test.difficulty}</span>
                                <span className="text-[9px] font-bold text-gray-800 uppercase tracking-[0.3em]">{test.topic}</span>
                             </div>
                             
                             <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight group-hover:text-blue-500 transition-colors">{test.title}</h3>
                             <div className="flex items-center gap-6 text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em] mb-10 mt-auto pt-8 border-t border-white/5">
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-900" /> {test.duration / 60}m</span>
                                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500/40" /> +{test.xpReward} XP</span>
                             </div>

                             <div className={`w-full flex items-center justify-center py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl ${isPassed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/10'}`}>
                                {isPassed ? 'Passed' : status === 'Available' ? 'Start Exam' : 'Retake Exam'}
                             </div>
                          </div>
                       </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          <aside className="space-y-8">
             <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center mb-8 text-blue-500">
                   <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-[10px] font-bold text-gray-700 mb-4 uppercase tracking-[0.4em]">Why Certify?</h3>
                <p className="text-[13px] leading-relaxed text-gray-500 font-light">Certifications help you showcase your skills to employers and validate your technical mastery of the platform material.</p>
             </div>
             
             <div className="p-10 rounded-[40px] border border-green-500/20 bg-green-500/[0.02]">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/10 flex items-center justify-center mb-8 text-green-500">
                   <Award className="w-6 h-6" />
                </div>
                <h4 className="text-[10px] font-bold text-gray-700 mb-2 uppercase tracking-[0.4em]">PASSED EXAMS</h4>
                <div className="text-5xl font-bold text-white mb-2">{Object.values(stats?.testScores || {}).filter((s:any) => s >= 70).length}</div>
                <p className="text-[9px] font-bold text-green-500/60 uppercase tracking-[0.3em]">Verified Badges</p>
             </div>
          </aside>
        </div>
      </div>
    </AuthGuard>
  );
}
