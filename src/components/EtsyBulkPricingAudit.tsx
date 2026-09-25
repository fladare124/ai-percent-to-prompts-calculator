"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type Listing = {
  key: string;
  rowNumber: number;
  title: string;
  sku: string;
  skuKey: string;
  price: number;
  currency: string;
  quantity: number | null;
};
type Locale = "en" | "es";

type FeeSettings = {
  transactionRate: number;
  processingRate: number;
  processingFixed: number;
  listingAllowance: number;
  regulatoryRate: number;
  offsiteRate: number;
  feeTaxRate: number;
  shippingCharged: number;
  postageCost: number;
  targetMargin: number;
};

type AuditedListing = Listing & {
  unitCost: number;
  usTariffEstimate: number;
  tariffEstimateKnown: boolean;
  pricingInputsKnown: boolean;
  orderRevenue: number;
  estimatedFees: number | null;
  estimatedProfit: number | null;
  estimatedMargin: number | null;
  targetPrice: number | null;
  priceGap: number | null;
  costKnown: boolean;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_LISTINGS = 25_000;

const defaultSettings: FeeSettings = {
  transactionRate: 6.5,
  processingRate: 3,
  processingFixed: 0.25,
  listingAllowance: 0.2,
  regulatoryRate: 0,
  offsiteRate: 0,
  feeTaxRate: 0,
  shippingCharged: 0,
  postageCost: 0,
  targetMargin: 20,
};

export default function EtsyBulkPricingAudit({ locale = "en" }: { locale?: Locale }) {
  const t = (english: string, spanish: string) => translate(locale, english, spanish);
  const numberLocale = locale === "es" ? "es-ES" : "en-US";
  const csvNumber = (value: number, digits = 2) => {
    const formatted = value.toFixed(digits);
    return locale === "es" ? formatted.replace(".", ",") : formatted;
  };
  const [listings, setListings] = useState<Listing[]>([]);
  const [unitCosts, setUnitCosts] = useState<Record<string, number>>({});
  const [knownCosts, setKnownCosts] = useState<Set<string>>(new Set());
  const [settings, setSettings] = useState<FeeSettings>(defaultSettings);
  const [currency, setCurrency] = useState("USD");
  const [hasCurrencyColumn, setHasCurrencyColumn] = useState(true);
  const [error, setError] = useState("");
  const [costImportNote, setCostImportNote] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "below-target" | "missing-cost" | "missing-tariff">("all");
  const [visibleCount, setVisibleCount] = useState(50);
  const [usTariffEstimates, setUsTariffEstimates] = useState<Record<string, number>>({});
  const [knownTariffEstimates, setKnownTariffEstimates] = useState<Set<string>>(new Set());
  const [inputRevision, setInputRevision] = useState(0);

  const audited = useMemo(() => {
    const feeRate = (settings.transactionRate + settings.processingRate + settings.regulatoryRate + settings.offsiteRate) / 100;
    const feeTaxRate = settings.feeTaxRate / 100;
    const fixedFees = (settings.processingFixed + settings.listingAllowance) * (1 + feeTaxRate);
    const targetMargin = settings.targetMargin / 100;
    const denominator = 1 - feeRate * (1 + feeTaxRate) - targetMargin;

    return listings.map((listing): AuditedListing => {
      const unitCost = unitCosts[listing.key] ?? 0;
      const usTariffEstimate = usTariffEstimates[listing.key] ?? 0;
      const orderRevenue = listing.price + settings.shippingCharged;
      const costKnown = knownCosts.has(listing.key);
      const tariffEstimateKnown = knownTariffEstimates.has(listing.key);
      const pricingInputsKnown = costKnown && tariffEstimateKnown;
      const estimatedFees = roundMoney(orderRevenue * feeRate * (1 + feeTaxRate) + fixedFees);
      const totalCosts = unitCost + settings.postageCost + usTariffEstimate;
      const estimatedProfit = pricingInputsKnown
        ? roundMoney(orderRevenue - estimatedFees - totalCosts)
        : null;
      const estimatedMargin = estimatedProfit !== null && orderRevenue > 0 ? estimatedProfit / orderRevenue : null;
      const targetRevenue = pricingInputsKnown && denominator > 0
        ? (totalCosts + fixedFees) / denominator
        : null;
      const targetPrice = targetRevenue === null
        ? null
        : Math.max(0, Math.ceil((targetRevenue - settings.shippingCharged) * 100 - 1e-8) / 100);
      return {
        ...listing,
        unitCost,
        usTariffEstimate,
        tariffEstimateKnown,
        pricingInputsKnown,
        orderRevenue,
        estimatedFees,
        estimatedProfit,
        estimatedMargin,
        targetPrice,
        priceGap: targetPrice === null ? null : roundMoney(targetPrice - listing.price),
        costKnown,
      };
    }).sort((a, b) => {
      const aMargin = a.estimatedMargin ?? Number.POSITIVE_INFINITY;
      const bMargin = b.estimatedMargin ?? Number.POSITIVE_INFINITY;
      return aMargin - bMargin || a.title.localeCompare(b.title);
    });
  }, [knownCosts, knownTariffEstimates, listings, settings, unitCosts, usTariffEstimates]);

  const filteredRows = useMemo(() => {
    const query = normalizeText(search);
    return audited.filter((item) => {
      const matchesSearch = !query || normalizeText(item.title).includes(query) || normalizeText(item.sku).includes(query);
      const matchesFilter = filter === "all"
        || filter === "missing-tariff"
        || (filter === "below-target" && item.pricingInputsKnown && (item.estimatedMargin === null || item.estimatedMargin < settings.targetMargin / 100))
        || (filter === "missing-cost" && !item.costKnown);
      const matchesTariffFilter = filter !== "missing-tariff" || !item.tariffEstimateKnown;
      return matchesSearch && matchesFilter && matchesTariffFilter;
    });
  }, [audited, filter, search, settings.targetMargin]);

  const summary = useMemo(() => ({
    belowTarget: audited.filter((item) => item.pricingInputsKnown && (item.estimatedMargin === null || item.estimatedMargin < settings.targetMargin / 100)).length,
    missingCosts: audited.filter((item) => !item.costKnown).length,
    missingTariffs: audited.filter((item) => !item.tariffEstimateKnown).length,
  }), [audited, settings.targetMargin]);

  const onListingsSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    setCostImportNote("");
    setIsReading(true);
    try {
      if (file.size > MAX_FILE_BYTES) throw new Error(t("This file is over 10 MB. Export a smaller set of active listings and try again.", "El archivo supera los 10 MB. Exporta menos anuncios activos e inténtalo de nuevo."));
      const parsed = parseListings(await file.text(), locale);
      setListings(parsed.listings);
      setCurrency(parsed.currency);
      setHasCurrencyColumn(parsed.hasCurrencyColumn);
      setUnitCosts({});
      setKnownCosts(new Set());
      setUsTariffEstimates({});
      setKnownTariffEstimates(new Set());
      setInputRevision((revision) => revision + 1);
      setSearch("");
      setFilter("all");
      setVisibleCount(50);
    } catch (caught) {
      setListings([]);
      setUnitCosts({});
      setKnownCosts(new Set());
      setUsTariffEstimates({});
      setKnownTariffEstimates(new Set());
      setError(caught instanceof Error ? caught.message : t("The listing CSV could not be read.", "No se pudo leer el CSV de anuncios."));
    } finally {
      setIsReading(false);
    }
  };

  const onCostsSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    setCostImportNote("");
    setIsReading(true);
    try {
      if (file.size > MAX_FILE_BYTES) throw new Error(t("This file is over 10 MB. Choose a smaller cost file.", "El archivo supera los 10 MB. Elige un archivo de costes más pequeño."));
      const parsed = parseCosts(await file.text(), locale);
      const matchingCostListings = listings.filter((listing) => listing.skuKey && parsed.costs.has(listing.skuKey));
      const matchingTariffListings = listings.filter((listing) => listing.skuKey && parsed.usTariffEstimates.has(listing.skuKey));
      const unmatchedCosts = [...parsed.costs.keys()].filter((sku) => !listings.some((item) => item.skuKey === sku)).length;
      const unmatchedTariffs = [...parsed.usTariffEstimates.keys()].filter((sku) => !listings.some((item) => item.skuKey === sku)).length;
      setUnitCosts((current) => {
        const next = { ...current };
        for (const listing of matchingCostListings) {
          const value = parsed.costs.get(listing.skuKey);
          if (value === undefined) continue;
          next[listing.key] = value;
        }
        return next;
      });
      setKnownCosts((current) => {
        const next = new Set(current);
        for (const listing of matchingCostListings) {
          if (listing.skuKey && parsed.costs.has(listing.skuKey)) next.add(listing.key);
        }
        return next;
      });
      setUsTariffEstimates((current) => {
        const next = { ...current };
        for (const listing of matchingTariffListings) {
          const value = parsed.usTariffEstimates.get(listing.skuKey);
          if (value === undefined) continue;
          next[listing.key] = value;
        }
        return next;
      });
      setKnownTariffEstimates((current) => {
        const next = new Set(current);
        for (const listing of matchingTariffListings) next.add(listing.key);
        return next;
      });
      setInputRevision((revision) => revision + 1);
      const duplicateNote = parsed.duplicateSkus ? " Duplicate SKU rows were found; the last value in the file was used." : "";
      const importNotes = [];
      if (matchingCostListings.length) importNotes.push(t("Loaded unit costs for ", "Costes unitarios cargados para ") + matchingCostListings.length.toLocaleString(numberLocale) + t(" listings.", " anuncios."));
      if (matchingTariffListings.length) importNotes.push(t("Loaded US tariff estimates for ", "Estimaciones de aranceles de EE. UU. cargadas para ") + matchingTariffListings.length.toLocaleString(numberLocale) + t(" listings.", " anuncios."));
      if (!matchingCostListings.length && parsed.costs.size) importNotes.push(t("No cost rows matched a listing SKU.", "Ninguna fila de costes coincide con un SKU de los anuncios."));
      if (!matchingTariffListings.length && parsed.usTariffEstimates.size) importNotes.push(t("No tariff rows matched a listing SKU.", "Ninguna fila de aranceles coincide con un SKU de los anuncios."));
      if (!parsed.hasTariffColumn) importNotes.push(t("This file has no US Tariff Estimate column; enter an estimate or 0 for each listing in the table.", "El archivo no incluye la columna de arancel estimado para EE. UU.; introduce una estimación o 0 en cada anuncio."));
      if (unmatchedCosts || unmatchedTariffs) importNotes.push((unmatchedCosts + unmatchedTariffs).toLocaleString(numberLocale) + t(" cost or tariff SKUs did not match this listings file.", " SKU de costes o aranceles no coinciden con este archivo de anuncios."));
      if (duplicateNote) importNotes.push(t(" Se encontraron filas con SKU duplicados; se usó el último valor del archivo.", " Se encontraron filas con SKU duplicados; se usó el último valor del archivo."));
      setCostImportNote(importNotes.join(" "));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("The cost CSV could not be read.", "No se pudo leer el CSV de costes."));
    } finally {
      setIsReading(false);
    }
  };

  const updateCost = (listing: Listing, rawValue: string) => {
    if (rawValue.trim() === "") {
      setUnitCosts((current) => {
        const next = { ...current };
        delete next[listing.key];
        return next;
      });
      setKnownCosts((current) => {
        const next = new Set(current);
        next.delete(listing.key);
        return next;
      });
      return;
    }
    const parsed = parseMoney(rawValue);
    if (parsed === null || parsed < 0) return;
    setUnitCosts((current) => ({ ...current, [listing.key]: parsed }));
    setKnownCosts((current) => new Set(current).add(listing.key));
  };

  const updateTariffEstimate = (listing: Listing, rawValue: string) => {
    if (rawValue.trim() === "") {
      setUsTariffEstimates((current) => {
        const next = { ...current };
        delete next[listing.key];
        return next;
      });
      setKnownTariffEstimates((current) => {
        const next = new Set(current);
        next.delete(listing.key);
        return next;
      });
      return;
    }
    const parsed = parseMoney(rawValue);
    if (parsed === null || parsed < 0) return;
    setUsTariffEstimates((current) => ({ ...current, [listing.key]: parsed }));
    setKnownTariffEstimates((current) => new Set(current).add(listing.key));
  };

  const updateSetting = (key: keyof FeeSettings, rawValue: string) => {
    const value = parseMoney(rawValue);
    if (value === null) return;
    setSettings((current) => ({ ...current, [key]: Math.max(0, value) }));
  };

  const loadSample = () => {
    const sample = parseListings([
      "TITLE,PRICE,CURRENCY,QUANTITY,SKU",
      t("Oak desk organizer", "Organizador de escritorio de roble") + ",28.00,USD,4,OAK-01",
      t("Personalized keychain", "Llavero personalizado") + ",12.00,USD,14,KEY-02",
      t("Printable wall art", "Lámina imprimible") + ",8.00,USD,999,DIGI-04",
    ].join("\r\n"), locale);
    setListings(sample.listings);
    setCurrency(sample.currency);
    setHasCurrencyColumn(true);
    setUnitCosts({ "listing:2": 11.25, "listing:3": 4.6, "listing:4": 0.8 });
    setKnownCosts(new Set(["listing:2", "listing:3", "listing:4"]));
    setUsTariffEstimates({ "listing:2": 5.5, "listing:3": 2.15, "listing:4": 0 });
    setKnownTariffEstimates(new Set(["listing:2", "listing:3", "listing:4"]));
    setInputRevision((revision) => revision + 1);
    setSettings(defaultSettings);
    setSearch("");
    setFilter("all");
    setVisibleCount(50);
    setCostImportNote(t("Sample costs and Etsy tariff estimates are illustrative. Replace them with your own item costs and Etsy estimates.", "Los costes y aranceles del ejemplo son ilustrativos. Sustitúyelos por tus costes y las estimaciones de Etsy."));
    setError("");
  };

  const clear = () => {
    setListings([]);
    setUnitCosts({});
    setKnownCosts(new Set());
    setUsTariffEstimates({});
    setKnownTariffEstimates(new Set());
    setError("");
    setCostImportNote("");
    setSearch("");
    setFilter("all");
    setVisibleCount(50);
  };

  const downloadCostTemplate = () => {
    downloadCsv(
      locale === "es" ? "plantilla-costes-aranceles-etsy.csv" : "etsy-unit-cost-template.csv",
      locale === "es"
        ? [["SKU", "Coste unitario", "Arancel estimado EE. UU."], ["TU-SKU", "", ""]]
        : [["SKU", "Unit Cost", "US Tariff Estimate"], ["YOUR-SKU", "", ""]],
      locale === "es" ? ";" : ",",
    );
  };

  const downloadReport = () => {
    if (!audited.length) return;
    const rows = audited.map((item) => [
      item.title,
      item.sku,
      item.currency,
      csvNumber(item.price),
      item.quantity === null ? "" : String(item.quantity),
      item.costKnown ? csvNumber(item.unitCost) : "",
      item.tariffEstimateKnown ? csvNumber(item.usTariffEstimate) : "",
      item.estimatedFees === null ? "" : csvNumber(item.estimatedFees),
      item.estimatedProfit === null ? "" : csvNumber(item.estimatedProfit),
      item.estimatedMargin === null ? "" : csvNumber(item.estimatedMargin * 100, 1) + "%",
      item.targetPrice === null ? "" : csvNumber(item.targetPrice),
      item.priceGap === null ? "" : csvNumber(item.priceGap),
    ]);
    const headers = locale === "es"
      ? ["Anuncio", "SKU", "Moneda", "Precio base del CSV", "Cantidad publicada", "Coste unitario", "Arancel EE. UU. de Etsy introducido", "Tarifas Etsy estimadas", "Beneficio estimado al precio base", "Margen estimado al precio base", "Precio específico para EE. UU. sugerido", "Cambio frente al precio base"]
      : ["Listing", "SKU", "Currency", "Base Price from Listings CSV", "Listed Quantity", "Unit Cost", "Etsy US Tariff Estimate Entered", "Estimated Etsy Fees", "Estimated Profit at Base Price", "Estimated Margin at Base Price", "Suggested US-Specific Price", "Change vs Base Price"];
    downloadCsv((locale === "es" ? "plan-precios-etsy-eeuu-" : "etsy-us-specific-price-plan-") + new Date().toISOString().slice(0, 10) + ".csv", [
      headers,
      ...rows,
    ], locale === "es" ? ";" : ",");
  };

  return (
    <section id="bulk-pricing-audit" aria-labelledby="bulk-pricing-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">{t("Free · Private · No Etsy login", "Gratis · Privado · Sin iniciar sesión en Etsy")}</p>
          <h2 id="bulk-pricing-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">{t("Plan US-specific prices across Etsy listings", "Planifica precios para EE. UU. en tus anuncios de Etsy")}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{t("Import your active-listings CSV, add each item’s cost and Etsy US tariff estimate, then compare estimated profit with a suggested US-specific price for your target margin.", "Importa el CSV de anuncios activos, añade el coste y el arancel estimado por Etsy para cada producto y compara el beneficio estimado con un precio sugerido para EE. UU. según tu margen objetivo.")}</p>
        </div>
        {listings.length > 0 && <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">{t("Clear report", "Borrar informe")}</button>}
      </div>

      {listings.length === 0 ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
          <p className="mt-4 font-semibold text-stone-900">{t("Start with your Etsy active-listings CSV", "Empieza con el CSV de anuncios activos de Etsy")}</p>
          <p className="mt-1 text-xs text-stone-500">{t("Add Etsy’s US tariff estimate by SKU · one shop currency · no upload", "Añade el arancel estimado de Etsy para EE. UU. por SKU · una moneda · sin subir archivos")}</p>
          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
            {isReading ? t("Reading file…", "Leyendo archivo…") : t("Choose listings CSV", "Elegir CSV de anuncios")}
            <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onListingsSelected} className="sr-only" aria-label={t("Choose Etsy active listings CSV file", "Elegir el archivo CSV de anuncios activos de Etsy")} />
          </label>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-sm">
            <button type="button" onClick={loadSample} disabled={isReading} className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">{t("Preview a sample US price plan", "Ver un ejemplo de plan de precios para EE. UU.")}</button>
            <a href={locale === "es" ? "https://help.etsy.com/hc/es/articles/360000343508" : "https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information"} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">{t("Where to get the listings CSV ↗", "Cómo descargar el CSV de anuncios ↗")}</a>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric value={listings.length.toLocaleString(numberLocale)} label={t("active listings reviewed", "anuncios activos revisados")} />
            <Metric value={summary.belowTarget.toLocaleString(numberLocale)} label={t("below your target margin", "por debajo del margen objetivo")} />
            <Metric value={summary.missingCosts.toLocaleString(numberLocale)} label={t("unit costs still missing", "sin coste unitario")} />
            <Metric value={summary.missingTariffs.toLocaleString(numberLocale)} label={t("US tariff estimates still missing", "sin arancel estimado para EE. UU.")} />
          </div>

          <div className="mt-5 rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-950">{t("Set the fee assumptions for one US order", "Configura las tarifas para un pedido de EE. UU.")}</h3>
                <p className="mt-1 text-xs leading-5 text-stone-600">{t("Defaults are example US seller rates. Set payment-processing fees to the country of your Etsy payment account; tariff estimate is entered for each item below.", "Los valores iniciales son ejemplos para vendedores de EE. UU. Ajusta el procesamiento de pagos al país de tu cuenta Etsy. El arancel estimado se añade para cada producto en la tabla.")}</p>
              </div>
              <p className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-stone-700">{t("Listing currency: ", "Moneda de los anuncios: ")}{currency}{!hasCurrencyColumn ? t(" (assumed USD)", " (se supone USD)") : ""}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Setting locale={locale} label={t("Transaction fee %", "Tarifa por transacción %")} value={settings.transactionRate} onChange={(v) => updateSetting("transactionRate", v)} />
              <Setting locale={locale} label={t("Payment processing %", "Procesamiento de pagos %")} value={settings.processingRate} onChange={(v) => updateSetting("processingRate", v)} />
              <Setting locale={locale} label={t("Fixed processing fee", "Tarifa fija de procesamiento")} value={settings.processingFixed} currency={currency} onChange={(v) => updateSetting("processingFixed", v)} />
              <Setting locale={locale} label={t("Listing / renewal allowance", "Publicación y renovación")} value={settings.listingAllowance} currency={currency} onChange={(v) => updateSetting("listingAllowance", v)} />
              <Setting locale={locale} label={t("Regulatory operating fee %", "Tarifa regulatoria %")} value={settings.regulatoryRate} onChange={(v) => updateSetting("regulatoryRate", v)} />
              <Setting locale={locale} label={t("Offsite Ads fee %", "Tarifa de Offsite Ads %")} value={settings.offsiteRate} onChange={(v) => updateSetting("offsiteRate", v)} />
              <Setting locale={locale} label={t("Tax on Etsy fees %", "Impuestos sobre tarifas de Etsy %")} value={settings.feeTaxRate} onChange={(v) => updateSetting("feeTaxRate", v)} />
              <Setting locale={locale} label={t("Buyer-paid shipping per order", "Envío pagado por el comprador por pedido")} value={settings.shippingCharged} currency={currency} onChange={(v) => updateSetting("shippingCharged", v)} />
              <Setting locale={locale} label={t("Postage cost per order", "Coste de envío por pedido")} value={settings.postageCost} currency={currency} onChange={(v) => updateSetting("postageCost", v)} />
              <Setting locale={locale} label={t("Target margin %", "Margen objetivo %")} value={settings.targetMargin} onChange={(v) => updateSetting("targetMargin", v)} max={99} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 p-4">
            <div className="mr-auto">
              <h3 className="font-semibold text-stone-950">{t("Add product costs and US tariff estimates", "Añade costes de producto y aranceles estimados para EE. UU.")}</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">{t("Upload a CSV with SKU, Unit Cost and US Tariff Estimate, or enter each value in the table. Get the estimate from Etsy for the item and its origin; use the listing currency shown above and enter 0 when none applies.", "Sube un CSV con las columnas SKU, Coste unitario y Arancel estimado EE. UU., o rellena la tabla. Consulta la estimación de Etsy para el producto y su origen; usa la moneda de los anuncios e introduce 0 si no se aplica.")}</p>
            </div>
            <button type="button" onClick={downloadCostTemplate} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">{t("Download cost template", "Descargar plantilla de costes")}</button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-950 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-900">
              {isReading ? t("Reading…", "Leyendo…") : t("Import costs & tariffs", "Importar costes y aranceles")}
              <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onCostsSelected} className="sr-only" aria-label={t("Choose SKU unit cost CSV file", "Elegir el CSV de costes por SKU")} />
            </label>
          </div>
          {costImportNote && <p role="status" className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">{costImportNote}</p>}
          {!hasCurrencyColumn && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{t("This export has no currency column. The report assumes USD; confirm the fixed fees and currency before using the estimate.", "Este archivo no incluye la moneda. El informe supone USD; confirma la moneda y las tarifas fijas antes de usar la estimación.")}</p>}
          {summary.missingCosts > 0 && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{summary.missingCosts.toLocaleString(numberLocale)} {t("listings have no unit cost yet. Add a cost or mark a zero-cost digital item by entering 0 in its row before relying on its margin.", "anuncios aún no tienen coste unitario. Añade un coste o introduce 0 para un producto digital sin coste antes de confiar en el margen.")}</p>}
          {summary.missingTariffs > 0 && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{summary.missingTariffs.toLocaleString(numberLocale)} {t("listings have no US tariff estimate. Enter Etsy’s estimate, or enter 0 if no tariff applies. Profit and target US prices stay blank until an estimate is provided.", "anuncios no tienen arancel estimado para EE. UU. Introduce la estimación de Etsy o 0 si no se aplica. El beneficio y el precio objetivo quedan vacíos hasta que añadas el dato.")}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="bulk-pricing-search">{t("Search listings by title or SKU", "Buscar anuncios por título o SKU")}</label>
            <input id="bulk-pricing-search" value={search} onChange={(event) => { setSearch(event.currentTarget.value); setVisibleCount(50); }} placeholder={t("Search title or SKU", "Buscar título o SKU")} className="min-h-10 min-w-56 flex-1 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            <label className="sr-only" htmlFor="bulk-pricing-filter">{t("Filter listing report", "Filtrar informe de anuncios")}</label>
            <select id="bulk-pricing-filter" value={filter} onChange={(event) => { setFilter(event.currentTarget.value as typeof filter); setVisibleCount(50); }} className="min-h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="all">{t("All listings", "Todos los anuncios")}</option>
              <option value="below-target">{t("Below target margin", "Por debajo del margen objetivo")}</option>
              <option value="missing-cost">{t("Missing unit cost", "Sin coste unitario")}</option>
              <option value="missing-tariff">{t("Missing US tariff estimate", "Sin arancel estimado para EE. UU.")}</option>
            </select>
            <button type="button" onClick={downloadReport} className="min-h-10 rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">{t("Download pricing report CSV", "Descargar informe de precios CSV")}</button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[1160px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("Listing / SKU", "Anuncio / SKU")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("Base price", "Precio base")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("Unit cost", "Coste unitario")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("US tariff estimate", "Arancel estimado EE. UU.")} ({currency})</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("Est. profit at base price", "Beneficio est. al precio base")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("Margin at base price", "Margen al precio base")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("Suggested US price", "Precio sugerido para EE. UU.")}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t("Change vs base", "Cambio frente al precio base")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.slice(0, visibleCount).map((item) => (
                  <tr key={item.key} className="border-t border-stone-200">
                    <td className="max-w-[20rem] px-4 py-3">
                      <span className="block truncate font-medium text-stone-900" title={item.title}>{item.title}</span>
                      <span className="mt-1 block text-xs text-stone-500">{item.sku || t("No SKU", "Sin SKU")}{item.quantity === null ? "" : " · " + item.quantity.toLocaleString(numberLocale) + t(" in stock", " en existencias")}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-stone-800">{formatMoney(item.price, currency, numberLocale)}</td>
                    <td className="px-4 py-3 text-right">
                      <label className="sr-only" htmlFor={"cost-" + item.key}>{t("Unit cost for ", "Coste unitario de ")}{item.title}</label>
                      <EditableNumber key={item.key + ":" + inputRevision} id={"cost-" + item.key} label={t("Unit cost for ", "Coste unitario de ") + item.title} value={knownCosts.has(item.key) ? String(unitCosts[item.key] ?? 0) : ""} locale={locale} onChange={(value) => updateCost(item, value)} className="w-28 rounded-lg border border-stone-300 px-2 py-1.5 text-right tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <label className="sr-only" htmlFor={"tariff-" + item.key}>{t("US tariff estimate for ", "Arancel estimado para EE. UU. de ")}{item.title}</label>
                      <EditableNumber key={item.key + ":" + inputRevision} id={"tariff-" + item.key} label={t("US tariff estimate for ", "Arancel estimado para EE. UU. de ") + item.title} value={knownTariffEstimates.has(item.key) ? String(usTariffEstimates[item.key] ?? 0) : ""} locale={locale} onChange={(value) => updateTariffEstimate(item, value)} className="w-28 rounded-lg border border-stone-300 px-2 py-1.5 text-right tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                    </td>
                    <td className={"px-4 py-3 text-right font-semibold tabular-nums " + ((item.estimatedProfit ?? 0) < 0 ? "text-rose-800" : "text-stone-900")}>{item.estimatedProfit === null ? (!item.costKnown ? t("Add cost", "Añadir coste") : t("Add tariff", "Añadir arancel")) : formatMoney(item.estimatedProfit, currency, numberLocale)}</td>
                    <td className={"px-4 py-3 text-right tabular-nums " + (item.estimatedMargin !== null && item.estimatedMargin < settings.targetMargin / 100 ? "text-rose-800" : "text-emerald-900")}>{item.estimatedMargin === null ? (!item.costKnown ? t("Add cost", "Añadir coste") : t("Add tariff", "Añadir arancel")) : formatPercent(item.estimatedMargin, numberLocale)}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-stone-800">{!item.pricingInputsKnown ? (!item.costKnown && !item.tariffEstimateKnown ? t("Add cost & tariff", "Añadir coste y arancel") : !item.costKnown ? t("Add cost", "Añadir coste") : t("Add tariff", "Añadir arancel")) : item.targetPrice === null ? t("Not possible", "No es posible") : formatMoney(item.targetPrice, currency, numberLocale)}</td>
                    <td className={"px-4 py-3 text-right tabular-nums " + ((item.priceGap ?? 0) > 0 ? "text-amber-800" : "text-emerald-900")}>{!item.pricingInputsKnown ? (!item.costKnown && !item.tariffEstimateKnown ? t("Add cost & tariff", "Añadir coste y arancel") : !item.costKnown ? t("Add cost", "Añadir coste") : t("Add tariff", "Añadir arancel")) : item.priceGap === null ? "—" : formatSignedMoney(item.priceGap, currency, numberLocale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && <p className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">{t("No listings match this search and filter.", "Ningún anuncio coincide con la búsqueda y el filtro.")}</p>}
          {filteredRows.length > visibleCount && <button type="button" onClick={() => setVisibleCount((count) => count + 50)} className="mt-4 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-500">{t("Show 50 more listings", "Mostrar 50 anuncios más")}</button>}

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            {t("The base price comes from the listings CSV. Estimates assume one US order, one entered Etsy tariff estimate per item, the buyer-paid shipping, postage and fee rates above, no discounts, no buyer tax in the processing base, and no refunds or ad spend beyond the Offsite Ads rate. Set processing fees for the country of your Etsy payment account. This report does not calculate duties, select customs codes, update Etsy prices, or replace an accounting or customs professional.", "El precio base procede del CSV de anuncios. La estimación supone un pedido a EE. UU., un arancel de Etsy introducido por producto, el envío pagado por el comprador, los gastos de envío y las tarifas indicadas; no contempla descuentos, impuestos del comprador en la base de procesamiento, reembolsos ni publicidad fuera de Offsite Ads. Configura el procesamiento de pagos según el país de tu cuenta Etsy. Este informe no calcula aranceles, elige códigos aduaneros ni actualiza tus precios en Etsy, y no sustituye el asesoramiento contable o aduanero.")}
          </div>
          <p className="mt-4 text-xs leading-5 text-stone-500">{t("Your selected listing and cost files are read in this browser and are not uploaded. Do not include buyer data in the cost CSV.", "Los archivos de anuncios y costes se leen en este navegador y no se suben. No incluyas datos de compradores en el CSV de costes.")}</p>
        </>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{error}</p>}
    </section>
  );
}

function Setting({ label, value, currency, locale, onChange, max = 100 }: {
  label: string;
  value: number;
  currency?: string;
  locale: Locale;
  max?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-stone-700">
      {label}{currency ? " (" + currency + ")" : ""}
      <EditableNumber id={"setting-" + normalizeHeader(label)} label={label + (currency ? " (" + currency + ")" : "")} value={String(value)} locale={locale} onChange={onChange} className="mt-1.5 min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" max={max} />
    </label>
  );
}

function EditableNumber({ id, label, value, locale, onChange, className, max }: {
  id: string;
  label: string;
  value: string;
  locale: Locale;
  onChange: (value: string) => void;
  className: string;
  max?: number;
}) {
  const [draft, setDraft] = useState(() => formatInputNumber(value, locale));
  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      lang={locale === "es" ? "es-ES" : "en-US"}
      value={draft}
      onChange={(event) => {
        const rawValue = event.currentTarget.value;
        setDraft(rawValue);
        if (!rawValue.trim()) onChange("");
        else {
          const parsed = parseMoney(rawValue);
          if (parsed !== null && parsed >= 0 && (max === undefined || parsed <= max)) onChange(String(parsed));
        }
      }}
      onBlur={() => {
        const parsed = parseMoney(draft);
        if (!draft.trim()) {
          onChange("");
        } else if (parsed !== null && parsed >= 0 && (max === undefined || parsed <= max)) {
          setDraft(formatInputNumber(String(parsed), locale));
          onChange(String(parsed));
        } else {
          setDraft(formatInputNumber(value, locale));
        }
      }}
      aria-label={label}
      className={className}
    />
  );
}

function formatInputNumber(value: string, locale: Locale): string {
  if (!value) return "";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value;
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", {
    useGrouping: false,
    maximumFractionDigits: 2,
  }).format(parsed);
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4">
      <p className="text-2xl font-semibold tabular-nums text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-600">{label}</p>
    </div>
  );
}

