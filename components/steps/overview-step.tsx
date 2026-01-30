"use client"

// Overview step component
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowRight, Layers, MessageSquare, Target, Users } from "lucide-react"

interface OverviewStepProps {
  onNext: () => void
}

const architectureLayers = [
  {
    id: "source",
    title: "Data Source",
    component: "Autodesk Construction Cloud",
    subComponents: ["Projects", "Issues", "Cost", "Docs"],
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "ingestion",
    title: "Data Ingestion",
    component: "Microsoft Fabric Lakehouse",
    subComponents: ["Delta Tables", "Dataflows"],
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: "semantic",
    title: "Semantic Layer",
    component: "Fabric Semantic Model",
    subComponents: ["Dimensions", "Facts", "Measures"],
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "ai",
    title: "AI Layer",
    component: "Azure OpenAI",
    subComponents: ["GPT-4", "Embeddings"],
    gradient: "from-violet-600 to-purple-800",
  },
  {
    id: "consumption",
    title: "Consumption",
    component: "End Users",
    subComponents: ["Power BI", "NL Queries", "APIs"],
    gradient: "from-emerald-500 to-green-700",
  },
]

const benefits = [
  {
    icon: Layers,
    title: "Business-Friendly",
    description: 'Transform technical ACC data into metrics like "Budget Variance" and "Issue Resolution Time"',
    color: "border-l-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Natural Language",
    description: 'Ask questions like "What projects are over budget?" and get instant answers',
    color: "border-l-sky-500",
  },
  {
    icon: Target,
    title: "Single Source of Truth",
    description: "Consistent definitions across all reports and applications",
    color: "border-l-orange-500",
  },
  {
    icon: Users,
    title: "Self-Service",
    description: "Enable business users to explore data without SQL knowledge",
    color: "border-l-emerald-500",
  },
]

export function OverviewStep({ onNext }: OverviewStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Building a Semantic Layer for ACC Data
      </h2>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>What You Will Build</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            A complete semantic layer that transforms your Autodesk Construction Cloud (ACC) data
            into business-friendly metrics and enables natural language querying through Azure
            OpenAI.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Architecture Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            {architectureLayers.map((layer, index) => (
              <div key={layer.id} className="w-full max-w-md">
                <div
                  className={`rounded-lg bg-gradient-to-r ${layer.gradient} p-4 text-center text-white`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                    {layer.title}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{layer.component}</p>
                  <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    {layer.subComponents.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
                {index < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <svg
                      className="h-6 w-6 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className={`border-l-4 ${benefit.color}`}>
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <benefit.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={onNext} className="mt-8 gap-2" size="lg">
        Get Started
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
