// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\components\ChapterQuiz.tsx
"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface ChapterQuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export const ChapterQuiz: React.FC<ChapterQuizProps> = ({ questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
      onComplete(score + (selected === questions[currentIdx].correctIndex ? 1 : 0));
    }
  };

  if (finished) {
    const finalScore = score;
    const passed = finalScore >= questions.length / 2;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-10 rounded-2xl text-center bg-blue-500/5 border border-blue-500/10">
        <Trophy className={`w-14 h-14 mx-auto mb-6 ${passed ? 'text-amber-500' : 'text-gray-800'}`} />
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Assessment Complete</h3>
        <p className="text-sm text-gray-500 mb-8 font-light">Accuracy established at {finalScore} / {questions.length}</p>
        
        {passed ? (
          <div className="space-y-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Protocol Mastery Verified ✓</div>
             <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">System parameters suggest full comprehension of the current architectural module.</p>
          </div>
        ) : (
          <button onClick={() => { setCurrentIdx(0); setSelected(null); setShowFeedback(false); setScore(0); setFinished(false); }} className="px-8 py-3 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto">
            <RotateCcw className="w-4 h-4" /> Re-Initialize Session
          </button>
        )}
      </motion.div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Module Assessment</span>
        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Query {currentIdx + 1} of {questions.length}</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-8 leading-snug tracking-tight uppercase">{q.question}</h3>

      <div className="space-y-3 mb-10">
        {q.options.map((opt, i) => {
          let stateClass = "border-white/5 bg-white/3 text-gray-500 hover:bg-white/5";
          if (showFeedback) {
            if (i === q.correctIndex) stateClass = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400";
            else if (i === selected) stateClass = "border-red-500/30 bg-red-500/5 text-red-400";
            else stateClass = "opacity-20 border-white/5 bg-white/3 text-gray-600";
          } else if (selected === i) {
            stateClass = "border-blue-500/30 bg-blue-500/10 text-blue-400";
          }

          return (
            <button key={i} onClick={() => handleSelect(i)} disabled={showFeedback} className={`w-full text-left px-5 py-4 rounded-xl border text-[13px] transition-all flex justify-between items-center group font-medium ${stateClass}`}>
              {opt}
              {showFeedback && i === q.correctIndex && <CheckCircle className="w-4.5 h-4.5" />}
              {showFeedback && i === selected && i !== q.correctIndex && <XCircle className="w-4.5 h-4.5" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={nextQuestion} className="w-full py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
          {currentIdx + 1 < questions.length ? 'Next Query' : 'Finalize Assessment'} <ArrowRight className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  );
};
