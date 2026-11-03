export default function ClassificationStats({ stats = {} }) {
  return (
    <section className="grid grid-cols-4 gap-4 [@media(min-width:901px)_and_(max-width:1279px)]:grid-cols-2 [@media(max-width:900px)]:grid-cols-1">
                        <article className="flex min-h-[5.5rem] items-center gap-4 rounded-[0.625rem] border border-[#1a3a9e] bg-[rgba(8,30,110,0.45)] px-5 [box-shadow:inset_0_0_40px_rgba(20,70,200,0.12),0_0_0_1px_rgba(30,90,255,0.05)] [@media(min-width:1366px)_and_(max-width:1439px)_and_(min-height:901px)]:min-h-20 [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:min-h-[4.75rem] [@media(min-width:1280px)_and_(min-height:751px)_and_(max-height:900px)]:min-h-[4.25rem] [@media(min-width:1280px)_and_(max-height:750px)]:min-h-[3.75rem]">
                            <div className="flex h-[3.375rem] w-[3.375rem] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1b6bff,#1555e0)] leading-[0] text-white shadow-[0_0_18px_rgba(60,130,255,0.35)]">
                                <svg className="h-7 w-7 fill-current" aria-hidden="true"><use href="#i-doc" xlinkHref="#i-doc"></use></svg>
                            </div>
                            <div>
                                <div className="text-[0.875rem]">Total Documents</div>
                                <div className="my-0.5 text-[1.625rem] leading-[1.2] font-semibold">{Number(stats.total || 0).toLocaleString()}</div>
                                <div className="flex items-center gap-1 text-[0.75rem] font-semibold text-[#1be08c]">
                                    <svg className="h-[0.8125rem] w-[0.8125rem] fill-current" aria-hidden="true"><use href="#i-arrow-up" xlinkHref="#i-arrow-up"></use></svg> 0% since last week
                                </div>
                            </div>
                        </article>

                        <article className="flex min-h-[5.5rem] items-center gap-4 rounded-[0.625rem] border border-[#1a3a9e] bg-[rgba(8,30,110,0.45)] px-5 [box-shadow:inset_0_0_40px_rgba(20,70,200,0.12),0_0_0_1px_rgba(30,90,255,0.05)] [@media(min-width:1366px)_and_(max-width:1439px)_and_(min-height:901px)]:min-h-20 [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:min-h-[4.75rem] [@media(min-width:1280px)_and_(min-height:751px)_and_(max-height:900px)]:min-h-[4.25rem] [@media(min-width:1280px)_and_(max-height:750px)]:min-h-[3.75rem]">
                            <div className="flex h-[3.375rem] w-[3.375rem] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#17d6a0,#0fae7f)] leading-[0] text-white shadow-[0_0_18px_rgba(20,210,160,0.45)]">
                                <svg className="h-7 w-7 fill-current" aria-hidden="true"><use href="#i-check" xlinkHref="#i-check"></use></svg>
                            </div>
                            <div>
                                <div className="text-[0.875rem]">Classified</div>
                                <div className="my-0.5 text-[1.625rem] leading-[1.2] font-semibold">{Number((stats.form || 0) + (stats.invoice || 0) + (stats.resume || 0)).toLocaleString()}</div>
                                <div className="flex items-center gap-1 text-[0.75rem] font-semibold text-[#1be08c]">
                                    <svg className="h-[0.8125rem] w-[0.8125rem] fill-current" aria-hidden="true"><use href="#i-arrow-up" xlinkHref="#i-arrow-up"></use></svg> 0% since last week
                                </div>
                            </div>
                        </article>

                        <article className="flex min-h-[5.5rem] items-center gap-4 rounded-[0.625rem] border border-[#1a3a9e] bg-[rgba(8,30,110,0.45)] px-5 [box-shadow:inset_0_0_40px_rgba(20,70,200,0.12),0_0_0_1px_rgba(30,90,255,0.05)] [@media(min-width:1366px)_and_(max-width:1439px)_and_(min-height:901px)]:min-h-20 [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:min-h-[4.75rem] [@media(min-width:1280px)_and_(min-height:751px)_and_(max-height:900px)]:min-h-[4.25rem] [@media(min-width:1280px)_and_(max-height:750px)]:min-h-[3.75rem]">
                            <div className="flex h-[3.375rem] w-[3.375rem] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffbe2e,#f59a0a)] leading-[0] text-white shadow-[0_0_18px_rgba(255,180,40,0.45)]">
                                <svg className="h-7 w-7 fill-current" aria-hidden="true"><use href="#i-warn" xlinkHref="#i-warn"></use></svg>
                            </div>
                            <div>
                                <div className="text-[0.875rem]">Needs Review</div>
                                <div className="my-0.5 text-[1.625rem] leading-[1.2] font-semibold">{Number(stats.unclassified || 0).toLocaleString()}</div>
                                <div className="flex items-center gap-1 text-[0.75rem] font-semibold text-[#ff4d5e]">
                                    <svg className="h-[0.8125rem] w-[0.8125rem] fill-current" aria-hidden="true"><use href="#i-arrow-up" xlinkHref="#i-arrow-up"></use></svg> 0% since last week
                                </div>
                            </div>
                        </article>

                        <article className="flex min-h-[5.5rem] items-center gap-4 rounded-[0.625rem] border border-[#1a3a9e] bg-[rgba(8,30,110,0.45)] px-5 [box-shadow:inset_0_0_40px_rgba(20,70,200,0.12),0_0_0_1px_rgba(30,90,255,0.05)] [@media(min-width:1366px)_and_(max-width:1439px)_and_(min-height:901px)]:min-h-20 [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:min-h-[4.75rem] [@media(min-width:1280px)_and_(min-height:751px)_and_(max-height:900px)]:min-h-[4.25rem] [@media(min-width:1280px)_and_(max-height:750px)]:min-h-[3.75rem]">
                            <div className="flex h-[3.375rem] w-[3.375rem] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#b25bff,#7d3ae8)] leading-[0] text-white shadow-[0_0_18px_rgba(160,80,255,0.45)]">
                                <svg className="h-7 w-7 fill-current" aria-hidden="true"><use href="#i-grid" xlinkHref="#i-grid"></use></svg>
                            </div>
                            <div>
                                <div className="text-[0.875rem]">Categories</div>
                                <div className="my-0.5 text-[1.625rem] leading-[1.2] font-semibold">{[stats.form, stats.invoice, stats.resume].filter((value) => Number(value) > 0).length}</div>
                                <div className="flex items-center gap-1 text-[0.75rem] font-normal text-[#9db4ee]">No change</div>
                            </div>
                        </article>
                    </section>
  );
}
