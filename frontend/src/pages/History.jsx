import { useEffect, useMemo, useRef, useState } from 'react';
import ActivityTimeline from '../components/history/ActivityTimeline.jsx';
import EventDetails from '../components/history/EventDetails.jsx';
import HistoryFilters from '../components/history/HistoryFilters.jsx';
import Icon from '../components/history/Icon.jsx';
import { DEFAULT_RANGE, DEMO_EVENTS, pad2, presetWindow, RANGES, dateToString, getCalendarDefaults } from '../Data/historyData.js';
import { getHistory } from '../services/idpService.js';
import { getApiErrorMessage } from '../services/api.js';

const demoMode = new URLSearchParams(window.location.search).has('demo');
const EMPTY_EVENTS = [];
const now = new Date();
const today = dateToString(now);
const referenceDate = demoMode ? '2023-09-07' : today;
const calendarDefaults = getCalendarDefaults(referenceDate);

const initialFilters = {
  q: '',
  type: 'All Event Types',
  status: 'All Status',
  range: DEFAULT_RANGE,
  custom: null,
  selected: null,
  expanded: [],
  openDropdown: null,
};

function Header({ rangeLabel, filters, setFilters }) {
  const open = filters.openDropdown === 'range';
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const outside = (event) => { if (!wrapperRef.current?.contains(event.target)) setFilters((current) => ({ ...current, openDropdown: null })); };
    const escape = (event) => { if (event.key === 'Escape') setFilters((current) => ({ ...current, openDropdown: null })); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open, setFilters]);
  return (
    <section className="relative z-40 flex min-h-24 flex-wrap items-center gap-3.5 rounded-[14px] border border-[#12358f] bg-linear-to-b from-[rgba(8,30,88,.78)] to-[rgba(4,18,60,.92)] p-3.5 shadow-[inset_0_0_18px_rgba(20,80,200,.16)] sm:gap-5 sm:p-4 motion-safe:animate-[pulse_8s_ease-in-out_infinite]">
      <div className="grid h-[52px] w-[52px] flex-none place-items-center rounded-full bg-[#1b74ff] shadow-[0_0_16px_rgba(27,116,255,.65)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_22px_rgba(27,116,255,.85)] motion-safe:animate-pulse sm:h-16 sm:w-16"><Icon name="clock" className="h-7 w-7 stroke-2 sm:h-[34px] sm:w-[34px]"/></div>
      <div className="min-w-[180px] flex-1"><h1 className="text-[23px] font-bold sm:text-[28px]">Activity History</h1><p className="mt-0.5 text-[13px] text-[#e6edff] sm:text-sm">View and track all system events, document processing activities, and user actions.</p></div>
      <div ref={wrapperRef} className="relative w-full flex-none sm:ml-auto sm:w-[216px]">
        <button type="button" onClick={() => setFilters((current) => ({ ...current, openDropdown: open ? null : 'range' }))} className="group flex h-[42px] w-full min-w-0 cursor-pointer select-none items-center justify-between gap-3 whitespace-nowrap rounded-lg border border-[#12358f] bg-[#071d5c] px-4 text-base text-white transition-[border-color,box-shadow] duration-150 hover:border-[#2456b8] focus-visible:border-[#2d7bff] focus-visible:outline-2 focus-visible:outline-[#7fb0ff] aria-expanded:border-[#2d7bff] aria-expanded:shadow-[0_0_12px_rgba(27,116,255,.55)] max-sm:px-3 max-sm:text-[15px]" aria-haspopup="listbox" aria-expanded={open} aria-label="Date range">
          <span className="flex min-w-0 items-center gap-3"><Icon name="calendar" className="h-5 w-5"/><span className="truncate">{rangeLabel}</span></span><Icon name="chevron" className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} strokeWidth={2}/>
        </button>
        {open && <div role="listbox" aria-label="Date range options" className="absolute right-0 top-[calc(100%+6px)] z-[60] min-w-full rounded-[10px] border border-[#1b4cc0] bg-linear-to-b from-[#0a2670] to-[#071b55] p-1.5 shadow-[0_14px_34px_rgba(0,0,0,.55)]">
          {RANGES.map((range, index) => <button key={range.label} type="button" role="option" aria-selected={!filters.custom && filters.range === index} onClick={() => setFilters((current) => ({ ...current, range: index, custom: null, openDropdown: null }))} className="relative block w-full truncate rounded-lg px-3 py-2 pl-[42px] text-left text-[17px] leading-[22px] hover:bg-[rgba(27,116,255,.22)] aria-selected:bg-linear-to-r aria-selected:from-[#1b74ff] aria-selected:to-[#6a63ff] aria-selected:shadow-[0_0_10px_rgba(60,110,255,.4)] focus-visible:outline-2 focus-visible:outline-[#7fb0ff]">{!filters.custom && filters.range === index && <span className="absolute left-[15px] font-bold" aria-hidden="true">✓</span>}{range.label}</button>)}
        </div>}
      </div>
    </section>
  );
}

