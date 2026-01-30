"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { AI_PLATFORMS, AZURE_OPENAI_SETUP } from "../../lib/data"
import { cn } from "../../lib/utils"
import { Brain, Sparkles, Zap } from "lucide-react"

interface AIIntegrationStepProps {
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

export function AIIntegrationStep({ onNext, onPrevious, isFirst, isLast }: AIIntegrationStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Integration</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Integrate Azure OpenAI to enable natural language queries on your semantic model.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {AI_PLATFORMS.map((platform) => (
          <Card key={platform.name} className={cn(platform.recommended && "border-primary")}>
            {platform.recommended && (
              <div className="px-3 py-1 text-xs font-medium text-primary-foreground bg-primary rounded-t-lg text-center">
                Recommended
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {platform.name === "Azure OpenAI" && <Brain className="w-5 h-5 text-primary" />}
                {platform.name === "Azure AI Foundry" && <Sparkles className="w-5 h-5 text-primary" />}
                {platform.name === "Fabric Copilot" && <Zap className="w-5 h-5 text-primary" />}
                {platform.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{platform.description}</p>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Best For:</h4>
                <ul className="space-y-1">
                  {platform.useCases.map((useCase) => (
                    <li key={useCase} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Azure OpenAI Setup</CardTitle>
          <p className="text-sm text-muted-foreground">
            Follow these steps to configure Azure OpenAI for your semantic layer
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {AZURE_OPENAI_SETUP.map((step, index) => (
            <div key={step.title} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <h4 className="font-medium text-foreground">{step.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-9">{step.description}</p>
              <div className="ml-9">
                <CodeBlock code={step.code} title={step.title} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <StepNavigation
        onNext={onNext}
        onPrevious={onPrevious}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  )
}
