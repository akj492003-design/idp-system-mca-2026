import { useEffect, useMemo, useState } from "react";
import { ChartNoAxesColumnIncreasing, Activity, Award, Crosshair } from "lucide-react";
import StatCard from "../Common/StatCard.jsx";
import { getModelMetrics } from "../../services/idpService.js";
import { ModelAccuracyChart, MetricsComparisonChart, ConfusionMatrixChart, PerClassPerformanceChart, ModelComparisonRadarChart, InferenceTimeChart } from "./PerformanceCharts.jsx";
import ClassificationReport from "./ClassificationReport.jsx";

const pct = (value) => value == null || !Number.isFinite(Number(value))
  ? "—"
  : `${(Number(value) <= 1 ? Number(value) * 100 : Number(value)).toFixed(2)}%`;

function reportRows(model) {
  return Object.entries(model?.classification_report || {})
    .filter(([, row]) => row && typeof row === "object" && Number.isFinite(Number(row.precision)) && Number.isFinite(Number(row.recall)) && Number.isFinite(Number(row.f1_score)))
    .map(([label, row]) => ({
      class: label,
      precision: `${(Number(row.precision) * 100).toFixed(2)}%`,
      recall: `${(Number(row.recall) * 100).toFixed(2)}%`,
      f1_score: `${(Number(row.f1_score) * 100).toFixed(2)}%`,
      support: row.support ?? "—",
    }));
}

function buildPerClassRows(model) {
  return reportRows(model).map((row) => ({
    class: row.class,
    precision: Number.parseFloat(row.precision),
    recall: Number.parseFloat(row.recall),
    f1_score: Number.parseFloat(row.f1_score),
  }));
}

export default function ModelPerformanceAnalytics({ evaluation = null }) {
  const [catalog, setCatalog] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  useEffect(() => {
    let active = true;
    getModelMetrics()
      .then((payload) => {
        if (!active) return;
        setCatalog(payload);
        const preferred = payload?.text_models?.find((model) => model.selected_model)?.model;
        setSelectedName(preferred || payload?.text_models?.[0]?.model || payload?.image_models?.[0]?.model || "");
        setCatalogError("");
      })
      .catch((error) => {
        if (!active) return;
        setCatalogError(error?.response?.data?.message || "The saved model-evaluation artifacts could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const textModels = catalog?.text_models || [];
  const imageModels = catalog?.image_models || [];
  const selectedModel = useMemo(
    () => [...textModels, ...imageModels].find((model) => model.model === selectedName) || null,
    [textModels, imageModels, selectedName],
  );
  const charts = evaluation?.charts || {};
  const metrics = selectedModel || evaluation?.metrics || null;
  const selectedReport = selectedModel ? reportRows(selectedModel) : evaluation?.classification_report || null;
  const perClass = selectedModel ? buildPerClassRows(selectedModel) : charts.per_class_performance;
  const hasMetrics = Boolean(metrics && ["accuracy", "precision", "recall", "f1_score"].some((key) => metrics[key] != null));
  const combinedModels = [...textModels, ...imageModels];

  return (
    <section id="analytics" className="scroll-mt-20 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3 sm:p-4" aria-labelledby="analyticsTitle">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-(color:--c-primary) text-white"><ChartNoAxesColumnIncreasing className="h-5 w-5" /></span>
          <div><h2 id="analyticsTitle" className="text-lg font-semibold leading-tight">Model Performance Analytics</h2><p className="text-sm text-(color:--c-muted)">Validation metrics and confusion matrices from the saved model evaluation artifacts.</p></div>
        </div>
        <div className="flex min-w-[220px] flex-col gap-1.5">
          <label htmlFor="analytics-model" className="text-xs font-semibold text-(color:--c-muted)">Selected model</label>
          <select id="analytics-model" value={selectedName} onChange={(event) => setSelectedName(event.target.value)} disabled={loading || !combinedModels.length} className="h-10 min-w-[220px] rounded-lg border border-(color:--c-line) bg-(color:--c-inner) px-3 text-sm text-(color:--c-fg) outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60">
            <optgroup label="Machine Learning (ML)">{textModels.map((model) => <option key={model.model} value={model.model}>{model.model}</option>)}</optgroup>
            <optgroup label="Deep Learning (DL)">{imageModels.map((model) => <option key={model.model} value={model.model}>{model.model}</option>)}</optgroup>
          </select>
        </div>
      </div>
      {loading && <p className="mb-3 rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3 text-sm text-(color:--c-muted)" role="status">Loading trained model evaluation artifacts…</p>}
      {catalogError && <p className="mb-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-800 [.dark_&]:text-amber-200" role="alert">{catalogError} Showing available dashboard evaluation data where possible.</p>}
      {!loading && !catalogError && !combinedModels.length && <p className="mb-3 rounded-lg border border-dashed border-(color:--c-line) p-3 text-sm text-(color:--c-muted)">No trained model evaluation artifacts are available.</p>}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Accuracy" value={pct(metrics?.accuracy)} tone="green" note={selectedModel ? selectedModel.family : "Evaluation"} />
        <StatCard icon={Crosshair} label="Precision" value={pct(metrics?.precision)} tone="sky" note="Macro average" />
        <StatCard icon={ChartNoAxesColumnIncreasing} label="Recall" value={pct(metrics?.recall)} tone="violet" note="Macro average" />
        <StatCard icon={Award} label="F1 Score" value={pct(metrics?.f1_score)} tone="orange" note="Macro average" />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ModelAccuracyChart data={charts.accuracy_comparison} />
        <MetricsComparisonChart data={charts.metrics_comparison} />
        <ConfusionMatrixChart data={selectedModel?.confusion_matrix || charts.confusion_matrix} />
        <PerClassPerformanceChart data={perClass} />
        <ModelComparisonRadarChart data={charts.model_comparison} />
        <InferenceTimeChart data={charts.inference_time_comparison} />
      </div>
      <ClassificationReport rows={hasMetrics ? selectedReport : null} />
      {selectedModel && <p className="mt-2 text-[11px] text-(color:--c-muted)">Evaluation split: {selectedModel.test_samples?.toLocaleString?.() || "—"} samples. Confusion-matrix rows represent true classes; columns represent predicted classes.</p>}
    </section>
  );
}
