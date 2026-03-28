import { analyticsAPI } from './apiClient';

export const trackEvent = async (firebaseUID: string, eventType: string, itemId?: string, metadata?: any) => {
  try {
    await analyticsAPI.track({
      firebaseUID,
      eventType,
      itemId,
      metadata: {
        ...metadata,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Analytics track failed:', err);
  }
};

export const trackSessionStart = (firebaseUID: string) => {
  trackEvent(firebaseUID, 'session_start');
};

export const trackLessonStart = (firebaseUID: string, lessonSlug: string) => {
  trackEvent(firebaseUID, 'lesson_start', lessonSlug);
};

export const trackLessonComplete = (firebaseUID: string, lessonSlug: string, xp: number) => {
  trackEvent(firebaseUID, 'lesson_complete', lessonSlug, { xp });
};