function parseListings(csvText: string, locale: Locale = "en"): { listings: Listing[]; currency: string; hasCurrencyColumn: boolean } {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error(translate(locale, "The selected file is empty.", "El archivo seleccionado está vacío."));
  const rows = parseCsv(text, detectDelimiter(text), locale).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error(translate(locale, "The CSV has a header but no active listing rows.", "El CSV contiene encabezados, pero no filas de anuncios activos."));
  const headers = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headers, ["title", "listingtitle", "itemtitle", "product", "productname", "titulo", "titulodelanuncio", "titulodelarticulo"]);
  const priceIndex = findColumn(headers, ["price", "listingprice", "itemprice", "precio", "preciodelarticulo", "preciodeventa"]);
  const currencyIndex = findColumn(headers, ["currency", "currencycode", "listingcurrency", "moneda", "codigodedivisa", "divisa"]);
  const skuIndex = findColumn(headers, ["sku", "listingsku", "itemsku", "productsku", "referencia"]);
  const quantityIndex = findColumn(headers, ["quantity", "qty", "listingquantity", "cantidad", "existencias", "stock"]);
  const idIndex = findColumn(headers, ["listingid", "listingnumber", "idlisting", "identificadordelanuncio"]);
  if (titleIndex < 0 || priceIndex < 0) {
    throw new Error(translate(locale, "I couldn’t find listing title and price columns. Choose Etsy’s currently-for-sale listings CSV.", "No encuentro las columnas de título y precio. Elige el CSV de anuncios activos de Etsy."));
  }
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (dataRows.length > MAX_LISTINGS) throw new Error(translate(locale, "This file has more than ", "El archivo contiene más de ") + MAX_LISTINGS.toLocaleString(locale === "es" ? "es-ES" : "en-US") + translate(locale, " listings. Export a smaller set.", " anuncios. Exporta un conjunto más pequeño."));
  const parsed: Listing[] = [];
  for (const [index, row] of dataRows.entries()) {
    const title = row[titleIndex]?.trim() ?? "";
    const price = parseMoney(row[priceIndex] ?? "");
    if (!title || price === null || price < 0) {
      continue;
    }
    const sku = skuIndex >= 0 ? row[skuIndex]?.trim() ?? "" : "";
    const skuKey = normalizeText(sku);
    const rawCurrency = currencyIndex >= 0 ? row[currencyIndex]?.trim().toUpperCase() ?? "" : "";
    const rowCurrency = rawCurrency || inferCurrency(row[priceIndex] ?? "");
    const quantity = quantityIndex >= 0 ? parseQuantity(row[quantityIndex] ?? "") : null;
    const id = idIndex >= 0 ? row[idIndex]?.trim() ?? "" : "";
    parsed.push({
      key: "listing:" + (id || String(index + 2)),
      rowNumber: index + 2,
      title,
      sku,
      skuKey,
      price,
      currency: rowCurrency || "USD",
      quantity,
    });
  }
  if (parsed.length === 0) throw new Error(translate(locale, "No rows with readable listing titles and prices were found.", "No se encontraron filas con títulos y precios válidos."));
  const currencies = new Set(parsed.map((item) => item.currency));
  if (currencies.size > 1) throw new Error(translate(locale, "This report needs one listing currency at a time. Keep rows in a single currency and re-export or edit the CSV.", "El informe solo admite una moneda por vez. Deja una sola moneda y vuelve a exportar o editar el CSV."));
  return { listings: parsed, currency: [...currencies][0], hasCurrencyColumn: currencyIndex >= 0 };
}

