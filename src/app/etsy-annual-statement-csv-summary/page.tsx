import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";

const canonical = "/etsy-annual-statement-csv-summary";

export const metadata: Metadata = {
  title: "Combine Etsy Monthly Statement CSVs into a Year Summary",
  description:
    "Learn how to combine Etsy Monthly Statement CSVs into annual activity totals, keep currencies separate, and understand what the numbers do and do not show.",
  robots: { index: true, follow: true },
  alternates: { canonical },
  openGraph: {
    title: "How to Combine Etsy Monthly Statement CSVs for a Year",
    description:
      "A practical guide to combining Etsy Payment account statements without treating the result as profit, a deposit reconciliation, or tax advice.",
    url: canonical,
    type: "article",
  },
};

const faq = [
  {
    question: "Can I combine Etsy monthly statement CSVs into a year summary?",
    answer:
      "Yes. Select one Monthly Statement CSV for each month you want to include, up to 12 files. The analyzer groups the signed totals by activity type and currency. It does not produce a month-by-month report.",
  },
  {
    question: "Does the annual summary show my actual profit?",
    answer:
      "No. It totals Etsy statement columns and does not subtract product materials, labor, packaging, or other costs outside the Payment account. It is not a profit-and-loss statement or tax calculation.",
  },
  {
    question: "Why might the summary not match my bank deposits?",
    answer:
      "Deposits depend on available funds and the deposit schedule. The Payment account can also include pending funds, refunds, fees, taxes, and other activity that does not correspond to a bank transfer in the same period.",
  },
  {
    question: "Are the statement files uploaded?",
    answer:
      "No. The analyzer reads the selected CSV files in your browser. It shows grouped totals and does not include the original transaction rows, buyer details, or order references in its download.",
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

export default function EtsyAnnualStatementCsvSummaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        eyebrow="Etsy Payment account · Monthly CSVs · Annual overview"
        title="How to combine Etsy monthly statement CSVs into a year summary"
        intro="Etsy Payment account statements are organized by month. If you want to review a full year of activity, you can select the monthly CSVs you have and combine their totals by activity type and currency. This guide shows which files to use and where the summary has limits."
      >
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-900">Free browser tool</p>
          <h2 className="mt-2 text-xl font-semibold text-stone-950">Combine up to 12 statement CSVs</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">Choose one file per month. The analyzer adds Amount, Fees &amp; Taxes, and Net separately for each activity type and currency; it never uploads the files.</p>
          <Link href="/etsy-payment-statement-analyzer" className="mt-4 inline-flex rounded-xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
            Open the Etsy statement analyzer →
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Download the Monthly Statement CSV for each month</h2>
          <p className="mt-3 text-base leading-7">In Etsy Shop Manager, open <strong>Finances → Monthly statements</strong>. Choose a month, select <strong>Generate CSV</strong>, then download the file from the email Etsy sends when it is ready. Repeat for each month you want to include in your review.</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">Etsy can update its menu labels. Check its current <a href="https://help.etsy.com/hc/en-us/articles/360016389113-How-to-Calculate-Your-Etsy-Payments-Deposit-Amount" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">Monthly statements and deposits instructions ↗</a> if a step has moved.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Choose the statement export, not a product list</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Etsy CSV</th>
                  <th className="px-4 py-3 font-semibold">Use it to review</th>
                  <th className="px-4 py-3 font-semibold">This analyzer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 font-medium">Monthly Statement</td>
                  <td className="px-4 py-3">Payment account activity such as sales, fees, refunds, and deposits.</td>
                  <td className="px-4 py-3">Combines up to 12 files by activity type and currency.</td>
                </tr>
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 font-medium">Order Items</td>
                  <td className="px-4 py-3">Products sold, titles, quantities, and SKUs when provided.</td>
                  <td className="px-4 py-3"><Link href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Use the profit-by-SKU analyzer</Link></td>
                </tr>
                <tr className="border-t border-stone-200">
                  <td className="px-4 py-3 font-medium">Active listings</td>
                  <td className="px-4 py-3">Your current listing catalogue and fields such as titles, tags, and SKUs.</td>
                  <td className="px-4 py-3"><Link href="/" className="font-semibold text-emerald-900 underline underline-offset-4">Use the Etsy CSV listing checker</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">Etsy’s <a href="https://help.etsy.com/hc/en-us/articles/360000343328-How-to-Download-a-Spreadsheet-of-Your-Sold-Transactions" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">sold transactions export guide ↗</a> explains the separate order and listing downloads.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Combine the months without double counting</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-base leading-7">
            <li>Keep a copy of each original Monthly Statement CSV.</li>
            <li>Select one file for each month you want to include, up to 12 files. Avoid adding the same month twice.</li>
            <li>Review the included file count, then check the totals by activity type and currency.</li>
            <li>Download the grouped summary CSV if you need a compact record for your own review.</li>
          </ol>
          <p className="mt-4 text-base leading-7">The tool combines all selected months into one annual activity summary. It does not display month-by-month trends, infer a missing month, or convert one currency into another. Compare like currencies and periods, and keep the original files for reference.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What the annual totals mean</h2>
          <p className="mt-3 text-base leading-7">The analyzer sums the signed values in the statement’s <strong>Amount</strong>, <strong>Fees &amp; Taxes</strong>, and <strong>Net</strong> columns independently. Rows stay grouped under the activity type and currency supplied by Etsy. For example, a sale, a refund, an advertising charge, and a deposit remain separate activities instead of being treated as one sales total.</p>
          <p className="mt-3 text-base leading-7">These totals are not automatically business profit. The files do not subtract off-platform costs such as materials, labor, packaging, or external advertising. Etsy also explains that deposit amounts depend on funds available for deposit and the seller’s payment schedule; the amount transferred to a bank is a different measure from the Payment account’s net activity. See Etsy’s <a href="https://help.etsy.com/hc/en-us/articles/115015747228-How-to-Manage-Your-Payment-Account" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">Payment account guide ↗</a> before interpreting a difference.</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">Use this summary for review and record organization. It is not a tax report, accounting reconciliation, or professional advice.</p>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-stone-200">
            {faq.map((item) => (
              <details key={item.question} className="py-4 first:pt-0 last:pb-0">
                <summary className="cursor-pointer font-semibold text-stone-900">{item.question}</summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <p className="text-xs leading-5 text-stone-500">This independent guide is not affiliated with Etsy. Etsy may change export screens, columns, or fee rules; use its current help pages and consult a qualified professional for accounting or tax decisions.</p>
      </EtsyPageShell>
    </>
  );
}
