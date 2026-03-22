"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthGuard } from "@/components/AuthGuard";
import { CheckCircle, Lock, ChevronDown, Code2, BookOpen, ArrowLeft, Play, Copy, Check } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { completeLessonInFirebase, getOrCreateUserProfile } from "@/lib/userService";

const lessons = [
  {
    id: 1, slug: "variables", title: "Variables & Data Types", xp: 50, duration: "15 min", locked: false,
    theory: `A variable stores a value in memory. In Python, you don't need to declare types — Python figures it out automatically.

There are 4 main data types to start with:
• int — whole numbers: 5, -3, 100
• float — decimal numbers: 3.14, -0.5
• str — text in quotes: "hello", 'world'
• bool — True or False`,
    example: `# Assigning variables
name = "Alex"       # str
age = 21            # int
height = 5.9        # float
is_student = True   # bool

print(name)         # Alex
print(type(age))    # <class 'int'>`,
    exercise: `# Fill in the blanks:
# Create a variable called 'city' with value "Mumbai"
# Create a variable called 'population' with value 20667656
# Print both variables

city = ___
population = ___
print(city)
print(population)`,
    solution: `city = "Mumbai"\npopulation = 20667656\nprint(city)\nprint(population)`,
  },
  {
    id: 2, slug: "operators", title: "Operators", xp: 60, duration: "20 min", locked: false,
    theory: `Python has several types of operators:

Arithmetic: +, -, *, /, // (floor div), % (modulo), ** (power)
Comparison: ==, !=, <, >, <=, >=
Logical: and, or, not
Assignment: =, +=, -=, *=`,
    example: `# Arithmetic
x = 10
y = 3
print(x + y)   # 13
print(x ** y)  # 1000
print(x % y)   # 1

# Comparison
print(10 > 5)  # True
print(10 == 10) # True

# Logical
print(True and False)  # False
print(True or False)   # True`,
    exercise: `# Calculate the area of a rectangle
# width = 8, height = 5
# Print: "Area: 40"

width = 8
height = ___
area = width ___ height
print("Area:", ___)`,
    solution: `width = 8\nheight = 5\narea = width * height\nprint("Area:", area)`,
  },
  {
    id: 3, slug: "conditionals", title: "If / Else Statements", xp: 70, duration: "20 min", locked: false,
    theory: `Conditionals let your program make decisions.

Syntax:
if condition:
    # runs if true
elif other_condition:
    # runs if first was false but this is true
else:
    # runs if all above were false

Indentation (4 spaces) is mandatory in Python!`,
    example: `score = 85

if score >= 90:
    print("Grade: A")
elif score >= 75:
    print("Grade: B")
elif score >= 60:
    print("Grade: C")
else:
    print("Grade: F")

# Output: Grade: B`,
    exercise: `# Write a program that checks if a number is:
# positive, negative, or zero
num = -7

if num ___ 0:
    print("Positive")
elif num ___ 0:
    print("Negative")
else:
    print("Zero")`,
    solution: `num = -7\n\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")`,
  },
  {
    id: 4, slug: "loops", title: "Loops (for & while)", xp: 80, duration: "25 min", locked: true,
    theory: `Loops repeat code multiple times.

for loop — iterate over a sequence:
for variable in sequence:
    # code

while loop — repeat while condition is true:
while condition:
    # code

Use range(n) to loop n times.`,
    example: `# for loop
for i in range(5):
    print(i)   # 0, 1, 2, 3, 4

# for with list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# while loop
count = 0
while count < 3:
    print(count)
    count += 1`,
    exercise: `# Print multiplication table of 5 (1 to 10)
# Expected: 5, 10, 15, 20 ... 50

for i in range(___, ___):
    print(5 ___ i)`,
    solution: `for i in range(1, 11):\n    print(5 * i)`,
  },
  {
    id: 5, slug: "functions", title: "Functions", xp: 90, duration: "25 min", locked: true,
    theory: `Functions are reusable blocks of code.

def function_name(parameters):
    # code
    return value

• def keyword defines a function
• Parameters are inputs (optional)
• return sends back a value (optional)
• Call it by name: function_name(args)`,
    example: `def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

def is_even(n):
    return n % 2 == 0

print(greet("Alex"))   # Hello, Alex!
print(add(3, 4))       # 7
print(is_even(8))      # True`,
    exercise: `# Write a function called 'square' that
# returns the square of a number

def ___(num):
    return num ___ num

print(square(4))   # 16
print(square(7))   # 49`,
    solution: `def square(num):\n    return num * num\n\nprint(square(4))\nprint(square(7))`,
  },
  {
    id: 6, slug: "lists", title: "Lists & Indexing", xp: 100, duration: "30 min", locked: true,
    theory: `Lists store multiple values in one variable.
my_list = [1, 2, 3, "hello", True]

• Indexing starts at 0
• Negative index: -1 is last item
• Slicing: list[start:end]
• Methods: .append(), .remove(), .pop(), .sort(), len()`,
    example: `nums = [10, 20, 30, 40, 50]

print(nums[0])       # 10
print(nums[-1])      # 50
print(nums[1:3])     # [20, 30]

nums.append(60)
print(nums)          # [10, 20, 30, 40, 50, 60]

print(len(nums))     # 6`,
    exercise: `# Given the list below, print the 2nd item,
# add 99 to end, then print the list length

items = [5, 15, 25, 35]
print(items[___])
items.___(___)
print(len(items))`,
    solution: `items = [5, 15, 25, 35]\nprint(items[1])\nitems.append(99)\nprint(len(items))`,
  },
];

