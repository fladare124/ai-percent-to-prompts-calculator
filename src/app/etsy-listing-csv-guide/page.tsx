import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Download Etsy Listing CSV: Step-by-Step Guide",
  description:
    "Download your Etsy active-listings CSV, see which fields it contains, and check titles and tags privately in your browser.",
  alternates: { canonical: "/etsy-listing-csv-guide" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "How to Download Your Etsy Listing CSV",
    description:
      "Follow Etsy’s current export steps, then review listing titles and tags in a private browser-based checker.",
    url: "/etsy-listing-csv-guide",
    type: "article",
  },
};

export default function EtsyListingCsvGuidePage() {
  return (
    <SitePageShell
      eyebrow="Etsy CSV guide"
      title="How to download your Etsy listing CSV"
      intro="Etsy’s listing-data export gives you a spreadsheet of your active listings. You can use it to review titles, tags and other listing details outside Shop Manager."
    >
      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-stone-950">Download the active-listings CSV</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Sign in to Etsy.com and open Shop Manager.</li>
          <li>Choose <strong>Settings</strong>, then <strong>Options</strong>.</li>
          <li>Open <strong>Download Data</strong>.</li>
          <li>Under listing data, choose <strong>Download CSV</strong>.</li>
        </ol>
        <p className="mt-4 text-sm leading-6 text-stone-600">
          Etsy may change its menus. See its <a href="https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">current export instructions ↗</a> if a step looks different.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What is in an Etsy listings CSV?</h2>
        <p className="mt-3 text-base leading-7">
          Etsy says the active-listings export can include the title, description, price, currency, quantity, tags, materials, image URLs and SKU numbers when present. The CSV opens in spreadsheet apps such as Excel, Numbers and Google Sheets.
        </p>
        <p className="mt-3 text-base leading-7">
          This is different from Etsy’s monthly-statement and sold-order-history CSVs. The Listing Checkup tool uses the active-listings export to review listing wording and tag formatting.
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-900">Next step</p>
        <h2 className="mt-2 text-xl font-semibold text-stone-950">Review your titles and tags across the shop</h2>
        <p className="mt-2 text-sm leading-6 text-stone-700">
          Select your downloaded CSV in the checker. It reads the file in your browser, flags patterns to review and creates a report; it does not connect to Etsy or change live listings.
        </p>
        <Link href="/" className="mt-4 inline-flex rounded-xl bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900">
          Open the Etsy CSV checker →
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What the checker can and cannot tell you</h2>
        <p className="mt-3 text-base leading-7">
          The report can flag title wording, tag limits, repeated tags and exact duplicate titles in the exported catalogue. It cannot access Etsy search volume, listing views, orders or ranking. Treat each finding as a prompt to review, not as proof that a listing is performing badly.
        </p>
        <p className="mt-3 text-base leading-7">
          Checking just one listing? Use the <Link href="/etsy-tag-checker" className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">single-listing Etsy tag checker</Link> to count tags and character limits without opening a file.
        </p>
      </section>

      <p className="text-xs leading-5 text-stone-500">
        Etsy’s export fields and menus can change. This independent guide is not affiliated with or endorsed by Etsy.
      </p>
    </SitePageShell>
  );
}
