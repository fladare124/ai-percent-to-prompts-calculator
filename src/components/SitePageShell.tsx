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
    <main className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Percent to Prompts home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-base font-bold text-emerald-100">P%</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">by Percent to Prompts</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Open the CSV checker</Link>
        </header>

        <article className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">{intro}</p>
          <div className="mt-10 space-y-8 text-stone-700">{children}</div>
        </article>

        <footer className="flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200 pt-6 text-xs text-stone-500">
          <Link href="/" className="underline underline-offset-4 hover:text-stone-900">Etsy CSV checker</Link>
          <Link href="/about" className="underline underline-offset-4 hover:text-stone-900">About</Link>
          <Link href="/privacy" className="underline underline-offset-4 hover:text-stone-900">Privacy</Link>
          <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-stone-900">Affiliate disclosure</Link>
        </footer>
      </div>
    </main>
  );
}
