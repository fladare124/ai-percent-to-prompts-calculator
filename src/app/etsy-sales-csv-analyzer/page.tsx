import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsySalesCsvAnalyzer from "@/components/EtsySalesCsvAnalyzer";

const canonical = "/etsy-sales-csv-analyzer";

export const metadata: Metadata = {
  title: "Etsy Sales by Product CSV Analyzer | Free Order Items Report",
  description:
    "Summarize Etsy Order Items CSV sales by product or SKU. See item rows, quantities, order counts and item value privately in your browser.",
  robots: { index: true, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "Free Etsy Sales by Product CSV Analyzer",
    description:
      "Group Etsy Order Items CSV rows by product or SKU and download a private sales summary. No sign-in or file upload.",
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
    question: "Does this report show profit or Etsy Stats revenue?",
    answer:
      "No. It groups item prices from the selected CSV and does not calculate profit, subtract discounts or fees, or reconcile shipping, taxes, refunds, or cancellations. Etsy Stats revenue can use different rules.",
  },
  {
    question: "Is my Etsy order file uploaded?",
    answer:
      "No. The file is read in your browser. The summary and downloaded report do not include buyer names or addresses.",
  },
  {
    question: "How are products grouped?",
    answer:
      "Rows are grouped by SKU when one is available, otherwise by product title. Order counts need an Order ID column. If there is no quantity column, unit counts are unavailable and each row is treated as one item for the item-value summary; blank quantities in an existing column are counted as one and flagged.",
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
        eyebrow="Free Etsy sales report · No upload or sign-in"
        title="See Etsy sales by product from an Order Items CSV"
        intro="Group sold item rows by SKU or title, then review units and item value from the period in your Etsy export. The file is processed privately in your browser."
      >
        <EtsySalesCsvAnalyzer />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What the Etsy sales report shows</h2>
          <p className="mt-3 text-base leading-7">
            The report groups rows by SKU when a SKU is present, or by product title when it is not. It shows included item rows, quantity when available, distinct order IDs when available, and item value in separate currency totals. You can download the grouped summary as a CSV.
          </p>
          <p className="mt-3 text-base leading-7">
            Use the export period you selected in Etsy to compare which products moved more units or contributed more item value. The result is a quick product overview; it is not an Etsy search ranking, demand forecast, or profit calculation.
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
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Item value is not profit or Etsy Stats revenue</h2>
          <p className="mt-3 text-base leading-7">
            This tool summarizes item prices in the selected export. It does not subtract Etsy fees, discounts, shipping, taxes, materials, refunds, or cancellations, and it cannot account for your production costs. Etsy explains that Shop Stats revenue usually subtracts buyer discounts and excludes selling fees, shipping costs, and fully refunded or cancelled orders. The totals can therefore differ; use your Etsy Payment account and <a href="https://help.etsy.com/hc/en-us/articles/360016388633-How-Is-Revenue-in-My-Shop-Stats-Calculated" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy’s revenue guidance ↗</a> for reconciliation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Keep buyer details out of the summary</h2>
          <p className="mt-3 text-base leading-7">
            Etsy exports can contain customer information. This analyzer keeps the file in your browser and only puts product names, SKUs, quantities, order counts, and amounts into the summary. The downloaded report does not include names, addresses, or order IDs.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Want to review active listings too?</h2>
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
