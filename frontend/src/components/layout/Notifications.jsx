import { useEffect, useRef, useState } from "react";

const initialNotifications = [
  { id: 1, title: "Document uploaded successfully", detail: "invoice_001.pdf has been uploaded.", time: "2 minutes ago", icon: "i-upload", tone: "blue", isNew: true, system: false },
  { id: 2, title: "Text extraction completed", detail: "Text extracted from invoice_001.pdf.", time: "5 minutes ago", icon: "i-doc", tone: "purple", isNew: true, system: false },
  { id: 3, title: "AI classification completed", detail: "invoice_001.pdf classified as Invoice.", time: "8 minutes ago", icon: "i-brain", tone: "green", isNew: true, system: false },
  { id: 4, title: "Table extraction completed", detail: "Tables extracted from report.pdf.", time: "25 minutes ago", icon: "i-bars", tone: "amber", isNew: false, system: false },
  { id: 5, title: "OCR processing failed", detail: "scanned_doc.pdf failed due to low image quality.", time: "1 hour ago", icon: "i-warn", tone: "rose", isNew: false, system: false },
  { id: 6, title: "System maintenance", detail: "Scheduled maintenance on 10 Sept 2026, 02:00 AM - 04:00 AM.", time: "3 hours ago", icon: "i-gear", tone: "slate", isNew: false, system: true },
];

const iconTone = { blue: "bg-[linear-gradient(135deg,#2563eb,#06b6d4)]", purple: "bg-[linear-gradient(135deg,#6d28d9,#8b5cf6)]", green: "bg-[linear-gradient(135deg,#059669,#22c55e)]", amber: "bg-[linear-gradient(135deg,#c2410c,#f59e0b)]", rose: "bg-[linear-gradient(135deg,#e11d48,#fb7185)]", slate: "bg-[linear-gradient(135deg,#475569,#94a3b8)]" };

