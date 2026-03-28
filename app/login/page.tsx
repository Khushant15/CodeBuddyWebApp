"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/app/firebase/authMethods";
import { getOrCreateUserProfile } from "@/lib/userService";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [terminalLine, setTerminalLine] = useState(0);

  const termLines = [
    "$ codebuddy --login",
    "✓ engine_status: operational",
    "✓ connection: ready",
    "✓ Ready for credentials >_",
  ];

  useEffect(() => {
    const t = setInterval(() => setTerminalLine(p => p < termLines.length - 1 ? p + 1 : p), 600);
    return () => clearInterval(t);
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleEmail = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await loginWithEmail(form.email, form.password);
      if (user) {
        await getOrCreateUserProfile(user.uid, user.email || "", user.displayName || "Developer");
      }
      toast.success("Login successful.");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setErrors({ email: message.includes("user-not-found") ? "Account not found" : message.includes("wrong-password") ? "Invalid password" : "Authentication failed. Check your credentials." });
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Google login verified.");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Third-party link failed";
      toast.error(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0B1120]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        {/* Terminal header */}
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01] mb-8">
          <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
            </div>
            <span className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.4em]">auth_protocol.v2</span>
          </div>
          <div className="p-6 font-mono text-[11px] leading-relaxed">
            {termLines.slice(0, terminalLine + 1).map((l, i) => (
              <div key={i} className={i === terminalLine ? "text-blue-500 font-bold" : "text-gray-600"}>{l}</div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="p-10 rounded-[32px] border border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-inner">
              <Terminal className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">CodeBuddy Login</h1>
            <p className="text-[10px] text-gray-600 mt-3 font-bold uppercase tracking-[0.3em]">Welcome back to the platform</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-4 py-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all mb-8 shadow-sm">
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleEmail} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-700 mb-2.5 uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <input type="email" placeholder="dev@sector.core" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} 
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-800 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all" />
              {errors.email && <p className="text-[10px] text-red-400/80 mt-2 font-bold uppercase tracking-widest">{errors.email}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-700 mb-2.5 uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-800 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-400/80 mt-2 font-bold uppercase tracking-widest">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} 
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 mt-4 disabled:opacity-50">
              {loading ? "AUTHENTICATING..." : <><ArrowRight className="w-4 h-4" /> Login to Account</>}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-600 mt-10 font-bold uppercase tracking-widest">
            No account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
