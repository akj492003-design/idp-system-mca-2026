import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getModelMetrics } from "../services/idpService.js";

const panel = "rounded-xl border border-blue-400/20 bg-[linear-gradient(145deg,rgba(12,31,94,.85),rgba(5,13,48,.95))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:text-[#203653] [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.07)]";
const percent = (v) => `${(Number(v || 0) * 100).toFixed(2)}%`;

function MetricsChart({ title, models, metricKeys, yLabel = "Score (%)" }) {
  const data = models.map((m) => ({ model: m.model, ...Object.fromEntries(metricKeys.map((key) => [key, Number((m[key] || 0) * 100)])) }));
  return <section className={panel}><h2 className="mb-3 text-sm font-semibold">{title}</h2><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 8, right: 10, bottom: 26, left: 0 }}><CartesianGrid stroke="var(--c-grid)" strokeDasharray="3 3"/><XAxis dataKey="model" angle={-14} textAnchor="end" interval={0} height={55} tick={{fontSize:10,fill:"var(--c-muted)"}}/><YAxis domain={[0,100]} tick={{fontSize:10,fill:"var(--c-muted)"}} label={{value:yLabel,angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}}/><Tooltip formatter={(v) => `${Number(v).toFixed(2)}%`} contentStyle={{background:"var(--c-panel)",border:"1px solid var(--c-line)",borderRadius:8,color:"var(--c-fg)"}}/><Legend wrapperStyle={{fontSize:11}}/>{metricKeys.map((key) => <Bar key={key} dataKey={key} name={key === "f1_score" ? "Macro F1" : key[0].toUpperCase()+key.slice(1)} radius={[3,3,0,0]} />)}</BarChart></ResponsiveContainer></div></section>;
}

