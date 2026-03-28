// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\components\TestExam.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Trophy, ArrowRight, ChevronRight, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { progressAPI } from '@/lib/apiClient';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface TestExamProps {
  test: any;
  uid: string | null;
  onComplete: (score: number, passed: boolean) => void;
}

export const TestExam: React.FC<TestExamProps> = ({ test, uid, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(test.duration || 600);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!submitted) handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setLoading(true);
    clearInterval(timerRef.current);
    
    let correct = 0;
    test.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctIndex) correct++;
    });

    const scorePercent = Math.round((correct / test.questions.length) * 100);
    const passed = scorePercent >= test.passingScore;

    if (uid) {
      try {
        await progressAPI.saveTest({
          firebaseUID: uid,
          testSlug: test.slug,
          score: scorePercent,
          xpReward: passed ? test.xpReward : 0
        });
      } catch (err) {
        console.error("Failed to save test result:", err);
      }
    }

    setSubmitted(true);
    setLoading(false);
    onComplete(scorePercent, passed);
  };

  if (submitted) {
    let correct = 0;
    test.questions.forEach((q: any, i: number) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / test.questions.length) * 100);
    const passed = score >= test.passingScore;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto py-24 text-center">
         <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl ${passed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            <Trophy className="w-10 h-10" />
         </div>
         <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">{passed ? 'MODULE_SYNTHESIS_COMPLETE' : 'ASSESSMENT_FINALIZED'}</h2>
         <p className="text-gray-700 mb-12 font-bold uppercase tracking-[0.4em] text-[11px]">Proficiency: <span className={passed ? 'text-green-500' : 'text-red-500'}>{score}%</span> (Threshold: {test.passingScore}%)</p>
         
         <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] text-left mb-12 shadow-2xl">
            <h3 className="text-[10px] font-bold text-gray-800 mb-6 uppercase tracking-[0.4em]">Logic Grid Summary</h3>
            <div className="space-y-4">
               {test.questions.map((q: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-white/[0.02] pb-3 last:border-0 last:pb-0">
                     <span className="text-gray-500 font-light lowercase truncate max-w-[80%]">Node_{i+1}: {q.question.substring(0, 50)}...</span>
                     {answers[i] === q.correctIndex ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
               ))}
            </div>
         </div>

         <div className="flex gap-6 justify-center">
            <button onClick={() => window.location.href = '/roadmap'} className="px-10 py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3">
               Sector Navigation <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </motion.div>
    );
  }

  const q = test.questions[currentIdx];

  return (
    <div className="max-w-5xl mx-auto flex flex-col pt-6 md:pt-12 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 md:mb-16">
         <div>
            <p className="text-[9px] md:text-[10px] font-bold text-blue-500 uppercase tracking-[0.5em] mb-2 md:mb-4">{test.topic} Certification Unit</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">{test.title}</h2>
         </div>
         <div className={`p-4 md:p-6 px-8 md:px-10 rounded-2xl md:rounded-[32px] border flex items-center gap-4 md:gap-5 transition-all ${timeLeft < 60 ? 'border-red-500/30 bg-red-500/5 animate-pulse' : 'border-white/5 bg-white/[0.01]'}`}>
            <Clock className={`w-5 h-5 md:w-6 md:h-6 ${timeLeft < 60 ? 'text-red-500' : 'text-gray-900'}`} />
            <span className={`text-2xl md:text-3xl font-bold tabular-nums tracking-tight ${timeLeft < 60 ? 'text-red-500' : 'text-white'}`}>{formatTime(timeLeft)}</span>
         </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-[1fr,320px] gap-8 md:gap-12 pb-20">
         <div className="flex flex-col">
            <AnimatePresence mode="wait">
               <motion.div key={currentIdx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex-1">
                  <div className="p-12 rounded-[48px] border border-white/5 bg-white/[0.01] h-full shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/[0.02] blur-[80px] rounded-full" />
                     <div className="flex flex-col gap-10 relative z-10">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-500">0{currentIdx + 1}</div>
                           <h3 className="text-2xl font-bold text-white leading-tight uppercase tracking-tight">{q.question}</h3>
                        </div>

                        <div className="grid gap-4">
                           {q.options.map((opt: string, i: number) => (
                              <button key={i} onClick={() => { const na = [...answers]; na[currentIdx] = i; setAnswers(na); }} 
                                className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center gap-5 group ${answers[currentIdx] === i ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.04]'}`}>
                                 <div className={`w-7 h-7 rounded-xl border flex items-center justify-center text-[11px] font-bold ${answers[currentIdx] === i ? 'border-white/20' : 'border-white/10 group-hover:border-white/20'}`}>
                                    {String.fromCharCode(65 + i)}
                                 </div>
                                 <span className="text-[15px] font-light">{opt}</span>
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-12 bg-white/[0.01] border border-white/5 rounded-3xl p-4 px-8">
               <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} disabled={currentIdx === 0} className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-800 hover:text-white transition-all flex items-center gap-3 disabled:opacity-0">
                  <ChevronLeft className="w-5 h-5" /> Reverse Logic
               </button>
               <div className="flex items-center gap-2.5">
                  {test.questions.map((_: any, i: number) => (
                     <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'bg-blue-500 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : answers[i] !== -1 ? 'bg-blue-500/40' : 'bg-gray-900'}`} />
                  ))}
               </div>
               {currentIdx === test.questions.length - 1 ? (
                  <button onClick={handleSubmit} disabled={loading} className="px-10 py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50">
                     {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Commit Assessment'}
                  </button>
               ) : (
                  <button onClick={() => setCurrentIdx(currentIdx + 1)} className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500 hover:text-blue-400 transition-all flex items-center gap-3">
                     Forward Logic <ChevronRight className="w-5 h-5" />
                  </button>
               )}
            </div>
         </div>

         {/* Navigation Grid */}
         <aside className="hidden lg:block space-y-8">
            <div className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] shadow-2xl">
               <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-[0.4em] mb-10">Logic Node Topology</h4>
               <div className="grid grid-cols-4 gap-3">
                  {test.questions.map((_: any, i: number) => (
                     <button key={i} onClick={() => setCurrentIdx(i)} className={`h-12 rounded-xl flex items-center justify-center font-bold text-xs transition-all border ${i === currentIdx ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : answers[i] !== -1 ? 'bg-white/[0.05] border-white/10 text-blue-400' : 'bg-transparent border-white/5 text-gray-900'}`}>
                        {i + 1}
                     </button>
                  ))}
               </div>
               <div className="mt-12 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-500/40 mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed text-gray-700 font-light lowercase">Immutable commit warning: logic nodes cannot be recalibrated after submission cycle ends.</p>
               </div>
            </div>
         </aside>
      </div>
    </div>
  );
};
