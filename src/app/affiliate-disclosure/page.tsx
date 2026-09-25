import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Learn whether Percent to Prompts receives compensation for links in its AI plan comparisons.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <SitePageShell
      eyebrow="Affiliate disclosure · September 25, 2026"
      title="No paid ranking or affiliate links."
      intro="Percent to Prompts does not currently earn commissions from the AI plans or services listed on the site. The plan shortlist is based on workflow, budget and published product information."
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">If that changes</h2>
        <p className="mt-3 text-base leading-7">
          If the site adds a compensated link in the future, it will be clearly labeled near that link and this page will be updated. Compensation will not change the factual descriptions of plan features, limits or prices.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">How we choose recommendations</h2>
        <p className="mt-3 text-base leading-7">
          The plan finder ranks products using the visitor’s stated workflow, budget and usage intensity. It links to official provider pages so visitors can confirm current plan terms before subscribing.
        </p>
      </section>
    </SitePageShell>
  );
}
