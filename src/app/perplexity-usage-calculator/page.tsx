import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Perplexity Usage Calculator",
  description:
    "Estimate remaining Perplexity Pro searches or research tasks from your usage percentage and plan.",
  alternates: {
    canonical: "/perplexity-usage-calculator",
  },
};

export default function PerplexityUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Perplexity Usage Calculator"
      intro="Estimate how many Perplexity searches or research tasks your remaining usage percentage could cover. Choose the plan, usage window and type of search."
      platformFocus="Perplexity"
      guide={{
        title: "Check which Perplexity allowance you are estimating",
        summary:
          "Perplexity has different search and research features, so a percentage should be tied to the specific meter or plan limit you are viewing. This tool estimates the selected search mode; it cannot read your Perplexity account.",
        points: [
          "Basic searches, Pro Search and Research can have different allowances and reset periods. Match the mode and window shown in your account.",
          "Perplexity's API is billed separately from its web and app subscriptions. Use the API billing page for API credits rather than this subscription estimate.",
          "For a personal estimate, compare two readings from the same mode and reset window, then enter the similar searches completed between them.",
        ],
        sources: [
          { label: "Perplexity plan details", href: "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you" },
          { label: "About Perplexity Pro", href: "https://www.perplexity.ai/help-center/en/articles/10352901-what-is-perplexity-pro" },
        ],
      }}
      extraFaq={[
        {
          question: "Does this count every Perplexity search the same way?",
          answer:
            "No. Basic search, Pro Search, Research, file analysis and API use are not one interchangeable allowance. Choose the mode that matches the meter you are checking.",
        },
        {
          question: "Where do I check my current Perplexity limits?",
          answer:
            "Check your plan and usage in Perplexity's account interface. Its help center explains which features and allowances are included with each plan.",
        },
      ]}
    />
  );
}
