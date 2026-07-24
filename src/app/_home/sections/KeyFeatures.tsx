"use client"

import { MediaFrame } from "@/components/MediaFrame"
import { Section } from "@/components/Section"
import { SectionHeader } from "@/components/SectionHeader"
import { TerminalAtmosphere } from "@/components/TerminalAtmosphere"
import { cn } from "@/lib/utils"
import {
    BotIcon,
    GitForkIcon,
    MonitorIcon,
    RouteIcon,
    ServerIcon,
    ShieldCheckIcon,
    SparklesIcon,
    ZapIcon
} from "lucide-react"
import { type LucideIcon } from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Feature data                                                       */
/* ------------------------------------------------------------------ */

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  /** Grid span hint — "wide" takes 2 cols on lg, "tall" takes 2 rows */
  layout: "default" | "wide" | "tall"
  /** Small terminal-style visual element rendered inside the card */
  visual: () => React.ReactNode
}

const features: Feature[] = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Git Commands",
    description:
      "Each command solves a specific problem: intelligent commits, automated changelogs, code recaps for standups, AI code reviews, and commit splitting for clean history.",
    layout: "wide",
    visual: () => <CommandsVisual />,
  },
  {
    icon: BotIcon,
    title: "Agent CLI & Local MCP",
    description:
      "Use commit drafting, review, changelog, and recap as strict protocol-v1 JSON operations or four discoverable MCP tools — root-bound, generation-only, and never a generic shell.",
    layout: "default",
    visual: () => <AgentToolsVisual />,
  },
  {
    icon: MonitorIcon,
    title: "Terminal Workstation",
    description:
      "A keyboard-driven Git workstation with 16 views — including a full stash workflow, tactile hunk staging, conflict resolution, reflog recovery, bisect, and recursive submodule drill-in — that works at any terminal width and brings every tool together in one surface.",
    layout: "tall",
    visual: () => <WorkstationVisual />,
  },
  {
    icon: RouteIcon,
    title: "Dynamic Model Routing",
    description:
      "Task-aware model selection picks the right model for each job. Fast models for commits, thorough models for reviews.",
    layout: "default",
    visual: () => <RoutingVisual />,
  },
  {
    icon: ServerIcon,
    title: "Multi-Provider AI",
    description:
      "Seven providers: OpenAI, Anthropic, Gemini, Mistral, Azure OpenAI, AWS Bedrock, and Ollama. Run fully local for complete privacy and zero API costs. coco itself collects no telemetry, and any usage stats it keeps stay local on your machine.",
    layout: "default",
    visual: () => <ProvidersVisual />,
  },
  {
    icon: GitForkIcon,
    title: "Multi-forge (GitHub + GitLab)",
    description:
      "PRs, issues, and the triage workstation work across GitHub, GitHub Enterprise, and GitLab. coco detects your forge and drives gh or glab — same commands, same TUI.",
    layout: "default",
    visual: () => <ForgesVisual />,
  },
  {
    icon: ShieldCheckIcon,
    title: "Conventional Commits & Commitlint",
    description:
      "First-class support for Conventional Commits with automatic commitlint validation and intelligent retry logic.",
    layout: "default",
    visual: () => <CommitlintVisual />,
  },
  {
    icon: ZapIcon,
    title: "Instant Boot & Disk Cache",
    description:
      "The workstation paints in under 100ms. A per-repo disk cache serves history from the first frame.",
    layout: "default",
    visual: () => <PerformanceVisual />,
  },
]

/* ------------------------------------------------------------------ */
/*  Mini terminal visuals — one per feature                            */
/* ------------------------------------------------------------------ */

function CommandsVisual() {
  const cmds = [
    { name: "commit", color: "text-terminal-green" },
    { name: "changelog", color: "text-terminal-green-bright" },
    { name: "recap", color: "text-terminal-green" },
    { name: "review", color: "text-terminal-green-bright" },
    { name: "split", color: "text-terminal-green" },
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {cmds.map((cmd) => (
        <span
          key={cmd.name}
          className={cn(
            "inline-flex items-center rounded-md border border-terminal-green-dim/40 bg-terminal-green/5 px-2.5 py-1 font-mono text-xs",
            cmd.color
          )}
        >
          <span className="mr-1.5 text-muted-foreground">$</span>
          {cmd.name}
        </span>
      ))}
    </div>
  )
}

function AgentToolsVisual() {
  return (
    <div className="space-y-1.5 font-mono text-[10px] sm:text-[11px]">
      <div className="flex items-center justify-between rounded border border-border bg-background/50 px-2.5 py-1.5">
        <span className="text-foreground/80">agent --input request.json</span>
        <span className="text-terminal-green">v1</span>
      </div>
      <div className="flex items-center justify-between rounded border border-border bg-background/50 px-2.5 py-1.5">
        <span className="text-foreground/80">mcp --repo .</span>
        <span className="text-terminal-green-bright">4 tools</span>
      </div>
      <div className="flex items-center gap-1.5 pt-1 text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-green" />
        schemas · roots · cancellation
      </div>
    </div>
  )
}

