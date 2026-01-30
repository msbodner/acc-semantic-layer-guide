"use client"

import { cn } from "../lib/utils"
import { STEPS, type StepId } from "../lib/data"
import { Check } from "lucide-react"

interface SidebarProps {
  currentStep: StepId
  completedSteps: StepId[]
  onStepClick: (step: StepId) => void
}

export function Sidebar({ currentStep, completedSteps, onStepClick }: SidebarProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
  const progress = ((currentIndex + 1) / STEPS.length) * 100

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-foreground))]">
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold tracking-tight">ACC Semantic Layer</h1>
        <p className="mt-1 text-sm text-sky-400">Build Guide</p>
      </div>

      <ul className="mt-2 flex-1 space-y-1 px-4">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = completedSteps.includes(step.id)

          return (
            <li key={step.id}>
              <button
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all",
                  isActive
                    ? "bg-[hsl(var(--primary))] text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                  isCompleted && !isActive && "text-white/90"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    isActive
                      ? "bg-white/20"
                      : isCompleted
                        ? "bg-[hsl(var(--success))]"
                        : "bg-white/20"
                  )}
                >
                  {isCompleted && !isActive ? <Check className="h-4 w-4" /> : step.number}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="px-6 pb-6">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-sky-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-white/60">
          Step {currentIndex + 1} of {STEPS.length}
        </p>
      </div>
    </nav>
  )
}
