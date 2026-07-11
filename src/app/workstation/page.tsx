import { Metadata } from "next"
import Link from "next/link"
import {
  BookOpenIcon,
  ChevronRightIcon,
  CodeIcon,
  MonitorIcon,
} from "lucide-react"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Section } from "@/components/Section"
import { SectionHeader } from "@/components/SectionHeader"
import { TerminalAtmosphere } from "@/components/TerminalAtmosphere"
import { CopyCommand } from "@/components/CopyCommand"
import { TrackedLink } from "@/components/TrackedLink"
import { ThemeWall } from "@/components/ThemeWall"
import { siteConfig } from "@/config/site"
import { THEME_COUNT } from "@/config/themes"
import { KeyWorkflows } from "./KeyWorkflows"
import { PowerMoves } from "./PowerMoves"
import { GifHero } from "./GifHero"
import { WorkstationShowcase } from "./WorkstationShowcase"
import { GifDemo } from "@/components/GifDemo"

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

export function generateMetadata(): Metadata {
  const title = "Workstation — Terminal Git Workstation"
  const description =
    `A keyboard-driven terminal Git workstation with 18 specialized views — including GitHub issue and PR triage, conflict resolution, bisect, recursive submodule navigation, and a full stash workflow — chord navigation, AI-powered commits, one-keystroke PR creation, full-screen changelog generation, tactile hunk-level staging, a single-pane fallback for narrow terminals (80×24 tmux-ready), and ${THEME_COUNT} customizable themes. No Electron, no mouse required.`

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/workstation`,
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1280,
          height: 640,
          alt: "Coco UI — Terminal Git Workstation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.author.twitter,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const chordKeys = [
  { key: "h", label: "History" },
  { key: "s", label: "Status" },
  { key: "d", label: "Diff" },
  { key: "c", label: "Compose" },
  { key: "b", label: "Branches" },
  { key: "t", label: "Tags" },
  { key: "z", label: "Stash" },
  { key: "w", label: "Worktrees" },
  { key: "p", label: "Pull Request" },
  { key: "P", label: "PR Triage" },
  { key: "i", label: "Issues" },
  { key: "x", label: "Conflicts" },
  { key: "r", label: "Reflog" },
  { key: "B", label: "Bisect" },
  { key: "M", label: "Submodules" },
  { key: "n", label: "Remotes" },
  { key: "L", label: "Changelog" },
]

/**
 * Feature comparison across popular Git clients. `coco` is highlighted.
 * Competitor values are a fair-faith snapshot — partial (`~`) covers
 * "possible but not first-class". Keyed by client so a row can never
 * silently drift out of sync with the column count.
 */
type Support = "yes" | "partial" | "no"

const comparisonClients = [
  { key: "coco", name: "coco ui", highlight: true },
  { key: "gitkraken", name: "GitKraken", highlight: false },
  { key: "lazygit", name: "lazygit", highlight: false },
  { key: "gitui", name: "gitui", highlight: false },
  { key: "tig", name: "tig", highlight: false },
] as const

type ClientKey = (typeof comparisonClients)[number]["key"]

const comparisonRows: Array<{ feature: string } & Record<ClientKey, Support>> = [
  { feature: "Terminal-native (no Electron)", coco: "yes", gitkraken: "no", lazygit: "yes", gitui: "yes", tig: "yes" },
  { feature: "Keyboard-first navigation", coco: "yes", gitkraken: "partial", lazygit: "yes", gitui: "yes", tig: "yes" },
  { feature: "Hunk-level staging", coco: "yes", gitkraken: "yes", lazygit: "yes", gitui: "yes", tig: "no" },
  { feature: "AI commit messages", coco: "yes", gitkraken: "partial", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "AI code review", coco: "yes", gitkraken: "no", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "AI changelog generation", coco: "yes", gitkraken: "no", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "AI commit splitting", coco: "yes", gitkraken: "no", lazygit: "partial", gitui: "no", tig: "no" },
  { feature: "Multi-provider / local AI", coco: "yes", gitkraken: "no", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "Multi-forge (GitHub + GitLab)", coco: "yes", gitkraken: "yes", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "One-keystroke PR / MR creation", coco: "yes", gitkraken: "yes", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "Issue + PR / MR triage", coco: "yes", gitkraken: "yes", lazygit: "no", gitui: "no", tig: "no" },
  { feature: "Conflict resolution helper", coco: "yes", gitkraken: "yes", lazygit: "partial", gitui: "partial", tig: "no" },
  { feature: "Bisect & reflog recovery", coco: "yes", gitkraken: "partial", lazygit: "partial", gitui: "no", tig: "partial" },
  { feature: "Global undo (reflog-powered)", coco: "yes", gitkraken: "partial", lazygit: "yes", gitui: "no", tig: "no" },
  { feature: "Multi-select / batch operations", coco: "yes", gitkraken: "partial", lazygit: "partial", gitui: "no", tig: "no" },
  { feature: "Content search (pickaxe -S / -G)", coco: "yes", gitkraken: "partial", lazygit: "no", gitui: "no", tig: "partial" },
  { feature: "Recursive submodule drill-in", coco: "yes", gitkraken: "partial", lazygit: "partial", gitui: "no", tig: "no" },
  { feature: "Theming + NO_COLOR", coco: "yes", gitkraken: "partial", lazygit: "partial", gitui: "partial", tig: "partial" },
  { feature: "Free & open source", coco: "yes", gitkraken: "no", lazygit: "yes", gitui: "yes", tig: "yes" },
]

const supportGlyph: Record<Support, string> = { yes: "✓", partial: "~", no: "✗" }

/* ------------------------------------------------------------------ */
/*  Page Component (Server Component)                                  */
/* ------------------------------------------------------------------ */

export default function WorkstationPage() {
  // Page-specific JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "coco ui — Terminal Git Workstation",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows",
    description:
      `A keyboard-driven terminal Git workstation with 18 specialized views, a full stash workflow, conflict resolution, bisect, and recursive submodule navigation, with chord navigation, AI-powered commits, one-keystroke PR creation, full-screen changelog generation, tactile hunk-level staging, a single-pane fallback for narrow terminals, and ${THEME_COUNT} customizable themes.`,
    url: `${siteConfig.url}/workstation`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    featureList: [
      "18 specialized TUI views",
      "Chord-based keyboard navigation",
      "Tactile hunk-level staging",
      "Stash workflow — aligned table, stash-from-anywhere (gZ), rename, branch, undo-drop, apply-index, quick WIP",
      "Single-pane fallback for narrow terminals (<100 cols) with momentary sidebar peek",
      "AI-powered commit drafting",
      "One-keystroke PR creation seeded from AI changelog",
      "Full-screen AI changelog view with per-branch cache",
      "Multi-commit split workflow with rescue chain",
      "Edit commit drafts in $EDITOR / $VISUAL",
      "Pull request workflows",
      "Side-by-side diff viewer",
      "Compare any two refs (branches / tags / commits)",
      "Bisect workflow with single-keystroke decisions",
      "Reflog browser with one-key drill-in to any HEAD movement",
      "Remotes surface — add / remove / set-url / prune",
      "Per-file git-blame drill-down",
      "Submodule init / update / sync",
      "Rebase the current branch onto any ref",
      "Conflict resolution helper for merge / rebase / cherry-pick / revert",
      `${THEME_COUNT} built-in theme presets`,
      "NO_COLOR support",
    ],
    softwareVersion: "latest",
    keywords:
      "terminal git client, TUI, git workstation, keyboard-driven, AI commits, git UI",
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Header />
      <main className="w-full flex-1 pb-2 overflow-hidden">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ============================================================ */}
        {/*  HERO                                                        */}
        {/* ============================================================ */}
        <Section id="workstation-hero" className="relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-20">
          <TerminalAtmosphere variant="hero" />

          <div className="container relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
              {/* Left — copy + CTA + stats */}
              <div className="flex flex-col items-start">
                <span className="font-mono text-xs tracking-widest uppercase text-terminal-green/70">
                  coco workstation
                </span>
                <h1 className="mt-2 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  Your whole Git workflow,
                  <br className="hidden sm:block" /> keyboard-first
                  <span
                    className="ml-1 inline-block h-[0.8em] w-[0.45ch] translate-y-[0.05em] bg-terminal-green animate-cursor-blink"
                    aria-hidden="true"
                  />
                </h1>
                <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                  Stop juggling a Git GUI, your terminal, and the browser. coco ui
                  puts history, diffs, staging, PRs, and issues behind muscle-memory
                  keystrokes — one fast surface, sharpened by AI.
                </p>

                <div className="mt-6">
                  <CopyCommand command="npx git-coco@latest ui" />
                </div>

                {/* Quick stats */}
                <dl className="mt-8 grid w-full max-w-md grid-cols-4 gap-3 border-t border-border/60 pt-6">
                  {[
                    { value: "16", label: "views" },
                    { value: String(THEME_COUNT), label: "themes" },
                    { value: "<100ms", label: "boot" },
                    { value: "0", label: "mouse" },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex flex-col">
                      <dt className="font-mono text-lg font-bold text-terminal-green sm:text-xl">
                        {value}
                      </dt>
                      <dd className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Right — framed, contained demo */}
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-terminal-green/5 blur-3xl"
                />
                <div className="overflow-hidden rounded-xl border border-border/40 shadow-2xl shadow-black/50 ring-1 ring-black/20">
                  {/* Minimal title bar */}
                  <div className="flex items-center gap-2 border-b border-border/30 bg-[hsl(150_20%_8%)] px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
                      workspace → repo → history
                    </span>
                  </div>
                  <GifHero />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  VIEWS GRID                                                  */}
        {/* ============================================================ */}
        <Section id="views" variant="elevated">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ ui --view"
              title="Explore every surface"
              subtitle="Sixteen specialized views, plus the cross-view actions that span them — each purpose-built for a specific Git workflow. Toggle between them and hover to preview."
            />

            <WorkstationShowcase />
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  WORKSPACE — clone / add / drive many repos                 */}
        {/* ============================================================ */}
        <Section id="workspace">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ ws"
              title="Every repo, one keystroke away"
              subtitle="coco ws scans your directory for repositories and gives you a sortable, filterable overview — dirty state, ahead/behind, open PRs. Clone a remote or add a repo by path without leaving the TUI, then press Enter to drive any of them as a full workstation."
            />

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  cmd: "c — clone",
                  tagline: "Clone a remote straight into your launch directory; the destination auto-fills from the URL.",
                  gif: "/screenshots/demo-workspace-clone.gif",
                  alt: "Workspace clone prompt — typing a remote URL auto-derives the destination path",
                },
                {
                  cmd: "a — add",
                  tagline: "Register an existing repo by path, with tab completion as you type.",
                  gif: "/screenshots/demo-workspace-add-repo.gif",
                  alt: "Workspace add-a-repo prompt with tab path completion",
                },
                {
                  cmd: "enter — drive it",
                  tagline: "Browse the multi-repo overview — dirty state, ahead/behind, open PRs — then Enter any repo to drive it as a full workstation.",
                  gif: "/screenshots/demo-tour-workspace.gif",
                  alt: "Workspace tour — browsing the multi-repo overview, then driving into a repo's history",
                },
              ].map((d) => (
                <div key={d.cmd} className="flex flex-col gap-3">
                  <div>
                    <code className="font-mono text-sm font-semibold text-terminal-green">
                      {d.cmd}
                    </code>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {d.tagline}
                    </p>
                  </div>
                  <GifDemo src={d.gif} alt={d.alt} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  KEYBOARD-FIRST — chord navigation + live filter            */}
        {/* ============================================================ */}
        <Section id="navigation">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ help navigation"
              title="Keyboard-first, mouse-free"
              subtitle="Press g then a key to jump to any view, or / to filter commits, branches, and files in real time. Muscle memory replaces mouse clicks."
            />

            {/* Reference + live demo, side by side */}
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
              {/* Left — chord key reference */}
              <div className="rounded-lg border border-border bg-[hsl(var(--code-bg))] p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <kbd className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-terminal-green/40 bg-bg-elevated font-mono text-lg text-terminal-green">
                    g
                  </kbd>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-mono text-sm text-muted-foreground">then press…</span>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {chordKeys.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-md border border-border/50 bg-bg-elevated/50 px-4 py-2.5"
                    >
                      <kbd className="inline-flex h-7 min-w-7 items-center justify-center rounded border border-border bg-bg-elevated font-mono text-xs text-terminal-green">
                        {key}
                      </kbd>
                      <span className="font-mono text-sm text-foreground/80">{label}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-6 text-xs text-muted-foreground">
                  Press{" "}
                  <kbd className="rounded border border-border bg-bg-elevated px-1 font-mono text-[10px]">
                    ?
                  </kbd>{" "}
                  anywhere for the full keymap, or{" "}
                  <kbd className="rounded border border-border bg-bg-elevated px-1 font-mono text-[10px]">
                    g?
                  </kbd>{" "}
                  for the single-key actions in your current view
                </p>
              </div>

              {/* Right — live filter demo */}
              <div className="lg:sticky lg:top-24">
                <GifDemo
                  src="/screenshots/demo-search-filter.gif"
                  alt="Live filter narrowing commits, branches, and files as you type"
                  caption="/ — filter commits, branches, and files in real time"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  KEY WORKFLOWS (client component for accordion)              */}
        {/* ============================================================ */}
        <Section id="workflows" variant="elevated">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ workflows"
              title="Key workflows"
              subtitle="Real Git operations, not just a viewer. Stage hunks, compose commits, review PRs, and rewrite history — all from the keyboard."
            />
            <KeyWorkflows />
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  POWER MOVES — compare / which-key / bulk staging            */}
        {/* ============================================================ */}
        <Section id="power-moves">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ power-moves"
              title="Power moves"
              subtitle="The high-leverage gestures that reward discovery — diff any two refs, surface every key, and stage in bulk."
            />
            <PowerMoves />
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  COMMAND-LINE DEMOS — commit / changelog / split            */}
        {/* ============================================================ */}
        <Section id="commands">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ commit · changelog · split"
              title="Sharp commands, too"
              subtitle="The workstation isn't the whole story. coco's standalone commands bring the same AI to your everyday flow — no TUI required."
            />

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  cmd: "coco commit",
                  tagline: "AI-drafted Conventional Commit messages from your staged changes.",
                  gif: "/screenshots/demo-commit-flow.gif",
                  alt: "coco commit — AI drafting a Conventional Commit message",
                },
                {
                  cmd: "coco changelog",
                  tagline: "Release notes generated from any branch, range, or tag.",
                  gif: "/screenshots/demo-changelog.gif",
                  alt: "coco changelog — generating a changelog for a branch",
                },
                {
                  cmd: "coco commit --split",
                  tagline: "Break a messy staging area into clean, AI-planned commits.",
                  gif: "/screenshots/demo-commit-split.gif",
                  alt: "coco commit --split — an AI-planned multi-commit split",
                },
              ].map((d) => (
                <div key={d.cmd} className="flex flex-col gap-3">
                  <div>
                    <code className="font-mono text-sm font-semibold text-terminal-green">
                      {d.cmd}
                    </code>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {d.tagline}
                    </p>
                  </div>
                  <GifDemo src={d.gif} alt={d.alt} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  THEMING                                                     */}
        {/* ============================================================ */}
        <Section id="theming" className="relative overflow-hidden">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ ui --theme"
              title={`${THEME_COUNT} ways to make it yours`}
              subtitle="From Catppuccin to Gruvbox to Synthwave — every preset is a complete palette, surface and all. Plus full NO_COLOR support for minimal environments."
            />
            <Link
              href="/docs/themes"
              className="group -mt-6 inline-flex items-center gap-1.5 rounded-sm font-mono text-sm text-terminal-green underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Browse all themes
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>

          {/* Full-bleed kinetic theme wall — breaks out of the container */}
          <ThemeWall className="mt-2" />

          <div className="container">
            {/* Jump to the full gallery */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/docs/themes"
                className="group inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-5 py-2.5 font-mono text-sm text-foreground transition-colors hover:border-terminal-green-dim hover:text-terminal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                See all themes side by side
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>

            {/* NO_COLOR callout */}
            <div className="mt-12 rounded-lg border border-border bg-[hsl(var(--code-bg))] px-5 py-4">
              <div className="flex items-start gap-3">
                <MonitorIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-mono text-sm text-foreground">NO_COLOR support</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Set{" "}
                    <code className="rounded bg-bg-elevated px-1.5 py-0.5 font-mono text-xs text-terminal-green">
                      NO_COLOR=1
                    </code>{" "}
                    to strip all color output. Respects the{" "}
                    <TrackedLink
                      eventName="NO_COLOR Link"
                      href="https://no-color.org"
                      target="_blank"
                      className="rounded-sm text-terminal-green underline underline-offset-2 hover:text-terminal-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      no-color.org
                    </TrackedLink>{" "}
                    convention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  MIGRATION TABLE                                             */}
        {/* ============================================================ */}
        <Section id="migration" variant="elevated">
          <div className="container">
            <SectionHeader
              prompt="~/coco $ compare"
              title="How coco stacks up"
              subtitle="Coming from another Git client? Here's what you get with coco ui."
            />

            <div className="sm:max-w-4xl sm:mx-auto overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse font-mono text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Feature
                    </th>
                    {comparisonClients.map(({ key, name, highlight }) => (
                      <th
                        key={key}
                        className={`px-3 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                          highlight
                            ? "rounded-t-md bg-terminal-green/10 text-terminal-green"
                            : "text-muted-foreground"
                        }`}
                      >
                        {name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.feature} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 text-foreground/80">{row.feature}</td>
                      {comparisonClients.map(({ key, highlight }) => {
                        const support = row[key]
                        return (
                          <td
                            key={key}
                            className={`px-3 py-3 text-center ${highlight ? "bg-terminal-green/5" : ""} ${
                              support === "yes"
                                ? highlight
                                  ? "text-terminal-green"
                                  : "text-foreground/70"
                                : support === "partial"
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/40"
                            }`}
                          >
                            {supportGlyph[support]}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-muted-foreground">
              <span><span className="text-terminal-green">✓</span> first-class</span>
              <span><span className="text-muted-foreground">~</span> partial / possible</span>
              <span><span className="text-muted-foreground/40">✗</span> not available</span>
              <span className="text-muted-foreground/50">Comparison is a fair-faith snapshot; corrections welcome.</span>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  CTA                                                         */}
        {/* ============================================================ */}
        <Section id="workstation-cta" variant="gradient">
          <TerminalAtmosphere variant="section" />

          <div className="container relative z-10 text-center">
            <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Try the workstation
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
              Install coco and launch the TUI. One command to get started.
            </p>

            <div className="mt-8 flex flex-col items-center gap-6">
              <CopyCommand command="npx git-coco@latest init" />

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1.5 rounded-sm font-mono text-sm text-terminal-green transition-colors hover:text-terminal-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <BookOpenIcon className="h-4 w-4" />
                  Read the docs
                </Link>
                <TrackedLink
                  eventName="Workstation GitHub Link"
                  href={siteConfig.links.github}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-sm font-mono text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <CodeIcon className="h-4 w-4" />
                  View on GitHub
                </TrackedLink>
              </div>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  )
}
