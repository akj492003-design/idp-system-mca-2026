import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { MONTHS, WEEKDAYS, validDate, validTime } from '../../Data/historyData.js';

function makeMonth(year, month, from, to) {
  const lead = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cellCount = Math.ceil((lead + daysInMonth) / 7) * 7;
  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(Date.UTC(year, month, 1 - lead + index));
    const value = date.toISOString().slice(0, 10);
    return {
      value,
      day: date.getUTCDate(),
      other: date.getUTCMonth() !== month,
      edge: value === from || value === to,
      inside: Boolean(from && (to || from) && value > from && value < (to || from)),
    };
  });
}

function MonthView({ year, month, from, to, onPick, onNavigate, showPrevious, showNext }) {
  const days = useMemo(() => makeMonth(year, month, from, to), [year, month, from, to]);
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between text-[17px]">
        <button type="button" onClick={() => onNavigate(-1)} aria-label="Previous month" className={`grid h-6 w-6 place-items-center focus-visible:outline-2 focus-visible:outline-[#7fb0ff] ${showPrevious ? '' : 'invisible'}`}><Icon name="left" className="h-[18px] w-[18px] text-[#e8efff]" strokeWidth={2.2} /></button>
        <b>{MONTHS[month]} {year}</b>
        <button type="button" onClick={() => onNavigate(1)} aria-label="Next month" className={`grid h-6 w-6 place-items-center focus-visible:outline-2 focus-visible:outline-[#7fb0ff] ${showNext ? '' : 'invisible'}`}><Icon name="right" className="h-[18px] w-[18px] text-[#e8efff]" strokeWidth={2.2} /></button>
      </div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center">
        {WEEKDAYS.map((day) => <span key={day} className="h-[30px] text-sm font-bold leading-[30px]">{day}</span>)}
        {days.map((day) => {
          const tone = day.edge ? 'bg-[#1b74ff] font-bold' : day.inside ? 'bg-[#1a3a85]' : day.other ? 'text-[#4d6199] hover:bg-[rgba(27,116,255,.28)]' : 'hover:bg-[rgba(27,116,255,.28)]';
          return <button key={day.value} type="button" onClick={() => onPick(day.value)} aria-pressed={day.edge} aria-label={day.value} className={`h-[30px] rounded-md text-[15px] leading-[30px] transition-colors focus-visible:outline-2 focus-visible:outline-[#7fb0ff] ${tone}`}>{day.day}</button>;
        })}
      </div>
    </div>
  );
}

