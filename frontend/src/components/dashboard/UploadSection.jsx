import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, listDocuments, uploadDocument } from "../../services/idpService.js";
import { getApiErrorMessage } from "../../services/api.js";

const MAX_PDF_SIZE_MB = Math.max(1, Number(import.meta.env.VITE_MAX_PDF_SIZE_MB || 10));
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function quotaLockMessage(quota) {
  if (quota?.plan === "intermediate") return "The Intermediate plan has reached its 20-upload billing-period limit. Upgrade your plan or wait until the next billing period.";
  return "Your upload allowance has been reached. Upgrade your plan or wait until the cooldown ends.";
}

export default function UploadSection({ uploadRef }) {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [quota, setQuota] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState(false);
  const locked = Boolean(quota?.locked);

  const refresh = useCallback(async () => {
    try {
      const [dashboard, documents] = await Promise.all([getDashboard(), listDocuments({ page: 1, limit: 6 })]);
      const nextQuota = dashboard?.quota || documents?.quota || null;
      setQuota(nextQuota);
      window.dispatchEvent(new CustomEvent("idp:quota-updated", { detail: nextQuota }));
      setRecent(documents?.items || []);
    } catch {
      // The dashboard stays usable when the optional summary request is unavailable.
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (files.length > 1) {
      setError(true);
      setStatusMessage("Upload one PDF at a time. Select a single file and try again.");
      return;
    }
    const file = files[0];
    if (locked) {
      setError(true);
      setStatusMessage(quotaLockMessage(quota));
      return;
    }
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setError(true);
      setStatusMessage("Invalid file. Select a PDF with MIME type application/pdf.");
      return;
    }
    if (!file.size) {
      setError(true);
      setStatusMessage("The selected PDF is empty.");
      return;
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      setError(true);
      setStatusMessage(`${file.name} exceeds the ${MAX_PDF_SIZE_MB} MB PDF upload limit.`);
      return;
    }

    setUploading(true);
    setError(false);
    setStatusMessage(`Uploading ${file.name}…`);
    try {
      const response = await uploadDocument(file);
      const uploadedDocument = response?.document;
      if (!uploadedDocument?.id) throw new Error("The server accepted the upload but did not return a document reference.");

      setQuota(response.quota || null);
      window.dispatchEvent(new CustomEvent("idp:quota-updated", { detail: response.quota || null }));
      setRecent((current) => [uploadedDocument, ...current.filter((item) => item.id !== uploadedDocument.id)].slice(0, 6));
      window.dispatchEvent(new CustomEvent("idp:dashboard-refresh"));
      navigate("/scanning", {
        state: { documentId: uploadedDocument.id, fileName: uploadedDocument.name || file.name },
      });
    } catch (uploadError) {
      setError(true);
      const response = uploadError?.response?.data;
      if (response?.quota) {
        setQuota(response.quota);
        window.dispatchEvent(new CustomEvent("idp:quota-updated", { detail: response.quota }));
      }
      setStatusMessage(response?.message || getApiErrorMessage(uploadError, uploadError.message || "Upload failed. Please retry."));
    } finally {
      setUploading(false);
    }
  }, [locked, navigate, quota]);

  const handleInput = (event) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };
  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (!locked && !uploading) handleFiles(event.dataTransfer.files);
  };

  return (<>
    <section id="upload" className="rounded-[14px] border border-[rgba(96,140,255,.28)] bg-[radial-gradient(120%_90%_at_0%_0%,rgba(79,124,255,.14),transparent_60%),linear-gradient(180deg,rgba(18,36,120,.55),rgba(8,18,78,.55))] shadow-[inset_0_1px_0_rgba(255,255,255,.05)] p-2.5 min-[701px]:flex min-[701px]:min-h-0 min-[701px]:flex-1 min-[701px]:basis-0 min-[701px]:flex-col [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] [@media(min-width:701px)_and_(max-height:560px)]:flex-none" ref={uploadRef}>
      <div id="dropzone" onDragOver={(event) => { event.preventDefault(); if (!locked && !uploading) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={handleDrop} className={`group/dz relative flex min-h-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#3b6bff] bg-[radial-gradient(70%_90%_at_50%_0%,rgba(59,130,246,.12),transparent_70%),rgba(7,18,85,.55)] p-3 text-center transition duration-200 hover:border-[#7db4ff] hover:bg-[radial-gradient(70%_90%_at_50%_0%,rgba(59,130,246,.22),transparent_70%),rgba(14,34,130,.6)] hover:shadow-[0_0_22px_rgba(59,130,246,.25)] [.light_&]:border-[#3777df] [.light_&]:bg-[#f5f8ff] [.light_&]:hover:bg-[#edf4ff] min-[701px]:min-h-0 min-[701px]:flex-1 [@media(min-width:701px)_and_(max-height:760px)]:p-1.5 ${dragging ? "border-blue-300" : ""} ${locked ? "cursor-not-allowed opacity-80" : ""}`} aria-disabled={locked || uploading}>
        <svg className="mb-1.5 size-[42px] text-[#38bdf8] drop-shadow-[0_0_8px_rgba(56,189,248,.6)] [@media(min-width:701px)_and_(max-height:760px)]:mb-0.5 [@media(min-width:701px)_and_(max-height:760px)]:size-[30px]"><use href="#i-upload"></use></svg>
        <h2 className="mb-[3px] text-sm font-bold text-white [.light_&]:text-[#172b4d] [@media(min-width:701px)_and_(max-height:760px)]:text-xs">{locked ? "Upload limit reached" : uploading ? "Uploading your PDF" : "Drag & Drop your PDF here"}</h2>
        <span className="mb-1.5 text-[11px] font-medium text-[#60a5fa] [.light_&]:text-[#1d5fb7] [@media(min-width:701px)_and_(max-height:760px)]:mb-0.5 [@media(min-width:701px)_and_(max-height:760px)]:text-[10px]">{locked ? "Upgrade your plan to continue" : uploading ? "Opening the scanning workspace…" : "or click to browse"}</span>
        <p className="mb-2.5 text-[11px] text-[#9fb0e6] [.light_&]:text-[#526782] [@media(min-width:701px)_and_(max-height:760px)]:mb-[5px] [@media(min-width:701px)_and_(max-height:760px)]:text-[9.5px]">PDF only · application/pdf · Max size: {MAX_PDF_SIZE_MB} MB</p>
        <span className={`pointer-events-none inline-flex h-9 items-center gap-2 rounded-lg bg-[linear-gradient(90deg,#2563eb,#4f46e5)] px-6 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(59,90,255,.45),inset_0_1px_0_rgba(255,255,255,.2)] transition duration-200 group-hover/dz:-translate-y-px group-hover/dz:shadow-[0_8px_24px_rgba(79,110,255,.6),inset_0_1px_0_rgba(255,255,255,.25)] [@media(min-width:701px)_and_(max-height:760px)]:h-7 [@media(min-width:701px)_and_(max-height:760px)]:px-[18px] [@media(min-width:701px)_and_(max-height:760px)]:text-[11px] ${locked || uploading ? "opacity-50" : ""}`}><svg className="size-4"><use href="#i-doc"></use></svg>{locked ? "Upload Disabled" : uploading ? "Uploading…" : "Choose PDF"}</span>
        <input type="file" className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" id="fileInput" accept="application/pdf,.pdf" aria-label="Choose a PDF document to scan" disabled={locked || uploading} onChange={handleInput} />
      </div>
      <p id="uploadMessage" className={`mt-1.5 flex min-h-4 items-center justify-center gap-1.5 text-center text-[11px] ${error ? "text-rose-600 [.dark_&]:text-rose-300" : "text-[#0f9f78] [.dark_&]:text-[#6ee7b7]"}`} role="status" aria-live="polite">{uploading && <span className="size-3 animate-spin rounded-full border-2 border-current/30 border-t-current" />}{statusMessage || (locked ? quotaLockMessage(quota) : quota ? `${quota.remaining ?? "Unlimited"} uploads remaining on your current plan` : `${MAX_PDF_SIZE_MB} MB maximum PDF size`)}</p>
    </section>
    <section className="rounded-[14px] border border-[rgba(96,140,255,.28)] bg-[radial-gradient(120%_90%_at_0%_0%,rgba(79,124,255,.14),transparent_60%),linear-gradient(180deg,rgba(18,36,120,.55),rgba(8,18,78,.55))] shadow-[inset_0_1px_0_rgba(255,255,255,.05)] p-[9px] min-[701px]:flex min-[701px]:min-h-0 min-[701px]:flex-1 min-[701px]:basis-0 min-[701px]:flex-col min-[701px]:overflow-hidden [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] [@media(min-width:701px)_and_(max-height:560px)]:flex-none">
      <div className="mb-[7px] flex items-center justify-between"><h2 className="flex items-center gap-[7px] text-xs font-bold tracking-[.01em]"><svg className="size-4"><use href="#i-doc"></use></svg>Recent Uploads</h2><button id="viewAllButton" type="button" onClick={() => navigate("/track-manage")} className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300">View All <svg className="size-3"><use href="#i-arrow"></use></svg></button></div>
      <div id="uploadGrid" className="upload-grid grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] content-start gap-2.5 min-[701px]:min-h-0 min-[701px]:flex-1 min-[701px]:overflow-y-auto overscroll-contain">
        {recent.length === 0 ? <p id="emptyMsg" className="col-span-full flex flex-col items-center gap-1 rounded-[10px] border border-dashed border-blue-400/35 bg-blue-950/50 px-2 py-2.5 text-center text-[10px] leading-[1.35] font-medium text-blue-100 [.light_&]:border-[#b9cce7] [.light_&]:bg-[#f5f8fd] [.light_&]:text-[#405573] min-[701px]:h-full min-[701px]:justify-center"><svg className="size-[23px] text-blue-400 opacity-85"><use href="#i-doc"></use></svg>No documents uploaded yet.<small className="text-[9px] font-normal text-[#8fa3d9] [.light_&]:text-[#60728d]">Upload a PDF to see it here.</small></p> : recent.map((doc) => <button key={doc.id} type="button" onClick={() => navigate(`/scanning-result/${doc.id}`)} className="min-w-0 rounded-[10px] border border-blue-400/20 bg-blue-950/50 p-2 text-left transition hover:border-blue-300/70 hover:bg-blue-900/60 [.light_&]:border-[#d2deef] [.light_&]:bg-[#f5f8fd] [.light_&]:hover:bg-[#eaf2ff]"><span className="block truncate text-[10px] font-semibold text-white [.light_&]:text-[#172b4d]">{doc.name}</span><span className="mt-1 block text-[9px] text-blue-200 [.light_&]:text-[#526782]">{doc.type} · {formatSize(doc.size)}</span><span className={`mt-1 block text-[9px] font-semibold capitalize ${doc.status === "completed" ? "text-emerald-300 [.light_&]:text-emerald-700" : doc.status === "failed" ? "text-rose-300 [.light_&]:text-rose-700" : "text-cyan-300 [.light_&]:text-cyan-700"}`}>{doc.status}</span></button>)}
      </div>
    </section>
  </>);
}
