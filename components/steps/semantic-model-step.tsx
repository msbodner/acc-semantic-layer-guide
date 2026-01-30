"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { FABRIC_TEMPLATES, generateDaxCode, generateTmdl } from "../../lib/data"
import { cn } from "../../lib/utils"

interface SemanticModelStepProps {
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

export function SemanticModelStep({ onNext, onPrevious, isFirst, isLast }: SemanticModelStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(FABRIC_TEMPLATES[0])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Build Semantic Model</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create DAX measures and define your semantic model structure for ACC data analysis.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Model Template</CardTitle>
          <p className="text-sm text-muted-foreground">Choose a template based on your analysis needs</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {FABRIC_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={cn(
                  "p-4 rounded-lg border text-left transition-all",
                  selectedTemplate.id === template.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <h4 className="font-medium text-foreground">{template.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dax" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dax">DAX Measures</TabsTrigger>
          <TabsTrigger value="tmdl">TMDL Definition</TabsTrigger>
        </TabsList>

        <TabsContent value="dax">
          <Card>
            <CardHeader>
              <CardTitle>DAX Measures for {selectedTemplate.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Copy these measures into your Power BI semantic model
              </p>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={generateDaxCode(selectedTemplate.id)}
                language="dax"
                title="DAX Measures"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tmdl">
          <Card>
            <CardHeader>
              <CardTitle>TMDL Model Definition</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use TMDL for source control and CI/CD deployment
              </p>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={generateTmdl(selectedTemplate.id)}
                language="yaml"
                title="model.tmdl"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span className="text-muted-foreground">Use calculation groups for time intelligence to reduce measure count</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span className="text-muted-foreground">Create a date dimension table with fiscal calendar support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span className="text-muted-foreground">Implement incremental refresh for large fact tables</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span className="text-muted-foreground">Use TMDL for version control and automated deployments</span>
            </li>
          </ul>
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
