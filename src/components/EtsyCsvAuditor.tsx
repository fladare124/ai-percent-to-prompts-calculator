"use client";

import { track } from "@vercel/analytics";
import { ChangeEvent, useMemo, useState } from "react";
import { ERANK_DISCLOSURE, ERANK_HREF, ERANK_REL } from "@/lib/partners";

type IssueKind = "title" | "tags" | "catalog";

type AuditIssue = {
  kind: IssueKind;
  level: "check" | "fix";
  message: string;
};

type ListingAudit = {
  id: string;
  rowNumber: number;
  title: string;
  description: string;
  materials: string;
  tags: string[];
  issues: AuditIssue[];
};

type Filter = "all" | IssueKind | "needs-review";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_LISTINGS = 25_000;
const validTagPattern = new RegExp("^[\\p{L}\\p{N} '&-]+$", "u");

const stopWords = new Set(
  [
    "a", "an", "and", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "with",
    "de", "del", "la", "las", "los", "el", "en", "para", "por", "con", "y", "un", "una",
  ],
);

const subjectivePhrases = [
  "beautiful", "perfect", "gorgeous", "stunning", "wonderful", "amazing", "lovely", "incredible",
  "hermoso", "hermosa", "perfecto", "perfecta", "maravilloso", "maravillosa", "precioso", "preciosa",
];

const giftingPhrases = [
  "gift for him", "gift for her", "gift for mom", "gift for dad", "birthday present", "perfect gift",
  "regalo para", "regalo de cumpleanos", "regalo perfecto",
];

const promotionalPhrases = [
  "on sale", "free shipping", "free delivery", "clearance", "discount", "% off", "envio gratis", "en oferta", "descuento",
];

