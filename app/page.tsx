"use client"

import { useState, useCallback } from "react"

// Components
import { Sidebar } from "../components/sidebar"
import { OverviewStep } from "../components/steps/overview-step"
import { AccDataStep } from "../components/steps/acc-data-step"
import { FabricSetupStep } from "../components/steps/fabric-setup-step"
import { SemanticModelStep } from "../components/steps/semantic-model-step"
import { AIIntegrationStep } from "../components/steps/ai-integration-step"
import { NLQueriesStep } from "../components/steps/nl-queries-step"
import { DeploymentStep } from "../components/steps/deployment-step"

// Data
import { STEPS, type StepId } from "../lib/data"

export default function Home() {
  const [currentStep, setCurrentStep] = useState<StepId>("overview")
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([])
  const [selectedSchemas, setSelectedSchemas] = useState<string[]>(["projects", "issues"])
  const [selectedTemplate, setSelectedTemplate] = useState("comprehensive")

  const navigateToStep = useCallback((stepId: StepId) => {
    // Mark current step as completed if moving forward
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep]
      }
      return prev
    })
    setCurrentStep(stepId)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentStep])

  const getNextStep = (): StepId | null => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
    if (currentIndex < STEPS.length - 1) {
      return STEPS[currentIndex + 1].id
    }
    return null
  }

  const getPrevStep = (): StepId | null => {
    const currentIndex = STEPS.findIndex((s) => s.id === currentStep)
    if (currentIndex > 0) {
      return STEPS[currentIndex - 1].id
    }
    return null
  }

  const handleNext = () => {
    const next = getNextStep()
    if (next) navigateToStep(next)
  }

  const handleBack = () => {
    const prev = getPrevStep()
    if (prev) navigateToStep(prev)
  }

  const renderStep = () => {
    switch (currentStep) {
      case "overview":
        return <OverviewStep onNext={handleNext} />
      case "acc-data":
        return (
          <AccDataStep
            onBack={handleBack}
            onNext={handleNext}
            selectedSchemas={selectedSchemas}
            onSchemasChange={setSelectedSchemas}
          />
        )
      case "fabric-setup":
        return <FabricSetupStep onBack={handleBack} onNext={handleNext} />
      case "semantic-model":
        return (
          <SemanticModelStep
            onBack={handleBack}
            onNext={handleNext}
            selectedSchemas={selectedSchemas}
            selectedTemplate={selectedTemplate}
            onTemplateChange={setSelectedTemplate}
          />
        )
      case "ai-integration":
        return <AIIntegrationStep onBack={handleBack} onNext={handleNext} />
      case "nl-queries":
        return <NLQueriesStep onBack={handleBack} onNext={handleNext} />
      case "deployment":
        return <DeploymentStep onBack={handleBack} />
      default:
        return <OverviewStep onNext={handleNext} />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={navigateToStep}
      />
      <main className="ml-72 flex-1 p-8 lg:p-12">
        <div className="mx-auto max-w-4xl">{renderStep()}</div>
      </main>
    </div>
  )
}
