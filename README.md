<div align="center">

# ⚡ CodeBuddy

### Professional Interactive Coding Learning Platform

**Master Python, HTML & CSS through interactive lessons, real-world debugging challenges, and an AI-powered execution kernel.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-10.0-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-llama--3.3--70b-FF6B2B?style=flat-square)](https://console.groq.com/)

[Live Demo](https://code-buddy-web-app.vercel.app) · [Report Bug](https://github.com/Khushant15/CodeBuddyWebApp/issues) · [Request Feature](https://github.com/Khushant15/CodeBuddyWebApp/issues)

</div>

---

## 📸 Overview

CodeBuddy is a full-stack interactive learning platform designed for modern developers. It combines a gamified experience with real-world coding practice. Earn XP, maintain streaks, and level up by completing interactive coding lessons and high-pressure debugging challenges — all while being supported by an integrated AI execution kernel.

---

## ✨ Features

### 🎓 Learning Tracks & Gamification
- **Python Fundamentals** — 6 core modules covering variables to complex types.
- **HTML & CSS Mastery** — 12+ modules with instant visual feedback.
- **Progress Tracking** — Earn XP for every lesson, maintain daily login streaks, and reach new levels.
- **Interactive Exercises** — Theory → Code Example → Real-time Code Execution with automated validation.

### 🐛 Debug Practice Arena
- **8+ Real-world challenges** across multiple languages.
- **Timed Challenges** — Countdown timers with adaptive difficulty.
- **Smart Hints** — Progressive hint system that scales with the challenge complexity.
- **In-browser IDE** — Powered by Monaco Editor for a professional-grade coding experience.

### 🤖 AI Code Assistant (Architect Intelligence)
- **Deep Integration** — Available on every page via a floating chatbot or full-screen console.
- **High Performance** — Powered by Groq (llama-3.3-70b) for ultra-fast response times.
- **Context Awareness** — Renders code, explains errors, and suggests improvements in real-time.

### 🛠️ Developer Ecosystem
- **Career Roadmaps** — Phase-by-phase learning paths for Full Stack, Python, and CSS Experts.
- **Guided Projects** — From CLI calculators to high-end portfolio websites.
- **Community & Social** — Built-in leaderboard and community-driven learning modules.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | [Next.js 15 (App Router)](https://nextjs.org/) | Core framework with performant server components. |
| **Backend** | [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | Robust REST API handling business logic and execution. |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Persistent storage for users, progress, and community data. |
| **Authentication** | [Firebase Auth](https://firebase.google.com/docs/auth) | Secure Email/Password + Google OAuth integration. |
| **Code Execution** | [Judge0](https://judge0.com/) | Industrial-grade code execution kernel for multiple languages. |
| **UI/UX** | [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) | Responsive, animated, and premium design system. |
| **Charts/Data** | [Recharts](https://recharts.org/) | Professional-grade analytics and progress visualization. |

---

## 📁 Project Structure

```bash
codebuddy/
├── app/                  # Next.js Frontend (App Router)
│   ├── learn/            # Course modules and lesson tracks
│   ├── practice/         # Debug challenges and Monaco integration
│   ├── roadmap/          # Learning paths and progress visualization
│   └── api/              # Frontend API routes (Next.js serverless)
├── backend/              # Node.js/Express Backend API
│   ├── models/           # Mongoose schemas (User, Lesson, Progress)
│   ├── routes/           # API endpoints (Auth, AI, Code Execution)
│   ├── utils/            # Execution kernels and validation logic
│   └── scripts/          # Database seeding and utility scripts
├── components/           # Shared React components (Navbar, ChatBot, IDE)
├── lib/                  # Service wrappers (Groq, Firestore, Judge0)
├── public/               # Static assets (logos, images)
└── tests/                # Automated E2E and unit tests
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- MongoDB (Atlas or local instance)
- A [Groq API Key](https://console.groq.com)
- A [Firebase Project](https://console.firebase.google.com)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Khushant15/CodeBuddyWebApp.git
cd CodeBuddyWebApp
```

**2. Setup Frontend**
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys
```

**3. Setup Backend**
```bash
cd backend
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your keys
```

### Running the Project

**1. Start the Backend API**
```bash
# In the /backend folder
node server.js
```

**2. Start the Frontend**
```bash
# In the root folder
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📖 Environment Variables

Always ensure your local environments are configured correctly before running the app. Refer to `.env.example` in both the root and `backend/` directories for a complete list of required keys.

| Variable | Scope | Description |
|---|---|---|
| `GROQ_API_KEY` | Both | Key for AI-powered assistant. |
| `MONGODB_URI` | Backend | Connection string for user data storage. |
| `FIREBASE_*` | Both | Keys for Authentication and Admin SDK. |
| `RAPIDAPI_KEY` | Backend | (Optional) For high-performance cloud code execution. |

---

## 🤝 Contributing

We welcome contributions! Please refer to our [Contribution Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Ideas for contributions
- **New tracks:** Build out JavaScript or React learning paths.
- **Engine optimizations:** Enhance the local fallback execution kernel.
- **UI/UX:** Add more interactive 3D elements using Three.js.

---

## 👨‍💻 Author

**Khushant Sharma** (Mumbai, India)
- GitHub: [@Khushant15](https://github.com/Khushant15)
- LinkedIn: [khushant15](https://linkedin.com/in/khushant15)
- Email: [khushantsharma766@gmail.com](mailto:khushantsharma766@gmail.com)

---

<div align="center">

Built with ❤️ for the next generation of developers.

⭐ **Star this repository if you love it!** ⭐

</div>
