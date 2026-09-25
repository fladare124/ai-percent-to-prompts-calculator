import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Percent to Prompts handles Etsy listing CSV files, browser processing and aggregate site analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SitePageShell
      eyebrow="Privacy notice · September 25, 2026"
      title="Your listing file stays in your browser."
      intro="The Etsy checker is designed to inspect the CSV you select without sending its listing content to our site. This page explains that processing and the site measurements we use."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">CSV files and prompts</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>The selected CSV is read and analyzed in the browser tab. The site does not upload or store the file.</li>
          <li>Titles, descriptions, tags, materials, SKUs, image URLs and file names are not sent to our analytics as part of an audit.</li>
          <li>The audit report is generated on your device and downloaded directly to you.</li>
          <li>A prompt containing listing details appears and is copied only after you choose a prompt action. If you paste it into a separate AI service, that provider’s privacy terms apply.</li>
          <li>We do not ask you to connect an Etsy account, enter a password, or submit a name or email address.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Site analytics and hosting</h2>
        <p className="mt-3 text-base leading-7">
          The site is hosted on Vercel and uses Vercel Web Analytics and Speed Insights to understand aggregate page use and performance. These services can process a page URL, referrer, time, general device/browser information, region and performance measurements. Our custom interaction events record only that an audit, report download, prompt copy or partner-link click occurred; they do not include listing counts, listing text, a file name or tag/title content.
        </p>
        <p className="mt-3 text-base leading-7">
          Vercel describes Web Analytics as using aggregated statistics and no third-party cookies. See <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s analytics privacy documentation</a> and <a className="font-semibold text-emerald-900 underline underline-offset-4" href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">Speed Insights documentation</a> for current vendor details. Requests needed to serve the website are handled by the hosting provider.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">External links</h2>
        <p className="mt-3 text-base leading-7">
          Links to Etsy, eRank and other services open their own websites. Their privacy and data practices are governed by their own notices. We do not send your shop file or audit results to those sites.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Changes</h2>
        <p className="mt-3 text-base leading-7">
          If the checker begins sending or storing information beyond the analytics described above, this notice will be updated before that behavior is introduced. This notice was last reviewed September 25, 2026.
        </p>
      </section>
    </SitePageShell>
  );
}
