"""
ACC Semantic Layer Guide - Vercel Serverless Function
"""

from flask import Flask, render_template_string, jsonify, request
import os

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

# HTML Template (inline for Vercel)
HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACC Semantic Layer Guide</title>
    <link rel="stylesheet" href="/static/css/style.css">
</head>
<body>
    <div class="app-container">
        <nav class="sidebar">
            <div class="logo">
                <h1>ACC Semantic Layer</h1>
                <p>Build Guide</p>
            </div>
            <ul class="nav-menu">
                <li class="nav-item active" data-step="overview">
                    <span class="step-number">1</span>
                    <span class="step-name">Overview</span>
                </li>
                <li class="nav-item" data-step="acc-data">
                    <span class="step-number">2</span>
                    <span class="step-name">ACC Data Schemas</span>
                </li>
                <li class="nav-item" data-step="fabric-setup">
                    <span class="step-number">3</span>
                    <span class="step-name">Fabric Setup</span>
                </li>
                <li class="nav-item" data-step="semantic-model">
                    <span class="step-number">4</span>
                    <span class="step-name">Semantic Model</span>
                </li>
                <li class="nav-item" data-step="ai-integration">
                    <span class="step-number">5</span>
                    <span class="step-name">AI Integration</span>
                </li>
                <li class="nav-item" data-step="nl-queries">
                    <span class="step-number">6</span>
                    <span class="step-name">Natural Language</span>
                </li>
                <li class="nav-item" data-step="deployment">
                    <span class="step-number">7</span>
                    <span class="step-name">Deployment</span>
                </li>
            </ul>
            <div class="progress-indicator">
                <div class="progress-bar" id="progressBar"></div>
            </div>
        </nav>
        <main class="content">
            <section class="step-content active" id="overview">
                <h2>Building a Semantic Layer for ACC Data</h2>
                <div class="intro-card">
                    <h3>What You'll Build</h3>
                    <p>A complete semantic layer that transforms your Autodesk Construction Cloud (ACC) data into business-friendly metrics and enables natural language querying through Azure OpenAI.</p>
                </div>
                <div class="architecture-diagram">
                    <h3>Architecture Overview</h3>
                    <div class="diagram">
                        <div class="layer" id="source-layer">
                            <h4>Data Source</h4>
                            <div class="component">Autodesk Construction Cloud</div>
                            <div class="sub-components">
                                <span>Projects</span>
                                <span>Issues</span>
                                <span>Cost</span>
                                <span>Docs</span>
                            </div>
                        </div>
                        <div class="arrow">&#8595;</div>
                        <div class="layer" id="ingestion-layer">
                            <h4>Data Ingestion</h4>
                            <div class="component">Microsoft Fabric Lakehouse</div>
                            <div class="sub-components">
                                <span>Delta Tables</span>
                                <span>Dataflows</span>
                            </div>
                        </div>
                        <div class="arrow">&#8595;</div>
                        <div class="layer" id="semantic-layer">
                            <h4>Semantic Layer</h4>
                            <div class="component">Fabric Semantic Model</div>
                            <div class="sub-components">
                                <span>Dimensions</span>
                                <span>Facts</span>
                                <span>Measures</span>
                            </div>
                        </div>
                        <div class="arrow">&#8595;</div>
                        <div class="layer" id="ai-layer">
                            <h4>AI Layer</h4>
                            <div class="component">Azure OpenAI</div>
                            <div class="sub-components">
                                <span>GPT-4</span>
                                <span>Embeddings</span>
                            </div>
                        </div>
                        <div class="arrow">&#8595;</div>
                        <div class="layer" id="consumption-layer">
                            <h4>Consumption</h4>
                            <div class="component">End Users</div>
                            <div class="sub-components">
                                <span>Power BI</span>
                                <span>NL Queries</span>
                                <span>APIs</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <h4>Business-Friendly</h4>
                        <p>Transform technical ACC data into metrics like "Budget Variance" and "Issue Resolution Time"</p>
                    </div>
                    <div class="benefit-card">
                        <h4>Natural Language</h4>
                        <p>Ask questions like "What projects are over budget?" and get instant answers</p>
                    </div>
                    <div class="benefit-card">
                        <h4>Single Source of Truth</h4>
                        <p>Consistent definitions across all reports and applications</p>
                    </div>
                    <div class="benefit-card">
                        <h4>Self-Service</h4>
                        <p>Enable business users to explore data without SQL knowledge</p>
                    </div>
                </div>
                <button class="next-btn" onclick="navigateToStep('acc-data')">Get Started &rarr;</button>
            </section>
            <section class="step-content" id="acc-data">
                <h2>ACC Data Schemas</h2>
                <p class="step-intro">Select the ACC modules you want to include in your semantic layer.</p>
                <div class="schema-selector" id="schemaSelector"></div>
                <div class="schema-details" id="schemaDetails">
                    <h3>Select a schema to view details</h3>
                </div>
                <div class="nav-buttons">
                    <button class="back-btn" onclick="navigateToStep('overview')">&larr; Back</button>
                    <button class="next-btn" onclick="navigateToStep('fabric-setup')">Continue &rarr;</button>
                </div>
            </section>
            <section class="step-content" id="fabric-setup">
                <h2>Microsoft Fabric Setup</h2>
                <p class="step-intro">Configure your Fabric workspace to receive and process ACC data.</p>
                <div class="setup-steps">
                    <div class="setup-step">
                        <div class="step-header"><span class="step-icon">1</span><h3>Create Fabric Workspace</h3></div>
                        <div class="step-body">
                            <ol>
                                <li>Go to <strong>app.fabric.microsoft.com</strong></li>
                                <li>Click <strong>Workspaces</strong> &rarr; <strong>New workspace</strong></li>
                                <li>Name it <code>ACC-Analytics</code></li>
                                <li>Select <strong>Fabric capacity</strong> (F2 or higher)</li>
                            </ol>
                        </div>
                    </div>
                    <div class="setup-step">
                        <div class="step-header"><span class="step-icon">2</span><h3>Create Lakehouse</h3></div>
                        <div class="step-body">
                            <div class="code-block"><pre><code># Recommended folder structure
