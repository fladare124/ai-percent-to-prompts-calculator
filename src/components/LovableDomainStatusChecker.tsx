"use client";

import { useState } from "react";

const statuses = [
  {
    value: "unpublished",
    label: "Unpublished",
    title: "Publish the project",
    steps: [
      "This status applies to the default lovable.app project URL when the app has not been published yet.",
      "Open the Publish dialog and publish the current version. A custom domain cannot serve an unpublished project.",
    ],
  },
  {
    value: "ready",
    label: "Ready",
    title: "The domain is set up, but the project is unpublished",
    steps: [
      "Publish the project. Lovable says a Ready domain becomes Live after the project is published.",
      "If it stays Ready after publishing, refresh Project → Settings → Domains and use the status shown there.",
    ],
  },
  {
    value: "action-required",
    label: "Action required",
    title: "Complete the domain setup shown in Lovable",
    steps: [
      "Open Complete setup for this hostname and copy the exact DNS records Lovable displays.",
      "If you connected the root domain with a www redirect, complete setup for both hostnames; each can have its own records.",
    ],
  },
  {
    value: "verifying",
    label: "Verifying",
    title: "Check the records, then let DNS update",
    steps: [
      "Compare the A and TXT records at your DNS provider with the exact values shown in Lovable. Check the complete TXT value.",
      "Remove conflicting AAAA records if Lovable’s setup guide says they interfere. DNS changes can take up to 72 hours, although many complete sooner.",
      "Use Check status in Lovable after correcting records or allowing time for propagation.",
    ],
  },
  {
    value: "unable-to-verify",
    label: "Unable to verify",
    title: "Lovable could not confirm domain ownership yet",
    steps: [
      "Check that the A record and the full TXT verification value match the records shown for this project.",
      "Confirm the records were added to the authoritative DNS provider, and check for a conflicting AAAA record.",
      "After correcting DNS or allowing propagation, select Check status. Lovable notes that propagation can take up to 72 hours.",
    ],
  },
  {
    value: "setting-up",
    label: "Setting up",
    title: "Wait for the SSL certificate",
    steps: [
      "Ownership verification has passed and Lovable is issuing the certificate.",
      "Wait until the status becomes Live before testing HTTPS. The browser may warn about the certificate while setup is in progress.",
    ],
  },
  {
    value: "stalled",
    label: "Stalled",
    title: "Retry certificate setup",
    steps: [
      "Use Retry next to the domain in Lovable. The current documentation says you do not need to remove and add the domain again.",
      "If it remains stalled, review the domain warning and contact Lovable support with the status and hostname.",
    ],
  },
  {
    value: "failed",
    label: "Failed",
    title: "Retry SSL provisioning",
    steps: [
      "Lovable reports that ownership was verified but the SSL certificate could not be provisioned.",
      "Use Retry. If the status returns to Failed, follow the domain warning or ask Lovable support before changing unrelated DNS records.",
    ],
  },
  {
    value: "live",
    label: "Live",
    title: "DNS and SSL setup are complete",
    steps: [
      "Confirm you are opening the exact hostname marked Live and that the project has been published.",
      "If the app still fails, diagnose its page, route or runtime separately from DNS setup. A Live status does not prove every app route works.",
    ],
  },
  {
    value: "offline",
    label: "Offline",
    title: "Recover the domain connection",
    steps: [
      "Lovable says the DNS records no longer point to the project. Select Recover in Project → Settings → Domains.",
      "Use the records Lovable displays to restore the connection at your DNS provider, then check status again.",
    ],
  },
  {
    value: "connection-issue",
    label: "Connection issue",
    title: "Read Lovable’s warning before changing DNS",
    steps: [
      "Open the warning under the domain. It describes what Lovable detected and the recommended action.",
      "If you intentionally moved the domain to another service, disconnect it from the Lovable project. Otherwise, contact Lovable support to restore the connection.",
    ],
  },
  {
    value: "check-failed",
    label: "Check failed",
    title: "This status alone does not mean the site is offline",
    steps: [
      "Select Check status to try the domain check again.",
      "Do not change DNS records based only on Check failed. If it keeps happening, contact Lovable support with the displayed warning.",
    ],
  },
  {
    value: "removed",
    label: "Removed",
    title: "Reconnect the domain if this project should use it",
    steps: [
      "Use Reconnect in Lovable and complete any ownership verification it requests.",
      "If the domain was moved to another project or provider intentionally, confirm the old DNS records are no longer needed before changing them.",
    ],
  },
] as const;

export default function LovableDomainStatusChecker() {
  const [status, setStatus] = useState("");
  const selected = statuses.find((item) => item.value === status);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6" aria-labelledby="lovable-domain-status-heading">
      <h2 id="lovable-domain-status-heading" className="text-xl font-semibold text-zinc-950">Lovable custom domain not working? Check its status</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-700">Choose the exact status shown under Project → Settings → Domains. The next step changes depending on whether Lovable is checking DNS, issuing SSL or waiting for the app to be published.</p>
      <label htmlFor="lovable-domain-status" className="mt-4 block text-sm font-semibold text-zinc-950">Domain status</label>
      <select
        id="lovable-domain-status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 focus:border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-700/20 sm:max-w-md"
      >
        <option value="">Select the status in Lovable</option>
        {statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      {selected ? (
        <div aria-live="polite" className="mt-5 rounded-xl bg-cyan-50 p-4">
          <h3 className="font-semibold text-zinc-950">{selected.title}</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-700">
            {selected.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      ) : null}
      <p className="mt-4 text-xs leading-5 text-zinc-500">For a standard connection, Lovable currently documents an A record and a verification TXT record; proxy mode uses a CNAME instead. Copy the exact values shown for your project and follow Lovable’s current <a className="font-semibold text-cyan-800 underline underline-offset-4" href="https://docs.lovable.dev/features/custom-domain" target="_blank" rel="noopener noreferrer">custom-domain guide</a>. This checker does not query DNS or change records.</p>
    </section>
  );
}
