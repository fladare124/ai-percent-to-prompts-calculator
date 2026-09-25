import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsySalesCsvAnalyzer from "@/components/EtsySalesCsvAnalyzer";

const canonical = "/etsy-sales-csv-analyzer";

export const metadata: Metadata = {
  title: "Etsy Profit by SKU from CSV | Free Profit Analyzer",
  description:
    "Estimate Etsy contribution by product from an Order Items CSV. Add unit costs and fee assumptions, compare margins by SKU, and keep your data in your browser.",
  robots: { index: false, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Free Etsy Profit by SKU CSV Analyzer",
    description:
      "Estimate contribution by Etsy product using a private Order Items CSV report with your own unit costs and fee assumptions.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "Which Etsy CSV should I upload?",
    answer:
      "Choose the Order Items CSV in Etsy Shop Manager under Settings, Options, Download Data, then Orders. Select Order Items, choose a month or year, and download the file.",
  },
  {
    question: "How does the Etsy profit by SKU estimate work?",
    answer:
      "It groups sold item value by SKU (or title), subtracts the all-in cost you enter per unit and the fee percentage you enter, then allocates a fixed per-order fee across products in that order by item value. It is an estimate based on your assumptions, not an Etsy account reconciliation.",
  },
  {
    question: "Does this show exact Etsy profit?",
    answer:
      "No. The Order Items export alone does not contain every cost or adjustment. The estimate does not reconcile refunds, cancellations, buyer-paid shipping, sales taxes, ad attribution, or every payment-account charge. Use your Payment account and a qualified accounting professional for financial or tax decisions.",
  },
  {
    question: "Is my Etsy order file uploaded?",
    answer:
      "No. The file is read in your browser. The summary and downloaded report do not include buyer names or addresses.",
  },
  {
    question: "How are products grouped?",
    answer:
      "Rows are grouped by SKU when one is available, otherwise by product title. Order counts need an Order ID column. If there is no quantity column, cost estimates assume one unit per row and the report warns you; blank or unreadable quantities are also assumed to be one. Fixed per-order fees cannot be allocated to rows with no order ID.",
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

export default function EtsySalesCsvAnalyzerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        eyebrow="Free Etsy profit by SKU estimate · Private CSV"
        title="Estimate Etsy profit by product from your sales CSV"
        intro="Group sold items by SKU or title, add your all-in cost per unit and effective fee assumptions, then compare estimated contribution and margin across products. The file stays in your browser."
      >
        <EtsySalesCsvAnalyzer />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Compare estimated contribution across products</h2>
          <p className="mt-3 text-base leading-7">
            The report groups rows by SKU when one is present, or by product title when it is not. Enter the full cost to make and fulfill one unit, then add your own effective percentage fee and fixed fee per order for each currency. Download the resulting product summary as a CSV for further sorting or review.
          </p>
          <p className="mt-3 text-base leading-7">
            A product’s estimate is item value in the export, minus unit costs for sold quantities, minus your percentage fee assumption and an allocated share of fixed fees for each order. The report does not infer or change your Etsy rates.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">What to include in your assumptions</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
            <li><strong>All-in unit cost:</strong> materials or production, labor, packaging, and postage you paid for the item.</li>
            <li><strong>Percentage fees:</strong> enter the effective rate you want to account for, using your own Etsy Payment account as the reference. The tool starts blank.</li>
            <li><strong>Fixed order fee:</strong> enter the fixed amount you want included. When order IDs are present, it is shared among items in that order in proportion to their item value.</li>
          </ul>
          <p className="mt-3 text-sm leading-6 text-stone-700">For a large catalogue, download the unit cost template in the tool, fill it in, and import the CSV. It matches by SKU or product title; include a currency on each row when the sales report uses more than one.</p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Need to review your Etsy Payment account activity?</h2>
          <p className="mt-3 text-base leading-7">
            The Order Items report estimates product contribution from sold items and assumptions. To group the actual signed values in a Monthly Statement CSV by activity type and currency, use the <a href="/etsy-payment-statement-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy monthly statement analyzer</a>. It does not assign every statement fee to an SKU or calculate accounting profit.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Download the Order Items CSV from Etsy</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>Sign in to Etsy.com and open Shop Manager.</li>
            <li>Go to <strong>Settings</strong>, then <strong>Options</strong>, then <strong>Download Data</strong>.</li>
            <li>Under Orders, select <strong>Order Items</strong> as the CSV type and choose a month or year.</li>
            <li>Download the CSV and select it in the analyzer above.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy says its sold transaction spreadsheets can include item price, item title, and SKU when you have added one. Check Etsy’s current <a href="https://help.etsy.com/hc/en-us/articles/360000343328-How-to-Download-a-Spreadsheet-of-Your-Sold-Transactions" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">download instructions ↗</a> if the menu or fields have changed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">A planning estimate, not your Etsy net profit</h2>
          <p className="mt-3 text-base leading-7">
            The estimate applies your entered percentage fee only to item value in the CSV. The export may not include buyer-paid shipping or every discount and adjustment. The calculation does not reconcile refunds, cancellations, taxes, offsite-ad attribution, actual postage purchases or all Etsy Payment account activity. Etsy distinguishes order totals, revenue, deposits and net profit, so compare financial records in the Payment account and use <a href="https://help.etsy.com/hc/en-us/articles/360016389293-How-Is-the-Total-on-My-1099-K-Calculated" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy’s explanation of its financial totals ↗</a> before relying on a number.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Keep buyer details out of the summary</h2>
          <p className="mt-3 text-base leading-7">
            Etsy exports can contain customer information. This analyzer keeps the file in your browser and only puts product names, SKUs, quantities, order counts, and amounts into the summary. The downloaded report does not include names, addresses, or order IDs.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Continue with the rest of your shop review</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">
            Use the <Link href="/" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy active-listings CSV checker</Link> to review listing titles and tags across your shop. It reads the listing export locally and does not change your Etsy shop.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            To compare sold units with current listing quantities, open the <Link href="/etsy-restock-planner" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy restock planner</Link>.
          </p>
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