ACC_Lakehouse/
├── Tables/
│   ├── raw_projects
│   ├── raw_issues
│   ├── raw_contracts
│   └── raw_documents
├── Files/
│   ├── raw/
│   ├── curated/
│   └── semantic/</code></pre></div>
                        </div>
                    </div>
                    <div class="setup-step">
                        <div class="step-header"><span class="step-icon">3</span><h3>Data Ingestion</h3></div>
                        <div class="step-body">
                            <div class="code-block"><pre><code># Python notebook for ACC API ingestion
import requests
from pyspark.sql import SparkSession

ACC_BASE_URL = "https://developer.api.autodesk.com"
ACC_TOKEN = dbutils.secrets.get("acc-secrets", "api-token")

def get_acc_projects():
    headers = {"Authorization": f"Bearer {ACC_TOKEN}"}
    response = requests.get(
        f"{ACC_BASE_URL}/construction/admin/v1/projects",
        headers=headers
    )
    return response.json()

projects_df = spark.createDataFrame(get_acc_projects()['results'])
projects_df.write.mode("overwrite").saveAsTable("raw_projects")</code></pre></div>
                        </div>
                    </div>
                </div>
                <div class="nav-buttons">
                    <button class="back-btn" onclick="navigateToStep('acc-data')">&larr; Back</button>
                    <button class="next-btn" onclick="navigateToStep('semantic-model')">Continue &rarr;</button>
                </div>
            </section>
            <section class="step-content" id="semantic-model">
                <h2>Build Semantic Model</h2>
                <p class="step-intro">Create a Power BI / Fabric semantic model with business-friendly metrics.</p>
                <div class="template-selector">
                    <h3>Choose a Template</h3>
                    <div class="templates-grid" id="templatesGrid"></div>
                </div>
                <div class="model-builder">
                    <h3>Generated DAX Measures</h3>
                    <div class="code-block"><button class="copy-btn" onclick="copyCode('daxCode')">Copy</button>
                    <pre><code id="daxCode">// PROJECT METRICS
