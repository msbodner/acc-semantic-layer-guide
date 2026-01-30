/**
 * ACC Semantic Layer Guide - JavaScript Application
 */

// State management
const state = {
    currentStep: 'overview',
    selectedSchemas: [],
    selectedTemplate: 'comprehensive',
    completedSteps: []
};

// Step order for navigation
const stepOrder = ['overview', 'acc-data', 'fabric-setup', 'semantic-model', 'ai-integration', 'nl-queries', 'deployment'];

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    await loadSchemas();
    await loadTemplates();
    await loadAIPlatforms();
    await loadAzureOpenAIConfig();
    setupEventListeners();
    updateProgress();
});

/**
 * Navigation Functions
 */
function navigateToStep(stepId) {
    // Mark current step as completed
    if (!state.completedSteps.includes(state.currentStep)) {
        state.completedSteps.push(state.currentStep);
    }

    // Update state
    state.currentStep = stepId;

    // Update UI
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    document.getElementById(stepId).classList.add('active');
    document.querySelector(`[data-step="${stepId}"]`).classList.add('active');

    // Mark completed steps in nav
    state.completedSteps.forEach(step => {
        document.querySelector(`[data-step="${step}"]`).classList.add('completed');
    });

    updateProgress();
    window.scrollTo(0, 0);
}

function updateProgress() {
    const currentIndex = stepOrder.indexOf(state.currentStep);
    const progress = ((currentIndex + 1) / stepOrder.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const step = item.dataset.step;
            navigateToStep(step);
        });
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            // Update tab buttons
            tab.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update tab content
            const contentContainer = tab.closest('.model-builder');
            contentContainer.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

/**
 * Load ACC Schemas
 */
async function loadSchemas() {
    try {
        const response = await fetch('/api/schemas');
        const schemas = await response.json();

        const container = document.getElementById('schemaSelector');
        container.innerHTML = '';

        Object.entries(schemas).forEach(([key, schema]) => {
            const card = document.createElement('div');
            card.className = 'schema-card';
            card.dataset.schema = key;
            card.innerHTML = `
                <h4>${schema.name}</h4>
                <p>${schema.description}</p>
            `;
            card.addEventListener('click', () => toggleSchema(key, schemas));
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load schemas:', error);
    }
}

function toggleSchema(schemaKey, allSchemas) {
    const card = document.querySelector(`[data-schema="${schemaKey}"]`);
    const index = state.selectedSchemas.indexOf(schemaKey);

    if (index === -1) {
        state.selectedSchemas.push(schemaKey);
        card.classList.add('selected');
    } else {
        state.selectedSchemas.splice(index, 1);
        card.classList.remove('selected');
    }

    // Show schema details
    if (state.selectedSchemas.length > 0) {
        showSchemaDetails(allSchemas[schemaKey]);
    } else {
        document.getElementById('schemaDetails').innerHTML = '<h3>Select a schema to view details</h3>';
    }

    // Update DAX code
    updateDaxCode();
}

function showSchemaDetails(schema) {
    const container = document.getElementById('schemaDetails');

    let tablesHtml = '';
    schema.tables.forEach(table => {
        const columnsHtml = table.columns.map(col => `
            <div class="column-item">
                <code>${col.name}</code>
                <span>${col.description}</span>
            </div>
        `).join('');

        tablesHtml += `
            <div class="table-info">
                <h4>${table.name}</h4>
                <p>${table.description}</p>
                <div class="columns-grid">
                    ${columnsHtml}
                </div>
            </div>
        `;
    });

    let measuresHtml = '';
    if (schema.semantic_model && schema.semantic_model.measures) {
        measuresHtml = `
            <div class="table-info">
                <h4>Suggested Measures</h4>
                <div class="columns-grid">
                    ${schema.semantic_model.measures.map(m => `
                        <div class="column-item">
                            <code>${m.name}</code>
                            <span>${m.description}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <h3>${schema.name}</h3>
        <p>${schema.description}</p>
        ${tablesHtml}
        ${measuresHtml}
    `;
}

async function updateDaxCode() {
    if (state.selectedSchemas.length === 0) return;

    try {
        const daxParts = [];

        for (const schemaKey of state.selectedSchemas) {
            const response = await fetch('/api/generate-dax', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schema: schemaKey })
            });
            const data = await response.json();
            daxParts.push(`// ${schemaKey.toUpperCase()} MEASURES\n${data.dax}`);
        }

        document.getElementById('daxCode').textContent = daxParts.join('\n\n');
    } catch (error) {
        console.error('Failed to generate DAX:', error);
    }
}

/**
 * Load Templates
 */
async function loadTemplates() {
    try {
        const response = await fetch('/api/templates');
        const templates = await response.json();

        const container = document.getElementById('templatesGrid');
        container.innerHTML = '';

        Object.entries(templates).forEach(([key, template]) => {
            const card = document.createElement('div');
            card.className = `template-card ${key === state.selectedTemplate ? 'selected' : ''}`;
            card.dataset.template = key;
            card.innerHTML = `
                <h4>${template.name}</h4>
                <span class="complexity ${template.complexity.toLowerCase()}">${template.complexity}</span>
                <p>${template.description}</p>
                <p><strong>Use case:</strong> ${template.use_case}</p>
            `;
            card.addEventListener('click', () => selectTemplate(key));
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load templates:', error);
    }
}

function selectTemplate(templateKey) {
    state.selectedTemplate = templateKey;

    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.template === templateKey);
    });
}

