
import Icon from './Icon.jsx';
import { STATUS_CLASS, TYPES } from '../../Data/historyData.js';

function TimelineEvent({ event, selected, expanded, onSelect, onToggle }) {
  const type = TYPES[event.type];

  return (
    <li className="border-t border-[#0d2870] transition-colors duration-200">
      <div className={`relative flex items-center ${selected ? 'bg-[rgba(27,116,255,.14)]' : ''}`}>
        <span
          className="absolute left-0 top-1/2 -mt-[3px] h-1.5 w-1.5 rounded-full"
          style={{
            background: type.color,
            boxShadow: `0 0 6px ${type.color}`
          }}
        />

        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="grid min-h-16 min-w-0 flex-1 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 py-2.5 pl-3.5 text-left transition-all duration-200 hover:translate-x-[2px] hover:bg-[rgba(27,116,255,.08)] focus-visible:outline-2 focus-visible:outline-[#7fb0ff] sm:grid-cols-[44px_minmax(0,1.6fr)_minmax(0,1.1fr)_96px] sm:gap-x-4 sm:py-[9px] sm:pl-[15px] xl:gap-x-4"
        >
          <span
            className="row-span-2 grid h-10 w-10 flex-none place-self-start place-items-center rounded-full text-white shadow-[0_0_12px_rgba(0,0,0,.25)] sm:row-span-1 sm:h-11 sm:w-11 sm:place-self-auto"
            style={{ background: type.color }}
          >
            <Icon name={type.icon} className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          </span>

          <span className="min-w-0">
            <b className="block text-[15px] font-bold leading-5 sm:text-base">
              {event.type}
            </b>
            <span className="block break-words text-sm leading-5 text-[#e3ebff] sm:text-[15px]">
              {event.file}
            </span>
          </span>

          <time className="col-start-2 col-span-2 row-start-2 whitespace-nowrap text-[13px] text-[#c3d0f0] sm:col-auto sm:row-auto sm:text-[15px] sm:text-white xl:text-base">
            {event.ts.slice(0, 16)}
          </time>

          <span
            className={`col-start-3 row-start-1 flex h-6 w-max min-w-16 items-center justify-center rounded-[13px] px-2.5 text-[13px] sm:col-auto sm:row-auto sm:h-[26px] sm:min-w-[72px] sm:px-[13px] sm:text-sm ${STATUS_CLASS[event.status]}`}
          >
            {event.status}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`x-${event.id}`}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${event.type} details`}
          className="grid h-11 w-7 flex-none place-items-center self-center focus-visible:outline-2 focus-visible:outline-[#7fb0ff] sm:w-8"
        >
          <Icon
            name="chevron"
            className={`h-4 w-4 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {expanded && (
        <div
          id={`x-${event.id}`}
          className="ml-[59px] grid grid-cols-2 gap-x-4 gap-y-1 pb-3 pr-8 text-sm text-[#c3d0f0] transition-all duration-200"
        >
          <p className="col-span-2 text-[#e3ebff]">{event.desc}</p>

          <p>
            Event ID: <span className="text-white">{event.id}</span>
          </p>

          <p>
            Document ID: <span className="text-white">{event.docId}</span>
          </p>

          <p>
            User: <span className="text-white">{event.user}</span>
          </p>

          <p>
            Full time: <span className="text-white">{event.ts}</span>
          </p>
        </div>
      )}
    </li>
  );
}

export default function ActivityTimeline({
  events,
  totalEvents,
  selected,
  expanded,
  onSelect,
  onToggle,
  demoMode,
  asOf
}) {
  const noData = totalEvents === 0;

  return (
    <div className="flex min-w-0 flex-col rounded-[14px] border border-[#12358f] bg-linear-to-b from-[rgba(8,30,88,.78)] to-[rgba(4,18,60,.92)] pb-3 shadow-[inset_0_0_18px_rgba(20,80,200,.16)]">

      {/* Header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3.5 pb-1.5 pt-3 sm:px-[18px] sm:pb-2 sm:pt-3.5">

        <h2 className="text-[19px] font-bold sm:text-[21px]">
          Activity Timeline
        </h2>

        {/* Demo Mode Indicator */}
        {demoMode && (
          <span className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-yellow-300">
            DEMO MODE
          </span>
        )}

        <time className="ml-auto text-sm text-[#e8efff] sm:mx-auto sm:text-[15px]">
          {asOf}
        </time>

        <span className="hidden w-0 sm:block" />
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {events.length} of {totalEvents} events
      </p>

      {/* Timeline Content */}
      <div className="relative ml-3 mr-2.5 [scrollbar-color:#3d4f7d_transparent] [scrollbar-width:thin] sm:ml-[18px] lg:mr-3 lg:max-h-[calc(100vh-290px)] lg:min-h-[360px] lg:overflow-y-auto lg:pr-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[#3d4f7d]">

        <div className="relative">

          {events.length > 0 && (
            <div className="pointer-events-none absolute bottom-[30px] left-0.5 top-[30px] w-0.5 bg-[linear-gradient(180deg,#1b74ff,#6a4cff_35%,#12bfae_50%,#f0364a_80%,#f0364a)] opacity-70" />
          )}

          {events.length > 0 && (
            <ul>
              {events.map((event) => (
                <TimelineEvent
                  key={event.id}
                  event={event}
                  selected={selected === event.id}
                  expanded={expanded.includes(event.id)}
                  onSelect={() => onSelect(event.id)}
                  onToggle={() => onToggle(event.id)}
                />
              ))}
            </ul>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 border-t border-[#0d2870] px-4 py-6 text-center transition-opacity duration-200">

              <div className="mb-2 grid h-16 w-16 place-items-center rounded-full border border-[#12358f] bg-[#0f2c78] text-[#5aa3ff] shadow-[0_0_16px_rgba(27,116,255,.35)]">
                <Icon name="doc" className="h-[30px] w-[30px]" />
              </div>

              <b className="text-xl font-bold">
                {noData ? 'No content found' : 'No matching events'}
              </b>

              <span className="text-[15px] text-[#c3d0f0]">
                {noData
                  ? 'There are no activity events to show right now.'
                  : 'No events match the current search or filters. Try changing them or click Clear Filters.'}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
