"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/components/firebase-auth-provider"
import { getAuthErrorMessage, validateSignInForm } from "@/lib/error-utils"
import Link from "next/link"

interface FormData {
  email: string
  password: string
}

export function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setIsSigningIn(true)
      setError("")
      await signInWithGoogle()
    } catch (error: any) {
      setError(t(getAuthErrorMessage(error.code)))
    } finally {
      setIsSigningIn(false)
    }
  }, [signInWithGoogle, t])

  const handleEmailSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      const validationError = validateSignInForm(formData)
      if (validationError) {
        setError(t(validationError))
        return
      }

      try {
        setIsSigningIn(true)
        setError("")
        await signInWithEmail(formData.email, formData.password)
      } catch (error: any) {
        setError(t(getAuthErrorMessage(error.code)))
      } finally {
        setIsSigningIn(false)
      }
    },
    [formData, signInWithEmail, t],
  )

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("welcomeBack")}</CardTitle>
          <CardDescription>{t("signInDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button className="w-full glow-button" onClick={handleGoogleSignIn} disabled={isSigningIn}>
            <span className="mr-2">🔍</span>
            {isSigningIn ? t("signingIn") : t("signInWithGoogle")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("enterEmail")}
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                disabled={isSigningIn}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword")}
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  disabled={isSigningIn}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  disabled={isSigningIn}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full glow-button" disabled={isSigningIn}>
              {isSigningIn ? t("signingIn") : t("signInWithEmail")}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              {t("forgotPassword")}
            </Link>
            <div className="text-sm text-muted-foreground">
              {t("dontHaveAccount")}{" "}
              <Link href="/register" className="text-primary hover:underline">
                {t("signUp")}
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">{t("signInAgreement")}</div>
        </CardContent>
      </Card>
    </div>
  )
}
