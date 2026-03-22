<div align="center">

# ⚡ CodeBuddy

### Gamified Coding Learning Platform

**Learn Python, HTML & CSS through interactive lessons, real debugging challenges, and AI-powered assistance.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-llama--3.3--70b-FF6B2B?style=flat-square)](https://console.groq.com/)

[Live Demo](https://code-buddy-web-app.vercel.app) · [Report Bug](https://github.com/Khushant15/CodeBuddyWebApp/issues) · [Request Feature](https://github.com/Khushant15/CodeBuddyWebApp/issues)

</div>

---

## 📸 Overview

CodeBuddy is a full-stack gamified learning platform where developers earn XP, maintain streaks, and level up by completing interactive coding lessons and debugging challenges — with an AI assistant always one click away.

---

## ✨ Features

### 🎓 Learning Tracks
- **Python Fundamentals** — 6 lessons: Variables, Operators, Conditionals, Loops, Functions, Lists
- **HTML Essentials** — 6 lessons: Structure, Headings, Links & Images, Lists, Forms, Semantic HTML
- **CSS Mastery** — 6 lessons: Selectors, Typography, Box Model, Flexbox, Grid, Animations
- Each lesson includes **Theory → Code Example → Fill-in-the-blank Exercise** with solution reveal

### 🐛 Debug Practice Arena
- **8 real debugging challenges** across Python and HTML
- Countdown **timer** per challenge (colour-coded: green → orange → red)
- **3 progressive hints** per challenge (costs −10 XP each)
- In-browser editable code area — type your fix directly
- **Instant verdict**: Correct ✅ / Wrong ❌ with full explanation
- XP automatically saved to Firebase on correct submission

### 🤖 AI Code Assistant
- **Floating chatbot** (bottom-right) available on every page
- Powered by **Groq llama-3.3-70b** — ultra-fast responses
- Renders inline code, bold text, and multi-line formatting
- Unread message badge, clear chat, auto-resize input
- Full-screen AI chat modal also available from the Home page

### 🗺️ Career Roadmaps
- **Python Developer** path (8 weeks)
- **Web Developer** path — HTML → CSS → JS → React (10 weeks)
- **CSS Expert** path (8 weeks)
- Phase-by-phase breakdown with week estimates and direct lesson links

### 📊 Dashboard & Progress
- Real-time **XP, level, streak** pulled from Firestore
- Streak auto-updates on daily login
- Goal progress bars calculated from actual completions
- Completed lessons and challenge history listed

### 🔐 Authentication
- Email/password signup & login
- Google OAuth (one-click)
- All learning pages protected — unauthenticated users redirect to `/login`
- Landing page auto-redirects logged-in users to `/home`

### 🏗️ Projects Gallery
- 6 guided project ideas (CLI Calculator, Portfolio, Todo App, and more)
- Skill tags, time estimates, and XP rewards per project

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS design system |
| Animations | Framer Motion |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| AI | Groq API (llama-3.3-70b-versatile) |
| Charts | Recharts |
| Toasts | Sonner |
| Icons | Lucide React |
| Fonts | Orbitron · Outfit · Fira Code |

---

## 📁 Project Structure

```
codebuddy/
├── app/
│   ├── page.tsx                  # Landing page (redirects if logged in)
│   ├── layout.tsx                # Root layout with Navbar + ChatBot
│   ├── login/page.tsx            # Login — email + Google OAuth
│   ├── signup/page.tsx           # Signup — email + Google OAuth
│   ├── home/page.tsx             # Home dashboard (protected)
│   ├── learn/
│   │   ├── page.tsx              # Track selector
│   │   ├── python/page.tsx       # 6 Python lessons
│   │   ├── html/page.tsx         # 6 HTML lessons
│   │   └── css/page.tsx          # 6 CSS lessons
│   ├── practice/page.tsx         # 8 debug challenges + timer + hints
│   ├── roadmap/page.tsx          # 3 career roadmaps
│   ├── projects/page.tsx         # Project gallery
│   ├── dashboard/page.tsx        # Analytics + Firebase data
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── not-found.tsx             # Custom 404
│   └── api/chat/route.ts         # Groq AI API endpoint
│
├── components/
│   ├── Navbar.tsx                # Responsive, auth-aware navbar
│   ├── ChatBot.tsx               # Floating AI chatbot (bottom-right)
│   ├── AuthGuard.tsx             # Route protection component
│   └── AIChat.tsx                # Full-screen chat modal
│
├── lib/
│   ├── groqService.ts            # Groq API wrapper
│   ├── userService.ts            # Firestore CRUD (XP, streak, progress)
│   └── utils.ts                  # Utility functions
│
├── hooks/
│   └── useAuth.ts                # Auth state hook with redirect
│
├── firestore.rules               # Firestore security rules
└── .env.local                    # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A free [Groq API key](https://console.groq.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Khushant15/CodeBuddyWebApp.git
cd CodeBuddyWebApp
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com) — no credit card required.

**4. Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

**5. Build for production**

```bash
npm run build
npm start
```

---

## 🔥 Firebase Setup

Firebase is pre-configured for this project. Firestore and Authentication are already enabled.

To use your **own Firebase project**:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password + Google
3. Enable **Firestore Database** in production mode
4. Replace the config object in `app/firebase/config.ts` with your credentials
5. Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

The included `firestore.rules` ensures users can only read and write their own data.

---

## 🌐 Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Add `GROQ_API_KEY` to your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## 🎨 Design System

CodeBuddy uses a custom **Neon Noir** theme — no component library required.

| Token | Value | Usage |
|---|---|---|
| `--neon-green` | `#00ff87` | Primary actions, success |
| `--neon-violet` | `#bf5fff` | HTML track, secondary |
| `--neon-cyan` | `#00e5ff` | CSS track, info |
| `--neon-orange` | `#ff6b2b` | Practice/debug, warnings |
| `--neon-pink` | `#ff2d78` | Hard difficulty, errors |
| `--void-950` | `#020208` | Background |

**Fonts:** `Orbitron` (headings) · `Outfit` (body) · `Fira Code` (mono)

**Key utility classes:** `.card`, `.btn-neon`, `.btn-neon-solid`, `.badge-*`, `.terminal`, `.input-neon`, `.progress-track`, `.gradient-heading`

---

## 📖 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for the AI chatbot |

> **Note:** Never commit `.env.local` to version control. It is already listed in `.gitignore`.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

### Ideas for contributions

- Add more debugging challenges
- Build out an in-browser code editor (Monaco)
- Add JavaScript / React learning tracks
- Implement a global leaderboard
- Add an achievement badge system
- Add spaced repetition for lesson review

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Khushant Sharma**

- Email: [khushantsharma766@gmail.com](mailto:khushantsharma766@gmail.com)
- Location: Mumbai, India
- GitHub: [@Khushant15](https://github.com/Khushant15)

---

<div align="center">

Built with ❤️ for developers who learn by doing

⭐ **Star this repo if you find it useful!** ⭐

</div>
