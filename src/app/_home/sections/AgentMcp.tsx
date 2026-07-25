"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import {
    ArrowRightIcon,
    CheckIcon,
    CopyIcon,
    FileTerminalIcon,
    GitCommitHorizontalIcon,
    ScrollTextIcon,
    ClipboardCheckIcon,
    CalendarClockIcon,
    PlugZapIcon,
    ShieldCheckIcon,
    TerminalIcon,
    type LucideIcon,
} from "lucide-react"

import { Reveal, useInView } from "@/components/Reveal"
import { Section } from "@/components/Section"
import { SectionHeader } from "@/components/SectionHeader"
import { TerminalAtmosphere } from "@/components/TerminalAtmosphere"
import { TrackedLink } from "@/components/TrackedLink"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Path chooser — the fork that decides everything else               */
/* ------------------------------------------------------------------ */

const paths = [
  {
    id: "mcp",
    icon: PlugZapIcon,
    audience: "You code with an AI assistant",
    detail:
      "Kiro, Cursor, Claude Desktop, VS Code with Copilot, Windsurf. Add coco once and your assistant discovers four tools it can call on its own.",
    command: "coco mcp",
    commandNote: "add to your editor's MCP config",
    recommended: true,
  },
  {
    id: "cli",
    icon: FileTerminalIcon,
    audience: "You're writing a script or a CI job",
    detail:
      "Send a JSON request on stdin, read a JSON envelope on stdout. No editor, no MCP client, no interactive prompts to work around.",
    command: "coco agent review",
    commandNote: "reads stdin, writes one JSON envelope",
    recommended: false,
  },
] as const

/* ------------------------------------------------------------------ */
/*  Client configs — the copy-paste payload, per editor                */
/*  VS Code uses `servers` + an explicit `type`; the rest use          */
/*  `mcpServers`. Showing that difference is the point.                */
/* ------------------------------------------------------------------ */

const clients = [
  {
    id: "kiro",
    label: "Kiro",
    path: "~/.kiro/settings/mcp.json",
    config: `{
  "mcpServers": {
    "coco": {
      "command": "coco",
      "args": ["mcp"]
    }
  }
}`,
  },
  {
    id: "cursor",
    label: "Cursor",
    path: "~/.cursor/mcp.json",
    config: `{
  "mcpServers": {
    "coco": {
      "command": "coco",
      "args": ["mcp"]
    }
  }
}`,
  },
  {
    id: "claude",
    label: "Claude Desktop",
    path: "~/Library/Application Support/Claude/claude_desktop_config.json",
    config: `{
  "mcpServers": {
    "coco": {
      "command": "coco",
      "args": ["mcp"]
    }
  }
}`,
  },
  {
    id: "vscode",
    label: "VS Code",
    path: ".vscode/mcp.json",
    config: `{
  "servers": {
    "coco": {
      "type": "stdio",
      "command": "coco",
      "args": ["mcp"]
    }
  }
}`,
  },
] as const

/* ------------------------------------------------------------------ */
/*  Tools framed as "what you ask" → "what comes back"                 */
/* ------------------------------------------------------------------ */

type Tool = {
  tool: string
  icon: LucideIcon
  ask: string
  returns: string
  fields: string[]
}

const tools: Tool[] = [
  {
    tool: "coco_commit_draft",
    icon: GitCommitHorizontalIcon,
    ask: "Commit what I just staged.",
    returns:
      "A title and body written from the real diff, already checked against your commitlint rules.",
    fields: ["title", "body", "formatted", "validationErrors"],
  },
  {
    tool: "coco_review",
    icon: ClipboardCheckIcon,
    ask: "Review this before I push it.",
    returns:
      "Structured findings with a severity, a file, and a line, so your assistant can act on them instead of parsing prose.",
    fields: ["findings[]"],
  },
  {
    tool: "coco_changelog",
    icon: ScrollTextIcon,
    ask: "What shipped since the last tag?",
    returns:
      "Release notes grouped by theme, built from the commit range you name.",
    fields: ["title", "content"],
  },
  {
    tool: "coco_recap",
    icon: CalendarClockIcon,
    ask: "Summarize what I worked on this week.",
    returns:
      "A written summary of a time window or a working tree, for standups and status updates.",
    fields: ["title", "summary"],
  },
]

/* ------------------------------------------------------------------ */
/*  Safety — the same guarantees, stated as consequences               */
/* ------------------------------------------------------------------ */

