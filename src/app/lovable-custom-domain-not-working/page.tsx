import type { Metadata } from "next";
import Link from "next/link";
import LovableDomainStatusChecker from "@/components/LovableDomainStatusChecker";
import SitePageShell from "@/components/SitePageShell";

const canonical = "/lovable-custom-domain-not-working";
const spanish = "/es/dominio-personalizado-lovable-no-funciona";
const linkClass = "font-semibold text-cyan-800 underline underline-offset-4";

export const metadata: Metadata = {
  title: "Lovable Custom Domain Not Working? Check DNS & SSL",
  description:
    "Troubleshoot a Lovable custom domain by its status. Check DNS records, ownership verification, SSL setup, www redirects and when to retry.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, es: spanish },
  },
  openGraph: {
    title: "Lovable custom domain not working?",
    description: "Use the domain status to choose the next DNS or SSL check.",
    url: canonical,
    type: "article",
  },
};

export default function LovableCustomDomainNotWorkingPage() {
  return (
    <SitePageShell
      eyebrow="Lovable custom-domain troubleshooting · reviewed September 25, 2026"
      title="Lovable custom domain not working? Check the status before changing DNS"
      intro="Start with the exact status shown in Project → Settings → Domains. Domain verification, SSL setup and app publishing are separate stages, so the right fix depends on where the setup stopped."
    >
      <LovableDomainStatusChecker />

      <section id="connection-method" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Confirm the connection method before changing DNS</h2>
        <p className="mt-3 text-base leading-7">For a standard manual connection from another domain provider, Lovable supplies an A record and a TXT ownership-verification record. Its current guide shows the A record pointing to <code>185.158.133.1</code> and a TXT host beginning with <code>_lovable</code>; use the exact host and values displayed for your project because subdomains and provider setup can differ.</p>
        <p className="mt-3 text-base leading-7">If you deliberately enabled a CDN or reverse proxy in Lovable, use the CNAME it provides. In that mode the CNAME replaces the A record and Lovable does not require the verification TXT record. Do not combine records from the standard and proxy setups unless Lovable shows them together for your project.</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
          <li>For a standard external-provider setup, check that there is no conflicting AAAA record on the connected hostname.</li>
          <li>If ownership verifies but SSL setup fails, check whether existing CAA records allow the certificate authority Lovable uses.</li>
          <li>When you connect a root domain with a <code>www</code> redirect, Lovable lists both hostnames separately. Check the status and records for each one.</li>
        </ul>
      </section>

      <section id="verification-and-ssl" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Separate DNS verification from SSL setup</h2>
        <p className="mt-3 text-base leading-7">“Verifying” and “Unable to verify” point to the DNS ownership step: compare the complete A and TXT values with the project’s setup dialog and make sure you changed records at the authoritative DNS provider. Lovable says DNS updates can take up to 72 hours, although most finish within a few hours.</p>
        <p className="mt-3 text-base leading-7">“Setting up” means ownership was verified and Lovable is issuing the SSL certificate. Wait for “Live” before testing HTTPS. For “Stalled” or “Failed,” use Lovable’s Retry action; its current guide says you do not need to remove and reconnect the domain just to retry certificate provisioning.</p>
      </section>

      <section id="live-but-broken" className="scroll-mt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Lovable says Live, but the site still fails</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-base leading-7">
          <li>Open the exact hostname that Lovable marks Live. A root domain, <code>www</code> host and subdomain can have separate statuses.</li>
          <li>If one hostname redirects to another, check the primary domain and follow the redirect to its final address.</li>
          <li>Open the project’s <code>.lovable.app</code> address. If that also fails, investigate whether the project is published and whether the app itself loads.</li>
          <li>If only a page inside the app fails, treat it as an app route or runtime problem rather than changing DNS records that Lovable marks Live.</li>
        </ol>
        <p className="mt-4 text-base leading-7">If the project also fails to publish or a Vercel build is red, use the separate <Link className={linkClass} href="/lovable-deployment-failed">Lovable publish and deployment troubleshooter</Link>. It covers preview, Publish, build logs and live 404 errors.</p>
      </section>

      <section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-zinc-950">Official reference</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700">Lovable’s instructions and the records shown in your own project take precedence over examples on other sites. Review its current <a className={linkClass} href="https://docs.lovable.dev/features/custom-domain" target="_blank" rel="noopener noreferrer">custom-domain setup and status guide</a> before editing DNS.</p>
      </section>

      <p className="text-xs leading-5 text-zinc-500">Independent guide. The checker maps a status to common next steps; it does not look up DNS, access your Lovable account, or change domain records.</p>
      <p className="text-sm leading-6">¿Prefieres esta guía en español? <Link className={linkClass} href={spanish} lang="es">Diagnosticar un dominio personalizado de Lovable</Link>.</p>
    </SitePageShell>
  );
}
