import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "@/styles/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "git-coco — AI Git Commits, Review & Terminal Workstation (GitHub & GitLab)",
    template: "%s | git-coco"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "git-coco — AI Git Commits, Review & Terminal Workstation (GitHub & GitLab)",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1280,
        height: 640,
        alt: "Coco — A suite of AI-powered Git tools and a keyboard-driven terminal workstation"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "git-coco — AI Git Commits, Review & Terminal Workstation (GitHub & GitLab)",
    description:
      "Smart commits, automated changelogs, code reviews, commit splitting — plus a keyboard-driven terminal workstation. Supports OpenAI, Anthropic, Gemini, Mistral, Azure OpenAI, AWS Bedrock, and Ollama.",
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitter
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: siteConfig.url
  }
} as Metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD structured data for SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    },
    description: siteConfig.description,
    url: siteConfig.url,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url
    },
    softwareVersion: "latest",
    keywords: "git, cli, AI git commits, automated changelogs, code review, commit splitting, terminal git workstation, developer tools, coco ui, ollama",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1"
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} bg-background text-foreground`}>
        {/* Scroll-reveal starts hidden and is un-hidden by an
            IntersectionObserver. Without JS there is nothing to un-hide it,
            so pin it visible. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {children}
        <Toaster />
      </body>
      <SpeedInsights />
      <Analytics />
    </html>
  )
}