function parseCosts(csvText: string, locale: Locale = "en"): {
  costs: Map<string, number>;
  usTariffEstimates: Map<string, number>;
  duplicateSkus: number;
  hasTariffColumn: boolean;
} {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error(translate(locale, "The cost file is empty.", "El archivo de costes está vacío."));
  const rows = parseCsv(text, detectDelimiter(text), locale).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error(translate(locale, "The cost CSV has a header but no cost rows.", "El CSV tiene encabezados, pero no filas de costes."));
  const headers = rows[0].map(normalizeHeader);
  const skuIndex = findColumn(headers, ["sku", "listingsku", "itemsku", "productsku", "referencia"]);
  const costIndex = findColumn(headers, ["unitcost", "costperunit", "productcost", "materialcost", "cost", "costperitem", "costeunitario", "costeporunidad", "coste", "costedelproducto", "costedelarticulo"]);
  const tariffIndex = findColumn(headers, ["ustariffestimate", "ustariffcost", "estimatedustariff", "tariffestimate", "tariffcost", "estimatedduty", "customsdutyestimate", "arancelestimadoeeuu", "arancelestimado", "costearanceles", "arancelesestimados", "estimacionarancelaria"]);
  if (skuIndex < 0 || (costIndex < 0 && tariffIndex < 0)) {
    throw new Error(translate(locale, "The CSV needs a SKU column and at least one of Unit Cost or US Tariff Estimate.", "El CSV debe incluir una columna SKU y al menos una de estas columnas: Coste unitario o Arancel estimado EE. UU."));
  }
  const costs = new Map<string, number>();
  const usTariffEstimates = new Map<string, number>();
  let duplicateSkus = 0;
  for (const row of rows.slice(1)) {
    const sku = normalizeText(row[skuIndex] ?? "");
    if (!sku) continue;
    const cost = costIndex >= 0 ? parseMoney(row[costIndex] ?? "") : null;
    const tariff = tariffIndex >= 0 ? parseMoney(row[tariffIndex] ?? "") : null;
    if ((cost === null || cost < 0) && (tariff === null || tariff < 0)) continue;
    if (costs.has(sku) || usTariffEstimates.has(sku)) duplicateSkus += 1;
    if (cost !== null && cost >= 0) costs.set(sku, cost);
    if (tariff !== null && tariff >= 0) usTariffEstimates.set(sku, tariff);
  }
  if (costs.size === 0 && usTariffEstimates.size === 0) {
    throw new Error(translate(locale, "No rows with a SKU and non-negative cost or US tariff estimate were found.", "No se encontraron filas con un SKU y un coste o arancel estimado igual o superior a 0."));
  }
  return { costs, usTariffEstimates, duplicateSkus, hasTariffColumn: tariffIndex >= 0 };
}

