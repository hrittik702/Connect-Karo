import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Apne Firebase Project Settings se ye details copy karke yahan paste karein
const firebaseConfig = {

};

const app = initializeApp(firebaseConfig);

// Ye dono cheezein poore project me use hongi
export const auth = getAuth(app);
export const db = getFirestore(app);
