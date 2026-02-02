"use client"

import { useState } from "react"
import { Table, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataPreviewProps {
  data: Record<string, unknown>[]
}

export function DataPreview({ data }: DataPreviewProps) {
  const [viewMode, setViewMode] = useState<"table" | "json">("table")

  if (data.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center text-muted-foreground">
          Add fields to generate data
        </CardContent>
      </Card>
    )
  }

  const headers = Object.keys(data[0])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Preview</CardTitle>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-background border border-border">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2.5 gap-1.5",
                viewMode === "table" && "bg-muted"
              )}
              onClick={() => setViewMode("table")}
            >
              <Table className="w-3.5 h-3.5" />
              Table
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2.5 gap-1.5",
                viewMode === "json" && "bg-muted"
              )}
              onClick={() => setViewMode("json")}
            >
              <Code className="w-3.5 h-3.5" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "table" ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    {headers.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap border-b border-border"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      {headers.map((header) => (
                        <td
                          key={header}
                          className="px-4 py-2.5 whitespace-nowrap text-foreground max-w-48 truncate"
                          title={String(row[header])}
                        >
                          {String(row[header])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-background border border-border overflow-hidden">
            <pre className="p-4 text-xs overflow-auto max-h-96 text-foreground">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {data.length} row{data.length !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  )
}