const EtsyCsvAuditor = () => {
  const [listings, setListings] = useState<ListingAudit[]>([]);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(50);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [manualPrompt, setManualPrompt] = useState("");

  const issueTotals = useMemo(() => {
    const totals = { title: 0, tags: 0, catalog: 0, listings: 0 };
    for (const listing of listings) {
      if (listing.issues.length > 0) totals.listings += 1;
      totals.title += listing.issues.filter((issue) => issue.kind === "title").length;
      totals.tags += listing.issues.filter((issue) => issue.kind === "tags").length;
      totals.catalog += listing.issues.filter((issue) => issue.kind === "catalog").length;
    }
    return totals;
  }, [listings]);

  const repeatedTags = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    for (const listing of listings) {
      for (const tag of new Set(listing.tags.map(normalizeText).filter(Boolean))) {
        const existing = counts.get(tag);
        counts.set(tag, { label: existing?.label ?? tag, count: (existing?.count ?? 0) + 1 });
      }
    }
    return [...counts.values()]
      .filter((item) => item.count > 1)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 8);
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = normalizeText(search);
    return listings.filter((listing) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "needs-review" && listing.issues.length > 0) ||
        listing.issues.some((issue) => issue.kind === filter);
      const matchesSearch =
        !query ||
        normalizeText(listing.title).includes(query) ||
        listing.tags.some((tag) => normalizeText(tag).includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [filter, listings, search]);

  const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setError("");
    setIsReading(true);
    setActivePrompt(null);
    setManualPrompt("");
    setCopyStatus("");

    try {
      if (file.size > MAX_FILE_BYTES) {
        throw new Error("This file is over 10 MB. Export only active listings and try again.");
      }

      const parsed = parseListings(await file.text());
      setListings(parsed);
      setFilter("all");
      setSearch("");
      setVisibleCount(50);
      track("etsy_csv_audit_completed", {
        source: "etsy_csv",
      });
    } catch (caught) {
      setListings([]);
      setError(caught instanceof Error ? caught.message : "The CSV could not be read. Check the file and try again.");
    } finally {
      setIsReading(false);
    }
  };

  const loadSample = () => {
    const sampleCsv = [
      "TITLE,DESCRIPTION,TAGS,MATERIALS",
      '"Beautiful Moon Necklace, Perfect Gift for Her, Silver Moon Necklace, On Sale","Example listing only. A handmade silver necklace with a crescent moon pendant.","moon necklace|silver moon necklace|gift for her|gift for her|handmade jewelry","Sterling silver"',
      '"Sterling Silver Crescent Moon Necklace","Example listing only. A small crescent moon pendant on a sterling silver chain.","crescent moon|silver necklace|moon pendant|celestial jewelry|sterling silver|dainty necklace|moon jewelry|silver pendant|minimal necklace|lunar necklace|handmade jewelry|chain necklace|gift for her","Sterling silver"',
    ].join("\r\n");
    const sample = parseListings(sampleCsv);
    setListings(sample);
    setError("");
    setFilter("all");
    setSearch("");
    setVisibleCount(50);
    setActivePrompt(null);
    setManualPrompt("");
    setCopyStatus("");
    track("etsy_csv_sample_opened");
  };

  const resetAudit = () => {
    setListings([]);
    setError("");
    setFilter("all");
    setSearch("");
    setVisibleCount(50);
    setActivePrompt(null);
    setManualPrompt("");
    setCopyStatus("");
  };

  const downloadReport = () => {
    if (listings.length === 0) return;
    const header = ["CSV row", "Listing title", "Checks to review", "Current tags"];
    const rows = listings.map((listing) => [
      String(listing.rowNumber),
      listing.title,
      listing.issues.map((issue) => issue.message).join(" | ") || "No checks triggered",
      listing.tags.join(" | "),
    ]);
    const csv = [header, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `etsy-listing-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    track("etsy_csv_audit_report_downloaded");
  };

  const showPrompt = async (listing: ListingAudit) => {
    const nextPrompt = buildReviewPrompt(listing);
    setActivePrompt(listing.id);
    setManualPrompt(nextPrompt);
    setCopyStatus("");
    track("etsy_listing_prompt_created");
    try {
      await navigator.clipboard.writeText(nextPrompt);
      setCopyStatus("Prompt copied. Review it before pasting it into an AI assistant.");
      track("etsy_listing_prompt_copied");
    } catch {
      setCopyStatus("Select the prompt below and copy it manually.");
    }
  };

  const copyManualPrompt = async () => {
    if (!manualPrompt) return;
    try {
      await navigator.clipboard.writeText(manualPrompt);
      setCopyStatus("Prompt copied. Review it before pasting it into an AI assistant.");
      track("etsy_listing_prompt_copied");
    } catch {
      setCopyStatus("Clipboard access is blocked. Select the text and copy it manually.");
    }
  };

  const filteredCount = filteredListings.length;

  return (
    <section id="auditor" className="scroll-mt-8">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_-42px_rgba(31,41,35,0.34)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Step 1 · Your export</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Open an Etsy listings CSV</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">No login</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Use Etsy’s active-listings export. The file is read in this browser; it is not uploaded to our server.
          </p>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
            <p className="mt-4 font-semibold text-stone-900">Choose your CSV file</p>
            <p className="mt-1 text-xs text-stone-500">CSV up to 10 MB · active listings only</p>
            <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
              {isReading ? "Reading file…" : "Choose CSV"}
              <input
                type="file"
                accept=".csv,text/csv"
                disabled={isReading}
                onChange={onFileSelected}
                className="sr-only"
                aria-label="Choose Etsy active listings CSV file"
              />
            </label>
            <div className="mt-4">
              <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
                Try a sample audit
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">
              {error}
            </p>
          )}

          <div className="mt-5 border-t border-stone-100 pt-5">
            <p className="text-sm font-semibold text-stone-900">Find the export in Etsy</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
              <li><span className="font-semibold text-stone-800">1.</span> Shop Manager → Settings → Options</li>
              <li><span className="font-semibold text-stone-800">2.</span> Open Download Data → Download CSV</li>
              <li><span className="font-semibold text-stone-800">3.</span> Choose that file above</li>
            </ol>
            <a href="https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
              Etsy’s export instructions ↗
            </a>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200 bg-[#f0efe7] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Step 2 · Review, don’t guess</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">A practical checkup for your catalogue</h2>
            </div>
            {listings.length > 0 && (
              <button type="button" onClick={resetAudit} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-500">
                Clear report
              </button>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <PreviewCard number="01" title="Title guidance" text="Spot unusually long titles, repeated words, gift-heavy phrasing and sales language for a human review." />
              <PreviewCard number="02" title="Tag checks" text="Find missing tag slots, repeated tags and tags that exceed Etsy’s 20-character limit." />
              <PreviewCard number="03" title="Shop-wide patterns" text="Notice titles or tags used across multiple listings. Repetition is a clue to review, not an automatic mistake." />
              <PreviewCard number="04" title="Copy-ready AI prompt" text="Create a prompt for one listing without sending the title, tags or description from this page." />
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric value={String(listings.length)} label="listings scanned" />
                <Metric value={String(issueTotals.listings)} label="to review" />
                <Metric value={String(issueTotals.title)} label="title checks" />
                <Metric value={String(issueTotals.tags)} label="tag checks" />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={downloadReport} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">
                  Download audit CSV
                </button>
                <a href={ERANK_HREF} target="_blank" rel={ERANK_REL} onClick={() => track("partner_tool_clicked", { partner: "erank", source: "audit_summary" })} className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-emerald-700">
                  Research real keywords with eRank ↗
                </a>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                This checker does not have Etsy search-volume or ranking data. eRank is a separate service; {ERANK_DISCLOSURE}
              </p>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-stone-950">Listings to review</p>
                  <span className="text-xs text-stone-500">Showing {Math.min(visibleCount, filteredCount)} of {filteredCount}</span>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="audit-search">Search listing titles or tags</label>
                  <input id="audit-search" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(50); }} placeholder="Search titles or tags" className="min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
                  <label className="sr-only" htmlFor="audit-filter">Filter report</label>
                  <select id="audit-filter" value={filter} onChange={(event) => { setFilter(event.target.value as Filter); setVisibleCount(50); }} className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100">
                    <option value="all">All listings</option>
                    <option value="needs-review">Needs review</option>
                    <option value="title">Title checks</option>
                    <option value="tags">Tag checks</option>
                    <option value="catalog">Shop-wide patterns</option>
                  </select>
                </div>

                <div className="mt-4 space-y-3">
                  {filteredListings.slice(0, visibleCount).map((listing) => (
                    <article key={listing.id} className="rounded-xl border border-stone-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">CSV row {listing.rowNumber}</p>
                          <h3 className="mt-1 break-words text-sm font-semibold leading-6 text-stone-900">{listing.title || "Untitled listing"}</h3>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${listing.issues.length > 0 ? "bg-amber-100 text-amber-950" : "bg-emerald-100 text-emerald-950"}`}>
                          {listing.issues.length > 0 ? `${listing.issues.length} ${listing.issues.length === 1 ? "check" : "checks"}` : "No checks"}
                        </span>
                      </div>

                      {listing.issues.length > 0 ? (
                        <ul className="mt-3 space-y-2">
                          {listing.issues.map((issue, index) => (
                            <li key={`${listing.id}-${index}`} className="flex gap-2 text-sm leading-5 text-stone-700">
                              <span aria-hidden="true" className={`mt-1 h-2 w-2 shrink-0 rounded-full ${issue.level === "fix" ? "bg-rose-500" : "bg-amber-500"}`} />
                              <span>{issue.message}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-stone-600">No checks were triggered by the rules in this audit.</p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button type="button" onClick={() => void showPrompt(listing)} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
                          Make a review prompt
                        </button>
                        {listing.tags.length > 0 && <span className="text-xs text-stone-500">{listing.tags.length} tags in this file</span>}
                      </div>
                      {activePrompt === listing.id && (
                        <div className="mt-4 rounded-xl bg-[#f7f6f0] p-3 sm:p-4">
                          <label htmlFor={`prompt-${listing.id}`} className="text-xs font-semibold uppercase tracking-wide text-stone-600">Prompt text</label>
                          <textarea id={`prompt-${listing.id}`} value={manualPrompt} readOnly onFocus={(event) => event.currentTarget.select()} rows={9} className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 font-mono text-xs leading-5 text-stone-800 outline-none focus:border-emerald-700" />
                          <p role="status" className="mt-2 text-xs leading-5 text-stone-600">{copyStatus} The listing text stays on this page until you choose to copy it.</p>
                          <button type="button" onClick={() => void copyManualPrompt()} className="mt-3 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-700">Copy prompt again</button>
                          <p className="mt-2 text-xs leading-5 text-stone-500">If you paste it into an AI assistant, that provider’s privacy terms apply. Check every suggestion before editing a live listing.</p>
                        </div>
                      )}
                    </article>
                  ))}
                  {filteredCount === 0 && <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-600">No listings match this filter.</p>}
                  {filteredCount > visibleCount && (
                    <button type="button" onClick={() => setVisibleCount((count) => count + 50)} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 hover:border-emerald-700">
                      Show 50 more listings
                    </button>
                  )}
                </div>
              </div>

              {repeatedTags.length > 0 && (
                <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                  <h3 className="font-semibold text-stone-950">Tags repeated across this shop</h3>
                  <p className="mt-1 text-xs leading-5 text-stone-600">Frequency is a prompt to inspect relevance. Reusing a tag is not automatically a problem.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {repeatedTags.map((tag) => <span key={tag.label} className="rounded-full bg-stone-100 px-3 py-1.5 text-xs text-stone-700">{tag.label} <strong className="ml-1 text-stone-950">×{tag.count}</strong></span>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

function PreviewCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-xs font-bold tracking-[0.12em] text-emerald-800">{number}</p>
      <h3 className="mt-3 font-semibold text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <p className="text-2xl font-semibold tracking-tight text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-600">{label}</p>
    </div>
  );
}

function parseListings(csvText: string): ListingAudit[] {
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) throw new Error("The file is empty. Choose an Etsy active-listings CSV export.");
  const delimiter = detectDelimiter(cleanText);
  const rows = parseCsv(cleanText, delimiter).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("The CSV has a header but no listing rows.");

  const headings = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headings, ["title", "listingtitle", "itemtitle"]);
  const tagsIndex = findColumn(headings, ["tags", "tag", "listingtags", "keywords"]);
  const descriptionIndex = findColumn(headings, ["description", "listingdescription"]);
  const materialsIndex = findColumn(headings, ["materials", "material"]);

  if (titleIndex < 0 || tagsIndex < 0) {
    throw new Error("I couldn’t find both title and tags columns. Use Etsy’s active-listings export with a Title and Tags column.");
  }

  const listingRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (listingRows.length > MAX_LISTINGS) {
    throw new Error(`This file has more than ${MAX_LISTINGS.toLocaleString()} listing rows. Export a smaller group and try again.`);
  }

  const normalizedRows = listingRows.map((row, index) => ({
    rowNumber: index + 2,
    title: row[titleIndex]?.trim() ?? "",
    description: descriptionIndex >= 0 ? row[descriptionIndex]?.trim() ?? "" : "",
    materials: materialsIndex >= 0 ? row[materialsIndex]?.trim() ?? "" : "",
    tags: parseTags(row[tagsIndex] ?? ""),
  }));

  return auditRows(normalizedRows);
}

function detectDelimiter(text: string): string {
  const counts = new Map([[",", 0], [";", 0], ["\t", 0]]);
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') index += 1;
      else inQuotes = !inQuotes;
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      break;
    } else if (!inQuotes && counts.has(character)) {
      counts.set(character, (counts.get(character) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (inQuotes) throw new Error("The CSV contains an unclosed quoted field. Re-download it from Etsy and try again.");
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function auditRows(
  sourceRows: Array<{ rowNumber: number; title: string; description: string; materials: string; tags: string[] }>,
): ListingAudit[] {
  const audits = sourceRows.map((source, index) => {
    const listing: ListingAudit = {
      id: `listing-${index}-${source.rowNumber}`,
      rowNumber: source.rowNumber,
      title: source.title,
      description: source.description,
      materials: source.materials,
      tags: source.tags,
      issues: [],
    };
    listing.issues.push(...checkTitle(source.title), ...checkTags(source.tags));
    return listing;
  });

  const titles = new Map<string, ListingAudit[]>();
  for (const listing of audits) {
    const normalized = normalizeText(listing.title);
    if (!normalized) continue;
    titles.set(normalized, [...(titles.get(normalized) ?? []), listing]);
  }
  for (const matches of titles.values()) {
    if (matches.length < 2) continue;
    for (const listing of matches) {
      const rows = matches.filter((match) => match.id !== listing.id).map((match) => match.rowNumber).join(", ");
      listing.issues.push({
        kind: "catalog",
        level: "check",
        message: `This exact title also appears on CSV row${matches.length > 2 ? "s" : ""} ${rows}. Check whether each listing is distinct.`,
      });
    }
  }
  return audits;
}

function checkTitle(title: string): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (!title.trim()) {
    return [{ kind: "title", level: "fix", message: "No title was found in this row." }];
  }

  const characterCount = Array.from(title).length;
  if (characterCount > 140) {
    issues.push({ kind: "title", level: "fix", message: `The title is ${characterCount} characters. Etsy’s title field supports up to 140.` });
  }

  const words = title.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g) ?? [];
  if (words.length >= 15) {
    issues.push({ kind: "title", level: "check", message: `The title has ${words.length} words. Etsy suggests considering fewer than 15 for easier scanning.` });
  }

  const repeatedWords = new Set<string>();
  const seenWords = new Set<string>();
  for (const word of words.map(normalizeText)) {
    if (stopWords.has(word)) continue;
    if (seenWords.has(word)) repeatedWords.add(word);
    seenWords.add(word);
  }
  if (repeatedWords.size > 0) {
    issues.push({ kind: "title", level: "check", message: `Repeated word${repeatedWords.size > 1 ? "s" : ""}: ${[...repeatedWords].join(", ")}. Check whether each repetition helps a buyer understand the item.` });
  }

  const normalizedTitle = normalizeText(title);
  const subjective = subjectivePhrases.filter((phrase) => phrasePattern(phrase).test(normalizedTitle));
  if (subjective.length > 0) {
    issues.push({ kind: "title", level: "check", message: `Subjective wording to review: ${subjective.join(", ")}. Etsy suggests moving these descriptions out of the title.` });
  }

  const promotional = promotionalPhrases.filter((phrase) => normalizedTitle.includes(normalizeText(phrase)));
  if (promotional.length > 0) {
    issues.push({ kind: "title", level: "check", message: `Sales or shipping wording to review: ${promotional.join(", ")}. Etsy says this information does not belong in the title.` });
  }

  const gifting = giftingPhrases.filter((phrase) => normalizedTitle.includes(normalizeText(phrase)));
  if (gifting.length > 0) {
    issues.push({ kind: "title", level: "check", message: `Gifting phrase to review: ${gifting.join(", ")}. Keep a recipient or occasion only when it is essential to the item.` });
  }

  return issues;
}

function checkTags(tags: string[]): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (tags.length < 13) {
    issues.push({ kind: "tags", level: "check", message: `Only ${tags.length} non-empty tags were found. Etsy recommends using all 13 relevant tag slots.` });
  }
  if (tags.length > 13) {
    issues.push({ kind: "tags", level: "fix", message: `${tags.length} tags were found. Etsy allows up to 13 tags per listing.` });
  }

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const tag of tags) {
    const normalized = normalizeText(tag);
    if (!normalized) continue;
    if (seen.has(normalized)) duplicates.add(tag.trim());
    seen.add(normalized);
    if (tag.trim().length > 20) {
      issues.push({ kind: "tags", level: "fix", message: `“${tag.trim()}” has ${tag.trim().length} characters; Etsy allows up to 20 per tag.` });
    }
    if (!validTagPattern.test(tag.trim()) || /^['-]/.test(tag.trim())) {
      issues.push({ kind: "tags", level: "check", message: `“${tag.trim()}” uses characters Etsy may not accept. Check the tag in Etsy before publishing.` });
    }
  }
  if (duplicates.size > 0) {
    issues.push({ kind: "tags", level: "check", message: `Repeated tag${duplicates.size > 1 ? "s" : ""} in this listing: ${[...duplicates].join(", ")}.` });
  }
  return issues;
}

function buildReviewPrompt(listing: ListingAudit): string {
  return [
    "Help me review one Etsy product listing. Work only with the facts I provide; do not invent materials, sizes, personalization options, production methods, claims, or keyword search volume.",
    "",
    "Follow Etsy’s current listing-title guidance: state the item clearly once, put important objective traits first, keep the wording easy to scan, avoid unnecessary repetition and subjective or promotional language, and consider fewer than 15 words. Keep any proposed title within 140 characters.",
    "Return: (1) one clear title suggestion, (2) exactly 13 relevant, distinct Etsy tag ideas of 20 characters or fewer each, (3) a short buyer-friendly opening for the description, and (4) a list of any missing facts I should confirm. Do not claim that any phrase has search volume or will improve rank. Keep the same language as the listing.",
    "",
    `Current title: ${listing.title || "[none]"}`,
    `Description: ${listing.description || "[none]"}`,
    `Materials: ${listing.materials || "[none]"}`,
    `Current tags: ${listing.tags.join(" | ") || "[none]"}`,
  ].join("\n");
}

function parseTags(value: string): string[] {
  const cleaned = value.trim().replace(/^\[|\]$/g, "");
  if (!cleaned) return [];
  return cleaned.split(/[|;,]/).map((tag) => tag.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
}

function normalizeHeader(value: string): string {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findColumn(headers: string[], names: string[]): number {
  return headers.findIndex((header) => names.includes(header));
}

function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function phrasePattern(phrase: string): RegExp {
  return new RegExp(`(^|[^a-z0-9])${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9])`, "i");
}

function toCsvCell(value: string): string {
  const spreadsheetSafe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${spreadsheetSafe.replace(/"/g, '""')}"`;
}

export default EtsyCsvAuditor;
