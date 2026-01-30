"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { EXAMPLE_PROMPTS } from "../../lib/data"
import { MessageSquare, Lightbulb } from "lucide-react"

interface NLQueriesStepProps {
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

export function NLQueriesStep({ onNext, onPrevious, isFirst, isLast }: NLQueriesStepProps) {
  const promptEngineeringCode = `// System prompt for construction data queries
const systemPrompt = \`You are an AI assistant helping analyze construction project data.
You have access to the following data domains:
- Projects: Project metadata, status, and team members
- Issues/RFIs: Quality issues, RFIs, and their resolution status
- Cost Management: Budget items, change orders, and cost tracking
- Documents: File metadata, versions, and approval status
- Schedules: Activities, milestones, and dependencies

When generating DAX queries:
1. Always filter by project_id when relevant
2. Use CALCULATE for context modification
3. Return results suitable for visualization
4. Consider time intelligence for trend analysis

Format your response as:
- Natural language explanation
- DAX query (if applicable)
- Suggested visualization type\`;`

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Natural Language Queries</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Enable business users to query ACC data using natural language through your AI-powered semantic layer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Example Queries
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sample natural language queries your semantic layer can handle
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {EXAMPLE_PROMPTS.map((example) => (
              <div key={example.category} className="space-y-3 p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-foreground">{example.category}</h4>
                <ul className="space-y-2">
                  {example.prompts.map((prompt) => (
                    <li key={prompt} className="text-sm text-muted-foreground flex items-start gap-2">
                      <MessageSquare className="w-3 h-3 mt-1 text-primary shrink-0" />
                      {prompt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Prompt Engineering
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure your system prompt for optimal query understanding
          </p>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={promptEngineeringCode}
            language="typescript"
            title="System Prompt Configuration"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Query Processing Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { step: 1, label: "Natural Language Input", desc: "User asks a question" },
              { step: 2, label: "Intent Classification", desc: "AI determines query type" },
              { step: 3, label: "DAX Generation", desc: "Generate semantic model query" },
              { step: 4, label: "Query Execution", desc: "Run against Fabric" },
              { step: 5, label: "Response Formatting", desc: "Present insights to user" },
            ].map((item, index, arr) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                    {item.step}
                  </div>
                  <span className="text-sm font-medium mt-2 text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
                {index < arr.length - 1 && (
                  <div className="hidden md:block w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <StepNavigation
        onNext={onNext}
        onPrevious={onPrevious}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  )
}
