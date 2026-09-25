import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "DigitalOcean App Platform Costs for AI-Built Apps",
  description:
    "Understand DigitalOcean App Platform costs for static sites, app containers, development databases and outbound data before deploying an AI-generated app.",
  alternates: { canonical: "/digitalocean-app-platform" },
};

const sourceClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function DigitalOceanAppPlatformPage() {
  return (
    <SitePageShell
      eyebrow="DigitalOcean cost guide · September 25, 2026"
      title="What does it cost to deploy an app on DigitalOcean App Platform?"
      intro="App Platform is a managed deployment service for repositories and containers. It can suit an AI-built app that needs a frontend plus a web service, worker or database. The total depends on every component, not just the smallest container."
    >
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-5 py-4 text-xl font-semibold text-zinc-950">Published starting points</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500"><tr><th className="px-5 py-3 font-semibold">Component</th><th className="px-5 py-3 font-semibold">Published starting point</th><th className="px-5 py-3 font-semibold">Important detail</th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              <tr><th className="px-5 py-4 font-semibold text-zinc-950">Static sites</th><td className="px-5 py-4 text-zinc-600">Free tier</td><td className="px-5 py-4 text-zinc-600">Up to three apps that use only static-site components; each app includes 1 GiB of outbound data transfer.</td></tr>
              <tr><th className="px-5 py-4 font-semibold text-zinc-950">Shared app container</th><td className="px-5 py-4 text-zinc-600">From $5/month</td><td className="px-5 py-4 text-zinc-600">A small 1 vCPU, 512 MiB option; bandwidth allowance depends on the selected size.</td></tr>
              <tr><th className="px-5 py-4 font-semibold text-zinc-950">Development database</th><td className="px-5 py-4 text-zinc-600">$7/month for 512 MiB</td><td className="px-5 py-4 text-zinc-600">The documented development database is limited and is not a substitute for a production database with backups.</td></tr>
              <tr><th className="px-5 py-4 font-semibold text-zinc-950">Extra outbound transfer</th><td className="px-5 py-4 text-zinc-600">$0.02 per GiB</td><td className="px-5 py-4 text-zinc-600">Transfer above the included allowance can add to the monthly bill.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="px-5 py-4 text-xs leading-5 text-zinc-500">Prices checked against DigitalOcean’s published pricing on September 25, 2026. Confirm live prices before purchasing.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Estimate the whole app, component by component</h2>
        <p className="mt-3 text-base leading-7">A frontend-only demo may fit the static tier. A full-stack project can need a web container, a worker, a database and outbound transfer. List each piece before comparing the monthly price with Vercel, Hostinger or another provider.</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>Count web services, workers, jobs and static sites separately.</li>
          <li>Choose the smallest container that meets the project’s documented resource needs; do not assume the $5 size fits every Next.js app.</li>
          <li>Budget for production data storage and backups separately from the development database.</li>
          <li>Check outbound transfer, custom domains, logs and any external managed services.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Official pricing and deployment docs</h2>
        <p className="mt-2 text-sm leading-6">See DigitalOcean’s <a className={sourceClass} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">App Platform pricing page</a> and detailed <a className={sourceClass} href="https://docs.digitalocean.com/products/app-platform/details/pricing/" target="_blank" rel="noopener noreferrer">pricing documentation</a> for current component and bandwidth rates.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">This page summarizes public documentation, not a quote. We do not currently earn commission from DigitalOcean.</p>
      <p className="text-sm leading-6">Compare with the <Link href="/deploy-vibe-coded-app" className={sourceClass}>deployment guide</Link> or open the <Link href="/#finder" className={sourceClass}>hosting finder</Link>.</p>
    </SitePageShell>
  );
}