function parseCsv(value: string, delimiter: string, locale: Locale = "en"): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === '"') {
      if (quoted && value[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && value[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  if (quoted) throw new Error(translate(locale, "A CSV field has an unclosed quote. Re-download the export and try again.", "Un campo del CSV tiene comillas sin cerrar. Descarga de nuevo el archivo e inténtalo otra vez."));
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function detectDelimiter(text: string): string {
  const counts = new Map([[",", 0], [";", 0], ["\t", 0]]);
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if ((character === "\n" || character === "\r") && !quoted) break;
    else if (!quoted && counts.has(character)) counts.set(character, (counts.get(character) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function normalizeHeader(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function findColumn(headers: string[], names: string[]): number {
  for (const name of names) {
    const index = headers.indexOf(name);
    if (index >= 0) return index;
  }
  return -1;
}

function parseQuantity(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value.trim().replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : null;
}

function parseMoney(value: string): number | null {
  let cleaned = value.trim().replace(/[^\d,.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === ",") return null;
  const comma = cleaned.lastIndexOf(",");
  const dot = cleaned.lastIndexOf(".");
  if (comma >= 0 && dot >= 0) {
    if (comma > dot) cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    else cleaned = cleaned.replace(/,/g, "");
  } else if (comma >= 0) {
    const decimals = cleaned.length - comma - 1;
    cleaned = decimals === 1 || decimals === 2 ? cleaned.replace(",", ".") : cleaned.replace(/,/g, "");
  }
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function inferCurrency(value: string): string {
  if (value.includes("€")) return "EUR";
  if (value.includes("£")) return "GBP";
  if (value.includes("¥")) return "JPY";
  return "USD";
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value: number, currency: string, locale = "en-US"): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return value.toFixed(2) + " " + currency;
  }
}

function formatSignedMoney(value: number, currency: string, locale = "en-US"): string {
  return (value > 0 ? "+" : "") + formatMoney(value, currency, locale);
}

function formatPercent(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function downloadCsv(fileName: string, rows: string[][], delimiter = ",") {
  const csv = rows.map((row) => row.map((cell) => toCsvCell(cell, delimiter)).join(delimiter)).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsvCell(value: string, delimiter: string): string {
  const safeValue = /^[\t\r ]*[=+\-@]/.test(value) ? "'" + value : value;
  return (safeValue.includes(delimiter) || /["\r\n]/.test(safeValue)) ? '"' + safeValue.replace(/"/g, '""') + '"' : safeValue;
}

function translate(locale: Locale, english: string, spanish: string): string {
  return locale === "es" ? spanish : english;
}
