import Link from "next/link"
import {
    ArrowRight,
    KeyboardIcon,
    LayoutGridIcon,
    LayersIcon,
    RectangleHorizontalIcon,
    SparklesIcon,
    GitPullRequestIcon,
} from "lucide-react"

import { MediaFrame } from "@/components/MediaFrame"
import { Section } from "@/components/Section"
import { SectionHeader } from "@/components/SectionHeader"
import { TerminalAtmosphere } from "@/components/TerminalAtmosphere"

/* ------------------------------------------------------------------ */
/*  Feature bullets                                                    */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: KeyboardIcon,
    title: "Keyboard-driven navigation",
    description:
      "g + key chord navigation across all views — no mouse required.",
  },
  {
    icon: LayoutGridIcon,
    title: "16 specialized views",
    description:
      "History, status, diff, compose, branches, tags, stash, worktrees, pull-request, PR triage, issues, conflicts, reflog, bisect, submodules, and changelog. Drill into any submodule with Enter — every view re-scopes to it.",
  },
  {
    icon: LayersIcon,
    title: "Tactile hunk staging",
    description:
      "Stage hunk by hunk with ● / ○ badges and ↑/↓ navigation — precise control over every commit, never the whole file by accident.",
  },
  {
    icon: SparklesIcon,
    title: "AI-assisted commits",
    description:
      "Draft commit messages with AI right from the compose view.",
  },
  {
    icon: GitPullRequestIcon,
    title: "PR workflows",
    description:
      "Merge, approve, and comment on pull requests without leaving the terminal.",
  },
  {
    icon: RectangleHorizontalIcon,
    title: "Fits any terminal",
    description:
      "Down to an 80×24 tmux split, the panes fold to a single full-width view you Tab between — press v to peek the sidebar and snap back.",
  },
]

/* ------------------------------------------------------------------ */
/*  WorkstationTeaser section                                          */
/* ------------------------------------------------------------------ */

export function WorkstationTeaser() {
  return (
    <Section id="workstation-teaser" className="relative scroll-mt-24 overflow-hidden">
      <TerminalAtmosphere variant="section" />

      <div className="container relative z-10">
        <SectionHeader
          prompt="~/coco $ ui"
          title="One surface for everything"
          subtitle="A keyboard-driven Git workstation that lives in your terminal. All your tools, all your views, one screen."
        />

        {/* Asymmetric 60/40 layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-14">
          {/* Left — animated GIF demo, chrome-less and glowing.
              Deliberately *not* wrapped in the macOS title-bar frame used
              elsewhere — the screen bleeds straight into the page with a
              terminal-green halo so it reads as live, not a framed picture. */}
          <div className="group relative self-center">
            {/* Green halo bleeding from the screen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-10 rounded-2xl bg-terminal-green/10 opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="overflow-hidden rounded-lg ring-1 ring-terminal-green/20 shadow-2xl shadow-black/40 leading-[0]">
              <MediaFrame
                kind="gif"
                src="/screenshots/demo-ui-view-switching.gif"
                alt="coco ui — switching between history, status, branches, and diff views via chord navigation"
                width={1463}
                height={689}
              />
            </div>
            {/* LIVE chip — small, kinetic, signals motion */}
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terminal-green" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                chord nav
              </span>
            </div>
          </div>

          {/* Right — feature bullets */}
          <div className="flex flex-col justify-center gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-elevated">
                  <Icon className="h-4 w-4 text-terminal-green" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA link */}
            <Link
              href="/workstation"
              className="group mt-2 inline-flex items-center gap-1.5 rounded-sm font-mono text-sm text-terminal-green transition-colors hover:text-terminal-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See the full workstation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}
