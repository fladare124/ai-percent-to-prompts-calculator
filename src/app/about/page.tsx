import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "About Prompt to Production",
  description:
    "How Prompt to Production helps troubleshoot failed builds and deploy apps made with AI coding tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SitePageShell
      eyebrow="About this project"
      title="Practical guidance for getting an AI-built app live."
      intro="Prompt to Production is an independent guide from Percent to Prompts. It helps people understand common deployment failures, check a build log in their browser and choose a host that fits the app."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Deployment troubleshooting</h2>
        <p className="mt-3 text-base leading-7">The build-log checker looks for a limited set of common messages and returns general steps to verify. It does not connect to a hosting provider, modify project files or guarantee that it will identify the cause of every failure. The log is analyzed in the browser and is not uploaded or saved by this site.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How recommendations are made</h2>
        <p className="mt-3 text-base leading-7">The hosting finder compares the project shape, commercial use and setup preference. It can identify common frameworks from an optional package.json pasted into the browser, then links to the provider’s own plan or technical documentation so you can confirm current terms.</p>
        <p className="mt-3 text-base leading-7">We distinguish static frontends, Next.js apps and Node.js services because they can require different runtimes and services. A package manifest cannot reveal every route, database or runtime requirement, so treat the result as a starting point. We do not rank hosts using private benchmarks or promise a fixed monthly bill.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">What we do not do</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>We do not connect to your GitHub, hosting or payment accounts.</li>
          <li>We do not deploy, inspect or store your source code.</li>
          <li>We do not guarantee that a provider’s plan will fit every generated app.</li>
          <li>We do not currently receive commission for provider recommendations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Sources and updates</h2>
        <p className="mt-3 text-base leading-7">Provider requirements and pricing are based on public documentation. Hosting plans and commercial-use terms can change; the official provider pages linked in each guide take precedence. The latest source review date appears on the relevant page.</p>
      </section>
    </SitePageShell>
  );
}
