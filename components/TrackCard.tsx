"use client";
import React from "react";
import { motion } from "framer-motion";
import { Clock, Trophy, ArrowRight, Play, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "./ui/ProgressBar";

interface TrackCardProps {
  title: string;
  slug: string;
  description: string;
  icon: any;
  completedModules: number;
  totalModules: number;
  estimatedTime: string;
  index: number;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  title,
  slug,
  description,
  icon: Icon,
  completedModules,
  totalModules,
  estimatedTime,
  index
}) => {
  const percentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const isStarted = completedModules > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/learn/${slug}`} className="block">
        <div className="relative p-6 rounded-2xl bg-[#0f172a] border border-slate-700 hover:border-blue-500/50 transition-all duration-300 shadow-xl overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-all duration-500" />
          
          <div className="relative z-10">
            {/* Header: Icon & Meta */}
            <div className="flex items-start justify-between mb-8">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Estimated Time</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-medium">{estimatedTime}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-8 line-clamp-2">
              {description || `Master ${title} architecture from foundational logic to professional SaaS integration.`}
            </p>

            {/* Progress Section */}
            <div className="space-y-4 mb-8">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Progress</span>
                  <div className="text-sm font-bold text-white uppercase tracking-tight">
                    {completedModules} <span className="text-slate-600">/</span> {totalModules} <span className="text-slate-600 text-[11px]">Modules</span>
                  </div>
                </div>
                <div className="text-xl font-bold text-blue-500">{percentage}%</div>
              </div>
              <ProgressBar progress={percentage} />
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <Trophy className="w-3.5 h-3.5 text-amber-500/50" />
                      {percentage === 100 ? "Sync Complete" : "Sync Active"}
                   </div>
                </div>
                <div className={`px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all 
                  ${isStarted 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-blue-500/50 group-hover:text-white'}`}>
                   {isStarted ? "Continue" : "Start"}
                   <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
