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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookId) {
      setLoading(false)
      return
    }

    const fetchRating = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/book-rating?bookId=${encodeURIComponent(bookId)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.rating) {
          setRating(data.rating)
        } else {
          console.warn("No rating data received for book:", bookId)
          setRating({
            averageRating: 0,
            totalRatings: 0,
            ratingsCount: 0,
          })
        }
      } catch (error) {
        console.error("Error fetching book rating:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        setRating({
          averageRating: 0,
          totalRatings: 0,
          ratingsCount: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRating()
  }, [bookId])

  return { rating, loading, error }
}

export function useBooksRatings(bookIds: string[]) {
  const [ratings, setRatings] = useState<Record<string, BookRating>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookIds.length) {
      setLoading(false)
      return
    }

    const fetchRatings = async () => {
      try {
        setLoading(true)
        setError(null)

        // Разбиваем на чанки по 10 (ограничение Firestore)
        const chunks = []
        for (let i = 0; i < bookIds.length; i += 10) {
          chunks.push(bookIds.slice(i, i + 10))
        }

        const allRatings: Record<string, BookRating> = {}

        for (const chunk of chunks) {
          const response = await fetch(
            `/api/book-rating?bookIds=${chunk.map((id) => encodeURIComponent(id)).join(",")}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          )

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()

          if (data.success && data.ratings) {
            Object.assign(allRatings, data.ratings)
          }
        }

        setRatings(allRatings)
      } catch (error) {
        console.error("Error fetching books ratings:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()
  }, [bookIds])

  return { ratings, loading, error }
}
