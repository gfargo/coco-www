"use client"

import { CheckIcon } from "lucide-react"

import { CopyCommand } from "@/components/CopyCommand"

import { HeroShowcase } from "./HeroTerminal"

/* Git platform icons — inline SVGs sized to match the badge text. */
function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function GitLabMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 14.5L10.69 6.47H5.31L8 14.5z" />
      <path d="M8 14.5L5.31 6.47H1.44L8 14.5z" opacity="0.7" />
      <path d="M1.44 6.47L0.56 9.18c-0.08 0.25 0.01 0.52 0.22 0.67L8 14.5 1.44 6.47z" opacity="0.5" />
      <path d="M1.44 6.47H5.31L3.67 1.42c-0.09-0.27-0.47-0.27-0.56 0L1.44 6.47z" />
      <path d="M8 14.5L10.69 6.47H14.56L8 14.5z" opacity="0.7" />
      <path d="M14.56 6.47L15.44 9.18c0.08 0.25-0.01 0.52-0.22 0.67L8 14.5 14.56 6.47z" opacity="0.5" />
      <path d="M14.56 6.47H10.69L12.33 1.42c0.09-0.27 0.47-0.27 0.56 0L14.56 6.47z" />
    </svg>
  )
}

function BitbucketMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M0.78 1.02C0.35 1.02-0.01 1.42 0.04 1.85L2.18 14.26c0.07 0.42 0.43 0.73 0.85 0.73h10.12c0.32 0 0.59-0.23 0.64-0.54L16 1.85c0.05-0.43-0.31-0.83-0.74-0.83H0.78zM9.69 10.34H6.35L5.49 5.76h4.88L9.69 10.34z" />
    </svg>
  )
}

const platforms = [
  { name: "GitHub", icon: GitHubMark },
  { name: "GitLab", icon: GitLabMark },
  { name: "Bitbucket", icon: BitbucketMark },
]

export const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-[hsl(150_26%_6%)] pb-16 pt-20 text-foreground md:pb-20 md:pt-24 lg:pb-24 lg:pt-28"
    >
      {/* Atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[10%] -top-[15%] h-[70%] w-[60%] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(154_55%_40%_/_0.25),transparent_65%)] blur-3xl" />
        <div className="absolute -left-[5%] top-[30%] h-[50%] w-[40%] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(154_45%_30%_/_0.14),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(hsl(154_40%_53%_/_0.1)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_2px,rgba(255,255,255,0.5)_3px)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1300px] px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* Left — headline, sub, CTAs */}
          <div className="flex flex-col items-start gap-6">
            {/* Platform badges with checkmarks */}
            <div className="flex items-center gap-3">
              {platforms.map(({ name, icon: Icon }) => (
                <div
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{name}</span>
                  <CheckIcon className="h-3 w-3 text-terminal-green" />
                </div>
              ))}
            </div>

            {/* Headline */}
            <h1 className="font-mono text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] xl:text-5xl">
              The AI git toolbelt{" "}
              <span className="bg-gradient-to-r from-terminal-green-bright via-terminal-green to-terminal-green-dim bg-clip-text text-transparent">
                &amp; terminal workstation.
              </span>
              <span
                className="ml-1 inline-block h-[0.8em] w-[0.5ch] translate-y-[0.08em] bg-terminal-green animate-cursor-blink"
                aria-hidden="true"
              />
            </h1>

            {/* Sub — concise, no jargon */}
            <p className="max-w-md text-[15px] leading-7 text-muted-foreground">
              Commits, changelogs, reviews, PRs, and a 16-view keyboard
              workstation — one binary. Seven AI providers including
              fully local Ollama. Works on every major platform.
            </p>

            {/* Install CTA */}
            <CopyCommand command="npx git-coco@latest init" />
          </div>

          {/* Right — GIF showcase */}
          <div className="-order-1 w-full lg:order-1">
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  )
}
