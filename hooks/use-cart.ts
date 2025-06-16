"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/firebase-auth-provider"
import type { Book } from "@/types/book"
import {
  addToCart as addToCartDB,
  removeFromCart as removeFromCartDB,
  getCartItems,
  clearCart as clearCartDB,
} from "@/lib/firebase-db"

interface UseCartReturn {
  items: Book[]
  addItem: (book: Book) => Promise<void>
  removeItem: (bookId: string) => Promise<void>
  clearCart: () => Promise<void>
  isInCart: (bookId: string) => boolean
  loading: boolean
}

export function useCart(): UseCartReturn {
  const { user } = useAuth()
  const [items, setItems] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  // Загружаем данные из Firebase при входе пользователя
  useEffect(() => {
    const loadCartItems = async () => {
      if (!user) {
        setItems([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const cartItems = await getCartItems(user.uid)
        setItems(cartItems)
        console.log("Cart loaded from Firebase:", cartItems.length, "items")
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [user])

  const addItem = useCallback(
    async (book: Book) => {
      if (!user) return

      try {
        const success = await addToCartDB(user.uid, book)
        if (success) {
          setItems((prev) => {
            const exists = prev.some((item) => item.id === book.id)
            if (exists) return prev
            return [...prev, book]
          })
        }
      } catch (error) {
        console.error("Error adding to cart:", error)
      }
    },
    [user],
  )

  const removeItem = useCallback(
    async (bookId: string) => {
      if (!user) return

      try {
        const success = await removeFromCartDB(user.uid, bookId)
        if (success) {
          setItems((prev) => prev.filter((item) => item.id !== bookId))
        }
      } catch (error) {
        console.error("Error removing from cart:", error)
      }
    },
    [user],
  )

  const clearCart = useCallback(async () => {
    if (!user) return

    try {
      const success = await clearCartDB(user.uid)
      if (success) {
        setItems([])
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }, [user])

  const isInCart = useCallback(
    (bookId: string) => {
      return items.some((item) => item.id === bookId)
    },
    [items],
  )

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    loading,
  }
}
