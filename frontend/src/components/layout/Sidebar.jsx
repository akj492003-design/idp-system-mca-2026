import { useEffect, useState } from "react";
export default function Sidebar({ onNavigate }) {
  const [isOnline, setIsOnline] = useState(true);

   useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    // Read the current connection state and keep it updated.
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);
  return (
    <aside id="sidebar" className="sticky top-0 flex h-screen min-h-0 flex-col overflow-hidden border-r border-blue-400/20 bg-[linear-gradient(180deg,#071352_0%,#050d3a_100%)] [.light_&]:border-[#d1dceb] [.light_&]:bg-[linear-gradient(180deg,#ffffff_0%,#edf3fb_100%)] max-[700px]:hidden [@media(min-width:701px)_and_(max-height:560px)]:min-h-screen group-[.sidebar-open]/app:max-[700px]:fixed group-[.sidebar-open]/app:max-[700px]:inset-y-0 group-[.sidebar-open]/app:max-[700px]:left-0 group-[.sidebar-open]/app:max-[700px]:z-[70] group-[.sidebar-open]/app:max-[700px]:flex group-[.sidebar-open]/app:max-[700px]:h-screen group-[.sidebar-open]/app:max-[700px]:w-[250px] group-[.sidebar-open]/app:max-[700px]:shadow-[0_0_40px_rgba(0,0,30,.7)] transition-transform duration-[220ms] ease-out starting:-translate-x-full will-change-transform motion-reduce:transition-none" onClick={onNavigate}>
<a href="#home" className="mb-2 flex min-h-[58px] shrink-0 items-center gap-2 py-1.5 pr-2.5 pl-[15px] min-[701px]:max-[1100px]:gap-[5px] min-[701px]:max-[1100px]:pl-[9px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:px-0">
<img
  className="size-[46px] flex-none rounded-[11px] border border-blue-400/55 object-cover shadow-[0_0_12px_rgba(59,130,246,.55)]"
  src="/logo.png"
  alt="IDP logo"
  width="46"
  height="46"
/>
<span className="flex min-w-0 flex-col group-[.sidebar-collapsed]/app:min-[701px]:hidden">
<strong className="font-['Orbitron','Segoe_UI',Arial,sans-serif] text-[28px] font-black leading-none tracking-[.08em] bg-[linear-gradient(95deg,#22d3ee_0%,#3b82f6_45%,#a78bfa_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] drop-shadow-[0_0_6px_rgba(56,189,248,.65)] min-[701px]:max-[1100px]:text-[22px]">IDP</strong>
<small className="mt-[5px] font-['Orbitron','Segoe_UI',Arial,sans-serif] text-[7.5px] font-medium uppercase leading-normal tracking-[.14em] whitespace-normal bg-[linear-gradient(90deg,#ffffff_0%,#bcd4ff_100%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] min-[701px]:max-[1100px]:text-[6px] min-[701px]:max-[1100px]:tracking-[.1em]">Intelligent Document Processing</small>
</span>
</a>
<nav className="relative z-10 flex flex-col gap-1 px-3 min-[701px]:max-[1100px]:px-2 group-[.sidebar-collapsed]/app:min-[701px]:px-2.5" aria-label="Main navigation">
<a href="/home" className="flex h-[39px] items-center gap-2.5 rounded-lg pr-2 pl-[11px] text-[13px] min-[701px]:max-[1100px]:gap-[7px] min-[701px]:max-[1100px]:px-[7px] min-[701px]:max-[1100px]:text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:p-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_6px_20px_rgba(60,80,255,.35)]" title="Home"><svg className="size-[19px] shrink-0 group-[.sidebar-collapsed]/app:min-[701px]:size-[21px]"><use href="#i-home"></use></svg><span className="group-[.sidebar-collapsed]/app:min-[701px]:hidden">Home</span></a>
<a href="/scanning" className="flex h-[39px] items-center gap-2.5 rounded-lg pr-2 pl-[11px] text-[13px] min-[701px]:max-[1100px]:gap-[7px] min-[701px]:max-[1100px]:px-[7px] min-[701px]:max-[1100px]:text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:p-0 text-blue-50 transition-colors hover:bg-blue-500/15 [.light_&]:text-[#253c5c] [.light_&]:hover:bg-[#e5efff]" title="Document Scanning"><svg className="size-[19px] shrink-0 group-[.sidebar-collapsed]/app:min-[701px]:size-[21px]"><use href="#i-upload"></use></svg><span className="group-[.sidebar-collapsed]/app:min-[701px]:hidden">Document Scanning</span></a>
<a href="/history" className="flex h-[39px] items-center gap-2.5 rounded-lg pr-2 pl-[11px] text-[13px] min-[701px]:max-[1100px]:gap-[7px] min-[701px]:max-[1100px]:px-[7px] min-[701px]:max-[1100px]:text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:p-0 text-blue-50 transition-colors hover:bg-blue-500/15 [.light_&]:text-[#253c5c] [.light_&]:hover:bg-[#e5efff]" title="History"><svg className="size-[19px] shrink-0 group-[.sidebar-collapsed]/app:min-[701px]:size-[21px]"><use href="#i-clock"></use></svg><span className="group-[.sidebar-collapsed]/app:min-[701px]:hidden">History</span></a>
<a href="/settings" className="flex h-[39px] items-center gap-2.5 rounded-lg pr-2 pl-[11px] text-[13px] min-[701px]:max-[1100px]:gap-[7px] min-[701px]:max-[1100px]:px-[7px] min-[701px]:max-[1100px]:text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:p-0 text-blue-50 transition-colors hover:bg-blue-500/15 [.light_&]:text-[#253c5c] [.light_&]:hover:bg-[#e5efff]" title="Settings"><svg className="size-[19px] shrink-0 group-[.sidebar-collapsed]/app:min-[701px]:size-[21px]"><use href="#i-gear"></use></svg><span className="group-[.sidebar-collapsed]/app:min-[701px]:hidden">Settings</span></a>
<a href="/subscription" className="flex h-[39px] items-center gap-2.5 rounded-lg pr-2 pl-[11px] text-[13px] min-[701px]:max-[1100px]:gap-[7px] min-[701px]:max-[1100px]:px-[7px] min-[701px]:max-[1100px]:text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:p-0 text-blue-50 transition-colors hover:bg-blue-500/15 [.light_&]:text-[#253c5c] [.light_&]:hover:bg-[#e5efff]" title="Settings"><svg className="size-[19px] shrink-0 group-[.sidebar-collapsed]/app:min-[701px]:size-[21px]"><use href="#i-crown"></use></svg><span className="group-[.sidebar-collapsed]/app:min-[701px]:hidden">Subscription</span></a>
</nav>
<svg className="pointer-events-none absolute bottom-0 left-0 h-[240px] w-full" viewBox="0 0 287 360" preserveAspectRatio="none" aria-hidden="true">
<defs>
<linearGradient id="cyberPink" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stopColor="#3b82f6" stopOpacity=".35"></stop>
<stop offset="60%" stopColor="#1e1b4b" stopOpacity=".15"></stop>
<stop offset="100%" stopColor="#000" stopOpacity="0"></stop>
</linearGradient>
<linearGradient id="cyberNeonLine" x1="0" y1="1" x2="1" y2="0">
<stop offset="0%" stopColor="#eab308" stopOpacity=".9"></stop>
<stop offset="100%" stopColor="#06b6d4" stopOpacity=".3"></stop>
</linearGradient>
<filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
<feGaussianBlur stdDeviation="6" result="blur"></feGaussianBlur>
<feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
</filter>
</defs>
<path d="M0 180 Q80 200 140 280 T287 360 H0 Z" fill="url(#cyberPink)"></path>
<path d="M0 160 Q80 180 140 260 T287 340" fill="none" stroke="url(#cyberNeonLine)" strokeWidth="2" filter="url(#neonGlow)"></path>
<path d="M0 210 Q90 220 150 300 T287 360" fill="none" stroke="#8b5cf6" strokeOpacity=".4"></path>
</svg>
<div className="relative z-10 mt-auto px-[15px] pb-[15px] group-[.sidebar-collapsed]/app:min-[701px]:px-0">
<p
  role="status"
  aria-live="polite"
  className="mb-[7px] flex items-center gap-3 text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:text-[0px]"
>
  <span
    className={`h-2 w-2 rounded-full ${
      isOnline
        ? "bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"
        : "bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"
    }`}
  />
  {isOnline ? "System Online" : "System Offline"}
</p>
</div>
</aside>
  );
}
