"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, ThumbsUp, Reply, MoreHorizontal } from 'lucide-react';
import { communityAPI } from '@/lib/apiClient';
import { auth } from '@/app/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

export const Discussion = ({ contextId }: { contextId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    fetchComments();
    return unsub;
  }, [contextId]);

  const fetchComments = async () => {
    try {
      const res = await communityAPI.getComments(contextId);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async () => {
    if (!text.trim() || !user) return;
    try {
      const res = await communityAPI.postComment({
        firebaseUID: user.uid,
        displayName: user.displayName || 'Developer',
        contextId,
        text
      });
      setComments([res.data, ...comments]);
      setText("");
      toast.success("Signal transmitted.");
    } catch (err) {
      toast.error("Transmission failed.");
    }
  };

  const handleLike = async (id: string) => {
    if (!user) return;
    try {
      const res = await communityAPI.likeComment(id, user.uid);
      setComments(comments.map(c => c._id === id ? res.data : c));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-24 border-t border-white/5 pt-24 pb-40">
      <div className="flex items-center justify-between mb-16">
        <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.4em] flex items-center gap-4">
          <MessageSquare className="w-5 h-5 text-blue-500" /> Collaborative Intelligence
        </h3>
        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{comments.length} Verified Signals</span>
      </div>

      {user && (
        <div className="mb-16 p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Contribute to the collective intelligence..."
            className="w-full bg-transparent border-none focus:ring-0 text-sm font-light text-gray-400 placeholder:text-gray-800 min-h-[120px] resize-none leading-relaxed"
          />
          <div className="flex justify-end mt-6">
            <button onClick={postComment} className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
              Transmit Signal <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {loading ? (
          <div className="text-center py-16 animate-pulse text-gray-800 font-bold text-[10px] tracking-[0.3em] uppercase">Synchronizing Network Feed...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
             <p className="text-[11px] font-bold text-gray-800 uppercase tracking-[0.4em]">Grid Silent. Initiate the first signal.</p>
          </div>
        ) : (
          comments.map((c, i) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={c._id} className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-xs shadow-inner">
                    {c.displayName?.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-tight">{c.displayName}</div>
                    <div className="text-[9px] font-bold text-gray-700 uppercase tracking-widest mt-1">{new Date(c.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <button className="p-2 text-gray-800 hover:text-white transition-all"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
              <p className="text-[14px] text-gray-400 font-light leading-relaxed mb-8">{c.text}</p>
              <div className="flex items-center gap-10">
                <button onClick={() => handleLike(c._id)} className={`flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${c.likes?.includes(user?.uid) ? 'text-blue-500' : 'text-gray-700 hover:text-gray-400'}`}>
                  <ThumbsUp className={`w-4 h-4 ${c.likes?.includes(user?.uid) ? 'fill-blue-500/20' : ''}`} /> {c.likes?.length || 0} Endorsements
                </button>
                <button className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-700 hover:text-gray-400 transition-all">
                  <Reply className="w-4 h-4" /> Response
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
