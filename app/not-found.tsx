"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-[12rem] md:text-[18rem] font-bold leading-none mb-4 text-white/[0.03] select-none tracking-tighter">
          404
        </div>
        <div className="relative -mt-24 mb-12">
          <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]">
            <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
              </div>
              <span className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.4em]">system.error</span>
            </div>
            <div className="p-6 font-mono text-[11px] text-left leading-relaxed">
              <div className="flex gap-3"><span className="text-blue-500">{" >> "}</span> <span className="text-white">cd /requested-node</span></div>
              <div className="text-red-400 mt-2 ml-7 uppercase tracking-widest font-bold">Error: Node not found in core_memory</div>
              <div className="mt-4 ml-7 text-gray-700">✓ protocol: redirected_to_safety</div>
              <div className="mt-2"><span className="text-blue-500">{" >> "}</span> <span className="w-2 h-4 bg-blue-500 animate-pulse inline-block" /></div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-[0.3em] text-white mb-4 uppercase">
          PROTOCOL FAILURE
        </h1>
        <p className="text-gray-500 text-base mb-12 max-w-sm mx-auto font-light leading-relaxed">
          The requested architectural node does not exist or has been decommissioned.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/" className="px-10 py-5 rounded-2xl bg-blue-500 text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3">
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link href="/learn" className="px-10 py-5 rounded-2xl border border-white/5 bg-white/[0.02] text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3">
            <ArrowLeft className="w-4 h-4" /> Resume Learning
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