function WorkstationVisual() {
  // A real capture of the workstation history view — far truer than a
  // grid of view-name chips. Regenerated by the VHS screenshot pipeline.
  return (
    <div className="overflow-hidden rounded-md border border-border/60 shadow-lg shadow-black/30 ring-1 ring-black/20">
      <div className="flex items-center gap-1.5 border-b border-border/40 bg-[hsl(150_20%_8%)] px-2.5 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-1.5 font-mono text-[9px] text-muted-foreground/50">
          coco ui
        </span>
      </div>
      <MediaFrame
        src="/screenshots/view-history.png"
        alt="coco workstation — history view with commit graph and inspector"
        width={1369}
        height={722}
        objectPosition="top"
        sizes="(max-width: 1024px) 100vw, 380px"
      />
    </div>
  )
}

function RoutingVisual() {
  const routes = [
    { task: "commit", model: "fast", width: "w-1/3" },
    { task: "review", model: "deep", width: "w-4/5" },
    { task: "changelog", model: "deep", width: "w-3/5" },
  ]
  return (
    <div className="space-y-2">
      {routes.map((r) => (
        <div key={r.task} className="flex items-center gap-2 font-mono text-[11px]">
          <span className="w-16 shrink-0 text-muted-foreground">{r.task}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
            <div
              className={cn(
                "h-full rounded-full",
                r.model === "fast"
                  ? "bg-terminal-green"
                  : "bg-terminal-green-dim",
                r.width
              )}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-terminal-green-dim text-[10px]">
            {r.model}
          </span>
        </div>
      ))}
    </div>
  )
}

function ProvidersVisual() {
  const providers = [
    { name: "OpenAI", status: "connected" },
    { name: "Anthropic", status: "connected" },
    { name: "Gemini", status: "connected" },
    { name: "Mistral", status: "connected" },
    { name: "Azure OpenAI", status: "connected" },
    { name: "AWS Bedrock", status: "connected" },
    { name: "Ollama", status: "local" },
  ]
  return (
    <div className="space-y-1.5">
      {providers.map((p) => (
        <div
          key={p.name}
          className="flex items-center justify-between rounded border border-border bg-bg-elevated/50 px-2.5 py-1.5 font-mono text-[11px]"
        >
          <span className="text-foreground/80">{p.name}</span>
          <span
            className={cn(
              "flex items-center gap-1.5",
              p.status === "local"
                ? "text-terminal-green-bright"
                : "text-terminal-green-dim"
            )}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {p.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function ForgesVisual() {
  const forges = [
    { name: "GitHub", cli: "gh" },
    { name: "GitHub Enterprise", cli: "gh" },
    { name: "GitLab", cli: "glab" },
  ]
  return (
    <div className="space-y-1.5">
      {forges.map((f) => (
        <div
          key={f.name}
          className="flex items-center justify-between rounded border border-border bg-bg-elevated/50 px-2.5 py-1.5 font-mono text-[11px]"
        >
          <span className="text-foreground/80">{f.name}</span>
          <span className="flex items-center gap-1.5 text-terminal-green-dim">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {f.cli}
          </span>
        </div>
      ))}
    </div>
  )
}

function CommitlintVisual() {
  return (
    <div className="space-y-1 font-mono text-[11px]">
      <div className="text-muted-foreground">
        <span className="text-terminal-green">✓</span> type-enum
      </div>
      <div className="text-muted-foreground">
        <span className="text-terminal-green">✓</span> scope-case
      </div>
      <div className="text-muted-foreground">
        <span className="text-terminal-green">✓</span> subject-max-length
      </div>
      <div className="text-muted-foreground">
        <span className="text-terminal-green-bright">⟳</span>{" "}
        <span className="text-foreground/70">auto-retry on failure</span>
      </div>
    </div>
  )
}

function PerformanceVisual() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-end gap-1">
        {[12, 28, 8, 42, 18, 32, 6, 22, 14, 38, 10, 26].map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-sm bg-terminal-green/30"
            style={{ height: `${h}px` }}
          />
        ))}
        <div className="ml-1 font-mono text-[10px] text-terminal-green self-end">
          &lt;100ms
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-green" />
        cached
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-green/30" />
        cold
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature card                                                       */
/* ------------------------------------------------------------------ */

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-bg-elevated/60 p-6 sm:p-8 transition-all duration-300",
        "hover:border-terminal-green-dim hover:bg-bg-elevated/80",
        "hover:shadow-[0_0_24px_-6px_hsl(154_40%_53%_/_0.15)]",
        feature.layout === "wide" && "lg:col-span-2",
        feature.layout === "tall" && "lg:row-span-2"
      )}
    >
      {/* Subtle corner glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-terminal-green/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Icon + title row */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-terminal-green-dim/40 bg-terminal-green/10 transition-colors group-hover:border-terminal-green-dim group-hover:bg-terminal-green/15">
          <Icon className="h-5 w-5 text-terminal-green" />
        </div>
        <h3 className="font-mono text-base font-semibold text-foreground sm:text-lg">
          {feature.title}
        </h3>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>

      {/* Visual element — pushed to bottom */}
      <div className="mt-auto">
        <feature.visual />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const KeyFeaturesSection = () => {
  return (
    <Section id="features" className="relative overflow-hidden">
      <TerminalAtmosphere variant="section" />

      <div className="container relative z-10">
        <SectionHeader
          title="Key Features"
          subtitle="Powerful capabilities that adapt to your workflow and coding standards"
          prompt="~/coco $ features"
        />

        {/* Bento grid — 3 cols on lg, varied spans */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </Section>
  )
}
