"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({
  code,
  language = "typescript",
  title,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-card">
        <code className={`language-${language} text-sm text-code-foreground`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
