import { useEffect, useRef } from 'react';
import Icon from '../history/Icon';
import DateRangeCalendar from './DateRangeCalendar.jsx';
import { RANGES, STATUSES, TYPES } from '../../Data/historyData.js';

const controlClass = 'flex h-[46px] w-full min-w-0 cursor-pointer select-none items-center justify-between gap-3 whitespace-nowrap rounded-lg border border-[#12358f] bg-[#071d5c] px-4 text-base text-white transition-[border-color,box-shadow] duration-150 hover:border-[#2456b8] focus-visible:border-[#2d7bff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7fb0ff] aria-expanded:border-[#2d7bff] aria-expanded:shadow-[0_0_12px_rgba(27,116,255,.55)] max-sm:px-3 max-sm:text-[15px] group';
const menuClass = 'absolute left-0 top-[calc(100%+6px)] z-[60] min-w-full rounded-[10px] border border-[#1b4cc0] bg-linear-to-b from-[#0a2670] to-[#071b55] p-2 shadow-[0_14px_34px_rgba(0,0,0,.55)]';

function FilterDropdown({ name, label, options, value, onChange, open, setOpen, wideClass = '' }) {
  const rootRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const handlePointer = (event) => { if (!rootRef.current?.contains(event.target)) setOpen(null); };
    const handleKey = (event) => { if (event.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, setOpen]);
  return (
    <div ref={rootRef} className={`relative min-w-0 sm:flex-1 sm:basis-[150px] ${wideClass}`}>
      <button type="button" className={controlClass} aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => setOpen(open ? null : name)}>
        <span className="truncate">{value}</span><Icon name="chevron" className={`h-4 w-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} strokeWidth={2}/>
      </button>
      {open && <div role="listbox" aria-label={label} className={`${menuClass} ${name === 'type' ? 'max-h-[372px] overflow-y-auto sm:min-w-[236px]' : name === 'status' ? 'sm:min-w-[190px]' : ''}`}>
        {options.map((option) => <button key={option} type="button" role="option" aria-selected={option === value} onClick={() => { onChange(option); setOpen(null); }} className={`relative block w-full truncate rounded-lg px-3 py-2 text-left text-base leading-[22px] hover:bg-[rgba(27,116,255,.22)] aria-selected:bg-linear-to-r aria-selected:from-[#1b74ff] aria-selected:to-[#6a63ff] aria-selected:shadow-[0_0_10px_rgba(60,110,255,.4)] focus-visible:outline-2 focus-visible:outline-[#7fb0ff] ${name === 'range' ? 'pl-[42px] text-[17px]' : ''}`}>
          {name === 'range' && option === value && <span className="absolute left-[15px] font-bold" aria-hidden="true">✓</span>}{option}
        </button>)}
      </div>}
    </div>
  );
}

export default function HistoryFilters({ filters, setFilters, onClear, calendarDefaults }) {
  const sectionRef = useRef(null);
  useEffect(() => {
    if (!filters.openDropdown) return undefined;
    const outside = (event) => { if (!sectionRef.current?.contains(event.target)) setFilters((current) => ({ ...current, openDropdown: null })); };
    const escape = (event) => { if (event.key === 'Escape') setFilters((current) => ({ ...current, openDropdown: null })); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [filters.openDropdown, setFilters]);
 const [, typeOpen, statusOpen, customOpen] =
  ['range', 'type', 'status', 'custom'].map(
    (name) => filters.openDropdown === name
  );
  const setOpen = (name) => setFilters((current) => ({ ...current, openDropdown: name }));
  const rangeLabel = filters.custom ? 'Custom Range' : RANGES[filters.range].label;
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value, selected: key === 'q' ? current.selected : current.selected }));

  return (
    <section ref={sectionRef} className="relative z-30 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3.5 xl:flex-nowrap" aria-label="Filters">
      <label className="flex h-[46px] cursor-text items-center gap-3.5 rounded-lg border border-[#12358f] bg-[#071d5c] px-3.5 text-[15px] focus-within:border-[#2d7bff] focus-within:shadow-[0_0_12px_rgba(27,116,255,.55)] max-sm:col-span-full sm:basis-full sm:px-5 xl:min-w-0 xl:flex-1 xl:basis-[300px]">
        <Icon name="search" className="h-[22px] w-[22px] text-white"/>
        <input type="search" value={filters.q} onChange={(event) => setFilter('q', event.target.value)} autoComplete="off" aria-label="Search events by document name, event type or ID" placeholder="Search by document name, event type or ID..." className="min-w-0 flex-1 bg-transparent text-[#e6edff] outline-hidden placeholder:text-[#cfdcff] focus-visible:outline-2 focus-visible:outline-[#7fb0ff]" />
      </label>
      <FilterDropdown name="type" label="Event type" options={['All Event Types', ...Object.keys(TYPES)]} value={filters.type} onChange={(value) => setFilter('type', value)} open={typeOpen} setOpen={setOpen} wideClass="xl:w-[177px] xl:flex-none"/>
      <FilterDropdown name="status" label="Status" options={['All Status', ...STATUSES]} value={filters.status} onChange={(value) => setFilter('status', value)} open={statusOpen} setOpen={setOpen} wideClass="xl:w-[150px] xl:flex-none"/>
      <div className="relative min-w-0 max-sm:col-span-full sm:flex-1 sm:basis-[150px] xl:relative xl:w-[210px] xl:flex-none">
        <button type="button" onClick={() => setOpen(customOpen ? null : 'custom')} aria-haspopup="dialog" aria-expanded={customOpen} aria-controls="calMenu" className={`${controlClass} ${filters.custom ? 'border-[#2d7bff] shadow-[0_0_10px_rgba(27,116,255,.45)]' : ''}`}>
          <span className="flex min-w-0 items-center gap-3"><Icon name="calendar" className="h-5 w-5"/><span className="truncate">{rangeLabel}</span></span><Icon name="chevron" className={`h-4 w-4 transition-transform duration-150 ${customOpen ? 'rotate-180' : ''}`} strokeWidth={2}/>
        </button>
        {customOpen && <DateRangeCalendar key={`${filters.custom?.from || calendarDefaults.from}-${filters.custom?.to || calendarDefaults.to}`} initialValue={filters.custom || calendarDefaults} onApply={(custom) => { setFilters((current) => ({ ...current, custom, openDropdown: null })); }} onCancel={() => setOpen(null)}/>}
      </div>
      <button type="button" onClick={onClear} className={`${controlClass} justify-center gap-2.5 max-sm:col-span-full sm:w-[136px] sm:flex-none`}><Icon name="refresh" className="h-5 w-5"/>Clear Filters</button>
    </section>
  );
}
