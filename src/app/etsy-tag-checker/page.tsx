import type { Metadata } from "next";
import Link from "next/link";
import EtsyTagChecker from "@/components/EtsyTagChecker";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Etsy Tag Checker: 20-Character Limit",
  description:
    "Check Etsy tags for the 13-tag limit, 20-character count, duplicates and unsupported characters. Paste tags privately; your text stays in your browser.",
  alternates: { canonical: "/etsy-tag-checker" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Free Etsy Tag Checker",
    description:
      "Check Etsy tag counts, character limits and duplicates in your browser. No login or file upload.",
    url: "/etsy-tag-checker",
    type: "website",
  },
};

export default function EtsyTagCheckerPage() {
  return (
    <SitePageShell
      eyebrow="Free Etsy tag checker"
      title="Check Etsy tags for duplicates and the 20-character limit."
      intro="Paste the tags for one listing to check the tag count, character length, repeated phrases and allowed characters. This is a private format check; it does not estimate keyword demand or promise Etsy search placement."
    >
      <EtsyTagChecker />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">What the Etsy tag checker reviews</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>Counts the tags you entered and marks any beyond Etsy’s limit of 13.</li>
          <li>Counts each tag’s characters, including spaces, and flags tags over 20 characters.</li>
          <li>Finds repeated tags even when capitalization or spacing differs.</li>
          <li>Flags punctuation that does not match Etsy’s documented tag character rules.</li>
        </ul>
        <p className="mt-3 text-base leading-7">
          The checks are simple and visible. A repeated or short tag is not automatically a mistake, and this tool cannot tell whether a phrase is accurate for your item.
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-stone-950">How many Etsy tags can I use?</h2>
        <p className="mt-2 text-base leading-7">
          Etsy allows up to 13 tags on a listing, with up to 20 characters in each tag. Etsy recommends accurate, relevant tags and suggests using a diverse range. Spaces count toward the character limit.
        </p>
        <a
          href="https://help.etsy.com/hc/en-us/articles/360000336307-How-to-Use-Tags-to-Get-Found-in-Search"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4"
        >
          Read Etsy’s current tag guidance ↗
        </a>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">A character check is not keyword research</h2>
        <p className="mt-3 text-base leading-7">
          This checker does not connect to Etsy search or measure competition, search volume, impressions, clicks or sales. Use the phrases that truthfully describe your product, then review your own shop statistics to understand performance.
        </p>
        <p className="mt-3 text-base leading-7">
          Want to check every active listing at once? <Link href="/" className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4">Open the Etsy CSV listing checker</Link> to review tags and titles across a shop export.
        </p>
      </section>

      <p className="text-xs leading-5 text-stone-500">
        Etsy can update its policies. This independent tool is not affiliated with or endorsed by Etsy.
      </p>
    </SitePageShell>
  );
}
