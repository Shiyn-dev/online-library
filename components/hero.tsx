"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { BookOpen, Search, Heart } from "lucide-react"

export function Hero() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-24 text-center text-white">
      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t("heroTitle")}</h1>
        <p className="mt-6 text-lg leading-8 text-blue-100">{t("heroDescription")}</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button size="lg" variant="secondary">
            <Search className="mr-2 h-4 w-4" />
            {t("startExploring")}
          </Button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]">
          <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20" />
        </div>
      </div>

      {/* Feature icons */}
      <div className="absolute top-8 left-8 opacity-20">
        <BookOpen className="h-12 w-12" />
      </div>
      <div className="absolute top-16 right-12 opacity-20">
        <Heart className="h-8 w-8" />
      </div>
      <div className="absolute bottom-12 left-16 opacity-20">
        <Search className="h-10 w-10" />
      </div>
    </div>
  )
}
