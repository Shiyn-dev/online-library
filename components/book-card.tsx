"use client"

import { useState, useCallback, memo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/firebase-auth-provider"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Book } from "@/types/book"
import { useBookRating } from "@/hooks/use-book-ratings"

interface BookCardProps {
  book: Book
}

function BookCardComponent({ book }: BookCardProps) {
  const { t } = useLanguage()
  const { addItem, isInCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [imageError, setImageError] = useState(false)
  const { rating: firebaseRating, loading: ratingLoading, error: ratingError } = useBookRating(book.id)

  // Используем Firebase рейтинг если он есть, иначе Google Books рейтинг
  const displayRating = firebaseRating?.averageRating > 0 ? firebaseRating.averageRating : book.averageRating
  const displayRatingsCount = firebaseRating?.ratingsCount > 0 ? firebaseRating.ratingsCount : book.ratingsCount

  // Логирование для отладки
  useEffect(() => {
    if (!ratingLoading && !ratingError) {
      console.log(`Book ${book.id} ratings:`, {
        firebase: firebaseRating,
        google: { averageRating: book.averageRating, ratingsCount: book.ratingsCount },
        display: { rating: displayRating, count: displayRatingsCount },
      })
    }
  }, [
    book.id,
    firebaseRating,
    ratingLoading,
    ratingError,
    book.averageRating,
    book.ratingsCount,
    displayRating,
    displayRatingsCount,
  ])

  const handleAddToCart = useCallback(() => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToAddToCart"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    addItem(book)
    toast({
      title: t("addedToCart"),
      description: t("bookAddedToCart", { title: book.title }),
    })
  }, [user, book, addItem, toast, t, router])

  const handleToggleFavorite = useCallback(() => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToAddToFavorites"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    const isCurrentlyFavorite = isFavorite(book.id)

    if (isCurrentlyFavorite) {
      removeFromFavorites(book.id)
      toast({
        title: t("removedFromFavorites"),
        description: t("bookRemovedFromFavorites", { title: book.title }),
      })
    } else {
      addToFavorites(book)
      toast({
        title: t("addedToFavorites"),
        description: t("bookAddedToFavorites", { title: book.title }),
      })
    }
  }, [user, book, isFavorite, addToFavorites, removeFromFavorites, toast, t, router])

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const inCart = isInCart(book.id)
  const isBookFavorite = isFavorite(book.id)

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/book/${book.id}`}>
          {!imageError && book.thumbnail ? (
            <Image
              src={book.thumbnail || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-sm text-muted-foreground">{t("noImage")}</p>
              </div>
            </div>
          )}
        </Link>

        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity glow-button-secondary",
            isBookFavorite && "opacity-100",
          )}
          onClick={handleToggleFavorite}
        >
          <Heart className={cn("h-4 w-4", isBookFavorite && "fill-red-500 text-red-500")} />
        </Button>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {displayRating > 0 ? (
            <Badge className="bg-yellow-500/90 text-yellow-50 backdrop-blur-sm shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {displayRating.toFixed(1)}
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-500/90 text-white backdrop-blur-sm shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              {t("noRating") || "N/A"}
            </Badge>
          )}

          {/* Показываем количество отзывов если есть */}
          {displayRatingsCount > 0 && (
            <Badge variant="outline" className="bg-white/90 text-gray-700 backdrop-blur-sm shadow-sm text-xs">
              {displayRatingsCount} {displayRatingsCount === 1 ? t("review") || "review" : t("reviews") || "reviews"}
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <Link href={`/book/${book.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">{book.title}</h3>
        </Link>
        {book.authors.length > 0 && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{book.authors.join(", ")}</p>
        )}

        {/* Дополнительная информация о рейтинге в тексте */}
        {displayRating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3 w-3",
                    star <= Math.round(displayRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({displayRating.toFixed(1)})</span>
            {firebaseRating?.ratingsCount > 0 && <span className="text-xs text-blue-600 ml-1">• Firebase</span>}
          </div>
        )}

        {book.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {book.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className={cn("w-full glow-button", inCart && "glow-button-secondary")}
          onClick={handleAddToCart}
          disabled={inCart}
          variant={inCart ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inCart ? t("inCart") : t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Мемоизация компонента для предотвращения лишних рендеров
export const BookCard = memo(BookCardComponent)
