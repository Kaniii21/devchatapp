import { initializeApp } from "firebase/app"
import { getAuth, updateProfile } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Check if using demo configuration
const isUsingDemoConfig = firebaseConfig.apiKey === "demo-api-key"

if (isUsingDemoConfig) {
  console.warn("⚠️  Firebase is using demo configuration. Please set up your Firebase project:")
  console.warn("   1. Go to https://console.firebase.google.com/")
  console.warn("   2. Create a new project or select existing one")
  console.warn("   3. Add a web app and get your configuration")
  console.warn("   4. Create .env.local file with your Firebase credentials")
  console.warn("   5. See FIREBASE_SETUP.md for detailed instructions")
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Helper function to update user profile
const updateUserProfile = async (user, profileData) => {
  try {
    await updateProfile(user, profileData)
    return user
  } catch (error) {
    throw error
  }
}

export { app, auth, db, storage, updateProfile, updateUserProfile }
