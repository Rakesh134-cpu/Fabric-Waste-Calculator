import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBnRHPESij64_yHQFbmWwM49A55wYUfAF8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fabric-calculation.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fabric-calculation",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fabric-calculation.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "249741521351",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:249741521351:web:5f8a142132de25308069e2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
