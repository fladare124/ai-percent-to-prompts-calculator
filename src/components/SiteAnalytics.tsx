"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ANALYTICS_OPT_OUT_KEY } from "@/lib/analytics-preferences";

function isAnalyticsOptedOut(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export default function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={(event) => (isAnalyticsOptedOut() ? null : event)} />
      <SpeedInsights beforeSend={(event) => (isAnalyticsOptedOut() ? null : event)} />
    </>
  );
}
