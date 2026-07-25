"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { getWikiCategories, type WikiCategory } from "@/lib/wiki"
import {
    ChevronRight,
    Book,
    Menu,
    X,
    Settings,
    Users,
    Wrench,
    MonitorIcon,
    HelpCircle,
    FolderOpen,
    PaletteIcon,
    BotIcon,
} from "lucide-react"
import { useState } from "react"

const categoryIcons: Record<string, React.ElementType> = {
  "Getting Started": Book,
  Configuration: Settings,
  "Terminal Workstation": MonitorIcon,
  "Agents & MCP": BotIcon,
  "Team & Enterprise": Users,
  "Advanced Features": Wrench,
  "Help & Support": HelpCircle,
  Uncategorized: FolderOpen,
}

interface DocsSidebarProps {
  className?: string
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  const pathname = usePathname()
  const categories = getWikiCategories()

  return (
    <nav className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2 px-2">
        <Book className="h-5 w-5 text-terminal-green" />
        <Link
          href="/docs"
          className="font-mono font-semibold text-foreground hover:text-terminal-green transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Documentation
        </Link>
      </div>
      <div className="space-y-5">
        {categories.map((category) => (
          <SidebarCategory
            key={category.name}
            category={category}
            currentPath={pathname}
          />
        ))}

        {/* Static reference pages (not wiki-sourced) */}
        <div className="space-y-1">
          <div className="mb-1.5 flex items-center gap-2 px-2">
            <PaletteIcon className="h-3.5 w-3.5 text-[hsl(var(--text-tertiary))]" />
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[hsl(var(--text-secondary))]">
              Appearance
            </h4>
          </div>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/docs/themes"
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  pathname === "/docs/themes"
                    ? "border-l-2 border-terminal-green bg-[hsl(var(--bg-surface))] font-medium text-terminal-green"
                    : "text-muted-foreground hover:bg-[hsl(var(--bg-elevated))] hover:text-foreground"
                )}
              >
                {pathname === "/docs/themes" && <ChevronRight className="h-3 w-3 shrink-0" />}
                <span className={cn(pathname !== "/docs/themes" && "ml-5")}>Color themes</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

function SidebarCategory({
  category,
  currentPath,
}: {
  category: WikiCategory
  currentPath: string
}) {
  const Icon = categoryIcons[category.name] || FolderOpen

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-2 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-[hsl(var(--text-tertiary))]" />
        <h4 className="text-xs font-mono font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider">
          {category.name}
        </h4>
      </div>
      <ul className="space-y-0.5">
        {category.pages.map((page) => {
          const isActive = `/docs/${page.slug}` === currentPath
          return (
            <li key={page.slug}>
              <Link
                href={`/docs/${page.slug}`}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-[hsl(var(--bg-surface))] text-terminal-green font-medium border-l-2 border-terminal-green"
                    : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--bg-elevated))]"
                )}
              >
                {isActive && <ChevronRight className="h-3 w-3 shrink-0" />}
                <span className={cn(!isActive && "ml-5")}>{page.title}</span>
                {page.isAutoDiscovered && (
                  <span className="ml-auto text-[10px] font-mono text-[hsl(var(--text-tertiary))] opacity-60">
                    •
                  </span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// Mobile sidebar with toggle
export function MobileDocsSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-terminal-green text-[hsl(var(--bg-primary))] p-3 rounded-full shadow-lg hover:bg-terminal-green-bright transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Open documentation navigation"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[hsl(var(--bg-secondary))] border-r border-[hsl(var(--border-default))] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border-default))]">
              <span className="font-mono font-semibold text-foreground">
                Documentation
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[hsl(var(--bg-elevated))] rounded text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Close documentation navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <DocsSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
