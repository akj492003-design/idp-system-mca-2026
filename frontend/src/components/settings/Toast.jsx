import { useEffect, useState } from "react";

const toneClasses = {
  ok: "border-[#00d6a0]",
  warn: "border-[#ffa726]",
  err: "border-[#ff5368]",
  info: "border-[#1677ff]",
};

export default function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast?.message) return undefined;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(timer);
  }, [toast?.id]);

  return (
    <div
      id="toast"
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-max max-w-[90vw] -translate-x-1/2 rounded-md border bg-[#09234a] px-4 py-2 text-center text-xs font-medium text-[#f0f5ff] shadow-lg transition-all duration-300 ease-out motion-reduce:transition-none sm:text-sm [.light_&]:bg-[#f3f6fb] [.light_&]:text-[#1b2b45] ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"} ${toneClasses[toast?.tone] || "border-transparent"}`}
    >
      {toast?.message || ""}
    </div>
  );
}
