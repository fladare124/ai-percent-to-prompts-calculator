import type { Metadata } from "next";
import SeoCalculatorPage from "@/components/SeoCalculatorPage";

export const metadata: Metadata = {
  title: "Windsurf and Devin Usage Calculator",
  description:
    "Estimate Windsurf prompt credits or Devin agent sessions from a remaining percentage, plan and work mode.",
  alternates: {
    canonical: "/windsurf-devin-usage-calculator",
  },
};

export default function WindsurfDevinUsageCalculatorPage() {
  return (
    <SeoCalculatorPage
      h1="Windsurf / Devin Usage Calculator"
      intro="Estimate remaining Windsurf prompt credits or Devin agent sessions from your usage percentage. Choose the product, plan, model and work mode you are using."
      platformFocus="Windsurf / Devin"
      guide={{
        title: "Windsurf credits and Devin sessions are different",
        summary:
          "This page groups two coding agents, but their usage units are not interchangeable. Choose the matching product mode and treat the result as a rough estimate for that product only.",
        points: [
          "Windsurf Cascade prompt credits and Devin agent sessions can be consumed at different rates. A long, multi-step session is not equivalent to one short prompt.",
          "Use your provider's account or usage view to confirm the actual allowance and reset. This calculator is not connected to Windsurf or Devin.",
          "For Devin sessions, the estimate is especially uncertain because session length and task complexity vary widely.",
        ],
        sources: [
          { label: "Plans and usage guide", href: "https://docs.windsurf.com/windsurf/accounts/usage" },
          { label: "Introducing Devin", href: "https://docs.devin.ai/get-started/devin-intro" },
        ],
      }}
      extraFaq={[
        {
          question: "Can I compare a Windsurf credit with a Devin session?",
          answer:
            "No. The tools meter usage differently. Use the product mode you selected and read the result as a separate estimate for that service.",
        },
        {
          question: "Why is the Devin estimate less certain?",
          answer:
            "A Devin session can include many steps and its resource use depends on the task. The calculator marks that mode with lower reliability for this reason.",
        },
      ]}
    />
  );
}
