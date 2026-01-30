"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { StepNavigation } from "../step-navigation"
import { CodeBlock } from "../code-block"
import { EXAMPLE_PROMPTS } from "../../lib/data"

interface NLQueriesStepProps {
  onBack: () => void
  onNext: () => void
}

const implementationCode = `"""
Natural Language to DAX Query Service
Integrates Azure OpenAI with Fabric Semantic Model
"""

import os
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential
import requests

class ACCSemanticQueryService:
    def __init__(self):
        self.openai_client = AzureOpenAI(
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_KEY"],
            api_version="2024-02-15-preview"
        )
        self.fabric_token = self._get_fabric_token()
        self.semantic_model_id = os.environ["FABRIC_SEMANTIC_MODEL_ID"]
        self.workspace_id = os.environ["FABRIC_WORKSPACE_ID"]

    def _get_fabric_token(self):
        credential = DefaultAzureCredential()
        token = credential.get_token("https://analysis.windows.net/powerbi/api/.default")
        return token.token

    def _get_semantic_schema(self):
        """Retrieve semantic model schema for context"""
        return """
        Tables:
        - dim_project (project_id, project_name, status, start_date, end_date)
        - fact_issues (issue_id, project_id, title, status, priority, due_date, days_open)
        - fact_rfis (rfi_id, project_id, subject, status, submitted_date, due_date, responded_date)
        - dim_budget (budget_id, project_id, budget_code, original_amount, revised_amount, committed_amount, actual_amount)
        - fact_contracts (contract_id, project_id, vendor_id, original_value, current_value, status)
        - fact_change_orders (change_order_id, contract_id, project_id, amount, status, reason_code)

        Measures:
        - [Total Issues], [Open Issues], [Avg Days to Close]
        - [Total RFIs], [Overdue RFIs], [Avg RFI Response Days]
        - [Total Budget], [Total Committed], [Total Actual], [Budget Variance]
        - [Project Count], [Active Projects]

        Relationships:
        - dim_project.project_id -> fact_issues.project_id (1:*)
        - dim_project.project_id -> fact_rfis.project_id (1:*)
        - dim_project.project_id -> dim_budget.project_id (1:*)
        """

    def natural_language_to_dax(self, question: str) -> str:
        """Convert natural language question to DAX query"""

        system_prompt = f"""You are a DAX query expert for construction project data.
Given this semantic model schema:
{self._get_semantic_schema()}

Convert the user's question to a valid DAX EVALUATE query.
Rules:
1. Use EVALUATE for queries that return tables
2. Use existing measures when available
3. Include TOPN for "top/most" questions
4. Return ONLY the DAX code, no explanations
5. Use SUMMARIZE for grouping operations
"""

        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            temperature=0,
            max_tokens=500
        )

        return response.choices[0].message.content.strip()

    def execute_dax_query(self, dax_query: str) -> dict:
        """Execute DAX query against Fabric semantic model"""

        url = f"https://api.powerbi.com/v1.0/myorg/groups/{self.workspace_id}/datasets/{self.semantic_model_id}/executeQueries"

        headers = {
            "Authorization": f"Bearer {self.fabric_token}",
            "Content-Type": "application/json"
        }

        payload = {
            "queries": [{"query": dax_query}],
            "serializerSettings": {"includeNulls": True}
        }

        response = requests.post(url, headers=headers, json=payload)
        return response.json()

    def answer_question(self, question: str) -> dict:
        """Full pipeline: question -> DAX -> results -> explanation"""

        # Step 1: Convert to DAX
        dax_query = self.natural_language_to_dax(question)

        # Step 2: Execute query
        results = self.execute_dax_query(dax_query)

        # Step 3: Generate natural language explanation
        explanation_prompt = f"""
        Question: {question}
        DAX Query: {dax_query}
        Results: {results}

        Provide a clear, concise answer to the question based on the results.
        Include specific numbers and project names where relevant.
        """

        explanation = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": explanation_prompt}],
            temperature=0.3
        )

        return {
            "question": question,
            "dax_query": dax_query,
            "results": results,
            "answer": explanation.choices[0].message.content
        }


# Example usage
if __name__ == "__main__":
    service = ACCSemanticQueryService()

    questions = [
        "Which projects have the most overdue RFIs?",
        "What is the total budget variance across all active projects?",
        "Show me the top 5 projects by open issue count",
        "What's the average time to close issues by project?"
    ]

    for q in questions:
        result = service.answer_question(q)
        print(f"\\nQ: {q}")
        print(f"A: {result['answer']}")`

export function NLQueriesStep({ onBack, onNext }: NLQueriesStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Natural Language Query Interface
      </h2>
      <p className="mt-2 text-muted-foreground">
        Enable users to ask questions about ACC data in plain English.
      </p>

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { step: 1, text: 'User asks: "Which projects have the most overdue RFIs?"' },
              { step: 2, text: "Azure OpenAI translates to DAX using semantic model schema" },
              { step: 3, text: "Query executes against Fabric semantic model" },
              { step: 4, text: "Results returned to user with explanation" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-center text-white max-w-[180px]">
                  <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                    {item.step}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed">{item.text}</p>
                </div>
                {index < 3 && (
                  <svg
                    className="h-6 w-6 shrink-0 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Code */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Implementation</h3>
        <div className="mt-4">
          <CodeBlock code={implementationCode} language="Python" />
        </div>
      </div>

      {/* Example Queries */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Example Queries by Category</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_PROMPTS.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-base text-primary">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.questions.map((question, i) => (
                    <li
                      key={i}
                      className="border-b border-border pb-2 text-sm text-muted-foreground last:border-0 last:pb-0"
                    >
                      &quot;{question}&quot;
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} />
    </div>
  )
}
