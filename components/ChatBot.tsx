"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Trash2 } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  ts: Date;
}

const WELCOME: Message = {
  id: 0,
  role: "assistant",
  ts: new Date(),
  content: "Greetings. I am the **Architect Intelligence** unit.\n\nI am prepared to assist with:\n• System Debugging\n• Architectural Consultation\n• Logic Optimization\n• Pattern Analysis\n\nSpecify your objective.",
};

function renderContent(text: string) {
  return text
    .split("\n")
    .map((line, i) => {
      const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={j} className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[11px] font-mono border border-blue-500/20">{part.slice(1, -1)}</code>;
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        return <span key={j}>{part}</span>;
      });
      return <div key={i} className={i < text.split("\n").length - 1 ? "mb-1" : ""}>{parts}</div>;
    });
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: Date.now(), role: "user", content: msg, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply || data.error || "⚠️ System failure detected.",
        ts: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: "assistant", ts: new Date(),
        content: "⚠️ Network node unreachable.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center transition-all border ${open ? 'bg-[#111827] border-white/10 text-white' : 'bg-blue-600 border-blue-500 text-white shadow-blue-500/20'}`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0B1120]">
            {unread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-50 w-[400px] h-[600px] flex flex-col bg-[#0B1120] border border-white/5 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-blue-500" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-[#0B1120]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-[0.2em] text-white uppercase">ARCHITECT INTELLIGENCE</div>
                  <div className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1">Operational State: Active</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMessages([WELCOME])} className="p-2.5 rounded-xl text-gray-800 hover:text-white hover:bg-white/5 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setOpen(false)} className="p-2.5 rounded-xl text-gray-800 hover:text-white hover:bg-white/5 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 no-scrollbar">
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${m.role === "assistant" ? "bg-white/5 border border-white/5" : "bg-blue-500/10 border border-blue-500/20"}`}>
                    {m.role === "assistant"
                      ? <Bot className="w-4 h-4 text-gray-600" />
                      : <User className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-[13px] leading-relaxed shadow-sm ${m.role === "assistant" ? "bg-white/[0.03] border border-white/5 text-gray-300 rounded-tl-sm" : "bg-blue-600 text-white rounded-tr-sm shadow-blue-500/10"}`}>
                    {renderContent(m.content)}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="px-5 py-4 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-bounce [animation-delay:-0.3s]" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.2em]">Processing...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-6 bg-white/[0.01] border-t border-white/5">
              <div className="flex gap-3 items-end">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Inquiry for the Architect..."
                  className="flex-1 bg-white/[0.04] border border-white/5 rounded-2xl px-5 py-4 text-[13px] text-white placeholder:text-gray-800 outline-none resize-none max-h-[120px] focus:border-blue-500/30 transition-all font-light"
                  style={{ minHeight: 52 }}
                  onInput={e => {
                    const t = e.currentTarget;
                    t.style.height = "auto";
                    t.style.height = Math.min(t.scrollHeight, 120) + "px";
                  }}
                />
                <button onClick={send} disabled={!input.trim() || loading}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-lg ${input.trim() && !loading ? 'bg-blue-600 text-white shadow-blue-500/20 active:scale-95' : 'bg-white/5 text-gray-800 opacity-50'}`}>
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[9px] font-bold text-gray-800 mt-3 text-center uppercase tracking-[0.2em]">Core Logic Grid Enabled</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
