// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\learn\[track]\[lessonSlug]\page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { 
  ChevronLeft, ChevronRight, Play, CheckCircle, RotateCcw, 
  Lightbulb, BookOpen, Code2, Zap, ArrowLeft, Sparkles, 
  Loader2, XCircle, Terminal, PlayCircle, Send, HelpCircle, Cpu, Trophy, Users, Lock, Layers
} from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { lessonsAPI, progressAPI, aiAPI, communityAPI } from "@/lib/apiClient";
import { AIChat } from "@/components/AIChat";
import { useRouter } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function LessonPage({ params }: { params: Promise<{ track: string, lessonSlug: string }> }) {
  const { track, lessonSlug } = use(params);
  const router = useRouter();
  
  // State Management
  const [lesson, setLesson] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Interactive State
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [trackProgress, setTrackProgress] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'theory' | 'examples' | 'video' | 'solutions'>('theory');
  const [mobileView, setMobileView] = useState<'docs' | 'editor'>('docs');
  const [isValidating, setIsValidating] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [hintIndex, setHintIndex] = useState(-1);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [isSolutionsLoading, setIsSolutionsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const fetchSolutions = async () => {
    if (!lessonSlug) return;
    setIsSolutionsLoading(true);
    try {
      const res = await communityAPI.getSolutions(lessonSlug);
      setSolutions(res.data);
    } catch (err) {
      toast.error("Architectural Hub archive link failure.");
    } finally {
      setIsSolutionsLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    if (!output.content || output.type !== 'error') return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const currentExercise = lesson?.exercises?.[exerciseIndex] || lesson?.exercises?.[0];
      const res = await aiAPI.debug({
        code,
        error: output.content,
        context: `Lesson: ${lesson?.title} - Challenge ${exerciseIndex + 1}. Task: ${currentExercise?.problem}`
      });
      setAiAnalysis(res.data.analysis);
    } catch (err) {
      toast.error("Neural uplink bottleneck.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        try {
          const [lRes, allRes, pRes, userPRes] = await Promise.all([
            lessonsAPI.getOne(lessonSlug),
            lessonsAPI.getAll(track),
            progressAPI.getStats(u.uid),
            progressAPI.getLessonStatus(lessonSlug)
          ]);
          
          const trackLessons = allRes.data.data || [];
          const completedIds = pRes.data.completedLessons || [];
          const globalIndex = trackLessons.findIndex((l: any) => l.slug === lessonSlug);
          const isLocked = globalIndex > 0 && !completedIds.includes(trackLessons[globalIndex - 1].slug);
             
          if (isLocked) {
            setIsRedirecting(true);
            toast.error("Architectural Access Denied: Prerequisite modules not synchronized.");
            router.push(`/learn/${track}`);
            return;
          }

          setLesson(lRes.data);
          setAllLessons(trackLessons);
          setCompletedLessons(completedIds);
          
          // Set initial exercise index from saved progress or 0
          const savedIndex = userPRes.data.currentExerciseIndex || 0;
          setExerciseIndex(savedIndex);

          // Restore code for saved index or use starter code
          const savedEx = userPRes.data.completedExercises?.find((ex: any) => ex.exerciseIndex === savedIndex);
          if (savedEx?.code) {
            setCode(savedEx.code);
          } else if (lRes.data.exercises?.[savedIndex]) {
            setCode(lRes.data.exercises[savedIndex].starterCode || "");
          } else if (lRes.data.exercises?.[0]) {
            setCode(lRes.data.exercises[0].starterCode || "");
          } else {
            setCode("# Initializing architectural node...\n");
          }
        } catch (err) {
          console.error("Failed to fetch lesson data:", err);
          toast.error("Security node access failed tracking.");
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [lessonSlug, track]);

  const handleExerciseChange = (newIndex: number) => {
    if (!lesson || !lesson.exercises[newIndex]) return;
    setExerciseIndex(newIndex);
    setHintIndex(-1);
    setAiAnalysis(null);
    setOutput(null);

    // Load code for new index: saved in local state?
    const savedEx = lesson.exercises[newIndex];
    setCode(savedEx.starterCode || "");
  };

  const runCode = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setOutput({ type: 'info', content: '> Initializing code execution sequence...' });
    
    try {
      const exercise = lesson.exercises[exerciseIndex];
      const res = await lessonsAPI.execute({
        code,
        language: exercise?.lang || (track === 'javascript' || track === 'react' ? 'javascript' : 'python')
      });
      
      if (res.data.stderr || res.data.compile_output) {
        setOutput({ 
          type: 'error', 
          content: res.data.stderr || res.data.compile_output 
        });
      } else {
        setOutput({ 
          type: 'success', 
          content: res.data.stdout || "Unit execution complete." 
        });
      }
    } catch (err: any) {
      setOutput({ type: 'error', content: err.response?.data?.error || 'Execution kernel failure.' });
      toast.error("Execution node offline.");
    } finally {
      setIsExecuting(false);
    }
  };

  const submitSync = async () => {
    if (isValidating) return;
    setIsValidating(true);
    setOutput({ type: 'info', content: `> Initiating challenge ${exerciseIndex + 1} validation...` });

    try {
      const exercise = lesson.exercises[exerciseIndex];
      const res = await lessonsAPI.validate({
        lessonSlug,
        exerciseIndex,
        code,
        language: exercise?.lang || (track === 'javascript' || track === 'react' ? 'javascript' : 'python')
      });

      const { allPassed, testCaseResults } = res.data;

      if (allPassed) {
        const xpEarned = Math.floor((lesson?.xpReward || 100) / (lesson?.exercises?.length || 1));
        
        if (lesson && exerciseIndex < lesson.exercises.length - 1) {
          // Advance to next challenge
          setOutput({ 
            type: 'success', 
            content: `✓ ARCHITECTURAL UNIT ${exerciseIndex + 1} VERIFIED\nSYNCHRONIZING +${xpEarned} XP...` 
          });
          toast.success(`Node ${exerciseIndex + 1} Secured: +${xpEarned} XP!`, {
            icon: <Trophy className="w-4 h-4 text-emerald-400" />,
          });
          
          setTimeout(() => {
            handleExerciseChange(exerciseIndex + 1);
          }, 1500);
        } else {
          // Final completion
          setOutput({ 
            type: 'success', 
            content: `✓ ARCHITECTURAL INTEGRITY VERIFIED\nFULL MODULE MASTERED: +${xpEarned} XP ARCHIVED.` 
          });
          toast.success("Module Mastered! Syncing ranks...", {
            icon: <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20" />,
          });
          setCompletedLessons(prev => [...prev, lessonSlug]);
        }
        
        // Finalize ranking sync
        try {
          if (uid) {
            const upRes = await progressAPI.getStats(uid);
            // This ensures any global header component listening to this state updates
          }
        } catch (sErr) { /* Silent fail for sync */ }

      } else {
        const failed = testCaseResults.find((r: any) => !r.passed);
        setOutput({ 
          type: 'error', 
          content: `❌ VALIDATION FAILED\nInput: ${failed.input}\nExpected: ${failed.expected}\nActual: ${failed.actual}\n${failed.error ? 'Error: ' + failed.error : ''}` 
        });
        toast.error("Logic mismatch detected.");
      }
    } catch (err: any) {
      setOutput({ type: 'error', content: err.response?.data?.error || 'Validation gateway error.' });
    } finally {
      setIsValidating(false);
    }
  };

  const nextLesson = () => {
    const currentIdx = allLessons.findIndex(l => l.slug === lessonSlug);
    if (currentIdx !== -1 && currentIdx + 1 < allLessons.length) {
      router.push(`/learn/${track}/${allLessons[currentIdx + 1].slug}`);
    } else {
      router.push(`/learn/${track}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-brand-bg uppercase tracking-[0.4em]">
      <div className="w-16 h-1 w-32 bg-white/5 rounded-full overflow-hidden">
        <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-full h-full bg-blue-500" />
      </div>
      <div className="text-[10px] font-bold text-gray-800 animate-pulse">Establishing Neural Uplink...</div>
    </div>
  );

  if (isRedirecting) return null;

  if (!lesson) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-10 text-center">
       <div className="w-20 h-20 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center mb-8">
          <Layers className="w-8 h-8 text-blue-500/40" />
       </div>
       <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">Lesson Node Missing</h2>
       <p className="text-gray-500 text-sm font-light leading-relaxed max-w-sm mb-12">
          The requested unit could not be located in the current curriculum architecture. This may be due to a recent update.
       </p>
       <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
          >
             Retry Sync
          </button>
          <Link 
            href={`/learn/${track}`} 
            className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10"
          >
             Return to Tracks
          </Link>
       </div>
    </div>
  );

  const isDone = completedLessons.includes(lesson.slug);

  return (
    <AuthGuard>
      <div className="h-screen bg-brand-bg overflow-hidden flex flex-col">
        {/* Progress Bar Top */}
        <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-50 overflow-hidden">
           <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: isDone ? '100%' : '33%' }} 
            className="h-full bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
           />
        </div>

        {/* ⚡ Header Architecture */}
        <header className="border-b border-white/5 py-4 px-6 flex items-center justify-between bg-brand-bg/80 backdrop-blur-3xl z-40">
          <div className="flex items-center gap-6">
            <Link href={`/learn/${track}`} className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group">
              <ArrowLeft className="w-4.5 h-4.5 text-gray-600 group-hover:text-white" />
            </Link>
            <div>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-0.5">{track} System · {lesson.chapter}</p>
              <h1 className="text-sm font-bold text-white tracking-tight uppercase leading-none">{lesson.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">+{lesson.xpReward} XP</span>
             </div>
             <button onClick={() => setShowAI(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 transition-all text-[9px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> Ask AI
             </button>
          </div>
        </header>

        {/* ⚡ Main Neural Workspace */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-[450px,1fr] xl:grid-cols-[550px,1fr] overflow-hidden relative">
          
          {/* Mobile Workspace Toggle - Only visible on small screens */}
          <div className="lg:hidden flex border-b border-white/5 bg-brand-bg-secondary/40 backdrop-blur-xl">
             <button 
               onClick={() => setMobileView('docs')}
               className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${mobileView === 'docs' ? 'text-blue-500 border-blue-500 bg-blue-500/5' : 'text-gray-500 border-transparent'}`}
             >
               Architecture
             </button>
             <button 
               onClick={() => setMobileView('editor')}
               className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${mobileView === 'editor' ? 'text-blue-500 border-blue-500 bg-blue-500/5' : 'text-gray-500 border-transparent'}`}
             >
               Source Code
             </button>
          </div>

          {/* Left Column: Knowledge Base */}
          <aside className={`${mobileView === 'docs' ? 'flex' : 'hidden lg:flex'} border-r border-white/5 flex-col bg-brand-bg-secondary/20 overflow-hidden`}>
             {/* Local Navigation */}
             <div className="flex items-center border-b border-white/5 bg-white/[0.02]">
                {[
                  { id: 'theory', label: 'Theory', icon: BookOpen },
                  { id: 'examples', label: 'Examples', icon: Code2 },
                  { id: 'video', label: 'Visual', icon: PlayCircle },
                  { id: 'solutions', label: 'Hub', icon: Users },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'solutions' && completedLessons.includes(lessonSlug)) {
                        fetchSolutions();
                      }
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'text-blue-500 border-blue-500 bg-blue-500/5' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                  >
                    <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                  </button>
                ))}
             </div>

             {/* Dynamic Content Area */}
             <div className="flex-1 overflow-y-auto p-10 custom-scrollbar layer-10">
                <AnimatePresence mode="wait">
                  {activeTab === 'theory' && (
                    <motion.div key="theory" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-12 pb-20">
                       {/* Theory Section */}
                       <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-strong:text-blue-400 prose-code:text-indigo-300 max-w-none prose-sm selection:bg-blue-500/20">
                          <ReactMarkdown>{lesson.theory || lesson.content || "# No documentation available for this node."}</ReactMarkdown>
                       </div>
                       
                       {/* Examples Section */}
                       {lesson.examples && lesson.examples.length > 0 && (
                        <div className="space-y-8 pt-10 border-t border-white/5">
                           <div className="flex items-center gap-3 mb-6">
                              <Lightbulb className="w-4 h-4 text-amber-500" />
                              <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Theoretical Examples</h3>
                           </div>
                           <div className="space-y-6">
                              {lesson.examples.map((ex: any, i: number) => (
                                <div key={i} className="group glass-panel bg-white/[0.01] border-white/5 overflow-hidden">
                                   <div className="px-5 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{ex.title || `Example ${i+1}`}</span>
                                      <span className="text-[9px] font-mono text-blue-500/40">node_example.log</span>
                                   </div>
                                   <div className="p-6">
                                      <pre className="text-[13px] font-mono text-blue-300/80 mb-4 overflow-x-auto"><code>{ex.code}</code></pre>
                                      <p className="text-[11px] text-gray-600 font-light leading-relaxed italic">{ex.explanation}</p>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                       )}

                       {/* Interactive Exercise Section */}
                       {lesson.exercises?.[exerciseIndex] && (
                        <div className="mt-16 pt-10 border-t border-white/5">
                           <div className="flex items-center gap-3 mb-6">
                              <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                              <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Interactive Mission: {exerciseIndex + 1}/{lesson.exercises.length}</h3>
                           </div>
                           <div className="glass-panel p-8 bg-blue-500/[0.02] border-blue-500/10 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
                              <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6 relative z-10">
                                {lesson.exercises[exerciseIndex].problem}
                              </p>
                              
                              {lesson.exercises[exerciseIndex].hints?.length > 0 && (
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                   <div className="flex items-center gap-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                                      <HelpCircle className="w-3 h-3" /> Intel Hints
                                   </div>
                                   <ul className="space-y-2">
                                      {lesson.exercises[exerciseIndex].hints.map((hint: string, hi: number) => (
                                        <li key={hi} className="text-[11px] text-gray-500 flex gap-3">
                                           <span className="text-blue-500/40 font-mono">{hi + 1}.</span>
                                           {hint}
                                        </li>
                                      ))}
                                   </ul>
                                </div>
                              )}
                           </div>
                        </div>
                       )}
                    </motion.div>
                  )}

                  {activeTab === 'examples' && (
                    <motion.div key="examples" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-10">
                       {(lesson.examples && lesson.examples.length > 0) ? lesson.examples.map((ex: any, i: number) => (
                         <div key={i} className="space-y-4">
                            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-3">
                               <span className="w-6 h-[1px] bg-white/10" /> Example {i + 1}: {ex.title}
                            </h4>
                            <div className="rounded-xl border border-white/5 bg-[#050510] overflow-hidden group">
                               <div className="px-5 py-2.5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Read-Only Synthesis</span>
                                  <Code2 className="w-3.5 h-3.5 text-blue-500/40 group-hover:text-blue-500 transition-colors" />
                               </div>
                               <pre className="p-6 text-[13px] font-mono text-blue-300/80 leading-relaxed overflow-x-auto">{ex.code}</pre>
                            </div>
                            <p className="text-[12px] text-gray-600 font-light leading-relaxed italic">{ex.explanation}</p>
                         </div>
                       )) : (
                        <div className="py-20 text-center">
                           <Code2 className="w-12 h-12 text-gray-800 mx-auto mb-6" />
                           <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">No examples cached for this node.</p>
                        </div>
                       )}
                    </motion.div>
                  )}

                  {activeTab === 'video' && (
                    <motion.div key="video" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                       <div className="rounded-3xl overflow-hidden border border-white/5 bg-black aspect-video shadow-2xl mb-8 group relative">
                          <iframe 
                            width="100%" height="100%" 
                            src={`https://www.youtube.com/embed/${track === 'python' ? '8DvywoWv6fI' : 'gzqV8ZUyF60'}?rel=0&modestbranding=1`} 
                            className="opacity-70 group-hover:opacity-100 transition-opacity"
                            allowFullScreen
                          />
                       </div>
                       <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Module Synthesis · freeCodeCamp</p>
                    </motion.div>
                  )}

                  {activeTab === 'solutions' && (
                    <motion.div key="solutions" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="h-full flex flex-col">
                       {/* Official System Solution - Always visible if requesting help */}
                       {lesson.exercises?.[exerciseIndex]?.solution && (
                         <div className="mb-10 pb-8 border-b border-white/5">
                            <div className="flex items-center gap-2 mb-4 text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                               <Zap className="w-3.5 h-3.5" /> Official Architectural Pattern
                            </div>
                            <div className="glass-panel p-6 bg-blue-500/[0.03] border-blue-500/10">
                               <pre className="text-[12px] font-mono text-blue-300/90 leading-relaxed overflow-x-auto">
                                  <code>{lesson.exercises[exerciseIndex].solution}</code>
                                </pre>
                            </div>
                         </div>
                       )}

                       {!completedLessons.includes(lessonSlug) ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                           <div className="w-20 h-20 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center mb-8 relative">
                              <Lock className="w-8 h-8 text-blue-500/40" />
                              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-20" />
                           </div>
                           <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em] mb-4">Architectural Hub Locked</h3>
                           <p className="text-gray-500 text-xs font-light leading-relaxed max-w-[280px]">
                              Verify the current architectural unit to unlock community insights and peer solutions.
                           </p>
                        </div>
                       ) : isSolutionsLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                           <Loader2 className="w-6 h-6 animate-spin text-blue-500/40" />
                        </div>
                       ) : (
                        <div className="space-y-8">
                           <div className="flex items-center justify-between mb-2">
                              <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Top Architect Solutions</h3>
                              <span className="text-[9px] text-gray-600 font-mono uppercase tracking-widest">{solutions.length} Archive Nodes</span>
                           </div>
                           
                           {solutions.length === 0 ? (
                            <p className="text-gray-600 text-[11px] italic">No community archives found for this node yet.</p>
                           ) : (
                             solutions.map((sol: any) => (
                               <div key={sol._id} className="group glass-panel p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                                  <div className="flex items-center justify-between mb-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center overflow-hidden">
                                           {sol.authorPhoto ? (
                                             <img src={sol.authorPhoto} alt="" className="w-full h-full object-cover opacity-80" />
                                           ) : (
                                             <Users className="w-3.5 h-3.5 text-blue-400" />
                                           )}
                                        </div>
                                        <span className="text-[10px] font-bold text-white tracking-widest uppercase">{sol.author}</span>
                                     </div>
                                     <span className="text-[8px] text-gray-700 font-mono">{new Date(sol.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <div className="bg-black/40 rounded-xl p-5 border border-white/5 font-mono text-[10px] text-gray-400 overflow-x-auto selection:bg-blue-500/20">
                                     <pre><code>{sol.code}</code></pre>
                                  </div>
                               </div>
                             ))
                           )}
                        </div>
                       )}
                    </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </aside>
          {/* Right Column: Interaction Layer */}
          <main className={`${mobileView === 'editor' ? 'flex' : 'hidden lg:flex'} flex-col overflow-hidden bg-black/20 relative`}>
             {/* Editor Tools */}
             <div className="px-6 py-2.5 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                         <Code2 className="w-3.5 h-3.5 text-blue-500" />
                         <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">Source Editor</span>
                      </div>
                     <div className="h-4 w-[1px] bg-white/5" />
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md">
                         <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-widest">
                            {lesson?.exercises?.[exerciseIndex]?.lang === 'javascript' ? 'index.js' : 
                             lesson?.exercises?.[exerciseIndex]?.lang === 'python' ? 'main.py' :
                             (track === 'javascript' || track === 'react' ? 'index.js' : 'main.py')}
                         </span>
                      </div>
                    <div className="h-4 w-[1px] bg-white/5" />
                    <div className="flex items-center gap-4 bg-white/[0.02] px-3 py-1 rounded-lg border border-white/5">
                        <button 
                          onClick={() => handleExerciseChange(exerciseIndex - 1)}
                          disabled={exerciseIndex === 0}
                          className="p-1 text-gray-700 hover:text-white transition-all disabled:opacity-30"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.2em] min-w-[100px] text-center">
                          Challenge {String(exerciseIndex + 1).padStart(2, '0')}/{String(lesson.exercises?.length || 1).padStart(2, '0')}
                        </span>
                        <button 
                          onClick={() => handleExerciseChange(exerciseIndex + 1)}
                          disabled={!lesson || exerciseIndex === lesson.exercises.length - 1}
                          className="p-1 text-gray-700 hover:text-white transition-all disabled:opacity-30"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="h-4 w-[1px] bg-white/5" />
                     <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                       Node: {lesson?.exercises?.[exerciseIndex]?.lang || track} kernel
                     </span>
                 </div>
                <div className="flex items-center gap-3">
                   <button onClick={() => setCode(lesson.exercises?.[0]?.starterCode || "")} className="p-2 text-gray-700 hover:text-white transition-all" title="Reset Node">
                      <RotateCcw className="w-4 h-4" />
                   </button>
                </div>
             </div>

             {/* Editor Core */}
             <div className="flex-1 min-h-0">
               <CodeEditor 
                value={code} 
                onChange={(v) => setCode(v || "")} 
                language={lesson?.exercises?.[exerciseIndex]?.lang || (track === 'javascript' || track === 'react' ? 'javascript' : 'python')} 
               />
             </div>

             {/* Terminal Output */}
             <div className="h-[250px] border-t border-white/5 flex flex-col bg-[#050510]">
                <div className="px-6 py-3 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Terminal Output</span>
                   </div>
                   <div className="flex items-center gap-3">
                      {output?.type === 'error' && (
                       <button 
                         onClick={analyzeWithAI}
                         disabled={isAnalyzing}
                         className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all disabled:opacity-50"
                       >
                         {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                         Neural Debug
                       </button>
                      )}
                      <button onClick={() => { setOutput(null); setAiAnalysis(null); }} className="text-[9px] font-bold text-gray-700 uppercase hover:text-white transition-all">Clear</button>
                   </div>
                </div>
                <div className="flex-1 p-6 overflow-y-auto font-mono text-[13px] custom-scrollbar selection:bg-blue-500/20 relative">
                   <AnimatePresence mode="wait">
                      {aiAnalysis && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl mb-8 relative group"
                       >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                             <Sparkles className="w-12 h-12 text-blue-400" />
                          </div>
                          <h4 className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">
                             <Cpu className="w-4 h-4" /> Architect.Analysis_Layer
                          </h4>
                          <div className="text-gray-300 font-sans text-xs leading-relaxed whitespace-pre-wrap">
                             {aiAnalysis}
                          </div>
                          <button 
                            onClick={() => setAiAnalysis(null)} 
                            className="absolute top-4 right-4 text-gray-700 hover:text-white transition-all text-sm"
                          >
                            ×
                          </button>
                       </motion.div>
                      )}
                   </AnimatePresence>

                   {output ? (
                     <div className={`leading-relaxed ${output.type === 'error' ? 'text-rose-500' : output.type === 'success' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {typeof output.content === 'string' ? output.content : JSON.stringify(output.content, null, 2)}
                     </div>
                   ) : (
                     <p className="text-gray-800 text-[11px] uppercase tracking-widest font-bold h-full flex items-center justify-center opacity-40 italic">
                        Awaiting execution...
                     </p>
                   )}
                </div>
             </div>

             {/* ⚡ Action Command Bar */}
             <div className="p-6 border-t border-white/5 bg-brand-bg/80 backdrop-blur-3xl flex items-center justify-between">
                <div className="flex flex-col gap-2">
                   <button 
                    onClick={() => {
                      if (!lesson.exercises?.[exerciseIndex]?.hints) return;
                      setHintIndex(prev => (prev + 1) % lesson.exercises[exerciseIndex].hints.length);
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 text-gray-400 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/20"
                   >
                      <HelpCircle className="w-4 h-4 text-blue-500" /> 
                      {hintIndex === -1 ? "REQUEST HINT" : `HINT ${hintIndex + 1}/${lesson.exercises[exerciseIndex].hints.length}`}
                   </button>
                   <AnimatePresence>
                      {hintIndex !== -1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="text-[11px] text-blue-400/80 font-light italic pl-2 border-l border-blue-500/30"
                        >
                          {lesson.exercises[exerciseIndex].hints[hintIndex]}
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
                <div className="flex items-center gap-4">
                   <button 
                      onClick={() => {
                        if (lesson.exercises?.[exerciseIndex]?.starterCode) {
                          toast.info("Extracting solution...");
                          fetchSolutions();
                          setActiveTab('solutions');
                        }
                      }}
                      className="px-6 py-3.5 rounded-xl border border-white/5 bg-white/5 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
                    >
                       VIEW SOLUTION
                    </button>
                   <button 
                    onClick={runCode}
                    disabled={isExecuting}
                    className="flex items-center gap-3 px-8 py-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-400 font-bold text-[11px] uppercase tracking-widest hover:bg-blue-500/10 transition-all disabled:opacity-50"
                   >
                      {isExecuting ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <PlayCircle className="w-4 h-4" />}
                      Run Terminal
                   </button>
                   <button 
                    onClick={submitSync}
                    disabled={isValidating}
                    className="group relative flex items-center gap-3 px-10 py-3.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-blue-500 disabled:opacity-50"
                   >
                      <motion.div 
                        animate={isValidating ? { x: ["-100%", "200%"] } : {}} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100"
                      />
                      {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Submit Answer
                   </button>
                </div>
             </div>
          </main>
        </div>

        {/* AI Overlay Layer */}
        <AnimatePresence>
           {showAI && (
             <AIChat 
                context={`Current task: ${lesson.exercises?.[0]?.problem || lesson.title}. Track: ${track}. Logic: ${code}`} 
                onClose={() => setShowAI(false)} 
             />
           )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}

// Re-using Lucide Target icon missed in imports
function Target(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}
