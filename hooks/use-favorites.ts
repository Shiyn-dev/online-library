"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/firebase-auth-provider"
import type { Book } from "@/types/book"
import {
  addToFavorites as addToFavoritesDB,
  removeFromFavorites as removeFromFavoritesDB,
  getFavoriteItems,
  clearFavorites as clearFavoritesDB,
} from "@/lib/firebase-db"

interface UseFavoritesReturn {
  favorites: Book[]
  addToFavorites: (book: Book) => Promise<void>
  removeFromFavorites: (bookId: string) => Promise<void>
  clearFavorites: () => Promise<void>
  isFavorite: (bookId: string) => boolean
  loading: boolean
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  // Загружаем данные из Firebase при входе пользователя
  useEffect(() => {
    const loadFavoriteItems = async () => {
      if (!user) {
        setFavorites([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const favoriteItems = await getFavoriteItems(user.uid)
        setFavorites(favoriteItems)
        console.log("Favorites loaded from Firebase:", favoriteItems.length, "items")
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteItems()
  }, [user])

  const addToFavorites = useCallback(
    async (book: Book) => {
      if (!user) return

      try {
        const success = await addToFavoritesDB(user.uid, book)
        if (success) {
          setFavorites((prev) => {
            const exists = prev.some((item) => item.id === book.id)
            if (exists) return prev
            return [...prev, book]
          })
        }
      } catch (error) {
        console.error("Error adding to favorites:", error)
      }
    },
    [user],
  )

  const removeFromFavorites = useCallback(
    async (bookId: string) => {
      if (!user) return

      try {
        const success = await removeFromFavoritesDB(user.uid, bookId)
        if (success) {
          setFavorites((prev) => prev.filter((item) => item.id !== bookId))
        }
      } catch (error) {
        console.error("Error removing from favorites:", error)
      }
    },
    [user],
  )

  const clearFavorites = useCallback(async () => {
    if (!user) return

    try {
      const success = await clearFavoritesDB(user.uid)
      if (success) {
        setFavorites([])
      }
    } catch (error) {
      console.error("Error clearing favorites:", error)
    }
  }, [user])

  const isFavorite = useCallback(
    (bookId: string) => {
      return favorites.some((item) => item.id === bookId)
    },
    [favorites],
  )

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isFavorite,
    loading,
  }
}
