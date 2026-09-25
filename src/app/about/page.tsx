import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "About the Etsy Listing CSV Checker",
  description:
    "Learn how the independent Etsy listing checker works, which official seller rules it checks, and what it cannot measure.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SitePageShell
      eyebrow="About this project"
      title="A practical checkup for Etsy listing exports."
      intro="Listing Checkup is a free tool from Percent to Prompts. It reviews an Etsy active-listings CSV in your browser and turns its findings into a report you can use before editing your shop."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What it checks</h2>
        <p className="mt-3 text-base leading-7">
          The audit flags title patterns that Etsy’s public guidance asks sellers to consider: long or hard-to-scan wording, repeated terms, subjective descriptions, and sales or shipping text. It checks that listings use no more than 13 tags, each tag is no longer than 20 characters, and it surfaces normalized tag reuse across listings as well as duplicates within a listing.
        </p>
        <p className="mt-3 text-base leading-7">
          The checks are intentionally visible and simple. They are prompts for human review, not an Etsy quality score. Repeated tags, long titles or gifting phrases are not automatically wrong in every context.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What it cannot measure</h2>
        <p className="mt-3 text-base leading-7">
          The checker cannot access Etsy search volume, competition, impressions, clicks, sales or conversion data. It does not connect to a shop, change a listing, or predict that a title will rank. Use Etsy Shop Stats and keyword research for those questions, then make changes gradually and compare your own results.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Sources and independence</h2>
        <p className="mt-3 text-base leading-7">
          The title and tag reminders are based on public Etsy seller resources, including Etsy’s <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://www.etsy.com/seller-handbook/article/1399426136697" target="_blank" rel="noopener noreferrer">updated title guidance</a> and <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://help.etsy.com/hc/en-us/articles/360000336307-How-to-Use-Tags-to-Get-Found-in-Search" target="_blank" rel="noopener noreferrer">tag requirements</a>. We last checked those pages on September 25, 2026. Etsy may update its guidance, so always confirm important decisions against Etsy’s current rules.
        </p>
        <p className="mt-3 text-base leading-7">
          Percent to Prompts is not affiliated with or endorsed by Etsy, eRank or another marketplace research service. We do not claim a professional certification or access to Etsy’s internal search systems.
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-stone-950">Privacy by design</h2>
        <p className="mt-2 text-sm leading-6">Your CSV is processed in your browser. The file’s listing text is not sent to us. A review prompt is created locally and copied only when you choose to copy it.</p>
        <Link href="/privacy" className="mt-3 inline-flex font-semibold text-emerald-900 underline underline-offset-4">Read the privacy note</Link>
      </section>

      <p className="text-xs leading-5 text-stone-500">Project and guidance reviewed September 25, 2026.</p>
    </SitePageShell>
  );
}
