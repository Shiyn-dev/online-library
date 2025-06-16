import { type NextRequest, NextResponse } from "next/server"

// Временное хранение покупок в памяти (в продакшене используйте базу данных)
const purchases: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, userName, books } = await request.json()

    if (!userId || !books || books.length === 0) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Рассчитываем общую стоимость (по $9.99 за книгу)
    const totalAmount = books.length * 9.99

    // Создаем запись о покупке
    const purchaseData = {
      id: Date.now().toString(),
      userId,
      userEmail,
      userName,
      books: books.map((book: any) => ({
        id: book.id,
        title: book.title,
        authors: book.authors,
        price: 9.99,
      })),
      totalAmount,
      purchaseDate: new Date().toISOString(),
      status: "completed",
    }

    purchases.push(purchaseData)

    // Отправляем email уведомление
    if (userEmail) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/send-purchase-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            userName,
            books,
            totalAmount,
          }),
        })
      } catch (emailError) {
        console.error("Failed to send email:", emailError)
        // Не прерываем процесс покупки из-за ошибки email
      }
    }

    return NextResponse.json({
      success: true,
      purchaseId: purchaseData.id,
      totalAmount,
    })
  } catch (error) {
    console.error("Error processing purchase:", error)
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 })
  }
}
