import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Apne Firebase Project Settings se ye details copy karke yahan paste karein
const firebaseConfig = {
  apiKey: "AIzaSyBOT12VF1jXKkCyXrPfUMTbsuanmoJgUjc",
  authDomain: "connect-karo-93ee0.firebaseapp.com",
  projectId: "connect-karo-93ee0",
  storageBucket: "connect-karo-93ee0.firebasestorage.app",
  messagingSenderId: "463600208908",
  appId: "1:463600208908:web:3664d3f216f1cffe27b229",
  measurementId: "G-L05Q090TX0"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyASSOQo2tqnyMfqlV3FFwnEiqEK5NX2eJc",
//   authDomain: "connect-karo-21ffd.firebaseapp.com",
//   projectId: "connect-karo-21ffd",
//   storageBucket: "connect-karo-21ffd.firebasestorage.app",
//   messagingSenderId: "669153566040",
//   appId: "1:669153566040:web:8901409a7c6800e9bdd92d",
//   measurementId: "G-HX7Z5L0VWQ"
// };

export const app = initializeApp(firebaseConfig);

// Ye dono cheezein poore project me use hongi
export const auth = getAuth(app);
export const db = getFirestore(app);