export default function PythonLearnPage() {
  const [openLesson, setOpenLesson] = useState<number | null>(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        const profile = await getOrCreateUserProfile(u.uid, u.email || "", u.displayName || "Developer");
        // Restore completed lessons from Firebase
        const done = profile.completedLessons
          .filter(k => k.startsWith("python-"))
          .map(k => parseInt(k.replace("python-", "")));
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
      await completeLessonInFirebase(uid, `python-${id}`, lesson?.xp || 50);
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
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-mono text-white/30 hover:text-[var(--neon-green)] mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tracks
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,255,135,0.1)] border border-[rgba(0,255,135,0.2)] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-[var(--neon-green)]" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-widest">Learning Track</p>
                  <h1 className="font-heading text-2xl md:text-4xl font-800 text-white">PYTHON <span className="neon-text-green">FUNDAMENTALS</span></h1>
                </div>
              </div>
              <p className="text-white/40 text-sm ml-13">6 lessons · From variables to lists</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-green">✓ {completedLessons.length}/{lessons.length} done</div>
              <div className="badge badge-violet">⚡ {totalXP} XP</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 progress-track">
            <div className="progress-fill" style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }} />
          </div>
        </motion.div>

        {/* Lessons accordion */}
        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const isOpen = openLesson === i;
            const isDone = completedLessons.includes(lesson.id);

            return (
              <motion.div key={lesson.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className={`card ${isDone ? "ring-1 ring-[rgba(0,255,135,0.3)]" : ""}`}>
                  {/* Lesson header */}
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => !lesson.locked && setOpenLesson(isOpen ? null : i)}
                    disabled={lesson.locked}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isDone ? "bg-[rgba(0,255,135,0.15)] border border-[rgba(0,255,135,0.3)]" : lesson.locked ? "bg-white/5 border border-white/10" : "bg-[rgba(0,255,135,0.08)] border border-[rgba(0,255,135,0.15)]"}`}>
                      {isDone ? <CheckCircle className="w-4.5 h-4.5 text-[var(--neon-green)]" /> : lesson.locked ? <Lock className="w-4 h-4 text-white/20" /> : <BookOpen className="w-4 h-4 text-[var(--neon-green)]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-white/30">Lesson {lesson.id}</span>
                        {lesson.locked && <span className="badge text-[9px] bg-white/5 border-white/10 text-white/25">LOCKED</span>}
                        {isDone && <span className="badge badge-green text-[9px]">COMPLETED</span>}
                      </div>
                      <h3 className={`font-mono text-sm font-600 ${lesson.locked ? "text-white/25" : "text-white/80"}`}>{lesson.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] font-mono text-white/25 hidden sm:block">{lesson.duration}</span>
                      <span className="badge badge-green text-[9px]">+{lesson.xp} XP</span>
                      {!lesson.locked && (
                        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </button>

                  {/* Lesson content */}
                  <AnimatePresence>
                    {isOpen && !lesson.locked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }} className="overflow-hidden"
                      >
                        <div className="px-5 pb-6 border-t border-white/5 pt-5 space-y-5">
                          {/* Theory */}
                          <div>
                            <h4 className="text-[10px] font-mono text-[var(--neon-green)] uppercase tracking-widest mb-3">📖 Theory</h4>
                            <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 border border-white/5">
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
                              <div className="terminal-header">
                                <div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" />
                                <span className="ml-2 text-[10px] font-mono text-white/25">example.py</span>
                              </div>
                              <pre className="terminal-body text-[13px] whitespace-pre-wrap leading-relaxed">{lesson.example}</pre>
                            </div>
                          </div>

                          {/* Exercise */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-[10px] font-mono text-[var(--neon-cyan)] uppercase tracking-widest">✏️ Exercise (fill in the blanks)</h4>
                              <button onClick={() => copyCode(lesson.solution, lesson.id * 200)} className="flex items-center gap-1 text-[10px] font-mono text-white/25 hover:text-[var(--neon-orange)] transition-colors">
                                {copiedId === lesson.id * 200 ? <><Check className="w-3 h-3 text-[var(--neon-green)]" /> Copied</> : <Play className="w-3 h-3" />}
                                {copiedId === lesson.id * 200 ? "" : "Show Solution"}
                              </button>
                            </div>
                            <div className="terminal">
                              <div className="terminal-header">
                                <div className="terminal-dot bg-[#ff5f57]" /><div className="terminal-dot bg-[#ffbd2e]" /><div className="terminal-dot bg-[#28ca42]" />
                                <span className="ml-2 text-[10px] font-mono text-white/25">exercise.py</span>
                              </div>
                              <pre className="terminal-body text-[13px] whitespace-pre-wrap leading-relaxed text-[var(--neon-cyan)]">{lesson.exercise}</pre>
                            </div>
                          </div>

                          {/* Complete button */}
                          <div className="flex justify-end pt-2">
                            <button onClick={() => markComplete(lesson.id)}
                              className={`${isDone ? "opacity-50 cursor-default" : ""} btn-neon btn-neon-solid py-2.5 px-6 text-[11px]`}
                              disabled={isDone}>
                              {isDone ? "✓ Lesson Complete" : <><CheckCircle className="w-3.5 h-3.5" /> Mark as Complete (+{lesson.xp} XP)</>}
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
