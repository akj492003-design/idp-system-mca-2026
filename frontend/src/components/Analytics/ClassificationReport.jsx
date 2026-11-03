import Icon from "../Common/Icon.jsx";
export default function ClassificationReport({ rows = null }) {
  const valid = Array.isArray(rows) && rows.length > 0;
  return (
    <article className="mt-3 rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-2 text-sm font-semibold text-(color:--c-fg)">7. Classification Report</h3>
      <div className="overflow-x-auto rounded-md border border-(color:--c-line)">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="border-b border-(color:--c-line) text-(color:--c-muted)">
            <tr><th scope="col" className="px-3 py-1.5 font-normal">Class</th><th scope="col" className="px-3 py-1.5 text-center font-normal">Precision</th><th scope="col" className="px-3 py-1.5 text-center font-normal">Recall</th><th scope="col" className="px-3 py-1.5 text-center font-normal">F1 Score</th><th scope="col" className="px-3 py-1.5 text-center font-normal">Support</th></tr>
          </thead>
          <tbody>{valid ? rows.map(row=><tr key={row.class} className="border-b border-(color:--c-line) last:border-0"><td className="px-3 py-2">{row.class}</td><td className="px-3 py-2 text-center">{row.precision ?? "—"}</td><td className="px-3 py-2 text-center">{row.recall ?? "—"}</td><td className="px-3 py-2 text-center">{row.f1_score ?? "—"}</td><td className="px-3 py-2 text-center">{row.support ?? "—"}</td></tr>) :
            <tr><td colSpan="5" className="px-3 py-5"><div className="flex flex-col items-center gap-1 text-center text-(color:--c-muted)"><Icon name="doc" className="h-7 w-7 text-(color:--c-accent)" /><p className="font-semibold text-(color:--c-accent)">No evaluation data yet.</p><p>Process documents to generate the classification report.</p></div></td></tr>}
          </tbody>
        </table>
      </div>
    </article>
  );
}
