import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";
import UsagePacePlanner from "@/components/UsagePacePlanner";

export const metadata: Metadata = {
  title: "Perplexity Usage Calculator: Pro Search & Research Limits",
  description:
    "Track your Perplexity Pro Search or Research balance against its reset time. See published Free and Enterprise limits and check dynamic paid-plan usage.",
  alternates: {
    canonical: "/perplexity-usage-calculator",
  },
};

export default function PerplexityUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Perplexity Usage Calculator: Pro Search & Research Limits"
      intro="Check whether your remaining Perplexity Pro Searches or Research queries could last until reset. Compare your account balance with your recent usage pace; paid consumer limits can vary by account and usage."
      calculator={
        <div className="space-y-8">
          <div className="rounded-md border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/30 dark:text-cyan-100">
            <p>
              Free includes 3 Pro Searches per day and 1 Research query per
              month. Paid plan limits vary by tier and use. These planners use
              readings you enter; they do not connect to Perplexity or assume
              a fixed paid allowance.
            </p>
          </div>
          <UsagePacePlanner
            platform="Perplexity Pro Search"
            measurementUnit="Pro Searches"
            windowGuidance="Use the reset window shown in your account. Free includes 3 Pro Searches per day; paid plans may show a weekly limit."
            sourceUrl="https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you"
            sourceLabel="Perplexity plan limits"
          />
          <UsagePacePlanner
            platform="Perplexity Research"
            measurementUnit="Research queries"
            windowGuidance="Use the monthly Research balance and reset shown for your plan. Free includes 1 Research query per month."
            sourceUrl="https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you"
            sourceLabel="Perplexity plan limits"
          />
        </div>
      }
      guide={{
        title: "Check the Perplexity mode and reset window",
        summary:
          "Perplexity tracks Pro Search and Research separately. Use the meter shown for the same feature and plan window; this planner compares manual readings and cannot access your Perplexity account.",
        points: [
          "The Free plan includes 3 Pro Searches each day and 1 Research query each month. Basic searches are separate.",
          "Perplexity lists weekly Pro Search and monthly Research limits based on average use for individual Pro plans, with advanced-use limits for Max. Check the current balance and reset in your account rather than relying on a fixed online estimate.",
          "Enterprise Pro lists 400 Pro Searches per week and 50 Research queries per month. Enterprise Max lists 4,000 per week and 500 per month.",
          "Perplexity says Best mode on Pro is available without quota limits. Track Pro Search or Research only when your account shows that matching allowance.",
          "Perplexity's API is billed separately from its web and app subscriptions. Use the API billing page for API credits rather than this subscription estimate.",
          "For a personal estimate, compare two readings from the same mode and reset window, then enter the number of searches or queries used between them.",
        ],
        sources: [
          { label: "Perplexity plan details", href: "https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you" },
          { label: "About Perplexity Pro", href: "https://www.perplexity.ai/help-center/en/articles/10352901-what-is-perplexity-pro" },
        ],
      }}
      extraFaq={[
        {
          question: "How many Pro Searches does Perplexity Pro include?",
          answer:
            "Perplexity describes Pro Search limits for individual Pro plans as weekly limits based on average use; it does not publish one fixed count for every subscriber. Check your current account meter and use the weekly Pro Search planner above.",
        },
        {
          question: "How many free Perplexity Research queries are included?",
          answer:
            "Perplexity lists 1 Research query per month on the Free plan. Individual paid plans use monthly limits based on average or advanced use, so check your account for the current balance.",
        },
        {
          question: "Does Best mode use the Pro Search quota?",
          answer:
            "Perplexity's Pro help page says Best mode is available without quota limits. Pro Search and Research have separate allowances, so only enter readings from the matching account meter in these planners.",
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
