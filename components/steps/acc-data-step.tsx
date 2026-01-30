"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StepNavigation } from "../step-navigation"
import { ACC_DATA_SCHEMAS, type Schema } from "../../lib/data"
import { cn } from "../../lib/utils"
import { Database, FileText, DollarSign, FolderOpen, Calendar } from "lucide-react"

interface AccDataStepProps {
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

const schemaIcons: Record<string, typeof Database> = {
  projects: Database,
  "issues-rfis": FileText,
  "cost-management": DollarSign,
  documents: FolderOpen,
  schedules: Calendar,
}

export function AccDataStep({ onNext, onPrevious, isFirst, isLast }: AccDataStepProps) {
  const [selectedSchema, setSelectedSchema] = useState<Schema>(ACC_DATA_SCHEMAS[0])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">ACC Data Schemas</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore the data schemas available from Autodesk Construction Cloud. Select a schema to view its tables and columns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {ACC_DATA_SCHEMAS.map((schema) => {
          const Icon = schemaIcons[schema.id] || Database
          const isSelected = selectedSchema.id === schema.id

          return (
            <button
              key={schema.id}
              onClick={() => setSelectedSchema(schema)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium text-center">{schema.name}</span>
            </button>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const Icon = schemaIcons[selectedSchema.id] || Database
              return <Icon className="w-5 h-5" />
            })()}
            {selectedSchema.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{selectedSchema.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {selectedSchema.tables.map((table) => (
              <div key={table.name} className="space-y-2">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  {table.name}
                </h4>
                <p className="text-sm text-muted-foreground">{table.description}</p>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {table.columns.map((column) => (
                    <div
                      key={column.name}
                      className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
                    >
                      <span className="font-mono text-foreground">{column.name}</span>
                      <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-background">
                        {column.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Key relationships between ACC data entities that you will model in your semantic layer:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              <span className="text-muted-foreground">Projects connect to all other entities via project_id</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              <span className="text-muted-foreground">Issues and RFIs can be linked to specific documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              <span className="text-muted-foreground">Cost items relate to schedule activities for earned value analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">-</span>
              <span className="text-muted-foreground">Documents have version history and approval workflows</span>
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
