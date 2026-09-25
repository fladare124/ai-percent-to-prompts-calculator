import type { Metadata } from "next";
import Link from "next/link";
import DeploymentErrorHelper from "@/components/DeploymentErrorHelper";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/lovable-deployment-failed";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Lovable Deployment Failed? Fix Publish, Build & 404 Errors",
  description:
    "Find where a Lovable deployment fails: preview, Publish, Vercel build or a live 404. Match the failing stage to the next check before changing settings.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, es: "/es/publicar-lovable-en-vercel" },
  },
  openGraph: {
    title: "Lovable deployment failed?",
    description: "Identify the failed deployment stage and follow the matching checks.",
    url: canonical,
    type: "article",
  },
};

export default function LovableDeploymentFailedPage() {
  return (
    <SitePageShell
      eyebrow="Lovable deployment help · reviewed September 25, 2026"
      title="Lovable deployment failed? Find the step that broke first"
      intro="A blank preview, a failed Lovable publish, a red Vercel build and a live 404 need different fixes. Start with the place where the error appears, then check that stage before changing project settings or moving hosts."
    >
      <nav aria-label="Choose the deployment problem" className="grid gap-3 sm:grid-cols-2">
        {[
          ["#preview", "The preview is blank or will not load"],
          ["#lovable-publish", "Lovable Publish reports an error"],
          ["#vercel-build", "The Vercel build fails"],
          ["#live-404", "The deployment is ready but the URL fails"],
        ].map(([href, label]) => (
          <a key={href} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800 hover:border-cyan-400" href={href}>{label} →</a>
        ))}
      </nav>

      <section id="preview" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">The preview is blank or will not load</h2>
        <p className="mt-3 text-base leading-7">This happens before an external hosting build, so start in the Lovable project preview. Reload it, note the exact message shown by the project, and check the browser console for the first runtime error. Keep the preview failure separate from a later Vercel build or custom-domain error.</p>
        <p className="mt-3 text-base leading-7">If the preview becomes available but publishing still fails, continue with the relevant publish or build checks below.</p>
      </section>

      <section id="lovable-publish" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Lovable Publish reports an error</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Copy the exact message shown after Publish. A custom-domain error can be separate from publishing to the project’s generated address.</li>
          <li>Confirm whether the Publish dialog says the website is live and test the generated <code>.lovable.app</code> address.</li>
          <li>If that address works but a custom domain does not, check whether Lovable reports the domain as Live and follow its current DNS setup instructions before rebuilding.</li>
          <li>If publishing itself does not complete, use the exact status and error shown by Lovable. Keep this separate from a Vercel build log, which applies only when you deploy the GitHub project there.</li>
        </ol>
        <p className="mt-3 text-sm leading-6 text-zinc-600">Do not post account credentials, secret environment values or private database URLs when asking for help.</p>
        <p className="mt-4 text-base leading-7">If the <code>.lovable.app</code> address works but a custom domain does not, use the dedicated <Link className={linkClass} href="/lovable-custom-domain-not-working">Lovable custom-domain DNS and SSL checker</Link>.</p>
      </section>

      <section id="vercel-build" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">The Vercel build fails after GitHub sync</h2>
        <p className="mt-3 text-base leading-7">Open the failed deployment’s Build Logs and find the first specific error above a generic message such as “command exited with 1.” Vercel recommends checking those lines and running the project’s production build locally; the final line often only reports that an earlier step failed.</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7">
          <li><strong>Vercel builds an old version:</strong> confirm Lovable has synced the intended changes to GitHub, then confirm Vercel is deploying that repository, branch and latest commit.</li>
          <li><strong>Vercel cannot identify a current Lovable project:</strong> check that the resolved <code>@lovable.dev/vite-tanstack-config</code> version meets Vercel’s documented minimum of 2.6.2 for automatic detection. The <Link className={linkClass} href="/lovable-to-vercel-checker">framework checker</Link> reads the version from package metadata pasted into your browser.</li>
          <li><strong>A package, script or environment setting is missing:</strong> follow the exact file or variable named in the first error. Add secrets only in the provider’s environment settings, then redeploy.</li>
          <li><strong>The error is not clear:</strong> paste a redacted log into the <Link className={linkClass} href="/deploy-vibe-coded-app">local deployment error checker</Link>. It recognizes common patterns and does not upload the log.</li>
        </ul>
        <p className="mt-4 text-sm leading-6 text-zinc-600">Automatic framework detection has a version requirement; a lower version alone does not prove the project is impossible to deploy. Follow the current framework setup and lockfile for the project you have.</p>
      </section>

      <section id="live-404" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Vercel says Ready, but the live app shows 404 or a blank screen</h2>
        <p className="mt-3 text-base leading-7">A successful build only confirms that the deployment completed. Open the production home page, then test the exact URL that fails. A missing nested route in an older client-side Vite app can require a fallback rewrite; a current TanStack Start app uses its framework’s server routing. Applying an SPA rewrite to a server-rendered app can break valid routes.</p>
        <p className="mt-3 text-base leading-7">Use the <Link className={linkClass} href="/lovable-to-vercel-checker">Lovable-to-Vercel 404 and version guide</Link> to identify the project type before changing routing configuration.</p>
      </section>

      <section id="log-checker" className="scroll-mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Check a Vercel build log</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Paste only the relevant lines after removing secrets, personal data and private URLs. This check runs in your browser; it cannot access your repository or change the deployment.</p>
        <div className="mt-5"><DeploymentErrorHelper /></div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Before you deploy again</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Confirm the latest code is in the connected GitHub repository and deployment branch.</li>
          <li>Check the build’s first specific error and fix that cause before changing unrelated settings.</li>
          <li>Set private values only in the deployment environment, and only for the environment that needs them.</li>
          <li>After deployment, open the production URL and at least one nested route directly.</li>
          <li>For a business app, compare the host’s current commercial-use terms and the complete cost of its services.</li>
        </ol>
        <p className="mt-4 text-base leading-7">Still choosing a host? Compare <Link className={linkClass} href="/where-to-host-lovable-app">Vercel, Hostinger and DigitalOcean for Lovable apps</Link>, including framework fit, commercial use and extra services.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Official references</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><a className={linkClass} href="https://vercel.com/docs/deployments/troubleshoot-a-build" target="_blank" rel="noopener noreferrer">Vercel: troubleshoot a build</a></li>
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/full-stack/tanstack-start" target="_blank" rel="noopener noreferrer">Vercel: TanStack Start and Lovable setup</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/integrations/github" target="_blank" rel="noopener noreferrer">Lovable: GitHub integration and sync</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/features/publish" target="_blank" rel="noopener noreferrer">Lovable: publish a project</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/features/custom-domain" target="_blank" rel="noopener noreferrer">Lovable: set up a custom domain</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Independent troubleshooting guide. Provider steps and framework requirements can change; confirm the current details in the linked documentation.</p>
    </SitePageShell>
  );
}
