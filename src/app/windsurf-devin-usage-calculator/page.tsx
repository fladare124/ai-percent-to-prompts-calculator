import type { Metadata } from "next";
import UsagePacePlanner from "@/components/UsagePacePlanner";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

const plansAndUsageUrl = "https://docs.devin.ai/desktop/accounts/usage";
const devinPlansUrl = "https://devin.ai/pricing";

export const metadata: Metadata = {
  title: "Windsurf and Devin Usage Calculator: Daily and Weekly Planner",
  description:
    "Check whether your Windsurf or Devin usage allowance can last until refresh. Compare your daily and weekly account readings with recent usage pace.",
  alternates: {
    canonical: "/windsurf-devin-usage-calculator",
  },
};

export default function WindsurfDevinUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Windsurf and Devin Usage Calculator"
      intro="Estimate whether your daily or weekly Windsurf and Devin allowance could last until refresh. Use readings from your account because model, task size and reasoning affect how quickly usage is consumed."
      calculator={
        <div className="space-y-8">
          <UsagePacePlanner
            platform="Windsurf / Devin daily quota"
            windowGuidance="Enter the remaining value shown for your daily allowance and the time until it refreshes. Use the same account meter for both readings."
            sourceUrl="https://app.devin.ai/settings/plans"
            sourceLabel="Open Devin plan and usage settings"
            measurementUnit="allowance units"
          />
          <UsagePacePlanner
            platform="Windsurf / Devin weekly quota"
            windowGuidance="Enter the remaining value shown for your weekly allowance and the time until it refreshes. Do not combine it with the daily reading."
            sourceUrl="https://app.devin.ai/settings/plans"
            sourceLabel="Open Devin plan and usage settings"
            measurementUnit="allowance units"
          />
        </div>
      }
      guide={{
        title: "Windsurf now includes Devin, and usage depends on the plan",
        summary:
          "Windsurf 2.0 brings Devin Cloud into the editor. Devin's current plans use account-specific usage allowances rather than one universal prompt count, while Enterprise billing can use a separate ACU system.",
        points: [
          "Windsurf 2.0 announced Devin Cloud as included with every Windsurf plan. Access is rolling out gradually, so availability can differ by account.",
          "Devin's current pricing says each paid plan has usage allowances that refresh daily and weekly. Cost per message varies with model, task size and reasoning.",
          "Paid plans can purchase extra usage at API pricing after the included allowance is consumed. Check your plan and account settings for current availability and amounts.",
          "New Devin Enterprise plans use Agent Compute Units (ACUs), with allocation determined by contract. Legacy enterprise accounts may still use prompt credits; do not treat those units as interchangeable.",
          "This page compares your own readings from the daily and weekly windows separately. It does not connect to Devin or Windsurf or predict a fixed number of prompts.",
        ],
        sources: [
          { label: "Devin plans and usage guide", href: plansAndUsageUrl },
          { label: "Current Devin pricing and included usage", href: devinPlansUrl },
          { label: "Windsurf 2.0 and Devin integration", href: "https://devin.ai/blog/windsurf-2-0" },
        ],
      }}
      extraFaq={[
        {
          question: "How often does Devin or Windsurf usage refresh?",
          answer:
            "Devin's current pricing describes daily and weekly usage allowances on paid plans. Check the reset times shown in your signed-in account, because plan and product access can vary.",
        },
        {
          question: "How many prompts can I use before the limit?",
          answer:
            "There is no fixed prompt count for every model and task. Compare two readings from the same daily or weekly allowance with the planner above to estimate your recent usage pace.",
        },
        {
          question: "Is Devin included with every Windsurf plan?",
          answer:
            "Windsurf 2.0 announced Devin Cloud as included with every Windsurf plan, with access rolling out gradually. Your account shows whether it is available to you.",
        },
        {
          question: "Where can I check my exact Devin usage?",
          answer:
            "The Devin docs say you can view usage from the Devin Desktop widget's Plan Info tab or on your authenticated plan page. Enterprise contracts may use ACUs or legacy prompt credits.",
        },
      ]}
    />
  );
}
