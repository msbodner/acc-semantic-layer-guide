"use client"

import { useState, useCallback } from "react"
import { FileUpload } from "@/components/file-upload"
import { ConversionPreview } from "@/components/conversion-preview"
import { UserGuide } from "@/components/user-guide"
import { ReferencePage } from "@/components/reference-page"
import { SemanticProcessor } from "@/components/semantic-processor"
import { Database, ArrowRight, Layers, Cpu, Globe, BookOpen, FileText, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ConvertedFile {
  originalName: string
  csvData: string[][]
  headers: string[]
  aioLines: string[]
  fileDate: string
  fileTime: string
}

function csvToAio(headers: string[], row: string[], originalFileName: string, fileDate: string, fileTime: string): string {
  const parts: string[] = []
  // Add metadata elements first
  parts.push(`[OriginalCSV.${originalFileName}]`)
  parts.push(`[FileDate.${fileDate}]`)
  parts.push(`[FileTime.${fileTime}]`)
  // Add data elements
  for (let i = 0; i < headers.length; i++) {
    const key = headers[i]
    let val = row[i] ?? ""
    val = val.replace(/\r\n/g, " ").replace(/\n/g, " ").replace(/\r/g, " ").replace(/\t/g, " ")
    parts.push(`[${key}.${val}]`)
  }
  return parts.join("")
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "")
  if (lines.length === 0) return { headers: [], rows: [] }

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
  const [currentView, setCurrentView] = useState<"home" | "converter" | "guide" | "reference" | "processor">("home")
  const [downloadedFileNames, setDownloadedFileNames] = useState<string[]>([])
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

        // Get file date and time from the file's lastModified timestamp
        const fileTimestamp = new Date(file.lastModified)
        const fileDate = fileTimestamp.toISOString().split("T")[0]
        const fileTime = fileTimestamp.toTimeString().split(" ")[0]

        const aioLines = rows.map((row) => csvToAio(headers, row, file.name, fileDate, fileTime))

        results.push({
          originalName: file.name,
          csvData: rows,
          headers,
          aioLines,
          fileDate,
          fileTime,
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

  if (currentView === "guide") {
    return <UserGuide onBack={() => setCurrentView("home")} />
  }

  if (currentView === "reference") {
    return <ReferencePage onBack={() => setCurrentView("home")} />
  }

  if (currentView === "processor") {
    return (
      <SemanticProcessor 
        files={convertedFiles} 
        downloadedFiles={downloadedFileNames} 
        onBack={() => setCurrentView("converter")} 
      />
    )
  }

  if (currentView === "home") {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Database className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg text-foreground">AIO Generator</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Cpu className="h-4 w-4" />
              Information Physics Standard Model
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              AIO Generator
            </h1>
            <p className="text-xl text-primary font-medium mb-4">
              by AWC Technology LLC
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Transform your CSV data into Associated Information Objects (AIOs) - the fundamental 
              unit of information in the new Information Physics Standard Model.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Application Agnostic
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AIOs are information objects not tied to any application or relational database schema, 
                enabling universal data interoperability.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Hyper-Semantic Model
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AIOs form the basis of a new hyper-semantic model that captures meaning and 
                relationships in a way traditional data formats cannot.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Next-Gen LLM Foundation
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                This hyper-semantic model will serve as the foundation upon which a new class of 
                Large Language Models will operate with enhanced understanding.
              </p>
            </div>
          </div>

          {/* Conversion Process */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              The Conversion Process
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-xl bg-secondary mb-3">
                  <code className="text-sm font-mono text-muted-foreground">CSV</code>
                </div>
                <p className="text-sm text-muted-foreground">Tabular Data</p>
              </div>
              <ArrowRight className="h-6 w-6 text-primary hidden md:block" />
              <div className="h-6 w-px bg-border md:hidden" />
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-xl bg-primary/10 mb-3">
                  <code className="text-sm font-mono text-primary">[Col.Val]</code>
                </div>
                <p className="text-sm text-muted-foreground">AIO Format</p>
              </div>
              <ArrowRight className="h-6 w-6 text-primary hidden md:block" />
              <div className="h-6 w-px bg-border md:hidden" />
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-xl bg-accent mb-3">
                  <code className="text-sm font-mono text-accent-foreground">.aio</code>
                </div>
                <p className="text-sm text-muted-foreground">Semantic Object</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
              Each row of your CSV is transformed into a single-line AIO prefixed with source metadata: <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">[OriginalCSV.filename][FileDate.YYYY-MM-DD][FileTime.HH:MM:SS][Column1.Value1][Column2.Value2]...</code>
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              onClick={() => setCurrentView("converter")}
              className="gap-2 px-8"
            >
              Start Converting
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("guide")}
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                User Guide
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView("reference")}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Information Physics Reference
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 bg-card/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <p className="text-sm text-muted-foreground text-center">
              AWC Technology LLC - Pioneering the Information Physics Standard Model
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => { setCurrentView("home"); handleClear(); }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">AIO Generator</h1>
                <p className="text-xs text-muted-foreground">by AWC Technology LLC</p>
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {convertedFiles.length === 0 ? (
          <FileUpload onFilesSelected={handleFilesSelected} isProcessing={isProcessing} />
        ) : (
          <ConversionPreview 
            files={convertedFiles} 
            onClear={handleClear} 
            onProcess={(downloaded) => {
              setDownloadedFileNames(downloaded)
              setCurrentView("processor")
            }}
          />
        )}
      </main>

      <footer className="border-t border-border py-4 bg-card/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-sm text-muted-foreground text-center">
            Each row becomes: [OriginalCSV.filename][FileDate.YYYY-MM-DD][FileTime.HH:MM:SS][Column1.Value1][Column2.Value2]...
          </p>
        </div>
      </footer>
    </div>
  )
}
