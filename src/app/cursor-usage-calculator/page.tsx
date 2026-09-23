import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Cursor Usage Calculator",
  description:
    "Estimate how many Cursor requests your included usage percentage could cover, based on model, mode and context size.",
  alternates: {
    canonical: "/cursor-usage-calculator",
  },
};

export default function CursorUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Cursor Usage Calculator"
      intro="Estimate how many Cursor requests your remaining included usage could cover. Select your plan, model and work mode to get a planning range."
      platformFocus="Cursor"
      guide={{
        title: "Estimate Cursor requests from the right usage pool",
        summary:
          "Cursor usage can depend on the selected model and plan. Current usage-based plans show separate pools for Cursor models and other models, so make sure your percentage refers to the pool you intend to estimate.",
        points: [
          "Cursor says included usage resets monthly with your billing cycle. The Spending tab shows remaining allowance and the reset date.",
          "The number of requests depends on model costs and task size. One agent run can use much more than one short chat request.",
          "This calculator gives a rough request equivalent. It does not read your Cursor Spending dashboard or model usage history.",
        ],
        sources: [
          { label: "Cursor usage and limits", href: "https://prod.cursor.com/help/models-and-usage/usage-limits" },
        ],
      }}
      extraFaq={[
        {
          question: "Where can I see my Cursor usage and reset date?",
          answer:
            "Open the Spending tab in your Cursor dashboard. It shows remaining usage and the reset date for your billing cycle.",
        },
        {
          question: "Does a Cursor request always use the same allowance?",
          answer:
            "No. Model choice, usage pool and task size affect consumption. Treat the result as a rough equivalent and compare it with the pool shown in your dashboard.",
        },
      ]}
    />
  );
}
