import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration should be loaded from environment variables
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || '{}');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper function to handle Firebase errors
export function handleFirebaseError(error: any): string {
  console.error('Firebase Error:', error);
  return error.message || 'An error occurred while processing your request';
}
