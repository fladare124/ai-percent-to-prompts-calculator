import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/where-to-host-bolt-app";
const spanish = "/es/donde-alojar-app-bolt";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Where to Host a Bolt.new App? Bolt Cloud vs Hosts",
  description:
    "Compare Bolt Cloud, Hostinger, Vercel and DigitalOcean for a Bolt.new app. Choose by framework, backend services, GitHub workflow and total cost.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, es: spanish },
  },
  openGraph: {
    title: "Where to Host a Bolt.new App?",
    description: "Decide whether to keep Bolt hosting or move the app based on its actual stack and services.",
    url: canonical,
    type: "article",
  },
};

export default function WhereToHostBoltPage() {
  return (
    <SitePageShell
      eyebrow="Bolt.new hosting comparison · reviewed September 25, 2026"
      title="Where should you host a Bolt.new app?"
      intro="Bolt already includes a publishing route, so another host is useful only when it fits your app or workflow better. Compare Bolt Cloud, Hostinger, Vercel and DigitalOcean by framework, backend services and the work involved in moving."
    >
      <section className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Quick recommendation</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Keep a working app on Bolt Cloud when its built-in hosting, database and domain options meet your needs. Compare an external host when you need a particular runtime or deployment workflow, or already manage the app’s services elsewhere. Moving the frontend does not move its database or authentication.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-5 py-4 text-xl font-semibold text-zinc-950">Compare the hosting paths</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Option</th>
                <th className="px-5 py-3 font-semibold">Good fit when</th>
                <th className="px-5 py-3 font-semibold">Check before choosing</th>
                <th className="px-5 py-3 font-semibold">Official details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Bolt Cloud</th>
                <td className="px-5 py-4 align-top text-zinc-600">You want to publish from the same workspace and use Bolt’s connected app services.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Bolt says all users can publish to a <code>.bolt.host</code> address; custom domains are available on paid plans. Check current plan limits and domain terms.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://support.bolt.new/get-started/intro-bolt" target="_blank" rel="noopener noreferrer">Bolt hosting and domains</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Hostinger Node.js hosting</th>
                <td className="px-5 py-4 align-top text-zinc-600">You have the project in GitHub and want managed Node.js deployment from a hosting dashboard.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Node.js apps require an eligible Business Web or Cloud plan. Confirm the framework, build setup, database, traffic limits and renewal cost.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://www.hostinger.com/web-apps-hosting/bolt-hosting" target="_blank" rel="noopener noreferrer">Bolt hosting options</a><br /><a className={linkClass} href="https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/" target="_blank" rel="noopener noreferrer">Node.js plan requirements</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Vercel</th>
                <td className="px-5 py-4 align-top text-zinc-600">Your exported project is a Vite frontend or another framework supported by Vercel, and Git-based deployments suit your workflow.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Vercel’s Vite guide covers Vite deployment; it does not by itself migrate Bolt databases, authentication or secrets. Check your app’s server requirements separately.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Vite on Vercel</a><br /><a className={linkClass} href="https://vercel.com/pricing" target="_blank" rel="noopener noreferrer">Vercel plans</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">DigitalOcean App Platform</th>
                <td className="px-5 py-4 align-top text-zinc-600">The app needs separate web services, workers, containers or a managed database.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Estimate the full bill across every component, database, bandwidth and storage requirement.</td>
                <td className="px-5 py-4 align-top"><Link className={linkClass} href="/digitalocean-app-platform">Cost guide</Link><br /><a className={linkClass} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">Official pricing</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Check the app before paying for a new host</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-6 text-base leading-7">
          <li><strong>Identify the project type:</strong> check the framework and scripts in <code>package.json</code>. A static frontend and a Node.js server have different hosting needs.</li>
          <li><strong>List the services:</strong> write down where the database, authentication, file storage, email and scheduled jobs run.</li>
          <li><strong>Check the plan and full cost:</strong> include the app runtime, data services, storage, bandwidth, domain and renewal price.</li>
          <li><strong>Test before switching:</strong> deploy a copy and verify sign-in, saved data, forms and the custom domain before sending visitors to it.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Treat database migration as a separate job</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">A hosting change moves code only if you deploy it there; it does not copy production records or change authentication settings for you. Bolt warns that replacing a database connection can cause data loss. Back up the data and follow the provider’s migration steps before changing a live app.</p>
        <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://support.bolt.new/cloud/database/advanced" target="_blank" rel="noopener noreferrer">Bolt database connection guidance</a>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">More launch help</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><Link className={linkClass} href="/#finder">Get a starting hosting recommendation</Link></li>
          <li><Link className={linkClass} href="/bolt-deployment-failed">Fix a Bolt publish or deployment error</Link></li>
          <li><Link className={linkClass} href="/hostinger-nodejs-app">Review Hostinger’s Node.js setup</Link></li>
          <li><Link className={linkClass} href="/digitalocean-app-platform">Estimate an App Platform deployment</Link></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-950">Official references</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          <li><a className={linkClass} href="https://support.bolt.new/building/using-bolt/project-settings" target="_blank" rel="noopener noreferrer">Bolt project hosting settings</a></li>
          <li><a className={linkClass} href="https://www.hostinger.com/support/host-your-lovable-bolt-or-any-other-vibe-coded-website-on-hostinger/" target="_blank" rel="noopener noreferrer">Hostinger guide to hosting Bolt projects</a></li>
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Vercel’s Vite deployment guide</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Provider information reviewed September 25, 2026. Prompt to Production is independent, and these documentation links do not earn a commission.</p>
    </SitePageShell>
  );
}
