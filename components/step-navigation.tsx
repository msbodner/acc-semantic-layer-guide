"use client"

import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface StepNavigationProps {
  onNext?: () => void
  onPrevious?: () => void
  isFirst?: boolean
  isLast?: boolean
  nextLabel?: string
  previousLabel?: string
}

export function StepNavigation({
  onNext,
  onPrevious,
  isFirst = false,
  isLast = false,
  nextLabel = "Continue",
  previousLabel = "Back",
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
      {!isFirst ? (
        <Button variant="outline" onClick={onPrevious}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          {previousLabel}
        </Button>
      ) : (
        <div />
      )}
      {!isLast && (
        <Button onClick={onNext}>
          {nextLabel}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  )
}
