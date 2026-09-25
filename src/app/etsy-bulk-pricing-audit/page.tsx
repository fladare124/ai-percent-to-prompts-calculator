import type { Metadata } from "next";
import Link from "next/link";
import EtsyBulkPricingAudit from "@/components/EtsyBulkPricingAudit";
import EtsyPageShell from "@/components/EtsyPageShell";

const canonical = "/etsy-bulk-pricing-audit";

export const metadata: Metadata = {
  title: "Etsy US Price Planner | Bulk Tariff and Margin Report",
  description:
    "Plan US-specific Etsy prices across listings. Import a CSV, add unit costs and Etsy tariff estimates by SKU, and review target margins privately in your browser.",
  robots: { index: false, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, "es-ES": "/es/planificador-precios-etsy-eeuu" },
  },
  openGraph: {
    title: "Etsy US-Specific Price Planner",
    description:
      "Build a bulk US-price plan from your listings, costs and Etsy's estimated tariff per item.",
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
    question: "How do I add costs and US tariff estimates?",
    answer:
      "Import a CSV with SKU, Unit Cost and US Tariff Estimate columns, or enter both values in the report table. Include materials, packaging and labor in unit cost. Copy the US tariff estimate from Etsy's own estimator; enter 0 when no tariff applies. Enter postage separately in the fee assumptions.",
  },
  {
    question: "Does this tool calculate customs duties or choose an HTS code?",
    answer:
      "No. It uses the tariff amount you enter from Etsy's US estimated tariffs calculator. Etsy says its estimator is for sellers outside the US and is currently unavailable for listings with price variations. This tool does not calculate duties, select or validate customs codes, or replace carrier or customs guidance.",
  },
  {
    question: "Which currency should I enter?",
    answer:
      "Use one currency throughout: the currency shown for the listings CSV. If Etsy shows a tariff estimate in another currency, convert it before entering it. This tool does not convert currencies.",
  },
  {
    question: "Are the profit and target-price results exact?",
    answer:
      "No. They are planning estimates for one typical order using the fee rates, costs and shipping amounts you enter. The report treats your Etsy tariff estimate as a fixed per-order cost while solving for a different target price. Etsy's estimator asks for the item's price, so recheck the estimate in Etsy using the suggested price before applying it. Discounts, buyer taxes, refunds, ad attribution, currency conversion, fee credits, renewal timing and other account activity can change actual results.",
  },
  {
    question: "Does this update my Etsy listing prices?",
    answer:
      "No. It reads the price column in your active-listings CSV as a baseline and creates a downloadable US price plan. It does not connect to or make changes in your Etsy shop. Compare the result with any US-specific price already saved in Etsy before applying it.",
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
        eyebrow="Free Etsy US price planner · Bulk listing CSV · For international sellers"
        title="Plan Etsy US-specific prices for duty-paid orders"
        intro="For Etsy shops outside the US shipping to US buyers with duties prepaid (Delivered Duty Paid, or DDP): add each item’s cost and Etsy’s US tariff estimate, then compare estimated profit with a suggested US-specific price for your target margin. The report stays in your browser and never changes your Etsy shop."
      >
        <EtsyBulkPricingAudit />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">How the Etsy US price plan works</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>Export your currently-for-sale listings from Etsy and choose the CSV in the report above.</li>
            <li>For each item, copy the US tariff estimate from Etsy’s listing editor when you plan to prepay duties. Etsy says its estimator is for sellers outside the US, is currently unavailable for listings with price variations, and can differ from the final duty amount.</li>
            <li>Import a cost CSV with <strong>SKU</strong>, <strong>Unit Cost</strong> and <strong>US Tariff Estimate</strong> columns, or fill the values in the table. Use 0 when no tariff applies or you do not expect to pay it.</li>
            <li>Keep costs, tariff estimates, shipping and fees in the listing currency. Set payment-processing fees for the country of your Etsy account, plus expected US-order shipping and postage.</li>
            <li>Review the estimated margin and suggested US-specific price, then download the plan CSV. The report holds the tariff estimate you entered as a fixed cost; before applying the suggested price, recheck Etsy’s estimate using that proposed price and review the result in your shop.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy’s listing export includes title, price, currency, quantity and SKU when one is set. See Etsy’s current <a href="https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">listing export instructions ↗</a>. For tariffs, follow Etsy’s <a href="https://help.etsy.com/hc/en-us/articles/40309848355735-How-to-Use-Etsy-s-US-Estimated-Tariffs-Calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">US estimated tariffs guide ↗</a>.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">What the US price estimate includes</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The report uses the Price column in your listings CSV as the base price. It adds the buyer-paid shipping amount you enter, subtracts your unit cost, postage and entered US tariff estimate, then estimates percentage and fixed Etsy fees. The tariff estimate is treated as a seller-paid per-order cost; use it for a DDP plan or another setup where you expect to pay the duty. Set payment-processing fees for your Etsy account country, which can differ from the buyer’s country.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The suggested US-specific price solves for the margin you choose under the same assumptions, with the entered tariff held fixed. Etsy asks for the item’s price when estimating tariffs, so this report does not recalculate the tariff at the suggested price. The CSV’s base price may not be the separate US-specific price already saved in your shop, so compare those values and recheck Etsy’s estimate before applying a change. Etsy’s current <a href="https://help.etsy.com/hc/en-us/articles/4403156582039-How-to-Add-Domestic-Global-and-US-Specific-Pricing-to-Your-Listings" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">regional pricing instructions ↗</a> explain how to manage domestic, global and US-specific prices.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            The tool does not estimate or validate tariffs, HTS codes, brokerage, carrier charges or customs requirements. If the buyer is expected to pay import charges on delivery, do not count those charges as your own cost in this planner. Etsy describes its US tariff results as estimates that may differ from the amount charged. Review Etsy’s official <a href="https://help.etsy.com/hc/en-us/articles/40309848355735-How-to-Use-Etsy-s-US-Estimated-Tariffs-Calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">tariff guidance ↗</a> and current <a href="https://help.etsy.com/hc/en-us/articles/360035902374-Etsy-Fee-Basics" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">fee guidance ↗</a> before making shipping or pricing decisions.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Keep the tariff estimate tied to the right item</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Etsy’s estimator depends on the item description or customs code, country of origin and shipping details. Use the estimate for the matching SKU, and recheck it if the item or shipping setup changes. This report treats your entered estimate as a per-order cost; it does not decide whether an item is subject to duty.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Apply the plan in Etsy</h2>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            This report prepares prices for review; it does not upload them. Etsy has its own bulk editing for domestic, global and US-specific listing prices, including edits for up to 500 listings at a time. Review Etsy’s <a href="https://help.etsy.com/hc/en-us/articles/4403156582039-How-to-Add-Domestic-Global-and-US-Specific-Pricing-to-Your-Listings" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">current bulk pricing instructions ↗</a> and verify each final price in your shop.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Related Etsy seller tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link href="/" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Review listing titles, tags and catalogue patterns →</Link>
            <Link href="/etsy-fee-calculator" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Estimate fees for one Etsy order →</Link>
            <Link href="/etsy-restock-planner" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Plan Etsy inventory replenishment →</Link>
            <Link href="/etsy-listing-csv-guide" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Download your Etsy active-listings CSV →</Link>
            <Link href="/es/planificador-precios-etsy-eeuu" hrefLang="es-ES" className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-emerald-950 hover:border-emerald-700">Ver el planificador en español →</Link>
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
