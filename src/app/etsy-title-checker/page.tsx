import type { Metadata } from "next";
import Link from "next/link";
import EtsyPageShell from "@/components/EtsyPageShell";
import EtsyTitleChecker from "@/components/EtsyTitleChecker";

const canonical = "/etsy-title-checker";
const spanishRoute = "/es/comprobador-titulos-etsy";

export const metadata: Metadata = {
  title: "Free Etsy Title Checker | Character Count & Clarity",
  description:
    "Check an Etsy listing title for the 140-character limit, word count and repeated terms. Follow Etsy's current clarity guidance with a private browser tool.",
  robots: { index: true, follow: true },
  alternates: {
    canonical,
    languages: { en: canonical, "es-ES": spanishRoute },
  },
  openGraph: {
    title: "Free Etsy Listing Title Checker",
    description:
      "Count title characters and words, and review possible repetition against Etsy's current title guidance.",
    url: canonical,
    type: "website",
  },
};

const faq = [
  {
    question: "How many characters can an Etsy title have?",
    answer:
      "Etsy Help says a listing title can be up to 140 characters. This checker counts the text you paste as an editing aid; confirm the final title in Etsy before saving.",
  },
  {
    question: "Does Etsy recommend using all 140 characters?",
    answer:
      "Etsy's current title guidance focuses on clear, easy-to-scan wording. It suggests considering fewer than 15 words when they cover the item's important traits; the checker treats this as a readability suggestion, not a ranking rule.",
  },
  {
    question: "Does this title checker improve my Etsy ranking?",
    answer:
      "No. It counts characters and words and flags a few patterns for human review. It does not check Etsy search volume, competition, listing performance or ranking.",
  },
  {
    question: "Is my title uploaded or saved?",
    answer:
      "No. The title is analyzed in your browser and is not uploaded to this site. It is only held in the page while you use the checker.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function EtsyTitleCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <EtsyPageShell
        eyebrow="Etsy title checker · Updated September 25, 2026"
        title="Check an Etsy listing title for length and clarity"
        intro="Paste one title to count its characters and words, and review repeated terms or wording Etsy suggests keeping out of titles. These are editing checks, not a ranking score or keyword research."
      >
        <EtsyTitleChecker />

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Etsy title limit and readability guidance</h2>
          <p className="mt-3 text-base leading-7">
            Etsy Help says a listing title can be up to 140 characters. Its newer guidance is about making titles clear and easy to scan: identify the item, put its most important traits up front, avoid unnecessary repetition, and consider using fewer than 15 words. A shorter title is a readability suggestion, not a promise of better search placement.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-emerald-900">
            <a href="https://help.etsy.com/hc/en-us/articles/115015628707-How-to-Create-a-Listing" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Etsy Help: title character limit ↗</a>
            <a href="https://www.etsy.com/seller-handbook/article/1399426136697" target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-300 underline-offset-4">Etsy Seller Handbook: current title guidance ↗</a>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">What this checker can and cannot tell you</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7">
            <li>It counts characters and words and highlights repeated words for review.</li>
            <li>It can flag a few examples of subjective, gifting, sale or shipping wording mentioned in Etsy&apos;s guidance.</li>
            <li>It cannot tell whether the item name or details are accurate, or which words shoppers search for.</li>
            <li>It does not access your shop, change a live listing or predict ranking, views or sales.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">Make the wording useful to a buyer</h2>
          <p className="mt-3 text-base leading-7">
            Etsy recommends clearly naming the item and including the details that distinguish it, such as color, material or size. Review any checker note in context: a repeated word may be necessary, and a title should describe the actual item rather than follow an automatic formula. Etsy search also considers the wider listing, including tags, attributes, descriptions, photos and reviews.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-stone-950">Check tags or a whole listing catalogue</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6">
            <Link href="/etsy-tag-checker" className="font-semibold text-emerald-900 underline underline-offset-4">Check Etsy tags for length and duplicates</Link>
            <Link href="/" className="font-semibold text-emerald-900 underline underline-offset-4">Audit titles and tags across an active-listings CSV</Link>
            <Link href="/etsy-listing-csv-guide" className="font-semibold text-emerald-900 underline underline-offset-4">Learn how to download the active-listings CSV</Link>
            <Link href={spanishRoute} lang="es" hrefLang="es-ES" className="font-semibold text-emerald-900 underline underline-offset-4">Versión en español</Link>
          </div>
        </section>

        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-stone-950">Etsy title checker questions</h2>
          <div className="mt-4 grid gap-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-stone-200 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-stone-950 marker:hidden">{item.question}<span aria-hidden="true" className="float-right text-emerald-800 transition group-open:rotate-45">＋</span></summary>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </EtsyPageShell>
    </>
  );
}
