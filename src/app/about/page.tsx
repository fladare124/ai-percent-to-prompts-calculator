import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";

export const metadata: Metadata = {
  title: "About Listing Checkup: Free Etsy Seller Tools",
  description:
    "How Listing Checkup's Etsy title and tag checkers, sales and stock CSV tools, and US fee estimate work—and what each cannot measure.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <EtsyPageShell
      eyebrow="About Listing Checkup"
      title="Free, independent tools for Etsy sellers."
      intro="Listing Checkup brings together private title and tag checks, Etsy CSV reports for sales and stock planning, and a US fee and profit estimate. The tools run in your browser and do not connect to your shop."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What the tools check</h2>
        <p className="mt-3 text-base leading-7">
          The listing audit flags title patterns that Etsy’s public guidance asks sellers to consider: long or hard-to-scan wording, repeated terms, subjective descriptions, and sales or shipping text. It checks the 13-tag and 20-character limits, duplicate tags, repeated tags across listings, and exact duplicate titles. The fee tool estimates common US charges for one order and works backward from a target profit.
        </p>
        <p className="mt-3 text-base leading-7">
          These are prompts for human review, not an Etsy quality or ranking score. Repeated tags, long titles, and gifting phrases are not automatically wrong in every context. Profit estimates do not replace an Etsy Payment account statement.
        </p>
        <p className="mt-3 text-base leading-7">
          The single-title checker counts characters and words and flags a few wording patterns for review. The sales and stock tools summarize selected Etsy CSV exports; they do not forecast demand or include profit in the restock report. Files are read locally in your browser.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What it cannot measure</h2>
        <p className="mt-3 text-base leading-7">
          The tools cannot access Etsy search volume, competition, impressions, clicks, orders, or conversion data. They do not connect to a shop, change a listing, or predict sales or rank. Use Etsy Shop Stats and keyword research for demand, and your Etsy Payment account for actual fees.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Sources and independence</h2>
        <p className="mt-3 text-base leading-7">
          The listing checks are based on public Etsy seller resources, including Etsy’s <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://www.etsy.com/seller-handbook/article/1399426136697" target="_blank" rel="noopener noreferrer">updated title guidance</a> and <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://help.etsy.com/hc/en-us/articles/360000336307-How-to-Use-Tags-to-Get-Found-in-Search" target="_blank" rel="noopener noreferrer">tag requirements</a>. The fee estimate is based on Etsy’s <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics" target="_blank" rel="noopener noreferrer">fee basics</a>, <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy" target="_blank" rel="noopener noreferrer">payment processing rates</a>, and <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work" target="_blank" rel="noopener noreferrer">Offsite Ads policy</a>. We last checked these pages on September 25, 2026. Etsy may update its guidance, so confirm important decisions against Etsy’s current rules.
        </p>
        <p className="mt-3 text-base leading-7">
          Listing Checkup is not affiliated with or endorsed by Etsy, eRank, or another marketplace research service. We do not claim a professional certification or access to Etsy’s internal search systems.
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-stone-950">Privacy by design</h2>
        <p className="mt-2 text-sm leading-6">Your CSV and calculator inputs are processed in your browser. Listing content and tool inputs are not sent to us.</p>
        <Link href="/privacy" className="mt-3 inline-flex font-semibold text-emerald-900 underline underline-offset-4">Read the privacy note</Link>
      </section>

      <p className="text-xs leading-5 text-stone-500">Project and guidance reviewed September 25, 2026.</p>
    </EtsyPageShell>
  );
}
