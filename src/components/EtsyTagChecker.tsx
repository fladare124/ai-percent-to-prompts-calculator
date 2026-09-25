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

export default function EtsyTagChecker({ locale = "en" }: { locale?: "en" | "es" }) {
  const text = locale === "es"
    ? {
        eyebrow: "Comprobador privado y gratuito de etiquetas",
        heading: "Revisa tus etiquetas de Etsy",
        intro: "Pega una etiqueta por línea o sepáralas con comas. La comprobación se realiza en este navegador.",
        noSignIn: "Sin iniciar sesión",
        yourTags: "Tus etiquetas de Etsy",
        placeholder: "pendientes de plata\njoyería minimalista\nregalo artesanal",
        copy: "Copiar etiquetas",
        clear: "Borrar",
        entered: "etiquetas introducidas",
        available: "espacios disponibles",
        review: "etiquetas para revisar",
        fewer: "Etsy permite hasta 13 etiquetas por anuncio. Usa los espacios disponibles solo para etiquetas precisas y relevantes; el número por sí solo no indica si coinciden con las búsquedas de compradores.",
        more: "Etsy permite hasta 13 etiquetas por anuncio. Las etiquetas a partir de la número 14 aparecen marcadas abajo.",
        tooLong: "más de 20 caracteres",
        duplicate: "duplicada",
        characters: "revisa los caracteres",
        overLimit: "supera el límite de Etsy (13)",
        resultLabel: "Resultados de la comprobación de etiquetas",
        copied: "Copiadas. Comprueba cada etiqueta en Etsy antes de guardarla.",
        copyError: "El navegador no permitió copiarlas. Selecciona las etiquetas de arriba y cópialas manualmente.",
        countNote: "El recuento incluye los espacios. Las etiquetas repetidas se detectan aunque cambien las mayúsculas o minúsculas.",
      }
    : {
        eyebrow: "Free, private tag check",
        heading: "Check your tag list",
        intro: "Paste one tag per line, or separate tags with commas. The check runs in this browser.",
        noSignIn: "No sign-in",
        yourTags: "Your Etsy tags",
        placeholder: "silver earrings\nminimalist jewelry\nhandmade gift",
        copy: "Copy tags",
        clear: "Clear",
        entered: "tags entered",
        available: "available tag slots",
        review: "tags to review",
        fewer: "Etsy allows up to 13 tags per listing. Use available slots only for accurate, relevant tags; the number of tags alone does not show how well they match shoppers.",
        more: "Etsy allows up to 13 tags per listing. Tags 14 and above are marked below.",
        tooLong: "over 20 characters",
        duplicate: "duplicate",
        characters: "check characters",
        overLimit: "over Etsy's 13-tag limit",
        resultLabel: "Tag check results",
        copied: "Copied. Confirm each tag in Etsy before saving.",
        copyError: "Your browser did not allow copying. Select the tags above and copy them manually.",
        countNote: "Character counts include spaces. Repeated tags are detected without regard to capitalization.",
      };
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
      setCopyStatus(text.copied);
    } catch {
      setCopyStatus(text.copyError);
    }
  };

  return (
    <section aria-labelledby="tag-checker-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">{text.eyebrow}</p>
          <h2 id="tag-checker-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">{text.heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{text.intro}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">{text.noSignIn}</span>
      </div>

      <label htmlFor="etsy-tags" className="mt-6 block text-sm font-semibold text-stone-900">{text.yourTags}</label>
      <textarea
        id="etsy-tags"
        value={rawTags}
        onChange={(event) => { setRawTags(event.target.value); setCopyStatus(""); }}
        placeholder={text.placeholder}
        rows={8}
        spellCheck={false}
        className="mt-2 w-full rounded-2xl border border-stone-300 bg-[#fbfaf6] p-4 text-sm leading-6 text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyTags} disabled={tags.length === 0} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40">
          {text.copy}
        </button>
        <button type="button" onClick={clearTags} disabled={tags.length === 0} className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-40">
          {text.clear}
        </button>
      </div>

      {tags.length > 0 && (
        <div className="mt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7f6f0] p-4">
              <p className="text-2xl font-semibold text-stone-950">{tags.length} / 13</p>
              <p className="mt-1 text-xs text-stone-600">{text.entered}</p>
            </div>
            <div className="rounded-2xl bg-[#f7f6f0] p-4">
              <p className="text-2xl font-semibold text-stone-950">{Math.max(0, 13 - tags.length)}</p>
              <p className="mt-1 text-xs text-stone-600">{text.available}</p>
            </div>
            <div className={"rounded-2xl p-4 " + (tagsToReview > 0 ? "bg-amber-50" : "bg-emerald-50")}>
              <p className="text-2xl font-semibold text-stone-950">{tagsToReview}</p>
              <p className="mt-1 text-xs text-stone-600">{text.review}</p>
            </div>
          </div>

          {tags.length < 13 && (
            <p className="mt-4 rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3 text-sm leading-6 text-stone-700">
              {text.fewer}
            </p>
          )}
          {tags.length > 13 && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900" role="alert">
              {text.more}
            </p>
          )}

          <ul className="mt-4 space-y-2" aria-label={text.resultLabel} aria-live="polite">
            {results.map((result, index) => {
              const needsReview = result.tooLong || result.duplicate || result.invalid || result.beyondLimit;
              const reasons = [
                result.tooLong ? text.tooLong : "",
                result.duplicate ? text.duplicate : "",
                result.invalid ? text.characters : "",
                result.beyondLimit ? text.overLimit : "",
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
            {copyStatus || text.countNote}
          </p>
        </div>
      )}
    </section>
  );
}
