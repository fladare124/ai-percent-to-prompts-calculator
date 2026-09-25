import Link from "next/link";
import type { ReactNode } from "react";

export default function EtsyPageShell({
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
    <main className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Listing Checkup home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-xs font-bold text-emerald-100">LC</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">Free Etsy seller tools</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-stone-600" aria-label="Main navigation">
            <Link href="/" className="transition hover:text-stone-950">CSV audit</Link>
            <Link href="/etsy-sales-csv-analyzer" className="transition hover:text-stone-950">Sales report</Link>
            <Link href="/etsy-fee-calculator" className="transition hover:text-stone-950">Fee calculator</Link>
            <Link href="/etsy-tag-checker" className="transition hover:text-stone-950">Tag checker</Link>
          </nav>
        </header>

        <article className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{intro}</p>
          <div className="mt-10 space-y-8 text-stone-700">{children}</div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-6 text-xs text-stone-500">
          <Link href="/" className="underline underline-offset-4 hover:text-stone-900">Etsy seller tools</Link>
          <Link href="/etsy-sales-csv-analyzer" className="underline underline-offset-4 hover:text-stone-900">Sales report</Link>
          <Link href="/etsy-fee-calculator" className="underline underline-offset-4 hover:text-stone-900">Fee calculator</Link>
          <Link href="/etsy-tag-checker" className="underline underline-offset-4 hover:text-stone-900">Tag checker</Link>
          <Link href="/about" className="underline underline-offset-4 hover:text-stone-900">About</Link>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-stone-900">Privacy</Link>
          <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-stone-900">Affiliate disclosure</Link>
        </footer>
      </div>
    </main>
  );
}
