import { useEffect, useState } from "react";
import WelcomeSection from "./WelcomeSection";
import UploadSection from "./UploadSection";
import StatsPanel from "./StatsPanel";
import ActivityPanel from "./ActivityPanel";
import { getDashboard, getHistory } from "../../services/idpService.js";

export default function Dashboard({ uploadRef }) {
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [dashboard, history] = await Promise.all([getDashboard(), getHistory({ page: 1, limit: 5 })]);
        if (active) { setSummary(dashboard); setActivity(history?.events || []); }
      } catch { /* Keep the existing empty-state UI if the API is unavailable. */ }
    };
    load();
    const refresh = () => load();
    window.addEventListener("idp:dashboard-refresh", refresh);
    return () => { active = false; window.removeEventListener("idp:dashboard-refresh", refresh); };
  }, []);
  return (
    <main id="home" className="dashboard-content grid grid-cols-[minmax(0,1fr)_285px] items-start gap-[13px] px-3.5 py-3 min-[701px]:max-[1100px]:grid-cols-[minmax(0,1fr)_245px] min-[701px]:max-[1100px]:gap-[9px] min-[701px]:max-[1100px]:p-[9px] max-[700px]:grid-cols-[minmax(0,1fr)] max-[700px]:gap-3 max-[700px]:p-2.5 min-[701px]:min-h-0 min-[701px]:flex-1 min-[701px]:grid-rows-[minmax(0,1fr)] min-[701px]:items-stretch min-[701px]:overflow-hidden [@media(min-width:701px)_and_(max-height:760px)]:gap-2 [@media(min-width:701px)_and_(max-height:760px)]:py-[7px] [@media(min-width:701px)_and_(max-height:560px)]:grid-rows-none [@media(min-width:701px)_and_(max-height:560px)]:overflow-visible">
      <div className="flex min-w-0 flex-col gap-3 max-[700px]:gap-2.5 min-[701px]:min-h-0 [@media(min-width:701px)_and_(max-height:760px)]:gap-2"><WelcomeSection /><UploadSection uploadRef={uploadRef} /></div>
      <div className="right-column flex min-w-0 flex-col gap-3 max-[700px]:gap-2.5 min-[701px]:min-h-0 [@media(min-width:701px)_and_(max-height:760px)]:gap-2"><StatsPanel stats={summary?.stats} /><ActivityPanel events={activity} /></div>
    </main>
  );
}
