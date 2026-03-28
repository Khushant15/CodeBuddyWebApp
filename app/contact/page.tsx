"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send, CheckCircle, Github, Linkedin, Globe, ChevronDown, Rocket, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Protocol error: All transmission fields required.");
      return;
    }
    
    setLoading(true);
    
    // Web3Forms API Integration
    const formData = new FormData();
    formData.append("access_key", "0e4a70e0-9df8-45b2-b472-431e5a710291");
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("subject", form.subject);
    formData.append("message", form.message);
    formData.append("from_name", "CodeBuddy Protocol Agent");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setSent(true);
        toast.success("Transmission Received.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(result.message || "Inbound Protocol Failure.");
      }
    } catch (err) {
      console.error("Web3Forms Protocol Error:", err);
      toast.error("An error occurred during transmission.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <div className="container py-20 min-h-[90vh] flex items-center justify-center relative overflow-hidden">
       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
       
       <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-16 max-w-lg w-full text-center border-blue-500/30 relative z-10">
        <div className="w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-10 text-blue-400 relative">
          <CheckCircle className="w-12 h-12" />
          <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full" />
        </div>
        <h2 className="text-3xl font-heading font-900 tracking-tight text-white mb-6 uppercase">TRANSMISSION SUCCESSFUL</h2>
        <p className="text-[14px] text-white/40 mb-12 font-light leading-relaxed italic">
          The message has been prioritized and dispatched to the architect node at Sector Vasai. Protocol response expected shortly.
        </p>
        <button onClick={() => setSent(false)} className="w-full py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-heading font-900 uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          Begin New Session
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="container py-20 pb-40">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-24 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] font-mono font-900 text-blue-500 uppercase tracking-widest mb-6">
           <Sparkles className="w-3.5 h-3.5" /> Neural Communication Link
        </div>
        <h1 className="text-5xl md:text-8xl font-heading font-900 text-white mb-8 uppercase tracking-tighter leading-none">
          GET IN <span className="gradient-heading">TOUCH</span>
        </h1>
        <p className="text-white/30 max-w-2xl mx-auto text-[16px] font-light leading-relaxed italic">
           Have a question or want to work together? Drop a message in the encrypted link below.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-panel p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
              <h3 className="text-[11px] font-heading font-900 tracking-[0.4em] text-white/20 mb-10 uppercase">COMMUNICATION NODES</h3>
              <div className="grid gap-10">
                {contactInfo.map((c, i) => (
                  <div key={c.title} className="flex items-start gap-6 group">
                    <a href={c.link} target={c.link.startsWith('http') ? '_blank' : undefined} className="flex items-start gap-6 w-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/5 bg-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-600/30 transition-all duration-500 shadow-inner`}>
                        <c.icon className={`w-6 h-6 text-white/30 group-hover:text-blue-400 transition-colors`} />
                      </div>
                      <div className="min-w-0 py-1">
                        <div className="text-[10px] font-heading font-900 text-white/40 uppercase tracking-[0.2em] mb-1.5">{c.title}</div>
                        <div className="text-[16px] text-white/70 break-words font-light group-hover:text-white transition-colors">{c.value}</div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-panel p-10 rounded-[40px] border-white/5 bg-white/[0.01]">
              <h3 className="text-[11px] font-heading font-900 tracking-[0.4em] text-white/20 mb-8 uppercase">KNOWLEDGE BASE</h3>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i} className={`p-5 rounded-2xl border transition-all duration-500 ${activeFaq === i ? 'bg-white/5 border-white/10' : 'border-transparent hover:border-white/5'}`}>
                    <button 
                      onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h4 className="text-[13px] font-heading font-900 text-white uppercase tracking-tight">{f.q}</h4>
                      <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-500 ${activeFaq === i ? 'rotate-180 text-blue-400' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="pt-4 text-[13px] text-white/40 leading-relaxed font-light italic">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-panel p-12 rounded-[48px] border-white/5 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full transition-all duration-700 group-hover:bg-blue-600/20" />
              
              <div className="flex items-center justify-between mb-12">
                 <h2 className="text-[11px] font-heading font-900 tracking-[0.4em] text-white/20 uppercase">SEND TRANSMISSION</h2>
                 <ShieldCheck className="w-5 h-5 text-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { key: "name", label: "Identity", ph: "Enter your handle", type: "text" },
                    { key: "email", label: "Link Node", ph: "you@sector.core", type: "email" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-[10px] font-heading font-900 text-white/30 uppercase tracking-[0.2em] block mb-3 pl-1">{f.label}</label>
                      <input 
                        type={f.type} 
                        placeholder={f.ph} 
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })} 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4.5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05] transition-all duration-300 shadow-inner" 
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] font-heading font-900 text-white/30 uppercase tracking-[0.2em] block mb-3 pl-1">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Protocol topic" 
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })} 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4.5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05] transition-all duration-300 shadow-inner" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-heading font-900 text-white/30 uppercase tracking-[0.2em] block mb-3 pl-1">Message</label>
                  <textarea 
                    rows={6} 
                    placeholder="Elaborate on objectives…" 
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05] transition-all duration-300 resize-none font-light shadow-inner" 
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full group/btn relative flex items-center justify-center gap-4 py-6 rounded-2xl bg-blue-600 text-white text-[12px] font-heading font-900 uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all duration-300 disabled:opacity-50 overflow-hidden shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4.5 h-4.5" /> Initialize Transmission</>}
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const contactInfo = [
  { title: "Direct Link", value: "khushantsharma766@gmail.com", icon: Mail, link: "mailto:khushantsharma766@gmail.com" },
  { title: "Personal Hub", value: "github.com/Khushant15", icon: Github, link: "https://github.com/Khushant15" },
  { title: "Experience Node", value: "in/khushant-sharma", icon: Linkedin, link: "https://www.linkedin.com/in/khushant-sharma-9318962b2/" },
  { title: "Core Sector", value: "Vasai, India", icon: MapPin, link: "#" },
];

const faqs = [
  { q: "How do I reset my access key?", a: "Initialize 'Forgot Access Key' on the authentication page and follow the encrypted instructions." },
  { q: "Is CodeBuddy free access?", a: "Yes! CodeBuddy offers a comprehensive free tier with access to most industrial modules." },
  { q: "Do you offer certifications?", a: "Yes, we provide master-level certifications for finished learning tracks." },
  { q: "Can I export my status?", a: "You can export your architectural status and achievements from your central dashboard." },
];