function MetricTable({ title, models }) {
  return <section className={`${panel} overflow-hidden`}><h2 className="mb-3 text-sm font-semibold">{title}</h2><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-blue-200 [.light_&]:text-[#526782]"><tr className="border-b border-blue-400/20"><th className="py-2 pr-3">Model</th><th className="py-2 pr-3">Accuracy</th><th className="py-2 pr-3">Macro Precision</th><th className="py-2 pr-3">Macro Recall</th><th className="py-2 pr-3">Macro F1</th><th className="py-2">Samples</th></tr></thead><tbody>{models.map((m) => <tr key={m.model} className="border-b border-blue-400/10"><td className="py-2.5 pr-3 font-semibold">{m.model}{m.selected_model && <span className="ml-2 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] text-emerald-300">Selected for live text inference</span>}</td><td className="py-2.5 pr-3 tabular-nums">{percent(m.accuracy)}</td><td className="py-2.5 pr-3 tabular-nums">{percent(m.precision)}</td><td className="py-2.5 pr-3 tabular-nums">{percent(m.recall)}</td><td className="py-2.5 pr-3 tabular-nums">{percent(m.f1_score)}</td><td className="py-2.5 tabular-nums">{m.test_samples.toLocaleString()}</td></tr>)}</tbody></table></div></section>;
}

function SelectedModelEvaluation({ models, selectedName, onSelect }) {
  const model = models.find((item) => item.model === selectedName) || models[0];
  const matrix = model?.confusion_matrix;
  const peak = matrix?.rows?.length ? Math.max(1, ...matrix.rows.flat()) : 1;
  return <section className={`${panel} space-y-4`}>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="text-sm font-semibold">Selected model evaluation</h2><p className="mt-1 text-xs text-blue-200 [.light_&]:text-[#526782]">Metrics and confusion matrix update from the selected trained model artifact.</p></div>
      <label className="flex flex-col gap-1 text-xs font-semibold text-blue-200 [.light_&]:text-[#526782]">Model
        <select value={model?.model || ""} onChange={(event) => onSelect(event.target.value)} className="min-w-[230px] rounded-lg border border-blue-400/30 bg-[#071638] px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-500 [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:text-[#203653]">
          <optgroup label="Machine Learning (ML)">{models.filter((item) => String(item.family || "").toLowerCase().includes("traditional")).map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}</optgroup>
          <optgroup label="Deep Learning (DL)">{models.filter((item) => !String(item.family || "").toLowerCase().includes("traditional")).map((item) => <option key={item.model} value={item.model}>{item.model}</option>)}</optgroup>
        </select>
      </label>
    </div>
    {model ? <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Accuracy",model.accuracy],["Precision",model.precision],["Recall",model.recall],["F1 score",model.f1_score]].map(([label,value]) => <article key={label} className="rounded-lg border border-blue-400/20 bg-[#091b40] p-3 [.light_&]:border-[#d2deed] [.light_&]:bg-[#f7f9fd]"><p className="text-xs text-blue-200 [.light_&]:text-[#526782]">{label}</p><p className="mt-1 text-xl font-bold">{percent(value)}</p></article>)}</div>
      <div className="rounded-lg border border-blue-400/15 p-3 [.light_&]:border-[#d2deed]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-semibold">Confusion matrix — {model.model}</h3><span className="text-[11px] text-blue-200 [.light_&]:text-[#526782]">{model.test_samples?.toLocaleString?.() || 0} test samples</span></div>
        {matrix?.rows?.length ? <div className="overflow-x-auto"><table className="w-full min-w-[320px] table-fixed text-center text-xs"><thead><tr><th className="px-2 py-2 text-left text-blue-300 [.light_&]:text-[#405a7b] [.light_&]:text-[#526782]">True ↓ / Pred. →</th>{matrix.labels.map((label) => <th key={label} className="px-2 py-2 capitalize text-blue-200 [.light_&]:text-[#526782]">{label}</th>)}</tr></thead><tbody>{matrix.rows.map((row, r) => <tr key={matrix.labels[r]}><th className="px-2 py-2 text-left capitalize text-blue-200 [.light_&]:text-[#526782]">{matrix.labels[r]}</th>{row.map((value, c) => <td key={`${r}-${c}`} className="rounded-sm px-2 py-2 font-semibold tabular-nums" style={{ backgroundColor: r === c ? `rgba(16,185,129,${0.12 + 0.48 * value / peak})` : `rgba(96,165,250,${0.08 + 0.28 * value / peak})` }} title={`${matrix.labels[r]} predicted as ${matrix.labels[c]}: ${value}`}>{value.toLocaleString()}</td>)}</tr>)}</tbody></table></div> : <p className="py-6 text-center text-sm text-blue-200 [.light_&]:text-[#526782]">No confusion matrix is available for this model.</p>}
      </div>
    </> : <p className="text-sm text-blue-200 [.light_&]:text-[#526782]">No trained model selected.</p>}
  </section>;
}

export default function ModelPerformancePage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");
  const [selectedName, setSelectedName] = useState("");
  useEffect(() => { let active = true; getModelMetrics().then((data) => { if (active) { setMetrics(data); setSelectedName(data?.text_models?.find((item) => item.selected_model)?.model || data?.text_models?.[0]?.model || ""); } }).catch((e) => { if (active) setError(e?.response?.data?.message || "Saved model metrics could not be loaded."); }); return () => { active = false; }; }, []);
  const combined = useMemo(() => [...(metrics?.text_models || []), ...(metrics?.image_models || [])], [metrics]);
  return <div className="min-h-dvh bg-[#050b1f] px-3 py-5 text-[#e6eeff] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] sm:px-6 sm:py-8"><main className="mx-auto max-w-7xl space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300">Evaluation dashboard</p><h1 className="mt-1 text-2xl font-bold sm:text-3xl">Model Performance</h1><p className="mt-1 text-sm text-blue-200 [.light_&]:text-[#526782]">Saved evaluation metrics from the supplied ML/DL notebook and output archive.</p></div><div className="flex gap-2"><Link to="/scanning" className="rounded-lg border border-blue-400/30 px-4 py-2 text-sm hover:bg-blue-500/15">Scanning</Link><Link to="/home" className="rounded-lg border border-blue-400/30 px-4 py-2 text-sm hover:bg-blue-500/15">Dashboard</Link></div></header>
    {error && <p className="rounded-lg border border-rose-400/30 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</p>}
    {!metrics && !error && <p className={panel}>Loading saved evaluation reports…</p>}
    {metrics && <>
      <div className="grid gap-3 sm:grid-cols-3"><article className={panel}><p className="text-xs text-blue-200 [.light_&]:text-[#526782]">Held-out test documents</p><p className="mt-1 text-2xl font-bold">{metrics.dataset.test_samples.toLocaleString()}</p></article><article className={panel}><p className="text-xs text-blue-200 [.light_&]:text-[#526782]">Class count</p><p className="mt-1 text-2xl font-bold">{metrics.dataset.classes.length}</p></article><article className={panel}><p className="text-xs text-blue-200 [.light_&]:text-[#526782]">Evaluated models</p><p className="mt-1 text-2xl font-bold">{combined.length}</p></article></div>
      <div className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100 [.light_&]:border-amber-200 [.light_&]:bg-amber-50 [.light_&]:text-amber-900">{metrics.dataset.note} All charts below use the same {metrics.dataset.test_samples.toLocaleString()}-sample held-out test split reported by the supplied output archive.</div>
      <SelectedModelEvaluation models={combined} selectedName={selectedName} onSelect={setSelectedName}/>
      <MetricTable title="Traditional machine-learning models (TF-IDF)" models={metrics.text_models}/>
      <MetricsChart title="Traditional ML — accuracy, precision, recall and F1" models={metrics.text_models} metricKeys={["accuracy","precision","recall","f1_score"]}/>
      <MetricTable title="Deep-learning image models" models={metrics.image_models}/>
      <MetricsChart title="Deep learning — accuracy, precision, recall and F1" models={metrics.image_models} metricKeys={["accuracy","precision","recall","f1_score"]}/>
      <section className={`${panel} overflow-hidden`}><h2 className="mb-3 text-sm font-semibold">Per-class evaluation</h2><div className="grid gap-4 lg:grid-cols-2">{combined.map((model) => <div key={model.model} className="rounded-lg border border-blue-400/15 p-3"><h3 className="mb-2 text-xs font-semibold">{model.model}</h3><div className="overflow-x-auto"><table className="w-full min-w-[360px] text-xs"><thead className="text-blue-300 [.light_&]:text-[#405a7b]"><tr><th className="py-1 text-left">Class</th><th className="py-1 text-right">Precision</th><th className="py-1 text-right">Recall</th><th className="py-1 text-right">F1</th></tr></thead><tbody>{Object.entries(model.classification_report).map(([label, row]) => <tr key={label}><td className="py-1 capitalize">{label}</td><td className="py-1 text-right tabular-nums">{percent(row.precision)}</td><td className="py-1 text-right tabular-nums">{percent(row.recall)}</td><td className="py-1 text-right tabular-nums">{percent(row.f1_score)}</td></tr>)}</tbody></table></div></div>)}</div></section>
    </>}
  </main></div>;
}
