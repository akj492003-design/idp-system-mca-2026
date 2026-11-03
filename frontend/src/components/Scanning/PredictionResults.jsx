import Icon from "../Common/Icon.jsx";
export default function PredictionResults({ prediction = null }) {
  const value = (v) => v == null || v === "" ? "—" : v;
  const confidence = prediction?.confidence_score == null ? "—" : `${(Number(prediction.confidence_score) <= 1 ? Number(prediction.confidence_score)*100 : Number(prediction.confidence_score)).toFixed(2)}%`;
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Prediction Results</h3>
      <dl className="grid grid-cols-2 overflow-hidden rounded-md border border-(color:--c-line) text-xs [&>div]:p-3">
        <div className="flex items-center gap-3 border-b border-r border-(color:--c-line)">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#034a45] text-emerald-300"><Icon name="doc" className="h-5 w-5" /></span>
          <span><dt className="text-(color:--c-muted)">Predicted Class</dt><dd className="font-bold">{value(prediction?.predicted_class)}</dd></span>
        </div>
        <div className="border-b border-(color:--c-line)"><dt className="text-(color:--c-muted)">Confidence Score</dt><dd className="mt-1 font-bold">{confidence}</dd></div>
        <div className="border-r border-(color:--c-line)"><dt className="text-(color:--c-muted)">Selected Model</dt><dd className="mt-1 font-bold">{value(prediction?.model_name)}</dd></div>
        <div><dt className="text-(color:--c-muted)">Processing Time</dt><dd className="mt-1 font-bold">{value(prediction?.processing_time)}</dd></div>
      </dl>
    </article>
  );
}
