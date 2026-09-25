"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";

type Locale = "en" | "es";
type Listing = { title: string; sku: string; quantity: number };
type SoldItem = { title: string; sku: string; quantity: number; rows: number };
type ListingsFile = { fileName: string; rows: Listing[]; skippedRows: number };
type SalesFiles = { fileNames: string[]; rows: SoldItem[]; assumedQuantityRows: number; skippedRows: number };
type ListingGroup = {
  key: string;
  title: string;
  sku: string;
  quantity: number;
  unitsSold: number;
  orderRows: number;
};
type PlanRow = ListingGroup & {
  dailySales: number;
  stockCoverDays: number | null;
  suggestedRestock: number;
};

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 30 * 1024 * 1024;
const MAX_COMBINED_ROWS = 100_000;

const copy = {
  en: {
    eyebrow: "Free Etsy inventory planner · Private in your browser",
    heading: "Plan Etsy restocks from your own shop exports",
    intro: "Combine an active listings CSV with one or more Order Items exports. See which listings may need restocking based on the current quantity and sales in the period you choose.",
    listingFile: "Active listings CSV",
    orderFiles: "Order Items CSV files",
    listingHint: "The export needs title and quantity columns. SKU is recommended for more reliable matching.",
    ordersHint: "Select one or more non-overlapping Etsy order exports for the same shop.",
    chooseFile: "Choose listings CSV",
    chooseFiles: "Choose order CSVs",
    loaded: "Loaded",
    sample: "Try sample data",
    clear: "Clear files",
    loading: "Reading files…",
    period: "Sales period covered",
    days: "days",
    lead: "Restock lead time",
    buffer: "Extra safety buffer",
    settingsNote: "Use the number of days covered by the order exports. The tool estimates average daily sales; it does not predict future demand.",
    wait: "Choose both exports to see your restock report.",
    listings: "active listing groups",
    soldProducts: "with recorded sales",
    restockCount: "may need restocking",
    unmatchedUnits: "unmatched sold units",
    download: "Download restock CSV",
    product: "Product",
    sku: "SKU",
    currentStock: "Current stock",
    soldUnits: "Units sold",
    perDay: "Units / day",
    stockDays: "Stock cover",
    suggested: "Suggested restock",
    noSales: "No sales in period",
    restockSoon: "Restock soon",
    stockOk: "Stock looks sufficient",
    noSalesShort: "No sales",
    daysShort: "days",
    noSalesWarning: "No recorded units in this export period is not proof that a product will never sell. Check the period and your Etsy shop before changing stock.",
    matchingNote: "Items are matched by SKU first, then by an exact normalized title. Title matches can fail after edits or when listing names differ; unmatched rows are shown in the summary.",
    skippedListings: "listing rows could not be used because the title or quantity was unreadable.",
    skippedSales: "order rows were skipped because a product name was missing.",
    assumedQuantity: "order rows had no readable quantity, so each was counted as 1 unit.",
    overlapWarning: "If exports overlap in dates, the same orders may be counted more than once.",
    privacy: "Both files stay in this browser. Nothing is uploaded, and buyer names, addresses and order IDs are not used in the report.",
    why: "How the restock estimate works",
    formula: "Average daily sales = units in the uploaded orders ÷ sales-period days. Suggested restock = average daily sales × (lead time + safety buffer) − current stock, rounded up. The estimate is a planning aid, not an automatic inventory update.",
  },
  es: {
    eyebrow: "Planificador gratis de inventario Etsy · Privado en tu navegador",
    heading: "Planifica reposiciones de Etsy con tus propias exportaciones",
    intro: "Combina el CSV de anuncios activos con uno o varios archivos Order Items. Detecta qué anuncios podrían necesitar reposición según las existencias actuales y las ventas del periodo elegido.",
    listingFile: "CSV de anuncios activos",
    orderFiles: "Archivos CSV Order Items",
    listingHint: "La exportación debe incluir título y cantidad. El SKU mejora la coincidencia.",
    ordersHint: "Elige uno o varios archivos de pedidos de la misma tienda, sin periodos solapados.",
    chooseFile: "Elegir CSV de anuncios",
    chooseFiles: "Elegir CSV de pedidos",
    loaded: "Cargado",
    sample: "Probar datos de ejemplo",
    clear: "Borrar archivos",
    loading: "Leyendo archivos…",
    period: "Periodo que cubren las ventas",
    days: "días",
    lead: "Plazo de reposición",
    buffer: "Margen de seguridad",
    settingsNote: "Indica cuántos días abarcan las exportaciones de pedidos. La herramienta calcula la media diaria; no predice la demanda futura.",
    wait: "Elige las dos exportaciones para ver el informe de reposición.",
    listings: "grupos de anuncios activos",
    soldProducts: "con ventas registradas",
    restockCount: "podrían necesitar reposición",
    unmatchedUnits: "unidades vendidas sin coincidencia",
    download: "Descargar CSV de reposición",
    product: "Producto",
    sku: "SKU",
    currentStock: "Existencias",
    soldUnits: "Unidades vendidas",
    perDay: "Unidades / día",
    stockDays: "Cobertura",
    suggested: "Reposición sugerida",
    noSales: "Sin ventas en el periodo",
    restockSoon: "Reponer pronto",
    stockOk: "Existencias suficientes",
    noSalesShort: "Sin ventas",
    daysShort: "días",
    noSalesWarning: "No registrar unidades en el periodo exportado no demuestra que un producto no vaya a venderse. Comprueba el periodo y tu tienda antes de cambiar el inventario.",
    matchingNote: "Los artículos se relacionan primero por SKU y después por título normalizado exacto. Los títulos pueden dejar de coincidir si se editaron; el resumen muestra las filas sin coincidencia.",
    skippedListings: "filas de anuncios no se pudieron usar porque faltaba un título o una cantidad legible.",
    skippedSales: "filas de pedidos se omitieron porque faltaba el nombre de un producto.",
    assumedQuantity: "filas de pedidos no tenían una cantidad legible; cada una cuenta como 1 unidad.",
    overlapWarning: "Si los periodos de los archivos se solapan, algunos pedidos podrían contarse más de una vez.",
    privacy: "Los dos archivos permanecen en este navegador. No se suben; el informe no usa nombres, direcciones ni números de pedido.",
    why: "Cómo se calcula la reposición",
    formula: "Ventas medias al día = unidades de los pedidos cargados ÷ días del periodo. Reposición sugerida = ventas medias × (plazo + margen de seguridad) − existencias actuales, redondeado hacia arriba. Es una ayuda para planificar, no una actualización automática del inventario.",
  },
} as const;

