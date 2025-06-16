import { type NextRequest, NextResponse } from "next/server"
import { addComment, getBookComments } from "@/lib/firebase-comments"

interface CreateCommentRequest {
  bookId: string
  userId: string
  userName?: string
  userEmail?: string
  comment: string
  rating?: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("bookId")

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    const comments = await getBookComments(bookId)
    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateCommentRequest = await request.json()
    const { bookId, userId, userName, userEmail, comment, rating } = body

    if (!bookId || !userId || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newComment = await addComment({
      bookId,
      userId,
      userName: userName || "Anonymous",
      userEmail: userEmail || "",
      comment,
      rating: rating || 0,
    })

    if (!newComment) {
      return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      comment: newComment,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
