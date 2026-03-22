"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { CheckCircle, Lock, ChevronDown, Globe, BookOpen, ArrowLeft, Play, Copy, Check } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { completeLessonInFirebase, getOrCreateUserProfile } from "@/lib/userService";

const lessons = [
  {
    id: 1, title: "HTML Structure", xp: 50, duration: "15 min", locked: false,
    theory: `HTML (HyperText Markup Language) is the skeleton of every webpage.

An HTML document has this basic structure:
• <!DOCTYPE html> — tells browser it's HTML5
• <html> — root element
• <head> — metadata (title, links, scripts)
• <body> — visible content

Tags come in pairs: <tag>content</tag>
Self-closing tags: <img />, <br />, <hr />`,
    example: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first webpage.</p>
  </body>
</html>`,
    exercise: `<!-- Complete the HTML structure -->
<!___ html>
<html lang="en">
  <___>
    <title>My Page</title>
  </head>
  <___>
    <h1>Welcome!</h1>
  </body>
</html>`,
    solution: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Welcome!</h1>\n  </body>\n</html>`,
  },
  {
    id: 2, title: "Headings & Paragraphs", xp: 55, duration: "15 min", locked: false,
    theory: `HTML has 6 heading levels and paragraph tags.

Headings: <h1> to <h6>
• <h1> is the most important (biggest)
• <h6> is least important (smallest)
• Use only one <h1> per page

Paragraphs: <p>text</p>
Line break: <br>
Horizontal rule: <hr>`,
    example: `<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Sub-section</h3>

<p>This is a paragraph of text.
It can span multiple lines.</p>

<p>This is another paragraph.</p>
<hr>
<p>After the horizontal line.</p>`,
    exercise: `<!-- Create a page with:
  - An h1 saying "CodeBuddy"
  - An h2 saying "Learn to Code"
  - A paragraph with any text -->

<___>CodeBuddy</h1>
<___>Learn to Code</h2>
<p>___</p>`,
    solution: `<h1>CodeBuddy</h1>\n<h2>Learn to Code</h2>\n<p>Start your coding journey today!</p>`,
  },
  {
    id: 3, title: "Links & Images", xp: 65, duration: "20 min", locked: false,
    theory: `Links and images connect your pages and add visuals.

Anchor tag (links):
<a href="url">Link text</a>
• href — destination URL
• target="_blank" — opens in new tab

Image tag (self-closing):
<img src="url" alt="description">
• src — image source URL
• alt — text if image can't load (accessibility)`,
    example: `<!-- External link -->
<a href="https://google.com" target="_blank">
  Visit Google
</a>

<!-- Internal link -->
<a href="/about">About Us</a>

<!-- Image -->
<img 
  src="https://picsum.photos/300/200" 
  alt="Random photo"
  width="300"
>`,
    exercise: `<!-- Add a link to "https://github.com"
     that opens in a new tab, with text "GitHub" -->

<a ___="https://github.com" ___="_blank">
  ___
</a>

<!-- Add an image with src="logo.png" and alt="Logo" -->
<___ src="logo.png" ___="Logo">`,
    solution: `<a href="https://github.com" target="_blank">\n  GitHub\n</a>\n\n<img src="logo.png" alt="Logo">`,
  },
  {
    id: 4, title: "Lists", xp: 60, duration: "15 min", locked: true,
    theory: `HTML has two types of lists:

Unordered list (bullets): <ul>
Ordered list (numbers): <ol>
Both use <li> for each item.

You can also nest lists inside lists for sub-items.`,
    example: `<!-- Unordered list -->
<ul>
  <li>Python</li>
  <li>JavaScript</li>
  <li>HTML</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>Wake up</li>
  <li>Open CodeBuddy</li>
  <li>Write code</li>
</ol>`,
    exercise: `<!-- Create an unordered list of 3 favorite foods -->
<___>
  <li>Pizza</li>
  <___>Sushi</li>
  <li>Tacos<___>
</ul>`,
    solution: `<ul>\n  <li>Pizza</li>\n  <li>Sushi</li>\n  <li>Tacos</li>\n</ul>`,
  },
  {
    id: 5, title: "Forms & Inputs", xp: 85, duration: "25 min", locked: true,
    theory: `Forms collect user input.

<form action="/submit" method="POST">

Common input types:
• text — single-line text
• email — email validation
• password — hidden text
• checkbox — tick box
• radio — choose one option
• submit — submit button

<label> links text to an input via the for attribute and input's id.`,
    example: `<form action="/login" method="POST">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="pass">Password:</label>
  <input type="password" id="pass" name="pass">

  <input type="checkbox" id="remember">
  <label for="remember">Remember me</label>

  <button type="submit">Login</button>
</form>`,
    exercise: `<!-- Complete the signup form -->
<form>
  <label for="name">Name:</label>
  <input ___="text" id="name" ___="name">

  <button ___="submit">Sign Up</button>
</form>`,
    solution: `<form>\n  <label for="name">Name:</label>\n  <input type="text" id="name" name="name">\n\n  <button type="submit">Sign Up</button>\n</form>`,
  },
  {
    id: 6, title: "Semantic HTML", xp: 75, duration: "20 min", locked: true,
    theory: `Semantic tags describe the meaning of content.

Instead of: <div id="header">
Use: <header>

Key semantic elements:
• <header> — top section
• <nav> — navigation links
• <main> — main content
• <section> — a section
• <article> — independent content
• <aside> — sidebar
• <footer> — bottom section

Better for accessibility and SEO.`,
    example: `<!DOCTYPE html>
<html>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>

  <main>
    <article>
      <h2>Blog Post Title</h2>
      <p>Post content here...</p>
    </article>
    <aside>Related links</aside>
  </main>

  <footer>© 2025 CodeBuddy</footer>
</body>
</html>`,
    exercise: `<!-- Replace divs with semantic tags -->
<___>
  <nav>Menu here</nav>
</header>

<___>
  <p>Main content</p>
</main>

<___>© 2025</footer>`,
    solution: `<header>\n  <nav>Menu here</nav>\n</header>\n\n<main>\n  <p>Main content</p>\n</main>\n\n<footer>© 2025</footer>`,
  },
];

