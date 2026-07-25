import { Metadata } from "next"
import Link from "next/link"
import { getWikiCategories } from "@/lib/wiki"
import type { WikiPage } from "@/lib/wiki"
import {
    ArrowRight,
    Book,
    Settings,
    Users,
    Wrench,
    HelpCircle,
    FolderOpen,
    MonitorIcon,
    ExternalLink,
    SparklesIcon,
    PaletteIcon,
    BotIcon
} from "lucide-react"
import { THEME_COUNT } from "@/config/themes"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Comprehensive documentation for Coco, the AI-powered Git toolbelt. Learn about installation, configuration, team collaboration, and advanced features.",
  alternates: {
    canonical: `${siteConfig.url}/docs`,
  },
  openGraph: {
    title: "Documentation | Coco",
    description:
      "Comprehensive documentation for Coco, the AI-powered Git toolbelt. Learn about installation, configuration, team collaboration, and advanced features.",
    url: `${siteConfig.url}/docs`,
    siteName: siteConfig.name,
  },
}

/* ------------------------------------------------------------------ */
/*  Icon + accent colour per category                                  */
/* ------------------------------------------------------------------ */

const categoryMeta: Record<
  string,
  { icon: React.ElementType; accent: string }
> = {
  "Getting Started": { icon: Book, accent: "text-terminal-green" },
  Configuration: { icon: Settings, accent: "text-terminal-green-bright" },
  "Terminal Workstation": { icon: MonitorIcon, accent: "text-terminal-green" },
  "Agents & MCP": { icon: BotIcon, accent: "text-terminal-green-bright" },
  "Team & Enterprise": { icon: Users, accent: "text-terminal-green-bright" },
  "Advanced Features": { icon: Wrench, accent: "text-terminal-green" },
  "Help & Support": { icon: HelpCircle, accent: "text-terminal-green-bright" },
  Uncategorized: { icon: FolderOpen, accent: "text-terminal-green" },
}

/* ------------------------------------------------------------------ */
/*  Featured page card — large, prominent                              */
/* ------------------------------------------------------------------ */

function FeaturedCard({ page }: { page: WikiPage }) {
  return (
    <Link
      href={`/docs/${page.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg border-2 border-terminal-green-dim bg-terminal-green/5 p-6 sm:p-8 transition-all duration-300 hover:border-terminal-green hover:bg-terminal-green/10 hover:shadow-[0_0_30px_-8px_hsl(154_40%_53%_/_0.2)] md:col-span-2"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-terminal-green/8 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-terminal-green" />
          <span className="font-mono text-xs uppercase tracking-wider text-terminal-green/70">
            Start here
          </span>
        </div>
        <h2 className="font-mono text-xl font-bold text-terminal-green sm:text-2xl">
          {page.title}
        </h2>
        {page.description && (
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-[hsl(var(--text-secondary))]">
            {page.description}
          </p>
        )}
      </div>
      <div className="mt-5 flex items-center gap-1.5 font-mono text-sm text-terminal-green transition-colors group-hover:text-terminal-green-bright">
        Get started
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Standard page card                                                 */
/* ------------------------------------------------------------------ */

function PageCard({
  page,
  categoryName,
}: {
  page: WikiPage
  categoryName: string
}) {
  const meta = categoryMeta[categoryName] ?? categoryMeta["Uncategorized"]!
  const Icon = meta.icon

  return (
    <Link
      href={`/docs/${page.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-[hsl(var(--bg-secondary))] p-5 sm:p-6 transition-all duration-300 hover:border-terminal-green-dim hover:bg-[hsl(var(--bg-elevated))] hover:shadow-[0_0_20px_-6px_hsl(154_40%_53%_/_0.1)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-terminal-green/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Category badge */}
      <div className="mb-3 flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-[hsl(var(--text-tertiary))]" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-tertiary))]">
          {categoryName}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-terminal-green sm:text-base">
        {page.title}
      </h3>

      {/* Description */}
      {page.description && (
        <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--text-tertiary))] sm:text-sm sm:text-[hsl(var(--text-secondary))]">
          {page.description}
        </p>
      )}

      {/* Arrow hint */}
      <div className="mt-auto pt-4">
        <ArrowRight className="h-3.5 w-3.5 text-terminal-green-dim opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const categories = getWikiCategories()

  // Pull out "Getting Started" first page for the featured card
  const gettingStarted = categories.find((c) => c.name === "Getting Started")
  const featuredPage = gettingStarted?.pages[0]

  // Build a flat list of all pages with their category, excluding the featured one
  const allCards: { page: WikiPage; category: string }[] = []
  for (const cat of categories) {
    for (const page of cat.pages) {
      if (page.slug === featuredPage?.slug) continue
      allCards.push({ page, category: cat.name })
    }
  }

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-mono font-bold tracking-tight text-foreground">
          Documentation
        </h1>
        <p className="text-xl text-[hsl(var(--text-secondary))] max-w-2xl">
          Learn how to use Coco to generate intelligent commit messages, create
          changelogs, and automate your git workflow with AI.
        </p>
      </div>

      {/* Bento grid — featured card + individual page cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Featured "Getting Started" spans 2 cols */}
        {featuredPage && <FeaturedCard page={featuredPage} />}

        {/* Remaining pages as individual cards */}
        {allCards.map(({ page, category }) => (
          <PageCard key={page.slug} page={page} categoryName={category} />
        ))}

        {/* Static: color themes reference */}
        <Link
          href="/docs/themes"
          className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-[hsl(var(--bg-secondary))] p-5 sm:p-6 transition-all duration-300 hover:border-terminal-green-dim hover:bg-[hsl(var(--bg-elevated))] hover:shadow-[0_0_20px_-6px_hsl(154_40%_53%_/_0.1)]"
        >
          <div className="mb-3 flex items-center gap-1.5">
            <PaletteIcon className="h-3 w-3 text-[hsl(var(--text-tertiary))]" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-tertiary))]">
              Appearance
            </span>
          </div>
          <h3 className="font-mono text-sm font-semibold text-foreground transition-colors group-hover:text-terminal-green sm:text-base">
            Color themes
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--text-tertiary))] sm:text-sm sm:text-[hsl(var(--text-secondary))]">
            Browse all {THEME_COUNT} built-in palettes with live previews, from Catppuccin to Gruvbox to Synthwave.
          </p>
          <div className="mt-auto pt-4">
            <ArrowRight className="h-3.5 w-3.5 text-terminal-green-dim opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </div>
        </Link>
      </div>

      {/* External links */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-lg font-mono font-semibold mb-4 text-foreground">
          Additional Resources
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            {
              label: "GitHub Repository",
              href: "https://github.com/gfargo/coco",
            },
            {
              label: "Discord Community",
              href: "https://discord.gg/KGu9nE9Ejx",
            },
            {
              label: "GitHub Discussions",
              href: "https://github.com/gfargo/coco/discussions",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-[hsl(var(--bg-elevated))] px-4 py-2 text-sm text-[hsl(var(--text-secondary))] transition-colors hover:border-terminal-green-dim hover:text-foreground"
            >
              {link.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
