"use client"

import { useCallback } from "react"

export function useCookies() {
  const setCookie = useCallback((name: string, value: string, days = 30) => {
    if (typeof window === "undefined") return

    try {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
    } catch (error) {
      console.error("Error setting cookie:", error)
    }
  }, [])

  const getCookie = useCallback((name: string): string | null => {
    if (typeof window === "undefined") return null

    try {
      const nameEQ = name + "="
      const ca = document.cookie.split(";")
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) === " ") c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length))
        }
      }
      return null
    } catch (error) {
      console.error("Error getting cookie:", error)
      return null
    }
  }, [])

  const deleteCookie = useCallback((name: string) => {
    if (typeof window === "undefined") return

    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=Lax`
    } catch (error) {
      console.error("Error deleting cookie:", error)
    }
  }, [])

  return { setCookie, getCookie, deleteCookie }
}