Project Count = COUNTROWS(dim_project)
Active Projects = CALCULATE(COUNTROWS(dim_project), dim_project[status] = "Active")

// ISSUE METRICS
Total Issues = COUNTROWS(fact_issues)
Open Issues = CALCULATE(COUNTROWS(fact_issues), fact_issues[status] <> "Closed")
Avg Days to Close = AVERAGE(fact_issues[days_open])
Issue Resolution Rate = DIVIDE(
    CALCULATE(COUNTROWS(fact_issues), fact_issues[status] = "Closed"),
    COUNTROWS(fact_issues)
)

// COST METRICS
Total Budget = SUM(dim_budget[revised_amount])
Total Committed = SUM(dim_budget[committed_amount])
Total Actual = SUM(dim_budget[actual_amount])
Budget Variance = [Total Budget] - [Total Actual]
Budget Variance % = DIVIDE([Budget Variance], [Total Budget])

// RFI METRICS
Total RFIs = COUNTROWS(fact_rfis)
Overdue RFIs = CALCULATE(
    COUNTROWS(fact_rfis),
    fact_rfis[due_date] < TODAY(),
    fact_rfis[status] <> "Answered"
)</code></pre></div>
                </div>
                <div class="nav-buttons">
                    <button class="back-btn" onclick="navigateToStep('fabric-setup')">&larr; Back</button>
                    <button class="next-btn" onclick="navigateToStep('ai-integration')">Continue &rarr;</button>
                </div>
            </section>
            <section class="step-content" id="ai-integration">
                <h2>AI Platform Integration</h2>
                <p class="step-intro">Connect your semantic layer to AI services for natural language capabilities.</p>
                <div class="platform-comparison" id="platformComparison"></div>
                <div class="recommendation-box">
                    <h3>Recommendation</h3>
                    <div class="recommendation">
                        <h4>Azure OpenAI + Fabric Copilot</h4>
                        <ol>
                            <li><strong>Fabric Copilot</strong> - Built-in NL to DAX in Power BI</li>
                            <li><strong>Azure OpenAI</strong> - Custom NL query API</li>
                            <li><strong>Azure AI Foundry</strong> - Optional, for custom model training</li>
                        </ol>
                    </div>
                </div>
                <div class="nav-buttons">
                    <button class="back-btn" onclick="navigateToStep('semantic-model')">&larr; Back</button>
                    <button class="next-btn" onclick="navigateToStep('nl-queries')">Continue &rarr;</button>
                </div>
            </section>
            <section class="step-content" id="nl-queries">
                <h2>Natural Language Query Interface</h2>
                <p class="step-intro">Enable users to ask questions about ACC data in plain English.</p>
                <div class="nl-demo">
                    <h3>How It Works</h3>
                    <div class="flow-diagram">
                        <div class="flow-step"><span class="flow-icon">1</span><p>User asks question</p></div>
                        <div class="flow-arrow">&rarr;</div>
                        <div class="flow-step"><span class="flow-icon">2</span><p>Azure OpenAI converts to DAX</p></div>
                        <div class="flow-arrow">&rarr;</div>
                        <div class="flow-step"><span class="flow-icon">3</span><p>Query executes on Fabric</p></div>
                        <div class="flow-arrow">&rarr;</div>
                        <div class="flow-step"><span class="flow-icon">4</span><p>Results returned to user</p></div>
                    </div>
                </div>
                <div class="code-block"><button class="copy-btn" onclick="copyCode('nlCode')">Copy</button>
                <pre><code id="nlCode">from openai import AzureOpenAI
import requests

