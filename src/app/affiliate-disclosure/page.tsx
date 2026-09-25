import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";
import { HOSTINGER_DISCLOSURE, HOSTINGER_HREF, HOSTINGER_IS_AFFILIATE, HOSTINGER_REL } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Find out how affiliate links are disclosed in Prompt to Production hosting recommendations.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <SitePageShell
      eyebrow="Affiliate disclosure"
      title={HOSTINGER_IS_AFFILIATE ? "Some hosting links may earn a commission." : "Current hosting recommendations do not earn us a commission."}
      intro={HOSTINGER_DISCLOSURE}
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Current Hostinger link</h2>
        <p className="mt-3 text-base leading-7">
          The hosting finder links to <a className="font-semibold text-cyan-800 underline underline-offset-4" href={HOSTINGER_HREF} target="_blank" rel={HOSTINGER_REL}>Hostinger’s app hosting information</a>. {HOSTINGER_DISCLOSURE}
        </p>
        <p className="mt-3 text-base leading-7">The finder also points to Vercel and DigitalOcean resources. We do not currently earn commission from those links.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How recommendations are made</h2>
        <p className="mt-3 text-base leading-7">
          Recommendations are based on the framework, services and use selected in the hosting finder. An affiliate relationship does not change the framework checks or replace a comparison of price, commercial-use terms, limits and app requirements. Confirm all current details with the provider before purchasing.
        </p>
      </section>
    </SitePageShell>
  );
}
