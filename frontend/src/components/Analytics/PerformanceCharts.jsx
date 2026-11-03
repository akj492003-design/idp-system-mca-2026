import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import ChartCard from "../Common/ChartCard.jsx";

const tooltipStyle = { background: "var(--c-panel)", border: "1px solid var(--c-line)", borderRadius: 8, color: "var(--c-fg)" };
function ChartFrame({ data, children }) {
  return <div className="h-[160px] min-w-0 w-full">{data?.length ? children : null}</div>;
}

export function ModelAccuracyChart({ data }) {
  return <ChartCard title="1. Model Accuracy Comparison" empty={!data?.length} description="Process documents to generate model comparison results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="model" tick={{fontSize:10}} /><YAxis domain={[0,100]} label={{value:"Accuracy (%)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="accuracy" name="Accuracy" fill="#4da3ff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function MetricsComparisonChart({ data }) {
  return <ChartCard title="2. Precision, Recall & F1 Score Comparison" empty={!data?.length} description="Process documents to generate precision, recall and F1 score results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="model" tick={{fontSize:10}} /><YAxis domain={[0,100]} label={{value:"Score (%)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="precision" fill="#4da3ff" /><Bar dataKey="recall" fill="#a78bfa" /><Bar dataKey="f1_score" name="F1 Score" fill="#34d399" /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function ConfusionMatrixChart({ data }) {
  const labels = data?.labels ?? [];
  const matrix = data?.rows ?? data?.matrix ?? [];
  const hasData = labels.length && matrix.length;
  return <ChartCard title="3. Confusion Matrix" empty={!hasData} icon="grid" description="Process documents to generate the confusion matrix.">
    {hasData ? <div className="h-[160px] overflow-auto"><div className="grid gap-1" style={{gridTemplateColumns:`repeat(${labels.length+1}, minmax(34px,1fr))`}}>
      <span />{labels.map(label=><span key={label} className="truncate text-center text-[9px] text-(color:--c-muted)">{label}</span>)}
      {matrix.map((row,i)=><React.Fragment key={labels[i] ?? i}><span className="truncate self-center text-[9px] text-(color:--c-muted)">{labels[i]}</span>{row.map((value,j)=><span key={`${i}-${j}`} title={`${labels[i]} predicted ${labels[j]}: ${value}`} className="grid min-h-7 place-items-center rounded-sm text-[10px]" style={{background:`rgba(77,163,255,${Math.min(.85, .12 + Number(value)/(Math.max(...matrix.flat(),1))*.73)})`}}>{value}</span>)}</React.Fragment>)}
    </div></div> : null}
  </ChartCard>;
}
export function PerClassPerformanceChart({ data }) {
  return <ChartCard title="4. Per-Class Performance" empty={!data?.length} description="Process documents to generate per-class performance results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="class" tick={{fontSize:9}} /><YAxis domain={[0,100]} label={{value:"Score (%)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="precision" fill="#4da3ff" /><Bar dataKey="recall" fill="#a78bfa" /><Bar dataKey="f1_score" name="F1 Score" fill="#34d399" /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function ModelComparisonRadarChart({ data, models }) {
  const rows = Array.isArray(data) ? data : [];
  const keys = models?.length ? models : Object.keys(rows[0] ?? {}).filter(k => k !== "metric");
  return <ChartCard title="5. Model Comparison (Radar Chart)" empty={!rows.length || !keys.length} icon="pent" description="Process documents to generate model comparison results.">
    <ChartFrame data={rows}><ResponsiveContainer width="100%" height="100%"><RadarChart data={rows}><PolarGrid stroke="var(--c-grid)" /><PolarAngleAxis dataKey="metric" tick={{fontSize:9}} /><PolarRadiusAxis domain={[0,100]} tick={{fontSize:8}} /><Tooltip contentStyle={tooltipStyle} /><Legend />{keys.map((key,index)=><Radar key={key} name={key} dataKey={key} stroke={["#4da3ff","#a78bfa","#34d399"][index%3]} fill={["#4da3ff","#a78bfa","#34d399"][index%3]} fillOpacity={0.12} />)}</RadarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function InferenceTimeChart({ data }) {
  return <ChartCard title="6. Inference Time Comparison" empty={!data?.length} message="No live inference timings recorded yet." description="This chart uses measured inference durations recorded by the backend for completed documents. It will populate as new documents are processed.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="model" tick={{fontSize:10}} /><YAxis label={{value:"Time (ms)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="inference_time" name="Inference Time (ms)" fill="#4da3ff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
