import { type NextRequest, NextResponse } from "next/server"
import { getBookRating, getBooksRatings } from "@/lib/firebase-comments"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("bookId")
    const bookIds = searchParams.get("bookIds")

    if (bookIds) {
      // Получить рейтинги для нескольких книг
      const bookIdsArray = bookIds.split(",")
      const ratings = await getBooksRatings(bookIdsArray)
      return NextResponse.json({ ratings })
    } else if (bookId) {
      // Получить рейтинг для одной книги
      const rating = await getBookRating(bookId)
      return NextResponse.json({ rating })
    } else {
      return NextResponse.json({ error: "Book ID or Book IDs are required" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching book rating:", error)
    return NextResponse.json({ error: "Failed to fetch book rating" }, { status: 500 })
  }
}
