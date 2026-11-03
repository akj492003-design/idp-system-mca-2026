import EmptyState from "./EmptyState.jsx";

export default function ChartCard({ title, children, empty = true, icon = "bars", message = "No evaluation data yet.", description = "Valid evaluation data will appear here." }) {
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-2 text-[13px] font-semibold text-(color:--c-fg)">{title}</h3>
      {empty ? (
        <div className="dashboard-grid flex min-h-[130px] items-center justify-center rounded-md px-2 text-center">
          <EmptyState icon={icon} title={message} description={description} compact />
        </div>
      ) : <div className="h-[160px] min-w-0 w-full">{children}</div>}
    </article>
  );
}
