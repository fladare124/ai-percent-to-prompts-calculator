import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Prompt to Production handles deployment logs, hosting-finder choices and site analytics.",
  alternates: {
    canonical: "/privacy",
    languages: { en: "/privacy", es: "/es/privacidad" },
  },
};

export default function PrivacyPage() {
  return (
    <SitePageShell
      eyebrow="Privacy notice · September 25, 2026"
      title="The deployment checker does not need your accounts or source code."
      intro="The optional build-log diagnosis, hosting choices and package.json framework check run in this page. Prompt to Production does not ask you to connect a code repository, hosting account or payment service."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Build-log diagnosis</h2>
        <p className="mt-3 text-base leading-7">If you paste a deployment build log into the checker, the text is analyzed in your browser to look for common error patterns. The site does not upload, store or send the log to an AI service. Clear the text when you finish and remove secrets, passwords, tokens and private URLs before pasting. Vercel Web Analytics and Speed Insights measure site use and performance; the checker does not send pasted log text or its diagnosis to analytics.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Finder selections</h2>
        <p className="mt-3 text-base leading-7">The finder processes your choices in the browser. It does not submit or store the framework, project type, commercial-use answer or hosting preference. If you paste a package.json file, the page checks dependency names in your browser and does not upload or store the text. The site does not receive source code, repository names or account credentials.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Analytics and hosting</h2>
        <p className="mt-3 text-base leading-7">The site is hosted on Vercel and uses Vercel Web Analytics and Speed Insights to measure page use and performance. These services may process page URLs, referrers, approximate region and general device/browser or performance information. We do not send finder selections to analytics events.</p>
        <p className="mt-3 text-base leading-7">See <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel Analytics’ privacy documentation</a> and <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://vercel.com/docs/speed-insights" target="_blank" rel="noopener noreferrer">Speed Insights documentation</a> for current details.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">External links</h2>
        <p className="mt-3 text-base leading-7">Provider links open external websites. Their privacy notices and terms apply after you leave this site. We do not receive your form choices or account details from those providers.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Changes</h2>
        <p className="mt-3 text-base leading-7">If the checker begins sending or storing logs, choices, source code or other personal information, this notice will be updated before that behavior is introduced. Reviewed September 25, 2026.</p>
      </section>
    </SitePageShell>
  );
}
