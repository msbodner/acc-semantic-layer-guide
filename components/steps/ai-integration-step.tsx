"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { AI_PLATFORMS, AZURE_OPENAI_SETUP } from "../../lib/data"
import { cn } from "../../lib/utils"
import { Check, Minus } from "lucide-react"

interface AIIntegrationStepProps {
  onBack: () => void
  onNext: () => void
}

export function AIIntegrationStep({ onBack, onNext }: AIIntegrationStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        AI Platform Integration
      </h2>
      <p className="mt-2 text-muted-foreground">
        Connect your semantic layer to AI services for natural language capabilities.
      </p>

      {/* Platform Comparison */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {Object.entries(AI_PLATFORMS).map(([key, platform]) => (
          <Card key={key} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    platform.integration_level === "Native"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-sky-100 text-sky-800"
                  )}
                >
                  {platform.integration_level}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{platform.description}</p>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-emerald-600">Advantages</h5>
                <ul className="mt-2 space-y-1">
                  {platform.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="text-muted-foreground">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-red-600">Considerations</h5>
                <ul className="mt-2 space-y-1">
                  {platform.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                      <span className="text-muted-foreground">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm">
                <strong>Best for:</strong>{" "}
                <span className="text-muted-foreground">{platform.best_for}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendation */}
      <Card className="mt-8 border-l-4 border-l-emerald-500 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="text-emerald-700">Recommendation for Your Use Case</CardTitle>
        </CardHeader>
        <CardContent>
          <h4 className="font-semibold">Azure OpenAI + Fabric Copilot</h4>
          <p className="mt-2 text-muted-foreground">
            Based on your goals (NL queries, Power BI, APIs), we recommend:
          </p>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-foreground">
            <li>
              <strong>Fabric Copilot</strong> - For built-in natural language to DAX in Power BI
            </li>
            <li>
              <strong>Azure OpenAI</strong> - For custom NL query API and advanced scenarios
            </li>
            <li>
              <strong>Azure AI Foundry</strong> - Optional, if you need custom model training on ACC
              domain
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Azure OpenAI Setup Guide */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Azure OpenAI Setup</h3>
        <div className="mt-4 space-y-6">
          {AZURE_OPENAI_SETUP.map((item) => (
            <Card key={item.step} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-semibold">
                  {item.step}
                </span>
                <div>
                  <CardTitle className="text-white">{item.title}</CardTitle>
                  <p className="mt-1 text-sm text-white/80">{item.description}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <CodeBlock code={item.code} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} />
    </div>
  )
}
