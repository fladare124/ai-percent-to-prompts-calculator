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

export default function EtsyBulkPricingAudit() {
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
  const [filter, setFilter] = useState<"all" | "below-target" | "missing-cost">("all");
  const [visibleCount, setVisibleCount] = useState(50);

  const audited = useMemo(() => {
    const feeRate = (settings.transactionRate + settings.processingRate + settings.regulatoryRate + settings.offsiteRate) / 100;
    const feeTaxRate = settings.feeTaxRate / 100;
    const fixedFees = (settings.processingFixed + settings.listingAllowance) * (1 + feeTaxRate);
    const targetMargin = settings.targetMargin / 100;
    const denominator = 1 - feeRate * (1 + feeTaxRate) - targetMargin;

    return listings.map((listing): AuditedListing => {
      const unitCost = unitCosts[listing.key] ?? 0;
      const orderRevenue = listing.price + settings.shippingCharged;
      const costKnown = knownCosts.has(listing.key);
      const estimatedFees = costKnown
        ? roundMoney(orderRevenue * feeRate * (1 + feeTaxRate) + fixedFees)
        : null;
      const totalCosts = unitCost + settings.postageCost;
      const estimatedProfit = estimatedFees === null
        ? null
        : roundMoney(orderRevenue - estimatedFees - totalCosts);
      const estimatedMargin = estimatedProfit !== null && orderRevenue > 0 ? estimatedProfit / orderRevenue : null;
      const targetRevenue = costKnown && denominator > 0
        ? (totalCosts + fixedFees) / denominator
        : null;
      const targetPrice = targetRevenue === null
        ? null
        : Math.max(0, Math.ceil((targetRevenue - settings.shippingCharged) * 100 - 1e-8) / 100);
      return {
        ...listing,
        unitCost,
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
  }, [knownCosts, listings, settings, unitCosts]);

  const filteredRows = useMemo(() => {
    const query = normalizeText(search);
    return audited.filter((item) => {
      const matchesSearch = !query || normalizeText(item.title).includes(query) || normalizeText(item.sku).includes(query);
      const matchesFilter = filter === "all"
        || (filter === "below-target" && item.costKnown && (item.estimatedMargin === null || item.estimatedMargin < settings.targetMargin / 100))
        || (filter === "missing-cost" && !item.costKnown);
      return matchesSearch && matchesFilter;
    });
  }, [audited, filter, search, settings.targetMargin]);

  const summary = useMemo(() => ({
    belowTarget: audited.filter((item) => item.costKnown && (item.estimatedMargin === null || item.estimatedMargin < settings.targetMargin / 100)).length,
    missingCosts: audited.filter((item) => !item.costKnown).length,
  }), [audited, settings.targetMargin]);

  const onListingsSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    setCostImportNote("");
    setIsReading(true);
    try {
      if (file.size > MAX_FILE_BYTES) throw new Error("This file is over 10 MB. Export a smaller set of active listings and try again.");
      const parsed = parseListings(await file.text());
      setListings(parsed.listings);
      setCurrency(parsed.currency);
      setHasCurrencyColumn(parsed.hasCurrencyColumn);
      setUnitCosts({});
      setKnownCosts(new Set());
      setSearch("");
      setFilter("all");
      setVisibleCount(50);
    } catch (caught) {
      setListings([]);
      setUnitCosts({});
      setKnownCosts(new Set());
      setError(caught instanceof Error ? caught.message : "The listing CSV could not be read.");
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
      if (file.size > MAX_FILE_BYTES) throw new Error("This file is over 10 MB. Choose a smaller cost file.");
      const parsed = parseCosts(await file.text());
      const matchingListings = listings.filter((listing) => listing.skuKey && parsed.costs.has(listing.skuKey));
      const unmatched = [...parsed.costs.keys()].filter((sku) => !listings.some((item) => item.skuKey === sku)).length;
      setUnitCosts((current) => {
        const next = { ...current };
        for (const listing of matchingListings) {
          const value = parsed.costs.get(listing.skuKey);
          if (value === undefined) continue;
          next[listing.key] = value;
        }
        return next;
      });
      setKnownCosts((current) => {
        const next = new Set(current);
        for (const listing of listings) {
          if (listing.skuKey && parsed.costs.has(listing.skuKey)) next.add(listing.key);
        }
        return next;
      });
      const duplicateNote = parsed.duplicateSkus ? " Duplicate SKU rows were found; the last value in the file was used." : "";
      setCostImportNote(
        matchingListings.length === 0
          ? "No cost rows matched a listing SKU. Check that both files use the same SKU values."
          : "Loaded costs for " + matchingListings.length.toLocaleString() + " listings."
            + (unmatched ? " " + unmatched.toLocaleString() + " cost SKUs did not match this listings file." : "")
            + duplicateNote,
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The cost CSV could not be read.");
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

  const updateSetting = (key: keyof FeeSettings, rawValue: string) => {
    const value = Number(rawValue);
    if (!Number.isFinite(value)) return;
    setSettings((current) => ({ ...current, [key]: Math.max(0, value) }));
  };

  const loadSample = () => {
    const sample = parseListings([
      "TITLE,PRICE,CURRENCY,QUANTITY,SKU",
      "Oak desk organizer,28.00,USD,4,OAK-01",
      "Personalized keychain,12.00,USD,14,KEY-02",
      "Printable wall art,8.00,USD,999,DIGI-04",
    ].join("\r\n"));
    setListings(sample.listings);
    setCurrency(sample.currency);
    setHasCurrencyColumn(true);
    setUnitCosts({ "listing:2": 11.25, "listing:3": 4.6, "listing:4": 0.8 });
    setKnownCosts(new Set(["listing:2", "listing:3", "listing:4"]));
    setSettings(defaultSettings);
    setSearch("");
    setFilter("all");
    setVisibleCount(50);
    setCostImportNote("Sample product costs are included so you can preview the report.");
    setError("");
  };

  const clear = () => {
    setListings([]);
    setUnitCosts({});
    setKnownCosts(new Set());
    setError("");
    setCostImportNote("");
    setSearch("");
    setFilter("all");
    setVisibleCount(50);
  };

  const downloadCostTemplate = () => {
    downloadCsv(
      "etsy-unit-cost-template.csv",
      [["SKU", "Unit Cost"], ["OAK-01", "11.25"], ["KEY-02", "4.60"]],
    );
  };

  const downloadReport = () => {
    if (!audited.length) return;
    const rows = audited.map((item) => [
      item.title,
      item.sku,
      item.currency,
      item.price.toFixed(2),
      item.quantity === null ? "" : String(item.quantity),
      item.costKnown ? item.unitCost.toFixed(2) : "",
      item.estimatedFees === null ? "" : item.estimatedFees.toFixed(2),
      item.estimatedProfit === null ? "" : item.estimatedProfit.toFixed(2),
      item.estimatedMargin === null ? "" : (item.estimatedMargin * 100).toFixed(1) + "%",
      item.targetPrice === null ? "" : item.targetPrice.toFixed(2),
      item.priceGap === null ? "" : item.priceGap.toFixed(2),
    ]);
    downloadCsv("etsy-bulk-pricing-audit-" + new Date().toISOString().slice(0, 10) + ".csv", [
      ["Listing", "SKU", "Currency", "Current Price", "Listed Quantity", "Unit Cost", "Estimated Etsy Fees", "Estimated Profit Per Order", "Estimated Margin", "Price for Target Margin", "Price Change to Target"],
      ...rows,
    ]);
  };

  return (
    <section id="bulk-pricing-audit" aria-labelledby="bulk-pricing-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Free · Private · No Etsy login</p>
          <h2 id="bulk-pricing-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Audit prices across your Etsy listings</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Import your active-listings CSV, add a unit cost for each SKU, and compare an estimated per-order margin with a target price for your whole catalogue.</p>
        </div>
        {listings.length > 0 && <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">Clear report</button>}
      </div>

      {listings.length === 0 ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
          <p className="mt-4 font-semibold text-stone-900">Choose Etsy’s active-listings CSV</p>
          <p className="mt-1 text-xs text-stone-500">CSV up to 10 MB · one shop currency · no upload</p>
          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
            {isReading ? "Reading file…" : "Choose listings CSV"}
            <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onListingsSelected} className="sr-only" aria-label="Choose Etsy active listings CSV file" />
          </label>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-5 text-sm">
            <button type="button" onClick={loadSample} disabled={isReading} className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Preview a sample report</button>
            <a href="https://help.etsy.com/hc/en-us/articles/360000343508-How-to-Download-Your-Listing-Information" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Where to get the listings CSV ↗</a>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric value={listings.length.toLocaleString()} label="active listings reviewed" />
            <Metric value={summary.belowTarget.toLocaleString()} label="below your target margin" />
            <Metric value={summary.missingCosts.toLocaleString()} label="unit costs still missing" />
          </div>

          <div className="mt-5 rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-stone-950">Set the fee assumptions for one typical order</h3>
                <p className="mt-1 text-xs leading-5 text-stone-600">Defaults are common US Etsy fees. Edit every rate to match your payment-account country and shop.</p>
              </div>
              <p className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-stone-700">Listing currency: {currency}{!hasCurrencyColumn ? " (assumed USD)" : ""}</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Setting label="Transaction fee %" value={settings.transactionRate} onChange={(v) => updateSetting("transactionRate", v)} />
              <Setting label="Payment processing %" value={settings.processingRate} onChange={(v) => updateSetting("processingRate", v)} />
              <Setting label="Fixed processing fee" value={settings.processingFixed} currency={currency} onChange={(v) => updateSetting("processingFixed", v)} />
              <Setting label="Listing / renewal allowance" value={settings.listingAllowance} currency={currency} onChange={(v) => updateSetting("listingAllowance", v)} />
              <Setting label="Regulatory operating fee %" value={settings.regulatoryRate} onChange={(v) => updateSetting("regulatoryRate", v)} />
              <Setting label="Offsite Ads fee %" value={settings.offsiteRate} onChange={(v) => updateSetting("offsiteRate", v)} />
              <Setting label="Tax on Etsy fees %" value={settings.feeTaxRate} onChange={(v) => updateSetting("feeTaxRate", v)} />
              <Setting label="Buyer-paid shipping per order" value={settings.shippingCharged} currency={currency} onChange={(v) => updateSetting("shippingCharged", v)} />
              <Setting label="Postage cost per order" value={settings.postageCost} currency={currency} onChange={(v) => updateSetting("postageCost", v)} />
              <Setting label="Target margin %" value={settings.targetMargin} onChange={(v) => updateSetting("targetMargin", v)} max={99} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 p-4">
            <div className="mr-auto">
              <h3 className="font-semibold text-stone-950">Add product costs</h3>
              <p className="mt-1 text-xs leading-5 text-stone-600">Upload a CSV with SKU and Unit Cost, or edit costs in the table. Include materials, packaging and labor in each unit cost.</p>
            </div>
            <button type="button" onClick={downloadCostTemplate} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">Download cost template</button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-emerald-950 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-900">
              {isReading ? "Reading…" : "Import SKU costs"}
              <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onCostsSelected} className="sr-only" aria-label="Choose SKU unit cost CSV file" />
            </label>
          </div>
          {costImportNote && <p role="status" className="mt-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">{costImportNote}</p>}
          {!hasCurrencyColumn && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">This export has no currency column. The report assumes USD; confirm the fixed fees and currency before using the estimate.</p>}
          {summary.missingCosts > 0 && <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{summary.missingCosts.toLocaleString()} listings have no unit cost yet. Add a cost or mark a zero-cost digital item by entering 0 in its row before relying on its margin.</p>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="bulk-pricing-search">Search listings by title or SKU</label>
            <input id="bulk-pricing-search" value={search} onChange={(event) => { setSearch(event.currentTarget.value); setVisibleCount(50); }} placeholder="Search title or SKU" className="min-h-10 min-w-56 flex-1 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
            <label className="sr-only" htmlFor="bulk-pricing-filter">Filter listing report</label>
            <select id="bulk-pricing-filter" value={filter} onChange={(event) => { setFilter(event.currentTarget.value as typeof filter); setVisibleCount(50); }} className="min-h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-800 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="all">All listings</option>
              <option value="below-target">Below target margin</option>
              <option value="missing-cost">Missing unit cost</option>
            </select>
            <button type="button" onClick={downloadReport} className="min-h-10 rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900">Download pricing report CSV</button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[940px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Listing / SKU</th>
                  <th className="px-4 py-3 text-right font-semibold">Current price</th>
                  <th className="px-4 py-3 text-right font-semibold">Unit cost</th>
                  <th className="px-4 py-3 text-right font-semibold">Est. profit / order</th>
                  <th className="px-4 py-3 text-right font-semibold">Est. margin</th>
                  <th className="px-4 py-3 text-right font-semibold">Price at target</th>
                  <th className="px-4 py-3 text-right font-semibold">Price change</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.slice(0, visibleCount).map((item) => (
                  <tr key={item.key} className="border-t border-stone-200">
                    <td className="max-w-[20rem] px-4 py-3">
                      <span className="block truncate font-medium text-stone-900" title={item.title}>{item.title}</span>
                      <span className="mt-1 block text-xs text-stone-500">{item.sku || "No SKU"}{item.quantity === null ? "" : " · " + item.quantity + " in stock"}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-stone-800">{formatMoney(item.price, currency)}</td>
                    <td className="px-4 py-3 text-right">
                      <label className="sr-only" htmlFor={"cost-" + item.key}>Unit cost for {item.title}</label>
                      <input id={"cost-" + item.key} type="number" min="0" step="0.01" value={unitCosts[item.key] ?? ""} onChange={(event) => updateCost(item, event.currentTarget.value)} className="w-28 rounded-lg border border-stone-300 px-2 py-1.5 text-right tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
                    </td>
                    <td className={"px-4 py-3 text-right font-semibold tabular-nums " + ((item.estimatedProfit ?? 0) < 0 ? "text-rose-800" : "text-stone-900")}>{item.estimatedProfit === null ? "Add cost" : formatMoney(item.estimatedProfit, currency)}</td>
                    <td className={"px-4 py-3 text-right tabular-nums " + (item.estimatedMargin !== null && item.estimatedMargin < settings.targetMargin / 100 ? "text-rose-800" : "text-emerald-900")}>{item.estimatedMargin === null ? "Add cost" : formatPercent(item.estimatedMargin)}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums text-stone-800">{!item.costKnown ? "Add cost" : item.targetPrice === null ? "Not possible" : formatMoney(item.targetPrice, currency)}</td>
                    <td className={"px-4 py-3 text-right tabular-nums " + ((item.priceGap ?? 0) > 0 ? "text-amber-800" : "text-emerald-900")}>{!item.costKnown ? "Add cost" : item.priceGap === null ? "—" : formatSignedMoney(item.priceGap, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && <p className="mt-4 rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-600">No listings match this search and filter.</p>}
          {filteredRows.length > visibleCount && <button type="button" onClick={() => setVisibleCount((count) => count + 50)} className="mt-4 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:border-stone-500">Show 50 more listings</button>}

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
            Estimates assume one item in an order, the entered buyer-paid shipping and postage, the fee rates above, no discounts, no buyer tax in the processing base, and no refunds or ad spend beyond the Offsite Ads rate. Listing renewal timing and country taxes can change actual charges. This report does not update live Etsy prices and is not an accounting or tax report.
          </div>
          <p className="mt-4 text-xs leading-5 text-stone-500">Your selected listing and cost files are read in this browser and are not uploaded. Do not include buyer data in the cost CSV.</p>
        </>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{error}</p>}
    </section>
  );
}

function Setting({ label, value, currency, onChange, max = 100 }: {
  label: string;
  value: number;
  currency?: string;
  max?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-medium text-stone-700">
      {label}{currency ? " (" + currency + ")" : ""}
      <input type="number" min="0" max={max} step="0.01" value={value} onChange={(event) => onChange(event.currentTarget.value)} className="mt-1.5 min-h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm tabular-nums text-stone-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
    </label>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4">
      <p className="text-2xl font-semibold tabular-nums text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-600">{label}</p>
    </div>
  );
}

function parseListings(csvText: string): { listings: Listing[]; currency: string; hasCurrencyColumn: boolean } {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error("The selected file is empty.");
  const rows = parseCsv(text, detectDelimiter(text)).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("The CSV has a header but no active listing rows.");
  const headers = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headers, ["title", "listingtitle", "itemtitle", "product", "productname", "titulo", "titulodelanuncio", "titulodelarticulo"]);
  const priceIndex = findColumn(headers, ["price", "listingprice", "itemprice", "precio", "preciodelarticulo", "preciodeventa"]);
  const currencyIndex = findColumn(headers, ["currency", "currencycode", "listingcurrency", "moneda", "codigodedivisa", "divisa"]);
  const skuIndex = findColumn(headers, ["sku", "listingsku", "itemsku", "productsku", "referencia"]);
  const quantityIndex = findColumn(headers, ["quantity", "qty", "listingquantity", "cantidad", "existencias", "stock"]);
  const idIndex = findColumn(headers, ["listingid", "listingnumber", "idlisting", "identificadordelanuncio"]);
  if (titleIndex < 0 || priceIndex < 0) {
    throw new Error("I couldn’t find listing title and price columns. Choose Etsy’s currently-for-sale listings CSV.");
  }
  const dataRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (dataRows.length > MAX_LISTINGS) throw new Error("This file has more than " + MAX_LISTINGS.toLocaleString() + " listings. Export a smaller set.");
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
  if (parsed.length === 0) throw new Error("No rows with readable listing titles and prices were found.");
  const currencies = new Set(parsed.map((item) => item.currency));
  if (currencies.size > 1) throw new Error("This report needs one listing currency at a time. Keep rows in a single currency and re-export or edit the CSV.");
  return { listings: parsed, currency: [...currencies][0], hasCurrencyColumn: currencyIndex >= 0 };
}

function parseCosts(csvText: string): { costs: Map<string, number>; duplicateSkus: number } {
  const text = csvText.replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error("The cost file is empty.");
  const rows = parseCsv(text, detectDelimiter(text)).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("The cost CSV has a header but no cost rows.");
  const headers = rows[0].map(normalizeHeader);
  const skuIndex = findColumn(headers, ["sku", "listingsku", "itemsku", "productsku", "referencia"]);
  const costIndex = findColumn(headers, ["unitcost", "costperunit", "productcost", "materialcost", "cost", "costperitem", "costeunitario", "costeporunidad"]);
  if (skuIndex < 0 || costIndex < 0) throw new Error("The cost CSV needs columns named SKU and Unit Cost.");
  const costs = new Map<string, number>();
  let duplicateSkus = 0;
  for (const row of rows.slice(1)) {
    const sku = normalizeText(row[skuIndex] ?? "");
    const value = parseMoney(row[costIndex] ?? "");
    if (!sku || value === null || value < 0) continue;
    if (costs.has(sku)) duplicateSkus += 1;
    costs.set(sku, value);
  }
  if (costs.size === 0) throw new Error("No cost rows with a SKU and non-negative unit cost were found.");
  return { costs, duplicateSkus };
}

function parseCsv(value: string, delimiter: string): string[][] {
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
  if (quoted) throw new Error("A CSV field has an unclosed quote. Re-download the export and try again.");
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

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  } catch {
    return value.toFixed(2) + " " + currency;
  }
}

function formatSignedMoney(value: number, currency: string): string {
  return (value > 0 ? "+" : "") + formatMoney(value, currency);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function downloadCsv(fileName: string, rows: string[][]) {
  const csv = rows.map((row) => row.map(toCsvCell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsvCell(value: string): string {
  const safeValue = /^[\t\r ]*[=+\-@]/.test(value) ? "'" + value : value;
  return /[",\r\n]/.test(safeValue) ? '"' + safeValue.replace(/"/g, '""') + '"' : safeValue;
}
