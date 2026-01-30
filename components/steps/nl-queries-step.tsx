"use client"

// Natural language queries step component
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
        
    def natural_language_to_dax(self, question: str) -> str:
        """Convert natural language question to DAX query"""
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Convert to DAX query..."},
                {"role": "user", "content": question}
            ],
            temperature=0
        )
        return response.choices[0].message.content.strip()
        
    def execute_dax_query(self, dax_query: str) -> dict:
        """Execute DAX query against Fabric semantic model"""
        url = f"https://api.powerbi.com/v1.0/myorg/groups/{self.workspace_id}/datasets/{self.semantic_model_id}/executeQueries"
        headers = {"Authorization": f"Bearer {self.fabric_token}"}
        payload = {"queries": [{"query": dax_query}]}
        response = requests.post(url, headers=headers, json=payload)
        return response.json()
        
    def answer_question(self, question: str) -> dict:
        """Full pipeline: question -> DAX -> results"""
        dax_query = self.natural_language_to_dax(question)
        results = self.execute_dax_query(dax_query)
        return {"question": question, "dax_query": dax_query, "results": results}`

export function NLQueriesStep({ onBack, onNext }: NLQueriesStepProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Natural Language Query Interface
      </h2>
      <p className="mt-2 text-muted-foreground">
        Enable users to ask questions about ACC data in plain English.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { step: 1, text: "User asks question" },
              { step: 2, text: "Azure OpenAI translates to DAX" },
              { step: 3, text: "Query executes against Fabric" },
              { step: 4, text: "Results returned with explanation" },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-center text-white max-w-[180px]">
                  <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                    {item.step}
                  </span>
                  <p className="mt-2 text-xs leading-relaxed">{item.text}</p>
                </div>
                {index < 3 && (
                  <svg className="h-6 w-6 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Implementation</h3>
        <div className="mt-4">
          <CodeBlock code={implementationCode} language="Python" />
        </div>
      </div>

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
                    <li key={i} className="border-b border-border pb-2 text-sm text-muted-foreground last:border-0 last:pb-0">
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
