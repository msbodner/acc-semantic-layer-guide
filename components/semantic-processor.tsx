"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Search, X } from "lucide-react"
import type { ConvertedFile } from "@/app/page"
import { cn } from "@/lib/utils"

interface SemanticProcessorProps {
  files: ConvertedFile[]
  downloadedFiles: string[]
  onBack: () => void
}

interface ParsedElement {
  key: string
  value: string
  raw: string
}

function parseAioLine(line: string): ParsedElement[] {
  const elements: ParsedElement[] = []
  const regex = /\[([^\]]+)\]/g
  let match
  while ((match = regex.exec(line)) !== null) {
    const raw = match[0]
    const inner = match[1]
    const dotIndex = inner.indexOf(".")
    if (dotIndex !== -1) {
      elements.push({
        key: inner.substring(0, dotIndex),
        value: inner.substring(dotIndex + 1),
        raw,
      })
    }
  }
  return elements
}

export function SemanticProcessor({ files, downloadedFiles, onBack }: SemanticProcessorProps) {
  const [selectedAioIndex, setSelectedAioIndex] = useState<number | null>(null)
  const [selectedElement, setSelectedElement] = useState<ParsedElement | null>(null)

  // Build flat list of all AIO entries with their file info
  const allAios = useMemo(() => {
    const result: { fileName: string; aioLine: string; fileIndex: number; rowIndex: number }[] = []
    let counter = 0
    files.forEach((file, fileIndex) => {
      const baseName = file.originalName.replace(/\.csv$/i, "")
      file.aioLines.forEach((line, rowIndex) => {
        counter++
        const aioFileName = `${baseName}_${String(counter).padStart(4, "0")}.aio`
        result.push({
          fileName: aioFileName,
          aioLine: line,
          fileIndex,
          rowIndex,
        })
      })
    })
    return result
  }, [files])

  // Parse the selected AIO line into elements
  const selectedElements = useMemo(() => {
    if (selectedAioIndex === null) return []
    return parseAioLine(allAios[selectedAioIndex].aioLine)
  }, [selectedAioIndex, allAios])

  // Find all AIO files that contain a matching element
  const matchingAios = useMemo(() => {
    if (!selectedElement) return []
    return allAios
      .map((aio, index) => ({
        ...aio,
        index,
        elements: parseAioLine(aio.aioLine),
      }))
      .filter((aio) =>
        aio.elements.some(
          (el) => el.key === selectedElement.key && el.value === selectedElement.value
        )
      )
  }, [selectedElement, allAios])

  const handleElementClick = useCallback((element: ParsedElement) => {
    setSelectedElement(element)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Converter
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              Hyper-Semantic Logic Processor
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Process AIO Files via Hyper-Semantic Logic
          </h1>
          <p className="text-muted-foreground">
            Select an AIO file to inspect its elements. Click any element to find all matching AIO files in the set.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: AIO File List + Raw View */}
          <div className="space-y-6">
            {/* AIO File List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  AIO Files ({allAios.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-64 border border-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card border-b border-border">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">File Name</th>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">Source CSV</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAios.map((aio, index) => (
                        <tr
                          key={index}
                          className={cn(
                            "border-b border-border/50 cursor-pointer transition-colors",
                            selectedAioIndex === index
                              ? "bg-primary/10"
                              : "hover:bg-muted/50"
                          )}
                          onClick={() => {
                            setSelectedAioIndex(index)
                            setSelectedElement(null)
                          }}
                        >
                          <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                          <td className="px-3 py-2 text-foreground font-mono text-xs">{aio.fileName}</td>
                          <td className="px-3 py-2 text-muted-foreground text-xs">{files[aio.fileIndex].originalName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Raw AIO View */}
            {selectedAioIndex !== null && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    Raw AIO
                    <span className="text-sm font-normal text-muted-foreground">
                      - {allAios[selectedAioIndex].fileName}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    Click any element below to find all AIO files with a matching value.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-1.5">
                      {selectedElements.map((element, idx) => {
                        const isMetadata = ["OriginalCSV", "FileDate", "FileTime"].includes(element.key)
                        const isSelected = selectedElement?.raw === element.raw
                        return (
                          <button
                            key={idx}
                            onClick={() => handleElementClick(element)}
                            className={cn(
                              "inline-flex items-center px-2 py-1 rounded font-mono text-xs transition-colors cursor-pointer border",
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30"
                                : isMetadata
                                  ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/25"
                                  : "bg-secondary text-foreground border-border hover:bg-secondary/80"
                            )}
                          >
                            {element.raw}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Matching AIOs */}
          <div>
            {selectedElement ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Matching AIOs ({matchingAios.length})
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedElement(null)}
                      className="gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    All AIO files containing: <code className="bg-primary/15 text-primary px-1.5 py-0.5 rounded text-xs font-mono">{selectedElement.raw}</code>
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-[500px] border border-border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-card border-b border-border">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">#</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">File Name</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Source</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground">Row</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchingAios.map((aio, idx) => (
                          <tr
                            key={idx}
                            className={cn(
                              "border-b border-border/50 cursor-pointer transition-colors",
                              aio.index === selectedAioIndex
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                            )}
                            onClick={() => {
                              setSelectedAioIndex(aio.index)
                            }}
                          >
                            <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                            <td className="px-3 py-2 text-foreground font-mono text-xs">{aio.fileName}</td>
                            <td className="px-3 py-2 text-muted-foreground text-xs">{files[aio.fileIndex].originalName}</td>
                            <td className="px-3 py-2 text-muted-foreground text-xs">{aio.rowIndex + 1}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium mb-2">No element selected</p>
                  <p className="text-sm text-muted-foreground">
                    Select an AIO file from the list, then click any element in the raw view to find all matching files.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
