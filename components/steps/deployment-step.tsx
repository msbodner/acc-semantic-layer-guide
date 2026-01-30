"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { StepNavigation } from "@/components/step-navigation"
import { CodeBlock } from "@/components/code-block"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Download, FileText, Rocket } from "lucide-react"

interface DeploymentStepProps {
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

export function DeploymentStep({ onPrevious, isFirst, isLast }: DeploymentStepProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})

  const deploymentChecklist = [
    { id: "fabric-workspace", label: "Fabric workspace created and configured" },
    { id: "lakehouse", label: "Lakehouse set up with ACC data tables" },
    { id: "semantic-model", label: "Semantic model published with all measures" },
    { id: "azure-openai", label: "Azure OpenAI resource deployed" },
    { id: "security", label: "Row-level security configured" },
    { id: "monitoring", label: "Monitoring and alerting set up" },
    { id: "documentation", label: "User documentation completed" },
    { id: "training", label: "End-user training scheduled" },
  ]

  const cicdPipeline = `# Azure DevOps Pipeline for Semantic Model Deployment
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - semantic-model/**

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Build
    jobs:
      - job: ValidateModel
        steps:
          - task: UseDotNet@2
            inputs:
              version: '6.x'
          - script: |
              dotnet tool install -g Microsoft.PowerBI.Cli
              pbi model validate ./semantic-model
            displayName: 'Validate TMDL'

  - stage: Deploy
    dependsOn: Build
    jobs:
      - deployment: DeployToFabric
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - script: |
                    pbi model deploy \\
                      --workspace "\$(FABRIC_WORKSPACE)" \\
                      --model "./semantic-model"
                  displayName: 'Deploy Semantic Model'`

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const completedCount = Object.values(checklist).filter(Boolean).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Deployment</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Complete your semantic layer deployment with this final checklist and CI/CD configuration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Deployment Checklist
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {completedCount} of {deploymentChecklist.length} completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deploymentChecklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox
                  checked={checklist[item.id] || false}
                  onCheckedChange={() => toggleCheck(item.id)}
                />
                <span className={checklist[item.id] ? "text-muted-foreground line-through" : "text-foreground"}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            CI/CD Pipeline
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Automate your semantic model deployments with Azure DevOps
          </p>
        </CardHeader>
        <CardContent>
          <CodeBlock code={cicdPipeline} language="yaml" title="azure-pipelines.yml" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { title: "Version Control", desc: "Use TMDL format for semantic model source control" },
              { title: "Environment Separation", desc: "Maintain dev, test, and prod workspaces" },
              { title: "Incremental Refresh", desc: "Configure for large datasets to reduce refresh time" },
              { title: "Monitoring", desc: "Set up alerts for refresh failures and performance issues" },
            ].map((practice) => (
              <div key={practice.title} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium text-foreground">{practice.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{practice.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-green-600">Congratulations!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You have completed the ACC Semantic Layer Guide. Your semantic layer is now ready to provide intelligent insights from your construction data.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download Code
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <StepNavigation
        onPrevious={onPrevious}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  )
}
