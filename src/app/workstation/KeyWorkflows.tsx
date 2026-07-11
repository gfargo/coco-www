"use client"

import { MediaFrame } from "@/components/MediaFrame"
import {
  ArchiveIcon,
  CheckSquareIcon,
  GitBranchIcon,
  GitCommitIcon,
  GitMergeIcon,
  GitPullRequestIcon,
  KeyboardIcon,
  LayoutGridIcon,
  RectangleHorizontalIcon,
  RotateCcwIcon,
  SearchIcon,
  SplitIcon,
  type LucideIcon,
} from "lucide-react"

import { Lightbox } from "@/components/Lightbox"
import { cn } from "@/lib/utils"

interface WorkflowRow {
  icon: LucideIcon
  title: string
  description: string
  keys: string[]
  media: { src: string; animated?: boolean; width?: number; height?: number }
}

const WORKFLOWS: WorkflowRow[] = [
  {
    icon: LayoutGridIcon,
    title: "Tactile hunk staging",
    description:
      "Open a changed file and stage it hunk by hunk. Each hunk carries a ● staged / ○ unstaged badge, the selected hunk is highlighted with an accent bar, and ↑/↓ walk between them — so you stage exactly what you mean, never the whole file by accident.",
    keys: ["↵", "↑/↓", "Space"],
    media: { src: "/screenshots/demo-staging-hunks.gif", animated: true },
  },
  {
    icon: KeyboardIcon,
    title: "Never memorize a key",
    description:
      "Press g? in any view for a live strip of its single-key actions — cherry-pick, revert, mark-compare, stage — sourced from that view's bindings, so the list changes as you move between views. It's the per-view sibling of the g-chord which-key menu: the same letter can mean different things in different views, and g? always tells you which.",
    keys: ["g", "?"],
    media: { src: "/screenshots/demo-view-keys.gif", animated: true },
  },
  {
    icon: ArchiveIcon,
    title: "Stash like a pro",
    description:
      "Stash from any view with gZ — even mid-diff — then manage stashes that actually read: every entry shows its origin branch, file count, and age, with a live contents preview. Rename one, branch off it, apply keeping your index, or undo a drop, all without leaving the keyboard.",
    keys: ["g", "Z", "R"],
    media: { src: "/screenshots/demo-stash-workflow.gif", animated: true },
  },
  {
    icon: GitBranchIcon,
    title: "Worktree-aware checkout",
    description:
      "Check out a branch that's already checked out in another worktree and coco doesn't dead-end on git's error — it names the worktree holding it and offers a way forward: s to switch into that worktree (it opens as a nested frame), r to remove it and check out here, or x to remove it and delete the branch. Dirty worktrees are guarded.",
    keys: ["↵", "s", "r", "x"],
    media: { src: "/screenshots/demo-checkout-worktree-conflict.gif", animated: true },
  },
  {
    icon: SplitIcon,
    title: "Side-by-side diff",
    description:
      "Read changes in a split-pane diff with syntax highlighting and line-level navigation — staged or unstaged, any commit or file, without leaving the keyboard.",
    keys: ["g", "d"],
    media: { src: "/screenshots/view-diff.png" },
  },
  {
    icon: GitCommitIcon,
    title: "Stage, draft, ship — the inner loop",
    description:
      "The whole everyday loop without leaving the keyboard: open a changed file, stage the hunks you mean, jump to compose, and let coco draft a Conventional Commit message from exactly what's staged — ready to review, edit, and commit. commitlint respected.",
    keys: ["Space", "g c", "I"],
    media: { src: "/screenshots/demo-tour-ship-change.gif", animated: true, width: 1463, height: 722 },
  },
  {
    icon: GitPullRequestIcon,
    title: "Review a PR end to end",
    description:
      "Open the current branch's pull request — body, CI checks, and reviews right in the inspector — then cross to the multi-PR triage list and cycle filters. Merge, approve, request changes, and comment without a browser round-trip.",
    keys: ["g p", "g P", "f"],
    media: { src: "/screenshots/demo-tour-review-pr.gif", animated: true, width: 1463, height: 722 },
  },
  {
    icon: RotateCcwIcon,
    title: "History mutations, with a real undo button",
    description:
      "Revert, reset, rebase, and cherry-pick from the history view. Cursor to any commit and apply the operation with a single key. Made a mistake anyway? z is lazygit's undo safety blanket, reflog-powered: it reads what actually just happened, shows you the exact inverse it's about to run, and reverts it on confirm — no manual reflog archaeology required.",
    keys: ["g", "h", "z"],
    media: { src: "/screenshots/view-reflog.png" },
  },
  {
    icon: CheckSquareIcon,
    title: "Batch it: mark, range-select, one confirm",
    description:
      "Stop deleting five stale branches five separate times. x marks a branch or stash and auto-advances to the next; v anchors a range extended with j/k. Delete the marked branches, drop the marked stashes, or cherry-pick a whole commit span as one git cherry-pick oldest^..newest — the confirm panel names every item so nothing runs blind.",
    keys: ["x", "v", "D"],
    media: { src: "/screenshots/demo-multiselect-batch.gif", animated: true },
  },
  {
    icon: GitMergeIcon,
    title: "Resolve conflicts in place",
    description:
      "When a merge, rebase, cherry-pick, or revert stops on conflicts, the conflicts view lists every file. Keep theirs (u) or keep ours (U) per file, or open it in your editor — then continue the operation (C) once it's clean, without dropping to the shell.",
    keys: ["g", "x", "u/U"],
    media: { src: "/screenshots/demo-conflicts.gif", animated: true },
  },
  {
    icon: SearchIcon,
    title: "Bisect a regression",
    description:
      "Drive git bisect from the workstation: mark the cursored commit good (g) or bad (b) and watch the candidate range collapse toward the culprit, with a running decision log and the revisions-left estimate — no remembering the bisect verb soup.",
    keys: ["g", "B", "g/b"],
    media: { src: "/screenshots/demo-tour-find-regression.gif", animated: true, width: 1463, height: 722 },
  },
  {
    icon: RectangleHorizontalIcon,
    title: "Fits any terminal",
    description:
      "Down to an 80×24 tmux split, the three-pane IDE folds to a single full-width pane you Tab between — no feature locked behind screen real estate. Press v to peek the sidebar without losing your place, then snap right back.",
    keys: ["Tab", "v"],
    media: { src: "/screenshots/demo-single-pane.gif", animated: true },
  },
]

