"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Download, Heart, ShoppingCart, Star, Calendar, User, BookOpen } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/firebase-auth-provider"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Book } from "@/types/book"
import { BookComments } from "@/components/book-comments"

interface BookDetailsProps {
  bookId: string
}

export function BookDetails({ bookId }: BookDetailsProps) {
  const { t } = useLanguage()
  const { addItem, isInCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
        const data = await response.json()

        const bookData: Book = {
          id: data.id,
          title: data.volumeInfo.title || "Unknown Title",
          authors: data.volumeInfo.authors || [],
          description: data.volumeInfo.description || "",
          thumbnail:
            data.volumeInfo.imageLinks?.large ||
            data.volumeInfo.imageLinks?.medium ||
            data.volumeInfo.imageLinks?.thumbnail ||
            "",
          categories: data.volumeInfo.categories || [],
          publishedDate: data.volumeInfo.publishedDate || "",
          pageCount: data.volumeInfo.pageCount || 0,
          averageRating: data.volumeInfo.averageRating || 0,
          ratingsCount: data.volumeInfo.ratingsCount || 0,
          language: data.volumeInfo.language || "en",
          publisher: data.volumeInfo.publisher || "",
        }

        setBook(bookData)
      } catch (error) {
        console.error("Error fetching book:", error)
        toast({
          title: t("error"),
          description: t("errorLoadingBook"),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId, t, toast])

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToAddToCart"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (book) {
      addItem(book)
      toast({
        title: t("addedToCart"),
        description: t("bookAddedToCart", { title: book.title }),
      })
    }
  }

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToAddToFavorites"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!book) return

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
  }

  const handleDownloadPDF = async () => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToDownload"),
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!book) return

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${book.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)

        toast({
          title: t("downloadStarted"),
          description: t("pdfDownloadStarted"),
        })
      } else {
        throw new Error("Failed to generate PDF")
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: t("error"),
        description: t("errorDownloadingPDF"),
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-[3/4] w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("bookNotFound")}</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("goBack")}
        </Button>
      </div>
    )
  }

  const inCart = isInCart(book.id)
  const isBookFavorite = isFavorite(book.id)

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("goBack")}
      </Button>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Book Cover and Actions */}
        <div className="space-y-6">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
            {!imageError && book.thumbnail ? (
              <Image
                src={book.thumbnail || "/placeholder.svg"}
                alt={book.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-sm text-muted-foreground">{t("noImage")}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              className={cn("w-full glow-button", inCart && "glow-button-secondary")}
              onClick={handleAddToCart}
              disabled={inCart}
              variant={inCart ? "secondary" : "default"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {inCart ? t("inCart") : t("addToCart")}
            </Button>

            <Button variant="outline" className="w-full glow-button-secondary" onClick={handleToggleFavorite}>
              <Heart className={cn("h-4 w-4 mr-2", isBookFavorite && "fill-red-500 text-red-500")} />
              {isBookFavorite ? t("removeFromFavorites") : t("addToFavorites")}
            </Button>

            <Button variant="outline" className="w-full glow-button" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              {t("downloadPDF")}
            </Button>
          </div>
        </div>

        {/* Book Information */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            {book.authors && book.authors.length > 0 && (
              <p className="text-xl text-muted-foreground mb-4">
                {t("by")} {book.authors.join(", ")}
              </p>
            )}

            {book.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{book.averageRating.toFixed(1)}</span>
                </div>
                {book.ratingsCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({book.ratingsCount} {t("ratings")})
                  </span>
                )}
              </div>
            )}

            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {book.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {book.description && (
            <Card>
              <CardHeader>
                <CardTitle>{t("description")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t("bookDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {book.publisher && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{t("publisher")}:</strong> {book.publisher}
                  </span>
                </div>
              )}

              {book.publishedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{t("publishedDate")}:</strong> {book.publishedDate}
                  </span>
                </div>
              )}

              {book.pageCount > 0 && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>{t("pages")}:</strong> {book.pageCount}
                  </span>
                </div>
              )}

              {book.language && (
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    <strong>{t("language")}:</strong> {book.language.toUpperCase()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
          <BookComments bookId={book.id} />
        </div>
      </div>
    </div>
  )
}
