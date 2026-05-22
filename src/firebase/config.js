import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOT12VF1jXKkCyXrPfUMTbsuanmoJgUjc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "connect-karo-93ee0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "connect-karo-93ee0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "connect-karo-93ee0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "463600208908",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:463600208908:web:3664d3f216f1cffe27b229",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-L05Q090TX0"
};

export const app = initializeApp(firebaseConfig);

// Ye dono cheezein poore project me use hongi
export const auth = getAuth(app);
export const db = getFirestore(app);