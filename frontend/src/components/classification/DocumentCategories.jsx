import { Link } from "react-router-dom";

export default function DocumentCategories({ categories = {} }) {
  const total = Number(categories.form || 0) + Number(categories.invoice || 0) + Number(categories.resume || 0);
  const entries = [
    { key: "invoice", label: "Invoice", icon: "#i-doc", gradient: "bg-[linear-gradient(135deg,#1b6bff,#1555e0)]", bar: "bg-[linear-gradient(90deg,#1f6bff,#2d9bff)]", link: "border-[#1a4fc8] bg-[#0f3a9e] text-[#3fb4ff]" },
    { key: "form", label: "Form", icon: "#i-clipboard", gradient: "bg-[linear-gradient(135deg,#17d6a0,#0fae7f)]", bar: "bg-[linear-gradient(90deg,#12c995,#1be8b0)]", link: "border-[#12607c] bg-[#0b3d6b] text-[#26e0a8]" },
    { key: "resume", label: "Resume", icon: "#i-user", gradient: "bg-[linear-gradient(135deg,#b25bff,#7d3ae8)]", bar: "bg-[linear-gradient(90deg,#8b3dff,#b062ff)]", link: "border-[#4a3fc0] bg-[#2b2a8a] text-[#b78bff]" },
  ];
  return (
    <article className="rounded-[0.625rem] transition-[transform,border-color,box-shadow] duration-[220ms] ease-out hover:-translate-y-0.5 hover:border-[#3fb4ff] hover:shadow-[0_8px_24px_rgba(13,52,160,0.18)] border border-[#1a3a9e] bg-[rgba(8,30,110,0.45)] p-[0.875rem] [box-shadow:inset_0_0_40px_rgba(20,70,200,0.12),0_0_0_1px_rgba(30,90,255,0.05)] [@media(min-width:1366px)_and_(max-width:1439px)]:p-3">
      <div className="flex items-center gap-[0.875rem]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] border border-[#2a5cff] bg-[linear-gradient(135deg,#1d4fd8,#143aa8)] leading-[0] text-[#dbe7ff]"><svg className="h-5 w-5 fill-current" aria-hidden="true"><use href="#i-doc" xlinkHref="#i-doc" /></svg></div>
        <div><h2 className="text-[1rem] font-semibold">Document Categories</h2><p className="mt-[0.2rem] text-[0.72rem] text-[#cdd9f7]">Your trained model can classify documents into the following categories.</p></div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4 [@media(min-width:1366px)_and_(max-width:1439px)]:mt-[0.625rem] [@media(min-width:1366px)_and_(max-width:1439px)]:gap-3 [@media(min-width:1280px)_and_(max-width:1365px)]:gap-[0.7rem] [@media(max-width:900px)]:grid-cols-1">
        {entries.map((entry) => { const count = Number(categories[entry.key] || 0); const percent = total ? Math.round(count / total * 100) : 0; return (
          <div key={entry.key} className="rounded-lg border border-[#1a3a9e] bg-[rgba(6,25,95,0.55)] [padding:0.875rem_1rem_1rem]">
            <div className={`mb-2 flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-[0.625rem] ${entry.gradient} leading-[0] text-white [@media(min-width:1280px)_and_(max-height:750px)]:h-9 [@media(min-width:1280px)_and_(max-height:750px)]:w-9`}><svg className="h-[1.625rem] w-[1.625rem] fill-current" aria-hidden="true"><use href={entry.icon} xlinkHref={entry.icon} /></svg></div>
            <h3 className="text-[1rem] font-semibold">{entry.label}</h3><span className="text-[0.75rem] text-[#9db4ee]">{count.toLocaleString()} documents</span>
            <div className="mt-2 mb-3 flex items-center gap-3 text-[0.75rem]"><div className="h-2 flex-1 overflow-hidden rounded-sm bg-[#0b2468]" role="progressbar" aria-label={`${entry.label} share of documents`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><div className={`h-full rounded-sm ${entry.bar}`} style={{ width: `${percent}%` }} /></div><span>{percent}%</span></div>
            <Link to={`/classification?type=${entry.key}`} className={`flex h-[1.875rem] items-center justify-center gap-[0.375rem] rounded-sm border text-[0.75rem] font-semibold no-underline [transition:filter_0.2s] hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3fb4ff] ${entry.link}`}>View Results <svg className="h-[0.8125rem] w-[0.8125rem] fill-current" aria-hidden="true"><use href="#i-arrow-right" xlinkHref="#i-arrow-right" /></svg></Link>
          </div>
        ); })}
      </div>
    </article>
  );
}
