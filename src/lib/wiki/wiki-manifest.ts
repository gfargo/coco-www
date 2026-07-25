import { discoveredPages } from "./discovered-pages"
import { mergeManifests } from "./merge-manifests"

export type WikiPage = {
  slug: string
  title: string
  wikiPath: string
  category: string
  order: number
  description?: string
  isAutoDiscovered?: boolean
}

export type WikiCategory = {
  name: string
  order: number
  pages: WikiPage[]
}

const manualManifest: WikiPage[] = [
  // Getting Started
  {
    slug: "home",
    title: "Home",
    wikiPath: "Home",
    category: "Getting Started",
    order: 1,
    description:
      "Overview of coco's commands, configuration, workstation, and advanced workflows",
  },
  {
    slug: "getting-started",
    title: "Getting Started",
    wikiPath: "Getting-Started",
    category: "Getting Started",
    order: 2,
    description: "Installation, setup, and your first AI-generated commit",
  },
  {
    slug: "command-reference",
    title: "Command Reference",
    wikiPath: "Command-Reference",
    category: "Getting Started",
    order: 3,
    description: "Complete reference for every coco command and flag",
  },

  // Configuration
  {
    slug: "configuration",
    title: "Configuration Overview",
    wikiPath: "Config-Overview",
    category: "Configuration",
    order: 1,
    description: "Complete configuration reference with all options",
  },
  {
    slug: "ignoring-files",
    title: "Ignoring Files & Extensions",
    wikiPath: "Ignoring-Files-&-Extensions",
    category: "Configuration",
    order: 2,
    description: "Advanced pattern matching and file filtering",
  },
  {
    slug: "using-ollama",
    title: "Using Ollama",
    wikiPath: "Using-Ollama",
    category: "Configuration",
    order: 3,
    description: "Local AI setup for privacy-focused workflows",
  },
  {
    slug: "using-openrouter",
    title: "Using OpenRouter",
    wikiPath: "Using-OpenRouter",
    category: "Configuration",
    order: 4,
    description: "Route AI requests through OpenRouter for model flexibility",
  },

  // Terminal Workstation
  {
    slug: "coco-ui",
    title: "Coco UI",
    wikiPath: "Coco-UI",
    category: "Terminal Workstation",
    order: 1,
    description: "Full-screen Git workstation — twelve views, chord-driven navigation, workflow keys",
  },
  {
    slug: "interactive-log-tui",
    title: "Interactive Log TUI",
    wikiPath: "Interactive-Log-TUI",
    category: "Terminal Workstation",
    order: 2,
    description: "History-focused `coco log -i` guide",
  },
  {
    slug: "tui-navigation",
    title: "TUI Navigation",
    wikiPath: "TUI-Navigation",
    category: "Terminal Workstation",
    order: 3,
    description: "Chord rules, contextual transitions, cross-view workflows (compare-refs, bisect), palette, search, breadcrumb",
  },
  {
    slug: "workspace",
    title: "Workspace",
    wikiPath: "Workspace",
    category: "Terminal Workstation",
    order: 4,
    description:
      "Scan and manage multiple repositories from one terminal workstation",
  },
  {
    slug: "issue-pr-triage",
    title: "Issue & PR Triage",
    wikiPath: "Issue-PR-Triage",
    category: "Terminal Workstation",
    order: 5,
    description:
      "Review and act on forge issues and pull requests from the CLI and workstation",
  },

  // Team & Enterprise
  {
    slug: "team-collaboration",
    title: "Team Collaboration",
    wikiPath: "Team-Collaboration",
    category: "Team & Enterprise",
    order: 1,
    description: "Shared configurations and enterprise deployment",
  },
  {
    slug: "multi-forge-support",
    title: "Multi-Forge Support",
    wikiPath: "Multi-Forge-Support",
    category: "Team & Enterprise",
    order: 2,
    description:
      "Use consistent pull-request and issue workflows across supported Git forges",
  },

  // Advanced Features
  {
    slug: "advanced-usage",
    title: "Advanced Usage",
    wikiPath: "Advanced-Usage",
    category: "Advanced Features",
    order: 1,
    description: "Custom prompts, automation, and optimization",
  },
  {
    slug: "commit-split",
    title: "Commit Split",
    wikiPath: "Commit-Split",
    category: "Advanced Features",
    order: 2,
    description: "Plan smaller commits from broad staged changes",
  },
  {
    slug: "dynamic-model-routing",
    title: "Dynamic Model Routing",
    wikiPath: "Dynamic-Model-Routing",
    category: "Advanced Features",
    order: 3,
    description: "Route tasks to different AI models",
  },
  {
    slug: "agent-cli-and-mcp",
    title: "Agent CLI and MCP",
    wikiPath: "Agent-CLI-and-MCP",
    category: "Advanced Features",
    order: 4,
    description: "Structured CLI and MCP interfaces for coding agents and automation",
  },
  {
    slug: "testing-scenarios",
    title: "Testing Scenarios",
    wikiPath: "Testing-Scenarios",
    category: "Advanced Features",
    order: 5,
    description: "Create deterministic Git repositories for testing complex workflows",
  },
  {
    slug: "documentation-workflow",
    title: "Documentation Workflow",
    wikiPath: "Documentation-Workflow",
    category: "Advanced Features",
    order: 6,
    description: "Maintain wiki documentation locally",
  },

  // Help & Support
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    wikiPath: "Troubleshooting",
    category: "Help & Support",
    order: 1,
    description: "Common issues, solutions, and debugging",
  },
]

export const wikiManifest: WikiPage[] = mergeManifests(
  manualManifest,
  discoveredPages
)

// Category ordering for sidebar
export const categoryOrder: Record<string, number> = {
  "Getting Started": 1,
  Configuration: 2,
  "Terminal Workstation": 3,
  "Team & Enterprise": 4,
  "Advanced Features": 5,
  "Help & Support": 6,
  Uncategorized: 99,
}

// Get pages grouped by category
export function getWikiCategories(): WikiCategory[] {
  const categoryMap = new Map<string, WikiPage[]>()

  for (const page of wikiManifest) {
    const existing = categoryMap.get(page.category) || []
    existing.push(page)
    categoryMap.set(page.category, existing)
  }

  const categories: WikiCategory[] = []

  for (const [name, pages] of categoryMap) {
    categories.push({
      name,
      order: categoryOrder[name] || 99,
      pages: pages.sort((a, b) => a.order - b.order),
    })
  }

  return categories.sort((a, b) => a.order - b.order)
}

// Get a page by slug
export function getWikiPage(slug: string): WikiPage | undefined {
  return wikiManifest.find((page) => page.slug === slug)
}

// Get all slugs for static generation
export function getAllWikiSlugs(): string[] {
  return wikiManifest.map((page) => page.slug)
}

// Get next and previous pages for navigation
export function getAdjacentPages(slug: string): {
  prev: WikiPage | null
  next: WikiPage | null
} {
  const index = wikiManifest.findIndex((page) => page.slug === slug)

  return {
    prev: index > 0 ? wikiManifest[index - 1] ?? null : null,
    next:
      index < wikiManifest.length - 1 ? wikiManifest[index + 1] ?? null : null,
  }
}
