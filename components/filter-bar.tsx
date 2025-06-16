"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useBooks } from "@/hooks/use-books"

const CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Biography",
  "Technology",
  "Art",
  "Philosophy",
  "Religion",
  "Business",
  "Health",
  "Travel",
  "Cooking",
  "Sports",
  "Music",
]

export function FilterBar() {
  const { t } = useLanguage()
  const { filters, setFilters, clearFilters } = useBooks()

  const sortOptions = [
    { value: "relevance", label: t("relevance") },
    { value: "newest", label: t("newest") },
  ]

  const hasActiveFilters = filters.category || filters.sortBy !== "relevance"

  const handleCategoryChange = async (value: string) => {
    const category = value === "all" ? undefined : value
    console.log("Category changed to:", category)
    await setFilters({ ...filters, category })
  }

  const handleSortChange = async (value: string) => {
    console.log("Sort changed to:", value)
    await setFilters({ ...filters, sortBy: value as any })
  }

  const handleRemoveCategory = async () => {
    console.log("Removing category filter")
    await setFilters({ ...filters, category: undefined })
  }

  const handleRemoveSort = async () => {
    console.log("Removing sort filter")
    await setFilters({ ...filters, sortBy: "relevance" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Select value={filters.category || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            {t("clearFilters")}
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <X className="h-3 w-3 cursor-pointer" onClick={handleRemoveCategory} />
            </Badge>
          )}
          {filters.sortBy !== "relevance" && (
            <Badge variant="secondary" className="gap-1">
              {t("sortBy")}: {sortOptions.find((opt) => opt.value === filters.sortBy)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={handleRemoveSort} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
