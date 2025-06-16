import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, books, totalAmount } = await request.json()

    if (!userEmail || !books || books.length === 0) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    // Создаем транспортер для отправки email
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Формируем список книг для email
    const booksList = books
      .map(
        (book: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${book.title}</strong><br>
          <small>by ${book.authors?.join(", ") || "Unknown Author"}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $9.99
        </td>
      </tr>
    `,
      )
      .join("")

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Purchase Confirmation - Online Library</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">📚 Online Library</h1>
              <h2 style="color: #059669;">Purchase Confirmation</h2>
            </div>
            
            <p>Dear ${userName || "Valued Customer"},</p>
            
            <p>Thank you for your purchase! Your order has been successfully processed.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #e2e8f0;">
                    <th style="padding: 10px; text-align: left;">Book</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${booksList}
                </tbody>
                <tfoot>
                  <tr style="background-color: #e2e8f0; font-weight: bold;">
                    <td style="padding: 10px;">Total</td>
                    <td style="padding: 10px; text-align: right;">$${totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
              <p style="margin: 0;"><strong>What's Next?</strong></p>
              <p style="margin: 5px 0 0 0;">You can now download your purchased books as PDF files from your account. Visit your library to access your collection!</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p>Thank you for choosing Online Library!</p>
              <p style="color: #6b7280; font-size: 14px;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Отправляем email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "📚 Purchase Confirmation - Online Library",
      html: emailHtml,
    })

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
