import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Icon from "../Common/Icon.jsx";
export default function ClassProbability({ data = null }) {
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Class Probability</h3>
      {Array.isArray(data) && data.length ? (
        <div className="h-[110px] w-full rounded-md border border-(color:--c-line) p-2">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="class" tick={{fontSize:9}} /><YAxis domain={[0,100]} tick={{fontSize:9}} /><Tooltip contentStyle={{background:"var(--c-panel)",border:"1px solid var(--c-line)"}} /><Bar dataKey="probability" fill="#4da3ff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer>
        </div>
      ) : (
        <div className="dashboard-grid flex min-h-[110px] flex-col items-center justify-center rounded-md border border-(color:--c-line) p-4 text-center text-xs text-(color:--c-muted)">
          <Icon name="bars" className="mb-2 h-7 w-7 text-(color:--c-accent)" />
          <p className="font-semibold text-(color:--c-accent)">No prediction results yet.</p>
          <p>Process a document to see class probabilities.</p>
        </div>
      )}
    </article>
  );
}
