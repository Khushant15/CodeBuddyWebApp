"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, ShieldCheck, TrendingUp, Search, MoreVertical, LayoutGrid, List } from 'lucide-react';
import { AuthGuard } from '@/components/AuthGuard';
import { adminAPI } from '@/lib/apiClient';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // In a real app, you'd check a custom claim or a user doc
        // For this demo, we'll try to fetch stats; if it fails with 403, they aren't admin
        try {
          const sRes = await adminAPI.getStats();
          setStats(sRes.data);
          const uRes = await adminAPI.getUsers();
          setUsers(uRes.data.data || []);
          setIsAdmin(true);
        } catch (err: any) {
          if (err.response?.status === 403) {
            toast.error("Access Denied: Neural pattern mismatch.");
          }
        }
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-800 font-bold text-[10px] tracking-[0.5em] animate-pulse uppercase bg-[#0B1120]">Initializing Administrative Authority...</div>;
  if (!isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-10 bg-[#0B1120]">
      <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 text-blue-500">
        <ShieldCheck className="w-10 h-10" />
      </div>
      <h1 className="text-xl font-bold uppercase tracking-[0.3em]">ACCESS RESTRICTED</h1>
      <p className="text-gray-700 mt-4 text-[10px] font-bold uppercase tracking-[0.4em]">Error: Authentication failed for administrative node</p>
    </div>
  );

  return (
    <AuthGuard>
      <div className="container py-20 pb-32">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 relative z-10">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
               <p className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.4em] mb-4">Administrative Authority</p>
               <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-none">
                  CENTRAL <span className="text-blue-500">COMMAND</span>
               </h1>
            </motion.div>
            
            <div className="flex items-center gap-6">
               <div className="p-8 px-12 rounded-[32px] border border-white/5 bg-white/[0.01] text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] rounded-full" />
                  <div className="text-4xl font-bold text-white relative z-10">{stats?.users || 0}</div>
                  <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em] relative z-10 mt-3">Node Count</div>
               </div>
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { title: 'MODULES', value: stats?.lessons || 0, icon: BookOpen, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" },
              { title: 'LOGIC NODES', value: stats?.problems || 0, icon: LayoutGrid, iconBg: "bg-indigo-500/10", iconColor: "text-indigo-400" },
              { title: 'ANOMALIES', value: 0, icon: MessageSquare, iconBg: "bg-amber-500/10", iconColor: "text-amber-500" }
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="p-12 rounded-[40px] border border-white/5 bg-white/[0.01] relative overflow-hidden group hover:bg-white/[0.02] transition-all">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/5 ${s.iconBg}`}>
                    <s.icon className={`w-6 h-6 ${s.iconColor} group-hover:scale-110 transition-transform`} />
                  </div>
                  <div className="text-5xl font-bold text-white mb-3">{s.value}</div>
                  <div className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em]">{s.title}</div>
                </div>
              </motion.div>
            ))}
         </div>

         <div className="rounded-[40px] border border-white/5 bg-white/[0.01] overflow-hidden relative z-10 shadow-2xl">
            <div className="p-10 px-12 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
               <h3 className="text-xs font-bold text-white uppercase tracking-[0.4em] flex items-center gap-4">
                  <Users className="w-5 h-5 text-blue-500" /> IDENTITY DIRECTORY
               </h3>
               <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-gray-800 absolute left-5 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="QUERY_UID..." 
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-xs text-white placeholder:text-gray-800 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.04] transition-all" />
               </div>
            </div>
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="px-12 py-8 text-[10px] font-bold text-gray-800 uppercase tracking-[0.3em]">Identifier</th>
                        <th className="px-12 py-8 text-[10px] font-bold text-gray-800 uppercase tracking-[0.3em]">Link Node</th>
                        <th className="px-12 py-8 text-[10px] font-bold text-gray-800 uppercase tracking-[0.3em]">Status</th>
                        <th className="px-12 py-8 text-[10px] font-bold text-gray-800 uppercase tracking-[0.3em]">Authority</th>
                        <th className="px-12 py-8 text-[10px] font-bold text-gray-800 uppercase tracking-[0.3em]"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/[0.01] transition-all group">
                           <td className="px-12 py-10">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-lg uppercase shadow-inner">
                                    {u.displayName?.charAt(0) || 'D'}
                                 </div>
                                 <div className="min-w-0">
                                    <div className="text-base font-bold text-white uppercase tracking-tight truncate">{u.displayName}</div>
                                    <div className="text-[10px] font-bold text-gray-800 uppercase tracking-widest mt-1.5 font-mono">{u.firebaseUID.slice(0, 8)}...</div>
                                 </div>
                              </div>
                           </td>
                           <td className="px-12 py-10 text-[13px] text-gray-500 font-light lowercase">{u.email}</td>
                           <td className="px-12 py-10">
                              <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-bold uppercase tracking-[0.2em] border border-green-500/20">OPERATIONAL</span>
                           </td>
                           <td className="px-12 py-10">
                              <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border ${u.role === 'admin' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-white/5 text-gray-700 border-white/5'}`}>
                                 {u.role}
                              </span>
                           </td>
                           <td className="px-12 py-10 text-right">
                              <button className="p-3 rounded-2xl hover:bg-white/10 text-gray-800 hover:text-white transition-all">
                                 <MoreVertical className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </AuthGuard>
  );
}
