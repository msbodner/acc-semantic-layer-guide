"use client"

import { Database, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onRegenerate: () => void
}

export function Header({ onRegenerate }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AIO Generator</h1>
              <p className="text-xs text-muted-foreground">Mock Data Generator</p>
            </div>
          </div>
          <Button onClick={onRegenerate} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </Button>
        </div>
      </div>
    </header>
  )
}
