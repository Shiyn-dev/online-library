"use client"

import { getFirebaseApp } from "@/lib/firebase"
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"

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

export interface Comment {
  id: string
  bookId: string
  userId: string
  userName: string
  userEmail: string
  comment: string
  rating: number
  createdAt: string
  updatedAt?: string
  isEdited?: boolean
}

export interface BookRating {
  averageRating: number
  totalRatings: number
  ratingsCount: number
}

// Добавить комментарий
export async function addComment(commentData: {
  bookId: string
  userId: string
  userName: string
  userEmail: string
  comment: string
  rating: number
}): Promise<Comment | null> {
  try {
    const db = getFirebaseDb()
    if (!db) return null

    const commentsRef = collection(db, "comments")
    const docRef = await addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp(),
      isEdited: false,
    })

    const newComment: Comment = {
      id: docRef.id,
      ...commentData,
      createdAt: new Date().toISOString(),
      isEdited: false,
    }

    console.log("Comment added to Firebase:", docRef.id)
    return newComment
  } catch (error) {
    console.error("Error adding comment:", error)
    return null
  }
}

// Обновить комментарий
export async function updateComment(
  commentId: string,
  updateData: {
    comment: string
    rating: number
  },
): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const commentRef = doc(db, "comments", commentId)
    await updateDoc(commentRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
      isEdited: true,
    })

    console.log("Comment updated:", commentId)
    return true
  } catch (error) {
    console.error("Error updating comment:", error)
    return false
  }
}

// Удалить комментарий
export async function deleteComment(commentId: string): Promise<boolean> {
  try {
    const db = getFirebaseDb()
    if (!db) return false

    const commentRef = doc(db, "comments", commentId)
    await deleteDoc(commentRef)

    console.log("Comment deleted:", commentId)
    return true
  } catch (error) {
    console.error("Error deleting comment:", error)
    return false
  }
}

// Получить комментарии для книги
export async function getBookComments(bookId: string): Promise<Comment[]> {
  try {
    const db = getFirebaseDb()
    if (!db) return []

    const commentsRef = collection(db, "comments")
    const q = query(commentsRef, where("bookId", "==", bookId))

    const snapshot = await getDocs(q)
    const comments: Comment[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      comments.push({
        id: doc.id,
        bookId: data.bookId,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        comment: data.comment,
        rating: data.rating || 0,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || new Date().toISOString(),
        updatedAt:
          data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || undefined,
        isEdited: data.isEdited || false,
      })
    })

    // Сортируем на клиенте по дате создания (новые сверху)
    comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    console.log(`Retrieved ${comments.length} comments for book ${bookId}`)
    return comments
  } catch (error) {
    console.error("Error getting comments:", error)
    return []
  }
}

// Получить рейтинг книги на основе комментариев
export async function getBookRating(bookId: string): Promise<BookRating> {
  try {
    const comments = await getBookComments(bookId)
    const ratingsWithValues = comments.filter((comment) => comment.rating > 0)

    if (ratingsWithValues.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingsCount: 0,
      }
    }

    const totalRating = ratingsWithValues.reduce((sum, comment) => sum + comment.rating, 0)
    const averageRating = totalRating / ratingsWithValues.length

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: totalRating,
      ratingsCount: ratingsWithValues.length,
    }
  } catch (error) {
    console.error("Error calculating book rating:", error)
    return {
      averageRating: 0,
      totalRatings: 0,
      ratingsCount: 0,
    }
  }
}

// Получить рейтинги для нескольких книг (для оптимизации)
export async function getBooksRatings(bookIds: string[]): Promise<Record<string, BookRating>> {
  try {
    const db = getFirebaseDb()
    if (!db) return {}

    const chunks = []
    for (let i = 0; i < bookIds.length; i += 10) {
      chunks.push(bookIds.slice(i, i + 10))
    }

    const commentsByBook: Record<string, Comment[]> = {}

    for (const chunk of chunks) {
      const commentsRef = collection(db, "comments")
      const q = query(commentsRef, where("bookId", "in", chunk))

      const snapshot = await getDocs(q)

      snapshot.forEach((doc) => {
        const data = doc.data()
        const bookId = data.bookId

        if (!commentsByBook[bookId]) {
          commentsByBook[bookId] = []
        }

        commentsByBook[bookId].push({
          id: doc.id,
          bookId: data.bookId,
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          comment: data.comment,
          rating: data.rating || 0,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || new Date().toISOString(),
          updatedAt:
            data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt || undefined,
          isEdited: data.isEdited || false,
        })
      })
    }

    const ratings: Record<string, BookRating> = {}

    for (const bookId of bookIds) {
      const comments = commentsByBook[bookId] || []
      const ratingsWithValues = comments.filter((comment) => comment.rating > 0)

      if (ratingsWithValues.length === 0) {
        ratings[bookId] = {
          averageRating: 0,
          totalRatings: 0,
          ratingsCount: 0,
        }
      } else {
        const totalRating = ratingsWithValues.reduce((sum, comment) => sum + comment.rating, 0)
        const averageRating = totalRating / ratingsWithValues.length

        ratings[bookId] = {
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: totalRating,
          ratingsCount: ratingsWithValues.length,
        }
      }
    }

    return ratings
  } catch (error) {
    console.error("Error getting books ratings:", error)
    return {}
  }
}
