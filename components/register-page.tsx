"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import Link from "next/link"

export function RegisterPage() {
  const { user, loading, signInWithGoogle, signUpWithEmail } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningUp(true)
      setError("")
      await signInWithGoogle()
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsSigningUp(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t("fillAllFields"))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordsDoNotMatch"))
      return
    }

    if (formData.password.length < 6) {
      setError(t("passwordTooShort"))
      return
    }

    try {
      setIsSigningUp(true)
      setError("")
      await signUpWithEmail(formData.email, formData.password, formData.displayName)
    } catch (error: any) {
      console.error("Sign up error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsSigningUp(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return t("emailAlreadyInUse")
      case "auth/invalid-email":
        return t("invalidEmail")
      case "auth/weak-password":
        return t("weakPassword")
      case "auth/network-request-failed":
        return t("networkError")
      default:
        return t("signUpError")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <CardTitle className="text-2xl">{t("createAccount")}</CardTitle>
          <CardDescription>{t("signUpDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Sign Up */}
          <Button className="w-full glow-button" onClick={handleGoogleSignIn} disabled={isSigningUp}>
            <span className="mr-2">🔍</span>
            {isSigningUp ? t("signingUp") : t("signUpWithGoogle")}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
            </div>
          </div>

          {/* Email Sign Up Form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">{t("fullName")}</Label>
              <Input
                id="displayName"
                type="text"
                placeholder={t("enterFullName")}
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                disabled={isSigningUp}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("enterEmail")}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isSigningUp}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isSigningUp}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSigningUp}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("confirmPassword")}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isSigningUp}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSigningUp}
                >
                  {showConfirmPassword ? (
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

            <Button type="submit" className="w-full glow-button" disabled={isSigningUp}>
              {isSigningUp ? t("signingUp") : t("createAccount")}
            </Button>
          </form>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("signIn")}
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">{t("signUpAgreement")}</div>
        </CardContent>
      </Card>
    </div>
  )
}
