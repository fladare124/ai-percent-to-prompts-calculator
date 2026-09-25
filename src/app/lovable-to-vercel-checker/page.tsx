import type { Metadata } from "next";
import Link from "next/link";
import LovableVercelChecker from "@/components/LovableVercelChecker";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/lovable-to-vercel-checker";
const spanish = "/es/publicar-lovable-en-vercel";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Lovable App on Vercel Showing 404? Check the Framework",
  description:
    "Find out whether a Lovable app’s Vercel 404 comes from an older Vite SPA route or its current TanStack Start setup, then check the right fix.",
  alternates: {
    canonical,
    languages: { en: canonical, es: spanish },
  },
  openGraph: {
    title: "Lovable app on Vercel showing 404?",
    description: "Identify the project type before changing its Vercel routes.",
    url: canonical,
    type: "article",
  },
};

export default function LovableToVercelPage() {
  return (
    <SitePageShell
      eyebrow="Lovable deployment · reviewed September 25, 2026"
      title="Lovable app on Vercel showing 404? Check the project type first"
      intro={<>The right fix depends on whether your project is a current TanStack Start app or an older Vite single-page app. Check its package files before changing Vercel routing.</>}
    >
      <section id="version-checker" className="scroll-mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Check the Lovable framework version</h2>
        <p className="mt-3 text-base leading-7 text-zinc-700">
          Vercel’s documentation, updated September 22, 2026, says automatic detection requires <code className="rounded bg-white px-1.5 py-0.5 text-sm">@lovable.dev/vite-tanstack-config</code> version <strong>2.6.2 or later</strong>. This requirement is for zero-configuration detection; a lower version does not by itself prove the app cannot be deployed with another setup.
        </p>
        <div className="mt-5"><LovableVercelChecker /></div>
      </section>

      <section id="deploy" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Connect Lovable to Vercel</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>In Lovable, connect the project to GitHub and wait until the repository shows the latest changes.</li>
          <li>In Vercel, import that GitHub repository. Vercel says it detects the supported TanStack Start setup automatically.</li>
          <li>After the first deployment, open the production URL and test both the home page and a nested route directly.</li>
          <li>If deployment fails, inspect the first specific build error. If the build succeeds but the site returns an error, check the deployed framework version and Vercel runtime logs before changing routing settings.</li>
        </ol>
        <p className="mt-4 text-base leading-7">
          Lovable’s GitHub integration is a two-way sync: changes in Lovable sync to the linked repository, and pushes to its active branch sync back into Lovable. Once that repository is connected to Vercel, new commits can trigger deployments.
        </p>
      </section>

      <section id="vite-spa-404" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Older Vite SPA: the home page works, but a route refresh gives 404</h2>
        <p className="mt-3 text-base leading-7">
          Vercel’s Vite guide says deep links need a fallback when a project is configured as a client-side single-page app. If that matches your project, create <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">vercel.json</code> in the project root:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-sm leading-6 text-cyan-100"><code>{`{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`}</code></pre>
        <p className="mt-4 text-base leading-7">
          Use this only for a Vite SPA where the client router handles the nested paths. Vercel documents this rewrite for Vite SPAs; current Lovable projects use TanStack Start and follow that framework’s setup. If the root URL also returns 404, first check the Vercel project’s root directory, build output and deployed branch.
        </p>
      </section>

      <section id="version-not-detected" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">If Vercel does not detect the framework</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>Confirm that the Vercel project points to the repository and branch that Lovable is updating.</li>
          <li>Check the dependency in the committed package manifest and the resolved version in the lockfile.</li>
          <li>If the resolved version is older than 2.6.2, update the dependency and commit both the package manifest and its lockfile.</li>
          <li>Compare any manual Nitro or Vite configuration with the current framework documentation. Avoid copying a configuration written for a different project generation.</li>
        </ul>
        <p className="mt-4 text-base leading-7">
          Need help with a failed build log? Use the <Link className={linkClass} href="/deploy-vibe-coded-app">AI app deployment error checker</Link>. For the Spanish guide, open <Link className={linkClass} href={spanish} lang="es">publicar Lovable en Vercel</Link>.
        </p>
        <p className="mt-3 text-base leading-7">Choosing a host for a Lovable app? See the <Link className={linkClass} href="/where-to-host-lovable-app">Vercel, Hostinger and DigitalOcean comparison</Link>.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Official documentation</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6">
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/full-stack/tanstack-start" target="_blank" rel="noopener noreferrer">Vercel: TanStack Start and Lovable version requirement</a></li>
          <li><a className={linkClass} href="https://vercel.com/docs/frameworks/frontend/vite" target="_blank" rel="noopener noreferrer">Vercel: Vite single-page app deep-link rewrite</a></li>
          <li><a className={linkClass} href="https://docs.lovable.dev/integrations/github" target="_blank" rel="noopener noreferrer">Lovable: sync a project with GitHub</a></li>
          <li><a className={linkClass} href="https://vercel.com/changelog/you-can-now-deploy-lovable-apps-to-vercel" target="_blank" rel="noopener noreferrer">Vercel: Lovable deployment announcement</a></li>
        </ul>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Independent guide. The version threshold was checked against Vercel’s documentation on September 25, 2026. This checker does not connect to Lovable, GitHub or Vercel.</p>
    </SitePageShell>
  );
}
