"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthGuard } from '@/components/AuthGuard';
import { projectsAPI, aiAPI } from '@/lib/apiClient';
import ProjectEditor from '@/components/ProjectEditor';
import { 
  ChevronLeft, ChevronRight, Play, CheckCircle2, 
  Lightbulb, MessageSquare, Loader2, Trophy,
  AlertCircle, Save, BookOpen
} from 'lucide-react';
import { auth } from '@/app/firebase/config';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const res = await projectsAPI.getOne(id as string);
      setProject(res.data.project);
      
      const prog = res.data.userProgress;
      if (prog) {
        setProgress(prog);
        setCurrentStep(prog.currentStep);
        setUserCode(prog.checkpoints?.[prog.currentStep] || res.data.project.steps[prog.currentStep].initialCode);
      } else {
        // Initialize start
        const startRes = await projectsAPI.start(id as string);
        setProgress(startRes.data);
        setUserCode(res.data.project.steps[0].initialCode);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndNext = async () => {
    try {
      setSaving(true);
      const isLastStep = currentStep === project.steps.length - 1;
      
      const res = await projectsAPI.updateProgress(id as string, {
        stepIndex: currentStep,
        code: userCode,
        isCompleted: true
      });

      setProgress(res.data);
      setAiHint(null);

      if (isLastStep) {
        setShowCelebration(true);
      } else {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setUserCode(res.data.checkpoints?.[nextStep] || project.steps[nextStep].initialCode);
      }
    } catch (err) {
      console.error("Failed to save progress:", err);
    } finally {
      setSaving(false);
    }
  };

  const getAIHint = async () => {
    try {
      setAiLoading(true);
      const res = await aiAPI.chat({
        message: `I'm stuck on Step ${currentStep + 1} of the project: ${project.title}. 
                  The task is: ${project.steps[currentStep].title}. 
                  My current code is: \n${userCode}\n 
                  Please give me a small hint without giving away the full solution.`,
        context: `Project Step Guide: ${project.steps[currentStep].explanation}`
      });
      setAiHint(res.data.response);
    } catch (err) {
      console.error("AI Hint failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
       <Loader2 className="w-12 h-12 text-[var(--neon-green)] animate-spin mb-6" />
       <p className="text-xs font-mono text-white/20 uppercase tracking-[0.4em]">Initializing Neural Workspace...</p>
    </div>
  );

  const step = project.steps[currentStep];

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl z-50">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => router.push('/projects')}
                className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="h-6 w-[1px] bg-white/5" />
              <div>
                <h1 className="text-xs font-heading font-900 text-white uppercase tracking-widest mb-1">{project.title}</h1>
                <div className="flex items-center gap-3">
                   <div className="flex gap-1">
                      {project.steps.map((_: any, i: number) => (
                        <div key={i} className={`h-1 w-4 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-[var(--neon-green)] shadow-[0_0_10px_var(--neon-green)]' : 'bg-white/10'}`} />
                      ))}
                   </div>
                   <span className="text-[9px] font-mono text-white/30 truncate max-w-[150px]">STEP {currentStep + 1} OF {project.steps.length}</span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push('/projects')}
                className="px-6 py-2 rounded-xl text-[10px] font-heading font-900 text-white/40 uppercase tracking-widest hover:text-white transition-all"
              >
                Exit Workspace
              </button>
              <button 
                onClick={handleSaveAndNext}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--neon-green)] text-black text-[10px] font-heading font-900 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(var(--neon-green-rgb),0.2)] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    {currentStep === project.steps.length - 1 ? 'Finish Project' : 'Apply Changes'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
           </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
           {/* Sidebar */}
           <aside className="w-[400px] border-r border-white/5 flex flex-col bg-black/20 overflow-y-auto custom-scrollbar active-layer">
              <div className="p-8">
                <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-heading font-900 text-[var(--neon-green)] uppercase tracking-widest mb-6">
                   <BookOpen className="w-3 h-3" /> Step Instructions
                </div>
                
                <h2 className="text-2xl font-heading font-800 text-white uppercase tracking-tight mb-4">{step.title}</h2>
                <div className="text-[14px] text-white/50 leading-relaxed font-light space-y-4 mb-8">
                   {step.explanation.split('\n').map((line: string, i: number) => (
                     <p key={i}>{line}</p>
                   ))}
                </div>

                {step.hints && step.hints.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
                     <p className="text-[10px] font-heading font-900 text-white uppercase tracking-widest mb-4 flex items-center gap-2 text-[var(--neon-yellow)]">
                        <Lightbulb className="w-3.5 h-3.5" /> Rapid Hints
                     </p>
                     <ul className="space-y-3">
                        {step.hints.map((h: string, i: number) => (
                          <li key={i} className="text-xs text-white/40 flex items-start gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-1.5 flex-shrink-0" />
                             {h}
                          </li>
                        ))}
                     </ul>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                   <button 
                    onClick={getAIHint}
                    disabled={aiLoading}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[var(--neon-violet)]/30 transition-all group overflow-hidden relative"
                   >
                      <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-violet)]/0 to-[var(--neon-violet)]/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                      <div className="flex items-center gap-3 relative z-10">
                         <div className="w-8 h-8 rounded-lg bg-[var(--neon-violet)]/10 flex items-center justify-center">
                            {aiLoading ? <Loader2 className="w-4 h-4 text-[var(--neon-violet)] animate-spin" /> : <MessageSquare className="w-4 h-4 text-[var(--neon-violet)]" />}
                         </div>
                         <span className="text-[10px] font-heading font-900 text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">AI Assistant Debug</span>
                      </div>
                   </button>

                   <AnimatePresence>
                      {aiHint && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="p-5 rounded-2xl bg-[var(--neon-violet)]/10 border border-[var(--neon-violet)]/20"
                        >
                           <p className="text-[13px] text-[var(--neon-violet)] leading-relaxed italic">"{aiHint}"</p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
              </div>
           </aside>

           {/* Editor Area */}
           <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
              <div className="h-10 border-b border-white/5 flex items-center px-6 justify-between bg-black/20">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                       <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                       <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">NeuralOS_v1.0.core</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-mono text-white/10 uppercase tracking-widest">
                    <span>{project.techStack.join(' | ')}</span>
                 </div>
              </div>
              
              <div className="flex-1 p-2">
                <ProjectEditor 
                  value={userCode} 
                  onChange={(val) => setUserCode(val || '')} 
                  language={project.techStack[0]?.toLowerCase() || 'javascript'}
                />
              </div>

              {/* Progress Summary Popover */}
              <div className="absolute bottom-10 right-10 flex gap-4">
                <div className="p-4 rounded-2xl glass-panel border-white/5 flex items-center gap-4 bg-black/60 shadow-2xl">
                   <div className="w-10 h-10 rounded-xl bg-[var(--neon-green)]/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[var(--neon-green)]" />
                   </div>
                   <div>
                      <p className="text-[9px] font-heading font-900 text-white/20 uppercase tracking-widest mb-1">XP POTENTIAL</p>
                      <p className="text-sm font-heading font-900 text-white">+{project.xpReward} XP</p>
                   </div>
                </div>
              </div>
           </div>
        </main>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6"
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }} 
                 animate={{ scale: 1, y: 0 }}
                 className="max-w-md w-full glass-card p-12 text-center border-[var(--neon-green)]/30 relative overflow-hidden"
               >
                  <div className="absolute -top-20 -left-20 w-64 h-64 bg-[var(--neon-green)]/10 blur-[80px] rounded-full" />
                  
                  <div className="w-24 h-24 rounded-3xl bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20 flex items-center justify-center mx-auto mb-10 relative">
                     <Trophy className="w-10 h-10 text-[var(--neon-green)]" />
                     <div className="absolute inset-0 bg-[var(--neon-green)]/20 blur-2xl rounded-full animate-pulse" />
                  </div>

                  <h3 className="text-4xl font-heading font-900 text-white uppercase tracking-tight mb-4">PROTOCOL COMPLETE</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-10 font-light italic">
                    You have successfully synthesized the {project.title} architect. Neural network parameters updated.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-10">
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[9px] font-heading font-900 text-white/20 uppercase tracking-widest mb-2">REWARDED XP</p>
                        <p className="text-2xl font-heading font-900 text-[var(--neon-green)]">+{project.xpReward}</p>
                     </div>
                     <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-left">
                        <p className="text-[9px] font-heading font-900 text-white/20 uppercase tracking-widest mb-2">BADGE EARNED</p>
                        <p className="text-xs font-heading font-900 text-white uppercase tracking-wider">{project.difficulty} BUILDER</p>
                     </div>
                  </div>

                  <button 
                    onClick={() => router.push('/projects')}
                    className="w-full py-4 rounded-2xl bg-[var(--neon-green)] text-black text-xs font-heading font-900 uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(var(--neon-green-rgb),0.3)]"
                  >
                    Return to Archive
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}
