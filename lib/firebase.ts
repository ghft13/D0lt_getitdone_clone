// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // If using auth

// Replace with your actual Firebase config from the Firebase Console (Project Settings > General > Your apps > Web app config)
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Your API key
  authDomain: "your-project-id.firebaseapp.com", // Your auth domain
  projectId: "your-project-id", // Your project ID
  storageBucket: "your-project-id.appspot.com", // Your storage bucket
  messagingSenderId: "123456789012", // Your messaging sender ID
  appId: "1:123456789012:web:abcdef1234567890abcdef", // Your app ID
  measurementId: "G-XXXXXXXXXX" // Optional: Your Google Analytics measurement ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);