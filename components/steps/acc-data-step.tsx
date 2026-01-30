"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StepNavigation } from "../step-navigation"
import { ACC_DATA_SCHEMAS, type Schema } from "../../lib/data"
import { cn } from "../../lib/utils"
import { Database, FileText, DollarSign, FolderOpen, Calendar } from "lucide-react"

interface AccDataStepProps {
  onBack: () => void
  onNext: () => void
  selectedSchemas: string[]
  onSchemasChange: (schemas: string[]) => void
}

const schemaIcons: Record<string, React.ElementType> = {
  projects: Database,
  issues: FileText,
  cost: DollarSign,
  documents: FolderOpen,
  schedule: Calendar,
}

export function AccDataStep({
  onBack,
  onNext,
  selectedSchemas,
  onSchemasChange,
}: AccDataStepProps) {
  const [activeSchema, setActiveSchema] = useState<string | null>(
    selectedSchemas[0] || null
  )

  const toggleSchema = (key: string) => {
    const newSelected = selectedSchemas.includes(key)
      ? selectedSchemas.filter((s) => s !== key)
      : [...selectedSchemas, key]
    onSchemasChange(newSelected)
    setActiveSchema(key)
  }

  const activeSchemaData = activeSchema ? ACC_DATA_SCHEMAS[activeSchema] : null

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">ACC Data Schemas</h2>
      <p className="mt-2 text-muted-foreground">
        Select the ACC modules you want to include in your semantic layer. Each module includes
        pre-defined tables, columns, and suggested measures.
      </p>

      {/* Schema Selector */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(ACC_DATA_SCHEMAS).map(([key, schema]) => {
          const Icon = schemaIcons[key] || Database
          const isSelected = selectedSchemas.includes(key)

          return (
            <button
              key={key}
              onClick={() => toggleSchema(key)}
              className={cn(
                "flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold">{schema.name}</h4>
                <p className="mt-0.5 text-sm text-muted-foreground">{schema.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Schema Details */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            {activeSchemaData ? activeSchemaData.name : "Select a schema to view details"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSchemaData ? (
            <SchemaDetails schema={activeSchemaData} />
          ) : (
            <p className="text-muted-foreground">
              Click on any schema above to explore its tables and columns.
            </p>
          )}
        </CardContent>
      </Card>

      <StepNavigation onBack={onBack} onNext={onNext} />
    </div>
  )
}

function SchemaDetails({ schema }: { schema: Schema }) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">{schema.description}</p>

      {schema.tables.map((table) => (
        <div key={table.name} className="border-t pt-4">
          <h4 className="font-semibold text-primary">{table.name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{table.description}</p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {table.columns.map((col) => (
              <div
                key={col.name}
                className="flex items-center gap-2 rounded-md bg-muted/50 p-2"
              >
                <code className="rounded bg-[hsl(var(--sidebar-bg))] px-2 py-0.5 text-xs text-sky-400">
                  {col.name}
                </code>
                <span className="text-xs text-muted-foreground">{col.description}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {schema.semantic_model.measures.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-primary">Suggested Measures</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {schema.semantic_model.measures.map((measure) => (
              <div
                key={measure.name}
                className="flex items-center gap-2 rounded-md bg-muted/50 p-2"
              >
                <code className="rounded bg-[hsl(var(--sidebar-bg))] px-2 py-0.5 text-xs text-sky-400">
                  {measure.name}
                </code>
                <span className="text-xs text-muted-foreground">{measure.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
