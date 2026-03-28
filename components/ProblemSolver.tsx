// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\components\ProblemSolver.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Lightbulb, Zap, CheckCircle, XCircle, Terminal, HelpCircle, Loader2, Sparkles, Code2 } from 'lucide-react';
import { practiceAPI, aiAPI, progressAPI } from '@/lib/apiClient';

interface ProblemSolverProps {
  problem: any;
  uid: string | null;
  onSuccess: () => void;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({ problem, uid, onSuccess }) => {
  const [code, setCode] = useState(problem.buggyCode || "");
  const [output, setOutput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  const runCode = async () => {
    setExecuting(true);
    setError(null);
    setAiSuggestion(null);
    try {
      const res = await practiceAPI.execute({
        source_code: code,
        language_id: problem.judge0Id || 71,
        stdin: problem.testCases?.[0]?.input || "",
        expected_output: problem.testCases?.[0]?.expected
      });

      const decodedOutput = res.data.stdout ? atob(res.data.stdout) : "";
      setOutput(decodedOutput || res.data.status?.description);

      // Simple verification for demo
      const expected = problem.testCases?.[0]?.expected;
      if (decodedOutput.trim().includes(expected)) {
        setSuccess(true);
        if (uid) {
          await progressAPI.complete({
            firebaseUID: uid,
            itemId: problem._id,
            itemType: "problem",
            xpReward: problem.xpReward
          });
        }
        onSuccess();
      } else if (res.data.stderr || res.data.compile_output) {
         setError(atob(res.data.stderr || res.data.compile_output));
      } else {
         setError("Incorrect output. Try analyzing the results.");
      }
    } catch (err: any) {
      setError("Execution failed: " + err.message);
    }
    setExecuting(false);
  };

  const getAIDebug = async () => {
    if (!error) return;
    setDebugging(true);
    try {
      const res = await aiAPI.debug({
        code,
        error,
        context: problem.desc
      });
      setAiSuggestion(res.data);
    } catch (err) {
      console.error("AI Debug failed:", err);
    }
    setDebugging(false);
  };

  return (
    <div className="grid lg:grid-cols-[1fr,450px] gap-0 h-[calc(100vh-140px)] border border-white/5 rounded-2xl overflow-hidden bg-brand-bg-secondary">
      {/* Editor Section */}
      <div className="flex flex-col border-r border-white/5">
        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Code2 className="w-4 h-4 text-blue-400" />
             </div>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{problem.lang} Environment</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCode(problem.buggyCode)} className="p-2 text-gray-600 hover:text-white transition-colors" title="Reset Code">
               <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 min-h-0 bg-[#0A0A0F]">
          <Editor
            height="100%"
            theme="vs-dark"
            language={problem.lang?.toLowerCase() || 'python'}
            value={code}
            onChange={(v) => setCode(v || "")}
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              minimap: { enabled: false },
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>

        <div className="p-4 bg-white/[0.02] flex items-center justify-between border-t border-white/5">
          <div className="flex gap-2">
            {problem.hints && hintsShown < problem.hints.length && (
              <button onClick={() => setHintsShown(h => h + 1)} className="px-4 py-2 rounded-lg border border-white/10 text-[10px] font-bold text-gray-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5" /> Blueprint ({hintsShown}/{problem.hints.length})
              </button>
            )}
            {error && !aiSuggestion && (
              <button onClick={getAIDebug} disabled={debugging} className="px-4 py-2 rounded-lg border border-indigo-500/20 text-[10px] font-bold text-indigo-400 hover:bg-indigo-500/10 transition-all uppercase tracking-widest flex items-center gap-2">
                {debugging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Neural Analysis
              </button>
            )}
          </div>
          <button onClick={runCode} disabled={executing || success} className="btn-primary px-8 py-3 text-xs uppercase tracking-widest">
            {executing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />} Execute Payload
          </button>
        </div>
      </div>

      {/* Output & Sidebar */}
      <div className="flex flex-col bg-brand-bg-secondary/40">
        <div className="px-8 py-10 border-b border-white/5">
           <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${problem.difficulty === 'Beginner' ? 'text-emerald-400 bg-emerald-400/10' : problem.difficulty === 'Intermediate' ? 'text-blue-400 bg-blue-400/10' : 'text-indigo-400 bg-indigo-400/10'}`}>
                {problem.difficulty}
              </span>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{problem.topic}</span>
           </div>
           <h2 className="font-heading text-xl font-800 text-white mb-4 uppercase tracking-tight">{problem.title}</h2>
           <p className="text-sm text-gray-500 leading-relaxed font-light">{problem.desc}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
           {/* Hints */}
           {hintsShown > 0 && (
              <div className="space-y-4">
                 <div className="text-[10px] font-bold text-amber-500/60 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5" /> Declassified Data
                 </div>
                 {problem.hints.slice(0, hintsShown).map((h: string, i: number) => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="p-4 rounded-xl text-[12px] text-gray-400 border border-amber-500/10 bg-amber-500/5 leading-relaxed">
                       {h}
                    </motion.div>
                 ))}
              </div>
           )}

           {/* Execution Result */}
           <div className="space-y-4">
              <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Terminal className="w-3.5 h-3.5" /> Kernel Log
              </div>
              <div className={`p-5 font-mono text-xs rounded-2xl min-h-[120px] whitespace-pre-wrap border transition-all ${error ? 'border-rose-500/20 bg-rose-500/5 text-rose-400' : success ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold' : 'bg-black/40 border-white/5 text-gray-500'}`}>
                 {output || "Awaiting command execution..."}
                 {error && <div className="mt-5 pt-5 border-t border-rose-500/10 text-[10px] opacity-70 italic">{error}</div>}
              </div>
           </div>

           {/* AI Suggestion */}
           <AnimatePresence>
             {aiSuggestion && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-5">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Sparkles className="w-3.5 h-3.5" /> System Analysis
                      </div>
                      <button onClick={() => setAiSuggestion(null)} className="text-gray-700 hover:text-white transition-colors"><XCircle className="w-4 h-4" /></button>
                   </div>
                   <p className="text-[12px] text-gray-400 leading-relaxed italic border-l-2 border-indigo-500/30 pl-4">"{aiSuggestion.hint}"</p>
                   {aiSuggestion.correction && (
                      <div className="bg-black/40 rounded-xl overflow-hidden border border-white/5">
                         <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest">Patch Logic</div>
                         <pre className="p-4 text-[11px] text-indigo-300 font-mono overflow-x-auto">{aiSuggestion.correction}</pre>
                      </div>
                   )}
                </motion.div>
             )}
           </AnimatePresence>

           {/* Success State */}
           {success && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                 <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <CheckCircle className="w-7 h-7 text-emerald-400" />
                 </div>
                 <h4 className="font-heading text-xl font-800 text-white mb-2 uppercase tracking-tight">Access Granted</h4>
                 <p className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-[0.2em] mb-8">+{problem.xpReward} XP Synthesis Complete</p>
                 <button onClick={() => window.location.href='/practice'} className="btn-primary w-full py-3 text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-black font-bold">
                    Return to Arena
                 </button>
              </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};