export default function HistoryPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [serverEvents, setServerEvents] = useState([]);
  const [loadError, setLoadError] = useState("");
  useEffect(() => {
    if (demoMode) return undefined;
    let active = true;
    getHistory({ page: 1, limit: 100 }).then((payload) => {
      if (!active) return;
      setServerEvents((payload?.events || []).map((event) => {
        const date = event.timestamp ? new Date(event.timestamp) : null;
        const ts = date && !Number.isNaN(date.getTime())
          ? `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
          : "";
        return { id: String(event.id), docId: String(event.documentId || ""), type: event.type || "Document Uploaded", file: event.fileName || "Document", status: event.status || "Success", ts, user: event.user || "system", desc: event.description || "" };
      }));
      setLoadError("");
    }).catch((error) => { if (active) setLoadError(getApiErrorMessage(error, "Unable to load activity history.")); });
    return () => { active = false; };
  }, []);
  const events = demoMode ? DEMO_EVENTS : serverEvents;
  const filteredEvents = useMemo(() => {
    const query = filters.q.trim().toLowerCase();
    const [lower, upper] = filters.custom
      ? [`${filters.custom.from} ${filters.custom.st}`, `${filters.custom.to} ${filters.custom.et}`]
      : presetWindow(filters.range, referenceDate);
    return events.filter((event) => {
      const queryMatch = !query || [event.file, event.type, event.id, event.docId].some((value) => value.toLowerCase().includes(query));
      const typeMatch = filters.type === 'All Event Types' || event.type === filters.type;
      const statusMatch = filters.status === 'All Status' || event.status === filters.status;
      return queryMatch && typeMatch && statusMatch && event.ts >= lower && event.ts <= upper;
    });
  }, [events, filters.q, filters.type, filters.status, filters.range, filters.custom]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setFilters((current) => ({ ...current, openDropdown: null }));
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  const selectedEvent = filteredEvents.find((event) => event.id === filters.selected) || null;
  const rangeLabel = filters.custom ? 'Custom Range' : RANGES[filters.range].label;
  const asOf = demoMode ? '2023-09-07 14:33' : `${today} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

  const clearFilters = () => setFilters({ ...initialFilters });
  const toggleExpanded = (id) => setFilters((current) => ({
    ...current,
    expanded: current.expanded.includes(id) ? current.expanded.filter((item) => item !== id) : [...current.expanded, id],
  }));

  return (
    <div className="flex min-h-dvh min-w-0 flex-col scroll-smooth overflow-x-hidden bg-[#050b1f] text-[#e6eeff] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] motion-reduce:scroll-auto">
      <main className="mx-auto flex min-h-dvh min-w-0 w-full max-w-[1920px] flex-1 flex-col gap-3.5 p-3 sm:gap-[18px] sm:p-4 xl:px-5 xl:pb-5 2xl:px-7 2xl:pt-6">
        <Header rangeLabel={rangeLabel} filters={filters} setFilters={setFilters}/>
        <HistoryFilters filters={filters} setFilters={setFilters} onClear={clearFilters} calendarDefaults={calendarDefaults}/>
        <section className="grid flex-1 grid-cols-1 items-stretch gap-[17px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            {loadError && <p role="alert" className="mb-2 rounded-lg border border-rose-500/40 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">{loadError}</p>}
            <ActivityTimeline events={filteredEvents} totalEvents={events.length} selected={filters.selected} expanded={filters.expanded} onSelect={(id) => setFilters((current) => ({ ...current, selected: id }))} onToggle={toggleExpanded} demoMode={demoMode} asOf={asOf}/>
          </div>
          <EventDetails event={selectedEvent} onClose={() => setFilters((current) => ({ ...current, selected: null }))}/>
        </section>
      </main>
    </div>
  );
}
