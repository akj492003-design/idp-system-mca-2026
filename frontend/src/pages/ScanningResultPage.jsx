import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDocument } from "../services/idpService.js";

const cardClass = "rounded-2xl border border-blue-400/20 bg-[linear-gradient(145deg,rgba(15,35,104,.78),rgba(5,14,54,.92))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]";

export default function ScanningResultPage() {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let timer;
    let attempts = 0;
    const poll = async () => {
      try {
        const result = await getDocument(documentId);
        if (!active) return;
        setDocument(result);
        setError("");
        if (["queued", "processing"].includes(result.status) && attempts < 90) {
          attempts += 1;
          timer = window.setTimeout(poll, 1800);
        }
      } catch (requestError) {
        if (active) setError(requestError?.response?.data?.message || "Unable to load this scan result.");
      }
    };
    poll();
    return () => { active = false; window.clearTimeout(timer); };
  }, [documentId]);

  const result = document?.result;
  const classification = result?.classification;
  const insights = result?.insights;
  const completed = document?.status === "completed";
  const processing = ["queued", "processing"].includes(document?.status);

  return (
    <div className="min-h-dvh bg-[#050b1f] px-3 py-5 text-[#e6eeff] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] sm:px-6 sm:py-8">
      <main className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">Document intelligence</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Scanning Result</h1><p className="mt-1 text-sm text-blue-200">Live processing status, extracted content and classification insights.</p></div>
          <div className="flex flex-wrap gap-2"><Link to="/home" className="rounded-lg border border-blue-400/30 px-4 py-2 text-sm font-semibold hover:bg-blue-500/15">Dashboard</Link><Link to="/history" className="rounded-lg border border-blue-400/30 px-4 py-2 text-sm font-semibold hover:bg-blue-500/15">History</Link></div>
        </div>

        <section className={cardClass} aria-live="polite">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-cyan-300">
              {processing ? <span className="size-8 animate-spin rounded-full border-[3px] border-blue-200/20 border-t-cyan-300" aria-label="Scanning" /> : <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4zM8 9h8M8 13h5M8 17h7" /></svg>}
            </div>
            <div className="min-w-0 flex-1"><h2 className="truncate text-lg font-semibold">{document?.name || "Loading document…"}</h2><p className="mt-1 text-sm text-blue-200">{processing ? "Scanning document, extracting text and running classification…" : completed ? "Processing completed." : document?.status === "failed" ? "Processing failed." : error || "Retrieving document status…"}</p></div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${completed ? "bg-emerald-400/15 text-emerald-300" : document?.status === "failed" ? "bg-rose-400/15 text-rose-300" : "bg-cyan-400/15 text-cyan-200"}`}>{document?.status || "loading"}</span>
          </div>
          {processing && <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-blue-950"><div className="h-full w-2/5 animate-[scanline_1.8s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent" /></div>}
          {document?.error_message && <p className="mt-3 text-sm text-rose-300">{document.error_message}</p>}
          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        </section>

        {completed && <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className={cardClass}><p className="text-xs uppercase tracking-wide text-blue-200">Predicted class</p><p className="mt-2 text-2xl font-bold capitalize text-cyan-300">{classification?.label || "Unclassified"}</p><p className="mt-1 text-xs text-blue-200">Model: {classification?.model || "Not available"}</p></article>
            <article className={cardClass}><p className="text-xs uppercase tracking-wide text-blue-200">Extracted words</p><p className="mt-2 text-2xl font-bold">{insights?.word_count ?? 0}</p><p className="mt-1 text-xs text-blue-200">Based on extracted document text</p></article>
            <article className={cardClass}><p className="text-xs uppercase tracking-wide text-blue-200">Key fields found</p><p className="mt-2 text-2xl font-bold">{Object.values(insights?.key_fields || {}).reduce((n, values) => n + values.length, 0)}</p><p className="mt-1 text-xs text-blue-200">Regex-extracted identifiers and contact details</p></article>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)]">
            <article className={cardClass}><h2 className="text-lg font-semibold">Document summary</h2><p className="mt-3 text-sm leading-7 text-blue-100">{insights?.summary || "No readable text was extracted."}</p><div className="mt-4 flex flex-wrap gap-2">{(classification?.scores || []).map((score) => <span key={score.label} className="rounded-lg border border-blue-400/20 bg-blue-950/60 px-3 py-2 text-xs capitalize">{score.label}: {(Number(score.score) * 100).toFixed(1)}%</span>)}</div>{classification?.score_type && <p className="mt-3 text-[11px] text-blue-300">Score interpretation: {classification.score_type}.</p>}</article>
            <article className={cardClass}><h2 className="text-lg font-semibold">Key fields extracted</h2>{Object.entries(insights?.key_fields || {}).length ? <div className="mt-3 space-y-3">{Object.entries(insights.key_fields).map(([key, values]) => <div key={key}><p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{key.replaceAll("_", " ")}</p><div className="mt-1 flex flex-wrap gap-1.5">{values.map((value) => <span key={value} className="break-all rounded-md bg-blue-950/70 px-2 py-1 text-xs text-blue-100">{value}</span>)}</div></div>)}</div> : <p className="mt-3 text-sm text-blue-200">No matching fields were found in the extracted text.</p>}</article>
          </section>

          <section className={cardClass}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Extracted text</h2><span className="text-xs text-blue-300">{result?.text_truncated ? "Display limited to 2,000,000 characters" : `${insights?.character_count ?? 0} characters`}</span></div><pre className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-blue-400/10 bg-[#030a2a] p-4 text-xs leading-6 text-blue-100">{result?.extracted_text || "No text extracted."}</pre></section>
        </>}
        {!completed && !processing && document?.status === "failed" && <section className={`${cardClass} text-sm text-rose-200`}>This file could not be processed. Check its format and contents, then upload it again.</section>}
        <div className="flex flex-wrap justify-end gap-2"><Link to="/model-performance" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Model performance</Link><Link to="/track-manage" className="rounded-lg border border-blue-400/30 px-4 py-2 text-sm font-semibold hover:bg-blue-500/15">Track &amp; Manage</Link></div>
      </main>
    </div>
  );
}
