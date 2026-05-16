import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Apne Firebase Project Settings se ye details copy karke yahan paste karein
export const firebaseConfig = {
  apiKey: "AIzaSyASSOQo2tqnyMfqlV3FFwnEiqEK5NX2eJc",
  authDomain: "connect-karo-21ffd.firebaseapp.com",
  projectId: "connect-karo-21ffd",
  storageBucket: "connect-karo-21ffd.firebasestorage.app",
  messagingSenderId: "669153566040",
  appId: "1:669153566040:web:8901409a7c6800e9bdd92d",
  measurementId: "G-HX7Z5L0VWQ"
};

const app = initializeApp(firebaseConfig);

// Ye dono cheezein poore project me use hongi
export const auth = getAuth(app);
export const db = getFirestore(app);