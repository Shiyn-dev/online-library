import { type NextRequest, NextResponse } from "next/server"

interface Comment {
  id: string
  bookId: string
  userId: string
  userName: string
  userEmail: string
  comment: string
  rating: number
  createdAt: string
}

interface CreateCommentRequest {
  bookId: string
  userId: string
  userName?: string
  userEmail?: string
  comment: string
  rating?: number
}

// Временное хранилище (в продакшене используйте базу данных)
const comments: Comment[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get("bookId")

    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
    }

    const bookComments = comments
      .filter((comment) => comment.bookId === bookId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ comments: bookComments })
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

    const newComment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookId,
      userId,
      userName: userName || "Anonymous",
      userEmail: userEmail || "",
      comment,
      rating: rating || 0,
      createdAt: new Date().toISOString(),
    }

    comments.push(newComment)

    return NextResponse.json({
      success: true,
      comment: newComment,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
