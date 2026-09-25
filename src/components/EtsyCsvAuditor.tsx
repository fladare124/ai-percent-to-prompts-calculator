"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { ERANK_DISCLOSURE, ERANK_HREF, ERANK_IS_AFFILIATE, ERANK_REL } from "@/lib/partners";

type Locale = "en" | "es";

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

type AvailableColumns = {
  description: boolean;
  materials: boolean;
  price: boolean;
  currency: boolean;
  quantity: boolean;
  imageUrls: boolean;
  sku: boolean;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_LISTINGS = 25_000;
const validTagPattern = new RegExp("^[\\p{L}\\p{N} '-]+$", "u");

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

const uiText = {
  en: {
    stepOne: "Step 1 · Your export", openCsv: "Open an Etsy listings CSV", noLogin: "No login",
    exportPrivacy: "Use Etsy’s active-listings export. The file is read in this browser; it is not uploaded to our server.",
    chooseFile: "Choose your CSV file", csvLimit: "CSV up to 10 MB · active listings only", reading: "Reading file…", chooseCsv: "Choose CSV",
    trySample: "Try a sample audit", findExport: "Find the export in Etsy",
    exportStep1: "Shop Manager → Settings → Options", exportStep2: "Open Download Data → Download CSV", exportStep3: "Choose that file above",
    etsyInstructions: "Etsy’s export instructions ↗", stepTwo: "Step 2 · Review, don’t guess", practicalReview: "A practical checkup for your catalogue",
    clearReport: "Clear report", previewTitle: "Title guidance", previewTitleText: "Spot unusually long titles, repeated words, gift-heavy phrasing and sales language for a human review.",
    previewTags: "Tag checks", previewTagsText: "Find missing tag slots, repeated tags and tags that exceed Etsy’s 20-character limit.",
    previewDetails: "Listing details", previewDetailsText: "Review blank description, price, quantity, currency and image fields when they are present in your export. Materials are checked as an optional reminder.",
    previewShop: "Shop-wide patterns", previewShopText: "Notice duplicate titles, repeated tags and reused SKUs across listings. Repetition is a prompt to review, not an automatic mistake.",
    previewPrompt: "Copy-ready AI prompt", previewPromptText: "Create a prompt for one listing without sending the title, tags or description from this page.",
    listingsScanned: "listings scanned", toReview: "to review", titleChecks: "title checks", tagChecks: "tag checks", catalogChecks: "catalog checks",
    downloadReport: "Download audit CSV", researchKeywords: "Research real keywords with eRank ↗",
    noSearchData: "This checker does not have Etsy search-volume or ranking data. eRank is a separate service;",
    listingsToReview: "Listings to review", searchListings: "Search listing titles or tags", filterReport: "Filter report",
    allListings: "All listings", needsReview: "Needs review", catalogFilter: "Catalog checks and shop-wide patterns", csvRow: "CSV row",
    untitled: "Untitled listing", noChecks: "No checks", noTriggeredChecks: "No checks were triggered by the rules in this audit.",
    makePrompt: "Make a review prompt", promptText: "Prompt text", listingTextOnPage: "The listing text stays on this page until you choose to copy it.",
    copyPrompt: "Copy prompt again", aiPrivacy: "If you paste it into an AI assistant, that provider’s privacy terms apply. Check every suggestion before editing a live listing.",
    noMatches: "No listings match this filter.", showMore: "Show 50 more listings", repeatedShopTags: "Tags repeated across this shop",
    repeatedShopTagsNote: "Frequency is a prompt to inspect relevance. Reusing a tag is not automatically a problem.",
  },
  es: {
    stepOne: "Paso 1 · Tu archivo", openCsv: "Abre un CSV de anuncios de Etsy", noLogin: "Sin iniciar sesión",
    exportPrivacy: "Usa la exportación de anuncios activos de Etsy. El archivo se lee en este navegador y no se sube a nuestro servidor.",
    chooseFile: "Elige tu archivo CSV", csvLimit: "CSV de hasta 10 MB · solo anuncios activos", reading: "Leyendo archivo…", chooseCsv: "Elegir CSV",
    trySample: "Probar con un ejemplo", findExport: "Dónde encontrar la exportación en Etsy",
    exportStep1: "Gestor de la tienda → Configuración → Opciones", exportStep2: "Abre Descargar datos → Descargar CSV", exportStep3: "Elige ese archivo arriba",
    etsyInstructions: "Instrucciones de exportación de Etsy ↗", stepTwo: "Paso 2 · Revisa los datos", practicalReview: "Una revisión práctica de tu catálogo",
    clearReport: "Borrar informe", previewTitle: "Revisión de títulos", previewTitleText: "Detecta títulos muy largos, palabras repetidas, frases de regalo y lenguaje promocional para revisarlos.",
    previewTags: "Revisión de etiquetas", previewTagsText: "Encuentra espacios de etiquetas sin usar, etiquetas repetidas y etiquetas que superan el límite de 20 caracteres de Etsy.",
    previewDetails: "Datos del anuncio", previewDetailsText: "Revisa descripciones, precios, cantidades, divisas e imágenes vacías si esos campos aparecen en la exportación. Los materiales se muestran como recordatorio opcional.",
    previewShop: "Patrones de la tienda", previewShopText: "Detecta títulos duplicados, etiquetas repetidas y SKU reutilizados. Son avisos para revisar, no errores automáticos.",
    previewPrompt: "Instrucción para una IA", previewPromptText: "Prepara una instrucción para revisar un anuncio sin enviar desde esta página su título, etiquetas ni descripción.",
    listingsScanned: "anuncios revisados", toReview: "para revisar", titleChecks: "revisiones de título", tagChecks: "revisiones de etiquetas", catalogChecks: "revisiones del catálogo",
    downloadReport: "Descargar informe CSV", researchKeywords: "Investigar palabras clave con eRank ↗",
    noSearchData: "Este comprobador no dispone de datos de búsquedas ni posiciones de Etsy. eRank es un servicio independiente;",
    listingsToReview: "Anuncios para revisar", searchListings: "Buscar títulos o etiquetas", filterReport: "Filtrar informe",
    allListings: "Todos los anuncios", needsReview: "Necesitan revisión", catalogFilter: "Catálogo y patrones de la tienda", csvRow: "Fila CSV",
    untitled: "Anuncio sin título", noChecks: "Sin avisos", noTriggeredChecks: "Estas reglas no han encontrado avisos para este anuncio.",
    makePrompt: "Preparar instrucción de revisión", promptText: "Texto de la instrucción", listingTextOnPage: "El texto del anuncio permanece en esta página hasta que decidas copiarlo.",
    copyPrompt: "Volver a copiar", aiPrivacy: "Si la pegas en una IA, se aplican las condiciones de privacidad de ese proveedor. Revisa todas las sugerencias antes de editar un anuncio publicado.",
    noMatches: "Ningún anuncio coincide con este filtro.", showMore: "Mostrar 50 anuncios más", repeatedShopTags: "Etiquetas repetidas en la tienda",
    repeatedShopTagsNote: "La frecuencia sirve para revisar si una etiqueta es relevante. Reutilizarla no es necesariamente un problema.",
  },
} as const;

const EtsyCsvAuditor = ({ locale = "en" }: { locale?: Locale }) => {
  const copy = uiText[locale];
  const erankDisclosure = locale === "es"
    ? ERANK_IS_AFFILIATE
      ? "Este es un enlace de afiliado. Podemos recibir una comisión si te suscribes, sin coste adicional para ti."
      : "Es un enlace normal; actualmente no recibimos comisión por él."
    : ERANK_DISCLOSURE;
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
        throw new Error(locale === "es"
          ? "El archivo supera los 10 MB. Exporta solo los anuncios activos e inténtalo de nuevo."
          : "This file is over 10 MB. Export only active listings and try again.");
      }

      const parsed = parseListings(await file.text(), locale);
      setListings(parsed);
      setFilter("all");
      setSearch("");
      setVisibleCount(50);
    } catch (caught) {
      setListings([]);
      setError(caught instanceof Error
        ? caught.message
        : locale === "es"
          ? "No se pudo leer el CSV. Comprueba el archivo e inténtalo de nuevo."
          : "The CSV could not be read. Check the file and try again.");
    } finally {
      setIsReading(false);
    }
  };

  const loadSample = () => {
    const sampleCsv = locale === "es"
      ? [
          "TÍTULO,DESCRIPCIÓN,PRECIO,CÓDIGO DE DIVISA,CANTIDAD,ETIQUETAS,MATERIALES,URL DE LAS IMÁGENES,SKU",
          '"Collar de luna precioso, regalo perfecto para ella, collar de plata, en oferta","Ejemplo de anuncio. Collar artesanal de plata con colgante de luna creciente.",24.00,EUR,3,"collar de luna|collar luna plata|regalo para ella|regalo para ella|joyería artesanal","Plata de ley","https://example.com/luna.jpg",LUNA-001',
          '"Collar de luna creciente de plata","","",EUR,2,"luna creciente|collar de plata|colgante luna|joyería celestial|plata de ley|collar delicado|joyería lunar|colgante plata|minimalista|collar lunar|joyería artesanal|cadena de plata|regalo para ella","Plata de ley",,LUNA-001',
        ].join("\r\n")
      : [
          "TITLE,DESCRIPTION,PRICE,CURRENCY,QUANTITY,TAGS,MATERIALS,IMAGE_URLS,SKU",
          '"Beautiful Moon Necklace, Perfect Gift for Her, Silver Moon Necklace, On Sale","Example listing only. A handmade silver necklace with a crescent moon pendant.",24.00,USD,3,"moon necklace|silver moon necklace|gift for her|gift for her|handmade jewelry","Sterling silver","https://example.com/moon.jpg",MOON-001',
          '"Sterling Silver Crescent Moon Necklace","","",USD,2,"crescent moon|silver necklace|moon pendant|celestial jewelry|sterling silver|dainty necklace|moon jewelry|silver pendant|minimal necklace|lunar necklace|handmade jewelry|chain necklace|gift for her","Sterling silver",,MOON-001',
        ].join("\r\n");
    const sample = parseListings(sampleCsv, locale);
    setListings(sample);
    setError("");
    setFilter("all");
    setSearch("");
    setVisibleCount(50);
    setActivePrompt(null);
    setManualPrompt("");
    setCopyStatus("");
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
    const header = locale === "es"
      ? ["Fila CSV", "Título del anuncio", "Avisos para revisar", "Etiquetas actuales"]
      : ["CSV row", "Listing title", "Checks to review", "Current tags"];
    const rows = listings.map((listing) => [
      String(listing.rowNumber),
      listing.title,
      listing.issues.map((issue) => issue.message).join(" | ") || (locale === "es" ? "Sin avisos" : "No checks triggered"),
      listing.tags.join(" | "),
    ]);
    const csv = [header, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${locale === "es" ? "revision-anuncios-etsy" : "etsy-listing-audit"}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const showPrompt = async (listing: ListingAudit) => {
    const nextPrompt = buildReviewPrompt(listing, locale);
    setActivePrompt(listing.id);
    setManualPrompt(nextPrompt);
    setCopyStatus("");
    try {
      await navigator.clipboard.writeText(nextPrompt);
      setCopyStatus(locale === "es"
        ? "Instrucción copiada. Revísala antes de pegarla en una IA."
        : "Prompt copied. Review it before pasting it into an AI assistant.");
    } catch {
      setCopyStatus(locale === "es" ? "Selecciona el texto y cópialo manualmente." : "Select the prompt below and copy it manually.");
    }
  };

  const copyManualPrompt = async () => {
    if (!manualPrompt) return;
    try {
      await navigator.clipboard.writeText(manualPrompt);
      setCopyStatus(locale === "es"
        ? "Instrucción copiada. Revísala antes de pegarla en una IA."
        : "Prompt copied. Review it before pasting it into an AI assistant.");
    } catch {
      setCopyStatus(locale === "es"
        ? "No se puede acceder al portapapeles. Selecciona el texto y cópialo manualmente."
        : "Clipboard access is blocked. Select the text and copy it manually.");
    }
  };

  const filteredCount = filteredListings.length;

  return (
    <section id="auditor" className="scroll-mt-8">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_60px_-42px_rgba(31,41,35,0.34)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{copy.stepOne}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">{copy.openCsv}</h2>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">{copy.noLogin}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            {copy.exportPrivacy}
          </p>

          <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
            <p className="mt-4 font-semibold text-stone-900">{copy.chooseFile}</p>
            <p className="mt-1 text-xs text-stone-500">{copy.csvLimit}</p>
            <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
              {isReading ? copy.reading : copy.chooseCsv}
              <input
                type="file"
                accept=".csv,text/csv"
                disabled={isReading}
                onChange={onFileSelected}
                className="sr-only"
                aria-label={copy.chooseFile}
              />
            </label>
            <div className="mt-4">
              <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
                {copy.trySample}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">
              {error}
            </p>
          )}

          <div className="mt-5 border-t border-stone-100 pt-5">
            <p className="text-sm font-semibold text-stone-900">{copy.findExport}</p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
              <li><span className="font-semibold text-stone-800">1.</span> {copy.exportStep1}</li>
              <li><span className="font-semibold text-stone-800">2.</span> {copy.exportStep2}</li>
              <li><span className="font-semibold text-stone-800">3.</span> {copy.exportStep3}</li>
            </ol>
            <a href={locale === "es" ? "https://help.etsy.com/hc/es/articles/360000343508-C%C3%B3mo-descargar-la-informaci%C3%B3n-de-tus-anuncios" : "https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information"} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
              {copy.etsyInstructions}
            </a>
            {locale === "en" && <a href="/etsy-listing-csv-guide" className="mt-2 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
              Step-by-step CSV guide →
            </a>}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-stone-200 bg-[#f0efe7] p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{copy.stepTwo}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">{copy.practicalReview}</h2>
            </div>
            {listings.length > 0 && (
              <button type="button" onClick={resetAudit} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-stone-500">
                {copy.clearReport}
              </button>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <PreviewCard number="01" title={copy.previewTitle} text={copy.previewTitleText} />
              <PreviewCard number="02" title={copy.previewTags} text={copy.previewTagsText} />
              <PreviewCard number="03" title={copy.previewDetails} text={copy.previewDetailsText} />
              <PreviewCard number="04" title={copy.previewShop} text={copy.previewShopText} />
              <PreviewCard number="05" title={copy.previewPrompt} text={copy.previewPromptText} />
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Metric value={String(listings.length)} label={copy.listingsScanned} />
                <Metric value={String(issueTotals.listings)} label={copy.toReview} />
                <Metric value={String(issueTotals.title)} label={copy.titleChecks} />
                <Metric value={String(issueTotals.tags)} label={copy.tagChecks} />
                <Metric value={String(issueTotals.catalog)} label={copy.catalogChecks} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={downloadReport} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">
                  {copy.downloadReport}
                </button>
                <a href={ERANK_HREF} target="_blank" rel={ERANK_REL} className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-emerald-700">
                  {copy.researchKeywords}
                </a>
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-600">
                {copy.noSearchData} {erankDisclosure}
              </p>

              <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-stone-950">{copy.listingsToReview}</p>
                  <span className="text-xs text-stone-500">{locale === "es" ? "Mostrando" : "Showing"} {Math.min(visibleCount, filteredCount)} {locale === "es" ? "de" : "of"} {filteredCount}</span>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <label className="sr-only" htmlFor="audit-search">{copy.searchListings}</label>
                  <input id="audit-search" value={search} onChange={(event) => { setSearch(event.target.value); setVisibleCount(50); }} placeholder={copy.searchListings} className="min-w-0 flex-1 rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" />
                  <label className="sr-only" htmlFor="audit-filter">{copy.filterReport}</label>
                  <select id="audit-filter" value={filter} onChange={(event) => { setFilter(event.target.value as Filter); setVisibleCount(50); }} className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100">
                    <option value="all">{copy.allListings}</option>
                    <option value="needs-review">{copy.needsReview}</option>
                    <option value="title">{copy.titleChecks}</option>
                    <option value="tags">{copy.tagChecks}</option>
                    <option value="catalog">{copy.catalogFilter}</option>
                  </select>
                </div>

                <div className="mt-4 space-y-3">
                  {filteredListings.slice(0, visibleCount).map((listing) => (
                    <article key={listing.id} className="rounded-xl border border-stone-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{copy.csvRow} {listing.rowNumber}</p>
                          <h3 className="mt-1 break-words text-sm font-semibold leading-6 text-stone-900">{listing.title || copy.untitled}</h3>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${listing.issues.length > 0 ? "bg-amber-100 text-amber-950" : "bg-emerald-100 text-emerald-950"}`}>
                          {listing.issues.length > 0
                            ? `${listing.issues.length} ${locale === "es" ? listing.issues.length === 1 ? "aviso" : "avisos" : listing.issues.length === 1 ? "check" : "checks"}`
                            : copy.noChecks}
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
                        <p className="mt-2 text-sm text-stone-600">{copy.noTriggeredChecks}</p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button type="button" onClick={() => void showPrompt(listing)} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">
                          {copy.makePrompt}
                        </button>
                        {listing.tags.length > 0 && <span className="text-xs text-stone-500">{listing.tags.length} {locale === "es" ? "etiquetas en este archivo" : "tags in this file"}</span>}
                      </div>
                      {activePrompt === listing.id && (
                        <div className="mt-4 rounded-xl bg-[#f7f6f0] p-3 sm:p-4">
                          <label htmlFor={`prompt-${listing.id}`} className="text-xs font-semibold uppercase tracking-wide text-stone-600">{copy.promptText}</label>
                          <textarea id={`prompt-${listing.id}`} value={manualPrompt} readOnly onFocus={(event) => event.currentTarget.select()} rows={9} className="mt-2 w-full rounded-lg border border-stone-300 bg-white p-3 font-mono text-xs leading-5 text-stone-800 outline-none focus:border-emerald-700" />
                          <p role="status" className="mt-2 text-xs leading-5 text-stone-600">{copyStatus} {copy.listingTextOnPage}</p>
                          <button type="button" onClick={() => void copyManualPrompt()} className="mt-3 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-700">{copy.copyPrompt}</button>
                          <p className="mt-2 text-xs leading-5 text-stone-500">{copy.aiPrivacy}</p>
                        </div>
                      )}
                    </article>
                  ))}
                  {filteredCount === 0 && <p className="rounded-xl bg-stone-50 px-4 py-5 text-sm text-stone-600">{copy.noMatches}</p>}
                  {filteredCount > visibleCount && (
                    <button type="button" onClick={() => setVisibleCount((count) => count + 50)} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 hover:border-emerald-700">
                      {copy.showMore}
                    </button>
                  )}
                </div>
              </div>

              {repeatedTags.length > 0 && (
                <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5">
                  <h3 className="font-semibold text-stone-950">{copy.repeatedShopTags}</h3>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{copy.repeatedShopTagsNote}</p>
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

function parseListings(csvText: string, locale: Locale): ListingAudit[] {
  const isSpanish = locale === "es";
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) throw new Error(isSpanish
    ? "El archivo está vacío. Elige un CSV de anuncios activos exportado desde Etsy."
    : "The file is empty. Choose an Etsy active-listings CSV export.");
  const delimiter = detectDelimiter(cleanText);
  const rows = parseCsv(cleanText, delimiter, locale).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error(isSpanish
    ? "El CSV tiene encabezados, pero no contiene filas de anuncios."
    : "The CSV has a header but no listing rows.");

  const headings = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headings, ["title", "listingtitle", "itemtitle", "titulo"]);
  const tagsIndex = findColumn(headings, ["tags", "tag", "listingtags", "keywords", "etiquetas"]);
  const descriptionIndex = findColumn(headings, ["description", "listingdescription", "descripcion"]);
  const materialsIndex = findColumn(headings, ["materials", "material", "materiales"]);
  const priceIndex = findColumn(headings, ["price", "listingprice", "itemprice", "precio"]);
  const currencyIndex = findColumn(headings, ["currency", "currencycode", "listingcurrency", "currencytype", "moneda", "divisa", "codigodedivisa"]);
  const quantityIndex = findColumn(headings, ["quantity", "qty", "listingquantity", "cantidad"]);
  const imageUrlIndices = headings
    .map((header, index) => ({ header, index }))
    .filter(({ header }) =>
      ["imageurls", "imageurl", "images", "listingimages", "urlimagenes", "urlimagen", "urldelasimagenes", "imagenes"].includes(header) ||
      /^image\d+$/.test(header) ||
      /^imagen\d+$/.test(header),
    )
    .map(({ index }) => index);
  const skuIndex = findColumn(headings, ["sku", "skunumber", "listingsku", "productsku", "referencia", "numerossku"]);

  if (titleIndex < 0 || tagsIndex < 0) {
    throw new Error(isSpanish
      ? "No se encontraron las columnas de título y etiquetas. Usa la exportación de anuncios activos de Etsy con esos campos."
      : "I couldn’t find both title and tags columns. Use Etsy’s active-listings export with Title and Tags columns.");
  }

  const listingRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (listingRows.length > MAX_LISTINGS) {
    const limit = MAX_LISTINGS.toLocaleString(isSpanish ? "es-ES" : "en-US");
    throw new Error(isSpanish
      ? `El archivo tiene más de ${limit} filas de anuncios. Exporta un grupo más pequeño e inténtalo de nuevo.`
      : `This file has more than ${limit} listing rows. Export a smaller group and try again.`);
  }

  const normalizedRows = listingRows.map((row, index) => ({
    rowNumber: index + 2,
    title: row[titleIndex]?.trim() ?? "",
    description: descriptionIndex >= 0 ? row[descriptionIndex]?.trim() ?? "" : "",
    materials: materialsIndex >= 0 ? row[materialsIndex]?.trim() ?? "" : "",
    price: priceIndex >= 0 ? row[priceIndex]?.trim() ?? "" : "",
    currency: currencyIndex >= 0 ? row[currencyIndex]?.trim() ?? "" : "",
    quantity: quantityIndex >= 0 ? row[quantityIndex]?.trim() ?? "" : "",
    imageUrls: imageUrlIndices.map((index) => row[index]?.trim() ?? "").filter(Boolean).join(" | "),
    sku: skuIndex >= 0 ? row[skuIndex]?.trim() ?? "" : "",
    tags: parseTags(row[tagsIndex] ?? ""),
  }));

  return auditRows(normalizedRows, {
    description: descriptionIndex >= 0,
    materials: materialsIndex >= 0,
    price: priceIndex >= 0,
    currency: currencyIndex >= 0,
    quantity: quantityIndex >= 0,
    imageUrls: imageUrlIndices.length > 0,
    sku: skuIndex >= 0,
  }, locale);
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

function parseCsv(text: string, delimiter: string, locale: Locale): string[][] {
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

  if (inQuotes) throw new Error(locale === "es"
    ? "El CSV contiene un campo entre comillas sin cerrar. Vuelve a descargarlo desde Etsy e inténtalo de nuevo."
    : "The CSV contains an unclosed quoted field. Re-download it from Etsy and try again.");
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function auditRows(
  sourceRows: Array<{
    rowNumber: number;
    title: string;
    description: string;
    materials: string;
    price: string;
    currency: string;
    quantity: string;
    imageUrls: string;
    sku: string;
    tags: string[];
  }>,
  availableColumns: AvailableColumns,
  locale: Locale,
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
    listing.issues.push(
      ...checkTitle(source.title, locale),
      ...checkTags(source.tags, locale),
      ...checkListingDetails(source, availableColumns, locale),
    );
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
        message: locale === "es"
          ? `Este título exacto también aparece en la${matches.length > 2 ? "s" : ""} fila${matches.length > 2 ? "s" : ""} ${rows} del CSV. Comprueba si cada anuncio es distinto.`
          : `This exact title also appears on CSV row${matches.length > 2 ? "s" : ""} ${rows}. Check whether each listing is distinct.`,
      });
    }
  }

  if (availableColumns.sku) {
    const skuListings = new Map<string, number[]>();
    sourceRows.forEach((source, index) => {
      const normalized = normalizeText(source.sku);
      if (!normalized) return;
      skuListings.set(normalized, [...(skuListings.get(normalized) ?? []), index]);
    });

    for (const matches of skuListings.values()) {
      if (matches.length < 2) continue;
      for (const listingIndex of matches) {
        const otherRows = matches
          .filter((index) => index !== listingIndex)
          .map((index) => sourceRows[index].rowNumber)
          .join(", ");
        audits[listingIndex].issues.push({
          kind: "catalog",
          level: "check",
          message: locale === "es"
            ? `Este SKU también aparece en la${matches.length > 2 ? "s" : ""} fila${matches.length > 2 ? "s" : ""} ${otherRows} del CSV. Confirma que deban compartirlo.`
            : `This SKU also appears on CSV row${matches.length > 2 ? "s" : ""} ${otherRows}. Confirm the listings are meant to share it.`,
        });
      }
    }
  }

  const tagListings = new Map<string, { tag: string; listings: ListingAudit[] }>();
  for (const listing of audits) {
    const uniqueTags = new Map<string, string>();
    for (const tag of listing.tags) {
      const normalized = normalizeText(tag);
      if (normalized && !uniqueTags.has(normalized)) uniqueTags.set(normalized, tag.trim());
    }
    for (const [normalized, tag] of uniqueTags) {
      const entry = tagListings.get(normalized) ?? { tag, listings: [] };
      entry.listings.push(listing);
      tagListings.set(normalized, entry);
    }
  }

  const reusedTagSummaries = new Map<string, { count: number; examples: string[] }>();
  for (const entry of tagListings.values()) {
    if (entry.listings.length < 2) continue;
    const sampleRows = entry.listings.slice(0, 5).map((match) => match.rowNumber);
    const otherListingCount = entry.listings.length - 1;
    for (const listing of entry.listings) {
      const summary = reusedTagSummaries.get(listing.id) ?? { count: 0, examples: [] };
        summary.count += 1;
        if (summary.examples.length < 4) {
          const rowNumbers = sampleRows.filter((rowNumber) => rowNumber !== listing.rowNumber).slice(0, 4);
          const remainingRows = otherListingCount - rowNumbers.length;
          const extraRows = remainingRows > 0
            ? locale === "es" ? " y " + remainingRows + " más" : " and " + remainingRows + " more"
            : "";
          summary.examples.push(locale === "es"
            ? "«" + entry.tag + "» (también en las filas " + rowNumbers.join(", ") + extraRows + ")"
            : "“" + entry.tag + "” (also rows " + rowNumbers.join(", ") + extraRows + ")");
      }
      reusedTagSummaries.set(listing.id, summary);
    }
  }

  for (const listing of audits) {
    const summary = reusedTagSummaries.get(listing.id);
    if (!summary) continue;
    const remainingTagCount = summary.count - summary.examples.length;
    const remainingTags = remainingTagCount > 0
      ? locale === "es"
        ? "; y " + remainingTagCount + " etiqueta" + (remainingTagCount === 1 ? " reutilizada más" : "s reutilizadas más")
        : "; plus " + remainingTagCount + " other reused tag" + (remainingTagCount === 1 ? "" : "s")
      : "";
    listing.issues.push({
      kind: "catalog",
      level: "check",
      message: locale === "es"
        ? "Etiquetas reutilizadas en la exportación: " + summary.examples.join("; ") + remainingTags + ". Reutilizarlas no es necesariamente un error; confirma que cada etiqueta encaja con el artículo."
        : "Tag reuse across your export: " + summary.examples.join("; ") + remainingTags + ". Reuse is not automatically wrong; confirm each tag fits every item.",
    });
  }

  return audits;
}

function checkTitle(title: string, locale: Locale): AuditIssue[] {
  const isSpanish = locale === "es";
  const issues: AuditIssue[] = [];
  if (!title.trim()) {
    return [{ kind: "title", level: "fix", message: isSpanish ? "No se encontró un título en esta fila." : "No title was found in this row." }];
  }

  const characterCount = Array.from(title).length;
  if (characterCount > 140) {
    issues.push({ kind: "title", level: "fix", message: isSpanish
      ? `El título tiene ${characterCount} caracteres. El campo de Etsy admite 140 como máximo.`
      : `The title is ${characterCount} characters. Etsy’s title field supports up to 140.` });
  }

  const words = title.match(/[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:['’-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*/g) ?? [];
  if (words.length >= 15) {
    issues.push({ kind: "title", level: "check", message: isSpanish
      ? `El título tiene ${words.length} palabras. Etsy sugiere valorar menos de 15 para facilitar la lectura.`
      : `The title has ${words.length} words. Etsy suggests considering fewer than 15 for easier scanning.` });
  }

  const repeatedWords = new Set<string>();
  const seenWords = new Set<string>();
  for (const word of words.map(normalizeText)) {
    if (stopWords.has(word)) continue;
    if (seenWords.has(word)) repeatedWords.add(word);
    seenWords.add(word);
  }
  if (repeatedWords.size > 0) {
    issues.push({ kind: "title", level: "check", message: isSpanish
      ? `Palabra${repeatedWords.size > 1 ? "s" : ""} repetida${repeatedWords.size > 1 ? "s" : ""}: ${[...repeatedWords].join(", ")}. Comprueba si cada repetición ayuda a entender el artículo.`
      : `Repeated word${repeatedWords.size > 1 ? "s" : ""}: ${[...repeatedWords].join(", ")}. Check whether each repetition helps a buyer understand the item.` });
  }

  const normalizedTitle = normalizeText(title);
  const subjective = subjectivePhrases.filter((phrase) => phrasePattern(phrase).test(normalizedTitle));
  if (subjective.length > 0) {
    issues.push({ kind: "title", level: "check", message: isSpanish
      ? `Adjetivos subjetivos para revisar: ${subjective.join(", ")}. Etsy sugiere quitar este tipo de descripciones del título.`
      : `Subjective wording to review: ${subjective.join(", ")}. Etsy suggests moving these descriptions out of the title.` });
  }

  const promotional = promotionalPhrases.filter((phrase) => normalizedTitle.includes(normalizeText(phrase)));
  if (promotional.length > 0) {
    issues.push({ kind: "title", level: "check", message: isSpanish
      ? `Texto promocional o de envío para revisar: ${promotional.join(", ")}. Etsy indica que esta información no debe ir en el título.`
      : `Sales or shipping wording to review: ${promotional.join(", ")}. Etsy says this information does not belong in the title.` });
  }

  const gifting = giftingPhrases.filter((phrase) => normalizedTitle.includes(normalizeText(phrase)));
  if (gifting.length > 0) {
    issues.push({ kind: "title", level: "check", message: isSpanish
      ? `Frase de regalo para revisar: ${gifting.join(", ")}. Incluye destinatarios u ocasiones solo cuando sean esenciales para el artículo.`
      : `Gifting phrase to review: ${gifting.join(", ")}. Keep a recipient or occasion only when it is essential to the item.` });
  }

  return issues;
}

function checkTags(tags: string[], locale: Locale): AuditIssue[] {
  const isSpanish = locale === "es";
  const issues: AuditIssue[] = [];
  if (tags.length < 13) {
    issues.push({ kind: "tags", level: "check", message: isSpanish
      ? `Solo se encontraron ${tags.length} etiquetas no vacías. Etsy recomienda usar las 13 etiquetas relevantes.`
      : `Only ${tags.length} non-empty tags were found. Etsy recommends using all 13 relevant tag slots.` });
  }
  if (tags.length > 13) {
    issues.push({ kind: "tags", level: "fix", message: isSpanish
      ? `Se encontraron ${tags.length} etiquetas. Etsy permite hasta 13 por anuncio.`
      : `${tags.length} tags were found. Etsy allows up to 13 tags per listing.` });
  }

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const tag of tags) {
    const normalized = normalizeText(tag);
    if (!normalized) continue;
    if (seen.has(normalized)) duplicates.add(tag.trim());
    seen.add(normalized);
    if (tag.trim().length > 20) {
      issues.push({ kind: "tags", level: "fix", message: isSpanish
        ? `«${tag.trim()}» tiene ${tag.trim().length} caracteres; Etsy permite hasta 20 por etiqueta.`
        : `“${tag.trim()}” has ${tag.trim().length} characters; Etsy allows up to 20 per tag.` });
    }
    if (!validTagPattern.test(tag.trim()) || /^['-]/.test(tag.trim())) {
      issues.push({ kind: "tags", level: "check", message: isSpanish
        ? `«${tag.trim()}» contiene caracteres que Etsy quizá no acepte. Compruébala en Etsy antes de publicar.`
        : `“${tag.trim()}” uses characters Etsy may not accept. Check the tag in Etsy before publishing.` });
    }
  }
  if (duplicates.size > 0) {
    issues.push({ kind: "tags", level: "check", message: isSpanish
      ? `Etiqueta${duplicates.size > 1 ? "s" : ""} repetida${duplicates.size > 1 ? "s" : ""} en este anuncio: ${[...duplicates].join(", ")}.`
      : `Repeated tag${duplicates.size > 1 ? "s" : ""} in this listing: ${[...duplicates].join(", ")}.` });
  }
  return issues;
}

function checkListingDetails(
  listing: { description: string; materials: string; price: string; currency: string; quantity: string; imageUrls: string },
  availableColumns: AvailableColumns,
  locale: Locale,
): AuditIssue[] {
  const isSpanish = locale === "es";
  const issues: AuditIssue[] = [];
  const checks: Array<{ available: boolean; value: string; message: string }> = [
    {
      available: availableColumns.description,
      value: listing.description,
      message: isSpanish ? "No hay descripción en esta fila del CSV. Revisa el anuncio publicado y añade detalles útiles para quien compra si hace falta." : "No description text appears in this CSV row. Review the live listing and add buyer-relevant details if needed.",
    },
    {
      available: availableColumns.price,
      value: listing.price,
      message: isSpanish ? "No aparece un precio en esta fila del CSV. Confirma el precio del anuncio activo en Etsy." : "No price value appears in this CSV row. Confirm the active listing price in Etsy.",
    },
    {
      available: availableColumns.currency,
      value: listing.currency,
      message: isSpanish ? "No aparece el código de divisa en esta fila del CSV. Comprueba la divisa del anuncio en Etsy." : "No currency code appears in this CSV row. Check the listing currency in Etsy.",
    },
    {
      available: availableColumns.quantity,
      value: listing.quantity,
      message: isSpanish ? "No aparece una cantidad en esta fila del CSV. Comprueba el anuncio activo en Etsy." : "No quantity value appears in this CSV row. Check the active listing in Etsy.",
    },
    {
      available: availableColumns.imageUrls,
      value: listing.imageUrls,
      message: isSpanish ? "No aparece una URL de imagen en esta fila del CSV. Confirma que el anuncio tenga fotos en Etsy." : "No image URL appears in this CSV row. Confirm that the listing has photos in Etsy.",
    },
    {
      available: availableColumns.materials,
      value: listing.materials,
      message: isSpanish ? "No se indican materiales en esta fila del CSV. Añádelos si ayudan a describir el artículo." : "No materials are listed in this CSV row. Add them when they help describe the item.",
    },
  ];

  for (const check of checks) {
    if (check.available && !check.value.trim()) {
      issues.push({ kind: "catalog", level: "check", message: check.message });
    }
  }

  return issues;
}

function buildReviewPrompt(listing: ListingAudit, locale: Locale): string {
  if (locale === "es") {
    return [
      "Ayúdame a revisar un anuncio de Etsy. Usa solo los datos que te doy; no inventes materiales, tamaños, opciones de personalización, métodos de producción, afirmaciones ni volúmenes de búsqueda.",
      "",
      "Sigue las recomendaciones vigentes de Etsy para títulos: identifica el artículo con claridad una sola vez, coloca primero sus características objetivas importantes, usa un texto fácil de leer, evita repeticiones innecesarias y expresiones subjetivas o promocionales, y valora usar menos de 15 palabras. Limita cualquier título propuesto a 140 caracteres.",
      "Devuelve: (1) una sugerencia de título clara, (2) exactamente 13 ideas distintas de etiquetas de Etsy, cada una de 20 caracteres como máximo, (3) una introducción breve y atractiva para la descripción, y (4) una lista de datos que debo confirmar. No afirmes que una frase tiene volumen de búsqueda ni que mejorará la posición. Conserva el idioma del anuncio.",
      "",
      `Título actual: ${listing.title || "[ninguno]"}`,
      `Descripción: ${listing.description || "[ninguna]"}`,
      `Materiales: ${listing.materials || "[ninguno]"}`,
      `Etiquetas actuales: ${listing.tags.join(" | ") || "[ninguna]"}`,
    ].join("\n");
  }

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
  return value
    .replace(/^\uFEFF/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
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
