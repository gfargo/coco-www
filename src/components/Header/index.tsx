"use client"

import { GithubIcon, MenuIcon, PackageIcon, TerminalIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "../ui/tooltip"
import { TrackedLink } from "../TrackedLink"
import { siteConfig } from "@/config/site"

interface NavLink {
  href: string
  label: string
  matchHash?: boolean
}

const navLinks: NavLink[] = [
  { href: "/docs", label: "docs" },
  { href: "/#features", label: "features", matchHash: true },
  { href: "/workstation", label: "workstation" },
  { href: "/changelog", label: "changelog" },
  { href: "/#install", label: "install", matchHash: true },
]

export const Header: React.FC = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = useCallback(
    (href: string, matchHash?: boolean) => {
      if (matchHash) return false
      if (href === "/") return pathname === "/"
      return pathname.startsWith(href)
    },
    [pathname]
  )

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link
          className="flex items-center gap-2 rounded-md font-mono text-sm font-medium text-foreground transition-colors hover:text-terminal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href="/"
        >
          <TerminalIcon className="h-4 w-4 text-terminal-green" />
          <span className="hidden sm:inline">git-coco</span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, matchHash }) => (
            <Link
              key={href}
              className={`rounded-md px-3 py-1.5 font-mono text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive(href, matchHash)
                  ? "text-terminal-green"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              href={href}
            >
              {label}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-1 border-l border-border pl-3">
            <TooltipProvider delayDuration={125}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TrackedLink
                    eventName="NPM Link"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    href={siteConfig.links.npm}
                    target="_blank"
                  >
                    <PackageIcon className="h-4 w-4" />
                    <span className="sr-only">npm</span>
                  </TrackedLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>npm</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TrackedLink
                    eventName="GitHub Link"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    href={siteConfig.links.github}
                    target="_blank"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </TrackedLink>
                </TooltipTrigger>
                <TooltipContent>
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="ml-auto rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <XIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>

      {/* Mobile menu — full-screen overlay with terminal character */}
      {mobileOpen && (
        <div className="fixed inset-0 top-14 z-[60] md:hidden">
          {/* Backdrop — fully opaque dark, no content bleed-through */}
          <div
            className="absolute inset-0 bg-background"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Panel — full height, solid background */}
          <nav
            className="relative z-10 flex h-full flex-col bg-background px-6 pb-8 pt-6"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Terminal prompt decoration */}
            <span className="mb-4 font-mono text-xs text-terminal-green/50">
              ~/coco $ navigate
            </span>

            {/* Nav links — large touch targets, staggered entry */}
            <div className="flex flex-col gap-1">
              {navLinks.map(({ href, label, matchHash }, i) => (
                <Link
                  key={href}
                  className={`mobile-nav-item group flex items-center gap-3 rounded-lg px-4 py-4 font-mono text-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                    isActive(href, matchHash)
                      ? "bg-terminal-green/[0.08] text-terminal-green"
                      : "text-foreground/80 hover:bg-white/[0.04] hover:text-foreground active:scale-[0.98]"
                  }`}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {/* Green dot for active, dim chevron for inactive */}
                  {isActive(href, matchHash) ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-terminal-green" />
                  ) : (
                    <span className="font-mono text-sm text-terminal-green/30 transition-colors group-hover:text-terminal-green/60">
                      &rsaquo;
                    </span>
                  )}
                  {label}
                </Link>
              ))}
            </div>

            {/* Spacer pushes externals to bottom */}
            <div className="mt-auto" />

            {/* External links + install CTA at bottom */}
            <div className="space-y-4 border-t border-white/[0.06] pt-5">
              {/* Quick install hint */}
              <div className="rounded-lg border border-terminal-green/20 bg-terminal-green/[0.05] px-4 py-3">
                <p className="font-mono text-xs text-terminal-green/70">
                  Quick start
                </p>
                <code className="mt-1 block font-mono text-sm text-foreground/90">
                  npx git-coco@latest init
                </code>
              </div>

              {/* External links row */}
              <div className="flex items-center gap-2">
                <TrackedLink
                  eventName="NPM Link"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-terminal-green/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={siteConfig.links.npm}
                  target="_blank"
                  onClick={() => setMobileOpen(false)}
                >
                  <PackageIcon className="h-4 w-4" />
                  npm
                </TrackedLink>
                <TrackedLink
                  eventName="GitHub Link"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-terminal-green/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={siteConfig.links.github}
                  target="_blank"
                  onClick={() => setMobileOpen(false)}
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                </TrackedLink>
                <TrackedLink
                  eventName="Discord Link"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-terminal-green/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  href={siteConfig.links.discord}
                  target="_blank"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M13.55 3.17A13.2 13.2 0 0010.3 2.1a.05.05 0 00-.05.02c-.14.25-.3.58-.41.84a12.2 12.2 0 00-3.67 0 8.4 8.4 0 00-.42-.84.05.05 0 00-.05-.02 13.2 13.2 0 00-3.26 1.01.04.04 0 00-.02.02C.84 5.75.28 8.24.56 10.7a.05.05 0 00.02.04 13.3 13.3 0 004 2.02.05.05 0 00.06-.02c.31-.42.58-.86.82-1.33a.05.05 0 00-.03-.07 8.8 8.8 0 01-1.25-.6.05.05 0 01-.01-.08c.08-.06.17-.13.25-.19a.05.05 0 01.05-.01c2.62 1.2 5.46 1.2 8.05 0a.05.05 0 01.05 0c.08.07.17.13.25.2a.05.05 0 010 .07c-.4.23-.81.44-1.25.6a.05.05 0 00-.03.07c.24.47.52.91.82 1.33a.05.05 0 00.05.02 13.3 13.3 0 004.01-2.02.05.05 0 00.02-.04c.33-2.88-.56-5.35-2.35-7.54a.04.04 0 00-.02-.02zM5.35 9.22c-.65 0-1.19-.6-1.19-1.33 0-.74.53-1.33 1.2-1.33.67 0 1.2.6 1.18 1.33 0 .74-.53 1.33-1.19 1.33zm4.4 0c-.66 0-1.2-.6-1.2-1.33 0-.74.53-1.33 1.2-1.33.67 0 1.2.6 1.19 1.33 0 .74-.52 1.33-1.19 1.33z" />
                  </svg>
                  Discord
                </TrackedLink>
              </div>
            </div>
          </nav>
        </div>
      )}

      <style jsx>{`
        .mobile-nav-item {
          animation: mobile-nav-slide 0.3s ease-out both;
        }
        @keyframes mobile-nav-slide {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mobile-nav-item {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}
