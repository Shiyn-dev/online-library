"use client"

import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDv7z5DrecgDeYihkzSnmCskSOMvbxqj2s",
  authDomain: "online-library-8c09e.firebaseapp.com",
  projectId: "online-library-8c09e",
  storageBucket: "online-library-8c09e.appspot.com",
  messagingSenderId: "98224396737",
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
