"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  isProcessing: boolean
}

export function FileUpload({ onFilesSelected, isProcessing }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "text/csv" || file.name.endsWith(".csv")
      )

      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [onFilesSelected]
  )

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label
        htmlFor="file-upload"
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-card/80",
          isProcessing && "pointer-events-none opacity-60"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 text-primary mb-4 animate-spin" />
              <p className="text-lg font-medium text-foreground">Processing files...</p>
            </>
          ) : (
            <>
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                Drop CSV files here
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Supports .csv files</span>
              </div>
            </>
          )}
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".csv,text/csv"
          multiple
          onChange={handleFileInput}
          disabled={isProcessing}
        />
      </label>

      <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
        <h3 className="text-sm font-medium text-foreground mb-2">How it works</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>1. Upload one or more CSV files</li>
          <li>2. Each row is converted to a single AIO line</li>
          <li>3. Format: [Column1.Value1][Column2.Value2]...</li>
          <li>4. Download the .aio file or copy to clipboard</li>
        </ul>
      </div>
    </div>
  )
}
