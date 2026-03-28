// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\components\RoadmapTree.tsx
"use client";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Node {
  id: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

interface Level {
  id: string;
  name: string;
  status: 'Completed' | 'In Progress' | 'Locked';
  nodes: Node[];
}

interface RoadmapTopic {
  topic: string;
  name: string;
  levels: Level[];
}

export const RoadmapTree = ({ data }: { data: RoadmapTopic }) => {
  const colorMap: any = {
    html: '#60A5FA', // blue-400
    css: '#818CF8',  // indigo-400
    python: '#3B82F6', // blue-500
    javascript: '#F59E0B', // amber-500
    react: '#38BDF8', // sky-400
    node: '#10B981', // emerald-500
    dsa: '#8B5CF6'    // violet-500
  };

  const themeColor = colorMap[data.topic] || '#3B82F6';

  const totalNodes = data.levels.reduce((acc, lvl) => acc + lvl.nodes.length, 0);
  const completedNodes = data.levels.reduce((acc, lvl) => acc + lvl.nodes.filter(n => n.status === 'Completed').length, 0);
  const progressPercent = Math.round((completedNodes / totalNodes) * 100);

  return (
    <div className="space-y-12 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl font-bold uppercase shadow-inner" style={{ background: `${themeColor}10`, border: `1px solid ${themeColor}20`, color: themeColor }}>
             {data.topic.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">{data.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em]">Module Proficiency</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5" style={{ color: themeColor }}>{progressPercent}% COMPLETE</span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-sm">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" style={{ background: themeColor }} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting lines for desktop (Subtle SaaS style) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10" />
        
        {data.levels.map((lvl, pi) => (
          <motion.div key={lvl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.1 }}>
            <div className={`p-8 rounded-3xl h-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all relative ${lvl.status === 'Locked' ? 'opacity-40 grayscale pointer-events-none' : 'group'}`}>
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold" style={{ background: `${themeColor}15`, color: themeColor, border: `1px solid ${themeColor}20` }}>
                    0{pi + 1}
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold tracking-widest text-white/90 uppercase">{lvl.name}</h3>
                    <p className="text-[9px] font-bold text-gray-800 uppercase tracking-widest mt-1.5">{lvl.status}</p>
                  </div>
                </div>
                {lvl.status === 'Locked' && <Lock className="w-4 h-4 text-gray-800" />}
                {lvl.status === 'Completed' && <CheckCircle className="w-5 h-5 text-emerald-500/80" />}
              </div>

              <div className="space-y-4 ml-2">
                {lvl.nodes.map((node, si) => (
                  <div key={node.id} className="flex items-center gap-4 group/node">
                    {node.status === 'Completed' ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 shrink-0" />
                    ) : node.status === 'In Progress' ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-800 shrink-0" />
                    )}
                    <Link href={`/learn/${data.topic}`} className={`text-[12px] font-medium transition-colors ${lvl.status === 'Locked' ? 'text-gray-800' : node.status === 'Completed' ? 'text-gray-500' : 'text-gray-400 group-hover/node:text-blue-400'}`}>
                      {node.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
