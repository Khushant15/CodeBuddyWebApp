"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { CheckCircle, Lock, ChevronDown, Palette, BookOpen, ArrowLeft, Play, Copy, Check } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { completeLessonInFirebase, getOrCreateUserProfile } from "@/lib/userService";

const lessons = [
  {
    id: 1, title: "CSS Syntax & Selectors", xp: 55, duration: "20 min", locked: false,
    theory: `CSS (Cascading Style Sheets) styles HTML elements.

Basic syntax:
selector {
  property: value;
}

Selectors:
• element  — h1, p, div (all of that tag)
• .class   — .card, .btn (by class name)
• #id      — #header (by unique ID)
• *        — all elements
• a, b     — multiple selectors
• a > b    — direct child only`,
    example: `/* Element selector */
h1 {
  color: blue;
  font-size: 32px;
}

/* Class selector */
.card {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

/* ID selector */
#header {
  position: fixed;
  top: 0;
}

/* Multiple selectors */
h1, h2, h3 {
  font-family: sans-serif;
  font-weight: bold;
}`,
    exercise: `/* Style the .button class:
   - color: white
   - background-color: #0ea5e9
   - border-radius: 8px
   - padding: 12px 24px */

.___ {
  color: ___;
  background-color: ___;
  border-radius: ___;
  padding: ___ ___;
}`,
    solution: `.button {\n  color: white;\n  background-color: #0ea5e9;\n  border-radius: 8px;\n  padding: 12px 24px;\n}`,
  },
  {
    id: 2, title: "Colors & Typography", xp: 60, duration: "20 min", locked: false,
    theory: `CSS colors can be written as:
• Named:  red, blue, green, black, white
• Hex:    #ff0000, #00f, #333333
• RGB:    rgb(255, 0, 0)
• RGBA:   rgba(0, 0, 0, 0.5)  ← with transparency
• HSL:    hsl(120, 100%, 50%)

Key typography properties:
• font-family   — typeface name
• font-size     — px, rem, em
• font-weight   — 100-900, bold, normal
• line-height   — vertical line spacing
• text-align    — left / center / right / justify
• letter-spacing — space between characters
• text-decoration — underline, none`,
    example: `body {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  color: #1a1a2e;
  line-height: 1.6;
}

h1 {
  font-size: 2.5rem;       /* 40px */
  font-weight: 800;
  color: #0ea5e9;
  text-align: center;
  letter-spacing: -0.02em;
}

.muted {
  color: rgba(0, 0, 0, 0.45);
  font-size: 0.875rem;     /* 14px */
}

a {
  text-decoration: none;
  color: #7c3aed;
}`,
    exercise: `/* Style the h1:
   - centered text
   - font-size: 2rem
   - color: #7c3aed (purple)
   - font-weight: bold
   - letter-spacing: 0.05em */

h1 {
  text-align: ___;
  font-size: ___;
  color: ___;
  font-weight: ___;
  letter-spacing: ___;
}`,
    solution: `h1 {\n  text-align: center;\n  font-size: 2rem;\n  color: #7c3aed;\n  font-weight: bold;\n  letter-spacing: 0.05em;\n}`,
  },
  {
    id: 3, title: "Box Model", xp: 75, duration: "25 min", locked: false,
    theory: `Every HTML element is a rectangular box with 4 layers:

  ┌─────── margin ────────┐
  │  ┌──── border ──────┐  │
  │  │  ┌─ padding ─┐  │  │
  │  │  │  content  │  │  │
  │  │  └───────────┘  │  │
  │  └─────────────────┘  │
  └───────────────────────┘

• content  — actual text/image area
• padding  — inner spacing (inside border)
• border   — the line around it
• margin   — outer spacing (outside border)

Pro tip: Add this to every project:
* { box-sizing: border-box; }
This makes width/height include padding & border.`,
    example: `.card {
  /* Size */
  width: 300px;

  /* Padding — shorthand: top right bottom left */
  padding: 20px 24px;     /* 20px top/bottom, 24px left/right */
  padding-top: 10px;      /* override just top */

  /* Border */
  border: 2px solid #0ea5e9;
  border-radius: 12px;

  /* Margin */
  margin: 16px auto;      /* 16px top/bottom, centered */
  margin-bottom: 32px;

  /* Best practice */
  box-sizing: border-box;
}`,
    exercise: `/* Give .box:
   - 24px padding on all sides
   - 16px margin bottom only
   - 2px solid border color #10b981
   - border-radius: 12px
   - box-sizing: border-box */

.box {
  padding: ___;
  margin-bottom: ___;
  border: ___ ___ ___;
  border-radius: ___;
  box-sizing: ___;
}`,
    solution: `.box {\n  padding: 24px;\n  margin-bottom: 16px;\n  border: 2px solid #10b981;\n  border-radius: 12px;\n  box-sizing: border-box;\n}`,
  },
  {
    id: 4, title: "Flexbox", xp: 90, duration: "30 min", locked: true,
    theory: `Flexbox makes 1D layouts (row or column) easy.

Apply display: flex to the CONTAINER:

Container properties:
• flex-direction: row | column | row-reverse
• justify-content: flex-start | center | flex-end
                   space-between | space-around | space-evenly
• align-items: flex-start | center | flex-end | stretch
• gap: 16px          ← space between items
• flex-wrap: wrap | nowrap

Item properties:
• flex: 1            ← fill remaining space
• flex: 0 0 200px    ← fixed 200px wide
• align-self: center ← override parent align-items`,
    example: `/* Horizontal nav bar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
}

/* Centered card */
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

/* Equal columns */
.grid {
  display: flex;
  gap: 20px;
}
.grid > * {
  flex: 1;   /* each child takes equal space */
}`,
    exercise: `/* Create a row that:
   - spaces items evenly (with gaps)
   - vertically centers them
   - wraps on small screens */

.container {
  display: ___;
  justify-content: ___;
  align-items: ___;
  flex-wrap: ___;
  gap: 16px;
}`,
    solution: `.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 16px;\n}`,
  },
  {
    id: 5, title: "CSS Grid", xp: 95, duration: "30 min", locked: true,
    theory: `CSS Grid is for 2D layouts (rows AND columns).

Container:
• display: grid
• grid-template-columns: repeat(3, 1fr)
• grid-template-rows: auto 1fr auto
• gap: 20px            ← space between cells
• grid-template-areas  ← named layout areas

Item placement:
• grid-column: 1 / 3   ← span cols 1 to 3
• grid-row: 1 / 2      ← span rows 1 to 2
• grid-area: header    ← use named area

Responsive shortcut:
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
This auto-creates columns that are at least 250px each.`,
    example: `/* 3-column card grid */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* Holy Grail Layout */
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

header { grid-area: header; }
nav    { grid-area: nav; }
main   { grid-area: main; }
aside  { grid-area: aside; }
footer { grid-area: footer; }`,
    exercise: `/* Create a 2-column grid with 20px gaps
   and auto rows */

.grid {
  display: ___;
  grid-template-columns: repeat(___, 1fr);
  gap: ___;
}`,
    solution: `.grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n}`,
  },
  {
    id: 6, title: "Animations & Transitions", xp: 100, duration: "25 min", locked: true,
    theory: `CSS transitions animate property changes smoothly.

transition: property duration timing-function delay;

Common timing functions:
• ease (default) — slow → fast → slow
• linear         — constant speed
• ease-in        — starts slow
• ease-out       — ends slow
• cubic-bezier() — custom curve

Keyframe animations:
@keyframes name {
  from { ... }
  to   { ... }
}

or use percentages: 0%, 50%, 100%

Apply: animation: name duration timing iteration;`,
    example: `/* Hover transition */
.button {
  background: #0ea5e9;
  transition: background 0.3s ease,
              transform 0.2s ease,
              box-shadow 0.3s ease;
}
.button:hover {
  background: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

/* Spin animation */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero {
  animation: fadeIn 0.6s ease-out forwards;
}`,
    exercise: `/* Add a smooth color transition to .card
   that takes 0.3s with ease timing
   Also add a hover state that changes
   background to #f0fdf4 */

.card {
  background: white;
  transition: background ___ ___;
}

.card:___  {
  background: #f0fdf4;
}`,
    solution: `.card {\n  background: white;\n  transition: background 0.3s ease;\n}\n\n.card:hover {\n  background: #f0fdf4;\n}`,
  },
];

