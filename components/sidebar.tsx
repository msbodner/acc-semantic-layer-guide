"use client"

import { cn } from "@/lib/utils"
import { STEPS, type StepId } from "@/lib/data"
import { Check } from "lucide-react"

interface SidebarProps {
  currentStep: StepId
  onStepChange: (stepId: StepId) => void
}

export function Sidebar({ currentStep, onStepChange }: SidebarProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep)

  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">ACC Semantic Layer</h1>
        <p className="text-sm text-muted-foreground mt-1">Build Guide</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep
            const isCompleted = index < currentIndex

            return (
              <li key={step.id}>
                <button
                  onClick={() => onStepChange(step.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
                      isActive
                        ? "bg-primary-foreground text-primary"
                        : isCompleted
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted-foreground/20 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      step.number
                    )}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Step {currentIndex + 1} of {STEPS.length}
        </p>
      </div>
    </aside>
  )
}
