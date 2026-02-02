"use client"

import { useState, useMemo, useCallback } from "react"
import { Header } from "@/components/header"
import { SchemaBuilder } from "@/components/schema-builder"
import { DataPreview } from "@/components/data-preview"
import { ExportPanel } from "@/components/export-panel"
import { generateData, type SchemaConfig, type FieldConfig } from "@/lib/data-types"

export default function HomePage() {
  const [schema, setSchema] = useState<SchemaConfig>({
    name: "users",
    fields: [
      { id: "1", name: "id", type: "uuid" },
      { id: "2", name: "name", type: "fullName" },
      { id: "3", name: "email", type: "email" },
      { id: "4", name: "created_at", type: "datetime" },
    ],
    rowCount: 10,
  })

  const [refreshKey, setRefreshKey] = useState(0)

  const generatedData = useMemo(() => generateData(schema), [schema, refreshKey])

  const handleAddField = useCallback(() => {
    const newField: FieldConfig = {
      id: Date.now().toString(),
      name: `field_${schema.fields.length + 1}`,
      type: "word",
    }
    setSchema((prev) => ({ ...prev, fields: [...prev.fields, newField] }))
  }, [schema.fields.length])

  const handleRemoveField = useCallback((id: string) => {
    setSchema((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== id),
    }))
  }, [])

  const handleUpdateField = useCallback((id: string, updates: Partial<FieldConfig>) => {
    setSchema((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }))
  }, [])

  const handleRowCountChange = useCallback((count: number) => {
    setSchema((prev) => ({ ...prev, rowCount: Math.max(1, Math.min(1000, count)) }))
  }, [])

  const handleTableNameChange = useCallback((name: string) => {
    setSchema((prev) => ({ ...prev, name }))
  }, [])

  const handleRegenerate = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onRegenerate={handleRegenerate} />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SchemaBuilder
              schema={schema}
              onAddField={handleAddField}
              onRemoveField={handleRemoveField}
              onUpdateField={handleUpdateField}
              onRowCountChange={handleRowCountChange}
              onTableNameChange={handleTableNameChange}
            />
          </div>
          <div className="space-y-6">
            <DataPreview data={generatedData} />
            <ExportPanel data={generatedData} tableName={schema.name} />
          </div>
        </div>
      </main>
    </div>
  )
}
