"use client"

import { useState, useEffect } from "react"
import type { BookRating } from "@/lib/firebase-comments"

export function useBookRating(bookId: string) {
  const [rating, setRating] = useState<BookRating>({
    averageRating: 0,
    totalRatings: 0,
    ratingsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookId) return

    const fetchRating = async () => {
      try {
        const response = await fetch(`/api/book-rating?bookId=${bookId}`)
        const data = await response.json()
        if (data.rating) {
          setRating(data.rating)
        }
      } catch (error) {
        console.error("Error fetching book rating:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRating()
  }, [bookId])

  return { rating, loading }
}

export function useBooksRatings(bookIds: string[]) {
  const [ratings, setRatings] = useState<Record<string, BookRating>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookIds.length) {
      setLoading(false)
      return
    }

    const fetchRatings = async () => {
      try {
        // Разбиваем на чанки по 10 (ограничение Firestore)
        const chunks = []
        for (let i = 0; i < bookIds.length; i += 10) {
          chunks.push(bookIds.slice(i, i + 10))
        }

        const allRatings: Record<string, BookRating> = {}

        for (const chunk of chunks) {
          const response = await fetch(`/api/book-rating?bookIds=${chunk.join(",")}`)
          const data = await response.json()
          if (data.ratings) {
            Object.assign(allRatings, data.ratings)
          }
        }

        setRatings(allRatings)
      } catch (error) {
        console.error("Error fetching books ratings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [bookIds])

  return { ratings, loading }
}
