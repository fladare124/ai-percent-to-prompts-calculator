import type { Metadata } from "next";
import Link from "next/link";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "How to Fix AI App Deployment and Build Errors",
  description:
    "Troubleshoot failed deployments for AI-built apps. Check build logs, missing packages, environment variables, Node.js versions and output settings.",
  alternates: { canonical: "/deploy-vibe-coded-app" },
};

const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export default function DeployVibeCodedAppPage() {
  return (
    <SitePageShell
      eyebrow="Deployment troubleshooting · September 25, 2026"
      title="How to fix a failed AI app deployment"
      intro="When a project from Lovable, Bolt, Cursor, Claude Code or another AI coding tool fails to deploy, the last line in the log rarely explains the cause. Start with the first specific error, match it to the checks below, then run the production build again."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Start with the first specific error</h2>
        <p className="mt-3 text-base leading-7">A message such as “command exited with code 1” only says that the build failed. Scroll upward to the first specific error, note its file, package or setting, and fix that before chasing later messages. <a className={linkClass} href="https://vercel.com/docs/deployments/troubleshoot-a-build" target="_blank" rel="noopener noreferrer">Vercel's troubleshooting guide</a> recommends checking the lines before the generic failure and running the production build locally.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Common errors and what to check</h2>
        <div className="mt-4 space-y-4">
          <article id="missing-build-script" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“Missing script: build”</h3>
            <p className="mt-2 text-sm leading-6">Open package.json and inspect the scripts section. Either add the correct build script for the project or change the hosting Build Command to the command it already defines. Run it from the project root to confirm it works.</p>
          </article>
          <article id="missing-dependency" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“Module not found” or “Could not resolve”</h3>
            <p className="mt-2 text-sm leading-6">Check the import path letter by letter, confirm the file was committed, and make sure any package is listed in the project dependencies. A project that works on one computer can still fail on a case-sensitive build system if the import capitalization differs from the filename.</p>
          </article>
          <article id="environment-variables" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“Missing environment variable” or an undefined value</h3>
            <p className="mt-2 text-sm leading-6">Add the named variable to the hosting dashboard for the environment that failed, then start a new deployment. Keep private keys out of client-side code and source control. Redact values before sharing a build log.</p>
          </article>
          <article id="node-version" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Unsupported Node.js version or engine</h3>
            <p className="mt-2 text-sm leading-6">Read the version requirement in the error and choose a compatible Node.js runtime in the hosting project settings. Align the local and hosted versions, then rebuild.</p>
          </article>
          <article id="output-directory" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Output or publish directory not found</h3>
            <p className="mt-2 text-sm leading-6">Check where the framework actually writes its build files and set the host's output directory to match. The right setting depends on the framework; server-rendered apps should use the matching framework preset instead of a static output folder.</p>
          </article>
          <article id="browser-code" className="scroll-mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">“window is not defined” or “document is not defined”</h3>
            <p className="mt-2 text-sm leading-6">The build is running browser-only code in a server context. Find the file in the first error, then move that code into the framework's client-only component or execution path.</p>
          </article>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <h2 className="border-b border-zinc-200 px-5 py-4 text-xl font-semibold text-zinc-950">Compare three launch paths</h2>
        <div className="overflow-x-auto">
          <table className="min-w-[680px] w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500">
              <tr><th className="px-5 py-3 font-semibold">Host</th><th className="px-5 py-3 font-semibold">Best fit</th><th className="px-5 py-3 font-semibold">Check first</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              <tr>
                <th className="px-5 py-4 font-semibold text-zinc-950">Vercel</th>
                <td className="px-5 py-4 text-zinc-600">Next.js and frontend apps with Git-based preview and production deployments.</td>
                <td className="px-5 py-4 text-zinc-600">Hobby is for personal, non-commercial use. A business or revenue-generating project needs a commercial plan.</td>
              </tr>
              <tr>
                <th className="px-5 py-4 font-semibold text-zinc-950">Hostinger</th>
                <td className="px-5 py-4 text-zinc-600">Managed Node.js apps deployed from GitHub, including supported Next.js projects.</td>
                <td className="px-5 py-4 text-zinc-600">Node.js apps require an eligible Business Web or Cloud plan. Promotional prices and renewal prices differ.</td>
              </tr>
              <tr>
                <th className="px-5 py-4 font-semibold text-zinc-950">DigitalOcean App Platform</th>
                <td className="px-5 py-4 text-zinc-600">Apps that need a service, worker or database alongside a frontend.</td>
                <td className="px-5 py-4 text-zinc-600">Static sites have a free tier; app containers start at $5/month. Database and bandwidth costs can be separate.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-5 py-4 text-xs leading-5 text-zinc-500">Provider facts checked September 25, 2026. Prices and terms change; use the linked provider pages for current details.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Once the build works, choose a suitable host</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Personal Next.js demo</h3>
            <p className="mt-2 text-sm leading-6">Vercel is a straightforward fit for a personal project. Its Hobby plan is not for commercial use, so revisit the plan before adding paid features or running a business.</p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">Node.js app with GitHub code</h3>
            <p className="mt-2 text-sm leading-6">Hostinger offers managed Node.js deployment from GitHub on eligible Business Web and Cloud plans. Read the plan and build requirements before moving a site.</p>
          </article>
          <article className="rounded-2xl border border-zinc-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-zinc-950">App with backend services</h3>
            <p className="mt-2 text-sm leading-6">DigitalOcean App Platform can run app components from a repository. Estimate the container, database and outbound transfer together.</p>
          </article>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Check these before connecting a domain</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Push the generated project to a private GitHub repository if it contains unfinished work or secrets.</li>
          <li>Remove API keys from source files and configure them in the hosting provider’s environment settings.</li>
          <li>Confirm the production build and start command work from the repository.</li>
          <li>Check database access rules, backups and the provider plan’s commercial-use terms.</li>
          <li>Estimate every production service, including database, storage and outbound data transfer.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Official provider references</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><a className={linkClass} href="https://vercel.com/pricing" target="_blank" rel="noopener noreferrer">Vercel plans and use terms</a></li>
          <li><a className={linkClass} href="https://vercel.com/docs/deployments/troubleshoot-a-build" target="_blank" rel="noopener noreferrer">Vercel build-log troubleshooting</a></li>
          <li><a className={linkClass} href="https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/" target="_blank" rel="noopener noreferrer">Hostinger Node.js deployment requirements</a></li>
          <li><a className={linkClass} href="https://www.digitalocean.com/pricing/app-platform" target="_blank" rel="noopener noreferrer">DigitalOcean App Platform pricing</a></li>
        </ul>
        <p className="mt-4 text-sm leading-6">Use the <Link href="/#finder" className={linkClass}>hosting finder</Link> for a starting recommendation, then confirm the details directly with the provider.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Percent to Prompts is independent and does not currently earn commission from these providers.</p>
    </SitePageShell>
  );
}
