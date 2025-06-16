"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/components/firebase-auth-provider"
import Link from "next/link"

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError(t("enterEmail"))
      return
    }

    try {
      setIsLoading(true)
      setError("")
      await resetPassword(email)
      setSuccess(true)
    } catch (error: any) {
      console.error("Reset password error:", error)
      setError(getErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return t("userNotFound")
      case "auth/invalid-email":
        return t("invalidEmail")
      case "auth/network-request-failed":
        return t("networkError")
      default:
        return t("resetPasswordError")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("resetPassword")}</CardTitle>
          <CardDescription>
            {success ? t("resetPasswordSuccessDescription") : t("resetPasswordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {success ? (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{t("resetPasswordEmailSent")}</AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">{t("checkEmailInstructions")}</p>

                <Button asChild className="w-full">
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("backToSignIn")}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("enterEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("sendingResetEmail") : t("sendResetEmail")}
              </Button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1 inline" />
                  {t("backToSignIn")}
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
