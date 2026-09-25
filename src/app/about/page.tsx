import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "About Prompt to Production",
  description:
    "How Prompt to Production helps people choose where to deploy apps made with AI coding tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SitePageShell
      eyebrow="About this project"
      title="Practical guidance for the step after AI writes the code."
      intro="Prompt to Production is an independent guide from Percent to Prompts. It helps people choose a host for apps created with AI coding tools and understand the requirements that can affect a launch."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How recommendations are made</h2>
        <p className="mt-3 text-base leading-7">The hosting finder compares the project shape, commercial use and setup preference. It gives a starting point, then links to the provider’s own plan or technical documentation so you can confirm current terms.</p>
        <p className="mt-3 text-base leading-7">We distinguish static sites, Next.js apps and projects with a backend because they require different runtimes and services. We do not rank hosts using private benchmarks or promise a fixed monthly bill.</p>
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
