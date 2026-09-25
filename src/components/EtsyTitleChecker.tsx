"use client";

import { useMemo, useState } from "react";

type Locale = "en" | "es";

const stopWords = {
  en: new Set(["the", "and", "for", "with", "from", "your", "this", "that", "into", "of", "in", "to", "a", "an"]),
  es: new Set(["para", "con", "desde", "este", "esta", "estos", "estas", "que", "por", "del", "de", "la", "el", "los", "las", "un", "una", "y", "en"]),
};

const reviewWords = {
  en: {
    subjective: new Set(["perfect", "beautiful", "wonderful"]),
    giftPhrases: ["gift for", "birthday present", "personalized gift", "personalised gift"],
    salePhrases: ["on sale", "free shipping", "free delivery"],
  },
  es: {
    subjective: new Set(["perfecto", "perfecta", "hermoso", "hermosa", "precioso", "preciosa", "maravilloso", "maravillosa"]),
    giftPhrases: ["regalo para", "regalo de cumpleaños", "regalo perfecto"],
    salePhrases: ["en oferta", "envío gratis", "envio gratis", "envío gratuito", "envio gratuito"],
  },
};

function normalizeWord(word: string, locale: Locale): string {
  return word
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase(locale === "es" ? "es-ES" : "en-US");
}

function countCharacters(text: string): number {
  return Array.from(text.normalize("NFC")).length;
}

function repeatedWords(text: string, locale: Locale): string[] {
  const words = text.match(/[\p{L}\p{N}]+/gu) ?? [];
  const counts = new Map<string, { display: string; count: number }>();

  for (const word of words) {
    const normalized = normalizeWord(word, locale);
    if (normalized.length < 3 || stopWords[locale].has(normalized)) continue;
    const current = counts.get(normalized);
    counts.set(normalized, { display: current?.display ?? word, count: (current?.count ?? 0) + 1 });
  }

  return [...counts.values()].filter((item) => item.count > 1).map((item) => item.display);
}

function includesPhrase(text: string, phrase: string, locale: Locale): boolean {
  const normalizedText = text.toLocaleLowerCase(locale === "es" ? "es-ES" : "en-US");
  const normalizedPhrase = phrase.toLocaleLowerCase(locale === "es" ? "es-ES" : "en-US");
  return normalizedText.includes(normalizedPhrase);
}

