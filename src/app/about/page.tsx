import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "About the AI Plan Finder",
  description:
    "Learn how Percent to Prompts compares AI coding subscriptions, checks official plan information and explains the limits of its recommendations.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <SitePageShell
      eyebrow="About this project"
      title="Independent help choosing an AI coding plan."
      intro="Percent to Prompts compares published AI coding plans and provides free tools for understanding usage limits. The goal is to help you choose based on your workflow and budget without claiming every provider measures usage the same way."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How the comparison works</h2>
        <p className="mt-3 text-base leading-7">
          The plan finder ranks options by the workflow you describe, your monthly budget and how often you expect to use coding agents. We compare published features and link to providers’ own plan details. Usage estimates are guidance, not benchmark results or guaranteed task counts.
        </p>
        <p className="mt-3 text-base leading-7">
          Each provider uses different models, meters, caps and reset windows. A message, completion or agent task is not a common unit, so we avoid presenting a universal number of prompts for a plan.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">What it cannot measure</h2>
        <p className="mt-3 text-base leading-7">
          We do not connect to your provider accounts or see your private usage balances. Actual limits may depend on your account, region, model, task, context, system capacity and provider changes. Check your account’s usage page before making a purchase decision.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Sources and independence</h2>
        <p className="mt-3 text-base leading-7">
          Product and usage descriptions are checked against public provider documentation and pricing pages. Those details change; use the linked official pages for the latest plan terms and prices.
        </p>
        <p className="mt-3 text-base leading-7">
          Percent to Prompts is an independent project and is not affiliated with or endorsed by the providers listed in the comparison.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Privacy</h2>
        <p className="mt-2 text-sm leading-6">The finder does not ask for an account connection. Calculator inputs stay in your browser and are not submitted to a provider or to Percent to Prompts.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Project and provider references reviewed September 25, 2026.</p>
    </SitePageShell>
  );
}
