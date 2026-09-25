import type { Metadata } from "next";
import SitePageShell from "@/components/SitePageShell";
import { ERANK_DISCLOSURE, ERANK_HREF, ERANK_IS_AFFILIATE } from "@/lib/partners";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Learn how Percent to Prompts labels partner links and whether the current Etsy keyword research links earn a commission.",
  alternates: { canonical: "/affiliate-disclosure" },
};

export default function AffiliateDisclosurePage() {
  return (
    <SitePageShell
      eyebrow="Affiliate disclosure · September 25, 2026"
      title={ERANK_IS_AFFILIATE ? "Some partner links may earn us a commission." : "Current partner links do not earn us a commission."}
      intro={<>The eRank link currently shown on the checker is <a className="underline underline-offset-4" href={ERANK_HREF}>{ERANK_IS_AFFILIATE ? "an affiliate link" : "a regular outbound link"}</a>. {ERANK_DISCLOSURE} {ERANK_IS_AFFILIATE ? "Any commission does not increase your price." : "Percent to Prompts is not enrolled in eRank’s affiliate program and does not earn from that referral today."}</>}
    >
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">If that changes</h2>
        <p className="mt-3 text-base leading-7">
          If we join an affiliate program and add tracked links, we will label those links next to the recommendation and update this page. A commission would not change the price paid by the buyer. Partner relationships will not affect the checker’s audit rules or the description of a tool’s limits.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">How we choose recommendations</h2>
        <p className="mt-3 text-base leading-7">
          A partner link should point to a service that fits a task the checker cannot perform, such as researching actual marketplace keyword data. The checker does not claim that an external service will increase a shop’s ranking or sales. Sellers should review a service’s current features, price and terms before signing up.
        </p>
      </section>
    </SitePageShell>
  );
}