const guarantees = [
  {
    label: "It reads. It never writes.",
    detail:
      "No commits, no file edits, no pushes, no comments on your PRs. Every tool is annotated read-only, so your client can show you that too.",
  },
  {
    label: "It stays inside the repo you opened.",
    detail:
      "One server binds to one Git root, checked against the workspace folders your editor actually exposes. Requests for anything outside it fail.",
  },
  {
    label: "Every answer says where it came from.",
    detail:
      "Results carry a SHA-256 digest of their input and a provenance marker, so you can tell a real diff from context an agent handed over.",
  },
]

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded border border-border/70 px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-terminal-green-dim hover:text-terminal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {copied ? (
        <>
          <CheckIcon
            className="h-3 w-3 text-terminal-green motion-safe:animate-in motion-safe:zoom-in-50"
            aria-hidden="true"
          />
          copied
        </>
      ) : (
        <>
          <CopyIcon className="h-3 w-3" aria-hidden="true" />
          copy
        </>
      )}
    </button>
  )
}

/** Shared faux-terminal chrome, previously duplicated across sections. */
function TerminalChrome({ label }: { label: string }) {
  return (
    <div className="relative z-[2] flex items-center gap-1.5 border-b border-border/60 bg-[hsl(150_20%_8%)] px-4 py-3">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
      <span className="ml-2 font-mono text-[10px] text-muted-foreground/60">{label}</span>
    </div>
  )
}

/** Blinking block caret, matching the terminal type across the site.
 *  Only blinks when the nearest `group` ancestor is hovered, keeping
 *  the page calm when many terminals are visible simultaneously.
 */
function Caret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-terminal-green/80 opacity-0 transition-opacity group-hover:opacity-100 group-hover:motion-safe:animate-cursor-blink",
        className
      )}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Step scaffolding — a numbered marker plus the trace that links     */
/*  one step to the next.                                             */
/* ------------------------------------------------------------------ */

