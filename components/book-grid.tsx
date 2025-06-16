"use client"
import { useEffect } from "react"
import { BookCard } from "@/components/book-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/hooks/use-language"
import { useBooks } from "@/hooks/use-books"

export function BookGrid() {
  const { t } = useLanguage()
  const { books, loading, error, loadMore, hasMore, searchQuery, filters, initializeBooks } = useBooks()

  // Инициализация при монтировании
  useEffect(() => {
    console.log("BookGrid mounted, initializing...")
    initializeBooks()
  }, [])

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("errorLoadingBooks")}</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <Button onClick={initializeBooks} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {searchQuery && (
        <div className="text-center">
          <p className="text-muted-foreground">
            {t("searchResults")} "{searchQuery}" ({books.length} {t("books")})
          </p>
          {filters.category && <p className="text-sm text-muted-foreground">Category: {filters.category}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book, index) => (
          <BookCard key={`${book.id}-${index}`} book={book} />
        ))}

        {loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
      </div>

      {hasMore && !loading && books.length > 0 && (
        <div className="text-center">
          <Button onClick={loadMore} variant="outline">
            {t("loadMore")}
          </Button>
        </div>
      )}

      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{searchQuery ? t("noSearchResults") : t("noBooksFound")}</p>
          {searchQuery && <p className="text-sm text-muted-foreground mt-2">{t("tryDifferentSearch")}</p>}
        </div>
      )}
    </div>
  )
}
