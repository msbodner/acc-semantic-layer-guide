"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy, Check, ArrowLeft, FileText, Package } from "lucide-react"
import type { ConvertedFile } from "@/app/page"
import { cn } from "@/lib/utils"
import JSZip from "jszip"

interface ConversionPreviewProps {
  files: ConvertedFile[]
  onClear: () => void
}

export function ConversionPreview({ files, onClear }: ConversionPreviewProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const activeFile = files[activeFileIndex]

  const handleCopyAio = useCallback(async () => {
    const content = activeFile.aioLines[selectedRowIndex]
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [activeFile, selectedRowIndex])

  const handleDownloadSelectedAio = useCallback(() => {
    const content = activeFile.aioLines[selectedRowIndex] + "\n"
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = activeFile.originalName.replace(/\.csv$/i, `-row${selectedRowIndex + 1}.aio`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [activeFile, selectedRowIndex])

  const handleDownloadAllZip = useCallback(async () => {
    const zip = new JSZip()
    
    files.forEach((file) => {
      const content = file.aioLines.join("\n") + "\n"
      const filename = file.originalName.replace(/\.csv$/i, ".aio")
      zip.file(filename, content)
    })
    
    const blob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "aio-files.zip"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [files])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClear} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Upload more files
        </Button>
      </div>

      {files.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <Button
              key={file.originalName}
              variant={index === activeFileIndex ? "default" : "outline"}
              size="sm"
              onClick={() => { setActiveFileIndex(index); setSelectedRowIndex(0); }}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {file.originalName}
            </Button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* CSV Grid View */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                CSV Data
                <span className="text-sm font-normal text-muted-foreground">
                  ({activeFile.csvData.length} rows)
                </span>
              </CardTitle>
              <Button onClick={handleDownloadAllZip} className="gap-2" size="sm">
                <Package className="h-4 w-4" />
                Download All AIOs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-96 border border-border rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card border-b border-border">
                  <tr>
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
                  {activeFile.csvData.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className={cn(
                        "border-b border-border/50 cursor-pointer transition-colors",
                        rowIndex === selectedRowIndex 
                          ? "bg-primary/10" 
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedRowIndex(rowIndex)}
                    >
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
            </div>
          </CardContent>
        </Card>

        {/* AIO Output View */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                AIO Output
                <span className="text-sm font-normal text-muted-foreground">
                  (Row {selectedRowIndex + 1})
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAio} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" onClick={handleDownloadSelectedAio} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download .aio
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 min-h-[200px]">
              <pre className="text-sm font-mono text-primary whitespace-pre-wrap break-all">
                {activeFile.aioLines[selectedRowIndex]}
              </pre>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">AIO Format Breakdown:</p>
              <div className="flex flex-wrap gap-2">
                {activeFile.headers.map((header, idx) => (
                  <span 
                    key={header} 
                    className="inline-flex items-center px-2 py-1 rounded bg-secondary text-xs font-mono"
                  >
                    [{header}.{activeFile.csvData[selectedRowIndex]?.[idx] ?? ""}]
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
