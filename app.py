"""
ACC Semantic Layer Guide - Web Application
Guides users through building a semantic layer for Autodesk Construction Cloud data
in Microsoft Fabric with Azure OpenAI integration.
"""

from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

# ACC Data Schemas and Metadata
ACC_DATA_SCHEMAS = {
    "projects": {
        "name": "Projects",
        "description": "Core project metadata and settings",
        "tables": [
            {
                "name": "dim_project",
                "description": "Project dimension table",
                "columns": [
                    {"name": "project_id", "type": "STRING", "description": "Unique project identifier"},
                    {"name": "project_name", "type": "STRING", "description": "Project display name"},
                    {"name": "project_type", "type": "STRING", "description": "Type of construction project"},
                    {"name": "status", "type": "STRING", "description": "Current project status"},
                    {"name": "start_date", "type": "DATE", "description": "Project start date"},
                    {"name": "end_date", "type": "DATE", "description": "Planned completion date"},
                    {"name": "address", "type": "STRING", "description": "Project location address"},
                    {"name": "latitude", "type": "DECIMAL", "description": "Location latitude"},
                    {"name": "longitude", "type": "DECIMAL", "description": "Location longitude"},
                    {"name": "created_at", "type": "TIMESTAMP", "description": "Record creation timestamp"},
                    {"name": "updated_at", "type": "TIMESTAMP", "description": "Last update timestamp"}
                ]
            }
        ],
        "semantic_model": {
            "measures": [
                {"name": "Project Count", "expression": "COUNTROWS(dim_project)", "description": "Total number of projects"},
                {"name": "Active Projects", "expression": "CALCULATE(COUNTROWS(dim_project), dim_project[status] = \"Active\")", "description": "Number of active projects"}
            ],
            "hierarchies": [
                {"name": "Project Geography", "levels": ["Country", "State", "City", "Project"]}
            ]
        }
    },
    "issues": {
        "name": "Issues & RFIs",
        "description": "Project issues, RFIs, and action items",
        "tables": [
            {
                "name": "fact_issues",
                "description": "Issues fact table",
                "columns": [
                    {"name": "issue_id", "type": "STRING", "description": "Unique issue identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "title", "type": "STRING", "description": "Issue title"},
                    {"name": "description", "type": "STRING", "description": "Detailed issue description"},
                    {"name": "issue_type", "type": "STRING", "description": "Type of issue"},
                    {"name": "status", "type": "STRING", "description": "Current status"},
                    {"name": "priority", "type": "STRING", "description": "Priority level"},
                    {"name": "assigned_to", "type": "STRING", "description": "Assignee user ID"},
                    {"name": "due_date", "type": "DATE", "description": "Due date for resolution"},
                    {"name": "created_date", "type": "DATE", "description": "Issue creation date"},
                    {"name": "closed_date", "type": "DATE", "description": "Date issue was closed"},
                    {"name": "days_open", "type": "INTEGER", "description": "Number of days issue was/is open"}
                ]
            },
            {
                "name": "fact_rfis",
                "description": "RFIs (Requests for Information) fact table",
                "columns": [
                    {"name": "rfi_id", "type": "STRING", "description": "Unique RFI identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "number", "type": "STRING", "description": "RFI number"},
                    {"name": "subject", "type": "STRING", "description": "RFI subject"},
                    {"name": "question", "type": "STRING", "description": "RFI question text"},
                    {"name": "answer", "type": "STRING", "description": "RFI answer text"},
                    {"name": "status", "type": "STRING", "description": "Current status"},
                    {"name": "submitted_by", "type": "STRING", "description": "Submitter user ID"},
                    {"name": "assigned_to", "type": "STRING", "description": "Assignee user ID"},
                    {"name": "submitted_date", "type": "DATE", "description": "Submission date"},
                    {"name": "due_date", "type": "DATE", "description": "Response due date"},
                    {"name": "responded_date", "type": "DATE", "description": "Date of response"}
                ]
            }
        ],
        "semantic_model": {
            "measures": [
                {"name": "Total Issues", "expression": "COUNTROWS(fact_issues)", "description": "Total number of issues"},
                {"name": "Open Issues", "expression": "CALCULATE(COUNTROWS(fact_issues), fact_issues[status] <> \"Closed\")", "description": "Number of open issues"},
                {"name": "Avg Days to Close", "expression": "AVERAGE(fact_issues[days_open])", "description": "Average days to close an issue"},
                {"name": "Total RFIs", "expression": "COUNTROWS(fact_rfis)", "description": "Total number of RFIs"},
                {"name": "Overdue RFIs", "expression": "CALCULATE(COUNTROWS(fact_rfis), fact_rfis[due_date] < TODAY() && fact_rfis[status] <> \"Answered\")", "description": "RFIs past due date"}
            ],
            "hierarchies": [
                {"name": "Issue Status", "levels": ["Status", "Priority", "Type"]}
            ]
        }
    },
    "cost": {
        "name": "Cost Management",
        "description": "Budgets, contracts, and change orders",
        "tables": [
            {
                "name": "dim_budget",
                "description": "Budget dimension table",
                "columns": [
                    {"name": "budget_id", "type": "STRING", "description": "Unique budget identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "budget_code", "type": "STRING", "description": "Budget code"},
                    {"name": "description", "type": "STRING", "description": "Budget line description"},
                    {"name": "original_amount", "type": "DECIMAL", "description": "Original budgeted amount"},
                    {"name": "revised_amount", "type": "DECIMAL", "description": "Current revised amount"},
                    {"name": "committed_amount", "type": "DECIMAL", "description": "Amount committed via contracts"},
                    {"name": "actual_amount", "type": "DECIMAL", "description": "Actual spent amount"}
                ]
            },
            {
                "name": "fact_contracts",
                "description": "Contracts fact table",
                "columns": [
                    {"name": "contract_id", "type": "STRING", "description": "Unique contract identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "contract_number", "type": "STRING", "description": "Contract number"},
                    {"name": "vendor_id", "type": "STRING", "description": "Vendor/subcontractor ID"},
                    {"name": "contract_type", "type": "STRING", "description": "Type of contract"},
                    {"name": "original_value", "type": "DECIMAL", "description": "Original contract value"},
                    {"name": "current_value", "type": "DECIMAL", "description": "Current contract value with COs"},
                    {"name": "status", "type": "STRING", "description": "Contract status"},
                    {"name": "start_date", "type": "DATE", "description": "Contract start date"},
                    {"name": "end_date", "type": "DATE", "description": "Contract end date"}
                ]
            },
            {
                "name": "fact_change_orders",
                "description": "Change orders fact table",
                "columns": [
                    {"name": "change_order_id", "type": "STRING", "description": "Unique change order identifier"},
                    {"name": "contract_id", "type": "STRING", "description": "Related contract ID (FK)"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "co_number", "type": "STRING", "description": "Change order number"},
                    {"name": "title", "type": "STRING", "description": "Change order title"},
                    {"name": "amount", "type": "DECIMAL", "description": "Change order amount"},
                    {"name": "status", "type": "STRING", "description": "Approval status"},
                    {"name": "reason_code", "type": "STRING", "description": "Reason for change"},
                    {"name": "submitted_date", "type": "DATE", "description": "Submission date"},
                    {"name": "approved_date", "type": "DATE", "description": "Approval date"}
                ]
            }
        ],
        "semantic_model": {
            "measures": [
                {"name": "Total Budget", "expression": "SUM(dim_budget[revised_amount])", "description": "Total revised budget"},
                {"name": "Total Committed", "expression": "SUM(dim_budget[committed_amount])", "description": "Total committed amount"},
                {"name": "Total Actual", "expression": "SUM(dim_budget[actual_amount])", "description": "Total actual spent"},
                {"name": "Budget Variance", "expression": "[Total Budget] - [Total Actual]", "description": "Difference between budget and actual"},
                {"name": "Contract Value", "expression": "SUM(fact_contracts[current_value])", "description": "Total current contract value"},
                {"name": "Change Order Amount", "expression": "SUM(fact_change_orders[amount])", "description": "Total change order amount"},
                {"name": "CO Count", "expression": "COUNTROWS(fact_change_orders)", "description": "Number of change orders"}
            ],
            "hierarchies": [
                {"name": "Cost Category", "levels": ["Division", "Budget Code", "Line Item"]}
            ]
        }
    },
    "documents": {
        "name": "Documents & Files",
        "description": "Document management and file metadata",
        "tables": [
            {
                "name": "dim_folders",
                "description": "Folder hierarchy dimension",
                "columns": [
                    {"name": "folder_id", "type": "STRING", "description": "Unique folder identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "folder_name", "type": "STRING", "description": "Folder name"},
                    {"name": "parent_folder_id", "type": "STRING", "description": "Parent folder ID"},
                    {"name": "folder_path", "type": "STRING", "description": "Full folder path"},
                    {"name": "permission_level", "type": "STRING", "description": "Access permission level"}
                ]
            },
            {
                "name": "fact_documents",
                "description": "Documents fact table",
                "columns": [
                    {"name": "document_id", "type": "STRING", "description": "Unique document identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "folder_id", "type": "STRING", "description": "Parent folder ID (FK)"},
                    {"name": "file_name", "type": "STRING", "description": "Document file name"},
                    {"name": "file_type", "type": "STRING", "description": "File extension/type"},
                    {"name": "file_size_bytes", "type": "BIGINT", "description": "File size in bytes"},
                    {"name": "version", "type": "INTEGER", "description": "Document version number"},
                    {"name": "created_by", "type": "STRING", "description": "Creator user ID"},
                    {"name": "created_date", "type": "DATE", "description": "Creation date"},
                    {"name": "modified_date", "type": "DATE", "description": "Last modified date"},
                    {"name": "status", "type": "STRING", "description": "Document status"}
                ]
            }
        ],
        "semantic_model": {
            "measures": [
                {"name": "Document Count", "expression": "COUNTROWS(fact_documents)", "description": "Total number of documents"},
                {"name": "Total Storage GB", "expression": "SUM(fact_documents[file_size_bytes]) / 1073741824", "description": "Total storage in GB"},
                {"name": "Avg Versions", "expression": "AVERAGE(fact_documents[version])", "description": "Average version count per document"}
            ],
            "hierarchies": [
                {"name": "Document Hierarchy", "levels": ["Project", "Folder", "Document"]}
            ]
        }
    },
    "schedule": {
        "name": "Schedule & Tasks",
        "description": "Project schedules and task management",
        "tables": [
            {
                "name": "fact_tasks",
                "description": "Schedule tasks fact table",
                "columns": [
                    {"name": "task_id", "type": "STRING", "description": "Unique task identifier"},
                    {"name": "project_id", "type": "STRING", "description": "Related project ID (FK)"},
                    {"name": "task_name", "type": "STRING", "description": "Task name"},
                    {"name": "wbs_code", "type": "STRING", "description": "Work breakdown structure code"},
                    {"name": "parent_task_id", "type": "STRING", "description": "Parent task ID"},
                    {"name": "planned_start", "type": "DATE", "description": "Planned start date"},
                    {"name": "planned_finish", "type": "DATE", "description": "Planned finish date"},
                    {"name": "actual_start", "type": "DATE", "description": "Actual start date"},
                    {"name": "actual_finish", "type": "DATE", "description": "Actual finish date"},
                    {"name": "percent_complete", "type": "DECIMAL", "description": "Completion percentage"},
                    {"name": "planned_duration_days", "type": "INTEGER", "description": "Planned duration"},
                    {"name": "actual_duration_days", "type": "INTEGER", "description": "Actual duration"},
                    {"name": "status", "type": "STRING", "description": "Task status"}
                ]
            }
        ],
        "semantic_model": {
            "measures": [
                {"name": "Task Count", "expression": "COUNTROWS(fact_tasks)", "description": "Total number of tasks"},
                {"name": "Completed Tasks", "expression": "CALCULATE(COUNTROWS(fact_tasks), fact_tasks[percent_complete] = 100)", "description": "Number of completed tasks"},
                {"name": "Avg Completion %", "expression": "AVERAGE(fact_tasks[percent_complete])", "description": "Average task completion"},
                {"name": "Schedule Variance Days", "expression": "SUM(fact_tasks[actual_duration_days] - fact_tasks[planned_duration_days])", "description": "Total schedule variance"}
            ],
            "hierarchies": [
                {"name": "WBS Hierarchy", "levels": ["Phase", "Deliverable", "Work Package", "Task"]}
            ]
        }
    }
}

# Fabric Semantic Model Templates
FABRIC_TEMPLATES = {
    "basic": {
        "name": "Basic Semantic Model",
        "description": "Simple star schema with core dimensions and facts",
        "complexity": "Low",
        "use_case": "Quick start for basic reporting"
    },
    "comprehensive": {
        "name": "Comprehensive Semantic Model",
        "description": "Full dimensional model with all ACC modules",
        "complexity": "High",
        "use_case": "Enterprise-wide analytics and reporting"
    },
    "cost_focused": {
        "name": "Cost Analytics Model",
        "description": "Focused on cost management and financial metrics",
        "complexity": "Medium",
        "use_case": "Financial reporting and cost control"
    },
    "project_health": {
        "name": "Project Health Model",
        "description": "KPIs for project health monitoring",
        "complexity": "Medium",
        "use_case": "Executive dashboards and project oversight"
    }
}

# AI Platform Comparison
AI_PLATFORMS = {
    "azure_openai": {
        "name": "Azure OpenAI Service",
        "description": "Microsoft's enterprise offering of OpenAI models",
        "pros": [
            "Native integration with Microsoft Fabric",
            "Enterprise security and compliance",
            "Same models as OpenAI (GPT-4, embeddings)",
            "Regional data residency options",
            "Direct integration with Power BI Copilot"
        ],
        "cons": [
            "Requires Azure subscription",
            "Model availability varies by region",
            "Higher cost than direct OpenAI for some scenarios"
        ],
        "best_for": "Organizations already using Microsoft stack, requiring enterprise compliance",
        "integration_level": "Native"
    },
    "azure_ai_foundry": {
        "name": "Azure AI Foundry (formerly Azure ML)",
        "description": "Microsoft's comprehensive AI/ML platform",
        "pros": [
            "End-to-end ML lifecycle management",
            "Custom model training and fine-tuning",
            "MLOps and model monitoring",
            "Integration with Azure OpenAI",
            "Prompt flow for LLM orchestration"
        ],
        "cons": [
            "Steeper learning curve",
            "More complex setup required",
            "Overkill for simple Q&A scenarios"
        ],
        "best_for": "Custom ML models, complex AI workflows, fine-tuning on domain data",
        "integration_level": "Native"
    },
    "fabric_copilot": {
        "name": "Microsoft Fabric Copilot",
        "description": "Built-in AI assistant for Fabric workspaces",
        "pros": [
            "Zero configuration required",
            "Automatic semantic model understanding",
            "Natural language to DAX/SQL",
            "Built into Power BI and Fabric"
        ],
        "cons": [
            "Limited customization",
            "Relies on well-designed semantic models",
            "May not understand domain-specific terminology"
        ],
        "best_for": "Quick natural language querying without custom development",
        "integration_level": "Built-in"
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/schemas')
def get_schemas():
    return jsonify(ACC_DATA_SCHEMAS)

@app.route('/api/schemas/<schema_name>')
def get_schema(schema_name):
    if schema_name in ACC_DATA_SCHEMAS:
        return jsonify(ACC_DATA_SCHEMAS[schema_name])
    return jsonify({"error": "Schema not found"}), 404

@app.route('/api/templates')
def get_templates():
    return jsonify(FABRIC_TEMPLATES)

@app.route('/api/ai-platforms')
def get_ai_platforms():
    return jsonify(AI_PLATFORMS)

@app.route('/api/generate-dax', methods=['POST'])
def generate_dax():
    """Generate DAX code for semantic model measures"""
    data = request.json
    schema_name = data.get('schema')

    if schema_name not in ACC_DATA_SCHEMAS:
        return jsonify({"error": "Invalid schema"}), 400

    schema = ACC_DATA_SCHEMAS[schema_name]
    measures = schema.get('semantic_model', {}).get('measures', [])

    dax_code = []
    for measure in measures:
        dax_code.append(f"""
// {measure['description']}
{measure['name']} = {measure['expression']}
""".strip())

    return jsonify({"dax": "\n\n".join(dax_code)})

@app.route('/api/generate-tmdl', methods=['POST'])
def generate_tmdl():
    """Generate TMDL (Tabular Model Definition Language) for Fabric"""
    data = request.json
    selected_schemas = data.get('schemas', [])

    tmdl_parts = []

    # Generate model header
    tmdl_parts.append("""model ACC_Semantic_Model
    culture: en-US
    defaultPowerBIDataSourceVersion: powerBI_V3

    annotations:
        - name: Description
          value: Semantic model for Autodesk Construction Cloud data
""")

    # Generate tables for each selected schema
    for schema_name in selected_schemas:
        if schema_name not in ACC_DATA_SCHEMAS:
            continue

        schema = ACC_DATA_SCHEMAS[schema_name]
        for table in schema.get('tables', []):
            tmdl_parts.append(f"\n    table {table['name']}")
            tmdl_parts.append(f"        description: {table['description']}")
            tmdl_parts.append("")

            for col in table.get('columns', []):
                tmdl_parts.append(f"        column {col['name']}")
                tmdl_parts.append(f"            dataType: {col['type'].lower()}")
                tmdl_parts.append(f"            description: {col['description']}")
                tmdl_parts.append("")

    return jsonify({"tmdl": "\n".join(tmdl_parts)})

@app.route('/api/azure-openai-config')
def get_azure_openai_config():
    """Return Azure OpenAI configuration guidance"""
    config = {
        "setup_steps": [
            {
                "step": 1,
                "title": "Create Azure OpenAI Resource",
                "description": "In Azure Portal, create a new Azure OpenAI resource",
                "code": """# Azure CLI
az cognitiveservices account create \\
    --name acc-semantic-openai \\
    --resource-group your-resource-group \\
    --kind OpenAI \\
    --sku S0 \\
    --location eastus"""
            },
            {
                "step": 2,
                "title": "Deploy Models",
                "description": "Deploy GPT-4 and text-embedding-ada-002 models",
                "code": """# Deploy GPT-4 for natural language understanding
az cognitiveservices account deployment create \\
    --name acc-semantic-openai \\
    --resource-group your-resource-group \\
    --deployment-name gpt-4 \\
    --model-name gpt-4 \\
    --model-version "0613" \\
    --model-format OpenAI \\
    --sku-capacity 10 \\
    --sku-name Standard"""
            },
            {
                "step": 3,
                "title": "Configure Fabric Connection",
                "description": "Set up connection between Fabric and Azure OpenAI",
                "code": """# In Fabric workspace settings:
# 1. Go to Settings > Azure connections
# 2. Add new connection to Azure OpenAI
# 3. Use managed identity or service principal

# Python SDK example for custom integration
from azure.ai.openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint="https://acc-semantic-openai.openai.azure.com/",
    api_key="your-api-key",
    api_version="2024-02-15-preview"
)"""
            },
            {
                "step": 4,
                "title": "Create Semantic Query Function",
                "description": "Build function to translate natural language to DAX",
                "code": """def nl_to_dax(question: str, semantic_model_schema: str) -> str:
    \"\"\"Convert natural language to DAX query\"\"\"

    system_prompt = f\"\"\"You are a DAX query expert for Microsoft Fabric.
Given the following semantic model schema:
{semantic_model_schema}

Convert user questions to valid DAX queries.
Return only the DAX code, no explanations.\"\"\"

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        temperature=0
    )

    return response.choices[0].message.content"""
            }
        ],
        "example_prompts": [
            {
                "category": "Cost Analysis",
                "questions": [
                    "What is the total budget variance across all projects?",
                    "Show me the top 5 projects by change order amount",
                    "What percentage of contracts have pending change orders?"
                ]
            },
            {
                "category": "Issue Tracking",
                "questions": [
                    "How many open issues are past their due date?",
                    "What is the average time to close issues by project?",
                    "Show RFI response times by assignee"
                ]
            },
            {
                "category": "Project Health",
                "questions": [
                    "Which projects are behind schedule?",
                    "What is the overall task completion rate?",
                    "Compare budget vs actual by project"
                ]
            }
        ]
    }
    return jsonify(config)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
