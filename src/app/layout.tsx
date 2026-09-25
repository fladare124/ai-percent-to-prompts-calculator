import type { Metadata } from "next";
import SiteAnalytics from "@/components/SiteAnalytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: "%s | Prompt to Production",
  },
  description:
    "Free deployment diagnostics, hosting guidance and launch checklists for AI-built apps.",
  robots: { index: false, follow: true },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
