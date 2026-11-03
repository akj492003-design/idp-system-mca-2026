import { useState } from "react";
import Icon from "../Common/Icon.jsx";

export default function OcrExtractedText({ text = "", pages = [] }) {
  const availablePages = Array.isArray(pages) && pages.length ? pages : (text ? [text] : []);
  const [selectedPage, setSelectedPage] = useState(0);
  const visiblePage = availablePages[Math.min(selectedPage, Math.max(availablePages.length - 1, 0))] || text;
  return (
    <article className="flex flex-col rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3 shadow-[0_2px_10px_rgba(0,0,0,.04)] [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_6px_18px_rgba(15,35,70,.06)]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-(color:--c-fg)">OCR Extracted Text</h3>
        {availablePages.length > 1 && <label className="flex items-center gap-1.5 text-[11px] text-(color:--c-muted)">Page
          <select value={Math.min(selectedPage, availablePages.length - 1)} onChange={(event) => setSelectedPage(Number(event.target.value))} className="h-7 rounded-md border border-(color:--c-line) bg-(color:--c-panel) px-2 text-(color:--c-fg) focus-visible:outline-2 focus-visible:outline-blue-500">
            {availablePages.map((_, index) => <option value={index} key={index}>{index + 1} / {availablePages.length}</option>)}
          </select>
        </label>}
      </div>
      {visiblePage ? <pre className="min-h-[220px] whitespace-pre-wrap overflow-auto rounded-md border border-(color:--c-line) p-3 text-xs leading-relaxed text-(color:--c-fg)">{visiblePage}</pre> :
        <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-md border border-dashed border-(color:--c-dash)/70 p-4 text-center text-xs leading-relaxed text-(color:--c-muted)">
          <Icon name="doc" className="mb-3 h-9 w-9 text-(color:--c-accent)" />
          <p className="max-w-[180px]">OCR extracted text will appear here after processing the document.</p>
        </div>}
    </article>
  );
}
