import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const variants = {
  success: { Icon: CheckCircle2, color: 'text-white' },
  error: { Icon: AlertCircle, color: 'text-white' },
  info: { Icon: Info, color: 'text-white' },
};

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onDismiss, 2600);
    return () => window.clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;
  const { Icon, color } = variants[toast.type] ?? variants.info;
  const background = toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-[#1d6bff]' : 'bg-[#163b78]';

  return (
    <div role="status" aria-live="polite" className={`toast-enter pointer-events-none fixed bottom-6 left-1/2 z-[90] flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg shadow-black/30 ${background} ${color}`}>
      <Icon className="h-4 w-4 shrink-0" />
      <span>{toast.message}</span>
    </div>
  );
}
