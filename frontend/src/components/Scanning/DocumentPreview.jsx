import { useEffect, useState } from "react";
import Icon from "../Common/Icon.jsx";

export default function DocumentPreview({ fileUrl = null, fileName = null, processing = false }) {
  const [sweep, setSweep] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!fileUrl || reducedMotion) {
      setSweep(false);
      return undefined;
    }
    setSweep(false);
    const startTimer = window.setTimeout(() => setSweep(true), 60);
    if (processing) {
      const interval = window.setInterval(() => setSweep((value) => !value), 2200);
      return () => {
        window.clearTimeout(startTimer);
        window.clearInterval(interval);
      };
    }
    const finishTimer = window.setTimeout(() => setSweep(false), 2300);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(finishTimer);
    };
  }, [fileUrl, processing, reducedMotion]);

  return (
    <article className="flex flex-col rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3 shadow-[0_2px_10px_rgba(0,0,0,.04)] [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_6px_18px_rgba(15,35,70,.06)]">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Document Preview</h3>
      {fileUrl ? <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-md border border-(color:--c-line) bg-[#e5e7eb]">
        <iframe title={fileName || "Document preview"} src={fileUrl} className="relative z-0 min-h-[360px] w-full bg-white sm:min-h-[520px]" />
        {(processing || sweep) && !reducedMotion && <>
          <div className="pointer-events-none absolute inset-0 z-10 bg-cyan-400/[.035]" />
          <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 z-20 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_16px_4px_rgba(34,211,238,.65)] transition-transform duration-[2200ms] ease-linear" style={{ transform: sweep ? "translateY(520px)" : "translateY(-8px)" }} />
        </>}
        {processing && <span className="absolute right-2 top-2 z-30 rounded-full border border-cyan-300/40 bg-slate-950/80 px-2 py-1 text-[10px] font-semibold text-cyan-200">{reducedMotion ? "Processing" : "Live scan"}</span>}
      </div> :
        <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-md border border-dashed border-(color:--c-dash)/70 p-4 text-center text-xs leading-relaxed text-(color:--c-muted)">
          <Icon name="doc" className="mb-3 h-10 w-10 text-(color:--c-accent)" />
          <p className="text-[13px] font-semibold text-(color:--c-accent)">Document preview unavailable</p>
          <p className="mt-2 max-w-[200px]">Extracted text and structured fields are still available for this document.</p>
        </div>}
    </article>
  );
}