class ACCSemanticQueryService:
    def __init__(self):
        self.client = AzureOpenAI(
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_key=os.environ["AZURE_OPENAI_KEY"],
            api_version="2024-02-15-preview"
        )

    def nl_to_dax(self, question: str) -> str:
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Convert questions to DAX queries..."},
                {"role": "user", "content": question}
            ],
            temperature=0
        )
        return response.choices[0].message.content

    def answer_question(self, question: str) -> dict:
        dax = self.nl_to_dax(question)
        results = self.execute_dax(dax)
        return {"question": question, "dax": dax, "results": results}</code></pre></div>
                <div class="query-categories" id="queryCategories"></div>
                <div class="nav-buttons">
                    <button class="back-btn" onclick="navigateToStep('ai-integration')">&larr; Back</button>
                    <button class="next-btn" onclick="navigateToStep('deployment')">Continue &rarr;</button>
                </div>
            </section>
            <section class="step-content" id="deployment">
                <h2>Deployment & Best Practices</h2>
                <div class="deployment-checklist">
                    <h3>Deployment Checklist</h3>
                    <div class="checklist">
                        <label class="checklist-item"><input type="checkbox"><span>Fabric workspace configured</span></label>
                        <label class="checklist-item"><input type="checkbox"><span>ACC data ingestion pipeline tested</span></label>
                        <label class="checklist-item"><input type="checkbox"><span>Semantic model created with measures</span></label>
                        <label class="checklist-item"><input type="checkbox"><span>Row-level security configured</span></label>
                        <label class="checklist-item"><input type="checkbox"><span>Azure OpenAI deployed</span></label>
                        <label class="checklist-item"><input type="checkbox"><span>NL query service tested</span></label>
                        <label class="checklist-item"><input type="checkbox"><span>Power BI reports created</span></label>
                    </div>
                </div>
                <div class="best-practices">
                    <div class="practice-card">
                        <h4>Data Freshness</h4>
                        <ul>
                            <li>Schedule incremental refresh</li>
                            <li>Use CDC when available</li>
                            <li>Set appropriate refresh frequency</li>
                        </ul>
                    </div>
                    <div class="practice-card">
                        <h4>Security</h4>
                        <ul>
                            <li>Implement row-level security</li>
                            <li>Use managed identity</li>
                            <li>Store keys in Key Vault</li>
                        </ul>
                    </div>
                    <div class="practice-card">
                        <h4>Performance</h4>
                        <ul>
                            <li>Use Direct Lake mode</li>
                            <li>Create aggregation tables</li>
                            <li>Optimize DAX measures</li>
                        </ul>
                    </div>
                </div>
                <div class="completion-message">
                    <h3>You're Ready!</h3>
                    <p>You have a complete guide to building a semantic layer for your ACC data.</p>
                </div>
                <div class="nav-buttons">
                    <button class="back-btn" onclick="navigateToStep('nl-queries')">&larr; Back</button>
                </div>
            </section>
        </main>
    </div>
    <script src="/static/js/app.js"></script>
</body>
</html>'''

@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

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
    data = request.json
    schema_name = data.get('schema')
    if schema_name not in ACC_DATA_SCHEMAS:
        return jsonify({"error": "Invalid schema"}), 400
    schema = ACC_DATA_SCHEMAS[schema_name]
    measures = schema.get('semantic_model', {}).get('measures', [])
    dax_code = []
    for measure in measures:
        dax_code.append(f"// {measure['description']}\n{measure['name']} = {measure['expression']}")
    return jsonify({"dax": "\n\n".join(dax_code)})

@app.route('/api/azure-openai-config')
def get_azure_openai_config():
    return jsonify({
        "setup_steps": [],
        "example_prompts": [
            {"category": "Cost Analysis", "questions": [
                "What is the total budget variance across all projects?",
                "Show me the top 5 projects by change order amount"
            ]},
            {"category": "Issue Tracking", "questions": [
                "How many open issues are past their due date?",
                "What is the average time to close issues by project?"
            ]},
            {"category": "Project Health", "questions": [
                "Which projects are behind schedule?",
                "Compare budget vs actual by project"
            ]}
        ]
    })

# Vercel handler
app = app
