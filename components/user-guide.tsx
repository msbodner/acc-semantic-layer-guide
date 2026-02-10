"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, MousePointerClick, Download, Eye, FileText, Table, ChevronRight, Zap, Search } from "lucide-react"

interface UserGuideProps {
  onBack: () => void
}

export function UserGuide({ onBack }: UserGuideProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">User Guide</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Learn how to convert CSV files into Associated Information Objects (AIOs) and process them using Hyper-Semantic Logic
        </p>

        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Getting Started</h2>
          <Card className="mb-4">
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                The AIO Generator converts standard CSV (Comma-Separated Values) files into the AIO format,
                the fundamental unit of information in the Information Physics Standard Model. Each row of your
                CSV becomes a single Associated Information Object containing all column-value pairs plus
                metadata about the source file.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Step by Step */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Step-by-Step Instructions</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Your CSV File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  From the home page, click <strong>"Start Converting"</strong> to open the converter.
                  You can upload your CSV file in two ways:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Drag and drop</strong> your CSV file(s) directly onto the upload area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Click</strong> the upload area to browse and select files from your computer</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  You can upload multiple CSV files at once. Only <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">.csv</code> files are accepted.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                  <Table className="h-5 w-5 text-primary" />
                  Review CSV Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Once uploaded, the <strong>CSV Data</strong> panel displays your data in a grid table view.
                  You can:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span>Switch between files if you uploaded multiple CSVs using the file selector</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Click any row</strong> to select it and view its AIO conversion below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span>Use <strong>"Download All AIOs"</strong> to download all converted files at once</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                  <Eye className="h-5 w-5 text-primary" />
                  View AIO Output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  The <strong>AIO Output</strong> panel below the CSV grid shows the converted AIO for the
                  currently selected row. Each AIO line contains:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">[OriginalCSV.filename]</code> - The source CSV filename</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">[FileDate.YYYY-MM-DD]</code> - The date the CSV was last modified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">[FileTime.HH:MM:SS]</code> - The time the CSV was last modified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><code className="bg-secondary px-1.5 py-0.5 rounded text-xs">[ColumnName.Value]</code> - Each column-value pair from the row</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                  <Download className="h-5 w-5 text-primary" />
                  Download Your AIOs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  There are two ways to download your converted AIOs:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Download .aio</strong> (in AIO Output panel) - Downloads the currently selected row as a single <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">.aio</code> file</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Download All AIOs</strong> (in CSV Data panel) - Downloads all rows from all files as separate <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">.aio</code> files</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Files are saved to your browser's default Downloads folder. Download buttons turn
                  green on success or red on failure.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">5</span>
                  <Zap className="h-5 w-5 text-amber-600" />
                  Process AIO Files via Hyper-Semantic Logic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  After converting your CSVs, click the amber <strong>"Process AIO Files via Hyper-Semantic Logic"</strong> button 
                  in the AIO Output pane. This opens the Hyper-Semantic Logic Processor where you can explore relationships across your AIO data.
                </p>
                <p className="text-sm font-medium text-foreground mb-3">Using the Processor:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span>The left panel shows a <strong>list of all AIO files</strong> generated from your CSV data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Click any AIO file</strong> in the list to view its raw AIO text, displayed as individual clickable element chips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span>Metadata elements (<code className="bg-secondary px-1.5 py-0.5 rounded text-xs">OriginalCSV</code>, <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">FileDate</code>, <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">FileTime</code>) are highlighted in the primary color</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span><strong>Click any element</strong> to search across all AIO files - the right panel will display a table of every AIO file that contains a matching element</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                    <span>Click any matching AIO in the results table to jump to its raw view and continue exploring</span>
                  </li>
                </ul>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Hyper-Semantic Logic</strong> treats each AIO element as an application-agnostic information unit. 
                    By clicking an element, you perform a semantic match across the entire AIO set - finding all objects that share 
                    the same attribute-value pair regardless of their original source, row, or schema. This is the foundation of 
                    schema-agnostic information retrieval.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </section>

        {/* AIO Format Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">AIO Format Example</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Example Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Given a CSV file <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">employees.csv</code> with the following content:</p>
              <div className="bg-secondary rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto">
                <div className="text-foreground">Name,Department,Title</div>
                <div className="text-muted-foreground">Jane Smith,Engineering,Senior Developer</div>
                <div className="text-muted-foreground">Bob Jones,Sales,Account Manager</div>
              </div>
              <p className="text-muted-foreground mb-4">Row 1 would produce the following AIO:</p>
              <div className="bg-secondary rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <span className="text-primary">[OriginalCSV.employees.csv]</span>
                <span className="text-accent-foreground">[FileDate.2026-02-06]</span>
                <span className="text-accent-foreground">[FileTime.14:30:00]</span>
                <span className="text-foreground">[Name.Jane Smith]</span>
                <span className="text-foreground">[Department.Engineering]</span>
                <span className="text-foreground">[Title.Senior Developer]</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Tips</h2>
          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>Ensure your CSV has a header row - the first row is always treated as column names</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>Quoted fields (with commas inside) are handled correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>Newlines, tabs, and carriage returns within values are replaced with spaces in the AIO output</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span>The file date and time metadata come from the file's last modified timestamp on your computer</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
