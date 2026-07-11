"use client"

import {
  CommandIcon,
  GitCompareIcon,
  ListChecksIcon,
  SearchCodeIcon,
  type LucideIcon,
} from "lucide-react"

import { Lightbox } from "@/components/Lightbox"
import { MediaFrame } from "@/components/MediaFrame"

interface PowerMove {
  icon: LucideIcon
  title: string
  description: string
  keys: string[]
  src: string
}

const MOVES: PowerMove[] = [
  {
    icon: GitCompareIcon,
    title: "Compare any two refs",
    description:
      "Mark a branch, tag, or commit with m, then Enter on another to read the full base..head diff — without leaving the workstation or remembering git diff syntax.",
    keys: ["m", "↵"],
    src: "/screenshots/view-compare.png",
  },
  {
    icon: CommandIcon,
    title: "Discover every key",
    description:
      "Press g for a live which-key menu of every view jump, or g? for the single-key actions in the view you're in. The density that makes it fast never leaves you stuck — there's no cheat sheet to memorize.",
    keys: ["g", "g?"],
    src: "/screenshots/which-key.png",
  },
  {
    icon: ListChecksIcon,
    title: "Stage in bulk",
    description:
      "Stage everything with A, or type a git pathspec with + — a path, a directory, or a glob like src/*.ts — to stage exactly the set you mean. Globs go straight to git, no shell.",
    keys: ["A", "+"],
    src: "/screenshots/stage-pathspec.png",
  },
  {
    icon: SearchCodeIcon,
    title: "Search by what changed, not just when",
    description:
      "Filter history by diff content, not just message or author: /S:token finds commits that added or removed a string (git log -S), /G:regex finds commits whose patch matches a pattern (git log -G). Same live-filter UX as path:/author:.",
    keys: ["/", "S:"],
    src: "/screenshots/demo-pickaxe-search.png",
  },
]

function Frame({ title, src }: { title: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50 shadow-2xl shadow-black/40 ring-1 ring-black/20">
      <div className="flex items-center gap-2 border-b border-border/30 bg-[hsl(150_20%_8%)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        <span className="ml-3 font-mono text-[10px] text-muted-foreground/40">
          coco ui
        </span>
      </div>
      <Lightbox src={src} alt={title}>
        <MediaFrame
          src={src}
          alt={title}
          width={1369}
          height={722}
          objectPosition="top"
          sizes="(max-width: 1024px) 100vw, 400px"
        />
      </Lightbox>
    </div>
  )
}

/**
 * Power moves — the smaller, high-leverage workstation gestures that
 * don't warrant a full numbered Key Workflows row but reward discovery:
 * cross-ref compare, the which-key chord menu, bulk staging, and
 * content-based history search.
 */
export function PowerMoves() {
  return (
    <div className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {MOVES.map((move) => {
        const Icon = move.icon
        return (
          <div key={move.title} className="flex flex-col">
            <Frame title={move.title} src={move.src} />
            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-terminal-green" />
                <h3 className="font-mono text-base font-semibold text-foreground">
                  {move.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {move.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {move.keys.map((k, ki) => (
                  <span key={ki} className="flex items-center gap-1.5">
                    {ki > 0 && <span className="text-muted-foreground/40">then</span>}
                    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-bg-elevated px-1.5 font-mono text-xs text-terminal-green">
                      {k}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
