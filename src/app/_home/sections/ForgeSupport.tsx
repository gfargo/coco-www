"use client"

import { Section } from "@/components/Section"
import { SectionHeader } from "@/components/SectionHeader"
import { MediaFrame } from "@/components/MediaFrame"
import {
    CheckIcon,
    GitPullRequestIcon,
    CircleDotIcon,
    LayoutDashboardIcon,
    SparklesIcon,
    type LucideIcon,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Forge + capability data                                            */
/* ------------------------------------------------------------------ */

interface Forge {
  name: string
  cli: string
  note: string
}

const forges: Forge[] = [
  {
    name: "GitHub",
    cli: "gh",
    note: "Works out of the box — nothing changes.",
  },
  {
    name: "GitHub Enterprise",
    cli: "gh",
    note: "Same gh CLI, pointed at your instance.",
  },
  {
    name: "GitLab",
    cli: "glab",
    note: "Uses glab for merge requests and issues.",
  },
  {
    name: "Bitbucket Cloud",
    cli: "API",
    note: "Uses the REST API — no extra CLI required.",
  },
  {
    name: "Bitbucket Server",
    cli: "API",
    note: "Self-hosted (Data Center). Map via forgeHosts config.",
  },
  {
    name: "Gitea / Forgejo",
    cli: "API",
    note: "Codeberg auto-detected; self-hosted via forgeHosts.",
  },
  {
    name: "Codeberg",
    cli: "API",
    note: "Auto-detected from codeberg.org remotes. Same adapter as Gitea.",
  },
]

interface Capability {
  icon: LucideIcon
  title: string
  description: string
}

const capabilities: Capability[] = [
  {
    icon: GitPullRequestIcon,
    title: "PRs & merge requests",
    description:
      "coco prs lists and filters PRs/MRs with --json for pipelines. coco pr create opens a PR/MR with an AI-generated title and body.",
  },
  {
    icon: CircleDotIcon,
    title: "Issues",
    description:
      "coco issues lists, filters, and acts on issues across supported forges — same flags, same --json output.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "Triage workstation",
    description:
      "The full coco ui workstation — PR/issue triage, inspectors, and every per-row action — dispatches through the detected forge adapter.",
  },
  {
    icon: SparklesIcon,
    title: "AI descriptions",
    description:
      "PR and MR titles and bodies are generated from your diff, so the same compose flow works wherever you push.",
  },
]

/* ------------------------------------------------------------------ */
/*  Forge detection visual                                             */
/* ------------------------------------------------------------------ */

function ForgeMatrix() {
  return (
    <div className="space-y-2">
      {forges.map((forge) => (
        <div
          key={forge.name}
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-bg-elevated/50 px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <CheckIcon className="h-4 w-4 shrink-0 text-terminal-green" />
            <div>
              <span className="font-mono text-sm text-foreground/90">
                {forge.name}
              </span>
              <p className="text-xs text-muted-foreground">{forge.note}</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center rounded border border-terminal-green-dim/40 bg-terminal-green/5 px-2 py-0.5 font-mono text-xs text-terminal-green">
            {forge.cli}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Capability card                                                    */
/* ------------------------------------------------------------------ */

function CapabilityCard({ capability }: { capability: Capability }) {
  const Icon = capability.icon
  return (
    <div className="rounded-lg border border-border bg-bg-elevated/60 p-5 transition-colors hover:border-terminal-green-dim">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-terminal-green-dim/40 bg-terminal-green/10">
          <Icon className="h-4 w-4 text-terminal-green" />
        </div>
        <h3 className="font-mono text-sm font-semibold text-foreground">
          {capability.title}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {capability.description}
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export const ForgeSupportSection = () => {
  return (
    <Section id="forges" className="scroll-mt-24">
      <div className="container">
        <SectionHeader
          prompt="~/coco $ prs"
          title="One workflow across every forge"
          subtitle="coco detects your remote and dispatches through one forge adapter — gh for GitHub and GitHub Enterprise, glab for GitLab, and the REST API for Bitbucket Cloud, Bitbucket Server, Gitea, and Codeberg. Commands and workstation actions stay consistent across all seven."
        />

        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-5 lg:grid-cols-3">
          {/* Detection panel */}
          <div className="rounded-lg border border-border bg-bg-elevated/40 p-6 lg:col-span-1">
            <h3 className="mb-1 font-mono text-sm font-semibold text-foreground">
              Forge detection
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              No flags to set. coco reads your remote and selects the
              right CLI or API.
            </p>
            <ForgeMatrix />
          </div>

          {/* Capabilities grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {capabilities.map((capability) => (
              <CapabilityCard
                key={capability.title}
                capability={capability}
              />
            ))}
          </div>
        </div>

        {/* GitLab in the workstation — real capture */}
        <div className="mx-auto mt-10 max-w-5xl">
          <div className="overflow-hidden rounded-lg border border-border/60 shadow-lg shadow-black/30 ring-1 ring-black/20">
            <div className="flex items-center gap-1.5 border-b border-border/40 bg-[hsl(150_20%_8%)] px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]/80" />
              <span className="ml-1.5 font-mono text-[9px] text-muted-foreground/50">
                coco ui — GitLab merge-request triage
              </span>
            </div>
            <MediaFrame
              kind="gif"
              src="/screenshots/gitlab-mr-triage.gif"
              alt="coco ui GitLab merge-request triage — browsing merge requests with a live inspector showing pipeline checks, approvals, and comments"
              width={1463}
              height={689}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            GitLab merge-request triage in{" "}
            <code className="font-mono text-terminal-green">coco ui</code> — draft, pipeline, and
            approval state with a live inspector. The same workflow and keys carry across all supported forges.
          </p>
        </div>
      </div>
    </Section>
  )
}