export default function EtsyTitleChecker({ locale = "en" }: { locale?: Locale }) {
  const [title, setTitle] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const spanish = locale === "es";
  const words = useMemo(() => title.trim().match(/\S+/gu) ?? [], [title]);
  const characters = useMemo(() => countCharacters(title), [title]);
  const repeated = useMemo(() => repeatedWords(title, locale), [title, locale]);
  const notes = useMemo(() => {
    if (!title.trim()) return { subjective: [] as string[], giftPhrases: [] as string[], salePhrases: [] as string[] };

    const guidance = reviewWords[locale];
    const subjective = (title.match(/[\p{L}\p{N}]+/gu) ?? [])
      .filter((word) => guidance.subjective.has(normalizeWord(word, locale)));
    const giftPhrases = guidance.giftPhrases.filter((phrase) => includesPhrase(title, phrase, locale));
    const salePhrases = guidance.salePhrases.filter((phrase) => includesPhrase(title, phrase, locale));

    return { subjective: [...new Set(subjective)], giftPhrases, salePhrases };
  }, [title, locale]);

  const text = spanish
    ? {
        eyebrow: "Comprobador de títulos de Etsy · Gratis y privado",
        heading: "Pega el título de un anuncio",
        intro: "Revisa el límite de caracteres, el número de palabras y posibles repeticiones. El análisis se hace en este navegador.",
        label: "Título del anuncio de Etsy",
        placeholder: "Por ejemplo: Taza de cerámica azul hecha a mano",
        copy: "Copiar título",
        clear: "Borrar",
        characterCount: "caracteres",
        wordCount: "palabras",
        repeatedLabel: "palabras repetidas",
        hardLimit: "Etsy permite hasta 140 caracteres en el título.",
        overLimit: "Este título supera los 140 caracteres. Acórtalo y vuelve a comprobarlo en Etsy antes de guardarlo.",
        wordAdvice: "Etsy sugiere considerar menos de 15 palabras para que el título sea fácil de leer. Es una recomendación, no un límite técnico.",
        repeatedAdvice: "Revisa si estas palabras repetidas aportan información: ",
        subjectiveAdvice: "Etsy recomienda mover palabras subjetivas como estas a la descripción: ",
        giftAdvice: "Revisa si esta frase de regalo es esencial para describir el artículo: ",
        saleAdvice: "Revisa las menciones de oferta o envío: Etsy recomienda dejar esos datos fuera del título porque aparecen en otras partes del anuncio.",
        noFlags: "No aparecen señales automáticas que revisar. Comprueba que el título describa el artículo con precisión.",
        countNote: "El recuento es orientativo para editar el título; Etsy es la referencia al guardar el anuncio.",
        copied: "Título copiado.",
        copyError: "No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.",
        rule: "Límite de Etsy",
        suggestion: "Sugerencia de legibilidad",
        review: "Revisión opcional",
      }
    : {
        eyebrow: "Free Etsy title checker · Private in your browser",
        heading: "Paste a listing title",
        intro: "Check the character limit, word count and possible repetition. The analysis runs in this browser.",
        label: "Etsy listing title",
        placeholder: "For example: Handmade blue ceramic mug",
        copy: "Copy title",
        clear: "Clear",
        characterCount: "characters",
        wordCount: "words",
        repeatedLabel: "repeated words",
        hardLimit: "Etsy allows up to 140 characters in a listing title.",
        overLimit: "This title is over 140 characters. Shorten it, then check it in Etsy before saving.",
        wordAdvice: "Etsy suggests considering fewer than 15 words to keep a title easy to read. This is guidance, not a technical limit.",
        repeatedAdvice: "Review whether these repeated words add useful detail: ",
        subjectiveAdvice: "Etsy recommends moving subjective words like these to the description: ",
        giftAdvice: "Review whether this gifting phrase is essential to describing the item: ",
        saleAdvice: "Review sale or shipping mentions: Etsy recommends leaving these details out of the title because they appear elsewhere in a listing.",
        noFlags: "No automatic points to review. Check that the title describes the item accurately.",
        countNote: "Counts are an editing aid; Etsy is the source of truth when you save a listing.",
        copied: "Title copied.",
        copyError: "Automatic copying was unavailable. Select the text and copy it manually.",
        rule: "Etsy limit",
        suggestion: "Readability suggestion",
        review: "Optional review",
      };

  const guidanceCount = (words.length >= 15 ? 1 : 0) + (repeated.length > 0 ? 1 : 0) + (notes.subjective.length > 0 ? 1 : 0) + (notes.giftPhrases.length > 0 ? 1 : 0) + (notes.salePhrases.length > 0 ? 1 : 0);

  const copyTitle = async () => {
    if (!title) return;
    try {
      await navigator.clipboard.writeText(title);
      setCopyStatus(text.copied);
    } catch {
      setCopyStatus(text.copyError);
    }
  };

  const clearTitle = () => {
    setTitle("");
    setCopyStatus("");
  };

  return (
    <section aria-labelledby="etsy-title-checker-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">{text.eyebrow}</p>
          <h2 id="etsy-title-checker-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">{text.heading}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{text.intro}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">{spanish ? "Sin subir archivos" : "No file upload"}</span>
      </div>

      <label htmlFor="etsy-listing-title" className="mt-6 block text-sm font-semibold text-stone-900">{text.label}</label>
      <textarea
        id="etsy-listing-title"
        value={title}
        onChange={(event) => { setTitle(event.target.value); setCopyStatus(""); }}
        placeholder={text.placeholder}
        rows={3}
        className="mt-2 w-full resize-y rounded-2xl border border-stone-300 bg-[#fbfaf6] p-4 text-base leading-7 text-stone-900 outline-none placeholder:text-stone-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyTitle} disabled={!title} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40">{text.copy}</button>
        <button type="button" onClick={clearTitle} disabled={!title} className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500 disabled:cursor-not-allowed disabled:opacity-40">{text.clear}</button>
      </div>

      {title.trim() && (
        <div className="mt-6" aria-live="polite">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className={`rounded-2xl p-4 ${characters > 140 ? "bg-rose-50" : "bg-emerald-50"}`}>
              <p className={`text-2xl font-semibold ${characters > 140 ? "text-rose-900" : "text-stone-950"}`}>{characters} / 140</p>
              <p className="mt-1 text-xs text-stone-600">{text.characterCount}</p>
            </div>
            <div className={`rounded-2xl p-4 ${words.length >= 15 ? "bg-amber-50" : "bg-[#f7f6f0]"}`}>
              <p className="text-2xl font-semibold text-stone-950">{words.length}</p>
              <p className="mt-1 text-xs text-stone-600">{text.wordCount}</p>
            </div>
            <div className={`rounded-2xl p-4 ${repeated.length > 0 ? "bg-amber-50" : "bg-[#f7f6f0]"}`}>
              <p className="text-2xl font-semibold text-stone-950">{repeated.length}</p>
              <p className="mt-1 text-xs text-stone-600">{text.repeatedLabel}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2" role="status">
            {characters > 140 && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900"><strong>{text.rule}:</strong> {text.overLimit}</p>}
            {characters <= 140 && <p className="rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-3 text-sm leading-6 text-stone-700"><strong>{text.rule}:</strong> {text.hardLimit}</p>}
            {words.length >= 15 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"><strong>{text.suggestion}:</strong> {text.wordAdvice}</p>}
            {repeated.length > 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"><strong>{text.review}:</strong> {text.repeatedAdvice}{repeated.join(", ")}.</p>}
            {notes.subjective.length > 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"><strong>{text.review}:</strong> {text.subjectiveAdvice}{notes.subjective.join(", ")}.</p>}
            {notes.giftPhrases.length > 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"><strong>{text.review}:</strong> {text.giftAdvice}{notes.giftPhrases.join(", ")}.</p>}
            {notes.salePhrases.length > 0 && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950"><strong>{text.review}:</strong> {text.saleAdvice}</p>}
            {characters <= 140 && guidanceCount === 0 && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">{text.noFlags}</p>}
          </div>
          <p role="status" className="mt-3 text-xs leading-5 text-stone-500">{copyStatus || text.countNote}</p>
        </div>
      )}
    </section>
  );
}
