"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StepNavigation } from "@/components/step-navigation"
import { CodeBlock } from "@/components/code-block"

interface FabricSetupStepProps {
  onBack: () => void
  onNext: () => void
}

const setupSteps = [
  {
    step: 1,
    title: "Create Fabric Workspace",
    content: (
      <>
        <p className="text-muted-foreground">Create a dedicated workspace for your ACC analytics:</p>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-foreground">
          <li>
            Go to <strong>app.fabric.microsoft.com</strong>
          </li>
          <li>
            Click <strong>Workspaces</strong> → <strong>New workspace</strong>
          </li>
          <li>
            Name it <code className="rounded bg-muted px-1.5 py-0.5 text-xs">ACC-Analytics</code>
          </li>
          <li>
            Select <strong>Fabric capacity</strong> (F2 or higher recommended)
          </li>
          <li>
            Enable <strong>OneLake data access</strong>
          </li>
        </ol>
      </>
    ),
  },
  {
    step: 2,
    title: "Create Lakehouse",
    content: (
      <>
        <p className="text-muted-foreground">Set up the lakehouse for raw and curated ACC data:</p>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-foreground">
          <li>
            In your workspace, click <strong>+ New</strong> → <strong>Lakehouse</strong>
          </li>
          <li>
            Name it <code className="rounded bg-muted px-1.5 py-0.5 text-xs">ACC_Lakehouse</code>
          </li>
          <li>
            Create folders:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">raw/</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">curated/</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">semantic/</code>
          </li>
        </ol>
        <CodeBlock
          className="mt-4"
          code={`# Recommended folder structure
ACC_Lakehouse/
├── Tables/
│   ├── raw_projects
│   ├── raw_issues
│   ├── raw_rfis
│   ├── raw_contracts
│   ├── raw_change_orders
│   └── raw_documents
├── Files/
│   ├── raw/           # Landing zone for API data
│   ├── curated/       # Cleaned & transformed
│   └── semantic/      # Model artifacts`}
        />
      </>
    ),
  },
  {
    step: 3,
    title: "Configure ACC Data Ingestion",
    content: (
      <>
        <p className="text-muted-foreground">
          Create a Data Pipeline to pull data from ACC APIs:
        </p>
        <CodeBlock
          className="mt-4"
          language="Python"
          code={`# Python notebook for ACC API ingestion
import requests
import json
from pyspark.sql import SparkSession

# ACC API Configuration
ACC_BASE_URL = "https://developer.api.autodesk.com"
ACC_TOKEN = dbutils.secrets.get("acc-secrets", "api-token")

def get_acc_projects():
    """Fetch all projects from ACC"""
    headers = {"Authorization": f"Bearer {ACC_TOKEN}"}
    response = requests.get(
        f"{ACC_BASE_URL}/construction/admin/v1/projects",
        headers=headers
    )
    return response.json()

def get_acc_issues(project_id):
    """Fetch issues for a project"""
    headers = {"Authorization": f"Bearer {ACC_TOKEN}"}
    response = requests.get(
        f"{ACC_BASE_URL}/issues/v1/containers/{project_id}/issues",
        headers=headers
    )
    return response.json()

# Load to Delta tables
projects_df = spark.createDataFrame(get_acc_projects()['results'])
projects_df.write.mode("overwrite").saveAsTable("raw_projects")`}
        />
      </>
    ),
  },
  {
    step: 4,
    title: "Data Transformation",
    content: (
      <>
        <p className="text-muted-foreground">
          Transform raw data into dimensional model using Fabric notebooks:
        </p>
        <CodeBlock
          className="mt-4"
          language="Python"
          code={`# Create dimension and fact tables
from pyspark.sql import functions as F

# Dimension: Projects
dim_project = spark.sql("""
    SELECT
        id as project_id,
        name as project_name,
        type as project_type,
        status,
        startDate as start_date,
        endDate as end_date,
        address_line_1 as address,
        latitude,
        longitude,
        created_at,
        updated_at
    FROM raw_projects
""")
dim_project.write.mode("overwrite").saveAsTable("dim_project")

# Fact: Issues
fact_issues = spark.sql("""
    SELECT
        id as issue_id,
        containerId as project_id,
        title,
        description,
        issueType as issue_type,
        status,
        priority,
        assignedTo as assigned_to,
        dueDate as due_date,
        createdAt as created_date,
        closedAt as closed_date,
        DATEDIFF(COALESCE(closedAt, current_date()), createdAt) as days_open
    FROM raw_issues
""")
fact_issues.write.mode("overwrite").saveAsTable("fact_issues")`}
        />
      </>
    ),
  },
]

export function FabricSetupStep({ onBack, onNext }: FabricSetupStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Microsoft Fabric Setup
      </h2>
      <p className="mt-2 text-muted-foreground">
        Configure your Fabric workspace to receive and process ACC data.
      </p>

      <div className="mt-8 space-y-6">
        {setupSteps.map((item) => (
          <Card key={item.step} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 font-semibold">
                {item.step}
              </span>
              <CardTitle className="text-white">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">{item.content}</CardContent>
          </Card>
        ))}
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} />
    </div>
  )
}
