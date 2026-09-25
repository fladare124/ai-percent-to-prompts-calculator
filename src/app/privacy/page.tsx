import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Prompt to Production handles deployment logs, project manifests and website analytics.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/privacy",
    languages: { en: "/privacy", "es-ES": "/es/privacidad" },
  },
};

const sourceClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function PrivacyPage() {
  return (
    <SitePageShell
      eyebrow="Privacy notice · September 25, 2026"
      title="Your deployment log stays on your device."
      intro="The diagnostic tools read the text or project manifest you choose in your browser. This notice explains what they do and the limited site measurements collected by the hosting platform."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Deployment logs and project files</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>Build-log text is checked in your browser. It is not uploaded to this site or sent to an AI service.</li>
          <li>The package.json text entered in the hosting finder is read in your browser and is not uploaded.</li>
          <li>Choosing “copy repair prompt” copies the generated prompt to your clipboard only after you click it. The prompt does not contain the pasted log.</li>
          <li>Do not paste passwords, API keys, access tokens, private URLs or customer data. If you copy a prompt to a separate AI provider, its privacy terms apply.</li>
          <li>The site does not ask you to connect a GitHub, Lovable, Bolt or hosting account.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Site analytics and hosting</h2>
        <p className="mt-3 text-base leading-7">
          The site is hosted on Vercel and uses Vercel Web Analytics and Speed Insights to measure visits and page performance. These services may process a page URL, referrer, time, general device or browser information, region and performance measurements. Tool inputs and results are not sent to those analytics.
        </p>
        <p className="mt-3 text-base leading-7">
          See <a className={sourceClass} href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s analytics privacy documentation</a> and <a className={sourceClass} href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">Speed Insights documentation</a> for the provider’s current details.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">External links</h2>
        <p className="mt-3 text-base leading-7">
          Links to Lovable, Bolt, Vercel, Hostinger, DigitalOcean and other services open their websites. Their privacy practices and terms apply there. We do not send your pasted log or project manifest to those providers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Changes</h2>
        <p className="mt-3 text-base leading-7">If a tool starts storing or sending project input, this notice will be updated before that behavior is introduced. Last reviewed September 25, 2026.</p>
      </section>
    </SitePageShell>
  );
}
