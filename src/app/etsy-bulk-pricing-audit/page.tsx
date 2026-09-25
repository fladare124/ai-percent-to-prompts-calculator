import type { Metadata } from "next";
import Link from "next/link";
import EtsyBulkPricingAudit from "@/components/EtsyBulkPricingAudit";
import EtsyPageShell from "@/components/EtsyPageShell";
import { ERANK_DISCLOSURE, ERANK_HREF, ERANK_REL } from "@/lib/partners";

const canonical = "/etsy-bulk-pricing-audit";

export const metadata: Metadata = {
  title: "Etsy Bulk Pricing Audit | Profit Margin by Listing",
  description:
    "Review estimated Etsy profit margins across active listings. Import a listings CSV, add unit costs by SKU, and compare current prices with a target margin privately in your browser.",
  robots: { index: true, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Free Etsy Bulk Pricing Audit",
    description:
      "Review listing prices and estimated margins across your Etsy catalogue with a private, browser-based CSV report.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "Which Etsy CSV should I use?",
    answer:
      "Use the currently-for-sale listings CSV from Etsy Shop Manager. It includes listing titles, prices, quantities and currency, and can include SKUs when you have added them.",
  },
  {
    question: "How do I add my product costs?",
    answer:
      "Import a second CSV with SKU and Unit Cost columns, or enter the unit cost in the report table. Include the production, materials, packaging and labor costs you want to count for each item. Enter postage separately in the fee assumptions.",
  },
  {
    question: "Are the profit and target-price results exact?",
    answer:
      "No. They are planning estimates for one typical order using the fee rates, costs and shipping amounts you enter. Discounts, buyer taxes, refunds, ad attribution, currency conversion, fee credits, renewal timing and other account activity can change actual results.",
  },
  {
    question: "Does this update my Etsy listing prices?",
    answer:
      "No. It reads a copy of your active-listings CSV and creates a downloadable pricing report. It does not connect to or make changes in your Etsy shop.",
  },
  {
    question: "Are my shop files uploaded?",
    answer:
      "No. The listing and cost files are read in your browser. They are not uploaded to our server.",
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

export default function EtsyBulkPricingAuditPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        eyebrow="Free Etsy pricing report · Multi-listing CSV · No upload"
        title="Audit Etsy prices across your whole catalogue"
        intro="Compare estimated profit per order at each current listing price, add your own SKU costs, and calculate a price for your target margin. The report runs in your browser and never changes your Etsy shop."
      >
        <EtsyBulkPricingAudit />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">How the Etsy bulk pricing audit works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>Export your currently-for-sale listings from Etsy and choose the CSV in the report above.</li>
            <li>Add a unit cost to each listing, or import a cost CSV with one <strong>SKU</strong> and <strong>Unit Cost</strong> per row.</li>
            <li>Set the Etsy fee rates and typical shipping amounts for your shop and target margin.</li>
            <li>Review the estimated profit, margin and suggested price, then download the report CSV if it helps your planning.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy’s listing export includes title, price, currency, quantity and SKU when one is set. See Etsy’s current <a href="https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">listing export instructions ↗</a> if the download steps or available fields change.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">What the estimate includes</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The report starts with one item at the price in your listings CSV. It adds the buyer-paid shipping amount you enter, subtracts your unit and postage costs, and estimates percentage and fixed Etsy fees using the assumptions shown above the table. You can edit those assumptions for your payment-account country and shop.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The target price solves for the margin you choose under those same assumptions. Review it before changing a live price; each order, discount, tax treatment and ad attribution can produce different fees.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Etsy’s transaction fee applies to the order amount, including buyer-paid shipping and gift wrap. Payment processing rates vary by seller country, and Etsy may apply other fees and taxes. Check Etsy’s official <a href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">fee guidance ↗</a> and your Payment account before making business or tax decisions.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Pricing and search demand answer different questions</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            This report estimates whether your entered price and costs meet a margin target. It does not measure how often shoppers search for a phrase or predict Etsy placement. For keyword research, you can review an independent service such as eRank and check its data source and plan limits.
          </p>
          <a href={ERANK_HREF} target="_blank" rel={ERANK_REL} className="mt-4 inline-flex rounded-lg border border-emerald-900/20 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-950 hover:border-emerald-700">Explore eRank keyword tools ↗</a>
          <p className="mt-2 text-xs leading-5 text-stone-600">{ERANK_DISCLOSURE}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Related Etsy seller tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Review listing titles, tags and catalogue patterns →</Link>
            <Link href="/etsy-fee-calculator" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Estimate fees for one Etsy order →</Link>
            <Link href="/etsy-restock-planner" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Plan Etsy inventory replenishment →</Link>
            <Link href="/etsy-listing-csv-guide" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Download your Etsy active-listings CSV →</Link>
          </div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-stone-950">Frequently asked questions</h2>
          <div className="mt-4 grid gap-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-stone-950 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
                  {item.question}<span aria-hidden="true" className="float-right text-emerald-800 transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </EtsyPageShell>
    </>
  );
}
