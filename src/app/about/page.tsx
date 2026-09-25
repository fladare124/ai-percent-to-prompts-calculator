import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "About Prompt to Production",
  description:
    "How Prompt to Production helps people diagnose deployment problems and launch apps made with AI coding tools.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/about" },
};

const sourceClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function AboutPage() {
  return (
    <SitePageShell
      eyebrow="About Prompt to Production"
      title="Practical launch help for apps made with AI."
      intro="Prompt to Production is an independent project for the gap between a working preview and a dependable live app. It brings deployment checks, hosting comparisons and focused guides into one place."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">What the tools do</h2>
        <p className="mt-3 text-base leading-7">
          The deployment checker compares pasted build-log text with a set of common error patterns. It suggests what to verify first and creates a repair prompt that you can choose to copy into your coding assistant. The hosting finder reads a package manifest in your browser, detects a few common frameworks and gives a starting point based on framework, priorities and project use.
        </p>
        <p className="mt-3 text-base leading-7">
          The tools do not execute, change or fully review your code. A result is a clue, not proof of a root cause. Confirm each fix in your project and use the current documentation for the framework and host.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Privacy and limitations</h2>
        <p className="mt-3 text-base leading-7">
          Logs and project manifests are processed in the browser. They are not uploaded to this site or sent to an AI service. If you copy a repair prompt into another service, that service’s terms apply. Do not paste credentials, secrets or private customer data into the checker.
        </p>
        <p className="mt-3 text-base leading-7">
          Provider plans, prices and deployment support change. The hosting finder is a comparison aid, not a quote or a guarantee that a provider will support every app configuration. Read the provider terms and confirm the complete cost before moving a production app.
        </p>
        <Link href="/privacy" className={sourceClass}>Read the privacy notice</Link>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Independent project</h2>
        <p className="mt-3 text-base leading-7">
          Prompt to Production is not affiliated with Lovable, Bolt, Vercel, Hostinger or DigitalOcean. Product names are used only to identify the services covered by the independent guides. Provider documentation is linked wherever a recommendation depends on current product details.
        </p>
        <p className="mt-3 text-base leading-7">
          Some provider recommendations may later use affiliate links. Any active affiliate relationship will be disclosed next to the link and on the <Link href="/affiliate-disclosure" className={sourceClass}>affiliate disclosure page</Link>.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Start with the checker</h2>
        <p className="mt-2 text-sm leading-6">Paste a redacted deployment error and get a short list of checks you can verify yourself.</p>
        <Link href="/#diagnose" className="mt-3 inline-flex font-semibold text-cyan-900 underline underline-offset-4">Open the deployment checker →</Link>
      </section>
    </SitePageShell>
  );
}
