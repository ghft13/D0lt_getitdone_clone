// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // If using auth

// Replace with your actual Firebase config from the Firebase Console (Project Settings > General > Your apps > Web app config)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE51mEHvRTk18OnF2DaiU9W1agQ4MQXPc",
  authDomain: "dolt-dc182.firebaseapp.com",
  projectId: "dolt-dc182",
  storageBucket: "dolt-dc182.firebasestorage.app",
  messagingSenderId: "445404899981",
  appId: "1:445404899981:web:a1d6562bf39c81cc3d90c4",
  measurementId: "G-32XJXRWD44"
};
console.log("🔥 Firebase Config Debug:");
console.log("API Key present:", !!firebaseConfig.apiKey, "Length:", firebaseConfig.apiKey?.length);
console.log("Auth Domain:", firebaseConfig.authDomain);
console.log("Project ID:", firebaseConfig.projectId);

if (!firebaseConfig.apiKey) {
  console.error("❌ CRITICAL: Firebase API Key is missing! Check .env.local and .env");
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);