export default function HTMLLearnPage() {
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
          .filter(k => k.startsWith("html-"))
          .map(k => parseInt(k.replace("html-", "")));
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
      await completeLessonInFirebase(uid, `html-${id}`, lesson?.xp || 50);
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
          <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-[var(--neon-violet)] mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tracks
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[rgba(191,95,255,0.1)] border border-[rgba(191,95,255,0.2)] flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[var(--neon-violet)]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[var(--neon-violet)] uppercase tracking-widest">Learning Track</p>
                  <h1 className="font-heading text-2xl md:text-4xl font-800 text-white">HTML <span className="neon-text-violet">ESSENTIALS</span></h1>
                </div>
              </div>
              <p className="text-white/40 text-sm">6 lessons · From structure to semantic markup</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-violet">✓ {completedLessons.length}/{lessons.length} done</div>
              <div className="badge badge-green">⚡ {totalXP} XP</div>
            </div>
          </div>
          <div className="mt-5 progress-track">
            <div className="progress-fill" style={{ width: `${(completedLessons.length / lessons.length) * 100}%`, background: "linear-gradient(90deg, var(--neon-violet), var(--neon-pink))" }} />
          </div>
        </motion.div>

        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const isOpen = openLesson === i;
            const isDone = completedLessons.includes(lesson.id);
            return (
              <motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className={`card card-violet ${isDone ? "ring-1 ring-[rgba(191,95,255,0.3)]" : ""}`}>
                  <button className="w-full flex items-center gap-4 p-5 text-left" onClick={() => !lesson.locked && setOpenLesson(isOpen ? null : i)} disabled={lesson.locked}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDone ? "bg-[rgba(191,95,255,0.2)]" : lesson.locked ? "bg-white/5" : "bg-[rgba(191,95,255,0.08)]"} border border-[rgba(191,95,255,0.2)]`}>
                      {isDone ? <CheckCircle className="w-4.5 h-4.5 text-[var(--neon-violet)]" /> : lesson.locked ? <Lock className="w-4 h-4 text-white/20" /> : <BookOpen className="w-4 h-4 text-[var(--neon-violet)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-white/30">Lesson {lesson.id}</span>
                        {isDone && <span className="badge badge-violet text-[9px]">COMPLETED</span>}
                        {lesson.locked && <span className="badge text-[9px] bg-white/5 border-white/10 text-white/25">LOCKED</span>}
                      </div>
                      <h3 className={`font-mono text-sm font-600 ${lesson.locked ? "text-white/25" : "text-white/80"}`}>{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] font-mono text-white/25 hidden sm:block">{lesson.duration}</span>
                      <span className="badge badge-violet text-[9px]">+{lesson.xp} XP</span>
                      {!lesson.locked && <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && !lesson.locked && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <div className="px-5 pb-6 border-t border-white/5 pt-5 space-y-5">
                          <div>
                            <h4 className="text-[10px] font-mono text-[var(--neon-violet)] uppercase tracking-widest mb-3">📖 Theory</h4>
                            <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 border border-[rgba(191,95,255,0.08)]">
                              <pre className="text-sm text-white/65 leading-relaxed whitespace-pre-wrap font-mono">{lesson.theory}</pre>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-widest">💡 Example</h4>
                              <button onClick={() => copyCode(lesson.example, lesson.id * 100)} className="flex items-center gap-1 text-[10px] font-mono text-white/25 hover:text-white/60 transition-colors">
                                {copiedId === lesson.id * 100 ? <><Check className="w-3 h-3 text-[var(--neon-green)]" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                              </button>
                            </div>
                            <div className="terminal"><div className="terminal-header"><div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" /><span className="ml-2 text-[10px] font-mono text-white/25">example.html</span></div><pre className="terminal-body text-[13px] whitespace-pre-wrap leading-relaxed">{lesson.example}</pre></div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-widest">✏️ Exercise (fill in the blanks)</h4>
                              <button onClick={() => copyCode(lesson.solution, lesson.id * 200)} className="flex items-center gap-1 text-[10px] font-mono text-white/25 hover:text-[var(--neon-orange)] transition-colors">
                                {copiedId === lesson.id * 200 ? <><Check className="w-3 h-3 text-[var(--neon-green)]" /> Copied</> : <><Play className="w-3 h-3" />Show Solution</>}
                              </button>
                            </div>
                            <div className="terminal"><div className="terminal-header"><div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" /><span className="ml-2 text-[10px] font-mono text-white/25">exercise.html</span></div><pre className="terminal-body text-[13px] whitespace-pre-wrap leading-relaxed text-[var(--neon-cyan)]">{lesson.exercise}</pre></div>
                          </div>
                          <div className="flex justify-end pt-2">
                            <button onClick={() => markComplete(lesson.id)} className={`${isDone ? "opacity-50 cursor-default" : ""} btn-neon py-2.5 px-6 text-[11px] btn-violet`} disabled={isDone}>
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
