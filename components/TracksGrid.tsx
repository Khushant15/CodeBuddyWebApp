"use client";
import React from "react";
import { TrackCard } from "./TrackCard";
import { Code, Globe, Palette, Terminal, Layout, Layers, Hash } from "lucide-react";

interface TracksGridProps {
  tracksProgress: Record<string, number>;
  trackTotals: Record<string, number>;
}

export const TracksGrid: React.FC<TracksGridProps> = ({ tracksProgress, trackTotals }) => {
  const tracks = [
    { 
      title: "Python", 
      slug: "python", 
      desc: "Learn Python from basics to advanced concepts with real examples.", 
      icon: Code, 
      duration: "40h" 
    },
    { 
      title: "JavaScript", 
      slug: "javascript", 
      desc: "Learn JavaScript for building interactive websites and applications.", 
      icon: Terminal, 
      duration: "50h" 
    },
    { 
      title: "React", 
      slug: "react", 
      desc: "Build modern user interfaces using React and component-based design.", 
      icon: Layout, 
      duration: "45h" 
    },
    { 
      title: "HTML", 
      slug: "html", 
      desc: "Learn how to structure web pages using HTML.", 
      icon: Globe, 
      duration: "25h" 
    },
    { 
      title: "CSS", 
      slug: "css", 
      desc: "Style websites using CSS, layouts, and responsive design.", 
      icon: Palette, 
      duration: "35h" 
    },
    { 
      title: "Node.js", 
      slug: "node", 
      desc: "Build backend applications and APIs using Node.js.", 
      icon: Layers, 
      duration: "40h" 
    },
    { 
      title: "DSA", 
      slug: "dsa", 
      desc: "Practice data structures and algorithms for problem solving.", 
      icon: Hash, 
      duration: "60h" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {tracks.map((track, i) => (
        <TrackCard
          key={track.slug}
          index={i}
          title={track.title}
          slug={track.slug}
          description={track.desc}
          icon={track.icon}
          estimatedTime={track.duration}
          completedModules={tracksProgress[track.slug] || 0}
          totalModules={trackTotals[track.slug] || 0}
        />
      ))}
    </div>
  );
};
