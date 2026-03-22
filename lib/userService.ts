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
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
