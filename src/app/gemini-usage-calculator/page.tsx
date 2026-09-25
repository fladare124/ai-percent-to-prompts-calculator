import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

const geminiLimitsUrl =
  "https://support.google.com/gemini/answer/16275805?hl=en";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  title: "Gemini Usage Calculator: 5-Hour and Weekly Limit Planner",
  description:
    "Check whether your Gemini Apps usage can last until refresh. Compare your Usage Limits reading with recent pace and the 5-hour or weekly reset.",
  alternates: {
    canonical: "/gemini-usage-calculator",
  },
};

export default function GeminiUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Gemini Usage Calculator"
      intro="Estimate whether your Gemini Apps usage can last until refresh using your own Usage Limits reading. Gemini uses compute-based limits, so there is no reliable fixed prompt count for every model and task."
      calculator={
        <UsagePacePlanner
          platform="Gemini usage"
          windowGuidance="In Gemini Apps, open Settings → Usage Limits. Enter the remaining value shown for the limit you are tracking, then use its displayed reset time. Limits refresh every 5 hours until you reach your weekly limit."
          sourceUrl="https://gemini.google.com/"
          sourceLabel="Open Gemini Apps"
          measurementUnit="usage units"
        />
      }
      guide={{
        title: "Gemini limits refresh every five hours until the weekly cap",
        summary:
          "Gemini Apps use compute-based usage limits rather than one fixed prompt allowance. Your remaining capacity depends on the model, prompt complexity, features, chat length and current availability.",
        points: [
          "Google says the limit refreshes every 5 hours until the weekly limit is reached. Check the reset time shown in your own Gemini account.",
          "The Usage Limits panel in Gemini Settings shows the relevant limit. Gemini notifies you when you are close to a limit and when it will refresh.",
          "More complex prompts, longer chats, advanced models and features can consume more capacity. Two prompts do not necessarily use the same amount.",
          "Google AI Plus, AI Pro and AI Ultra offer different access levels. Exact limits can change with account type, availability and capacity.",
          "This planner compares two readings from the same limit. It does not connect to Google or estimate a universal prompt count.",
        ],
        sources: [
          { label: "Gemini Apps limits and upgrades", href: geminiLimitsUrl },
          { label: "Gemini Apps for work or school accounts", href: "https://support.google.com/gemini/answer/14620100?hl=en" },
        ],
      }}
      extraFaq={[
        {
          question: "How often does Gemini usage refresh?",
          answer:
            "Google says Gemini Apps limits refresh every 5 hours until you reach your weekly limit. Check the reset time in Settings → Usage Limits because availability and limits can change.",
        },
        {
          question: "How many Gemini prompts can I send before the limit?",
          answer:
            "There is no fixed prompt count that applies to every model and task. Gemini limits are compute-based; compare two readings from the same limit with the planner above to estimate your recent pace.",
        },
        {
          question: "Where can I see my Gemini usage limit and reset time?",
          answer:
            "Open Gemini Apps, choose Settings, then Usage Limits. Google says Gemini will also notify you when you are close to a limit and tell you when it refreshes.",
        },
        {
          question: "Do work and school Google accounts use the same Gemini limits?",
          answer:
            "No. The linked limits guide covers personal Google Accounts. Work or school accounts can have different limits based on the Workspace edition and administrator settings.",
        },
      ]}
    />
  );
}