export default function EtsyRestockPlanner({ locale = "en" }: { locale?: Locale }) {
  const text = copy[locale];
  const [listingsFile, setListingsFile] = useState<ListingsFile | null>(null);
  const [salesFiles, setSalesFiles] = useState<SalesFiles | null>(null);
  const [periodDays, setPeriodDays] = useState(30);
  const [leadTimeDays, setLeadTimeDays] = useState(14);
  const [safetyDays, setSafetyDays] = useState(7);
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);

  const report = useMemo(() => {
    if (!listingsFile || !salesFiles) return null;
    return buildReport(listingsFile.rows, salesFiles.rows, periodDays, leadTimeDays, safetyDays);
  }, [listingsFile, salesFiles, periodDays, leadTimeDays, safetyDays]);
  const skippedListingRows = listingsFile?.skippedRows ?? 0;
  const skippedSalesRows = salesFiles?.skippedRows ?? 0;
  const assumedQuantityRows = salesFiles?.assumedQuantityRows ?? 0;

  const onListingsSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    setIsReading(true);
    try {
      checkFileSize(file, locale);
      setListingsFile(parseListings(await file.text(), file.name, locale));
    } catch (caught) {
      setListingsFile(null);
      setError(caught instanceof Error ? caught.message : "Could not read this listings file.");
    } finally {
      setIsReading(false);
    }
  };

  const onSalesSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (files.length === 0) return;
    setError("");
    setIsReading(true);
    try {
      if (files.length > 24) throw new Error(locale === "es" ? "Elige como máximo 24 archivos de pedidos." : "Choose up to 24 order files.");
      for (const file of files) checkFileSize(file, locale);
      if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_FILE_BYTES) {
        throw new Error(locale === "es"
          ? "Los archivos de pedidos superan los 30 MB en conjunto. Elige un periodo más corto."
          : "The selected order files exceed 30 MB combined. Choose a shorter period.");
      }
      const parsed = await Promise.all(files.map(async (file) => parseOrderItems(await file.text(), file.name, locale)));
      const rows = parsed.flatMap((item) => item.rows);
      if (rows.length > MAX_COMBINED_ROWS) throw new Error(locale === "es" ? "Los CSV combinados superan las 100.000 filas. Elige un periodo más corto." : "The combined CSVs have more than 100,000 rows. Choose a shorter period.");
      setSalesFiles({
        fileNames: parsed.flatMap((item) => item.fileNames),
        rows,
        assumedQuantityRows: parsed.reduce((total, item) => total + item.assumedQuantityRows, 0),
        skippedRows: parsed.reduce((total, item) => total + item.skippedRows, 0),
      });
    } catch (caught) {
      setSalesFiles(null);
      setError(caught instanceof Error ? caught.message : "Could not read these order files.");
    } finally {
      setIsReading(false);
    }
  };

  const loadSample = () => {
    setListingsFile(parseListings([
      "TITLE,SKU,QUANTITY,PRICE,CURRENCY",
      "Blue linen pouch,POUCH-BLUE,3,18.00,USD",
      "Red linen pouch,POUCH-RED,18,18.00,USD",
      "Blue linen scrunchie,SCRUNCH-BLUE,0,12.00,USD",
      "Personalized wedding favor,,8,7.00,USD",
      "Vintage brass bookmark,BOOK-BRASS,6,14.00,USD",
    ].join("\r\n"), "sample-active-listings.csv", locale));
    setSalesFiles({
      fileNames: ["sample-order-items.csv"],
      rows: parseOrderItems([
        "Sale Date,Order ID,Item Name,SKU,Quantity,Price,Currency",
        "2026-08-01,1001,Blue linen pouch,POUCH-BLUE,2,18.00,USD",
        "2026-08-03,1002,Blue linen pouch,POUCH-BLUE,1,18.00,USD",
        "2026-08-05,1003,Red linen pouch,POUCH-RED,2,18.00,USD",
        "2026-08-08,1004,Red linen pouch,POUCH-RED,1,18.00,USD",
        "2026-08-12,1005,Personalized wedding favor,,2,7.00,USD",
        "2026-08-20,1006,Unknown retired item,RETIRED-001,1,10.00,USD",
        "2026-08-30,1007,Blue linen pouch,POUCH-BLUE,4,18.00,USD",
      ].join("\r\n"), "sample-order-items.csv", locale).rows,
      assumedQuantityRows: 0,
      skippedRows: 0,
    });
    setPeriodDays(30);
    setLeadTimeDays(14);
    setSafetyDays(7);
    setError("");
  };

  const clear = () => {
    setListingsFile(null);
    setSalesFiles(null);
    setError("");
  };

  const downloadReport = () => {
    if (!report) return;
    const headers = locale === "es"
      ? [
          "Producto", "SKU", "Existencias actuales", "Unidades vendidas en el periodo", "Días del periodo",
          "Media de unidades por día", "Días estimados de cobertura", "Plazo de reposición en días",
          "Margen de seguridad en días", "Unidades sugeridas para reponer", "Filas de pedidos relacionadas",
        ]
      : [
          "Product", "SKU", "Current stock", "Units sold in period", "Sales period days",
          "Average units per day", "Estimated stock cover days", "Lead time days", "Safety buffer days",
          "Suggested restock units", "Order rows matched",
        ];
    const rows = report.rows.map((item) => [
      item.title,
      item.sku,
      String(item.quantity),
      String(item.unitsSold),
      String(periodDays),
      item.dailySales.toFixed(3),
      item.stockCoverDays === null ? "" : item.stockCoverDays.toFixed(1),
      String(leadTimeDays),
      String(safetyDays),
      String(item.suggestedRestock),
      String(item.orderRows),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = (locale === "es" ? "plan-de-reposicion-etsy-" : "etsy-restock-plan-") + new Date().toISOString().slice(0, 10) + ".csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section aria-labelledby="restock-tool-heading" className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-800">{text.eyebrow}</p>
          <h2 id="restock-tool-heading" className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">{text.heading}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{text.intro}</p>
        </div>
        {(listingsFile || salesFiles) && (
          <button type="button" onClick={clear} className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:border-stone-500">{text.clear}</button>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <UploadCard
          title={text.listingFile}
          hint={text.listingHint}
          choose={text.chooseFile}
          loaded={listingsFile?.fileName}
          disabled={isReading}
          onChange={onListingsSelected}
          multiple={false}
        />
        <UploadCard
          title={text.orderFiles}
          hint={text.ordersHint}
          choose={text.chooseFiles}
          loaded={salesFiles ? salesFiles.fileNames.join(", ") : undefined}
          disabled={isReading}
          onChange={onSalesSelected}
          multiple
        />
      </div>

      <div className="mt-4 grid gap-3 rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4 sm:grid-cols-3">
        <NumberField label={text.period} suffix={text.days} value={periodDays} min={1} max={3650} onChange={setPeriodDays} />
        <NumberField label={text.lead} suffix={text.days} value={leadTimeDays} min={0} max={365} onChange={setLeadTimeDays} />
        <NumberField label={text.buffer} suffix={text.days} value={safetyDays} min={0} max={90} onChange={setSafetyDays} />
      </div>
      <p className="mt-3 text-xs leading-5 text-stone-500">{text.settingsNote}</p>

      {isReading && <p role="status" className="mt-4 text-sm font-medium text-emerald-900">{text.loading}</p>}
      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900">{error}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button type="button" onClick={loadSample} className="text-sm font-semibold text-emerald-900 underline decoration-emerald-300 underline-offset-4 hover:decoration-emerald-800">{text.sample}</button>
        {listingsFile && <span className="text-xs text-stone-500">{text.loaded}: {listingsFile.rows.length} listings</span>}
        {salesFiles && <span className="text-xs text-stone-500">{text.loaded}: {salesFiles.rows.length} order rows</span>}
      </div>

      {!report ? (
        <p className="mt-6 rounded-xl border border-stone-200 bg-[#fbfaf6] px-4 py-4 text-sm text-stone-600">{text.wait}</p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric value={String(report.rows.length)} label={text.listings} />
            <Metric value={String(report.soldProducts)} label={text.soldProducts} />
            <Metric value={String(report.restockCount)} label={text.restockCount} />
            <Metric value={String(report.unmatchedUnits)} label={text.unmatchedUnits} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={downloadReport} className="rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-900">{text.download}</button>
          </div>
          <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs leading-5 text-sky-950">{text.matchingNote}</p>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">{text.noSalesWarning}</p>

          {(skippedListingRows > 0 || skippedSalesRows > 0 || assumedQuantityRows > 0) && (
            <p role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950">
              {skippedListingRows > 0 && skippedListingRows + " " + text.skippedListings + " "}
              {skippedSalesRows > 0 && skippedSalesRows + " " + text.skippedSales + " "}
              {assumedQuantityRows > 0 && assumedQuantityRows + " " + text.assumedQuantity}
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-stone-500">{text.overlapWarning}</p>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead className="bg-[#f7f6f0] text-xs uppercase tracking-wide text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">{text.product}</th>
                  <th className="px-4 py-3 font-semibold">{text.sku}</th>
                  <th className="px-4 py-3 text-right font-semibold">{text.currentStock}</th>
                  <th className="px-4 py-3 text-right font-semibold">{text.soldUnits}</th>
                  <th className="px-4 py-3 text-right font-semibold">{text.perDay}</th>
                  <th className="px-4 py-3 text-right font-semibold">{text.stockDays}</th>
                  <th className="px-4 py-3 text-right font-semibold">{text.suggested}</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((item) => (
                  <tr key={item.key} className="border-t border-stone-200">
                    <td className="max-w-[24rem] px-4 py-3 font-medium text-stone-900">{item.title}</td>
                    <td className="px-4 py-3 text-stone-600">{item.sku || "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{formatNumber(item.quantity, locale)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{formatNumber(item.unitsSold, locale)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{item.dailySales.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-700">{item.stockCoverDays === null ? text.noSalesShort : formatNumber(Math.floor(item.stockCoverDays), locale) + " " + text.daysShort}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">
                      <span>{formatNumber(item.suggestedRestock, locale)}</span>
                      <span className="ml-2 text-xs font-medium text-stone-500">{item.unitsSold === 0 ? text.noSales : item.suggestedRestock > 0 ? text.restockSoon : text.stockOk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-6 border-t border-stone-100 pt-5">
        <h3 className="text-sm font-semibold text-stone-900">{text.why}</h3>
        <p className="mt-2 text-xs leading-5 text-stone-600">{text.formula}</p>
        <p className="mt-3 text-xs leading-5 text-stone-500">{text.privacy}</p>
      </div>
    </section>
  );
}

function UploadCard({
  title, hint, choose, loaded, disabled, onChange, multiple,
}: {
  title: string;
  hint: string;
  choose: string;
  loaded?: string;
  disabled: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  multiple: boolean;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-[#fbfaf6] p-4">
      <p className="font-semibold text-stone-900">{title}</p>
      <p className="mt-1 min-h-10 text-xs leading-5 text-stone-500">{hint}</p>
      <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:border-emerald-800 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-emerald-700">
        {choose}
        <input type="file" accept=".csv,text/csv" multiple={multiple} disabled={disabled} onChange={onChange} className="sr-only" aria-label={title} />
      </label>
      {loaded && <p className="mt-3 break-words text-xs text-emerald-900">{loaded}</p>}
    </div>
  );
}

function NumberField({
  label, suffix, value, min, max, onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  return (
    <label className="block text-xs font-semibold text-stone-700">
      {label}
      <span className="mt-1 flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2">
        <input
          type="number"
          value={draft}
          min={min}
          max={max}
          onChange={(event) => {
            const raw = event.currentTarget.value;
            setDraft(raw);
            if (!raw.trim()) return;
            const parsed = Number.parseInt(raw, 10);
            if (Number.isFinite(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
          }}
          onBlur={() => {
            const parsed = Number.parseInt(draft, 10);
            const safe = Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : min;
            setDraft(String(safe));
            onChange(safe);
          }}
          className="w-full min-w-0 bg-transparent text-sm font-medium text-stone-950 outline-none"
        />
        <span className="whitespace-nowrap text-xs font-normal text-stone-500">{suffix}</span>
      </span>
    </label>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-[#f7f6f0] p-4">
      <p className="text-2xl font-semibold tabular-nums text-stone-950">{value}</p>
      <p className="mt-1 text-xs text-stone-600">{label}</p>
    </div>
  );
}

function parseListings(text: string, fileName: string, locale: Locale): ListingsFile {
  const rows = readCsv(text, locale);
  if (rows.length < 2) throw new Error(locale === "es" ? "El CSV de anuncios tiene encabezado pero no filas." : "The listings CSV has a header but no listing rows.");
  if (rows.length - 1 > MAX_COMBINED_ROWS) throw new Error(locale === "es" ? "El CSV tiene más de 100.000 filas. Elige una exportación más corta." : "The CSV has more than 100,000 rows. Choose a shorter export.");
  const headers = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headers, ["title", "listingtitle", "itemtitle", "product", "productname", "titulo", "titulodelarticulo", "nombredearticulo", "nomdelarticle", "titredelannonce", "artikelname"]);
  const skuIndex = findColumn(headers, ["sku", "skunumber", "listingsku", "productsku", "referencia", "numerossku"]);
  const quantityIndex = findColumn(headers, ["quantity", "qty", "listingquantity", "cantidad", "quantidade", "quantite", "menge", "existencias", "stock"]);
  if (titleIndex < 0 || quantityIndex < 0) {
    throw new Error(locale === "es" ? "No encuentro columnas de título y cantidad. Elige el CSV de anuncios activos de Etsy." : "I couldn’t find listing title and quantity columns. Choose Etsy’s active listings CSV.");
  }
  const parsed: Listing[] = [];
  let skippedRows = 0;
  for (const row of rows.slice(1)) {
    if (row.every((cell) => !cell.trim())) continue;
    const title = row[titleIndex]?.trim() ?? "";
    const quantity = parseQuantity(row[quantityIndex] ?? "");
    if (!title || quantity === null) {
      skippedRows += 1;
      continue;
    }
    parsed.push({ title, sku: skuIndex >= 0 ? row[skuIndex]?.trim() ?? "" : "", quantity });
  }
  if (parsed.length === 0) throw new Error(locale === "es" ? "No hay filas de anuncios con título y cantidad legibles." : "No listing rows with a readable title and quantity were found.");
  return { fileName, rows: parsed, skippedRows };
}

function parseOrderItems(text: string, fileName: string, locale: Locale): SalesFiles {
  const rows = readCsv(text, locale);
  if (rows.length < 2) throw new Error(locale === "es" ? "El CSV Order Items tiene encabezado pero no filas de pedido." : "An Order Items CSV has a header but no order rows.");
  if (rows.length - 1 > MAX_COMBINED_ROWS) throw new Error(locale === "es" ? "El CSV tiene más de 100.000 filas. Elige una exportación más corta." : "The CSV has more than 100,000 rows. Choose a shorter export.");
  const headers = rows[0].map(normalizeHeader);
  const titleIndex = findColumn(headers, ["item", "itemname", "itemtitle", "listing", "listingtitle", "product", "productname", "titulo", "titulodelarticulo", "nombredearticulo", "articulo", "nomdelarticle", "nomeitem"]);
  const skuIndex = findColumn(headers, ["sku", "itemsku", "productsku", "listingsku", "numerosku", "referencia"]);
  const quantityIndex = findColumn(headers, ["quantity", "qty", "itemquantity", "cantidad", "quantidade", "quantite", "menge", "cantidaddearticulos", "unidades"]);
  if (titleIndex < 0) throw new Error(locale === "es" ? "No encuentro la columna del título del artículo. Elige el CSV Order Items de Etsy." : "I couldn’t find an item title column. Choose Etsy’s Order Items CSV.");
  const parsed: SoldItem[] = [];
  let skippedRows = 0;
  let assumedQuantityRows = 0;
  for (const row of rows.slice(1)) {
    if (row.every((cell) => !cell.trim())) continue;
    const title = row[titleIndex]?.trim() ?? "";
    if (!title) {
      skippedRows += 1;
      continue;
    }
    const rawQuantity = quantityIndex >= 0 ? row[quantityIndex] ?? "" : "";
    const quantity = parseQuantity(rawQuantity);
    if (quantity === null) assumedQuantityRows += 1;
    parsed.push({ title, sku: skuIndex >= 0 ? row[skuIndex]?.trim() ?? "" : "", quantity: quantity ?? 1, rows: 1 });
  }
  if (parsed.length === 0) throw new Error(locale === "es" ? "No se encontraron filas de pedido legibles." : "No readable order rows were found.");
  return { fileNames: [fileName], rows: parsed, assumedQuantityRows, skippedRows };
}

function buildReport(
  listingRows: Listing[],
  salesRows: SoldItem[],
  periodDays: number,
  leadTimeDays: number,
  safetyDays: number,
) {
  const groups = new Map<string, ListingGroup>();
  for (const listing of listingRows) {
    const key = listing.sku ? "sku:" + normalizeText(listing.sku) : "title:" + normalizeText(listing.title);
    const group = groups.get(key) ?? { key, title: listing.title, sku: listing.sku, quantity: 0, unitsSold: 0, orderRows: 0 };
    group.quantity += listing.quantity;
    if (listing.title.length > group.title.length) group.title = listing.title;
    if (!group.sku && listing.sku) group.sku = listing.sku;
    groups.set(key, group);
  }

  const bySku = new Map<string, ListingGroup>();
  const byTitle = new Map<string, ListingGroup[]>();
  for (const group of groups.values()) {
    if (group.sku) bySku.set(normalizeText(group.sku), group);
    const titleKey = normalizeText(group.title);
    const matches = byTitle.get(titleKey) ?? [];
    matches.push(group);
    byTitle.set(titleKey, matches);
  }

  const soldGroups = new Map<string, SoldItem>();
  for (const sale of salesRows) {
    const identity = sale.sku ? "sku:" + normalizeText(sale.sku) : "title:" + normalizeText(sale.title);
    const group = soldGroups.get(identity) ?? { title: sale.title, sku: sale.sku, quantity: 0, rows: 0 };
    group.quantity += sale.quantity;
    group.rows += sale.rows;
    if (!group.title && sale.title) group.title = sale.title;
    soldGroups.set(identity, group);
  }

  let unmatchedUnits = 0;
  for (const sale of soldGroups.values()) {
    let match = sale.sku ? bySku.get(normalizeText(sale.sku)) : undefined;
    if (!match) {
      const titleMatches = byTitle.get(normalizeText(sale.title)) ?? [];
      if (titleMatches.length === 1) match = titleMatches[0];
    }
    if (!match) {
      unmatchedUnits += sale.quantity;
      continue;
    }
    match.unitsSold += sale.quantity;
    match.orderRows += sale.rows;
  }

  const rows: PlanRow[] = [...groups.values()].map((group) => {
    const dailySales = group.unitsSold / Math.max(1, periodDays);
    const stockCoverDays = group.unitsSold > 0 ? group.quantity / dailySales : null;
    const targetUnits = dailySales * (leadTimeDays + safetyDays);
    const suggestedRestock = group.unitsSold > 0 ? Math.max(0, Math.ceil(targetUnits - group.quantity)) : 0;
    return { ...group, dailySales, stockCoverDays, suggestedRestock };
  }).sort((a, b) => {
    const aNeed = a.suggestedRestock > 0;
    const bNeed = b.suggestedRestock > 0;
    if (aNeed !== bNeed) return aNeed ? -1 : 1;
    if (aNeed && bNeed) return (a.stockCoverDays ?? 0) - (b.stockCoverDays ?? 0);
    if (a.unitsSold !== b.unitsSold) return b.unitsSold - a.unitsSold;
    return a.title.localeCompare(b.title);
  });
  return {
    rows,
    soldProducts: rows.filter((item) => item.unitsSold > 0).length,
    restockCount: rows.filter((item) => item.suggestedRestock > 0).length,
    unmatchedUnits,
  };
}

function readCsv(value: string, locale: Locale): string[][] {
  const text = value.replace(/^\uFEFF/, "").trim();
  if (!text) throw new Error(locale === "es" ? "El archivo seleccionado está vacío." : "The selected file is empty.");
  const delimiter = detectDelimiter(text);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (quoted) throw new Error(locale === "es" ? "El CSV tiene un campo entrecomillado sin cerrar. Vuelve a descargar la exportación de Etsy e inténtalo de nuevo." : "A CSV file has an unclosed quoted field. Re-download the Etsy export and try again.");
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((item) => item.some((part) => part.trim()));
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
  const trimmed = value.trim().replace(/,/g, "");
  if (!trimmed) return null;
  const amount = Number(trimmed);
  return Number.isFinite(amount) && amount >= 0 ? Math.floor(amount) : null;
}

function checkFileSize(file: File, locale: Locale) {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(locale === "es"
      ? "Un archivo supera los 10 MB. Exporta un periodo más corto e inténtalo de nuevo."
      : "A selected file is over 10 MB. Export a smaller date range and try again.");
  }
}

function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US", { maximumFractionDigits: 0 }).format(value);
}

function toCsvCell(value: string): string {
  const safeValue = /^[\t\r ]*[=+\-@]/.test(value) ? "'" + value : value;
  return /[",\r\n]/.test(safeValue) ? '"' + safeValue.replace(/"/g, '""') + '"' : safeValue;
}
