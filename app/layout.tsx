import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "@/app/globals.css";
import { getSiteUrl } from "@/lib/env";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "BurnLens | AI Spend Audit for Startups",
    template: "%s | BurnLens"
  },
  description: "Audit your startup's AI tool spend, find defensible savings, and share a clean report with your team.",
  openGraph: {
    title: "BurnLens | AI Spend Audit for Startups",
    description: "Find where your startup is overspending on Cursor, Claude, ChatGPT, Copilot, APIs, and more.",
    url: getSiteUrl(),
    siteName: "BurnLens",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "BurnLens | AI Spend Audit for Startups",
    description: "Find defensible AI tooling savings in under three minutes."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen font-sans`}>
        <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-normal">
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
                B
              </span>
              <span>BurnLens</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <Link href="/#audit" className="transition-colors hover:text-foreground">
                Audit
              </Link>
              <Link href="/#proof" className="transition-colors hover:text-foreground">
                Proof
              </Link>
              <Link href="/#faq" className="transition-colors hover:text-foreground">
                FAQ
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
