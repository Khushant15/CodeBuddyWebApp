import axios from 'axios';
import { auth } from '@/app/firebase/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  sync: (data: { firebaseUID: string, email: string, displayName: string }) => 
    apiClient.post('/auth/sync', data),
};

export const lessonsAPI = {
  getAll: (track?: string) => apiClient.get('/lessons', { params: { track } }),
  getOne: (slug: string) => apiClient.get(`/lessons/${slug}`),
  getBySlug: (slug: string) => apiClient.get(`/lessons/s/${slug}`),
  getCounts: () => apiClient.get('/lessons/counts'),
  execute: (data: { code: string, language: string }) => apiClient.post('/execute', data),
  validate: (data: { lessonSlug: string, exerciseIndex: number, code: string, language: string }) => apiClient.post('/validate', data),
};

export const practiceAPI = {
  getProblems: (topic?: string, difficulty?: string) => apiClient.get('/practice', { params: { topic, difficulty } }),
  getOne: (id: string) => apiClient.get(`/practice/${id}`),
  execute: (data: { source_code: string, language_id: number, stdin?: string, expected_output?: string }) => apiClient.post('/practice/execute', data),
};

export const aiAPI = {
  debug: (data: { code: string, error: string, context: string }) => apiClient.post('/ai/debug', data),
  chat: (data: { message: string, history?: any[], context?: string }) => apiClient.post('/ai/chat', data),
  suggest: (progress: any) => apiClient.post('/ai/suggest', { progress }),
};

export const roadmapAPI = {
  getProgress: (uid: string) => apiClient.get(`/roadmap/${uid}`),
  updateNode: (uid: string, nodeId: string, status: string) => apiClient.post('/roadmap/update-node', { firebaseUID: uid, nodeId, status }),
};

export const testsAPI = {
  getAll: (topic?: string, difficulty?: string) => apiClient.get('/tests', { params: { topic, difficulty } }),
  getOne: (slug: string) => apiClient.get(`/tests/${slug}`),
};

export const progressAPI = {
  sync: (data: { firebaseUID: string, email: string, displayName?: string, photoURL?: string }) => apiClient.post('/auth/sync', data),
  getStats: (uid: string) => apiClient.get(`/progress/${uid}`),
  getLeaderboard: () => apiClient.get('/progress/leaderboard'),
  complete: (data: { firebaseUID: string, itemId: string, itemType: string, xpReward?: number }) => apiClient.patch('/progress/complete', data),
  saveTest: (data: { firebaseUID: string, testSlug: string, score: number, xpReward?: number }) => apiClient.post('/progress/test', data),
  getLessonStatus: (lessonId: string) => apiClient.get(`/user-progress/${lessonId}`),
};

export const analyticsAPI = {
  track: (data: { firebaseUID: string, eventType: string, itemId?: string, metadata?: any }) => apiClient.post('/analytics/track', data),
  getSummary: (uid: string) => apiClient.get(`/analytics/summary/${uid}`),
};

export const notificationsAPI = {
  getAll: (uid: string) => apiClient.get(`/notifications/${uid}`),
  markAsRead: (id: string) => apiClient.patch(`/notifications/read/${id}`),
};

export const adminAPI = {
  getStats: () => apiClient.get('/admin/stats'),
  getUsers: () => apiClient.get('/users'),
};

export const projectsAPI = {
  getAll: (difficulty?: string, tech?: string) => apiClient.get('/projects', { params: { difficulty, tech } }),
  getOne: (id: string) => apiClient.get(`/projects/${id}`),
  start: (id: string) => apiClient.post(`/projects/${id}/start`),
  updateProgress: (id: string, data: { stepIndex: Number, code: string, isCompleted: boolean }) => apiClient.post(`/projects/${id}/step`, data),
};

export const contactAPI = {
  send: (data: any) => apiClient.post('/contact', data),
};

export const communityAPI = {
  getComments: (contextId: string) => apiClient.get(`/community/${contextId}`),
  postComment: (data: any) => apiClient.post('/community/comment', data),
  likeComment: (id: string, uid: string) => apiClient.patch(`/community/like/${id}`, { firebaseUID: uid }),
  getSolutions: (lessonSlug: string) => apiClient.get(`/community/solutions/${lessonSlug}`),
};

export default apiClient;
