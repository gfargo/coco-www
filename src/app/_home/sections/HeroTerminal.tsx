"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { MediaFrame } from "@/components/MediaFrame"

/* ------------------------------------------------------------------ */
/*  Showcase scenes — mapped to the hero-* GIF recipes.                */
/*                                                                     */
/*  All hero GIFs are captured at 130×32 (1276×590 px) for visual      */
/*  consistency. Regenerate with:                                      */
/*  npm run screenshot:sync hero-commit hero-split hero-ui             */
/*                           hero-changelog hero-workspace             */
/* ------------------------------------------------------------------ */

interface Scene {
  /** Tab label */
  label: string
  /** The actual recorded GIF path under /public/screenshots/ */
  src: string
  /** Whether it's a gif or a still image */
  kind: "gif" | "image"
  /** Alt text for accessibility */
  alt: string
  /** Intrinsic dimensions for aspect-ratio (hero set = 130×32 chars ≈ 1170×608 px) */
  width: number
  height: number
}

const SCENES: Scene[] = [
  {
    label: "ui",
    src: "/screenshots/hero-ui.gif",
    kind: "gif",
    alt: "coco ui — browsing history, opening diffs, and chord-switching views",
    width: 1276,
    height: 590,
  },
  {
    label: "commit",
    src: "/screenshots/hero-commit.gif",
    kind: "gif",
    alt: "coco commit — AI drafts a conventional commit message from staged changes",
    width: 1276,
    height: 590,
  },
  {
    label: "workspace",
    src: "/screenshots/hero-workspace.gif",
    kind: "gif",
    alt: "coco workspace — multi-repo browser, selecting a repo and opening its TUI",
    width: 1276,
    height: 590,
  },
  {
    label: "split",
    src: "/screenshots/hero-split.gif",
    kind: "gif",
    alt: "coco commit --split — decomposing a large staging area into logical atomic commits",
    width: 1276,
    height: 590,
  },
  {
    label: "changelog",
    src: "/screenshots/hero-changelog.gif",
    kind: "gif",
    alt: "coco changelog — generating release notes from branch history",
    width: 1276,
    height: 590,
  },
]

/* Timing — how long each GIF stays before cycling to the next. */
const DWELL_MS = 9000

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

/**
 * Hero GIF showcase — rotates through real recorded demos. Clickable
 * scene tabs let visitors jump to any command. Crossfades between scenes.
 */
export function HeroShowcase() {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const jumpTo = useCallback(
    (i: number) => {
      if (i === active) return
      clearTimer()
      setFading(true)
      setTimeout(() => {
        setActive(i)
        setFading(false)
      }, 250)
    },
    [active, clearTimer]
  )

  // Auto-advance (paused when reduced motion).
  useEffect(() => {
    if (reduced) return
    clearTimer()
    timer.current = setTimeout(() => {
      jumpTo((active + 1) % SCENES.length)
    }, DWELL_MS)
    return clearTimer
  }, [active, reduced, clearTimer, jumpTo])

  const scene = SCENES[active]!

  return (
    <div className="flex flex-col gap-3">
      {/* GIF display — terminal chrome wrapping real footage */}
      <div className="hero-showcase-float relative [perspective:1800px]">
        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,hsl(154_55%_40%_/_0.22),transparent_65%)] blur-3xl"
        />

        <div className="hero-showcase-tilt overflow-hidden rounded-xl border border-terminal-green/20 bg-[hsl(150_24%_6%)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-black/30">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] bg-black/40 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[11px] text-terminal-green/70">
              $ coco {scene.label}
            </span>
            <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
              ~/project
            </span>
          </div>

          {/* GIF — all hero GIFs are 1276×590, fill the container */}
          <div
            className={cn(
              "relative bg-[hsl(150_20%_5%)] transition-opacity duration-250",
              fading ? "opacity-0" : "opacity-100"
            )}
            style={{ aspectRatio: "1276 / 590" }}
          >
            <MediaFrame
              kind={scene.kind}
              src={scene.src}
              alt={scene.alt}
              width={scene.width}
              height={scene.height}
              objectFit="cover"
              priority={active === 0}
              className="h-full w-full"
            />
          </div>

          {/* Faint scanlines for terminal depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.5)_2px,rgba(255,255,255,0.5)_3px)]"
          />
        </div>
      </div>

      {/* Scene tabs + link */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {SCENES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => jumpTo(i)}
            aria-label={`Show coco ${s.label}`}
            aria-current={i === active ? "true" : undefined}
            className={cn(
              "rounded-md border px-2.5 py-1.5 font-mono text-xs transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(150_24%_6%)]",
              i === active
                ? "border-terminal-green/40 bg-terminal-green/[0.1] text-terminal-green"
                : "border-white/[0.06] bg-white/[0.02] text-muted-foreground/60 hover:border-terminal-green/25 hover:text-muted-foreground"
            )}
          >
            {s.label}
          </button>
        ))}

        <Link
          href="/workstation"
          className="group ml-auto inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-mono text-xs text-terminal-green/70 transition-colors hover:text-terminal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-green/50 focus-visible:ring-offset-2"
        >
          see workstation
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <style jsx>{`
        .hero-showcase-float {
          animation: hero-float 8s ease-in-out infinite;
          will-change: transform;
        }
        .hero-showcase-tilt {
          transform: rotateY(-6deg) rotateX(2deg);
          transform-style: preserve-3d;
        }
        @keyframes hero-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-showcase-float {
            animation: none;
          }
          .hero-showcase-tilt {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
