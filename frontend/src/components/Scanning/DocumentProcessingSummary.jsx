import { FileText, CheckSquare, XSquare, Clock3 } from "lucide-react";
import StatCard from "../Common/StatCard.jsx";

export default function DocumentProcessingSummary({ stats = null }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={FileText} label="Total Documents" value={stats?.total_documents ?? "0"} tone="blue" />
      <StatCard icon={CheckSquare} label="Completed" value={stats?.completed ?? "0"} tone="green" />
      <StatCard icon={XSquare} label="Failed" value={stats?.failed ?? "0"} tone="red" />
      <StatCard icon={Clock3} label="Avg. Processing Time" value={stats?.average_processing_time ?? "—"} tone="violet" />
    </section>
  );
}