function FramedMedia({ title, media }: { title: string; media: WorkflowRow["media"] }) {
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
      <Lightbox src={media.src} alt={title}>
        {media.animated ? (
          <MediaFrame kind="gif" src={media.src} alt={title} width={media.width ?? 1463} height={media.height ?? 689} />
        ) : (
          <MediaFrame
            src={media.src}
            alt={title}
            width={1369}
            height={722}
            objectPosition="top"
            sizes="(max-width: 1024px) 100vw, 600px"
          />
        )}
      </Lightbox>
    </div>
  )
}

/**
 * Key workflows as numbered, alternating feature rows — a deliberately
 * different rhythm from the list+preview and 2-column blocks elsewhere on
 * the page. Each row pairs a real capture with the keys that drive it.
 */
export function KeyWorkflows() {
  return (
    <div className="mt-4 space-y-16 lg:space-y-24">
      {WORKFLOWS.map((w, i) => {
        const Icon = w.icon
        const reversed = i % 2 === 1
        return (
          <div
            key={w.title}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
          >
            {/* Copy */}
            <div className={cn(reversed && "lg:order-2")}>
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-4xl font-bold leading-none text-terminal-green/20 sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-terminal-green" />
                  <h3 className="font-mono text-lg font-semibold text-foreground sm:text-xl">
                    {w.title}
                  </h3>
                </div>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {w.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-1.5">
                {w.keys.map((k, ki) => (
                  <span key={ki} className="flex items-center gap-1.5">
                    {ki > 0 && <span className="text-muted-foreground/40">+</span>}
                    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-bg-elevated px-1.5 font-mono text-xs text-terminal-green">
                      {k}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>

            {/* Media */}
            <div className={cn(reversed && "lg:order-1")}>
              <FramedMedia title={w.title} media={w.media} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
