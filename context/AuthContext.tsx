"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  User,
} from "firebase/auth"
import { auth } from "@/firebase/firebase.config.js"

interface AuthContextType {
  user: User | null
  loading: boolean
  register: (email: string, password: string, displayName: string) => Promise<User>
  login: (email: string, password: string) => Promise<User>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<User | null>
  loginWithGithub: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Register a new user
  const register = async (email: string, password: string, displayName: string): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, { displayName })
      }
      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  // Login existing user
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  // Ensure display name exists after provider login
  const ensureDisplayName = async (u: User) => {
    try {
      if (!u) return
      if (!u.displayName) {
        const providerName = u.providerData?.[0]?.displayName
        const fallback = u.email ? u.email.split("@")[0] : "DevChat User"
        await firebaseUpdateProfile(u, { displayName: providerName || fallback })
      }
    } catch {
      // no-op if profile update fails
    }
  }

  // Login with Google (popup first, redirect fallback)
  const loginWithGoogle = async (): Promise<User | null> => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      await ensureDisplayName(result.user)
      return result.user
    } catch (error: any) {
      if (error?.code === "auth/popup-blocked" || error?.code === "auth/operation-not-supported-in-this-environment") {
        await signInWithRedirect(auth, provider)
        return null // flow continues after redirect
      }
      throw error
    }
  }

  // Login with GitHub (popup first, redirect fallback)
  const loginWithGithub = async (): Promise<User | null> => {
    const provider = new GithubAuthProvider()
    provider.addScope("user:email")
    try {
      const result = await signInWithPopup(auth, provider)
      await ensureDisplayName(result.user)
      return result.user
    } catch (error: any) {
      if (error?.code === "auth/popup-blocked" || error?.code === "auth/operation-not-supported-in-this-environment") {
        await signInWithRedirect(auth, provider)
        return null
      }
      throw error
    }
  }

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    register,
    login,
    logout,
    loginWithGoogle,
    loginWithGithub,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