export default function Notifications({ isOpen, onToggle, onClose, badgeVisible, onBadgeChange }) {
  const [items, setItems] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");
  const [status, setStatus] = useState("");
  const emptyRef = useRef(null);
  const buttonRef = useRef(null);
  const visibleItems = items;
  const markRead = () => { onBadgeChange(false); setStatus("All notifications marked as read."); };
  const handlePanelKeyDown = (event) => { if (event.shiftKey && event.key === "Delete") { event.preventDefault(); clearAll(); } };
  const clearAll = () => {
    if (!items.length) return;
    setItems([]);
    onBadgeChange(false);
    setStatus("All notifications cleared.");
    requestAnimationFrame(() => emptyRef.current?.focus());
  };
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape" && isOpen) { onClose(); buttonRef.current?.focus(); } };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);
  return (
    <div className="notification-wrap relative flex-none">
      <button ref={buttonRef} id="notificationButton" type="button" className="relative grid size-9 flex-none cursor-pointer place-items-center rounded-full border border-transparent bg-transparent text-[#9cc8ff] transition duration-200 hover:border-blue-400/45 hover:bg-blue-500/[.18] hover:text-white hover:shadow-[0_0_14px_rgba(59,130,246,.25)] focus-visible:border-blue-400/45 focus-visible:bg-blue-500/[.18] focus-visible:text-white focus-visible:shadow-[0_0_14px_rgba(59,130,246,.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc] active:scale-95 min-[701px]:size-[38px]" aria-label={items.length === 0 ? "Notifications, none" : badgeVisible ? "Notifications, 3 unread" : "Notifications, no unread notifications"} title="Notifications" aria-haspopup="true" aria-expanded={isOpen} aria-controls="notificationPanel" onClick={onToggle}>
        <svg className="size-[19px]" aria-hidden="true"><use href="#i-bell" /></svg>
        {badgeVisible && <span id="notificationBadge" className="absolute top-px right-0 grid h-[15px] min-w-[15px] place-items-center rounded-full border-2 border-[#060f42] bg-[#f43f5e] px-[3px] text-[8px] leading-none font-extrabold text-white shadow-[0_0_8px_rgba(244,63,94,.55)]" aria-hidden="true">0</span>}
      </button>
      <section id="notificationPanel" className="absolute top-[calc(100%+10px)] right-0 z-60 w-[min(360px,calc(100vw-24px))] overflow-hidden rounded-xl border border-[rgba(70,136,255,.45)] bg-[linear-gradient(180deg,rgba(5,24,82,.98),rgba(4,15,54,.99))] text-[#e5efff] shadow-[0_18px_42px_rgba(0,0,0,.42),0_0_22px_rgba(36,99,235,.2)]" aria-label="Notifications" hidden={!isOpen} onClick={(event) => event.stopPropagation()} onKeyDown={handlePanelKeyDown}>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-blue-400/[.18] px-4 pt-[15px] pb-[11px]">
          <h2 className="m-0 text-base leading-[1.2]">Notifications</h2>
          <div className="flex flex-wrap items-center gap-2">
            <button id="markNotificationsRead" className="cursor-pointer border-0 bg-transparent text-[10px] text-[#79aefc] hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]" type="button" onClick={markRead}>✓ Mark all read</button>
            <span className="h-4 w-px bg-slate-400/30" aria-hidden="true" />
            <button id="clearNotifications" className="cursor-pointer border-0 bg-transparent text-[10px] text-[#79aefc] hover:text-white focus-visible:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc] focus-visible:rounded-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-[#79aefc]" type="button" aria-label="Clear all notifications" aria-controls="notificationList" aria-keyshortcuts="Shift+Delete" title="Clear all (Shift+Delete)" onClick={clearAll} disabled={!items.length}>✕ Clear all</button>
            <span className="h-4 w-px bg-slate-400/30" aria-hidden="true" />
          </div>
        </div>
        <div className="mx-2.5 grid grid-cols-3 gap-1 border-b border-blue-400/[.16] py-2" role="tablist" aria-label="Notification filters">
          {[['all', `All (0)`], ['unread', `Unread (0)`], ['system', `System (0)`]].map(([key, label]) => <button key={key} className={`notification-tab cursor-pointer rounded-[7px] border border-transparent bg-transparent px-1 py-[7px] text-[10px] text-[#a9bde8] hover:border-blue-500/45 hover:bg-[rgba(37,99,235,.35)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc] [&.is-active]:border-blue-500/45 [&.is-active]:bg-[rgba(37,99,235,.35)] [&.is-active]:text-white ${filter === key ? "is-active" : ""}`} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}>{label}</button>)}
        </div>
        <div id="notificationList" className="max-h-[390px] overflow-y-auto [scrollbar-color:rgba(96,165,250,.55)_transparent] [scrollbar-width:thin] overscroll-contain" aria-label="Notification list">
          {visibleItems.map((item) => <article key={item.id} className="grid grid-cols-[8px_34px_minmax(0,1fr)_auto] items-start gap-[9px] border-b border-blue-400/[.14] p-3 last:border-b-0">
            <span className="mt-[7px] size-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,.8)]" aria-hidden="true" />
            <span className={`grid size-[34px] place-items-center rounded-full ${iconTone[item.tone]} text-white`} aria-hidden="true"><svg className="size-[19px]"><use href={`#${item.icon}`} /></svg></span>
            <div className="min-w-0"><strong className="mb-[3px] block truncate text-[11px] text-[#f8fbff]">{item.title}</strong><span className="block text-[9px] leading-[1.35] text-[#9fb4df]">{item.detail}</span><small className="mt-0.5 block text-[9px] leading-[1.35] text-[#7f96c5]">{item.time}</small></div>
            {item.isNew ? <span className="self-center rounded-full bg-[#1683f7] px-[7px] py-1 text-[8px] font-bold text-white">New</span> : <span />}
          </article>)}
          {!visibleItems.length && <p ref={emptyRef} id="notificationEmpty" className="px-4 py-8 text-center text-[11px] text-[#9fb4df] focus:outline-none" tabIndex={-1}>No notifications. You're all caught up.</p>}
        </div>
        <p id="notificationStatus" className="sr-only" role="status" aria-live="polite">{status}</p>
        <button className="m-2.5 flex w-[calc(100%-20px)] cursor-pointer items-center justify-center gap-1.5 rounded-[7px] border border-blue-500/40 bg-[rgba(16,58,150,.25)] p-2.5 text-[10px] text-[#dbeafe] hover:bg-[rgba(37,99,235,.38)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7dd3fc]" type="button">▣ &nbsp; View all notifications →</button>
      </section>
    </div>
  );
}
