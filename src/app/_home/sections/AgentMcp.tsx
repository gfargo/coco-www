import { Section } from "@/components/Section"
import { SectionHeader } from "@/components/SectionHeader"
import { TerminalAtmosphere } from "@/components/TerminalAtmosphere"
import { TrackedLink } from "@/components/TrackedLink"
import { siteConfig } from "@/config/site"
import {
    ArrowRightIcon,
    BotIcon,
    BracesIcon,
    CheckIcon,
    FingerprintIcon,
    LockKeyholeIcon,
    PlugZapIcon,
} from "lucide-react"

const tools = [
  { name: "coco_commit_draft", result: "title · body · conventional checks" },
  { name: "coco_review", result: "ranked findings" },
  { name: "coco_changelog", result: "release narrative" },
  { name: "coco_recap", result: "work summary" },
]

const guarantees = [
  {
    icon: LockKeyholeIcon,
    title: "One server. One repo.",
    description:
      "Every stdio server is bound to one normalized Git root and honors the filesystem roots exposed by your MCP client.",
  },
  {
    icon: FingerprintIcon,
    title: "Context you can trace",
    description:
      "Use staged changes, safe refs, patches, file summaries, or condensed context. Every result carries a SHA-256 source digest and provenance.",
  },
  {
    icon: BracesIcon,
    title: "Strict in. Structured out.",
    description:
      "Protocol-v1 schemas reject unknown fields and return explicit success or error envelopes instead of terminal prose.",
  },
]

function TransportFlow() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-bg-elevated/60 p-5 sm:p-7">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,hsl(var(--terminal-green-dim))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--terminal-green-dim))_1px,transparent_1px)] [background-size:28px_28px]"
      />
      <div className="relative">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-terminal-green-dim">
          two transports · one contract
        </p>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          <div className="rounded-lg border border-terminal-green-dim/40 bg-background/80 p-3 sm:p-4">
            <BracesIcon className="mb-3 h-4 w-4 text-terminal-green" />
            <p className="font-mono text-xs text-foreground sm:text-sm">JSON / stdin</p>
            <p className="mt-1 text-[11px] text-muted-foreground">one-shot agent CLI</p>
          </div>
          <ArrowRightIcon className="h-4 w-4 text-terminal-green-dim" />
          <div className="rounded-lg border border-terminal-green-dim/40 bg-background/80 p-3 sm:p-4">
            <PlugZapIcon className="mb-3 h-4 w-4 text-terminal-green" />
            <p className="font-mono text-xs text-foreground sm:text-sm">local stdio</p>
            <p className="mt-1 text-[11px] text-muted-foreground">MCP discovery</p>
          </div>
        </div>

        <div className="mx-auto h-5 w-px bg-terminal-green-dim/50" />
        <div className="rounded-lg border border-terminal-green/50 bg-terminal-green/[0.07] px-4 py-3 text-center shadow-[0_0_28px_-12px_hsl(154_40%_53%_/_0.5)]">
          <div className="flex items-center justify-center gap-2">
            <BotIcon className="h-4 w-4 text-terminal-green" />
            <span className="font-mono text-sm font-semibold text-terminal-green-bright">
              typed agent operations
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            shared prompts · model routing · cancellation
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-md border border-border/80 bg-background/70 px-3 py-2.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-terminal-green" />
                <span className="truncate font-mono text-[10px] text-foreground/90 sm:text-[11px]">
                  {tool.name}
                </span>
              </div>
              <p className="mt-1 pl-3 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                {tool.result}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProtocolTerminal() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/80 bg-[hsl(150_24%_5%)] shadow-2xl shadow-black/30 ring-1 ring-terminal-green/10">
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-[hsl(150_20%_8%)] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/80" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 font-mono text-[10px] text-muted-foreground/60">
          agent session
        </span>
      </div>

      <div className="space-y-5 p-5 font-mono text-[11px] leading-6 sm:p-7 sm:text-xs">
        <div>
          <p className="text-foreground/90">
            <span className="text-terminal-green">$</span> coco agent schema --task review
          </p>
          <p className="text-muted-foreground">
            <span className="text-terminal-green-dim">→</span> protocol 1 · strict input · oneOf output
          </p>
        </div>

        <div className="border-t border-border/50 pt-5">
          <p className="text-foreground/90">
            <span className="text-terminal-green">$</span> coco mcp --repo /work/project
          </p>
          <p className="mb-3 text-muted-foreground">
            <span className="text-terminal-green-dim">→</span> bound to /work/project
          </p>
          <div className="space-y-1.5">
            {tools.map((tool) => (
              <div key={tool.name} className="flex items-center gap-2">
                <CheckIcon className="h-3 w-3 shrink-0 text-terminal-green" />
                <span className="text-terminal-green-bright">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-terminal-green-dim/30 bg-terminal-green/[0.06] px-3 py-2.5 text-[10px] leading-5 text-muted-foreground sm:text-[11px]">
          <span className="text-terminal-green">read-only</span> repository tools · no commits · no file writes · no forge mutations
        </div>
      </div>
    </div>
  )
}

export function AgentMcpSection() {
  return (
    <Section id="agents" variant="gradient" className="overflow-hidden">
      <TerminalAtmosphere variant="section" />

      <div className="container relative z-10">
        <SectionHeader
          prompt="~/coco $ mcp --repo ."
          title="Git intelligence, now agent-native"
          subtitle="Give coding agents the parts of coco they need — not a shell-shaped escape hatch. Use versioned JSON anywhere, or connect four discoverable generation tools through local MCP."
        />

        <div className="mx-auto grid max-w-6xl items-stretch gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <TransportFlow />
          <ProtocolTerminal />
        </div>

        <div className="mx-auto mt-5 grid max-w-6xl gap-4 md:grid-cols-3">
          {guarantees.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-lg border border-border bg-bg-elevated/55 p-5 transition-colors hover:border-terminal-green-dim"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-terminal-green-dim/40 bg-terminal-green/10">
                <Icon className="h-4 w-4 text-terminal-green" />
              </div>
              <h3 className="font-mono text-sm font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 rounded-lg border border-terminal-green-dim/30 bg-terminal-green/[0.04] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-sm text-foreground">Build with the contract, not the terminal output.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Installation, client config, every parameter, safety boundary, analytics detail, and error code.
            </p>
          </div>
          <TrackedLink
            href={siteConfig.links.agentMcpWiki}
            target="_blank"
            eventName="Agent MCP Guide Click"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-md border border-terminal-green-dim bg-terminal-green/10 px-4 py-2.5 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/15 hover:text-terminal-green-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:self-auto"
          >
            Read the integration guide
            <ArrowRightIcon className="h-4 w-4" />
          </TrackedLink>
        </div>
      </div>
    </Section>
  )
}
