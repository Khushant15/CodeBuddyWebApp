// app/firebase/config.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxuFhfuQfIxRShxt4Ook5YNkxsLixMk4Q",
  authDomain: "codebuddy-5a91d.firebaseapp.com",
  projectId: "codebuddy-5a91d",
  storageBucket: "codebuddy-5a91d.appspot.com",
  messagingSenderId: "203792034906",
  appId: "1:203792034906:web:3a311d340dfea6489d3c63",
  measurementId: "G-ZZBH1V12MY",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
