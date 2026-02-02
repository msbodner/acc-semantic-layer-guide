"use client"

import { useState } from "react"
import { Download, Copy, Check, FileJson, FileSpreadsheet, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { exportToJSON, exportToCSV, exportToSQL, type ExportFormat } from "@/lib/data-types"
import { cn } from "@/lib/utils"

interface ExportPanelProps {
  data: Record<string, unknown>[]
  tableName: string
}

const exportOptions: { format: ExportFormat; label: string; icon: React.ElementType }[] = [
  { format: "json", label: "JSON", icon: FileJson },
  { format: "csv", label: "CSV", icon: FileSpreadsheet },
  { format: "sql", label: "SQL", icon: Database },
]

export function ExportPanel({ data, tableName }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>("json")
  const [copied, setCopied] = useState(false)

  const getExportedData = () => {
    switch (activeFormat) {
      case "json":
        return exportToJSON(data)
      case "csv":
        return exportToCSV(data)
      case "sql":
        return exportToSQL(data, tableName)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getExportedData())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = getExportedData()
    const mimeTypes = {
      json: "application/json",
      csv: "text/csv",
      sql: "application/sql",
    }
    const blob = new Blob([content], { type: mimeTypes[activeFormat] })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tableName}.${activeFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Export</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleDownload}
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {exportOptions.map((option) => (
            <Button
              key={option.format}
              variant="outline"
              size="sm"
              className={cn(
                "gap-1.5 flex-1",
                activeFormat === option.format && "bg-primary/10 border-primary text-primary"
              )}
              onClick={() => setActiveFormat(option.format)}
            >
              <option.icon className="w-3.5 h-3.5" />
              {option.label}
            </Button>
          ))}
        </div>
        <div className="rounded-lg bg-background border border-border overflow-hidden">
          <pre className="p-4 text-xs overflow-auto max-h-48 text-muted-foreground">
            <code>{getExportedData().slice(0, 1500)}{getExportedData().length > 1500 ? "\n..." : ""}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}
