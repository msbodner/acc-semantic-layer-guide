"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-[hsl(222,47%,11%)]", className)}>
      {language && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs font-medium text-white/60">{language}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 gap-1.5 px-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
      )}
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed text-[hsl(var(--code-foreground))]">
          {code}
        </code>
      </pre>
      {!language && (
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="absolute right-2 top-2 h-7 gap-1.5 px-2 text-white/60 hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      )}
    </div>
  )
}
