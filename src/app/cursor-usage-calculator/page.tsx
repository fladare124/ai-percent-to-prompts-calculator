import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

const cursorUsageUrl =
  "https://prod.cursor.com/help/models-and-usage/usage-limits";

export const metadata: Metadata = {
  title: "Cursor Usage Calculator: Pool Balance Until Reset",
  description:
    "Estimate whether your Cursor Models or Other Models usage pool can last until your monthly reset, based on your own recent usage readings.",
  alternates: {
    canonical: "/cursor-usage-calculator",
  },
};

export default function CursorUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Cursor Usage Calculator"
      intro="Check whether each Cursor usage pool could last until your billing reset. Compare the remaining percentage in your Spending dashboard with your recent usage pace instead of assuming every request has the same cost."
      calculator={
        <div className="space-y-8">
          <UsagePacePlanner
            platform="Cursor Models pool"
            windowGuidance="Enter the remaining value Cursor shows for this pool. If it is a percentage, use that number; if it uses another unit, keep that same unit for both readings. Convert days until billing reset to hours (days × 24)."
            sourceUrl="https://cursor.com/dashboard/spending"
            sourceLabel="Open Cursor Spending"
            measurementUnit="pool units"
          />
          <UsagePacePlanner
            platform="Other Models pool"
            windowGuidance="Enter the separate remaining value Cursor shows for this pool. Use the same unit for both readings, and convert days until billing reset to hours (days × 24)."
            sourceUrl="https://cursor.com/dashboard/spending"
            sourceLabel="Open Cursor Spending"
            measurementUnit="pool units"
          />
        </div>
      }
      guide={{
        title: "Cursor has two separate usage pools",
        summary:
          "Cursor does not have one reliable request count for every model and task. Its Spending dashboard shows the remaining allowance for each pool, while your recent usage readings can help estimate how quickly that balance is changing.",
        points: [
          "The Cursor Models pool includes Grok 4.7, Grok 4.6, Grok 4.5 and Composer 2.5. The Other Models pool covers third-party models charged at their provider prices.",
          "Pro, Pro+ and Ultra include both pools. The Start plan in India covers the Cursor Models pool only. Plans and availability can vary by account.",
          "Cursor Router can draw from either pool depending on which model handles a request. Composer 2.5 has no Cursor Token Rate on any plan; third-party models can incur that rate on Teams and Enterprise.",
          "Both pools reset monthly with your billing cycle, and unused usage does not roll over. Spending shows the reset date and real-time balance.",
          "Compare each pool separately. This planner uses your percentage readings and recent pace; it does not connect to Cursor or estimate a universal number of prompts.",
        ],
        sources: [
          {
            label: "Cursor usage pools and limits",
            href: cursorUsageUrl,
          },
          {
            label: "Cursor usage-based charges",
            href: "https://prod.cursor.com/help/account-and-billing/overages",
          },
          {
            label: "Cursor plans and pricing",
            href: "https://cursor.com/pricing",
          },
        ],
      }}
      extraFaq={[
        {
          question: "How many Cursor requests can I make before reset?",
          answer:
            "There is no fixed request count across models and tasks. Check the separate balances in Cursor Spending, then compare two readings from the same pool with the planner above to estimate whether your recent pace can last until reset.",
        },
        {
          question: "What is the difference between Cursor Models and Other Models?",
          answer:
            "Cursor Models include Grok 4.7, Grok 4.6, Grok 4.5 and Composer 2.5. Other Models covers third-party models and follows their model costs. Cursor Router may use either pool depending on the routed model.",
        },
        {
          question: "When does Cursor usage reset?",
          answer:
            "Included usage resets monthly with your billing cycle. Cursor Spending shows your reset date, and unused usage does not roll over.",
        },
        {
          question: "Does using my own API key count toward Cursor usage?",
          answer:
            "On individual plans, the model provider bills requests made with your own key directly, and they do not draw from Cursor's two pools. Team and Enterprise plans may apply a Cursor Token Rate to those requests.",
        },
      ]}
    />
  );
}
