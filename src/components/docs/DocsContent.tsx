"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { SyntaxHighlighterProps } from "react-syntax-highlighter"
import { processMarkdown, type WikiPage } from "@/lib/wiki"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"

interface DocsContentProps {
  content: string
  page: WikiPage
  className?: string
}

export function DocsContent(props: DocsContentProps) {
  const { content, className } = props
  const processedContent = processMarkdown(content)

  return (
    <article
      className={cn("prose prose-invert max-w-none", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-mono font-bold tracking-tight mb-6 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-mono font-semibold tracking-tight mt-10 mb-4 text-foreground border-b border-[hsl(var(--border-default))] pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-mono font-semibold tracking-tight mt-8 mb-3 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-mono font-semibold tracking-tight mt-6 mb-2 text-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="leading-7 text-[hsl(var(--text-secondary))] mb-4">
              {children}
            </p>
          ),
          a: ({ href, children }) => {
            if (!href) {
              return <span>{children}</span>
            }

            const isExternal = href.startsWith("http")
            const isInternal = href.startsWith("/docs")

            if (isInternal) {
              return (
                <Link
                  href={href}
                  className="text-terminal-green hover:text-terminal-green-bright underline underline-offset-4 transition-colors"
                >
                  {children}
                </Link>
              )
            }

            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-terminal-green hover:text-terminal-green-bright underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
              >
                {children}
                {isExternal && <ExternalLink className="h-3 w-3" />}
              </a>
            )
          },
          ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc text-[hsl(var(--text-secondary))] [&>li]:mt-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal text-[hsl(var(--text-secondary))] [&>li]:mt-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-terminal-green-dim pl-4 italic text-[hsl(var(--text-secondary))] bg-[hsl(var(--bg-elevated))] py-2 rounded-r-md">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-8 border-[hsl(var(--border-default))]" />
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-auto rounded-lg border border-[hsl(var(--border-default))]">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[hsl(var(--bg-elevated))]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-[hsl(var(--border-default))] px-4 py-2.5 text-left font-mono font-semibold text-foreground text-xs uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[hsl(var(--border-default))] px-4 py-2.5 text-[hsl(var(--text-secondary))]">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "")
            const language = match?.[1] || "text"
            const isInline = !match

            if (isInline) {
              return (
                <code
                  className="relative rounded bg-[hsl(var(--code-bg))] px-[0.4rem] py-[0.2rem] font-mono text-sm text-[hsl(var(--code-text))] border border-[hsl(var(--border-default))]"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <CodeBlock language={language}>
                {String(children).replace(/\n$/, "")}
              </CodeBlock>
            )
          },
          pre: ({ children }) => <>{children}</>,
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt || ""}
              className="rounded-lg border border-[hsl(var(--border-default))] my-6 max-w-full"
            />
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </article>
  )
}

function CodeBlock({
  language,
  children,
}: {
  language: string
  children: string
}) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-6 group rounded-lg border border-[hsl(var(--border-default))] overflow-hidden">
      {/* Language label */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[hsl(var(--bg-elevated))] border-b border-[hsl(var(--border-default))]">
        <span className="text-xs font-mono text-[hsl(var(--text-tertiary))]">
          {language}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1 rounded text-[hsl(var(--text-tertiary))] hover:text-foreground hover:bg-[hsl(var(--bg-surface))] transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-terminal-green" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark as SyntaxHighlighterProps["style"]}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
          background: "hsl(var(--code-bg))",
        }}
        codeTagProps={{
          style: { background: "transparent" },
        }}
        showLineNumbers={children.split("\n").length > 3}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