export default function CSSLearnPage() {
  const [openLesson, setOpenLesson] = useState<number | null>(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        const profile = await getOrCreateUserProfile(u.uid, u.email || "", u.displayName || "Developer");
        const done = profile.completedLessons
          .filter(k => k.startsWith("css-"))
          .map(k => parseInt(k.replace("css-", "")));
        setCompletedLessons(done);
      }
    });
    return unsub;
  }, []);

  const markComplete = async (id: number) => {
    if (completedLessons.includes(id)) return;
    setCompletedLessons(prev => [...prev, id]);
    if (uid) {
      const lesson = lessons.find(l => l.id === id);
      await completeLessonInFirebase(uid, `css-${id}`, lesson?.xp || 55);
    }
  };

  const copyCode = async (code: string, id: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalXP = completedLessons.reduce((sum, id) => {
    const l = lessons.find(x => x.id === id);
    return sum + (l?.xp || 0);
  }, 0);

  return (
    <AuthGuard>
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-[var(--neon-cyan)] mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tracks
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,255,0.1)] border border-[rgba(0,229,255,0.2)] flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[var(--neon-cyan)]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-widest">Learning Track</p>
                  <h1 className="font-heading text-2xl md:text-4xl font-800 text-white">CSS <span className="neon-text-cyan">MASTERY</span></h1>
                </div>
              </div>
              <p className="text-white/40 text-sm">6 lessons · Selectors to animations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-cyan">✓ {completedLessons.length}/{lessons.length} done</div>
              <div className="badge badge-green">⚡ {totalXP} XP</div>
            </div>
          </div>
          <div className="mt-5 progress-track">
            <div className="progress-fill" style={{ width: `${(completedLessons.length / lessons.length) * 100}%`, background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-green))" }} />
          </div>
        </motion.div>

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const isOpen = openLesson === i;
            const isDone = completedLessons.includes(lesson.id);
            return (
              <motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className={`card card-cyan ${isDone ? "ring-1 ring-[rgba(0,229,255,0.25)]" : ""}`}>
                  <button className="w-full flex items-center gap-4 p-5 text-left" onClick={() => !lesson.locked && setOpenLesson(isOpen ? null : i)} disabled={lesson.locked}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDone ? "bg-[rgba(0,229,255,0.15)]" : lesson.locked ? "bg-white/5" : "bg-[rgba(0,229,255,0.08)]"} border border-[rgba(0,229,255,0.15)]`}>
                      {isDone ? <CheckCircle className="w-4.5 h-4.5 text-[var(--neon-cyan)]" /> : lesson.locked ? <Lock className="w-4 h-4 text-white/20" /> : <BookOpen className="w-4 h-4 text-[var(--neon-cyan)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-white/30">Lesson {lesson.id}</span>
                        {isDone && <span className="badge badge-cyan text-[9px]">COMPLETED</span>}
                        {lesson.locked && <span className="badge text-[9px] bg-white/5 border-white/10 text-white/25">LOCKED</span>}
                      </div>
                      <h3 className={`font-mono text-sm font-600 ${lesson.locked ? "text-white/25" : "text-white/80"}`}>{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] font-mono text-white/25 hidden sm:block">{lesson.duration}</span>
                      <span className="badge badge-cyan text-[9px]">+{lesson.xp} XP</span>
                      {!lesson.locked && <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && !lesson.locked && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-5 pb-6 border-t border-white/5 pt-5 space-y-5">
                          {/* Theory */}
                          <div>
                            <h4 className="text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-widest mb-3">📖 Theory</h4>
                            <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 border border-[rgba(0,229,255,0.06)]">
                              <pre className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap font-mono">{lesson.theory}</pre>
                            </div>
                          </div>

                          {/* Example */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[10px] font-mono text-[var(--neon-violet)] uppercase tracking-widest">💡 Example</h4>
                              <button onClick={() => copyCode(lesson.example, lesson.id * 100)} className="flex items-center gap-1 text-[10px] font-mono text-white/25 hover:text-white/60 transition-colors">
                                {copiedId === lesson.id * 100 ? <><Check className="w-3 h-3 text-[var(--neon-green)]" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                              </button>
                            </div>
                            <div className="terminal">
                              <div className="terminal-header"><div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" /><span className="ml-2 text-[10px] font-mono text-white/25">example.css</span></div>
                              <pre className="terminal-body text-[13px] whitespace-pre-wrap leading-relaxed">{lesson.example}</pre>
                            </div>
                          </div>

                          {/* Exercise */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-widest">✏️ Exercise (fill in the blanks)</h4>
                              <button onClick={() => copyCode(lesson.solution, lesson.id * 200)} className="flex items-center gap-1 text-[10px] font-mono text-white/25 hover:text-[var(--neon-orange)] transition-colors">
                                {copiedId === lesson.id * 200 ? <><Check className="w-3 h-3 text-[var(--neon-green)]" />Copied</> : <><Play className="w-3 h-3" />Show Solution</>}
                              </button>
                            </div>
                            <div className="terminal">
                              <div className="terminal-header"><div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" /><span className="ml-2 text-[10px] font-mono text-white/25">exercise.css</span></div>
                              <pre className="terminal-body text-[13px] whitespace-pre-wrap leading-relaxed text-[var(--neon-cyan)]">{lesson.exercise}</pre>
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button onClick={() => markComplete(lesson.id)} className={`${isDone ? "opacity-50 cursor-default" : ""} btn-neon py-2.5 px-6 text-[11px] border-[var(--neon-cyan)] text-[var(--neon-cyan)]`} disabled={isDone}>
                              {isDone ? "✓ Lesson Complete" : <><CheckCircle className="w-3.5 h-3.5" /> Mark Complete (+{lesson.xp} XP)</>}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AuthGuard>
  );
}
