import type { Metadata } from "next";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyPaymentStatementAnalyzer from "@/components/EtsyPaymentStatementAnalyzer";

const canonical = "/etsy-payment-statement-analyzer";

export const metadata: Metadata = {
  title: "Etsy Annual & Monthly Statement CSV Analyzer | Free Tool",
  description:
    "Combine up to 12 Etsy monthly statement CSVs into annual totals by activity type and currency. Review Amount, Fees & Taxes, and Net privately in your browser.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, "es-ES": "/es/analizador-extracto-etsy" },
  },
  openGraph: {
    title: "Free Etsy Annual and Monthly Statement CSV Analyzer",
    description:
      "Combine Etsy Payment account statement CSVs by activity type and currency without uploading the files.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "Which Etsy CSV does this analyzer use?",
    answer:
      "Use a Monthly Statement CSV from Etsy Shop Manager under Finances, Monthly statements. This is different from the Order Items CSV, which lists sold items.",
  },
  {
    question: "What does the Etsy statement analyzer calculate?",
    answer:
      "It combines up to 12 selected statement files, groups rows by activity type and currency, then adds the signed values in the Amount, Fees & Taxes, and Net columns when those columns are present. It does not convert currencies or change the original statements.",
  },
  {
    question: "Does this show exact profit by product or order?",
    answer:
      "No. The report summarizes statement activity types and does not allocate every fee, refund, or adjustment to a specific product or order. Add product costs and review the Payment account before making financial decisions.",
  },
  {
    question: "Does the statement net total equal my bank deposit?",
    answer:
      "Not necessarily. Etsy says deposits depend on funds available for deposit and the deposit schedule; Payment account net profit and a bank deposit are different measures.",
  },
  {
    question: "Is my monthly statement CSV uploaded?",
    answer:
      "No. The browser reads the selected files locally. The report and its download contain grouped totals, not the original statement rows, order references, or buyer details.",
  },
  {
    question: "Can I combine statements for a full year?",
    answer:
      "Yes. Select one Monthly Statement CSV for each month you want to include, up to 12 files. The summary keeps currencies separate and does not calculate taxable income or replace accounting records.",
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

export default function EtsyPaymentStatementAnalyzerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        eyebrow="Free Etsy statement CSV summary · Private in your browser"
        title="Combine Etsy monthly statements into one activity summary"
        intro="Select up to 12 Monthly Statement CSVs to combine Amount, Fees & Taxes, and Net values by activity type and currency. Review several months or a full year without exposing the original statement rows."
      >
        <EtsyPaymentStatementAnalyzer />

        <p className="text-sm leading-6 text-stone-600">
          Need this page in Spanish? <a href="/es/analizador-extracto-etsy" lang="es" hrefLang="es-ES" className="font-semibold text-emerald-900 underline underline-offset-4">Use the Spanish Etsy statement analyzer →</a>
        </p>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What the statement summary shows</h2>
          <p className="mt-3 text-base leading-7">
            The report groups rows from every selected statement with the same activity type and currency, then adds each signed value column independently. Select one file per month for an annual overview. Sales, refunds, fees, marketing, postage, and deposits remain separate categories, so a bank transfer is not mixed into a sales or profit total. You can download the combined results as a CSV.
          </p>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">A statement summary, not product profit or a deposit reconciliation</h2>
          <p className="mt-3 text-base leading-7 text-stone-700">
            Etsy’s monthly statement contains Payment account activity for the month. This tool totals the values present in that export, but it does not match each fee to a product, infer costs, calculate taxable income, or decide which funds are available for deposit. Etsy notes that a bank deposit and Payment account net profit can differ because funds may not yet be available and deposits follow a schedule. Use your Etsy account and a qualified accountant for financial or tax decisions.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            Read <a href="https://help.etsy.com/hc/en-us/articles/360016389113-How-to-Calculate-Your-Etsy-Payments-Deposit-Amount" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy’s monthly statement and deposit instructions ↗</a> and its <a href="https://help.etsy.com/hc/en-us/articles/115015747228-How-to-Manage-Your-Payment-Account" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">Payment account activity guide ↗</a> for the latest definitions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Monthly Statement CSV versus Order Items CSV</h2>
          <p className="mt-3 text-base leading-7">
            Use the Monthly Statement CSV to summarize account activity such as sales, fees, refunds, and deposits. Use an Order Items CSV to group individual products sold by title or SKU. Our <a href="/etsy-sales-csv-analyzer" className="font-semibold text-emerald-900 underline underline-offset-4">Etsy profit by SKU analyzer</a> uses the Order Items export with your own cost and fee assumptions; it is a separate estimate, not a statement reconciliation.
          </p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Etsy’s <a href="https://help.etsy.com/hc/en-gb/articles/360000343328-How-to-Download-a-Spreadsheet-of-Your-Sold-Transactions" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline underline-offset-4">sold transaction download instructions ↗</a> explain how to export Order Items and other sales CSV files.
          </p>
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
      </EtsyPageShell>
    </>
  );
}
