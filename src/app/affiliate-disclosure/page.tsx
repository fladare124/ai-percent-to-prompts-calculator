import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Current affiliate and compensation status for the hosting recommendations on Prompt to Production.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <SitePageShell
      eyebrow="Affiliate disclosure · September 25, 2026"
      title="We do not currently earn from provider links."
      intro="Prompt to Production is not currently enrolled in the affiliate programs of Vercel, Hostinger, DigitalOcean or the other providers mentioned on this site. Links currently go to official provider pages and are not tracked affiliate links."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">If that changes</h2>
        <p className="mt-3 text-base leading-7">If a future provider link earns commission or another benefit, we will label it near the recommendation and update this page. Compensation will not change the stated technical requirements, commercial-use terms or price details.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How recommendations are selected</h2>
        <p className="mt-3 text-base leading-7">Recommendations are based on the app type, commercial use and deployment preferences entered in the finder. Verify the provider’s current terms and the full cost of your app before purchasing.</p>
      </section>
    </SitePageShell>
  );
}
