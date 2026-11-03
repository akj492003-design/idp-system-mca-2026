import Icon from "../Common/Icon.jsx";

const stages = ["File Uploaded", "Text Extraction", "Document Classification", "Field Extraction"];

export default function ProcessingStatus({ status = "idle", currentStage = null, progress = 0 }) {
  const activeIndex = stages.indexOf(currentStage);
  const isIdle = status === "idle";
  const percentage = Math.max(0, Math.min(100, Number(progress) || 0));
  const complete = status === "completed";
  const failed = status === "failed";
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3 shadow-[0_2px_10px_rgba(0,0,0,.04)] [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_6px_18px_rgba(15,35,70,.06)]">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Processing Status</h3>
      <div className="rounded-md border border-(color:--c-line) p-3">
        <ol className="space-y-3.5 text-xs">
          {isIdle ? <li className="flex items-center gap-3 font-semibold text-(color:--c-accent)"><span className="relative grid h-5 w-5 place-items-center rounded-full border-2 border-(color:--c-accent) bg-(color:--c-panel)"><span className="h-2 w-2 animate-pulse rounded-full bg-(color:--c-accent) motion-reduce:animate-none" /></span><span className="text-[13px]">No document processed yet</span></li> : stages.map((stage, index) => {
            const done = complete || index < activeIndex;
            const active = !failed && !complete && stage === currentStage;
            return <li key={stage} className={`flex items-center gap-3 ${active ? "font-semibold text-(color:--c-accent)" : done ? "text-emerald-600 [.dark_&]:text-emerald-300" : "text-(color:--c-muted)"}`}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${active ? "border-2 border-(color:--c-accent) bg-(color:--c-panel)" : done ? "bg-emerald-600 text-white" : "bg-slate-300 [.dark_&]:bg-[#3c5f9b]"}`}>
                {done ? <Icon name="check" className="h-3.5 w-3.5" /> : active ? <span className="h-2 w-2 rounded-full bg-(color:--c-accent)" /> : null}
              </span><span className="flex-1">{stage}</span><span>{done ? "✓" : active ? "…" : "—"}</span>
            </li>;
          })}
        </ol>
      </div>
      {!isIdle && <div className="mt-3" aria-label={`Backend processing progress ${percentage}%`}>
        <div className="mb-1 flex items-center justify-between text-[11px]"><span className="text-(color:--c-muted)">{failed ? "Processing failed" : complete ? "Completed" : currentStage || "Queued"}</span><strong className="tabular-nums text-(color:--c-fg)">{percentage}%</strong></div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 [.dark_&]:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${percentage}%` }} /></div>
      </div>}
      <div className="mt-3 flex items-start gap-3 rounded-md border border-(color:--c-line) bg-(color:--c-inner) p-3 text-xs" role="status">
        <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-(color:--c-accent)" />
        <p><span className="block font-semibold text-(color:--c-fg)">{isIdle ? "No document processed yet." : complete ? "Document processing completed." : failed ? "Document processing failed." : "Document processing in progress."}</span>
          <span className="text-[11px] text-(color:--c-muted)">{isIdle ? "Upload a PDF from the dashboard to start processing." : "Progress and processing stages are reported by the backend worker."}</span></p>
      </div>
    </article>
  );
}
