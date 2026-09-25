import type { Metadata } from "next";
import Link from "next/link";
import EtsyCsvAuditor from "@/components/EtsyCsvAuditor";
import { ERANK_DISCLOSURE, ERANK_HREF, ERANK_REL } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Etsy Listing CSV Checker",
  description:
    "Check Etsy listing titles and tags from your shop CSV. Find repeated wording, missing tag slots and tags over 20 characters; your file stays in your browser.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Free Etsy Listing CSV Checker & Tag Audit",
    description:
      "Review active Etsy listings in one private, browser-based audit. No login, no shop connection and no search-volume claims.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Etsy Listing CSV Checker",
    description: "A private title and tag audit for your Etsy shop export.",
    images: ["/opengraph-image"],
  },
};

const faq = [
  {
    question: "What does the Etsy CSV checker review?",
    answer:
      "It checks title length and repeated or promotional wording, tag count and tag length, repeated tags within a listing, and exact duplicate titles across the shop export. These are review prompts, not an Etsy ranking score.",
  },
  {
    question: "Does the checker upload or save my Etsy file?",
    answer:
      "No. The CSV is read and checked in your browser. Its title, description, materials and tags are not sent to our server. The site analytics record page and interaction events without listing content.",
  },
  {
    question: "Does this tool find Etsy search volume or predict rankings?",
    answer:
      "No. It does not connect to Etsy search data or estimate ranking, demand or sales. Use Etsy Shop Stats or a keyword research service to check actual performance and search data.",
  },
  {
    question: "Is this an official Etsy tool?",
    answer:
      "No. Percent to Prompts is an independent tool and is not affiliated with or endorsed by Etsy. The checks are based on public Etsy seller guidance, which can change.",
  },
  {
    question: "How do I download my Etsy listing CSV?",
    answer:
      "In Etsy Shop Manager, open Settings, then Options, then Download Data, and choose Download CSV under your active listings. Etsy's help page has the current steps.",
  },
  {
    question: "Can I use the copied prompt with an AI assistant?",
    answer:
      "Yes. The prompt is copied only when you choose the button. Review it first: when you paste listing details into another AI service, that service's own privacy terms apply. The checker itself does not call an AI model.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Etsy Listing CSV Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Review title wording against current public Etsy title guidance",
    "Check up to 13 tags and the 20-character limit",
    "Audit an active-listings CSV locally in the browser",
    "Download the report or copy an optional AI review prompt",
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Percent to Prompts home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-base font-bold text-emerald-100">P%</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">by Percent to Prompts</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-stone-600" aria-label="Main navigation">
            <a href="#auditor" className="transition hover:text-stone-950">CSV checker</a>
            <a href="#method" className="transition hover:text-stone-950">Checks and limits</a>
            <Link href="/about" className="transition hover:text-stone-950">About</Link>
          </nav>
        </header>

        <section className="grid gap-9 py-12 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-950">
              Free Etsy CSV checker · Private in your browser
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Find listing issues hiding in your Etsy CSV.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              Check titles and tags across your active shop in one go. Get a readable report, then make an AI review prompt for the listings you choose. No account connection and no file upload.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#auditor" className="rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
                Check my listings
              </a>
              <a href="#method" className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-500">
                See what it checks
              </a>
            </div>
            <p className="mt-5 max-w-2xl text-xs leading-5 text-stone-500">
              This is a checklist, not an Etsy ranking score. It does not know search volume, listing performance or which terms buyers use.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-emerald-200/70 via-transparent to-amber-100/70 blur-xl" />
            <div className="relative rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-[0_24px_80px_-40px_rgba(24,24,27,0.3)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Example report</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">One shop, clear next steps</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">No sign-in</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#f7f6f0] p-3"><span className="block text-xl font-semibold">128</span><span className="mt-1 block text-xs text-stone-500">listings scanned</span></div>
                <div className="rounded-xl bg-amber-50 p-3"><span className="block text-xl font-semibold">23</span><span className="mt-1 block text-xs text-stone-500">to review</span></div>
                <div className="rounded-xl bg-rose-50 p-3"><span className="block text-xl font-semibold">7</span><span className="mt-1 block text-xs text-stone-500">tag checks</span></div>
              </div>
              <div className="mt-4 rounded-xl border border-stone-200 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">CSV row 14 · Example only</p>
                <p className="mt-1 font-medium text-stone-900">Beautiful Moon Necklace, Perfect Gift for Her…</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-950">Review title wording</span>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-950">Repeated tag</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-5 text-stone-500">Numbers and listing text above are an illustration, not live shop data.</p>
            </div>
          </div>
        </section>

        <EtsyCsvAuditor />

        <section id="method" className="scroll-mt-8 border-t border-stone-200 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">How the check works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Checks based on Etsy’s guidance, with the limits stated plainly.</h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Etsy recommends clear titles that are easy to scan, with the item and its key objective details stated once. It suggests considering fewer than 15 words and moving subjective or sales language out of the title. This audit marks those patterns for review; it never edits a listing or predicts search position.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-950">Titles</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Review titles over 140 characters, titles with 15 or more words, repeated terms, subjective adjectives, and sales or gifting phrases.</p>
              <a href="https://www.etsy.com/seller-handbook/article/1399426136697" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Etsy title guidance ↗</a>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-950">Tags</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Check for up to 13 tags, empty slots, repeated tags within a listing and tags longer than Etsy’s 20-character limit.</p>
              <a href="https://help.etsy.com/hc/en-us/articles/360000336307-How-to-Use-Tags-to-Get-Found-in-Search" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Etsy tag guidance ↗</a>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-950">Shop-wide patterns</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Spot exact duplicate titles and tags reused across listings. Reuse is not automatically wrong; confirm every phrase fits that item.</p>
              <p className="mt-4 text-xs leading-5 text-stone-500">Guidance checked September 25, 2026. Etsy can update its rules.</p>
            </article>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <article className="rounded-2xl border border-stone-200 bg-[#eeede4] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Know what this can’t tell you</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">No keyword volumes or ranking promises.</h3>
              <p className="mt-3 text-sm leading-6 text-stone-700">
                The audit reads your exported titles and tags. It cannot see what Etsy shoppers search for, your shop’s impressions, clicks, orders or conversion rate. Use Shop Stats or a keyword research service before changing terms; then watch your own results over time.
              </p>
              <a href={ERANK_HREF} target="_blank" rel={ERANK_REL} className="mt-4 inline-flex rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-emerald-700">Explore eRank keyword research ↗</a>
              <p className="mt-2 text-xs leading-5 text-stone-500">{ERANK_DISCLOSURE}</p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Independent project</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">Your listing stays yours.</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">The checker works from the CSV you select, in this browser. It does not connect to your Etsy account, save your file, or send listing text to an AI service.</p>
              <p className="mt-3 text-sm leading-6 text-stone-600">If you copy a review prompt into ChatGPT, Claude, Gemini or another assistant, review that provider’s privacy terms first.</p>
              <Link href="/privacy" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Read the privacy note</Link>
            </article>
          </div>
        </section>

        <section className="border-t border-stone-200 pt-12 sm:pt-16" aria-labelledby="faq-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Frequently asked questions</p>
            <h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Before you run the audit</h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-stone-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                  {item.question}<span aria-hidden="true" className="float-right text-emerald-800 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="mt-14 flex flex-col gap-4 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Percent to Prompts · Independent Etsy listing checker · Guidance checked September 25, 2026.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            <Link href="/about" className="underline underline-offset-4 hover:text-stone-900">About</Link>
            <Link href="/privacy" className="underline underline-offset-4 hover:text-stone-900">Privacy</Link>
            <Link href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-stone-900">Affiliate disclosure</Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
