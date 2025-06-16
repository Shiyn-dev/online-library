"use client"

import { getFirebaseApp } from "@/lib/firebase"
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, getDocs, query } from "firebase/firestore"
import type { Book } from "@/types/book"

let db: any = null

export function getFirebaseDb() {
  if (typeof window === "undefined") return null

  const app = getFirebaseApp()
  if (!app) return null

  if (!db) {
    try {
      db = getFirestore(app)
    } catch (error) {
      console.error("Firebase Firestore initialization error:", error)
      return null
    }
  }

  return db
}

// Cart functions
export async function addToCart(userId: string, book: Book): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const cartRef = doc(db, "carts", userId, "items", book.id)
    await setDoc(cartRef, {
      ...book,
      addedAt: new Date().toISOString(),
    })

    console.log("Added to cart in Firebase:", book.id)
    return true
  } catch (error) {
    console.error("Error adding to cart:", error)
    return false
  }
}

export async function removeFromCart(userId: string, bookId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const cartRef = doc(db, "carts", userId, "items", bookId)
    await deleteDoc(cartRef)

    console.log("Removed from cart in Firebase:", bookId)
    return true
  } catch (error) {
    console.error("Error removing from cart:", error)
    return false
  }
}

export async function getCartItems(userId: string): Promise<Book[]> {
  try {
    const db = getFirebaseDb()
    if (!db) return []

    const cartQuery = query(collection(db, "carts", userId, "items"))
    const snapshot = await getDocs(cartQuery)

    const items: Book[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      items.push({
        id: data.id,
        title: data.title,
        authors: data.authors || [],
        description: data.description || "",
        thumbnail: data.thumbnail || "",
        categories: data.categories || [],
        publishedDate: data.publishedDate || "",
        pageCount: data.pageCount || 0,
        averageRating: data.averageRating || 0,
        ratingsCount: data.ratingsCount || 0,
        language: data.language || "en",
        publisher: data.publisher || "",
      })
    })

    console.log("Retrieved cart items from Firebase:", items.length)
    return items
  } catch (error) {
    console.error("Error getting cart items:", error)
    return []
  }
}

export async function clearCart(userId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const cartQuery = query(collection(db, "carts", userId, "items"))
    const snapshot = await getDocs(cartQuery)

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    console.log("Cleared cart in Firebase")
    return true
  } catch (error) {
    console.error("Error clearing cart:", error)
    return false
  }
}

// Favorites functions
export async function addToFavorites(userId: string, book: Book): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const favRef = doc(db, "favorites", userId, "items", book.id)
    await setDoc(favRef, {
      ...book,
      addedAt: new Date().toISOString(),
    })

    console.log("Added to favorites in Firebase:", book.id)
    return true
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return false
  }
}

export async function removeFromFavorites(userId: string, bookId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const favRef = doc(db, "favorites", userId, "items", bookId)
    await deleteDoc(favRef)

    console.log("Removed from favorites in Firebase:", bookId)
    return true
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return false
  }
}

export async function getFavoriteItems(userId: string): Promise<Book[]> {
  try {
    const db = getFirebaseDb()
    if (!db) return []

    const favQuery = query(collection(db, "favorites", userId, "items"))
    const snapshot = await getDocs(favQuery)

    const items: Book[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      items.push({
        id: data.id,
        title: data.title,
        authors: data.authors || [],
        description: data.description || "",
        thumbnail: data.thumbnail || "",
        categories: data.categories || [],
        publishedDate: data.publishedDate || "",
        pageCount: data.pageCount || 0,
        averageRating: data.averageRating || 0,
        ratingsCount: data.ratingsCount || 0,
        language: data.language || "en",
        publisher: data.publisher || "",
      })
    })

    console.log("Retrieved favorite items from Firebase:", items.length)
    return items
  } catch (error) {
    console.error("Error getting favorite items:", error)
    return []
  }
}

export async function clearFavorites(userId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const favQuery = query(collection(db, "favorites", userId, "items"))
    const snapshot = await getDocs(favQuery)

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    console.log("Cleared favorites in Firebase")
    return true
  } catch (error) {
    console.error("Error clearing favorites:", error)
    return false
  }
}

export async function isInCart(userId: string, bookId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const cartRef = doc(db, "carts", userId, "items", bookId)
    const docSnap = await getDoc(cartRef)

    return docSnap.exists()
  } catch (error) {
    console.error("Error checking cart:", error)
    return false
  }
}

export async function isInFavorites(userId: string, bookId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const favRef = doc(db, "favorites", userId, "items", bookId)
    const docSnap = await getDoc(favRef)

    return docSnap.exists()
  } catch (error) {
    console.error("Error checking favorites:", error)
    return false
  }
}
