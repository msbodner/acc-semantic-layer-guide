"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { FABRIC_TEMPLATES, generateDaxCode, generateTmdl } from "../../lib/data"
import { cn } from "../../lib/utils"

interface SemanticModelStepProps {
  onBack: () => void
  onNext: () => void
  selectedSchemas: string[]
  selectedTemplate: string
  onTemplateChange: (template: string) => void
}

const relationships = [
  { from: "dim_project[project_id]", to: "fact_issues[project_id]", type: "1:*" },
  { from: "dim_project[project_id]", to: "fact_rfis[project_id]", type: "1:*" },
  { from: "dim_project[project_id]", to: "dim_budget[project_id]", type: "1:*" },
  { from: "dim_project[project_id]", to: "fact_contracts[project_id]", type: "1:*" },
  { from: "fact_contracts[contract_id]", to: "fact_change_orders[contract_id]", type: "1:*" },
  { from: "dim_project[project_id]", to: "fact_documents[project_id]", type: "1:*" },
  { from: "dim_folders[folder_id]", to: "fact_documents[folder_id]", type: "1:*" },
]

export function SemanticModelStep({
  onBack,
  onNext,
  selectedSchemas,
  selectedTemplate,
  onTemplateChange,
}: SemanticModelStepProps) {
  const [activeTab, setActiveTab] = useState("measures")

  const daxCode = selectedSchemas.length > 0 
    ? generateDaxCode(selectedSchemas) 
    : `// Select schemas in Step 2 to generate DAX measures

// Example measures:
Project Count = COUNTROWS(dim_project)

Active Projects =
CALCULATE(
    COUNTROWS(dim_project),
    dim_project[status] = "Active"
)

Total Issues = COUNTROWS(fact_issues)

Open Issues =
CALCULATE(
    COUNTROWS(fact_issues),
    fact_issues[status] <> "Closed"
)`

  const tmdlCode = selectedSchemas.length > 0 
    ? generateTmdl(selectedSchemas)
    : `// TMDL (Tabular Model Definition Language)
model ACC_Semantic_Model
    culture: en-US
    defaultPowerBIDataSourceVersion: powerBI_V3

    table dim_project
        description: Project dimension table
        column project_id
            dataType: string
            isKey: true`

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">Build Semantic Model</h2>
      <p className="mt-2 text-muted-foreground">
        Create a Power BI / Fabric semantic model with business-friendly metrics and relationships.
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold">Choose a Template</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(FABRIC_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => onTemplateChange(key)}
              className={cn(
                "rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                selectedTemplate === key
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <h4 className="font-semibold">{template.name}</h4>
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold",
                  template.complexity === "Low" && "bg-emerald-100 text-emerald-800",
                  template.complexity === "Medium" && "bg-amber-100 text-amber-800",
                  template.complexity === "High" && "bg-red-100 text-red-800"
                )}
              >
                {template.complexity}
              </span>
              <p className="mt-2 text-sm text-muted-foreground">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Generated Model Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="measures">Measures (DAX)</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="tmdl">TMDL Export</TabsTrigger>
            </TabsList>

            <TabsContent value="measures" className="mt-4">
              <CodeBlock code={daxCode} language="DAX" />
            </TabsContent>

            <TabsContent value="relationships" className="mt-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <h4 className="font-semibold">Star Schema Relationships</h4>
                <div className="mt-4 space-y-3">
                  {relationships.map((rel, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center gap-3 rounded-md bg-background p-3"
                    >
                      <code className="rounded bg-[hsl(var(--sidebar-bg))] px-2 py-1 text-xs text-sky-400">
                        {rel.from}
                      </code>
                      <span className="font-semibold text-orange-500">{rel.type}</span>
                      <code className="rounded bg-[hsl(var(--sidebar-bg))] px-2 py-1 text-xs text-sky-400">
                        {rel.to}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tmdl" className="mt-4">
              <CodeBlock code={tmdlCode} language="TMDL" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <StepNavigation onBack={onBack} onNext={onNext} />
    </div>
  )
}
