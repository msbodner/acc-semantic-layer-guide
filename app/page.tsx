"use client"

import { useState, useCallback } from "react"
import { FileUpload } from "@/components/file-upload"
import { ConversionPreview } from "@/components/conversion-preview"
import { Database } from "lucide-react"

export interface ConvertedFile {
  originalName: string
  csvData: string[][]
  headers: string[]
  aioLines: string[]
}

function csvToAio(headers: string[], row: string[]): string {
  const parts: string[] = []
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i]
    let val = row[i] ?? ""
    // Remove line breaks/tabs so the AIO fits on one line
    val = val.replace(/\r\n/g, " ").replace(/\n/g, " ").replace(/\r/g, " ").replace(/\t/g, " ")
    parts.push(`[${key}.${val}]`)
  }
  return parts.join("")
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "")
  if (lines.length === 0) return { headers: [], rows: [] }

  // Simple CSV parsing (handles basic cases, not full RFC 4180)
  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }
    result.push(current)
    return result
  }

  const headers = parseLine(lines[0])
  const rows = lines.slice(1).map(parseLine)

  return { headers, rows }
}

export default function HomePage() {
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setIsProcessing(true)
    const results: ConvertedFile[] = []

    for (const file of files) {
      try {
        const text = await file.text()
        const { headers, rows } = parseCSV(text)

        if (headers.length === 0) continue

        const aioLines = rows.map((row) => csvToAio(headers, row))

        results.push({
          originalName: file.name,
          csvData: rows,
          headers,
          aioLines,
        })
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
      }
    }

    setConvertedFiles(results)
    setIsProcessing(false)
  }, [])

  const handleClear = useCallback(() => {
    setConvertedFiles([])
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AIO Generator</h1>
              <p className="text-sm text-muted-foreground">
                Convert CSV files to Associated Information Object format
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {convertedFiles.length === 0 ? (
          <FileUpload onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
        ) : (
          <ConversionPreview files={convertedFiles} onClear={handleClear} />
        )}
      </main>

      <footer className="border-t border-border py-4">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-sm text-muted-foreground text-center">
            Each row becomes: [Column1.Value1][Column2.Value2]...
          </p>
        </div>
      </footer>
    </div>
  )
}
