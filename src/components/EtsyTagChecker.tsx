"use client";

import { useMemo, useState } from "react";

const tagPattern = /^[\p{L}\p{N} '-]+$/u;

type TagResult = {
  tag: string;
  characters: number;
  tooLong: boolean;
  duplicate: boolean;
  invalid: boolean;
  beyondLimit: boolean;
};

export default function EtsyTagChecker() {
  const [rawTags, setRawTags] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const tags = useMemo(
    () => rawTags.trim()
      ? rawTags.split(/[\r\n,]+/).map((tag) => tag.trim()).filter(Boolean)
      : [],
    [rawTags],
  );

  const results = useMemo(() => {
    const counts = new Map<string, number>();
    for (const tag of tags) {
      const normalized = tag.toLowerCase().replace(/\s+/g, " ").trim();
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }

    return tags.map((tag, index): TagResult => {
      const normalized = tag.toLowerCase().replace(/\s+/g, " ").trim();
      const characters = Array.from(tag).length;
      return {
        tag,
        characters,
        tooLong: characters > 20,
        duplicate: (counts.get(normalized) ?? 0) > 1,
        invalid: !tagPattern.test(tag) || /^['-]/.test(tag),
        beyondLimit: index >= 13,
      };
    });
  }, [tags]);

  const tagsToReview = results.filter((result) =>
    result.tooLong || result.duplicate || result.invalid || result.beyondLimit
  ).length;

  const clearTags = () => {
    setRawTags("");
    setCopyStatus("");
  };

  const copyTags = async () => {
    if (tags.length === 0) return;
    try {
      await navigator.clipboard.writeText(tags.join("\n"));
      setCopyStatus("Copied. Confirm each tag in Etsy before saving.");
    } catch {
      setCopyStatus("Your browser did not allow copying. Select the tags above and copy them manually.");
    }
  };

  return (
    <section aria-labelledby="tag-checker-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Free, private tag check</p>
          <h2 id="tag-checker-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Check your tag list</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">Paste one tag per line, or separate tags with commas. The check runs in this browser.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">No sign-in</span>
      </div>

      <label htmlFor="etsy-tags" className="mt-6 block text-sm font-semibold text-stone-900">Your Etsy tags</label>
      <textarea
        id="etsy-tags"
        value={rawTags}
        onChange={(event) => { setRawTags(event.target.value); setCopyStatus(""); }}
        placeholder={"silver earrings\nminimalist jewelry\nhandmade gift"}
        rows={8}
        spellCheck={false}
        className="mt-2 w-full rounded-2xl border border-stone-300 bg-[#fbfaf6] p-4 text-sm leading-6 text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyTags} disabled={tags.length === 0} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40">
          Copy tags
        </button>
        <button type="button" onClick={clearTags} disabled={tags.length === 0} className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-40">
          Clear
        </button>
      </div>

      {tags.length > 0 && (
        <div className="mt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7f6f0] p-4">
              <p className="text-2xl font-semibold text-stone-950">{tags.length} / 13</p>
              <p className="mt-1 text-xs text-stone-600">tags entered</p>
            </div>
            <div className="rounded-2xl bg-[#f7f6f0] p-4">
              <p className="text-2xl font-semibold text-stone-950">{Math.max(0, 13 - tags.length)}</p>
              <p className="mt-1 text-xs text-stone-600">available tag slots</p>
            </div>
            <div className={"rounded-2xl p-4 " + (tagsToReview > 0 ? "bg-amber-50" : "bg-emerald-50")}>
              <p className="text-2xl font-semibold text-stone-950">{tagsToReview}</p>
              <p className="mt-1 text-xs text-stone-600">tags to review</p>
            </div>
          </div>

          {tags.length < 13 && (
            <p className="mt-4 rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3 text-sm leading-6 text-stone-700">
              Etsy allows up to 13 tags per listing. Use available slots only for accurate, relevant tags; the number of tags alone does not show how well they match shoppers.
            </p>
          )}
          {tags.length > 13 && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900" role="alert">
              Etsy allows up to 13 tags per listing. Tags 14 and above are marked below.
            </p>
          )}

          <ul className="mt-4 space-y-2" aria-label="Tag check results" aria-live="polite">
            {results.map((result, index) => {
              const needsReview = result.tooLong || result.duplicate || result.invalid || result.beyondLimit;
              const reasons = [
                result.tooLong ? "over 20 characters" : "",
                result.duplicate ? "duplicate" : "",
                result.invalid ? "check characters" : "",
                result.beyondLimit ? "over Etsy's 13-tag limit" : "",
              ].filter(Boolean);

              return (
                <li key={index} className={"flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 " + (needsReview ? "border-amber-200 bg-amber-50/70" : "border-stone-200 bg-white")}>
                  <div className="min-w-0">
                    <span className="mr-2 text-xs font-semibold text-stone-500">{index + 1}.</span>
                    <span className="break-words text-sm font-medium text-stone-900">{result.tag}</span>
                    {reasons.length > 0 && <p className="ml-5 mt-1 text-xs text-amber-900">{reasons.join(" · ")}</p>}
                  </div>
                  <span className={"shrink-0 text-xs font-semibold " + (result.tooLong ? "text-rose-800" : "text-stone-500")}>
                    {result.characters} / 20
                  </span>
                </li>
              );
            })}
          </ul>

          <p role="status" aria-live="polite" className="mt-3 text-sm text-stone-600">
            {copyStatus || "Character counts include spaces. Repeated tags are detected without regard to capitalization."}
          </p>
        </div>
      )}
    </section>
  );
}
