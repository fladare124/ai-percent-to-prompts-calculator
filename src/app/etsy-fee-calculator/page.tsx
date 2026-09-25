import type { Metadata } from "next";
import Link from "next/link";
import EtsyFeeCalculator from "@/components/EtsyFeeCalculator";
import EtsyPageShell from "@/components/EtsyPageShell";

export const metadata: Metadata = {
  title: "Etsy Fee Calculator & Profit Calculator for US Sellers",
  description:
    "Estimate Etsy listing, transaction, payment processing, and Offsite Ads fees. Add real costs and calculate the item price for your target profit.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/etsy-fee-calculator" },
  openGraph: {
    title: "Etsy Fee and Profit Calculator",
    description:
      "Estimate common US Etsy fees, include your product and shipping costs, and work backward from a target profit.",
    url: "/etsy-fee-calculator",
    type: "website",
  },
};

const faq = [
  {
    question: "What fees does this Etsy calculator include?",
    answer:
      "For a one-item US order, it estimates the $0.20 listing fee, 6.5% transaction fee, 3% plus $0.25 Etsy Payments processing fee, and an optional 12% or 15% Offsite Ads fee capped at $100 per order.",
  },
  {
    question: "Does Etsy charge its transaction fee on shipping?",
    answer:
      "Etsy says the 6.5% transaction fee applies to the total order amount, including the item price and shipping (and gift wrap if charged). The calculator includes those amounts in its estimate.",
  },
  {
    question: "Does the calculator know the exact sales tax for a buyer?",
    answer:
      "No. Sales tax varies by buyer location. You can enter an estimated rate to approximate its effect on US payment processing, but Etsy determines and collects applicable taxes for each order.",
  },
  {
    question: "Does this cover every Etsy fee or tax?",
    answer:
      "No. It estimates common fees for one US order and does not include income tax, refunds, currency conversion, taxes on seller fees, Etsy Ads, deposits, or multi-quantity renewals. Check your Etsy Payment account for actual charges.",
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

export default function EtsyFeeCalculatorPage() {
  return (
    <EtsyPageShell
      eyebrow="Etsy fee calculator · US sellers"
      title="Estimate Etsy fees, profit, and the price to charge."
      intro={<>Enter the amount a buyer pays, your product and fulfilment costs, and an optional Offsite Ads rate. The calculator estimates one order and can solve backward from your target profit. These are planning figures; confirm actual charges in your Etsy Payment account.</>}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <EtsyFeeCalculator />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Etsy fees included in this estimate</h2>
        <p className="mt-3 text-base leading-7">
          For US Etsy Payments orders, this calculator starts with three common seller charges. Etsy can change its policies, and the payment processing rate depends on the country where your bank account is located.
        </p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="grid gap-1 border-b border-stone-200 p-4 sm:grid-cols-[12rem_1fr] sm:p-5">
            <h3 className="font-semibold text-stone-950">Listing fee</h3>
            <p className="text-sm leading-6 text-stone-600">$0.20 per listing. A listing may incur another $0.20 renewal charge when it renews after a sale or expiration.</p>
          </div>
          <div className="grid gap-1 border-b border-stone-200 p-4 sm:grid-cols-[12rem_1fr] sm:p-5">
            <h3 className="font-semibold text-stone-950">Transaction fee</h3>
            <p className="text-sm leading-6 text-stone-600">6.5% of the order amount, including the item price, buyer-paid shipping, and gift wrap if charged.</p>
          </div>
          <div className="grid gap-1 border-b border-stone-200 p-4 sm:grid-cols-[12rem_1fr] sm:p-5">
            <h3 className="font-semibold text-stone-950">Payment processing</h3>
            <p className="text-sm leading-6 text-stone-600">For US sellers, 3% of the total sale price plus $0.25 per order. Processing fees also apply to applicable sales tax.</p>
          </div>
          <div className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:p-5">
            <h3 className="font-semibold text-stone-950">Offsite Ads</h3>
            <p className="text-sm leading-6 text-stone-600">When a sale is attributed to an Offsite Ad, the rate is 15% below $10,000 in Etsy sales in a 365-day period, or 12% at or above that threshold. The fee is capped at $100 per order.</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-emerald-900">
          <a href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Etsy fee basics ↗</a>
          <a href="https://help.etsy.com/hc/en-us/articles/115015628847-What-are-Payment-Processing-Fees-for-Selling-on-Etsy" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Payment processing by country ↗</a>
          <a href="https://help.etsy.com/hc/en-us/articles/360000338367-How-Etsy-s-Offsite-Ads-Work" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Offsite Ads rates and cap ↗</a>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-stone-950">What this Etsy profit estimate leaves out</h2>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Your actual deposit can also reflect refunds, currency conversion, taxes on seller fees, Etsy Ads, deposit charges, and listing renewals. The buyer tax field is an optional estimate; Etsy determines tax by order location. The result is not an accounting or tax report and should not replace your Payment account records.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Related Etsy seller tools</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/etsy-bulk-pricing-audit" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Plan US-specific prices across active listings →</Link>
          <Link href="/" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Audit titles and tags across an active-listings CSV →</Link>
          <Link href="/etsy-tag-checker" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Check one Etsy listing&apos;s tags →</Link>
          <Link href="/etsy-listing-csv-guide" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Download Etsy active listings as a CSV →</Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {faq.map((item) => (
            <details key={item.question} className="group rounded-xl border border-stone-200 bg-white p-4">
              <summary className="cursor-pointer font-semibold text-stone-950">{item.question}</summary>
              <p className="mt-2 text-sm leading-6 text-stone-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="text-xs leading-5 text-stone-500">Independent calculator, not affiliated with Etsy. Rates last checked September 25, 2026. Etsy’s official fee pages are the source of truth.</p>
    </EtsyPageShell>
  );
}
