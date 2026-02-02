"use client"

import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type SchemaConfig, type FieldConfig, type DataType, DATA_TYPE_INFO } from "@/lib/data-types"

interface SchemaBuilderProps {
  schema: SchemaConfig
  onAddField: () => void
  onRemoveField: (id: string) => void
  onUpdateField: (id: string, updates: Partial<FieldConfig>) => void
  onRowCountChange: (count: number) => void
  onTableNameChange: (name: string) => void
}

const dataTypeOptions = Object.entries(DATA_TYPE_INFO).map(([value, info]) => ({
  value: value as DataType,
  label: info.label,
  category: info.category,
}))

const groupedTypes = dataTypeOptions.reduce((acc, type) => {
  if (!acc[type.category]) acc[type.category] = []
  acc[type.category].push(type)
  return acc
}, {} as Record<string, typeof dataTypeOptions>)

export function SchemaBuilder({
  schema,
  onAddField,
  onRemoveField,
  onUpdateField,
  onRowCountChange,
  onTableNameChange,
}: SchemaBuilderProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">Schema Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tableName" className="text-sm text-muted-foreground">
              Table Name
            </Label>
            <Input
              id="tableName"
              value={schema.name}
              onChange={(e) => onTableNameChange(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rowCount" className="text-sm text-muted-foreground">
              Row Count
            </Label>
            <Input
              id="rowCount"
              type="number"
              min={1}
              max={1000}
              value={schema.rowCount}
              onChange={(e) => onRowCountChange(parseInt(e.target.value) || 1)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Fields</Label>
            <Button onClick={onAddField} variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
              <Plus className="w-4 h-4" />
              Add Field
            </Button>
          </div>

          <div className="space-y-2">
            {schema.fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-background border border-border group"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                <Input
                  value={field.name}
                  onChange={(e) => onUpdateField(field.id, { name: e.target.value })}
                  className="flex-1 h-9 bg-transparent border-border"
                  placeholder="Field name"
                />
                <Select
                  value={field.type}
                  onValueChange={(value: DataType) => onUpdateField(field.id, { type: value })}
                >
                  <SelectTrigger className="w-40 h-9 bg-transparent border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-64">
                    {Object.entries(groupedTypes).map(([category, types]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {category}
                        </div>
                        {types.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveField(field.id)}
                  disabled={schema.fields.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
