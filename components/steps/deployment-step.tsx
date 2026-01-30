"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { Button } from "../ui/button"
import { Download, FileText } from "lucide-react"

interface DeploymentStepProps {
  onBack: () => void
}

const checklistItems = [
  "Fabric workspace configured with appropriate capacity",
  "ACC data ingestion pipeline tested and scheduled",
  "Semantic model created with all measures and relationships",
  "Row-level security (RLS) configured for project access",
  "Azure OpenAI resource deployed and models configured",
  "Natural language query service tested with sample questions",
  "Power BI reports created and shared",
  "API endpoints documented and secured",
]

const bestPractices = [
  {
    title: "Data Freshness",
    color: "border-t-blue-600",
    items: [
      "Schedule incremental refresh for large tables",
      "Use change data capture (CDC) when available",
      "Set appropriate refresh frequency",
    ],
  },
  {
    title: "Security",
    color: "border-t-sky-500",
    items: [
      "Implement row-level security based on project membership",
      "Use managed identity for service connections",
      "Store API keys in Azure Key Vault",
    ],
  },
  {
    title: "Performance",
    color: "border-t-orange-500",
    items: [
      "Use Direct Lake mode for large datasets",
      "Create aggregation tables for common queries",
      "Monitor query performance in Fabric metrics",
    ],
  },
  {
    title: "Natural Language Quality",
    color: "border-t-emerald-500",
    items: [
      "Add detailed descriptions to all measures",
      "Include synonyms for construction terminology",
      "Test with real user questions and iterate",
    ],
  },
]

const architectureDiagram = `ACC SEMANTIC LAYER ARCHITECTURE

[Autodesk Construction Cloud]
        |
        v
[Microsoft Fabric Lakehouse]
  - Raw Tables
  - Curated Tables
        |
        v
[Semantic Model]
  - Dimensions
  - Facts
  - Measures
        |
        v
[Azure OpenAI]
  - NL to DAX Service
  - Answer Generation
        |
        v
[Consumption Layer]
  - Power BI Reports
  - NL Query API
  - Custom Apps`

export function DeploymentStep({ onBack }: DeploymentStepProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(index)) {
      newChecked.delete(index)
    } else {
      newChecked.add(index)
    }
    setCheckedItems(newChecked)
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Deployment and Best Practices
      </h2>
      <p className="mt-2 text-muted-foreground">
        Deploy your semantic layer and set up for production use.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklistItems.map((item, index) => (
              <label
                key={index}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={checkedItems.has(index)}
                  onCheckedChange={() => toggleItem(index)}
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {checkedItems.size} of {checklistItems.length} items completed
          </p>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Best Practices</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {bestPractices.map((practice) => (
            <Card key={practice.title} className={`border-t-4 ${practice.color}`}>
              <CardHeader>
                <CardTitle className="text-base">{practice.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                  {practice.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Final Architecture</h3>
        <div className="mt-4">
          <CodeBlock code={architectureDiagram} />
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
        <h3 className="text-2xl font-bold">You are Ready!</h3>
        <p className="mx-auto mt-2 max-w-lg text-white/80">
          You now have a complete guide to building a semantic layer for your ACC data.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            className="gap-2 bg-white text-blue-700 hover:bg-white/90"
            onClick={() => window.print()}
          >
            <FileText className="h-4 w-4" />
            Export Guide as PDF
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-white/30 bg-transparent text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            Download All Code
          </Button>
        </div>
      </div>

      <StepNavigation onBack={onBack} showNext={false} />
    </div>
  )
}
