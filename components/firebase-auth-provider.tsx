"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth"
import { getFirebaseAuth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | null = null

    const initAuth = async () => {
      try {
        // Небольшая задержка для инициализации
        await new Promise((resolve) => setTimeout(resolve, 100))

        const auth = getFirebaseAuth()
        if (!auth) {
          console.error("Firebase Auth not available")
          setLoading(false)
          return
        }

        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user)
          setLoading(false)
        })
      } catch (error) {
        console.error("Auth initialization error:", error)
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const signInWithGoogle = async () => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Auth not available")

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: "select_account",
      })
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Auth not available")

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Email sign in error:", error)
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Auth not available")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName })
        setUser({ ...userCredential.user, displayName })
      }
    } catch (error) {
      console.error("Email sign up error:", error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Auth not available")

    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  const logout = async () => {
    const auth = getFirebaseAuth()
    if (!auth) throw new Error("Auth not available")

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a FirebaseAuthProvider")
  }
  return context
}
