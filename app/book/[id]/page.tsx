import { BookDetails } from "@/components/book-details"
import { notFound } from "next/navigation"

interface BookPageProps {
  params: Promise<{ id: string }>
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return <BookDetails bookId={id} />
}
