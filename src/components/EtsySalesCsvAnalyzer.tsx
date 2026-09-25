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
  orders: Set<string>;
};

type SalesReport = {
  items: SaleItem[];
  hasQuantity: boolean;
  hasOrderId: boolean;
  skippedRows: number;
  assumedQuantityRows: number;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_ITEM_ROWS = 100_000;

export default function EtsySalesCsvAnalyzer() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const products = useMemo(() => {
    if (!report) return [];
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
        orders: new Set<string>(),
      };
      current.itemRows += 1;
      current.units += item.quantity;
      current.itemValue = cents(current.itemValue + item.itemPrice * item.quantity);
      if (!current.sku && item.sku) current.sku = item.sku;
      if (!current.product && item.product) current.product = item.product;
      if (item.orderId) current.orders.add(item.orderId);
      groups.set(key, current);
    }
    return [...groups.values()].sort((a, b) =>
      a.currency.localeCompare(b.currency) || b.itemValue - a.itemValue || a.product.localeCompare(b.product),
    );
  }, [report]);

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
      setReport(parseOrderItems(await file.text()));
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

  const loadSample = () => {
    const sample = [
      "Sale Date,Order ID,Item Name,SKU,Quantity,Price,Currency",
      "2026-09-01,1001,Silver Moon Necklace,MOON-001,2,24.00,USD",
      "2026-09-02,1002,Silver Moon Necklace,MOON-001,1,24.00,USD",
      "2026-09-03,1003,Personalized Gift Box,GIFT-004,1,18.50,USD",
      "2026-09-03,1003,Silver Moon Necklace,MOON-001,1,24.00,USD",
      "2026-09-05,1004,Handmade Clay Earrings,CLAY-010,2,16.00,USD",
    ].join("\r\n");
    setReport(parseOrderItems(sample));
    setError("");
  };

  const downloadReport = () => {
    if (!products.length || !report) return;
    const headers = ["Product", "SKU", "Currency", "Item rows", "Units", "Orders", "Item value before fees and discounts"];
    const rows = products.map((item) => [
      item.product,
      item.sku,
      item.currency,
      String(item.itemRows),
      report.hasQuantity ? String(item.units) : "",
      report.hasOrderId ? String(item.orders.size) : "",
      cents(item.itemValue).toFixed(2),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `etsy-order-items-summary-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setReport(null);
    setError("");
  };

  return (
    <section id="sales-csv-analyzer" aria-labelledby="sales-csv-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">Free · Private · No sign-in</p>
          <h2 id="sales-csv-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">Summarize sales from an Etsy Order Items CSV</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">Group sold item rows by SKU or title and compare item quantities and prices. The report is calculated in this browser.</p>
        </div>
        {report && <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">Clear report</button>}
      </div>

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
            <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">Try a sample report</button>
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
            <button type="button" onClick={downloadReport} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">Download product summary CSV</button>
          </div>

          <div className="mt-5 rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4">
            <h3 className="font-semibold text-stone-950">Item value in this export</h3>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-700">
              {totalsByCurrency.map(([currency, amount]) => (
                <p key={currency}><span className="font-semibold">{formatCurrency(amount, currency)}</span> <span className="text-stone-600">{currency === "Unknown" ? "currency not identified" : currency}</span></p>
              ))}
            </div>
          </div>

          {(report.skippedRows > 0 || report.assumedQuantityRows > 0) && (
            <p role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
              {report.skippedRows > 0 && `${report.skippedRows} non-empty row${report.skippedRows === 1 ? " was" : "s were"} skipped because a product title or readable item price was missing. `}
              {report.assumedQuantityRows > 0 && `Quantity was assumed to be 1 for ${report.assumedQuantityRows} row${report.assumedQuantityRows === 1 ? "" : "s"} with a blank quantity.`}
            </p>
          )}

          <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 text-right font-semibold">Item rows</th>
                  <th className="px-4 py-3 text-right font-semibold">{report.hasQuantity ? "Units" : "Quantity"}</th>
                  <th className="px-4 py-3 text-right font-semibold">{report.hasOrderId ? "Orders" : "Order IDs"}</th>
                  <th className="px-4 py-3 text-right font-semibold">Item value</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.key} className="border-t border-stone-200">
                    <td className="max-w-[24rem] px-4 py-3 font-medium text-stone-900">{item.product}</td>
                    <td className="px-4 py-3 text-stone-600">{item.sku || "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{item.itemRows}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{report.hasQuantity ? item.units : "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{report.hasOrderId ? item.orders.size : "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">{formatCurrency(item.itemValue, item.currency)}</td>
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
        This is item value from the selected CSV, not profit or an accounting report. It does not subtract discounts, fees, shipping, taxes, cancellations or refunds. Etsy’s order totals and Stats revenue can use different rules. Check your Payment account and Etsy’s current guidance before making financial decisions.
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
  return { items, hasQuantity: quantityIndex >= 0, hasOrderId: orderIndex >= 0, skippedRows, assumedQuantityRows };
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
