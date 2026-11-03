import Icon from "./Icon.jsx";

export default function EmptyState({ icon = "doc", title, description, compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center text-xs leading-relaxed text-(color:--c-muted) ${compact ? "p-2" : "p-4"}`}>
      <Icon name={icon} className={`${compact ? "mb-1 h-6 w-6" : "mb-3 h-9 w-9"} text-(color:--c-accent)`} />
      {title ? <p className="font-semibold text-(color:--c-accent)">{title}</p> : null}
      <p className="max-w-[220px]">{description}</p>
    </div>
  );
}
