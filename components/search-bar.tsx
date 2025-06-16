"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useBooks } from "@/hooks/use-books"

export function SearchBar() {
  const { t } = useLanguage()
  const { searchBooks, searchQuery } = useBooks()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  const handleSearch = async () => {
    console.log("Search button clicked:", localQuery)
    await searchBooks(localQuery.trim())
  }

  const handleClear = async () => {
    console.log("Clear button clicked")
    setLocalQuery("")
    await searchBooks("")
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      await handleSearch()
    }
  }

  return (
    <div className="flex gap-2 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10"
        />
        {localQuery && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button onClick={handleSearch}>{t("search")}</Button>
    </div>
  )
}
