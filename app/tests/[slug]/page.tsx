// c:\Users\Administrator\OneDrive\Desktop\Projects\codebuddy_final\codebuddy\app\tests\[slug]\page.tsx
"use client";
import { useEffect, useState, use } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { testsAPI } from "@/lib/apiClient";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { TestExam } from "@/components/TestExam";

export default function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUid(u.uid);
        try {
          const res = await testsAPI.getOne(slug);
          setTest(res.data);
        } catch (err) {
          console.error("Failed to fetch test:", err);
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono text-white/20 animate-pulse text-xs uppercase tracking-[0.3em]">Calibrating Proctor...</div>;
  if (!test) return <div className="min-h-screen flex items-center justify-center text-white">Test not found.</div>;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#020202]">
        <TestExam test={test} uid={uid} onComplete={() => {}} />
      </div>
    </AuthGuard>
  );
}
