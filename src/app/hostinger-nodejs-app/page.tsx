import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Host a Node.js or Next.js App on Hostinger",
  description:
    "Check which Hostinger plans support Node.js apps, GitHub deployments and Next.js before moving an AI-generated project.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/hostinger-nodejs-app" },
};

const sourceClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function HostingerNodejsAppPage() {
  return (
    <SitePageShell
      eyebrow="Hostinger deployment guide · September 25, 2026"
      title="Can you host an AI-built Node.js or Next.js app on Hostinger?"
      intro="Hostinger supports Node.js applications on eligible Business Web and Cloud plans. Its current guide lists Next.js among supported frameworks and describes deployments from GitHub or uploaded project files. Verify the plan and build requirements before you migrate."
    >
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Plan eligibility matters</h2>
        <p className="mt-2 text-sm leading-6">Hostinger says managed Node.js web apps are available on Business Web Hosting and Cloud plans. VPS and dedicated servers also support Node.js, but require manual command-line setup. The headline promotional price may not be the renewal price.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">The GitHub deployment path</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-6 text-base leading-7">
          <li><strong>Export the project.</strong> Confirm the AI builder can export files or sync the repository to GitHub.</li>
          <li><strong>Check the app type.</strong> The official Hostinger guide lists Next.js, Express, NestJS, Nuxt, Fastify, Astro and SvelteKit among supported Node.js frameworks.</li>
          <li><strong>Choose an eligible plan.</strong> Select Business Web or a Cloud plan for managed Node.js app hosting.</li>
          <li><strong>Connect the repository.</strong> Use the Node.js Web App setup flow and select the repository and branch to deploy.</li>
          <li><strong>Set build configuration and environment variables.</strong> Keep API keys out of the repository and verify the build output in the provider dashboard.</li>
          <li><strong>Connect the domain and inspect runtime logs.</strong> Confirm HTTPS, routes, database access and any background jobs before sending real users.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">When this route may fit</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>You have a Node.js or Next.js project and want a managed deployment flow.</li>
          <li>Your code is in GitHub and automatic builds after a push are useful.</li>
          <li>You prefer a hosting dashboard and want to avoid maintaining a VPS.</li>
        </ul>
        <p className="mt-4 text-base leading-7">For a static-only frontend, compare simple static hosting options as well. For several services, workers or more control over the runtime, compare the full stack rather than choosing by the first-year price alone.</p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Check the official details</h2>
        <p className="mt-2 text-sm leading-6">Hostinger’s requirements and interface can change. Its help center explains <a className={sourceClass} href="https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/" target="_blank" rel="noopener noreferrer">how to add a Node.js app</a> and lists <a className={sourceClass} href="https://www.hostinger.com/support/node-js-hosting-options-at-hostinger/" target="_blank" rel="noopener noreferrer">Node.js hosting options</a>.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">This guide summarizes Hostinger’s public documentation checked September 25, 2026. We have not deployed a customer app to Hostinger as part of this guide, and we do not currently earn commission from Hostinger.</p>
      <p className="text-sm leading-6">Compare this route with the <Link href="/where-to-host-lovable-app" className={sourceClass}>Vercel, Hostinger and DigitalOcean guide for Lovable apps</Link>, use the <Link href="/deploy-vibe-coded-app" className={sourceClass}>deployment guide</Link> or open the <Link href="/#finder" className={sourceClass}>hosting finder</Link>.</p>
    </SitePageShell>
  );
}
