"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy, Check, ArrowLeft, FileText, Table } from "lucide-react"
import type { ConvertedFile } from "@/app/page"
import { cn } from "@/lib/utils"

interface ConversionPreviewProps {
  files: ConvertedFile[]
  onClear: () => void
}

export function ConversionPreview({ files, onClear }: ConversionPreviewProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [viewMode, setViewMode] = useState<"aio" | "table">("aio")
  const [copied, setCopied] = useState(false)

  const activeFile = files[activeFileIndex]

  const handleCopy = useCallback(async () => {
    const content = activeFile.aioLines.join("\n")
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [activeFile])

  const handleDownload = useCallback(() => {
    const content = activeFile.aioLines.join("\n") + "\n"
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeFile.originalName.replace(/\.csv$/i, ".aio")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [activeFile])

  const handleDownloadAll = useCallback(() => {
    files.forEach((file) => {
      const content = file.aioLines.join("\n") + "\n"
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.originalName.replace(/\.csv$/i, ".aio")
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }, [files])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClear} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Upload more files
        </Button>
        {files.length > 1 && (
          <Button onClick={handleDownloadAll} className="gap-2">
            <Download className="h-4 w-4" />
            Download All ({files.length} files)
          </Button>
        )}
      </div>

      {files.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <Button
              key={file.originalName}
              variant={index === activeFileIndex ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFileIndex(index)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {file.originalName}
            </Button>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {activeFile.originalName}
              <span className="text-sm font-normal text-muted-foreground">
                ({activeFile.aioLines.length} rows)
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-border p-1">
                <button
                  onClick={() => setViewMode("aio")}
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-colors",
                    viewMode === "aio"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  AIO
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "px-3 py-1 text-sm rounded-md transition-colors",
                    viewMode === "table"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Table className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button size="sm" onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Download .aio
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "aio" ? (
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap break-all">
                {activeFile.aioLines.slice(0, 100).join("\n")}
                {activeFile.aioLines.length > 100 && (
                  <span className="text-muted-foreground">
                    {"\n\n"}... and {activeFile.aioLines.length - 100} more lines
                  </span>
                )}
              </pre>
            </div>
          ) : (
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                    {activeFile.headers.map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 text-left font-medium text-muted-foreground"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeFile.csvData.slice(0, 50).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border/50">
                      <td className="px-3 py-2 text-muted-foreground">{rowIndex + 1}</td>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 text-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeFile.csvData.length > 50 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Showing 50 of {activeFile.csvData.length} rows
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sample AIO Output</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-3 overflow-x-auto">
            <code className="text-xs font-mono text-primary break-all">
              {activeFile.aioLines[0]}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
