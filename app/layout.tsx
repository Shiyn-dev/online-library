import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseAuthProvider } from "@/components/firebase-auth-provider"
import { LanguageProvider } from "@/components/language-provider"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Online Library",
  description: "Your personal online library with Google authentication",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <FirebaseAuthProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">{children}</main>
              </div>
              <Toaster />
            </FirebaseAuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
