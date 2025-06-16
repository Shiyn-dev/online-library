"use client"

import { useState, useCallback } from "react"
import type { Book } from "@/types/book"

interface BookFilters {
  category?: string
  sortBy: "relevance" | "newest"
}

interface UseBooksReturn {
  books: Book[]
  loading: boolean
  error: string | null
  searchQuery: string
  filters: BookFilters
  searchBooks: (query: string) => Promise<void>
  setFilters: (filters: BookFilters) => Promise<void>
  clearFilters: () => Promise<void>
  loadMore: () => Promise<void>
  hasMore: boolean
}

const MAX_RESULTS = 20
const DEFAULT_QUERY = "programming"

export function useBooks(): UseBooksReturn {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFiltersState] = useState<BookFilters>({ sortBy: "relevance" })
  const [startIndex, setStartIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const transformBookData = useCallback(
    (item: any): Book => ({
      id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || "",
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
      categories: item.volumeInfo.categories || [],
      publishedDate: item.volumeInfo.publishedDate || "",
      pageCount: item.volumeInfo.pageCount || 0,
      averageRating: item.volumeInfo.averageRating || 0,
      ratingsCount: item.volumeInfo.ratingsCount || 0,
      language: item.volumeInfo.language || "en",
      publisher: item.volumeInfo.publisher || "",
    }),
    [],
  )

  const buildApiUrl = useCallback((query: string, category: string | undefined, sortBy: string, startIdx: number) => {
    let finalQuery = query.trim() || DEFAULT_QUERY

    if (category && category !== "all") {
      finalQuery += ` subject:${category}`
    }

    const orderBy = sortBy === "newest" ? "newest" : "relevance"

    const baseUrl = "https://www.googleapis.com/books/v1/volumes"
    const params = new URLSearchParams({
      q: finalQuery,
      startIndex: startIdx.toString(),
      maxResults: MAX_RESULTS.toString(),
      orderBy: orderBy,
      printType: "books",
      langRestrict: "en",
    })

    return `${baseUrl}?${params.toString()}`
  }, [])

  const fetchBooks = useCallback(
    async (isNewSearch = false) => {
      try {
        setLoading(true)
        setError(null)

        const currentStartIndex = isNewSearch ? 0 : startIndex
        const url = buildApiUrl(searchQuery, filters.category, filters.sortBy, currentStartIndex)

        console.log("Fetching books:", {
          searchQuery,
          category: filters.category,
          sortBy: filters.sortBy,
          startIndex: currentStartIndex,
          isNewSearch,
          url,
        })

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error.message || "API Error")
        }

        console.log("API Response:", {
          totalItems: data.totalItems,
          itemsCount: data.items?.length || 0,
        })

        if (!data.items || data.items.length === 0) {
          if (isNewSearch) {
            setBooks([])
            setHasMore(false)
          }
          return
        }

        const newBooks: Book[] = data.items.map(transformBookData)

        if (isNewSearch) {
          setBooks(newBooks)
          setStartIndex(MAX_RESULTS)
        } else {
          setBooks((prev) => [...prev, ...newBooks])
          setStartIndex((prev) => prev + MAX_RESULTS)
        }

        setHasMore(newBooks.length === MAX_RESULTS)
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching books"
        setError(errorMessage)
        console.error("Books fetch error:", errorMessage)

        if (isNewSearch) {
          setBooks([])
          setHasMore(false)
        }
      } finally {
        setLoading(false)
      }
    },
    [searchQuery, filters.category, filters.sortBy, startIndex, buildApiUrl, transformBookData],
  )

  const searchBooks = useCallback(
    async (query: string) => {
      console.log("Search books called with:", query)
      setSearchQuery(query)
      setStartIndex(0)
      await fetchBooks(true)
    },
    [fetchBooks],
  )

  const setFilters = useCallback(
    async (newFilters: BookFilters) => {
      console.log("Set filters called with:", newFilters)
      setFiltersState(newFilters)
      setStartIndex(0)
      await fetchBooks(true)
    },
    [fetchBooks],
  )

  const clearFilters = useCallback(async () => {
    console.log("Clear filters called")
    setFiltersState({ sortBy: "relevance" })
    setStartIndex(0)
    await fetchBooks(true)
  }, [fetchBooks])

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      console.log("Load more called")
      await fetchBooks(false)
    }
  }, [loading, hasMore, fetchBooks])

  // Начальная загрузка
  const initializeBooks = useCallback(async () => {
    console.log("Initializing books...")
    await searchBooks("")
  }, [searchBooks])

  return {
    books,
    loading,
    error,
    searchQuery,
    filters,
    searchBooks,
    setFilters,
    clearFilters,
    loadMore,
    hasMore,
    initializeBooks,
  } as any
}
