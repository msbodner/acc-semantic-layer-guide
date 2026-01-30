"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepNavigation } from "@/components/step-navigation"
import { CodeBlock } from "@/components/code-block"
import { Cloud, Database, Workflow, Shield } from "lucide-react"

interface FabricSetupStepProps {
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
}

export function FabricSetupStep({ onNext, onPrevious, isFirst, isLast }: FabricSetupStepProps) {
  const setupSteps = [
    {
      icon: Cloud,
      title: "Create Fabric Workspace",
      description: "Set up a dedicated workspace for your ACC semantic layer project.",
      code: `// Navigate to Microsoft Fabric portal
// 1. Go to app.fabric.microsoft.com
// 2. Click "Workspaces" in the left navigation
// 3. Select "New workspace"
// 4. Name it "ACC-Semantic-Layer"
// 5. Choose Premium capacity`,
    },
    {
      icon: Database,
      title: "Create Lakehouse",
      description: "Set up a Lakehouse to store your ACC data in Delta format.",
      code: `// In your workspace:
// 1. Click "New" > "Lakehouse"
// 2. Name it "acc_lakehouse"
// 3. This creates:
//    - Files section for raw data
//    - Tables section for Delta tables
//    - SQL endpoint for querying`,
    },
    {
      icon: Workflow,
      title: "Configure Data Pipeline",
      description: "Create a pipeline to ingest data from ACC APIs.",
      code: `// Create a new Data Pipeline
// 1. Click "New" > "Data Pipeline"
// 2. Add a "Copy Data" activity
// 3. Configure source as REST API:
{
  "source": {
    "type": "RestSource",
    "httpRequestTimeout": "00:01:40",
    "requestMethod": "GET",
    "additionalHeaders": {
      "Authorization": "Bearer {access_token}"
    }
  },
  "sink": {
    "type": "LakehouseSink",
    "tableActionOption": "Append"
  }
}`,
    },
    {
      icon: Shield,
      title: "Set Up Security",
      description: "Configure authentication and access control.",
      code: `// Configure Azure AD authentication
// 1. Register an app in Azure AD
// 2. Grant ACC API permissions
// 3. Create a Key Vault for secrets
// 4. Configure managed identity

// In Fabric workspace settings:
// - Set workspace access roles
// - Configure row-level security
// - Enable audit logging`,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Microsoft Fabric Setup</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Configure your Microsoft Fabric environment to ingest and store ACC data.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Microsoft Fabric capacity (Premium or Trial)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Azure Active Directory tenant</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">ACC account with API access</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Contributor role in Azure subscription</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {setupSteps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2">
                  <step.icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
              </div>
              <p className="text-sm text-muted-foreground ml-11">{step.description}</p>
            </CardHeader>
            <CardContent>
              <CodeBlock code={step.code} title={step.title} />
            </CardContent>
          </Card>
        ))}
      </div>

      <StepNavigation
        onNext={onNext}
        onPrevious={onPrevious}
        isFirst={isFirst}
        isLast={isLast}
      />
    </div>
  )
}
