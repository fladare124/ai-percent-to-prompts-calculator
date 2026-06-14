import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://percenttoprompts.com"),
  title: {
    default: "Percent to Prompts Calculator",
    template: "%s | Percent to Prompts Calculator",
  },
  description:
    "Unofficial calculator for estimating remaining AI prompts, messages, tasks and usage units from your usage percentage.",
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
      </body>
    </html>
  );
}
