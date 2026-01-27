import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User as FirebaseUser, setPersistence, browserLocalPersistence } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcb0rzOG1ziJZvlCCvdlkGDrRXBsVzhrk",
  authDomain: "techzone-a00ec.firebaseapp.com",
  projectId: "techzone-a00ec",
  storageBucket: "techzone-a00ec.firebasestorage.app",
  messagingSenderId: "84398060243",
  appId: "1:84398060243:web:4d8991a6fcce129b105a26"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Set persistence to local (survives browser restarts)
setPersistence(auth, browserLocalPersistence).catch(console.error)

// Firebase Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export const firebaseSignOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Listen to auth state changes
export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback)
}

export type { FirebaseUser }
