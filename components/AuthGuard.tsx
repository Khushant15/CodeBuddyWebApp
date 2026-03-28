"use client";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.4em] animate-pulse">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // router.replace already triggered
  return <>{children}</>;
}
