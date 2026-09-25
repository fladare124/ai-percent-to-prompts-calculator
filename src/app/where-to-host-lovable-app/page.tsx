import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/where-to-host-lovable-app";
const spanish = "/es/donde-alojar-app-lovable";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Where to Host a Lovable App? Vercel vs Hostinger",
  description:
    "Compare Vercel, Hostinger and DigitalOcean for a Lovable app by framework support, commercial use, backend needs and hosting costs.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, es: spanish },
  },
  openGraph: {
    title: "Where to Host a Lovable App?",
    description: "Choose a host based on your app's framework, backend and use—not only the starting price.",
    url: canonical,
    type: "article",
  },
};

export default function WhereToHostLovablePage() {
  return (
    <SitePageShell
      eyebrow="Hosting comparison · reviewed September 25, 2026"
      title="Where should you host a Lovable app?"
      intro="The best place depends on the framework Lovable generated, whether the app is personal or commercial, and whether its database and background services stay with Lovable or another provider. Compare the deployment paths before moving the code."
    >
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-5 py-4 text-xl font-semibold text-zinc-950">Compare the main options</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Host</th>
                <th className="px-5 py-3 font-semibold">Good fit when</th>
                <th className="px-5 py-3 font-semibold">Check before choosing</th>
                <th className="px-5 py-3 font-semibold">Provider details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Vercel</th>
                <td className="px-5 py-4 align-top text-zinc-600">You want the documented GitHub deployment path for a current Lovable/TanStack Start app, or you already use Next.js.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Automatic Lovable detection requires <code>@lovable.dev/vite-tanstack-config</code> version 2.6.2 or later. Hobby is for personal, non-commercial use.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://vercel.com/docs/frameworks/full-stack/tanstack-start" target="_blank" rel="noopener noreferrer">TanStack Start setup</a><br /><a className={linkClass} href="https://vercel.com/pricing" target="_blank" rel="noopener noreferrer">Plans and pricing</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">Hostinger</th>
                <td className="px-5 py-4 align-top text-zinc-600">You want a managed Node.js deployment from GitHub and prefer a guided hosting dashboard.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Hostinger&apos;s guide requires an eligible Business Web or Cloud plan for Node.js apps. Verify your specific framework, renewal price, database and runtime needs.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="https://www.hostinger.com/support/host-your-lovable-bolt-or-any-other-vibe-coded-website-on-hostinger/" target="_blank" rel="noopener noreferrer">Lovable and AI-built app guide</a><br /><a className={linkClass} href="https://www.hostinger.com/web-apps-hosting" target="_blank" rel="noopener noreferrer">App plans and pricing</a></td>
              </tr>
              <tr>
                <th className="px-5 py-4 align-top font-semibold text-zinc-950">DigitalOcean App Platform</th>
                <td className="px-5 py-4 align-top text-zinc-600">Your app needs a frontend plus web service, worker, container or database.</td>
                <td className="px-5 py-4 align-top text-zinc-600">Price each component and outbound transfer. A low starting price for one container is not the total cost of a full-stack app.</td>
                <td className="px-5 py-4 align-top"><a className={linkClass} href="/digitalocean-app-platform">Cost guide</a><br /><a className={linkClass} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">Official pricing</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">A quick decision path</h2>
        <ol className="mt-3 list-decimal space-y-3 pl-6 text-base leading-7">
          <li><strong>Current Lovable project with TanStack Start:</strong> check the framework-helper version, then use Vercel&apos;s documented GitHub path. Open the <Link className={linkClass} href="/lovable-to-vercel-checker">Lovable/Vercel version and 404 checker</Link>.</li>
          <li><strong>Exported Node.js app and managed hosting is your priority:</strong> compare Hostinger&apos;s eligible Business Web or Cloud plan, then confirm its current framework and app limits against your repository.</li>
          <li><strong>Several app services or a separate worker:</strong> compare the complete DigitalOcean App Platform bill component by component.</li>
          <li><strong>Commercial project:</strong> check the host&apos;s terms before launch. Vercel restricts Hobby to personal, non-commercial use.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">A hosting change does not move every part of the app</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Before switching hosts, list where authentication, database, file uploads, email and scheduled jobs run. Moving the frontend or Node.js server does not automatically migrate those services. Keep the current app available until the replacement passes a production check.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Related launch help</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><Link className={linkClass} href="/lovable-to-vercel-checker">Fix a Lovable-to-Vercel framework or route issue</Link></li>
          <li><Link className={linkClass} href="/hostinger-nodejs-app">Check Hostinger&apos;s Node.js plan requirements</Link></li>
          <li><Link className={linkClass} href="/digitalocean-app-platform">Estimate DigitalOcean App Platform costs</Link></li>
          <li><Link className={linkClass} href="/deploy-vibe-coded-app">Troubleshoot a failed AI app build</Link></li>
          <li><Link className={linkClass} href="/bolt-deployment-failed">Fix a Bolt.new publish or deployment error</Link></li>
          <li><Link className={linkClass} href="/where-to-host-bolt-app">Compare hosting for a Bolt.new app</Link></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Provider details were checked against their public documentation on September 25, 2026. We are not enrolled in these providers&apos; affiliate programs; links currently go to official provider information.</p>
      <p className="text-sm leading-6">This is an independent comparison, not a deployment test. Confirm the current requirements and total cost with the provider before switching.</p>
    </SitePageShell>
  );
}