function Step({
  n,
  title,
  blurb,
  rail = true,
  className,
  children,
}: {
  n: number
  title: string
  blurb?: string
  rail?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <Reveal className={cn("relative mx-auto max-w-6xl", className)}>
      {rail && <span aria-hidden="true" className="agent-rail hidden sm:block" />}

      <div className={cn("relative z-[1]", blurb ? "" : "")}>
        <div className={cn("flex items-center gap-3", blurb ? "mb-2" : "mb-5")}>
          <span
            aria-hidden="true"
            className="agent-step-marker relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-terminal-green-dim/50 bg-terminal-green/[0.08] font-mono text-xs font-semibold text-terminal-green shadow-[0_0_18px_-6px_hsl(154_40%_53%_/_0.7)]"
          >
            {n}
          </span>
          <h3 className="font-mono text-base font-semibold text-foreground">{title}</h3>
        </div>

        {blurb && (
          <p className="mb-5 max-w-2xl pl-10 text-sm leading-6 text-muted-foreground">{blurb}</p>
        )}

        {children}
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 1 — pick the path that matches how you work                   */
/* ------------------------------------------------------------------ */

function PathChooser() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {paths.map(({ id, icon: Icon, audience, detail, command, commandNote, recommended }, i) => (
        <Reveal
          key={id}
          delay={i * 90}
          className={cn(
            "agent-sweep group relative flex flex-col rounded-xl border bg-bg-elevated/55 p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 sm:p-6",
            recommended
              ? "border-terminal-green-dim/60 pt-8 shadow-[0_0_40px_-24px_hsl(154_40%_53%_/_0.55)] hover:shadow-[0_0_50px_-18px_hsl(154_40%_53%_/_0.6)]"
              : "border-border hover:border-terminal-green-dim/50"
          )}
        >
          {recommended && (
            <span className="absolute top-2.5 left-5 z-[2] rounded bg-terminal-green px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[hsl(150_22%_10%)]">
              most people
            </span>
          )}

          <span className="relative z-[2] mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-terminal-green-dim/30 bg-terminal-green/[0.06] transition-all duration-300 group-hover:border-terminal-green-dim/70 group-hover:bg-terminal-green/[0.12] group-hover:shadow-[0_0_22px_-8px_hsl(154_40%_53%)]">
            <Icon
              className="h-4 w-4 text-terminal-green transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />
          </span>

          <h3 className="relative z-[2] font-mono text-sm font-semibold leading-6 text-foreground sm:text-base">
            {audience}
          </h3>
          <p className="relative z-[2] mt-2 flex-1 text-sm leading-6 text-muted-foreground">
            {detail}
          </p>

          <div className="relative z-[2] mt-5 rounded-md border border-border/70 bg-[hsl(var(--code-bg))] px-3 py-2.5 transition-colors duration-300 group-hover:border-terminal-green-dim/50">
            <code className="font-mono text-sm text-[hsl(var(--code-text))]">
              <span className="select-none text-terminal-green-dim">$ </span>
              {command}
              <Caret />
            </code>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">{commandNote}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 2 — the copy-paste config, per client                         */
/* ------------------------------------------------------------------ */

function ClientConfig() {
  return (
    <Tabs defaultValue={clients[0].id} className="w-full">
      <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        {clients.map((client) => (
          <TabsTrigger
            key={client.id}
            value={client.id}
            className="rounded-md border border-border bg-transparent px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-terminal-green-dim data-[state=active]:bg-terminal-green/10 data-[state=active]:text-terminal-green data-[state=active]:shadow-none"
          >
            {client.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {clients.map((client) => (
        <TabsContent
          key={client.id}
          value={client.id}
          className="mt-0 motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:slide-in-from-bottom-1 motion-safe:data-[state=active]:duration-300"
        >
          <div className="overflow-hidden rounded-xl border border-border/80 bg-[hsl(var(--code-bg))] transition-colors duration-300 hover:border-terminal-green-dim/40">
            <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-[hsl(150_20%_8%)] px-4 py-2.5">
              <code className="truncate font-mono text-[11px] text-muted-foreground">
                {client.path}
              </code>
              <CopyButton
                value={client.config}
                label={`Copy the coco MCP config for ${client.label}`}
              />
            </div>
            <pre className="overflow-x-auto p-4 sm:p-5">
              <code className="font-mono text-xs leading-6 text-[hsl(var(--code-text))] sm:text-[13px]">
                {client.config}
              </code>
            </pre>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 3 — proof that it connected                                   */
/*  The tool list types itself out the first time it scrolls into      */
/*  view, so the panel reads as a live handshake instead of a static   */
/*  screenshot.                                                        */
/* ------------------------------------------------------------------ */

const BOOT_STEP_MS = 260

function ConnectedTerminal() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 })

  /** Sequences a boot line, or hides it until the panel is in view. */
  const line = (index: number) =>
    inView
      ? {
          className: "agent-boot-line",
          style: { "--boot-delay": `${index * BOOT_STEP_MS}ms` } as CSSProperties,
        }
      : { className: "opacity-0", style: undefined }

  return (
    <div
      ref={ref}
      className="agent-scan group relative overflow-hidden rounded-xl border border-border/80 bg-[hsl(150_24%_5%)] shadow-2xl shadow-black/30 ring-1 ring-terminal-green/10"
    >
      <TerminalChrome label="coco mcp" />

      <div className="relative z-[2] space-y-4 p-5 font-mono text-[11px] leading-6 sm:p-6 sm:text-xs">
        <p {...line(0)}>
          <span className="text-muted-foreground">
            <span className="text-terminal-green-dim">→</span> coco MCP server started
          </span>
        </p>

        <div className="space-y-1.5">
          {tools.map(({ tool }, i) => {
            const props = line(i + 1)
            return (
              <div key={tool} className={cn("flex items-center gap-2", props.className)} style={props.style}>
                <CheckIcon
                  className="agent-pop h-3 w-3 shrink-0 text-terminal-green"
                  aria-hidden="true"
                />
                <span className="text-terminal-green-bright">{tool}</span>
              </div>
            )
          })}
        </div>

        <div {...line(tools.length + 1)}>
          <p className="border-t border-border/50 pt-4 text-muted-foreground">
            Your assistant now calls these directly. Nothing else to wire up.
            {inView && <Caret className="h-[0.9em] w-[0.45em]" />}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export function AgentMcpSection() {
  return (
    <Section id="agents" variant="gradient" className="scroll-mt-24 overflow-hidden">
      <TerminalAtmosphere variant="section" />

      <div className="container relative z-10">
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-terminal-green-dim/40 bg-terminal-green/[0.06] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-terminal-green">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terminal-green" />
            </span>
            stdio MCP · 4 tools · read-only
          </span>

          <SectionHeader
            prompt="~/coco $ coco mcp"
            title="Let your AI assistant use coco"
            subtitle="Commit messages, code review, changelogs, and recaps, exposed as tools an agent can call. Two ways in: connect it to your editor over MCP, or pipe JSON to it from a script."
          />
        </Reveal>

        {/* ---- Step 1: choose ---- */}
        <Step n={1} title="Pick the one that describes you">
          <PathChooser />
        </Step>

        {/* ---- Step 2: configure ---- */}
        <Step
          n={2}
          title="Add it to your editor"
          blurb="One entry, no repository path. coco reads the workspace folder your editor is already reporting, so the same config works in every project you open."
          className="mt-14"
        >
          <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <ClientConfig />
            <ConnectedTerminal />
          </div>
        </Step>

        {/* ---- Step 3: use ---- */}
        <Step
          n={3}
          title="Then just ask"
          blurb="You talk to your assistant normally. It picks the tool and gets back structured data, not terminal output it has to guess at."
          rail={false}
          className="mt-14"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {tools.map(({ tool, icon: Icon, ask, returns, fields }, i) => (
              <Reveal
                key={tool}
                delay={i * 80}
                className="agent-sweep group relative overflow-hidden rounded-lg border border-border bg-bg-elevated/55 p-5 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-terminal-green-dim hover:shadow-[0_0_38px_-22px_hsl(154_40%_53%_/_0.8)]"
              >
                <div className="relative z-[2] flex items-start gap-3">
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-terminal-green transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_hsl(154_40%_53%)]"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-6 text-foreground">
                      &ldquo;{ask}&rdquo;
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{returns}</p>
                  </div>
                </div>

                <div className="relative z-[2] mt-4">
                  <span aria-hidden="true" className="agent-wire block" />
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pl-7">
                    <code className="font-mono text-[10px] text-terminal-green-dim">{tool}</code>
                    <ArrowRightIcon
                      className="h-2.5 w-2.5 text-border transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-terminal-green-dim"
                      aria-hidden="true"
                    />
                    {fields.map((field, fi) => (
                      <code
                        key={field}
                        style={{ transitionDelay: `${fi * 60}ms` }}
                        className="rounded border border-transparent bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-all duration-300 group-hover:border-terminal-green-dim/40 group-hover:text-terminal-green-bright/90"
                      >
                        {field}
                      </code>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Step>

        {/* ---- Safety ---- */}
        <Reveal className="mx-auto mt-14 max-w-6xl rounded-xl border border-terminal-green-dim/30 bg-terminal-green/[0.04] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span
                aria-hidden="true"
                className="agent-breathe absolute inset-[-6px] rounded-full bg-terminal-green/25 blur-md"
              />
              <ShieldCheckIcon className="relative h-5 w-5 text-terminal-green" aria-hidden="true" />
            </span>
            <h3 className="font-mono text-base font-semibold text-foreground">
              What it will not do
            </h3>
          </div>

          <dl className="grid gap-5 md:grid-cols-3">
            {guarantees.map(({ label, detail }, i) => (
              <Reveal key={label} delay={i * 100}>
                <dt className="font-mono text-sm font-semibold leading-6 text-terminal-green-bright">
                  {label}
                </dt>
                <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">{detail}</dd>
              </Reveal>
            ))}
          </dl>
        </Reveal>

        {/* ---- CTA ---- */}
        <Reveal className="agent-sweep group relative mx-auto mt-8 flex max-w-6xl flex-col gap-4 overflow-hidden rounded-lg border border-border bg-bg-elevated/55 px-5 py-5 transition-colors duration-300 hover:border-terminal-green-dim/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative z-[2] flex items-start gap-3">
            <TerminalIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-terminal-green"
              aria-hidden="true"
            />
            <div>
              <p className="font-mono text-sm text-foreground">
                Scripting it instead? Start with the schema.
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                <code className="font-mono text-xs text-terminal-green-dim">
                  coco agent schema --task review
                </code>{" "}
                prints the exact request and response shape. The guide covers every parameter, error
                code, and safety boundary.
              </p>
            </div>
          </div>
          <TrackedLink
            href={siteConfig.links.agentMcpDocs}
            eventName="Agent MCP Guide Click"
            className="relative z-[2] inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-terminal-green-dim bg-terminal-green/10 px-4 py-2.5 font-mono text-sm text-terminal-green transition-all duration-300 hover:bg-terminal-green/15 hover:text-terminal-green-bright hover:shadow-[0_0_26px_-10px_hsl(154_40%_53%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-auto"
          >
            Read the guide
            <ArrowRightIcon
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </TrackedLink>
        </Reveal>
      </div>
    </Section>
  )
}
