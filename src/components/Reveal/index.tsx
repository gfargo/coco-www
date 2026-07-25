"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type UseInViewOptions = {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number
  /** Shrinks the viewport so the trigger fires a little after the top edge. */
  rootMargin?: string
  /** Stop observing once it has fired. Defaults to true. */
  once?: boolean
}

/**
 * Reports whether a node has scrolled into view. Returns `true` immediately
 * when IntersectionObserver is unavailable so content never gets stranded
 * behind a hidden initial state.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // No observer support: show everything rather than stranding content
    // behind a hidden initial state. Deferred so it lands in its own commit
    // instead of cascading out of this effect.
    if (typeof IntersectionObserver === "undefined") {
      const timer = setTimeout(() => setInView(true), 0)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger offset in milliseconds. */
  delay?: number
  style?: CSSProperties
}

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. The motion itself lives in `.reveal` (globals.css) so a single
 * `prefers-reduced-motion` rule can neutralise every instance at once.
 */
export function Reveal({ children, className, delay = 0, style }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      data-revealed={inView ? "true" : "false"}
      className={cn("reveal", className)}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
