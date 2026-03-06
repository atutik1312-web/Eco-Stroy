import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCxUosthqbyJwiqwxdqWOwHnDkM36eVX5c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ecostroy-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ecostroy-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ecostroy-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "579089600400",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:579089600400:web:bb5b466306c94d6c25ed15"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
