"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Database, Brain, BarChart3, Cloud } from "lucide-react"

interface OverviewStepProps {
  onNext: () => void
}

export function OverviewStep({ onNext }: OverviewStepProps) {
  const features = [
    {
      icon: Database,
      title: "ACC Data Integration",
      description: "Connect to Autodesk Construction Cloud data sources including projects, issues, RFIs, cost data, and schedules.",
    },
    {
      icon: Cloud,
      title: "Microsoft Fabric",
      description: "Leverage Microsoft Fabric's unified analytics platform for data engineering, warehousing, and real-time analytics.",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Use Azure OpenAI to enable natural language queries and intelligent analysis of your construction data.",
    },
    {
      icon: BarChart3,
      title: "Semantic Modeling",
      description: "Build semantic models that business users can understand and query without technical expertise.",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Build Your ACC Semantic Layer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A comprehensive guide to building a semantic layer for Autodesk Construction Cloud data using Microsoft Fabric and Azure OpenAI.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Architecture Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
              <Database className="w-10 h-10 text-primary mb-2" />
              <span className="font-medium">ACC Data</span>
              <span className="text-xs text-muted-foreground">Source</span>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
              <Cloud className="w-10 h-10 text-primary mb-2" />
              <span className="font-medium">Microsoft Fabric</span>
              <span className="text-xs text-muted-foreground">Platform</span>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
              <BarChart3 className="w-10 h-10 text-primary mb-2" />
              <span className="font-medium">Semantic Model</span>
              <span className="text-xs text-muted-foreground">Layer</span>
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background/50">
              <Brain className="w-10 h-10 text-primary mb-2" />
              <span className="font-medium">Azure OpenAI</span>
              <span className="text-xs text-muted-foreground">Intelligence</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What You Will Learn</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span className="text-muted-foreground">Understanding ACC data schemas and their relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span className="text-muted-foreground">Setting up Microsoft Fabric workspace and data pipelines</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span className="text-muted-foreground">Building semantic models with DAX measures and relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span className="text-muted-foreground">Integrating Azure OpenAI for natural language queries</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">5.</span>
              <span className="text-muted-foreground">Deploying and managing your semantic layer in production</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={onNext}>
          Get Started
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
