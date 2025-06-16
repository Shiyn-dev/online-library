"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { AnimatedBurger } from "@/components/animated-burger"
import { ShoppingCart, User, LogOut, BookOpen, Heart } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/components/firebase-auth-provider"

export function Header() {
  const { user, logout, loading } = useAuth()
  const { t } = useLanguage()
  const { items } = useCart()
  const { favorites } = useFavorites()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Отладочная информация для индикаторов
  useEffect(() => {
    console.log("Header indicators update:", {
      cartCount: items.length,
      favoritesCount: favorites.length,
      cartItems: items.map((i) => i.id),
      favoriteItems: favorites.map((f) => f.id),
    })
  }, [items, favorites])

  // Закрываем мобильное меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-xl">{t("appName")}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t("home")}
            </Link>
            {!loading && user && (
              <>
                <Link href="/favorites" className="relative text-sm font-medium hover:text-primary transition-colors">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{t("favorites")}</span>
                    {favorites.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {favorites.length}
                      </span>
                    )}
                  </div>
                </Link>
                <Link href="/cart" className="relative text-sm font-medium hover:text-primary transition-colors">
                  <div className="flex items-center space-x-1">
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t("cart")}</span>
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {items.length}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />

            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && <p className="font-medium">{user.displayName}</p>}
                      {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onSelect={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("signOut")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">{t("signIn")}</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button - Animated Burger */}
          <div className="md:hidden">
            <AnimatedBurger
              isOpen={mobileMenuOpen}
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>
              {!loading && user && (
                <>
                  <Link
                    href="/favorites"
                    className="text-sm font-medium flex items-center space-x-2 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    <span>
                      {t("favorites")} ({favorites.length})
                    </span>
                  </Link>
                  <Link
                    href="/cart"
                    className="text-sm font-medium flex items-center space-x-2 hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {t("cart")} ({items.length})
                    </span>
                  </Link>
                </>
              )}
              <div className="flex items-center space-x-4 pt-4 border-t">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              ) : user ? (
                <div className="pt-4 border-t space-y-2">
                  <Link
                    href="/profile"
                    className="text-sm font-medium block hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("profile")}
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    {t("signOut")}
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-fit">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    {t("signIn")}
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
