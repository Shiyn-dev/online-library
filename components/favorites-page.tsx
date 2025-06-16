"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Heart, ArrowLeft, ShoppingCart } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/firebase-auth-provider"

export function FavoritesPage() {
  const { t } = useLanguage()
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addItem, isInCart } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()

  // Отладочная информация
  useEffect(() => {
    console.log("Favorites page rendered, favorites count:", favorites.length)
    console.log(
      "Favorites:",
      favorites.map((f) => ({ id: f.id, title: f.title })),
    )
  }, [favorites])

  if (!user) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("signInRequired")}</h2>
        <p className="text-muted-foreground mb-6">{t("signInToViewFavorites")}</p>
        <Button asChild>
          <Link href="/login">{t("signIn")}</Link>
        </Button>
      </div>
    )
  }

  const handleRemoveFromFavorites = (bookId: string, title: string) => {
    console.log("Removing from favorites:", bookId, title)
    removeFromFavorites(bookId)
    toast({
      title: t("removedFromFavorites"),
      description: t("bookRemovedFromFavorites", { title }),
    })
  }

  const handleClearFavorites = () => {
    console.log("Clearing all favorites")
    clearFavorites()
    toast({
      title: t("favoritesCleared"),
      description: t("allBooksRemovedFromFavorites"),
    })
  }

  const handleAddToCart = (book: any) => {
    console.log("Adding to cart from favorites:", book.id, book.title)
    addItem(book)
    toast({
      title: t("addedToCart"),
      description: t("bookAddedToCart", { title: book.title }),
    })
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("emptyFavorites")}</h2>
        <p className="text-muted-foreground mb-6">{t("emptyFavoritesDescription")}</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("continueBrowsing")}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("myFavorites")}</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {favorites.length} {favorites.length === 1 ? t("book") : t("books")}
        </Badge>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleClearFavorites}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t("clearFavorites")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((book, index) => (
          <Card key={`${book.id}-${index}`} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Link href={`/book/${book.id}`}>
                {book.thumbnail ? (
                  <Image
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
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
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <Link href={`/book/${book.id}`}>
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">{book.title}</h3>
                </Link>

                {book.authors && book.authors.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {t("by")} {book.authors.join(", ")}
                  </p>
                )}

                {book.categories && book.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {book.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(book)}
                  disabled={isInCart(book.id)}
                  variant={isInCart(book.id) ? "secondary" : "default"}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(book.id) ? t("inCart") : t("addToCart")}
                </Button>

                <Button size="sm" variant="outline" onClick={() => handleRemoveFromFavorites(book.id, book.title)}>
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
