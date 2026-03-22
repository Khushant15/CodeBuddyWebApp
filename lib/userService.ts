// lib/userService.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDxuFhfuQfIxRShxt4Ook5YNkxsLixMk4Q",
  authDomain: "codebuddy-5a91d.firebaseapp.com",
  projectId: "codebuddy-5a91d",
  storageBucket: "codebuddy-5a91d.appspot.com",
  messagingSenderId: "203792034906",
  appId: "1:203792034906:web:3a311d340dfea6489d3c63",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];   // e.g. ["python-1", "html-2"]
  completedChallenges: string[]; // e.g. ["challenge-1"]
  chatHistory: ChatMessage[];
  createdAt: unknown;
  updatedAt: unknown;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

// Create or fetch user profile
export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<UserProfile> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid,
    email,
    displayName,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: new Date().toISOString().split("T")[0],
    completedLessons: [],
    completedChallenges: [],
    chatHistory: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, profile);
  return profile;
}

// Mark a lesson complete and award XP
export async function completeLessonInFirebase(
  uid: string,
  lessonKey: string,
  xpReward: number
): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    completedLessons: arrayUnion(lessonKey),
    xp: increment(xpReward),
    updatedAt: serverTimestamp(),
  });
}

// Mark a challenge complete and award XP
export async function completeChallengeInFirebase(
  uid: string,
  challengeKey: string,
  xpReward: number
): Promise<void> {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    completedChallenges: arrayUnion(challengeKey),
    xp: increment(xpReward),
    updatedAt: serverTimestamp(),
  });
}

// Update streak (call on each daily visit)
export async function updateStreak(uid: string): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as UserProfile;
  const today = new Date().toISOString().split("T")[0];
  const last = data.lastActiveDate;

  if (last === today) return; // already updated today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];

  const newStreak = last === yStr ? data.streak + 1 : 1;

  await updateDoc(ref, {
    streak: newStreak,
    lastActiveDate: today,
    updatedAt: serverTimestamp(),
  });
}

// Append a chat message to user's history (keep last 50)
export async function saveChatMessage(
  uid: string,
  msg: ChatMessage
): Promise<void> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data() as UserProfile;
  const history = [...(data.chatHistory || []), msg].slice(-50);

  await updateDoc(ref, {
    chatHistory: history,
    updatedAt: serverTimestamp(),
  });
}

// Recompute level from XP (100 XP per level)
export function xpToLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}
