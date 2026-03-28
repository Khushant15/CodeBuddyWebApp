"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signupWithEmail, loginWithGoogle } from "@/app/firebase/authMethods";
import { getOrCreateUserProfile } from "@/lib/userService";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const user = await signupWithEmail(form.email, form.password);
      if (user) {
        await getOrCreateUserProfile(user.uid, user.email || "", form.name);
      }
      toast.success("Signup successful. Welcome to CodeBuddy.");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setErrors({ email: message.includes("email-already-in-use") ? "Account already exists" : "Registration failed" });
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signup verified.");
      router.push("/home");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Third-party link failed";
      toast.error(message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0B1120]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="p-10 rounded-[32px] border border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-blue-500 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white uppercase">CodeBuddy Signup</h1>
            <p className="text-[10px] text-gray-600 mt-3 font-bold uppercase tracking-[0.3em]">Initialize your professional signup</p>
          </div>

          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-4 py-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-all mb-8 shadow-sm">
            <Chrome className="w-4 h-4" />
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-bold text-gray-800 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { key: "name", label: "Full Name", icon: User, type: "text", ph: "Enter your name" },
              { key: "email", label: "Email Address", icon: Mail, type: "email", ph: "you@example.com" },
            ].map(f => (
              <div key={f.key}>
                <label className="flex items-center gap-2 text-[10px] font-bold text-gray-700 mb-2.5 uppercase tracking-widest">
                  <f.icon className="w-3.5 h-3.5" /> {f.label}
                </label>
                <input type={f.type} placeholder={f.ph}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-800 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all" />
                {errors[f.key] && <p className="text-[10px] text-red-400/80 mt-2 font-bold uppercase tracking-widest">{errors[f.key]}</p>}
              </div>
            ))}

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-700 mb-2.5 uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} placeholder="Min 6 characters" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-800 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all pr-12" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-400/80 mt-2 font-bold uppercase tracking-widest">{errors.password}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-700 mb-2.5 uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" /> Confirm Password
              </label>
              <input type="password" placeholder="Repeat access key" value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })} 
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white placeholder:text-gray-800 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all" />
              {errors.confirm && <p className="text-[10px] text-red-400/80 mt-2 font-bold uppercase tracking-widest">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} 
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 mt-4 disabled:opacity-50">
              {loading ? "CREATING ACCOUNT..." : <><ArrowRight className="w-4 h-4" /> Complete Signup</>}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-600 mt-10 font-bold uppercase tracking-widest">
            Already verified?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 transition-colors">Enter sector</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
