import { useState } from "react";
import Icon from "../Common/Icon.jsx";

function exportExtractedInformation(data, format) {
  const rows = Object.entries(data || {}).flatMap(([field, rawValues]) => {
    const values = Array.isArray(rawValues) ? rawValues : [rawValues];
    return values.map((value) => ({ field, value: value == null ? "" : String(value) }));
  });
  let content = "";
  let mime = "text/plain;charset=utf-8";
  let extension = format;
  if (format === "json") {
    content = JSON.stringify(data || {}, null, 2);
    mime = "application/json;charset=utf-8";
  } else if (format === "csv") {
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    content = ["field,value", ...rows.map((row) => `${escapeCsv(row.field)},${escapeCsv(row.value)}`)].join("\r\n");
    mime = "text/csv;charset=utf-8";
  } else {
    content = rows.length ? rows.map((row) => `${row.field}: ${row.value}`).join("\n") : "No extracted fields.";
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `idp-extracted-information.${extension}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ExtractedInformation({ data = null }) {
  const [format, setFormat] = useState("json");
  const hasData = Boolean(data && Object.keys(data).length);
  return (
    <article className="flex flex-col rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3 shadow-[0_2px_10px_rgba(0,0,0,.04)] [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_6px_18px_rgba(15,35,70,.06)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-(color:--c-fg)">Extracted Information</h3>
        {hasData && <div className="flex items-center gap-1.5">
          <label htmlFor="extracted-export-format" className="sr-only">Export format</label>
          <select id="extracted-export-format" value={format} onChange={(event) => setFormat(event.target.value)} className="h-8 rounded-md border border-(color:--c-line) bg-(color:--c-panel) px-2 text-[11px] text-(color:--c-fg) focus-visible:outline-2 focus-visible:outline-blue-500">
            <option value="json">JSON</option><option value="csv">CSV</option><option value="txt">TXT</option>
          </select>
          <button type="button" onClick={() => exportExtractedInformation(data, format)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-blue-600 px-2.5 text-[11px] font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500" aria-label={`Download extracted information as ${format.toUpperCase()}`}>
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v4h16v-4" /></svg>Download
          </button>
        </div>}
      </div>
      {hasData ? <dl className="min-h-[220px] space-y-2 overflow-auto rounded-md border border-(color:--c-line) p-3 text-xs [.light_&]:border-[#d8e1ee]">
        {Object.entries(data).map(([key, rawValue]) => {
          const values = Array.isArray(rawValue) ? rawValue : [rawValue];
          return <div key={key} className="border-b border-(color:--c-line) pb-2 last:border-0">
            <dt className="text-(color:--c-muted)">{key.replaceAll("_", " ")}</dt>
            <dd className="mt-1 break-words text-(color:--c-fg)">{values.map((value, index) => <span className="mr-1 inline-block" key={`${String(value)}-${index}`}>{String(value)}{index < values.length - 1 ? "," : ""}</span>)}</dd>
          </div>;
        })}
      </dl> : <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-md border border-dashed border-(color:--c-dash)/70 p-4 text-center text-xs leading-relaxed text-(color:--c-muted)">
        <Icon name="list" className="mb-3 h-9 w-9 text-(color:--c-accent)" />
        <p className="max-w-[180px]">Extracted information will appear here after processing the document.</p>
      </div>}
    </article>
  );
}
