import Link from "next/link";
import type { ReactNode } from "react";

export default function SitePageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-zinc-950">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Percent to Prompts home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-lg font-bold text-cyan-300">P</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">AI Plan Finder</span>
              <span className="block text-xs text-zinc-500">A Percent to Prompts project</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-zinc-600" aria-label="Main">
            <Link href="/#finder" className="transition hover:text-zinc-950">Find a plan</Link>
            <Link href="/#compare" className="transition hover:text-zinc-950">Compare plans</Link>
            <Link href="/ai-usage-calculator" className="transition hover:text-zinc-950">Usage tools</Link>
          </nav>
        </header>

        <article className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-800">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">{intro}</p>
          <div className="mt-10 space-y-8 text-zinc-700">{children}</div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500">
          <Link href="/" className="underline underline-offset-4 hover:text-zinc-900">AI Plan Finder</Link>
          <Link href="/about" className="underline underline-offset-4 hover:text-zinc-900">About</Link>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-zinc-900">Privacy</Link>
          <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-zinc-900">Affiliate disclosure</Link>
        </footer>
      </div>
    </main>
  );
}
