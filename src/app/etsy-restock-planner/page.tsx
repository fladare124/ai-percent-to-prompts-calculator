import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyRestockPlanner from "@/components/EtsyRestockPlanner";

const canonical = "/etsy-restock-planner";
const spanishRoute = "/es/planificador-reposicion-etsy";

export const metadata: Metadata = {
  title: "Etsy Restock Planner from CSV | Free Inventory Report",
  description:
    "Combine Etsy active listings and Order Items CSV exports to estimate stock coverage and suggested restocks. Free, private and no Etsy login.",
  robots: { index: false, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, "es-ES": spanishRoute },
  },
  openGraph: {
    title: "Free Etsy Restock Planner from CSV",
    description:
      "Match current Etsy listing quantities with sold units from your own exports. Files stay in your browser.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "Which Etsy files does the restock planner use?",
    answer:
      "It combines the active listings CSV with one or more Order Items CSV exports from the same shop. The active listing export needs title and quantity columns; SKU is recommended. Order exports need item titles; SKU and quantity improve matching and unit counts.",
  },
  {
    question: "Does the Etsy restock planner update my shop?",
    answer:
      "No. The tool reads the selected files locally in your browser and creates a report. It does not connect to or change your Etsy account.",
  },
  {
    question: "How does it calculate the suggested restock quantity?",
    answer:
      "It divides the units in the selected order exports by the sales-period days you enter, multiplies the average by your lead time plus safety buffer, subtracts current stock, and rounds up. It is a planning estimate, not a demand forecast.",
  },
  {
    question: "How are sold items matched to active listings?",
    answer:
      "The tool first matches normalized SKUs. If no SKU match is found, it tries an exact normalized title match when only one active listing has that title. Changed titles, ambiguous titles and missing listings may remain unmatched.",
  },
  {
    question: "Does the report include profit or Etsy fees?",
    answer:
      "No. The restock report uses product names, SKUs, quantities and stock counts. It does not include revenue, Etsy fees, materials, shipping costs or profit.",
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

export default function EtsyRestockPlannerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        eyebrow="Etsy inventory tool · Free CSV restock planner"
        title="Plan Etsy restocks with your active listings and order exports"
        intro="Match the stock quantity in your active listings CSV with units sold in your Order Items exports. Estimate stock coverage and a restock amount for the lead time you choose, without connecting your Etsy account."
      >
        <EtsyRestockPlanner />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What you need for an Etsy restock report</h2>
          <p className="mt-3 text-base leading-7">
            Download your active listings CSV and one or more Order Items CSVs from the same Etsy shop. The listings file supplies current quantities; the order files supply sold units for the period you want to review. Use the period-days field in the planner to tell it how many days those sales cover.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
            <li>In Etsy Shop Manager, open <strong>Settings → Options → Download Data</strong>.</li>
            <li>Download the CSV for active listings.</li>
            <li>Under Orders, choose <strong>Order Items</strong> and select the month or year to review.</li>
            <li>Choose both exports above, then enter the number of sales days and your typical restock lead time.</li>
          </ol>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Etsy’s <a href="https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">active-listings export guide ↗</a> describes the listing fields, including quantity and SKU when added. See Etsy’s <a href="https://help.etsy.com/hc/en-us/articles/360000343328-How-to-Download-a-Spreadsheet-of-Your-Sold-Transactions" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">sold transaction export guide ↗</a> for order-file options.
          </p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">How the stock estimate works</h2>
          <p className="mt-3 text-base leading-7">
            Average daily sales are the units in your uploaded order files divided by the sales-period days you enter. Estimated stock coverage is current listing quantity divided by that daily average. Suggested replenishment is the demand over your chosen lead time plus safety buffer, minus the stock already listed.
          </p>
          <p className="mt-3 text-base leading-7">
            The estimate assumes the exports cover the period you entered and that the same order is not present in more than one file. It does not predict seasonal changes or automatically adjust stock. Review unmatched sales and your current Etsy inventory before acting.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Match by SKU, then by exact title</h2>
          <p className="mt-3 text-base leading-7">
            A SKU is the most reliable way to connect sold items to active listings. If an order row has no matching SKU, the planner tries an exact title match after normalizing punctuation, spaces and letter case. Edited titles, ambiguous duplicate titles, bundles, and listing variations may need manual review. The report shows sold units that could not be matched.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Private, local CSV processing</h2>
          <p className="mt-3 text-base leading-7">
            Both files are read in your browser. Nothing is uploaded to this site; buyer names, addresses and order IDs are not included in the restock report. This independent tool cannot edit your Etsy listings or see your live shop inventory.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Review the rest of your shop data</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6">
            <Link href="/" className="font-semibold text-emerald-900 underline underline-offset-4">Audit active listing details</Link>
            <Link href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Estimate profit by SKU</Link>
            <Link href="/etsy-tag-checker" className="font-semibold text-emerald-900 underline underline-offset-4">Check Etsy tags</Link>
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
