"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBT5iU42wAQDaeN20fUYcyeoeoOtWaNfP0",
  authDomain: "onlinelibrary1-df368.firebaseapp.com",
  projectId: "onlinelibrary1-df368",
  storageBucket: "online-library-8c09e.appspot.com",
  messagingSenderId: "822344013173",
  appId: "1:98224396737:web:your-app-id",
}

// Простая и надежная инициализация
let firebaseApp: any = null
let firebaseAuth: any = null

export function getFirebaseApp() {
  if (typeof window === "undefined") return null

  if (!firebaseApp) {
    try {
      if (getApps().length === 0) {
        firebaseApp = initializeApp(firebaseConfig)
      } else {
        firebaseApp = getApps()[0]
      }
    } catch (error) {
      console.error("Firebase app initialization error:", error)
      return null
    }
  }

  return firebaseApp
}

export function getFirebaseAuth() {
  if (typeof window === "undefined") return null

  const app = getFirebaseApp()
  if (!app) return null

  if (!firebaseAuth) {
    try {
      firebaseAuth = getAuth(app)
    } catch (error) {
      console.error("Firebase auth initialization error:", error)
      return null
    }
  }

  return firebaseAuth
}
