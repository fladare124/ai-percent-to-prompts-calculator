import type { Metadata } from "next";
import Link from "next/link";
import DeploymentErrorHelper from "@/components/DeploymentErrorHelper";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/bolt-deployment-failed";
const spanish = "/es/error-despliegue-bolt";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Bolt.new App Won't Deploy? Fix Publish and Build Errors",
  description:
    "Diagnose Bolt.new publish and build failures. Separate Bolt Cloud publishing from external hosting, check the log, and verify your project before redeploying.",
  alternates: {
    canonical,
    languages: { en: canonical, es: spanish },
  },
  openGraph: {
    title: "Bolt.new App Won't Deploy?",
    description: "Find out whether the issue is the preview, Bolt publishing, or an external hosting build.",
    url: canonical,
    type: "article",
  },
};

export default function BoltDeploymentFailedPage() {
  return (
    <SitePageShell
      eyebrow="Bolt.new deployment guide · reviewed September 25, 2026"
      title="Bolt.new app won’t deploy? Check which step failed"
      intro="A broken preview, a failed Bolt publish and a failed build on another host are different problems. Identify where the failure happens first, then follow the matching checks before changing providers."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Step 1</p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">The preview is blank</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">This can be a browser or WebContainer issue before the app reaches hosting. Try a Chromium-based browser and temporarily check whether an extension or VPN is blocking Bolt.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Step 2</p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">Bolt Publish fails</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Read the error shown after Publish. If the generated <code>.bolt.host</code> address works but your custom domain does not, check the domain status and DNS settings before rebuilding.</p>
        </article>
        <article className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-800">Step 3</p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-950">An external host build fails</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">Use that provider’s build log. The first specific error usually points to a missing dependency, environment setting or build configuration.</p>
        </article>
      </section>

      <section id="diagnostics" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Check an external-host build log</h2>
        <p className="mt-3 text-base leading-7">Paste a redacted log to check for common build failures. This browser-based checker does not connect to Bolt or your hosting account, and it does not upload or save the text.</p>
        <div className="mt-5"><DeploymentErrorHelper /></div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Where are you deploying?</h2>
        <div className="mt-4 space-y-4">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-950">Publishing inside Bolt</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Bolt’s built-in hosting publishes a project to a <code>.bolt.host</code> address. Bolt’s help center says all users can publish there; custom domains are available to paid users. If the generated address works but your custom domain does not, check the domain status and DNS records before rebuilding the app.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://support.bolt.new/building/intro-bolt" target="_blank" rel="noopener noreferrer">Bolt hosting and domain details</a>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-950">Deploying to Vercel, Netlify or another provider</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">Treat the external deployment as its own project. Confirm that the host sees the right repository and project folder, uses the build command declared by the app, and has the required environment variables. A Vite frontend can be deployed to Vercel, but server features and connected data services still need a compatible setup.</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Vercel’s Vite deployment guide</a>
              <Link className={linkClass} href="/hostinger-nodejs-app">Hostinger Node.js requirements</Link>
              <Link className={linkClass} href="/digitalocean-app-platform">DigitalOcean App Platform costs</Link>
            </div>
          </article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-zinc-950">The site loads, but login or saved data fails</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-700">That points to a production service or configuration check, not necessarily a failed frontend build. Verify the production database, authentication callback URLs and environment settings. A hosting change does not automatically move the Bolt database. Bolt warns that replacing a database connection can cause data loss, so make a backup and follow its migration instructions first.</p>
            <a className={`mt-3 inline-block text-sm ${linkClass}`} href="https://support.bolt.new/cloud/database/advanced" target="_blank" rel="noopener noreferrer">Bolt database connection and migration guidance</a>
          </article>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Should you move a Bolt app to another host?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Keep it on Bolt when…</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
              <li>the current app publishes successfully and Bolt’s built-in services fit its needs;</li>
              <li>you want to manage hosting, domains and the app’s database in the Bolt workflow;</li>
              <li>the available domain and plan terms work for your project.</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Compare external hosts when…</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
              <li>you need a particular runtime, provider account or deployment workflow;</li>
              <li>your app already uses services outside Bolt and you want to manage them together;</li>
              <li>you have checked the code, database, secrets, commercial terms and full cost of moving.</li>
            </ul>
          </article>
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-700">If you decide to move, first sync or back up the project, deploy a copy, and verify its pages, sign-in, data writes and custom domain before switching visitors to it.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Related launch help</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><Link className={linkClass} href="/#finder">Get a starting hosting recommendation</Link></li>
          <li><Link className={linkClass} href="/where-to-host-bolt-app">Compare Bolt Cloud with external hosts</Link></li>
          <li><Link className={linkClass} href="/deploy-vibe-coded-app">Troubleshoot another AI app build error</Link></li>
          <li><Link className={linkClass} href="/where-to-host-lovable-app">Compare hosting for a Lovable app</Link></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-zinc-950">Official references</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
          <li><a className={linkClass} href="https://support.bolt.new/faqs/troubleshooting/webcontainer" target="_blank" rel="noopener noreferrer">Bolt troubleshooting for preview and WebContainer issues</a></li>
          <li><a className={linkClass} href="https://support.bolt.new/building/using-bolt/project-settings" target="_blank" rel="noopener noreferrer">Bolt project hosting settings</a></li>
          <li><a className={linkClass} href="https://www.hostinger.com/support/host-your-lovable-bolt-or-any-other-vibe-coded-website-on-hostinger/" target="_blank" rel="noopener noreferrer">Hostinger guide for Bolt and AI-built sites</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Provider information reviewed September 25, 2026. Percent to Prompts is independent and does not currently earn commission from the providers mentioned.</p>
    </SitePageShell>
  );
}
