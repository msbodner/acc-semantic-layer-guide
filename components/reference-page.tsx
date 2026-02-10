"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Lightbulb, Target, Layers, Shield, BarChart3, Clock, Sparkles } from "lucide-react"

interface ReferencePageProps {
  onBack: () => void
}

export function ReferencePage({ onBack }: ReferencePageProps) {
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
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            InformationPhysics.ai
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Information Physics: A New Paradigm for the A.I. Universe
          </h1>
          <p className="text-lg text-muted-foreground">
            Company Proposal and Strategy Overview - February 01, 2026
          </p>
        </div>

        {/* 1. Executive Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">1.</span> Executive Summary
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                InformationPhysics is a company built on a thesis: information engineering and analytics are
                entering a new phase where "engineering" metaphors (pipelines, schemas, ETL, data products) are
                no longer sufficient -- because we are increasingly operating in systems where meaning is
                probabilistic, emergent, and re-interpretable.
              </p>
              <p>In this new phase, it makes more sense to treat information like physics:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  Information behaves like objects in an environment (context).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  Objects undergo transformations (derivation, summarization, extraction, embedding, linking).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  We can define invariants (provenance, identity, constraints, integrity, entropy).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  We can model the "space" information occupies using topologies (graphs/hypergraphs/manifolds)
                  and algebras (composable operators over information objects).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  {'We can "measure" information with different instruments (queries, retrieval, LLM prompts, statistical estimators) without needing to have pre-decided every schema ahead of time.'}
                </li>
              </ul>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="font-medium text-foreground">
                  Mission: Replace lossy, application-specific "data extraction" with application-agnostic
                  information preservation -- so organizations stop rebuilding their architecture every time
                  someone asks a new question.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Core Thesis */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">2.</span> The Core Thesis: Data Is Constrained Information
          </h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Modern analytics stacks begin with a compression decision:</p>
              <ol className="space-y-2 ml-4 list-decimal list-inside">
                <li>We start with unconstrained information (documents, events, conversations, images, audio, transactions, logs).</li>
                <li>{'We decide what\'s "important."'}</li>
                <li>We extract that subset into tables, columns, and relationships.</li>
                <li>We declare success because SQL runs quickly.</li>
              </ol>
              <p>But this process is lossy by design:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  A schema is a projection of reality into a narrower set of features.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  The choice of tables and relationships encodes assumptions about future questions.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  {'Whatever we didn\'t anticipate gets left on the "cutting room floor."'}
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                The Shift LLMs Force Us to Confront
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {'LLMs and modern ML systems don\'t operate primarily on rigid schemas; they operate on patterns and representations learned from large corpora -- effectively a new kind of "information mathematics" that works over distributions and embedding spaces rather than only over relational rows/columns.'}
              </p>
              <p className="font-medium text-foreground">
                The consequence: the right architecture becomes one where you preserve the information first and create many views later.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 3. Why Information Physics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">3.</span> {'Why "Information Physics" Is the Right Metaphor Now'}
          </h2>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Information as Objects Following Laws
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Define information objects with durable identity and measurable properties:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Content (raw form).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Context (time, source, author, system, permissions).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Provenance and lineage (how it was produced).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Relationships (explicit links and inferred links).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Representations (text, structured fields, embeddings, summaries).</li>
              </ul>

              <p>{'Then define "laws" (constraints and invariants) such as:'}</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> <strong>Conservation of provenance:</strong> derived artifacts must retain traceability to sources.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> <strong>Reversibility where possible:</strong> extraction should be repeatable; transformations should be versioned.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> <strong>Locality/context dependence:</strong> meaning depends on neighborhood and use-case.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> <strong>Entropy and compression accounting:</strong> quantify what is lost when constraining information.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Topology and Algebra as the Missing Foundations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>InformationPhysics will build models where:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  <span>
                    <strong>Topology</strong> captures "shape": neighborhoods, clusters, boundaries, holes/gaps
                    (what you {"can't"} infer), and stable structure.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                  <span>
                    <strong>Algebra</strong> captures "behavior": composable operators like extract(), link(),
                    embed(), summarize(), validate(), reconcile(), and measure().
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 4. Strategy */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">4.</span> Strategy: Preserve First, Constrain Later
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Store information in application-agnostic form (lakehouse + object storage + versioned metadata),
                then generate constrained "data" as derived views rather than as the primary truth.
              </p>
              <div className="grid gap-3 mt-4">
                {[
                  { num: "1", title: "Unconstrained capture", desc: "Documents, events, logs, transcripts, images, contracts, tickets, emails (and their metadata)." },
                  { num: "2", title: "Universal indexing", desc: "Semantic (embeddings), lexical, structural, temporal, and entity indexes." },
                  { num: "3", title: "Lineage as a first-class invariant", desc: "Every derived field, feature, or summary points back to sources." },
                  { num: "4", title: "Schema-on-read + schema-on-demand", desc: "Structured projections are created when needed, versioned, and disposable." },
                  { num: "5", title: "LLM-native consumption", desc: 'Retrieval + reasoning + audit trails ("show your work" with citations/lineage).' },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="font-medium text-foreground">
                  {'Outcome: When new questions arise, you don\'t rebuild the world. You change the measurement you apply to the preserved information.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5. Offerings */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">5.</span> Offerings
          </h2>
          <div className="grid gap-4">
            {[
              {
                label: "A",
                title: "InformationPhysics Assessment (2-4 Weeks)",
                desc: "A paid engagement to map where information loss occurs today, which questions repeatedly trigger rebuilds, and which domains should move to \"preserve-first\" first.",
                deliverables: ["An information loss budget", "A proposed information object model", "A pilot plan with success metrics"],
              },
              {
                label: "B",
                title: "InformationPhysics Lakehouse Layer (Product)",
                desc: "A software layer providing information object registry (identity, metadata, permissions), lineage and versioning, multi-indexing (keyword/entity/vector), and governed extraction pipelines.",
                deliverables: [],
              },
              {
                label: "C",
                title: "Information Laws Toolkit (Product / Developer Offering)",
                desc: "A specification and SDK that lets teams define object types, invariants (constraints), transformation operators (algebra), and validation and audit policies.",
                deliverables: [],
              },
              {
                label: "D",
                title: "LLM-Ready Analytics Workbench",
                desc: "A governed environment where users can ask questions that combine SQL over derived tables, retrieval over preserved sources, and LLM reasoning with lineage-backed outputs.",
                deliverables: [],
              },
            ].map((offering) => (
              <Card key={offering.label}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center h-7 w-7 rounded bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {offering.label}
                    </span>
                    {offering.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  <p>{offering.desc}</p>
                  {offering.deliverables.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {offering.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1.5 shrink-0">&#8226;</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 6. Differentiation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">6.</span> Differentiation
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-2 text-muted-foreground leading-relaxed">
              <ul className="space-y-3">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Explicit stance that data is a lossy projection and should be treated as a view, not the truth.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Physics-inspired invariants (provenance conservation, transformation accounting, entropy/constraint budgeting).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Topology-first modeling of information spaces (shape + neighborhood + missingness).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Algebra of information operations (composability and repeatability).</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> LLM-native, audit-first outputs: answers that can be traced to sources.</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 9. Success Metrics */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">7.</span> Success Metrics
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-3">
                {[
                  { icon: BarChart3, label: 'Percent reduction in "rebuild events" (schema/pipeline rework triggered by new questions)' },
                  { icon: Clock, label: "Time-to-answer for novel questions" },
                  { icon: Shield, label: "Provenance coverage (percent of outputs traceable to sources)" },
                  { icon: Layers, label: "Information retention (how much of original information remains accessible and usable)" },
                  { icon: Target, label: "Cost of change (new measure/view vs. new ingestion + new schema)" },
                ].map((metric, i) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/50 rounded-lg p-3">
                    <metric.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{metric.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 10. Closing */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="text-primary font-mono text-lg">8.</span> Taking the Artificial Out of AI
          </h2>
          <Card className="border-primary/30">
            <CardContent className="pt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                {'Today\'s "AI" often feels artificial because it is forced to reason over what we happened to extract rather than over what actually existed.'}
              </p>
              <p className="font-medium text-foreground">InformationPhysics is the step change:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Preserve unconstrained information.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Model it as a space with structure.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Define laws and invariants.</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-1.5 shrink-0">&#8226;</span> Let humans and machines measure it in many ways without repeated destruction-and-rebuild cycles.</li>
              </ul>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  In other words: stop throwing information away before you even know what {"you'll"} need.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border py-6 bg-card/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <p className="text-sm text-muted-foreground text-center">
            InformationPhysics (informationphysics.ai) - AWC Technology LLC
          </p>
        </div>
      </footer>
    </div>
  )
}
