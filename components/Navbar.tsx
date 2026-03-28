"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Trophy, User, Menu, X, Rocket, LogOut, BookOpen, Bell, ShieldCheck, FolderOpen } from 'lucide-react';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { logoutUser } from '@/app/firebase/authMethods';
import { toast } from 'sonner';
import { notificationsAPI, progressAPI } from '@/lib/apiClient';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const unsub = auth ? onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        fetchNotifications(u.uid);
        fetchUserRole(u.uid, u.email || "");
      }
    }) : () => {};
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchNotifications = async (uid: string) => {
    try {
      const res = await notificationsAPI.getAll(uid);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
     try {
       await notificationsAPI.markAsRead(id);
       setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
     } catch (err) {
       console.error(err);
     }
  };

  const fetchUserRole = async (uid: string, email: string) => {
     try {
       const res = await progressAPI.sync({ firebaseUID: uid, email });
       setUserRole(res.data.user.role || 'user');
     } catch (err) {
       console.error(err);
     }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navItems = user ? [
    { name: 'Home', href: '/home', icon: Rocket },
    { name: 'Learn', href: '/learn', icon: BookOpen },
    { name: 'Practice', href: '/practice', icon: Code2 },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    ...(userRole === 'admin' ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck }] : []),
  ] : [
    { name: 'Home', href: '/', icon: Rocket },
    { name: 'About', href: '/about', icon: BookOpen },
    { name: 'Contact', href: '/contact', icon: Code2 },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-6">
        <div className={`glass-panel border-white/5 bg-brand-bg-secondary/80 backdrop-blur-xl px-6 py-2.5 flex items-center justify-between transition-all duration-300 ${scrolled ? 'rounded-full shadow-lg border-white/10' : 'rounded-2xl'}`}>
          <div className="flex items-center gap-8">
            <Link href={user ? "/home" : "/"} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                <Rocket className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-base font-800 tracking-tight text-white leading-none">CodeBuddy</span>
                <span className="text-[8px] font-mono text-blue-400 tracking-widest uppercase mt-0.5">AI-Powered Coding & Learning Platform</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && item.href !== "/home" && pathname.startsWith(item.href));
                return (
                  <Link key={item.name} href={item.href} className="relative px-4 py-1.5 group">
                    {isActive && (
                      <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white/5 rounded-lg border border-white/5" transition={{ duration: 0.3 }} />
                    )}
                    <div className={`flex items-center gap-2 text-[11px] font-medium tracking-wide uppercase transition-all ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`}>
                      <item.icon className="w-3.5 h-3.5" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 relative">
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <Bell className={`w-4.5 h-4.5 ${unreadCount > 0 ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-brand-bg-secondary" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifs && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-80 glass-panel p-4 z-[110] border-white/10 shadow-2xl bg-brand-bg-secondary/95">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                           <span className="text-[10px] font-bold text-white tracking-widest uppercase">Notifications</span>
                           <span className="text-[9px] font-mono text-blue-400">{unreadCount} UNREAD</span>
                        </div>
                        <div className="max-h-64 overflow-y-auto no-scrollbar space-y-2">
                          {notifications.length === 0 ? (
                            <div className="py-8 text-center text-[10px] text-gray-500 uppercase tracking-widest">No Signals Received</div>
                          ) : (
                            notifications.map(n => (
                              <div key={n._id} onClick={() => markAsRead(n._id)} className={`p-3 rounded-lg border border-white/5 transition-all cursor-pointer ${n.read ? 'bg-transparent opacity-50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                                <div className="text-[10px] font-bold text-white mb-1 uppercase tracking-tight">{n.title}</div>
                                <div className="text-[9px] text-gray-400 leading-tight">{n.message}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/profile" className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-4 py-1 rounded-full bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                   <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} alt="" /> : <User className="w-3.5 h-3.5 text-blue-400" />}
                   </div>
                   <div className="flex flex-col text-left">
                     <span className="text-[9px] font-bold text-white uppercase tracking-tight">{user.displayName || user.email?.split('@')[0]}</span>
                     <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest font-semibold tracking-widest">Pro Member</span>
                   </div>
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-[10px] py-2 px-4 shadow-sm">
                   Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="btn-ghost text-[11px] font-medium">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-[11px]">
                  Join Free
                </Link>
              </div>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white/60 hover:text-white">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="lg:hidden absolute top-full left-0 w-full p-4 mt-2 z-[150]">
            <div className="glass-panel p-4 space-y-2 bg-[#0B1120]/98 backdrop-blur-2xl shadow-2xl border-white/10 ring-1 ring-white/5">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 text-white border border-white/5 transition-colors">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
