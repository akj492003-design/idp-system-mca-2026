import Icon from './Icon.jsx';
import { STATUS_CLASS, TYPES } from '../../Data/historyData.js';

export default function EventDetails({ event, onClose }) {
  return (
    <aside className="flex min-w-0 flex-col rounded-[14px] border border-[#12358f] bg-linear-to-b from-[rgba(8,30,88,.78)] to-[rgba(4,18,60,.92)] shadow-[inset_0_0_18px_rgba(20,80,200,.16)]" aria-label="Event Details">
      <div className="flex h-[54px] items-center justify-between border-b border-[#0d2870] px-3.5 sm:px-5">
        <h2 className="text-xl font-bold sm:text-[23px]">Event Details</h2>
        <button type="button" onClick={onClose} aria-label="Close event details" className="grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-[rgba(27,116,255,.22)] focus-visible:outline-2 focus-visible:outline-[#7fb0ff]"><Icon name="close" className="h-5 w-5" strokeWidth={2}/></button>
      </div>
      {!event ? <p className="mx-5 my-auto py-9 text-center text-base lg:py-[60px]">Select an event from the Timeline to view. in details.</p> : <div className="m-4 rounded-xl border border-[#12358f] bg-[rgba(10,38,112,.45)] p-4 shadow-[inset_0_0_14px_rgba(27,116,255,.12)] transition-shadow sm:m-5">
        <div className="flex items-start gap-3.5">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-full text-white" style={{ background: TYPES[event.type].color }}><Icon name={TYPES[event.type].icon} className="h-[22px] w-[22px]"/></span>
          <div className="min-w-0"><b className="block text-lg font-bold leading-6">{event.type}</b><span className="block break-words text-[15px] text-[#e3ebff]">{event.file}</span><p className="mt-1.5 text-sm text-[#c3d0f0]">{event.desc}</p></div>
        </div>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
          <dt className="text-[#c3d0f0]">Status:</dt><dd><span className={`inline-flex h-6 items-center rounded-[13px] px-3 text-[13px] ${STATUS_CLASS[event.status]}`}>{event.status}</span></dd>
          <dt className="text-[#c3d0f0]">User:</dt><dd className="break-words">{event.user}</dd>
          <dt className="text-[#c3d0f0]">Timestamp:</dt><dd className="break-words">{event.ts}</dd>
          <dt className="text-[#c3d0f0]">Event ID:</dt><dd>{event.id}</dd>
          <dt className="text-[#c3d0f0]">Document ID:</dt><dd>{event.docId}</dd>
        </dl>
      </div>}
    </aside>
  );
}
