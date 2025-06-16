import { BookGrid } from "@/components/book-grid"
import { SearchBar } from "@/components/search-bar"
import { FilterBar } from "@/components/filter-bar"
import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />
      <div className="space-y-6">
        <SearchBar />
        <FilterBar />
        <BookGrid />
      </div>
    </div>
  )
}
