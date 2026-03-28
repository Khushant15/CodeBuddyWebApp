// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\components\AIChat.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, MinusSquare, Maximize2 } from 'lucide-react';
import { aiAPI } from '@/lib/apiClient';

export const AIChat = ({ context, onClose }: { context?: string, onClose?: () => void }) => {
  const [isOpen, setIsOpen] = useState(true); // Default to true if managed by parent
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages([...messages, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiAPI.chat({
        message: input,
        history: messages,
        context: context
      });
      setMessages(prev => [...prev, { role: "assistant", content: res.data.response }]);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setMessages(prev => [...prev, { role: "assistant", content: "Architecture access requires an active session. Please **login** or **sign up** to chat with CodeBuddy." }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting to the Architect Core right now. Please try again later." }]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} whileHover={{ scale: 1.05 }} onClick={() => setIsOpen(true)} className="w-14 h-14 rounded-full bg-blue-600 shadow-2xl flex items-center justify-center text-white border border-white/10 hover:bg-blue-500 transition-colors">
             <MessageSquare className="w-6 h-6" />
          </motion.button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className={`glass-panel p-0 flex flex-col border-white/10 shadow-2xl bg-brand-bg-secondary/95 backdrop-blur-3xl overflow-hidden transition-all duration-300 ${minimized ? 'h-16 w-72' : 'h-[550px] w-[380px]'}`}>
             {/* Header */}
             <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <Bot className="w-4 h-4" />
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-white leading-none">AI CodeBuddy</h4>
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mt-1">Operational</p>
                   </div>
                </div>
                <div className="flex items-center gap-1">
                   <button onClick={() => setMinimized(!minimized)} className="p-1.5 text-white/20 hover:text-white transition-colors">
                      {minimized ? <Maximize2 className="w-4 h-4" /> : <MinusSquare className="w-4 h-4" />}
                   </button>
                   <button onClick={() => { setIsOpen(false); onClose?.(); }} className="p-1.5 text-white/20 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                   </button>
                </div>
             </div>
 
             {!minimized && (
               <>
                 {/* Body */}
                 <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {messages.length === 0 && (
                       <div className="h-full flex flex-col items-center justify-center text-center px-6">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                             <Sparkles className="w-6 h-6 text-blue-400/40" />
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed font-light">I'm your AI tutor. Ask me anything about {context || 'coding'}!</p>
                       </div>
                    )}
                    {messages.map((m, i) => (
                       <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3 px-4 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'}`}>
                             {m.content}
                          </div>
                       </div>
                    ))}
                    {loading && (
                       <div className="flex justify-start">
                          <div className="bg-white/5 p-3 px-5 rounded-2xl border border-white/5 flex gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce [animation-delay:-0.3s]" />
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce [animation-delay:-0.15s]" />
                             <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" />
                          </div>
                       </div>
                    )}
                 </div>
 
                 {/* Footer */}
                 <div className="p-4 bg-white/[0.02] border-t border-white/5">
                    <div className="bg-white/5 rounded-2xl border border-white/5 p-1 flex items-center gap-1 focus-within:border-blue-500/50 transition-all">
                       <input 
                          type="text" 
                          placeholder="Type your question..." 
                          className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-3 text-white placeholder:text-gray-600"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                       />
                       <button onClick={handleSend} disabled={!input.trim() || loading} className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 transition-all disabled:opacity-50">
                          <Send className="w-3.5 h-3.5" />
                       </button>
                    </div>
                 </div>
               </>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
