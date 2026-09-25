import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Percent to Prompts handles calculator inputs, browser processing and aggregate site analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SitePageShell
      eyebrow="Privacy notice · September 25, 2026"
      title="Your calculator inputs stay in your browser."
      intro="The plan finder and usage calculators do not connect to your provider accounts. Values you enter for a calculation are processed locally in the browser."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Calculator inputs</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>Values such as budget, usage percentage, task counts and reset times are handled by the page in your browser.</li>
          <li>The tools do not read your provider account, access your private usage meter or send the values you enter to our server.</li>
          <li>Plan shortlist links may include the workflow, budget and usage frequency you selected so the same comparison can be shared. They do not contain provider-account information.</li>
          <li>We do not ask for provider passwords, account tokens, or personal details to use the tools.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Site analytics and hosting</h2>
        <p className="mt-3 text-base leading-7">
          The site is hosted on Vercel and uses Vercel Web Analytics and Speed Insights to understand page use and performance. These services may process a page URL, referrer, time, general device/browser information, region and performance measurements. Calculator inputs and provider-account data are not included in analytics events.
        </p>
        <p className="mt-3 text-base leading-7">
          See <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s analytics privacy documentation</a> and <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">Speed Insights documentation</a> for current vendor details. Requests needed to serve the website are handled by the hosting provider.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">External links</h2>
        <p className="mt-3 text-base leading-7">
          Links to provider plan, pricing and support pages open those providers’ websites. Their own privacy notices and terms apply there.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Changes</h2>
        <p className="mt-3 text-base leading-7">
          If these tools begin sending or storing calculation inputs, this notice will be updated to explain that before the change. This notice was last reviewed September 25, 2026.
        </p>
      </section>
    </SitePageShell>
  );
}
