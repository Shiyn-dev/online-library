"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, User, Mail, Calendar, BookOpen, Heart } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/components/firebase-auth-provider"
import Link from "next/link"

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const { items } = useCart()
  const { favorites } = useFavorites()

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("signInRequired")}</h2>
        <p className="text-muted-foreground mb-6">{t("signInToViewProfile")}</p>
        <Button asChild>
          <Link href="/login">{t("signIn")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">{t("myProfile")}</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                <AvatarFallback className="text-2xl">{user.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t("memberSince")} {new Date().getFullYear()}
                </span>
              </div>

              <Button variant="outline" className="w-full" onClick={() => logout()}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("signOut")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("booksInCart")}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{items.length}</div>
                <p className="text-xs text-muted-foreground">{t("booksReadyToDownload")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("favoriteBooks")}</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favorites.length}</div>
                <p className="text-xs text-muted-foreground">{t("booksInFavorites")}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("recentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              {items.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">{t("recentlyAdded")}</h4>
                  <div className="space-y-2">
                    {items.slice(0, 5).map((book) => (
                      <div key={book.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="w-8 h-10 bg-muted rounded flex items-center justify-center text-xs">📚</div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/book/${book.id}`}>
                            <p className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                              {book.title}
                            </p>
                          </Link>
                          {book.authors && book.authors.length > 0 && (
                            <p className="text-xs text-muted-foreground line-clamp-1">{book.authors.join(", ")}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {t("inCart")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {items.length > 5 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/cart">{t("viewAllInCart")}</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t("noRecentActivity")}</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/">{t("startExploring")}</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("preferences")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("language")}</span>
                <Badge variant="outline">English</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("theme")}</span>
                <Badge variant="outline">{t("system")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t("notifications")}</span>
                <Badge variant="outline">{t("enabled")}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
