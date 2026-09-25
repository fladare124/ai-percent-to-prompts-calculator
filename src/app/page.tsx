import type { Metadata } from "next";
import Link from "next/link";
import EtsyCsvAuditor from "@/components/EtsyCsvAuditor";
import { ERANK_DISCLOSURE, ERANK_HREF, ERANK_REL } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Free Etsy Listing CSV Checker | Bulk Title & Tag Audit",
  description:
    "Audit active Etsy listings from one private CSV. Check titles, tags, descriptions, prices, quantities, photos, and shop-wide patterns in your browser.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { en: "/", "es-ES": "/es/comprobador-csv-etsy" },
  },
  openGraph: {
    title: "Free Etsy Listing CSV Checker | Bulk Title & Tag Audit",
    description:
      "Review titles, tags and listing details across your active Etsy listings. Your CSV stays in your browser; no Etsy login or upload is needed.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Etsy Listing CSV Checker",
    description: "Review titles and tags across your shop export. Private, free, and no Etsy login required.",
    images: ["/opengraph-image"],
  },
};

const faq = [
  {
    question: "What does the Etsy CSV listing audit check?",
    answer:
      "It checks title wording and length, tag count and character limits, repeated tags, duplicate titles, and blank listing details such as description, price, quantity, currency, or image URL when those columns are in the export. These are review prompts, not an Etsy ranking score.",
  },
  {
    question: "Does the Etsy CSV checker upload my shop data?",
    answer:
      "No. The selected active-listings CSV is read in your browser and is not uploaded to our server. Site analytics do not receive listing text, tags, prices, or file contents.",
  },
  {
    question: "Does the listing checker predict Etsy ranking or search volume?",
    answer:
      "No. It finds formatting and catalogue patterns for you to review. It does not connect to Etsy search, see your shop statistics, estimate keyword demand, or predict sales.",
  },
  {
    question: "Are the fee and profit estimates exact?",
    answer:
      "They are estimates using standard US listing, transaction, and Etsy Payments rates. Country, taxes, Offsite Ads, refunds, currency conversion, renewals, and other charges can change the final amount. Confirm actual deductions in your Etsy Payment account.",
  },
  {
    question: "Is this an official Etsy tool?",
    answer:
      "No. This is an independent project and is not affiliated with or endorsed by Etsy. Always check Etsy's current rules and your Payment account.",
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
  name: "Etsy Listing CSV Checker by Listing Checkup",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Audit Etsy active-listings CSV files locally in the browser",
    "Summarize Etsy Order Items CSV sales by product or SKU locally in the browser",
    "Review title wording, tag limits, blank listing details, duplicate titles, repeated shop tags, and reused SKUs",
    "Check one Etsy tag list for count, character limits, and duplicates",
    "Estimate US Etsy fees, profit, and a target item price",
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f6f0] text-stone-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Listing Checkup home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-base font-bold text-emerald-100">LC</span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Listing Checkup</span>
              <span className="block text-xs text-stone-500">Free Etsy seller tools</span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-stone-600" aria-label="Main navigation">
            <a href="#csv-audit" className="transition hover:text-stone-950">CSV audit</a>
            <Link href="/etsy-sales-csv-analyzer" className="transition hover:text-stone-950">Sales report</Link>
            <Link href="/etsy-fee-calculator" className="transition hover:text-stone-950">Fee calculator</Link>
            <Link href="/etsy-tag-checker" className="transition hover:text-stone-950">Tag checker</Link>
            <Link href="/etsy-listing-csv-guide" className="transition hover:text-stone-950">CSV guide</Link>
            <Link href="/es/comprobador-csv-etsy" lang="es" hrefLang="es-ES" className="transition hover:text-stone-950">Español</Link>
          </nav>
        </header>

        <section className="grid gap-9 py-12 sm:py-16 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-950">
              Free Etsy CSV checker · No Etsy login
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              Check listings and summarize orders from your Etsy shop exports.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              Audit titles and tags across active listings, or group sold items by product from an Etsy orders export. Both CSV tools run in your browser; no Etsy login or file upload is needed.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#csv-audit" className="rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
                Audit my active listings
              </a>
              <Link href="/etsy-sales-csv-analyzer" className="rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-500">
                Summarize order CSV
              </Link>
            </div>
            <p className="mt-5 max-w-2xl text-xs leading-5 text-stone-500">
              Independent tools for review and planning. They do not edit your shop, promise sales, or predict search placement.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">Whole shop</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Etsy CSV listing audit</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Find title and tag patterns across active listings. Your file stays in this browser.</p>
              <a href="#csv-audit" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Open the CSV checker →</a>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">One order</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Fee and profit calculator</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">See common US fees, add costs, and work backward from your target profit.</p>
              <Link href="/etsy-fee-calculator" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Calculate an Etsy price →</Link>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">Sales by product</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Etsy Order Items CSV report</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Group sold items by SKU or title and see quantities and item value without uploading buyer data.</p>
              <Link href="/etsy-sales-csv-analyzer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Summarize Etsy sales →</Link>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">One listing</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">Etsy tag checker</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Count up to 13 tags, check the 20-character limit, and spot repeated tags before you save.</p>
              <Link href="/etsy-tag-checker" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Check Etsy tags →</Link>
            </article>
          </div>
        </section>

        <div id="csv-audit" className="scroll-mt-6">
          <EtsyCsvAuditor />
        </div>

        <section className="mt-10 grid gap-4 lg:grid-cols-2" aria-label="Etsy tools and guidance">
          <article className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Check one listing</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Count tags and characters before saving.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">Etsy allows up to 13 tags per listing and up to 20 characters in each. The checker catches format issues; it cannot tell whether a phrase matches what shoppers search for.</p>
            <Link href="/etsy-tag-checker" className="mt-4 inline-flex rounded-xl border border-stone-300 bg-[#f7f6f0] px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-emerald-700">Open the Etsy tag checker →</Link>
          </article>
          <article className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-800">Estimate one sale</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Include the costs a simple fee percentage misses.</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">Add buyer-paid shipping, postage, materials, packaging, labor, estimated sales tax, and an attributed Offsite Ads rate. Then solve for an item price that reaches a chosen profit.</p>
            <Link href="/etsy-fee-calculator" className="mt-4 inline-flex rounded-xl border border-stone-300 bg-[#f7f6f0] px-4 py-3 text-sm font-semibold text-stone-900 transition hover:border-emerald-700">Open the Etsy fee calculator →</Link>
          </article>
        </section>

        <section id="method" className="mt-14 scroll-mt-8 border-t border-stone-200 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Transparent checks</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Useful checks, with the limits stated plainly.</h2>
            <p className="mt-4 text-base leading-7 text-stone-600">The CSV audit is a local checklist, not an Etsy ranking score. The fee calculator is a planning estimate, not your final Payment account statement. Review every suggestion and check Etsy's latest seller guidance before changing a live listing.</p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-950">Listing titles</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Find very long wording, repeated words, subjective adjectives, and sales language for a human review.</p>
              <a href="https://www.etsy.com/seller-handbook/article/1399426136697" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Etsy title guidance ↗</a>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-950">Tags</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Check the 13-tag limit, tag length, duplicates in a listing, and patterns repeated across a shop export.</p>
              <a href="https://help.etsy.com/hc/en-us/articles/360000336307-How-to-Use-Tags-to-Get-Found-in-Search" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Etsy tag guidance ↗</a>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="font-semibold text-stone-950">Fees and profit</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">Estimate common US order fees, include your own costs, and test an Offsite Ads charge or target price.</p>
              <a href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Etsy fee guidance ↗</a>
            </article>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <article className="rounded-2xl border border-stone-200 bg-[#eeede4] p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Need actual search data?</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">A CSV audit cannot tell you what shoppers search for.</h3>
              <p className="mt-3 text-sm leading-6 text-stone-700">Use Etsy Shop Stats or a keyword research service to investigate demand. Check the plan, limits, and data source before relying on third-party estimates.</p>
              <a href={ERANK_HREF} target="_blank" rel={ERANK_REL} className="mt-4 inline-flex rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-900 hover:border-emerald-700">Explore eRank keyword tools ↗</a>
              <p className="mt-2 text-xs leading-5 text-stone-500">{ERANK_DISCLOSURE}</p>
            </article>
            <article className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Private by design</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">Your shop export stays on your device.</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">The CSV checker and fee estimate run in your browser. The site does not connect to Etsy, upload a shop file, or send listing text to an AI service.</p>
              <Link href="/privacy" className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Read the privacy note</Link>
            </article>
          </div>
        </section>

        <section className="mt-14 border-t border-stone-200 pt-12 sm:pt-16" aria-labelledby="faq-heading">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">Frequently asked questions</p>
            <h2 id="faq-heading" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">About the Etsy CSV checker and seller tools</h2>
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
          <p>Listing Checkup · Independent Etsy seller tools · Fee notes reviewed September 25, 2026.</p>
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
