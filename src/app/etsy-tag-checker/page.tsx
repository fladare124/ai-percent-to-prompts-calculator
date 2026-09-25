import type { Metadata } from "next";
import Link from "next/link";
import EtsyTagChecker from "@/components/EtsyTagChecker";

const canonical = "/etsy-tag-checker";

export const metadata: Metadata = {
  title: {
    absolute: "Free Etsy Tag Checker: 13 Tags & 20-Character Limit | Listing Checkup",
  },
  description:
    "Check an Etsy listing's tags for the 13-tag limit, 20-character count, duplicates and unsupported characters. Your tags stay in your browser.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, "es-ES": "/es/comprobador-etiquetas-etsy" },
  },
  openGraph: {
    title: "Free Etsy Tag Checker",
    description:
      "Check Etsy tag counts, character limits and duplicates in your browser. No login or file upload.",
    url: canonical,
    type: "website",
  },
};

export default function EtsyTagCheckerPage() {
  return (
    <main lang="en" className="min-h-screen bg-[#f7f7f4] text-stone-950">
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <p className="text-sm font-bold tracking-tight">Listing Checkup</p>
            <p className="text-xs text-stone-500">Independent browser tools</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-stone-600" aria-label="Main navigation">
            <Link href="/" className="underline underline-offset-4 hover:text-stone-950">CSV audit</Link>
            <Link href="/etsy-sales-csv-analyzer" className="underline underline-offset-4 hover:text-stone-950">Profit by SKU</Link>
            <Link href="/etsy-title-checker" className="underline underline-offset-4 hover:text-stone-950">Title checker</Link>
            <Link href="/etsy-fee-calculator" className="underline underline-offset-4 hover:text-stone-950">Fee calculator</Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-stone-950">Privacy</Link>
            <a href="/es/comprobador-etiquetas-etsy" lang="es" hrefLang="es-ES" className="underline underline-offset-4 hover:text-stone-950">Español</a>
          </nav>
        </header>

        <article className="py-12 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Free Etsy tag checker · Updated September 25, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Check Etsy tags for duplicates and the 20-character limit</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
            Paste the tags for one listing to count them, check each tag’s length and spot repeated or unsupported characters. The check runs in your browser; it does not estimate keyword demand or predict Etsy search placement.
          </p>
          <div className="mt-9">
            <EtsyTagChecker />
          </div>

          <div className="mt-10 space-y-8 text-stone-700">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What this Etsy tag checker checks</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
                <li>Counts tags and marks entries after Etsy’s limit of 13.</li>
                <li>Counts characters, including spaces, and flags tags over 20 characters.</li>
                <li>Finds duplicate phrases even when capitalization or spacing differs.</li>
                <li>Flags punctuation that does not match Etsy’s published tag rules.</li>
              </ul>
              <p className="mt-3 text-base leading-7">
                A repeated or short tag is not automatically a mistake. This tool cannot tell whether a phrase accurately describes your item.
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-stone-950">How many Etsy tags can I use?</h2>
              <p className="mt-2 text-base leading-7">
                Etsy allows up to 13 tags per listing, with up to 20 characters in each tag. Its guidance says tags may use spaces, letters and numbers, with apostrophes and hyphens allowed within a phrase. Spaces count toward the character limit.
              </p>
              <a
                href="https://help.etsy.com/hc/en-us/articles/360000336307-How-to-Use-Tags-to-Get-Found-in-Search"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4"
              >
                Read Etsy’s tag guidance ↗
              </a>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-stone-950">A format check is not keyword research</h2>
              <p className="mt-3 text-base leading-7">
                This checker does not connect to Etsy or measure search volume, competition, impressions, clicks or sales. Use accurate phrases for your item and review your own shop statistics to understand how listings perform.
              </p>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-stone-950">Continue with your shop data</h2>
              <p className="mt-2 text-sm leading-6">
                Review one title with the <Link href="/etsy-title-checker" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy title checker</Link>, or audit titles and tags across active listings with the <Link href="/" className="font-semibold text-emerald-900 underline underline-offset-4">CSV listing audit</Link>. Estimate contribution by SKU with the <Link href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy profit report</Link>, or estimate one US order with the <Link href="/etsy-fee-calculator" className="font-semibold text-emerald-900 underline underline-offset-4">fee and profit calculator</Link>.
              </p>
            </section>
          </div>
        </article>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-6 text-xs leading-5 text-stone-500">
          <p>This independent tool is not affiliated with or endorsed by Etsy. Tag rules can change; confirm current limits in Etsy’s help center.</p>
          <a href="/about" className="font-semibold text-emerald-900 underline underline-offset-4">About Listing Checkup</a>
        </footer>
      </div>
    </main>
  );
}
