export default function ClassificationPageHeader() {
  return (
    <section className="relative mt-3 flex min-h-[5.5rem] items-center gap-[1.125rem] overflow-hidden rounded-[0.625rem] border border-[#1a3a9e] bg-[linear-gradient(90deg,rgba(10,40,140,0.65),rgba(8,35,130,0.45))] pr-6 pl-5 [box-shadow:inset_0_0_40px_rgba(20,70,200,0.12),0_0_0_1px_rgba(30,90,255,0.05)] motion-safe:animate-[pulse_8s_ease-in-out_infinite] [@media(min-width:1366px)_and_(max-width:1439px)_and_(min-height:901px)]:mt-2 [@media(min-width:1366px)_and_(max-width:1439px)_and_(min-height:901px)]:min-h-[4.75rem] [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:min-h-[4.5rem] [@media(min-width:1280px)_and_(max-height:900px)]:mt-[0.35rem] [@media(min-width:1280px)_and_(min-height:751px)_and_(max-height:900px)]:min-h-16 [@media(min-width:1280px)_and_(max-height:750px)]:min-h-14 [@media(max-width:560px)]:flex-col [@media(max-width:560px)]:items-start [@media(max-width:560px)]:pb-3">

                        <div className="z-[2] flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#2b7bff,#1555e0)] leading-[0] text-white shadow-[0_0_22px_rgba(40,120,255,0.55)]">
                            <svg className="h-[2.1rem] w-[2.1rem] shrink-0 fill-current" aria-hidden="true"><use href="#i-brain" xlinkHref="#i-brain"></use></svg>
                        </div>
                        <div>
                            <h1 className="text-[1.5rem] font-bold tracking-[-0.01em] [@media(min-width:1280px)_and_(max-height:900px)]:text-[1.35rem]">Classification</h1>
                            <p className="mt-1 text-[0.8125rem] text-[#c5d4ff] opacity-95">Identify, categorize, and review your documents using trained ML/DL models.</p>
                        </div>


                        <svg className="pointer-events-none absolute top-1/2 right-[4.5rem] z-[1] h-[11.5rem] w-[11.5rem] -translate-y-1/2 fill-current text-[#6ea8ff] opacity-[0.18] before:absolute before:-inset-[20%] before:-z-1 before:rounded-full before:bg-[radial-gradient(circle,rgba(60,140,255,0.25)_0%,transparent_70%)] [@media(min-width:1280px)_and_(max-width:1365px)]:right-16 [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:h-[9.5rem] [@media(min-width:1280px)_and_(max-width:1365px)_and_(min-height:901px)]:w-[9.5rem] [@media(min-width:1280px)_and_(max-height:900px)]:h-[8.5rem] [@media(min-width:1280px)_and_(max-height:900px)]:w-[8.5rem] [@media(min-width:1280px)_and_(max-height:750px)]:hidden [@media(max-width:1279px)]:right-14 [@media(max-width:1279px)]:h-32 [@media(max-width:1279px)]:w-32 [@media(max-width:1279px)]:opacity-[0.12] [@media(max-width:900px)]:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                            <use href="#i-brain" xlinkHref="#i-brain"></use>
                            <circle cx="6" cy="7" r="0.7" fill="currentColor" opacity="0.9"/>
                            <circle cx="18" cy="7" r="0.7" fill="currentColor" opacity="0.9"/>
                            <circle cx="5" cy="13" r="0.6" fill="currentColor" opacity="0.8"/>
                            <circle cx="19" cy="13" r="0.6" fill="currentColor" opacity="0.8"/>
                            <circle cx="8" cy="18" r="0.55" fill="currentColor" opacity="0.7"/>
                            <circle cx="16" cy="18" r="0.55" fill="currentColor" opacity="0.7"/>
                            <circle cx="12" cy="4.5" r="0.5" fill="currentColor" opacity="0.6"/>
                            <path d="M6 7 L12 5.5 L18 7" stroke="currentColor" strokeWidth="0.6" opacity="0.5"/>
                            <path d="M5 13 L12 11 L19 13" stroke="currentColor" strokeWidth="0.55" opacity="0.45"/>
                            <path d="M8 18 L12 16 L16 18" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
                            <path d="M6 7 L5 13 M18 7 L19 13 M5 13 L8 18 M19 13 L16 18"
                                  stroke="currentColor" strokeWidth="0.45" opacity="0.35"/>
                        </svg>


                        <span className="absolute top-4 right-6 z-[3] inline-flex items-center gap-[0.4rem] rounded-full bg-[linear-gradient(90deg,#1b8cff,#19b6ff)] px-[0.9rem] py-[0.35rem] text-[0.7rem] font-semibold whitespace-nowrap text-white shadow-[0_2px_10px_rgba(0,100,255,0.35)] [@media(max-width:560px)]:static [@media(max-width:560px)]:mt-2">
                            <svg className="h-[0.85rem] w-[0.85rem] shrink-0 fill-current" aria-hidden="true"><use href="#i-brain" xlinkHref="#i-brain"></use></svg>
                            ML / DL
                        </span>
                    </section>
  );
}
