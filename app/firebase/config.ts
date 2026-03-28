import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Build-Safe Initialization: Prevent failure if env vars are missing during pre-render/build
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== "undefined" || (firebaseConfig.apiKey && firebaseConfig.projectId)) {
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (err) {
      console.warn("Architecture Synch Failure: Firebase Core Offline. Verify Environment Variables.");
    }
  } else {
    app = getApps()[0];
  }

  if (app) {
    auth = getAuth(app);
  }
}

export { app, auth };