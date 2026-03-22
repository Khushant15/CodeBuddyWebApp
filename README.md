# CodeBuddy — Gamified Coding Platform

A production-ready gamified coding learning platform built with Next.js 15, Firebase, and Groq AI.

## 🚀 Quick Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.local` and fill in your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at: https://console.groq.com

### 3. Firebase is pre-configured
The Firebase project (`codebuddy-5a91d`) is already set up. Firestore and Auth are enabled.

> **Note:** In production, move Firebase config to environment variables.

### 4. Run the dev server
```bash
npm run dev
```

Visit http://localhost:3000

---

## 📁 Project Structure

```
app/
├── page.tsx              — Landing page (redirects to /home if logged in)
├── login/page.tsx        — Login with email + Google
├── signup/page.tsx       — Sign up with email + Google
├── home/page.tsx         — Dashboard home (protected)
├── learn/
│   ├── page.tsx          — Track selector
│   ├── python/page.tsx   — 6 Python lessons with theory + exercises
│   ├── html/page.tsx     — 6 HTML lessons
│   └── css/page.tsx      — 6 CSS lessons with animations
├── practice/page.tsx     — 8 debug challenges with timer + hints + verdict
├── roadmap/page.tsx      — 3 career learning roadmaps
├── projects/page.tsx     — Project gallery
├── dashboard/page.tsx    — Analytics + real Firebase data
├── about/page.tsx        — About page
├── contact/page.tsx      — Contact form
└── api/chat/route.ts     — Groq AI API endpoint

components/
├── Navbar.tsx            — Responsive navbar with auth state
├── ChatBot.tsx           — Floating AI chatbot (bottom-right)
├── AuthGuard.tsx         — Protects routes from unauthenticated access
└── AIChat.tsx            — Full-screen chat modal

lib/
├── userService.ts        — Firebase Firestore CRUD (XP, streak, lessons)
├── groqService.ts        — Groq API wrapper
└── utils.ts              — cn(), formatTime()

hooks/
└── useAuth.ts            — Auth state hook with redirect
```

## ✨ Features

- **Authentication** — Email/password + Google OAuth via Firebase Auth
- **Route Protection** — All learning pages redirect to login if not authenticated
- **AI Chatbot** — Floating chatbot in bottom-right powered by Groq llama-3.3-70b
- **Learn Tracks** — Python (6 lessons), HTML (6 lessons), CSS (6 lessons)
  - Each lesson: Theory → Example → Fill-in-the-blank exercise
  - Progress saved to Firebase Firestore
- **Practice Arena** — 8 real debugging challenges
  - Countdown timer per challenge
  - 3 progressive hints (-10 XP each)
  - Submit → Correct/Wrong verdict
  - Solution reveal + explanation
  - XP saved to Firebase
- **Roadmaps** — Python Developer, Web Developer, CSS Expert paths
- **Dashboard** — Real-time XP, level, streak, completed lessons from Firebase
- **Projects** — 6 guided project ideas with skill tags

## 🎨 Design System

- **Theme:** Neon Noir — deep void-black with electric green/violet/cyan
- **Fonts:** Orbitron (headings) · Outfit (body) · Fira Code (mono)
- **CSS classes:** `.card`, `.btn-neon`, `.badge-*`, `.terminal`, `.input-neon`

## 🛠️ Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth + Firestore)
- Groq AI (llama-3.3-70b-versatile)
- Framer Motion
- Recharts
- Sonner (toasts)