export default function DateRangeCalendar({ initialValue, onApply, onCancel }) {
  const [from, setFrom] = useState(initialValue.from);
  const [to, setTo] = useState(initialValue.to);
  const [startTime, setStartTime] = useState(initialValue.st);
  const [endTime, setEndTime] = useState(initialValue.et);
  const [error, setError] = useState('');
  const [view, setView] = useState(() => {
    const [year, month] = initialValue.from.split('-').map(Number);
    return { year, month: month - 1 };
  });

  const pickDay = (value) => {
    if (!from || to) { setFrom(value); setTo(''); }
    else if (value < from) { setTo(from); setFrom(value); }
    else setTo(value);
    setError('');
  };
  const navigate = (offset) => {
    const date = new Date(Date.UTC(view.year, view.month + offset, 1));
    setView({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
  };
  const updateFrom = (value) => {
    setFrom(value);
    if (validDate(value)) {
      const [year, month] = value.split('-').map(Number);
      setView({ year, month: month - 1 });
    }
  };
  const apply = () => {
    const message = !validDate(from) || !validDate(to) ? 'Enter both dates as YYYY-MM-DD.'
      : !validTime(startTime) || !validTime(endTime) ? 'Enter times as HH:MM:SS (24-hour).'
        : `${from} ${startTime}` > `${to} ${endTime}` ? 'The start must not be after the end.' : '';
    setError(message);
    if (!message) onApply({ from, to, st: startTime, et: endTime });
  };

  const nextMonth = view.month === 11 ? { year: view.year + 1, month: 0 } : { year: view.year, month: view.month + 1 };
  return (
    <div id="calMenu" role="dialog" aria-label="Custom date range" className="absolute left-0 right-0 top-[calc(100%+6px)] z-[60] w-[480px] max-w-[calc(100vw-1.5rem)] cursor-default rounded-[10px] border border-[#1b4cc0] bg-linear-to-b from-[#0a2670] to-[#071b55] p-0 shadow-[0_14px_34px_rgba(0,0,0,.55)] sm:left-auto">
      <div className="px-3.5 pb-1 pt-3.5 sm:px-5 sm:pt-[18px]">
        <div className="grid grid-cols-2 gap-3 sm:gap-[18px]">
          <div><label htmlFor="calFrom" className="mb-2 block text-[15px] font-bold sm:text-[17px]">From Date</label><div className="flex h-[42px] items-center gap-2 rounded-lg border border-[#12358f] bg-[#071d5c] px-3 focus-within:border-[#2d7bff]"><input id="calFrom" value={from} onChange={(event) => updateFrom(event.target.value)} inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" className="w-full min-w-0 bg-transparent text-white outline-none focus-visible:outline-2 focus-visible:outline-[#7fb0ff]"/><Icon name="calendar" className="h-5 w-5 text-[#dbe6ff]"/></div></div>
          <div><label htmlFor="calTo" className="mb-2 block text-[15px] font-bold sm:text-[17px]">To Date</label><div className="flex h-[42px] items-center gap-2 rounded-lg border border-[#12358f] bg-[#071d5c] px-3 focus-within:border-[#2d7bff]"><input id="calTo" value={to} onChange={(event) => setTo(event.target.value)} inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" className="w-full min-w-0 bg-transparent text-white outline-none focus-visible:outline-2 focus-visible:outline-[#7fb0ff]"/><Icon name="calendar" className="h-5 w-5 text-[#dbe6ff]"/></div></div>
        </div>
        <div className="my-4 grid grid-cols-1 gap-3.5 border-t border-[#0d2870] pt-4 sm:grid-cols-2">
          <MonthView year={view.year} month={view.month} from={from} to={to} onPick={pickDay} onNavigate={navigate} showPrevious showNext={false}/>
          <MonthView year={nextMonth.year} month={nextMonth.month} from={from} to={to} onPick={pickDay} onNavigate={navigate} showPrevious={false} showNext/>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-[18px]">
          <div><label htmlFor="calStart" className="mb-2 block text-[15px] font-bold sm:text-[17px]">Start Time</label><div className="flex h-[42px] items-center rounded-lg border border-[#12358f] bg-[#071d5c] px-3 focus-within:border-[#2d7bff]"><input id="calStart" value={startTime} onChange={(event) => setStartTime(event.target.value)} placeholder="HH:MM:SS" autoComplete="off" className="w-full bg-transparent text-white outline-none focus-visible:outline-2 focus-visible:outline-[#7fb0ff]"/></div></div>
          <div><label htmlFor="calEnd" className="mb-2 block text-[15px] font-bold sm:text-[17px]">End Time</label><div className="flex h-[42px] items-center rounded-lg border border-[#12358f] bg-[#071d5c] px-3 focus-within:border-[#2d7bff]"><input id="calEnd" value={endTime} onChange={(event) => setEndTime(event.target.value)} placeholder="HH:MM:SS" autoComplete="off" className="w-full bg-transparent text-white outline-none focus-visible:outline-2 focus-visible:outline-[#7fb0ff]"/></div></div>
        </div>
        <p role="alert" className="mt-3 min-h-[18px] text-sm text-[#ff7a88]">{error}</p>
      </div>
      <div className="flex items-center gap-[26px] px-3.5 pb-3.5 pt-1 sm:px-5 sm:pb-5">
        <button type="button" onClick={apply} className="inline-flex h-[46px] min-w-[106px] cursor-pointer items-center justify-center rounded-[10px] bg-linear-to-b from-[#2a7dff] to-[#1457d8] px-5 text-[17px] shadow-[0_0_14px_rgba(27,116,255,.6)] transition-shadow hover:shadow-[0_0_20px_rgba(27,116,255,.75)] focus-visible:outline-2 focus-visible:outline-[#7fb0ff]">Apply</button>
        <button type="button" onClick={onCancel} className="cursor-pointer rounded px-2 text-[17px] focus-visible:outline-2 focus-visible:outline-[#7fb0ff]">Cancel</button>
      </div>
    </div>
  );
}