/**
 * Load AI Platforms
 */
async function loadAIPlatforms() {
    try {
        const response = await fetch('/api/ai-platforms');
        const platforms = await response.json();

        const container = document.getElementById('platformComparison');
        container.innerHTML = '';

        Object.entries(platforms).forEach(([key, platform]) => {
            const prosHtml = platform.pros.map(p => `<li>${p}</li>`).join('');
            const consHtml = platform.cons.map(c => `<li>${c}</li>`).join('');

            const card = document.createElement('div');
            card.className = 'platform-card';
            card.innerHTML = `
                <h4>${platform.name}</h4>
                <p class="description">${platform.description}</p>
                <span class="integration-badge ${platform.integration_level.toLowerCase().replace('-', '')}">${platform.integration_level}</span>
                <div class="pros-cons">
                    <div class="pros">
                        <h5>Advantages</h5>
                        <ul>${prosHtml}</ul>
                    </div>
                    <div class="cons">
                        <h5>Considerations</h5>
                        <ul>${consHtml}</ul>
                    </div>
                </div>
                <p><strong>Best for:</strong> ${platform.best_for}</p>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load AI platforms:', error);
    }
}

/**
 * Load Azure OpenAI Configuration
 */
async function loadAzureOpenAIConfig() {
    try {
        const response = await fetch('/api/azure-openai-config');
        const config = await response.json();

        // Populate setup steps
        const stepsContainer = document.getElementById('aoaiSetupSteps');
        if (stepsContainer) {
            stepsContainer.innerHTML = config.setup_steps.map(step => `
                <div class="setup-step">
                    <div class="step-header">
                        <span class="step-icon">${step.step}</span>
                        <h3>${step.title}</h3>
                    </div>
                    <div class="step-body">
                        <p>${step.description}</p>
                        <div class="code-block">
                            <button class="copy-btn" onclick="copyToClipboard(this.nextElementSibling.querySelector('code'))">Copy</button>
                            <pre><code>${escapeHtml(step.code)}</code></pre>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Populate example queries
        const queriesContainer = document.getElementById('queryCategories');
        if (queriesContainer) {
            queriesContainer.innerHTML = config.example_prompts.map(category => `
                <div class="query-category">
                    <h4>${category.category}</h4>
                    <ul>
                        ${category.questions.map(q => `<li>"${q}"</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Failed to load Azure OpenAI config:', error);
    }
}

/**
 * Utility Functions
 */
function copyCode(elementId) {
    const codeElement = document.getElementById(elementId);
    navigator.clipboard.writeText(codeElement.textContent).then(() => {
        const btn = codeElement.parentElement.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
    });
}

function copyToClipboard(element) {
    navigator.clipboard.writeText(element.textContent).then(() => {
        const btn = element.parentElement.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = originalText, 2000);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function exportGuide() {
    // Simple print-based PDF export
    window.print();
}

function downloadCode() {
    // Collect all code snippets
    const codeBlocks = document.querySelectorAll('.code-block code');
    let allCode = '# ACC Semantic Layer Guide - Code Export\n\n';

    codeBlocks.forEach((block, index) => {
        allCode += `## Code Block ${index + 1}\n\`\`\`\n${block.textContent}\n\`\`\`\n\n`;
    });

    // Create download
    const blob = new Blob([allCode], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'acc-semantic-layer-code.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Export functions for global use
window.navigateToStep = navigateToStep;
window.copyCode = copyCode;
window.copyToClipboard = copyToClipboard;
window.exportGuide = exportGuide;
window.downloadCode = downloadCode;
