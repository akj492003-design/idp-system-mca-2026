import { useEffect, useRef } from 'react';

const B =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-[#1c48a0] bg-[#1d6bff]/10 px-3 py-2 text-sm text-[#a0b6e1] transition hover:bg-[#1d6bff]/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1d6bff] disabled:pointer-events-none disabled:opacity-40';

export default function Modal({ open, title, children, okLabel = 'Save', danger = false, onClose, onSubmit }) {
  const dlgRef = useRef(null);

  useEffect(() => {
    if (open && dlgRef.current) {
      dlgRef.current.showModal();
    } else if (dlgRef.current) {
      dlgRef.current.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dlgRef}
      id="dlg"
      className="w-[92vw] max-w-md rounded-2xl border border-[#1c48a0] bg-[#051840] p-0 text-white backdrop:bg-black/60"
      onClose={onClose}
    >
      <form
        className="p-5"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(e.target);
        }}
      >
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="text-sm">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" data-x onClick={onClose} className={B}>
            {okLabel ? 'Cancel' : 'Close'}
          </button>
          {okLabel && (
            <button
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 ${
                danger ? 'bg-red-600' : 'bg-[#1d6bff]'
              }`}
            >
              {okLabel}
            </button>
          )}
        </div>
      </form>
    </dialog>
  );
}