"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type SaleItem = {
  product: string;
  sku: string;
  orderId: string;
  quantity: number;
  itemPrice: number;
  currency: string;
};

type ProductSummary = {
  key: string;
  product: string;
  sku: string;
  currency: string;
  itemRows: number;
  units: number;
  itemValue: number;
  orderFeeShare: number;
  unlinkedOrderRows: number;
  orders: Set<string>;
};

type SalesReport = {
  items: SaleItem[];
  hasQuantity: boolean;
  hasOrderId: boolean;
  unlinkedOrderRows: number;
  skippedRows: number;
  assumedQuantityRows: number;
};

type CostImport = {
  unitCosts: Record<string, string>;
  matchedProducts: number;
  unmatchedRows: number;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_ITEM_ROWS = 100_000;

export default function EtsySalesCsvAnalyzer() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [isSample, setIsSample] = useState(false);
  const [unitCosts, setUnitCosts] = useState<Record<string, string>>({});
  const [costImportMessage, setCostImportMessage] = useState("");
  const [feeRates, setFeeRates] = useState<Record<string, string>>({});
  const [fixedFees, setFixedFees] = useState<Record<string, string>>({});

  const products = useMemo(() => {
    if (!report) return [];
    const orderTotals = new Map<string, number>();
    for (const item of report.items) {
      if (!item.orderId) continue;
      const orderKey = `${item.currency}:${item.orderId}`;
      orderTotals.set(orderKey, cents((orderTotals.get(orderKey) ?? 0) + item.itemPrice * item.quantity));
    }

    const groups = new Map<string, ProductSummary>();
    for (const item of report.items) {
      const identity = item.sku ? `sku:${normalizeText(item.sku)}` : `title:${normalizeText(item.product)}`;
      const key = `${item.currency}:${identity}`;
      const current = groups.get(key) ?? {
        key,
        product: item.product,
        sku: item.sku,
        currency: item.currency,
        itemRows: 0,
        units: 0,
        itemValue: 0,
        orderFeeShare: 0,
        unlinkedOrderRows: 0,
        orders: new Set<string>(),
      };
      current.itemRows += 1;
      current.units += item.quantity;
      current.itemValue = cents(current.itemValue + item.itemPrice * item.quantity);
      if (!current.sku && item.sku) current.sku = item.sku;
      if (!current.product && item.product) current.product = item.product;
      if (item.orderId) {
        current.orders.add(item.orderId);
        const orderTotal = orderTotals.get(`${item.currency}:${item.orderId}`) ?? 0;
        if (orderTotal > 0) current.orderFeeShare += (item.itemPrice * item.quantity) / orderTotal;
      } else current.unlinkedOrderRows += 1;
      groups.set(key, current);
    }
    return [...groups.values()].sort((a, b) =>
      a.currency.localeCompare(b.currency) || b.itemValue - a.itemValue || a.product.localeCompare(b.product),
    );
  }, [report]);

  const estimates = useMemo(() => products.map((item) => {
    const unitCost = parseMoney(unitCosts[item.key] ?? "");
    const feeRate = parsePercent(feeRates[item.currency] ?? "");
    const fixedFee = report?.hasOrderId ? parseMoney(fixedFees[item.currency] ?? "") : 0;
    const productCosts = unitCost === null ? null : cents(unitCost * item.units);
    const variableFees = feeRate === null ? null : cents(item.itemValue * feeRate / 100);
    const orderFees = fixedFee === null || (fixedFee > 0 && item.unlinkedOrderRows > 0) ? null : cents(fixedFee * item.orderFeeShare);
    const complete = productCosts !== null && variableFees !== null && orderFees !== null;
    const contribution = complete ? cents(item.itemValue - productCosts - variableFees - orderFees) : null;
    return { ...item, unitCost, productCosts, variableFees, orderFees, contribution, margin: contribution === null || item.itemValue === 0 ? null : (contribution / item.itemValue) * 100 };
  }), [products, unitCosts, feeRates, fixedFees, report?.hasOrderId]);

  const estimateTotalsByCurrency = useMemo(() => {
    const totals = new Map<string, { sales: number; fees: number; contribution: number; feesComplete: boolean; contributionComplete: boolean }>();
    for (const item of estimates) {
      const current = totals.get(item.currency) ?? { sales: 0, fees: 0, contribution: 0, feesComplete: true, contributionComplete: true };
      current.sales = cents(current.sales + item.itemValue);
      if (item.variableFees !== null && item.orderFees !== null) current.fees = cents(current.fees + item.variableFees + item.orderFees);
      else current.feesComplete = false;
      if (item.contribution !== null) current.contribution = cents(current.contribution + item.contribution);
      else current.contributionComplete = false;
      totals.set(item.currency, current);
    }
    return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [estimates]);

  const setReportInputs = (nextReport: SalesReport) => {
    setReport(nextReport);
    setIsSample(false);
    setUnitCosts({});
    setCostImportMessage("");
    const currencies = [...new Set(nextReport.items.map((item) => item.currency))];
    setFeeRates(Object.fromEntries(currencies.map((currency) => [currency, ""])));
    setFixedFees(Object.fromEntries(currencies.map((currency) => [currency, ""])));
  };

  const totalsByCurrency = useMemo(() => {
    const totals = new Map<string, number>();
    for (const item of report?.items ?? []) {
      totals.set(item.currency, cents((totals.get(item.currency) ?? 0) + item.itemPrice * item.quantity));
    }
    return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [report]);

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setReport(null);
    setIsReading(true);
    try {
      if (file.size > MAX_FILE_BYTES) {
        throw new Error("This file is over 10 MB. Export a smaller date range and try again.");
      }
      setReportInputs(parseOrderItems(await file.text()));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The CSV could not be read. Check the file and try again.");
    } finally {
      setIsReading(false);
    }
  };

  const onFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    void readFile(file);
  };

  const onCostFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file || !products.length) return;
    setError("");
    setCostImportMessage("");
    void (async () => {
      try {
        if (file.size > MAX_FILE_BYTES) throw new Error("This cost file is over 10 MB. Use a smaller file and try again.");
        const imported = parseUnitCostCsv(await file.text(), products);
        setUnitCosts((current) => ({ ...current, ...imported.unitCosts }));
        setCostImportMessage(`Imported costs for ${imported.matchedProducts} product${imported.matchedProducts === 1 ? "" : "s"}.${imported.unmatchedRows > 0 ? ` ${imported.unmatchedRows} cost row${imported.unmatchedRows === 1 ? " did" : "s did"} not match this sales report.` : ""}`);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "The cost CSV could not be read. Check the file and try again.");
      }
    })();
  };

  const loadSample = () => {
    const sample = [
      "Sale Date,Order ID,Item Name,SKU,Quantity,Price,Currency",
      "2026-09-01,1001,Silver Moon Necklace,MOON-001,2,24.00,USD",
      "2026-09-02,1002,Silver Moon Necklace,MOON-001,1,24.00,USD",
      "2026-09-03,1003,Personalized Gift Box,GIFT-004,1,18.50,USD",
      "2026-09-03,1003,Silver Moon Necklace,MOON-001,1,24.00,USD",
      "2026-09-05,1004,Handmade Clay Earrings,CLAY-010,2,16.00,USD",
    ].join("\r\n");
    setReportInputs(parseOrderItems(sample));
    setUnitCosts({
      "USD:sku:moon-001": "7.50",
      "USD:sku:gift-004": "6.00",
      "USD:sku:clay-010": "4.00",
    });
    setFeeRates({ USD: "10" });
    setFixedFees({ USD: "0.25" });
    setIsSample(true);
    setError("");
  };

  const downloadReport = () => {
    if (!estimates.length || !report) return;
    const headers = ["Product", "SKU", "Currency", "Item rows", "Units", "Orders", "Item value in export", "Unit cost", "Estimated variable fee rate %", "Estimated variable fees", "Estimated fixed order fees allocated", "Estimated contribution"];
    const rows = estimates.map((item) => [
      item.product,
      item.sku,
      item.currency,
      String(item.itemRows),
      report.hasQuantity ? String(item.units) : "",
      report.hasOrderId ? String(item.orders.size) : "",
      cents(item.itemValue).toFixed(2),
      item.unitCost === null ? "" : item.unitCost.toFixed(2),
      feeRates[item.currency] ?? "",
      item.variableFees === null ? "" : item.variableFees.toFixed(2),
      item.orderFees === null ? "" : item.orderFees.toFixed(2),
      item.contribution === null ? "" : item.contribution.toFixed(2),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `etsy-profit-by-sku-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCostTemplate = () => {
    if (!products.length) return;
    const rows = products.map((item) => [item.sku, item.product, item.currency, unitCosts[item.key] ?? ""]);
    const csv = [["SKU", "Product", "Currency", "Unit Cost"], ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `etsy-unit-cost-template-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setReport(null);
    setIsSample(false);
    setError("");
    setUnitCosts({});
    setCostImportMessage("");
    setFeeRates({});
    setFixedFees({});
  };

  return (
    <section id="sales-csv-analyzer" aria-labelledby="sales-csv-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Free · Private · No sign-in</p>
          <h2 id="sales-csv-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Estimate contribution by Etsy product or SKU</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Import sold items, add your cost per unit and fee assumptions, then compare estimated contribution across products. The report is calculated in this browser.</p>
        </div>
        {report && <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">Clear report</button>}
      </div>

      {report && isSample && <p role="status" className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-950">Demo data and example costs/fees are shown. Replace them with your own CSV and assumptions before using any result.</p>}

      {!report ? (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-[#fbfaf6] p-5 text-center sm:p-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-900" aria-hidden="true">↥</div>
          <p className="mt-4 font-semibold text-stone-900">Choose an Etsy Order Items CSV</p>
          <p className="mt-1 text-xs text-stone-500">CSV up to 10 MB · one shop and one export period</p>
          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
            {isReading ? "Reading file…" : "Choose CSV"}
            <input type="file" accept=".csv,text/csv" disabled={isReading} onChange={onFileSelected} className="sr-only" aria-label="Choose Etsy Order Items CSV file" />
          </label>
          <div className="mt-4">
            <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Try a sample profit report</button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric value={String(report.items.length)} label="item rows included" />
            <Metric value={report.hasQuantity ? formatNumber(report.items.reduce((total, item) => total + item.quantity, 0)) : "Not in this file"} label={report.hasQuantity ? "units in the export" : "quantity column"} />
            <Metric value={report.hasOrderId ? formatNumber(new Set(report.items.map((item) => item.orderId).filter(Boolean)).size) : "Not in this file"} label={report.hasOrderId ? "distinct order IDs" : "order ID column"} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={downloadReport} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">Download profit by SKU CSV</button>
          </div>

          <div className="mt-5 rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4">
            <h3 className="font-semibold text-stone-950">Estimated product results</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {estimateTotalsByCurrency.map(([currency, totals]) => (
                <div key={currency} className="rounded-xl border border-stone-200 bg-white p-4">
                  <p className="text-sm font-semibold text-stone-900">{currency === "Unknown" ? "Currency not identified" : currency}</p>
                  <dl className="mt-2 space-y-1 text-sm text-stone-700">
                    <div className="flex justify-between gap-3"><dt>Item value in export</dt><dd className="font-semibold tabular-nums">{formatCurrency(totals.sales, currency)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Estimated platform fees</dt><dd className="font-semibold tabular-nums">{totals.feesComplete ? formatCurrency(totals.fees, currency) : "Add fee assumptions"}</dd></div>
                    <div className="flex justify-between gap-3 border-t border-stone-100 pt-1"><dt>Estimated contribution</dt><dd className="font-semibold tabular-nums">{totals.contributionComplete ? formatCurrency(totals.contribution, currency) : "Add all unit costs and fees"}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </div>

          <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5" aria-labelledby="profit-assumptions-heading">
            <h3 id="profit-assumptions-heading" className="font-semibold text-stone-950">Set your costs and fee assumptions</h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">Enter your all-in cost to make and fulfill one item, plus the effective Etsy fee rate and any fixed processing fee per order for each currency. Nothing is guessed for you.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {totalsByCurrency.map(([currency]) => (
                <fieldset key={currency} className="rounded-xl border border-stone-200 bg-[#fbfaf6] p-4">
                  <legend className="px-1 text-sm font-semibold text-stone-900">{currency === "Unknown" ? "Unidentified currency" : currency}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium leading-5 text-stone-700">Effective percentage fees
                      <span className="mt-1 flex items-center rounded-lg border border-stone-300 bg-white px-3">
                        <input type="number" min="0" max="100" step="0.1" inputMode="decimal" value={feeRates[currency] ?? ""} onChange={(event) => setFeeRates((current) => ({ ...current, [currency]: event.target.value }))} placeholder="e.g. 10" className="w-full border-0 bg-transparent py-2 text-sm text-stone-950 outline-none" aria-label={`Effective percentage fees for ${currency}`} />
                        <span className="text-stone-500">%</span>
                      </span>
                    </label>
                    {report.hasOrderId ? (
                      <label className="text-xs font-medium leading-5 text-stone-700">Fixed fee per order
                        <input type="text" inputMode="decimal" value={fixedFees[currency] ?? ""} onChange={(event) => setFixedFees((current) => ({ ...current, [currency]: event.target.value }))} placeholder="e.g. 0.25" className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-950 outline-none focus:border-emerald-700" aria-label={`Fixed fee per order for ${currency}`} />
                      </label>
                    ) : (
                      <p className="self-end text-xs leading-5 text-amber-900">This export has no order ID, so fixed fees per order can&apos;t be allocated.</p>
                    )}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>

          <section className="mt-4 rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4 sm:p-5" aria-labelledby="cost-import-heading">
            <h3 id="cost-import-heading" className="font-semibold text-stone-950">Add unit costs from a sheet</h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">For a large catalogue, download the template, fill in your unit cost for each SKU, and import it. The CSV needs a <strong>Unit Cost</strong> column and either <strong>SKU</strong> or <strong>Product</strong>; include <strong>Currency</strong> when your report has more than one currency.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={downloadCostTemplate} className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-stone-500">Download unit cost template</button>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
                Import unit cost CSV
                <input type="file" accept=".csv,text/csv" onChange={onCostFileSelected} className="sr-only" aria-label="Import unit cost CSV" />
              </label>
            </div>
            {costImportMessage && <p role="status" className="mt-3 text-sm leading-6 text-emerald-900">{costImportMessage}</p>}
          </section>

          {(report.skippedRows > 0 || report.assumedQuantityRows > 0 || !report.hasQuantity || !report.hasOrderId || report.unlinkedOrderRows > 0) && (
            <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              {report.skippedRows > 0 && `${report.skippedRows} non-empty row${report.skippedRows === 1 ? " was" : "s were"} skipped because a product title or readable item price was missing. `}
              {report.assumedQuantityRows > 0 && `Quantity was assumed to be 1 for ${report.assumedQuantityRows} row${report.assumedQuantityRows === 1 ? "" : "s"} with a missing or unreadable quantity. `}
              {!report.hasQuantity && "This export has no quantity column, so cost estimates assume one unit per item row."}
              {!report.hasOrderId && "This export has no order ID column, so fixed fees per order are not included."}
              {report.hasOrderId && report.unlinkedOrderRows > 0 && `Fixed order fees cannot be allocated to ${report.unlinkedOrderRows} item row${report.unlinkedOrderRows === 1 ? "" : "s"} without an order ID.`}
            </p>
          )}

          <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 text-right font-semibold">Item rows</th>
                  <th className="px-4 py-3 text-right font-semibold">{report.hasQuantity ? "Units" : "Quantity"}</th>
                  <th className="px-4 py-3 text-right font-semibold">{report.hasOrderId ? "Orders" : "Order IDs"}</th>
                  <th className="px-4 py-3 text-right font-semibold">Item value</th>
                  <th className="px-4 py-3 text-right font-semibold">All-in cost / unit</th>
                  <th className="px-4 py-3 text-right font-semibold">Estimated fees</th>
                  <th className="px-4 py-3 text-right font-semibold">Contribution</th>
                  <th className="px-4 py-3 text-right font-semibold">Margin</th>
                </tr>
              </thead>
              <tbody>
                {estimates.map((item) => (
                  <tr key={item.key} className="border-t border-stone-200">
                    <td className="max-w-[24rem] px-4 py-3 font-medium text-stone-900">{item.product}</td>
                    <td className="px-4 py-3 text-stone-600">{item.sku || "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{item.itemRows}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{report.hasQuantity ? item.units : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{report.hasOrderId ? item.orders.size : "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">{formatCurrency(item.itemValue, item.currency)}</td>
                    <td className="px-4 py-3 text-right">
                      <input type="text" inputMode="decimal" value={unitCosts[item.key] ?? ""} onChange={(event) => setUnitCosts((current) => ({ ...current, [item.key]: event.target.value }))} placeholder="Enter cost" className="w-28 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-right text-sm tabular-nums text-stone-950 outline-none focus:border-emerald-700" aria-label={`All-in unit cost for ${item.product}`} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{item.variableFees === null || item.orderFees === null ? "—" : formatCurrency(item.variableFees + item.orderFees, item.currency)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">{item.contribution === null ? "Add inputs" : formatCurrency(item.contribution, item.currency)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{item.margin === null ? "—" : `${item.margin.toFixed(1)}%`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{error}</p>}

      <div className="mt-6 border-t border-stone-100 pt-5">
        <p className="text-sm font-semibold text-stone-900">Download the right report in Etsy</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-600">
          <li>Open Shop Manager → Settings → Options → Download Data.</li>
          <li>Under Orders, choose <strong>Order Items</strong>, then select a month or year and download the CSV.</li>
          <li>Choose that file above. You can run a separate report for another date range.</li>
        </ol>
        <a href="https://help.etsy.com/hc/en-us/articles/360000343328-How-to-Download-a-Spreadsheet-of-Your-Sold-Transactions" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Etsy’s sold transaction export instructions ↗</a>
      </div>

      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
        This is a planning estimate, not accounting profit or a reconciliation of your Etsy account. The percentage fee is applied to item value in the export, which may exclude buyer-paid shipping and taxes; fixed fees are allocated across items in each order by item value. Your all-in unit cost should include the costs you want to account for, such as materials, labor, packaging and seller-paid postage. Discounts, refunds, cancellations, ads and other charges can change actual results. Check your Payment account and current Etsy guidance before making financial decisions.
      </div>
      <p className="mt-4 text-xs leading-5 text-stone-500">The file is read in this browser and is not uploaded. Buyer names and addresses are not included in the summary or downloaded report. Do not share or upload a customer file to another service without checking its privacy terms.</p>
    </section>
  );
}

function parseOrderItems(csvText: string): SalesReport {
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) throw new Error("The file is empty. Choose an Etsy Order Items CSV export.");
  const rows = parseCsv(cleanText, detectDelimiter(cleanText)).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("The CSV has a header but no item rows.");

  const headers = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headers, ["item", "itemname", "itemtitle", "listingtitle", "product", "productname", "titulo", "titulodelarticulo", "nombredearticulo", "articulo"]);
  const priceIndex = findColumn(headers, ["price", "itemprice", "unitprice", "itemunitprice", "precio", "preciodelarticulo", "precioarticulo"]);
  const skuIndex = findColumn(headers, ["sku", "itemsku", "productsku", "listingsku", "numerosku", "referencia"]);
  const quantityIndex = findColumn(headers, ["quantity", "qty", "itemquantity", "cantidad", "cantidaddearticulos", "unidades"]);
  const orderIndex = findColumn(headers, ["orderid", "ordernumber", "receiptid", "receipt", "numerodepedido", "pedido"]);
  const currencyIndex = findColumn(headers, ["currency", "currencycode", "itemcurrency", "moneda", "divisa", "codigodedivisa"]);

  if (titleIndex < 0 || priceIndex < 0) {
    throw new Error("I couldn’t find both an item title and price column. Download the Order Items CSV from Etsy, which includes item titles and prices.");
  }

  const itemRows = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (itemRows.length > MAX_ITEM_ROWS) throw new Error(`This file has more than ${MAX_ITEM_ROWS.toLocaleString()} rows. Export a smaller date range and try again.`);

  let skippedRows = 0;
  let assumedQuantityRows = 0;
  const items: SaleItem[] = [];
  for (const row of itemRows) {
    const product = row[titleIndex]?.trim() ?? "";
    const rawPrice = row[priceIndex]?.trim() ?? "";
    if (!product || !rawPrice) {
      skippedRows += 1;
      continue;
    }
    const parsedPrice = parseMoney(rawPrice);
    if (parsedPrice === null) {
      skippedRows += 1;
      continue;
    }
    const rawQuantity = quantityIndex >= 0 ? row[quantityIndex]?.trim() ?? "" : "";
    const parsedQuantity = quantityIndex >= 0 ? parseQuantity(rawQuantity) : null;
    if (quantityIndex >= 0 && parsedQuantity === null) assumedQuantityRows += 1;
    items.push({
      product,
      sku: skuIndex >= 0 ? row[skuIndex]?.trim() ?? "" : "",
      orderId: orderIndex >= 0 ? row[orderIndex]?.trim() ?? "" : "",
      quantity: parsedQuantity ?? 1,
      itemPrice: parsedPrice,
      currency: normalizeCurrency(currencyIndex >= 0 ? row[currencyIndex] ?? "" : "", rawPrice),
    });
  }

  if (items.length === 0) throw new Error("No readable item rows were found. Check that this is an Etsy Order Items CSV and that it includes item titles and prices.");
  return { items, hasQuantity: quantityIndex >= 0, hasOrderId: orderIndex >= 0, unlinkedOrderRows: items.filter((item) => !item.orderId).length, skippedRows, assumedQuantityRows };
}

function parseUnitCostCsv(csvText: string, products: ProductSummary[]): CostImport {
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) throw new Error("The cost file is empty. Use the downloaded unit cost template.");
  const rows = parseCsv(cleanText, detectDelimiter(cleanText)).filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length < 2) throw new Error("The cost file has a header but no product rows.");

  const headers = rows[0].map(normalizeHeader);
  const skuIndex = findColumn(headers, ["sku", "itemsku", "productsku", "listingsku", "referencia"]);
  const productIndex = findColumn(headers, ["product", "productname", "item", "itemname", "title", "listingtitle", "producto", "nombredearticulo"]);
  const costIndex = findColumn(headers, ["unitcost", "costperunit", "cost", "unitproductioncost", "costperitem", "costperproduct", "costofgoods"]);
  const currencyIndex = findColumn(headers, ["currency", "currencycode", "moneda", "divisa"]);
  if (costIndex < 0 || (skuIndex < 0 && productIndex < 0)) {
    throw new Error("The cost CSV needs a Unit Cost column and either an SKU or Product column. Download the template to see the format.");
  }

  const reportCurrencies = new Set(products.map((product) => product.currency));
  if (reportCurrencies.size > 1 && currencyIndex < 0) {
    throw new Error("This sales report has multiple currencies. Add a Currency column to the cost CSV so costs are matched without converting amounts.");
  }

  const costs = new Map<string, string>();
  for (const row of rows.slice(1)) {
    const sku = skuIndex >= 0 ? row[skuIndex]?.trim() ?? "" : "";
    const product = productIndex >= 0 ? row[productIndex]?.trim() ?? "" : "";
    const rawCost = row[costIndex]?.trim() ?? "";
    if ((!sku && !product) || !rawCost) continue;
    const cost = parseMoney(rawCost);
    if (cost === null) continue;
    const currencyValue = currencyIndex >= 0 ? row[currencyIndex]?.trim() ?? "" : "";
    if (currencyIndex >= 0 && reportCurrencies.size > 1 && !currencyValue) {
      throw new Error("Add a currency code to every cost row. This sales report includes more than one currency.");
    }
    const currency = currencyValue ? normalizeCurrency(currencyValue, rawCost) : "*";
    const identity = sku ? `sku:${normalizeText(sku)}` : `title:${normalizeText(product)}`;
    costs.set(`${currency}:${identity}`, cost.toFixed(2));
  }
  if (costs.size === 0) throw new Error("No readable unit costs were found. Check that each row has an SKU or product name and a non-negative Unit Cost.");

  const imported: Record<string, string> = {};
  const matchedKeys = new Set<string>();
  for (const item of products) {
    const identity = item.sku ? `sku:${normalizeText(item.sku)}` : `title:${normalizeText(item.product)}`;
    const exactKey = `${item.currency}:${identity}`;
    const key = costs.has(exactKey) ? exactKey : costs.has(`*:${identity}`) ? `*:${identity}` : "";
    if (!key) continue;
    imported[item.key] = costs.get(key) ?? "";
    matchedKeys.add(key);
  }
  const matchedProducts = Object.keys(imported).length;
  if (matchedProducts === 0) throw new Error("No cost rows matched this sales report. Check that SKUs or product names match the Etsy Order Items CSV.");
  return { unitCosts: imported, matchedProducts, unmatchedRows: [...costs.keys()].filter((key) => !matchedKeys.has(key)).length };
}

function detectDelimiter(text: string): string {
  const counts = new Map([[",", 0], [";", 0], ["\t", 0]]);
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (inQuotes && text[index + 1] === '"') index += 1;
      else inQuotes = !inQuotes;
    } else if ((character === "\n" || character === "\r") && !inQuotes) break;
    else if (!inQuotes && counts.has(character)) counts.set(character, (counts.get(character) ?? 0) + 1);
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
      } else inQuotes = !inQuotes;
    } else if (character === delimiter && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (inQuotes) throw new Error("The CSV contains an unclosed quoted field. Re-download it from Etsy and try again.");
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function normalizeHeader(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findColumn(headers: string[], aliases: string[]): number {
  return headers.findIndex((header) => aliases.includes(header));
}

function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function parseQuantity(value: string): number | null {
  const cleaned = value.trim().replace(/[\s,]/g, "");
  const quantity = Number.parseInt(cleaned, 10);
  return Number.isInteger(quantity) && quantity > 0 ? quantity : null;
}

function parseMoney(value: string): number | null {
  let normalized = value.trim().replace(/\u00a0/g, "").replace(/[^0-9,.-]/g, "");
  if (!normalized || !/[0-9]/.test(normalized)) return null;
  const comma = normalized.lastIndexOf(",");
  const period = normalized.lastIndexOf(".");
  if (comma >= 0 && period >= 0) {
    if (comma > period) normalized = normalized.replace(/\./g, "").replace(",", ".");
    else normalized = normalized.replace(/,/g, "");
  } else if (comma >= 0) {
    const decimalDigits = normalized.length - comma - 1;
    if (decimalDigits === 3) normalized = normalized.replace(/,/g, "");
    else normalized = normalized.replace(",", ".");
  } else if (period >= 0 && normalized.indexOf(".") !== period) {
    const decimalDigits = normalized.length - period - 1;
    if (decimalDigits === 3) normalized = normalized.replace(/\./g, "");
    else normalized = normalized.slice(0, period).replace(/\./g, "") + normalized.slice(period);
  }
  const amount = Number.parseFloat(normalized);
  return Number.isFinite(amount) && amount >= 0 ? cents(amount) : null;
}

function parsePercent(value: string): number | null {
  if (!value.trim()) return null;
  const normalized = value.trim().replace(",", ".");
  const rate = Number.parseFloat(normalized);
  return Number.isFinite(rate) && rate >= 0 && rate <= 100 ? rate : null;
}

function normalizeCurrency(columnValue: string, priceValue: string): string {
  const value = columnValue.trim().toUpperCase();
  const candidates = ["USD", "EUR", "GBP", "CAD", "AUD", "NZD", "JPY", "CHF", "SEK", "NOK", "DKK", "PLN", "INR", "MXN", "BRL", "TRY", "SGD", "HKD", "ILS", "ZAR"];
  for (const code of candidates) if (value.includes(code)) return code;
  const price = priceValue.trim();
  if (price.includes("€")) return "EUR";
  if (price.includes("£")) return "GBP";
  if (price.includes("¥")) return "JPY";
  if (price.includes("$")) return "USD";
  return "Unknown";
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === "Unknown") return amount.toFixed(2);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function cents(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toCsvCell(value: string): string {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4">
      <p className="text-2xl font-semibold tracking-tight text-stone-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-stone-600">{label}</p>
    </div>
  );
}
