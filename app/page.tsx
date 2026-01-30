"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "../components/sidebar"
import { OverviewStep } from "../components/steps/overview-step"
import { AccDataStep } from "../components/steps/acc-data-step"
import { FabricSetupStep } from "../components/steps/fabric-setup-step"
import { SemanticModelStep } from "../components/steps/semantic-model-step"
import { AIIntegrationStep } from "../components/steps/ai-integration-step"
import { NLQueriesStep } from "../components/steps/nl-queries-step"
import { DeploymentStep } from "../components/steps/deployment-step"
import { STEPS, type StepId } from "../lib/data"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepId>("overview")

  const handleStepChange = useCallback((stepId: StepId) => {
    setCurrentStep(stepId)
  }, [])

  const handleNext = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id)
    }
  }, [currentStep])

  const handlePrevious = useCallback(() => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id)
    }
  }, [currentStep])

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === STEPS.length - 1

  const renderStep = () => {
    switch (currentStep) {
      case "overview":
        return <OverviewStep onNext={handleNext} />
      case "acc-data":
        return (
          <AccDataStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      case "fabric-setup":
        return (
          <FabricSetupStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      case "semantic-model":
        return (
          <SemanticModelStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      case "ai-integration":
        return (
          <AIIntegrationStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      case "nl-queries":
        return (
          <NLQueriesStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      case "deployment":
        return (
          <DeploymentStep
            onPrevious={handlePrevious}
            isFirst={isFirst}
            isLast={isLast}
          />
        )
      default:
        return <OverviewStep onNext={handleNext} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentStep={currentStep} onStepChange={handleStepChange} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-5xl px-6 py-8">
          {renderStep()}
        </div>
      </main>
    </div>
  )
}
