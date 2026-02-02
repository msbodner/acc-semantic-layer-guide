"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Copy, Check, ArrowLeft, FileText, Package } from "lucide-react"
import type { ConvertedFile } from "@/app/page"
import { cn } from "@/lib/utils"

interface ConversionPreviewProps {
  files: ConvertedFile[]
  onClear: () => void
}

export function ConversionPreview({ files, onClear }: ConversionPreviewProps) {
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "success" | "error">("idle")
  const [downloadAllStatus, setDownloadAllStatus] = useState<"idle" | "success" | "error">("idle")
  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([])
  const [showDownloaded, setShowDownloaded] = useState(false)

  const activeFile = files[activeFileIndex]

  const handleCopyAio = useCallback(async () => {
    setError(null)
    try {
      const content = activeFile.aioLines[selectedRowIndex]
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to copy"
      setError(`Copy failed: ${message}`)
    }
  }, [activeFile, selectedRowIndex])

  const handleDownloadSelectedAio = useCallback(() => {
    setError(null)
    setDownloadStatus("idle")
    try {
      if (!activeFile || !activeFile.aioLines || !activeFile.aioLines[selectedRowIndex]) {
        throw new Error("No AIO content available for selected row")
      }
      const content = activeFile.aioLines[selectedRowIndex] + "\n"
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = activeFile.originalName.replace(/\.csv$/i, `-row${selectedRowIndex + 1}.aio`)
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
      setDownloadStatus("success")
      const fileName = activeFile.originalName.replace(/\.csv$/i, `-row${selectedRowIndex + 1}.aio`)
      setDownloadedFiles(prev => [...prev, fileName])
      setTimeout(() => setDownloadStatus("idle"), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(`Download failed: ${message}`)
      setDownloadStatus("error")
      setTimeout(() => setDownloadStatus("idle"), 5000)
    }
  }, [activeFile, selectedRowIndex])

  const handleDownloadAllAios = useCallback(() => {
    setError(null)
    setDownloadAllStatus("idle")
    try {
      if (!files || files.length === 0) {
        throw new Error("No files to download")
      }
      // Download each file as a separate .aio file
      files.forEach((file, index) => {
        setTimeout(() => {
          try {
            const content = file.aioLines.join("\n") + "\n"
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = file.originalName.replace(/\.csv$/i, ".aio")
            link.style.display = "none"
            document.body.appendChild(link)
            link.click()
            setTimeout(() => {
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }, 100)
            const aioFileName = file.originalName.replace(/\.csv$/i, ".aio")
            setDownloadedFiles(prev => [...prev, aioFileName])
          } catch (innerErr) {
            const message = innerErr instanceof Error ? innerErr.message : "Unknown error"
            setError(`Download failed for ${file.originalName}: ${message}`)
            setDownloadAllStatus("error")
          }
        }, index * 300) // Stagger downloads to avoid browser blocking
      })
      setDownloadAllStatus("success")
      setTimeout(() => setDownloadAllStatus("idle"), 3000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(`Download all failed: ${message}`)
      setDownloadAllStatus("error")
      setTimeout(() => setDownloadAllStatus("idle"), 5000)
    }
  }, [files])

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-4 underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onClear} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Upload more files
        </Button>
        {downloadedFiles.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDownloaded(!showDownloaded)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            View Downloaded ({downloadedFiles.length})
          </Button>
        )}
      </div>
      
      {showDownloaded && downloadedFiles.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="text-green-800">Downloaded Files (saved to your Downloads folder)</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDownloadedFiles([])}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Clear list
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="text-sm space-y-1">
              {downloadedFiles.map((fileName, idx) => (
                <li key={idx} className="flex items-center gap-2 text-green-700">
                  <Check className="h-3 w-3" />
                  {fileName}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

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
              <Button 
                onClick={handleDownloadAllAios} 
                className={cn(
                  "gap-2",
                  downloadAllStatus === "success" && "bg-green-600 hover:bg-green-700",
                  downloadAllStatus === "error" && "bg-red-600 hover:bg-red-700"
                )} 
                size="sm"
              >
                <Package className="h-4 w-4" />
                {downloadAllStatus === "success" ? "Downloaded!" : downloadAllStatus === "error" ? "Failed!" : "Download All AIOs"}
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
                <Button 
                  size="sm" 
                  onClick={handleDownloadSelectedAio} 
                  className={cn(
                    "gap-2",
                    downloadStatus === "success" && "bg-green-600 hover:bg-green-700",
                    downloadStatus === "error" && "bg-red-600 hover:bg-red-700"
                  )}
                >
                  <Download className="h-4 w-4" />
                  {downloadStatus === "success" ? "Downloaded!" : downloadStatus === "error" ? "Failed!" : "Download .aio"}
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
