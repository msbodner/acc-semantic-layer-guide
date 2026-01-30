"use client"

import { Button } from "./ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepNavigationProps {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
  showBack?: boolean
  showNext?: boolean
}

export function StepNavigation({
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Continue",
  showBack = true,
  showNext = true,
}: StepNavigationProps) {
  return (
    <div className="mt-10 flex items-center justify-between border-t pt-6">
      {showBack && onBack ? (
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      ) : (
        <div />
      )}
      {showNext && onNext && (
        <Button onClick={onNext} className="gap-2">
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
