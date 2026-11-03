const symbols = {
  home: <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></>,
  'upload-cloud': <><path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8.5a4 4 0 0 1 0 9.5"/><path d="M12 12v8M9 15l3-3 3 3"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.4 2.7a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.4-2.7a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.5c.1-.4.2-.8.2-1.2z"/></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
  bell: <><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z"/><path d="M10 21h4"/></>,
  chevron: <path d="M6 9l6 6 6-6"/>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v5h-5"/></>,
  doc: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h4"/></>,
  download: <><path d="M12 4v11M7 11l5 5 5-5"/><path d="M5 20h14"/></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3"/></>,
  warning: <><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></>,
  check: <path d="M5 12.5l4.5 4.5L19 7"/>,
  left: <path d="M15 6l-6 6 6 6"/>,
  right: <path d="M9 6l6 6-6 6"/>,
  close: <path d="M5 5l14 14M19 5L5 19"/>,
  brain: <><circle cx="12" cy="12" r="8"/><path d="M9 9h6M9 12h6M9 15h3"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></>,
};

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`block flex-none fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round] ${className}`} strokeWidth={strokeWidth}>
      {symbols[name] || symbols.doc}
    </svg>
  );
}
