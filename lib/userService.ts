// lib/userService.ts
import { authAPI, lessonsAPI, practiceAPI, progressAPI } from './apiClient';

export interface UserProfile {
  firebaseUID: string;
  email: string;
  displayName: string;
  xp: number;
  streak: number;
  completedLessons: string[];
  solvedProblems: string[];
  testScores: Record<string, number>;
}

// Create or fetch user profile (Sync with backend)
export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName: string
): Promise<any> {
  const response = await authAPI.sync({ firebaseUID: uid, email, displayName });
  return response.data; // Returns { user, progress }
}

// Update user streak
export async function updateStreak(uid: string): Promise<void> {
  // In this architecture, getting stats triggers a streak update on the backend
  await progressAPI.getStats(uid);
}

// Mark a lesson complete and award XP
export async function completeLessonInBackend(
  uid: string,
  lessonSlug: string,
  xpReward: number
): Promise<void> {
  await progressAPI.complete({
    firebaseUID: uid,
    itemId: lessonSlug,
    itemType: 'lesson',
    xpReward
  });
}

// Mark a challenge complete and award XP
export async function completeChallengeInBackend(
  uid: string,
  problemId: string,
  xpReward: number
): Promise<void> {
  await progressAPI.complete({
    firebaseUID: uid,
    itemId: problemId,
    itemType: 'challenge',
    xpReward
  });
}

// Save test result
export async function saveTestResult(
  uid: string,
  testSlug: string,
  score: number,
  xpReward: number
): Promise<void> {
  await progressAPI.complete({
    firebaseUID: uid,
    itemId: testSlug,
    itemType: 'test',
    xpReward
  });
  // Note: If you want to save the actual score, you'd need a more specific API call
  // For now, using the generalized complete API
}

// Recompute level from XP (100 XP per level)
export function xpToLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

// Note: Removed Firestore specific imports and logic to decouple frontend from DB.
