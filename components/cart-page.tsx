"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trash2, Download, ShoppingCart, ArrowLeft, CreditCard } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/firebase-auth-provider"
import { useRouter } from "next/navigation"

export function CartPage() {
  const { t } = useLanguage()
  const { items, removeItem, clearCart } = useCart()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  // Отладочная информация
  useEffect(() => {
    console.log("Cart page rendered, items count:", items.length)
    console.log(
      "Cart items:",
      items.map((item) => ({ id: item.id, title: item.title })),
    )
  }, [items])

  if (!user) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("signInRequired")}</h2>
        <p className="text-muted-foreground mb-6">{t("signInToViewCart")}</p>
        <Button asChild>
          <Link href="/login">{t("signIn")}</Link>
        </Button>
      </div>
    )
  }

  const handleRemoveItem = (bookId: string, title: string) => {
    console.log("Removing from cart:", bookId, title)
    removeItem(bookId)
    toast({
      title: t("removedFromCart"),
      description: t("bookRemovedFromCart", { title }),
    })
  }

  const handleClearCart = () => {
    console.log("Clearing cart")
    clearCart()
    toast({
      title: t("cartCleared"),
      description: t("allBooksRemovedFromCart"),
    })
  }

  const handlePurchase = async () => {
    if (!user || items.length === 0) return

    setPurchasing(true)
    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          books: items,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: t("purchaseSuccessful"),
          description: t("purchaseConfirmationSent"),
        })
        clearCart()
        router.push("/profile")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Purchase error:", error)
      toast({
        title: t("error"),
        description: t("purchaseError"),
        variant: "destructive",
      })
    } finally {
      setPurchasing(false)
    }
  }

  const handleDownloadSingle = async (book: any) => {
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

  const handleDownloadAll = async () => {
    setDownloadingAll(true)
    try {
      for (const book of items) {
        await handleDownloadSingle(book)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      toast({
        title: t("allDownloadsStarted"),
        description: t("allPDFsDownloadStarted"),
      })
    } catch (error) {
      console.error("Error downloading all PDFs:", error)
      toast({
        title: t("error"),
        description: t("errorDownloadingAllPDFs"),
        variant: "destructive",
      })
    } finally {
      setDownloadingAll(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("emptyCart")}</h2>
        <p className="text-muted-foreground mb-6">{t("emptyCartDescription")}</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("continueBrowsing")}
          </Link>
        </Button>
      </div>
    )
  }

  const totalPrice = items.length * 9.99

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("myCart")}</h1>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {items.length} {items.length === 1 ? t("book") : t("books")}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="flex-1 glow-button-secondary"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadingAll ? t("downloading") : t("downloadAllPDFs")}
            </Button>

            <Button variant="outline" onClick={handleClearCart} className="flex-1 glow-button-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              {t("clearCart")}
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((book, index) => (
              <Card key={`${book.id}-${index}`} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-32 bg-muted rounded-lg overflow-hidden">
                        {book.thumbnail ? (
                          <Image
                            src={book.thumbnail || "/placeholder.svg"}
                            alt={book.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="text-2xl">📚</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link href={`/book/${book.id}`}>
                            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                              {book.title}
                            </h3>
                          </Link>

                          {book.authors && book.authors.length > 0 && (
                            <p className="text-muted-foreground mt-1">
                              {t("by")} {book.authors.join(", ")}
                            </p>
                          )}

                          {book.categories && book.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {book.categories.slice(0, 3).map((category) => (
                                <Badge key={category} variant="outline" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {book.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {book.description.replace(/<[^>]*>/g, "")}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          <div className="text-lg font-bold">$9.99</div>

                          <Button size="sm" onClick={() => handleDownloadSingle(book)} variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            {t("downloadPDF")}
                          </Button>

                          <Button size="sm" variant="outline" onClick={() => handleRemoveItem(book.id, book.title)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("remove")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t("orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("subtotal")}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("tax")}</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("total")}</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full glow-button" size="lg" onClick={handlePurchase} disabled={purchasing}>
                {purchasing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t("processing")}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t("purchaseNow")}
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center">{t("purchaseAgreement")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
