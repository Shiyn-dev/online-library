"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedBurgerProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export const AnimatedBurger = forwardRef<HTMLButtonElement, AnimatedBurgerProps>(
  ({ isOpen, onToggle, className }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("burger", className)}
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        type="button"
      >
        <input type="checkbox" checked={isOpen} readOnly />
        <span />
        <span />
        <span />
      </button>
    )
  },
)

AnimatedBurger.displayName = "AnimatedBurger"
