import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getDocument,
  getDocumentPreview,
  listDocuments,
} from "../services/idpService.js";
import DocumentProcessingSummary from "../components/Scanning/DocumentProcessingSummary.jsx";
import DocumentProcessingResult from "../components/Scanning/DocumentProcessingResult.jsx";
import ModelPerformanceAnalytics from "../components/Analytics/ModelPerformanceAnalytics.jsx";
import useDashboardData from "../hooks/useDashboardData.js";

export default function ScanningPage() {
  const location = useLocation();

  const [document, setDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);
  const analyticsRef = useRef(null);

  // Refresh dashboard analytics when the selected document completes.
  const dashboard = useDashboardData(
    document?.status === "completed" ? document.id : null
  );

  useEffect(() => {
    let active = true;
    let timer = null;
    let ownedPreviewUrl = "";

    const pollDocument = async (id) => {
      try {
        const latest = await getDocument(id);

        if (!active) return;

        setDocument(latest);
        setLoadError("");
        setLoading(false);

        if (!ownedPreviewUrl && latest?.extension === "pdf") {
          try {
            const url = await getDocumentPreview(id);

            if (!active) {
              URL.revokeObjectURL(url);
              return;
            }

            ownedPreviewUrl = url;
            setPreviewUrl(url);
          } catch {
            // Preview is optional; extracted text and fields remain available.
          }
        }

        if (["queued", "processing"].includes(latest?.status)) {
          timer = window.setTimeout(() => pollDocument(id), 1400);
        }
      } catch (error) {
        if (!active) return;

        setLoading(false);
        setLoadError(
          error?.response?.data?.message ||
            "Unable to retrieve the selected document."
        );
      }
    };

    const start = async () => {
      let id = location.state?.documentId || "";

      if (!id) {
        try {
          const recent = await listDocuments({ page: 1, limit: 1 });
          id = recent?.items?.[0]?.id || "";
        } catch (error) {
          if (active) {
            setLoading(false);
            setLoadError(
              error?.response?.data?.message ||
                "Unable to load your recent documents."
            );
          }
          return;
        }
      }

      if (!active) return;

      if (!id) {
        setLoading(false);
        setDocument(null);
        return;
      }

      await pollDocument(id);
    };

    setLoading(true);
    setLoadError("");
    setDocument(null);
    setPreviewUrl("");

    start();

    return () => {
      active = false;

      if (timer) {
        window.clearTimeout(timer);
      }

      if (ownedPreviewUrl) {
        URL.revokeObjectURL(ownedPreviewUrl);
      }
    };
  }, [location.key, location.state?.documentId]);

  const result = document?.result || {};
  const classification = result.classification || {};
  const insights = result.insights || {};

  const documentData = useMemo(() => {
    if (!document) return null;

    return {
      id: document.id,
      file_name: document.file_name || document.name,
      status: document.status,
      current_stage: document.current_stage,
      progress:
        document.progress ?? (document.status === "completed" ? 100 : 0),
      preview_url: previewUrl,
      extracted_information: insights.key_fields || {},
      ocr_text: result.extracted_text || "",
      page_texts: result.page_texts || [],
      prediction: {
        predicted_class: classification.label,
        confidence_score: classification.scores?.[0]?.score,
        model_name: classification.model,
        inference_time: classification.inference_time_ms,
      },
      class_probabilities: (classification.scores || []).map((item) => ({
        class: item.label,
        probability: Number(item.score || 0) * 100,
      })),
      error_message: document.error_message,
    };
  }, [
    document,
    previewUrl,
    insights.key_fields,
    result.extracted_text,
    result.page_texts,
    classification,
  ]);

  const handleViewAnalytics = useCallback(() => {
    setAnalyticsExpanded(true);

    window.requestAnimationFrame(() =>
      analyticsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      })
    );
  }, []);

  const processing = ["queued", "processing"].includes(document?.status);

  return (
    <div className="min-h-screen bg-[#0a1628] text-[#e0f2fe] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#172b4d]">
      <main
        id="main"
        className="mx-auto max-w-[1500px] space-y-3 px-3 py-3 sm:px-7 sm:py-5 min-[1920px]:max-w-[1800px] min-[2560px]:max-w-[2200px]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/40 bg-[#0B1730] px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-cyan-400 hover:bg-[#10234A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18] active:scale-95 [.light_&]:border-[#c5d4ea] [.light_&]:bg-white [.light_&]:text-[#263b59] [.light_&]:shadow-[0_2px_8px_rgba(15,35,70,.08)]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            Dashboard
          </Link>

          <span className="text-xs text-[#91a9cf] [.light_&]:text-[#566b87]">
            {document?.file_name ||
              location.state?.fileName ||
              "Latest document scan"}
          </span>
        </div>

        {loading && (
          <div className="rounded-xl border border-(color:--c-line) bg-white/5 p-4 text-sm [.light_&]:border-[#cbd8ea] [.light_&]:bg-white">
            Retrieving document processing status…
          </div>
        )}

        {loadError && (
          <div
            className="rounded-xl border border-rose-400/30 bg-rose-950/20 p-4 text-sm text-rose-200 [.light_&]:border-rose-200 [.light_&]:bg-rose-50 [.light_&]:text-rose-800"
            role="alert"
          >
            {loadError}
          </div>
        )}

        {!loading && !loadError && !document && (
          <div className="rounded-xl border border-dashed border-blue-400/40 bg-white/5 p-8 text-center [.light_&]:border-[#bdcce2] [.light_&]:bg-white">
            <h1 className="text-lg font-semibold">
              No document to display
            </h1>

            <p className="mt-2 text-sm text-[#91a9cf] [.light_&]:text-[#566b87]">
              Upload a PDF from Home. Your latest document will appear here
              with extracted text and structured fields.
            </p>

            <Link
              to="/home"
              className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Upload a PDF
            </Link>
          </div>
        )}

        {document && (
          <>
            {processing && (
              <div
                className="flex items-center gap-3 rounded-lg border border-cyan-400/25 bg-cyan-400/5 px-3 py-2 text-sm text-cyan-200 [.light_&]:border-cyan-200 [.light_&]:bg-cyan-50 [.light_&]:text-cyan-800"
                role="status"
              >
                <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
                Scanning is in progress. This page updates from the backend
                processing status.
              </div>
            )}

            <DocumentProcessingSummary stats={dashboard?.stats ?? null} />

            <DocumentProcessingResult
              documentData={documentData}
              onViewAnalytics={handleViewAnalytics}
            />
          </>
        )}

        <div className="relative py-1">
          <div className="h-[3px] rounded-sm bg-[#1e3a5f] [.light_&]:bg-[#cbd8ea]" />

          <button
            type="button"
            onClick={() => setAnalyticsExpanded((value) => !value)}
            className="absolute left-1/2 top-1/2 h-1.5 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-blue-500/70 transition hover:h-2 hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Collapse or expand analytics"
            aria-expanded={analyticsExpanded}
            aria-controls="analytics"
          />
        </div>

        <div
          ref={analyticsRef}
          className={analyticsExpanded ? "block" : "hidden"}
        >
          <ModelPerformanceAnalytics
            evaluation={dashboard?.evaluation ?? null}
          />
        </div>
      </main>
    </div>
  );
}