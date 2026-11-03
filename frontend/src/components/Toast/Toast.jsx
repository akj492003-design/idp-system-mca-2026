export default function Toast({ message, visible }) {
  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#1d6bff] px-4 py-2 text-sm font-medium text-white shadow-lg transition-[opacity,translate] duration-200 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {message}
    </div>
  );
}