import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";
import { AIChat } from "@/components/AIChat";
import ClientScene from "@/components/ClientScene";

export const metadata: Metadata = {
  title: "CodeBuddy | AI-Powered Coding & Learning Platform",
  description: "CodeBuddy · AI-Powered Coding & Learning Platform. Built with ❤️ by Khushant Sharma.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-blue-500/20 selection:text-white bg-[#0B1120]">
        <ClientScene />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
                    <footer className="border-t border-white/5 py-24 bg-white/[0.01]">
             <div className="container mx-auto px-6">
               <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="flex flex-col items-center md:items-start gap-4">
                   <div className="flex flex-col items-center md:items-start text-glow-blue uppercase">
                     <span className="text-white text-3xl font-bold tracking-[0.2em]">CodeBuddy</span>
                     <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-1 text-center md:text-left">Built for developers, by developers</p>
                   </div>
                   <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">© 2025 CodeBuddy</p>
                 </div>
 
                 <div className="flex flex-wrap justify-center gap-12">
                   {["Terms", "Privacy", "Docs"].map(l => (
                     <a key={l} href="#" className="text-[11px] font-bold text-gray-600 hover:text-blue-500 transition-colors uppercase tracking-widest">{l}</a>
                   ))}
                 </div>
 
               </div>
             </div>
           </footer>
        </div>

        <AIChat />
        <Toaster theme="dark" position="bottom-right" closeButton richColors />
      </body>
    </html>
  );
}
