# IDP System — Complete React JSX Source

The full top header bar is intentionally not rendered. The dashboard begins with the KPI summary cards, followed by Document Processing Result and Model Performance Analytics. `Components/Common/DashboardHeader.jsx` remains in the source as an optional component but is not mounted by `Pages/ScanningPage.jsx`.


## `.env.example`

```text
VITE_API_BASE_URL=http://localhost:5000/api
```


## `App.jsx`

```jsx
import ScanningPage from "./Pages/ScanningPage.jsx";

export default function App() {
  return <ScanningPage />;
}
```


## `README.md`

```markdown
# IDP System — React + Vite dashboard

This is the **complete IDP System dashboard project**, not a standalone header demo. It contains the existing scanning dashboard, analytics dashboard, Recharts visualizations, and API service foundation. The entire top header bar is removed from the rendered dashboard as requested.

## Project choices

- **Build tool: Vite 8.** Vite provides a fast development server and a production build for React applications.
- **UI: React 19 with JSX.** Components and page state are implemented with React.
- **Styling: Tailwind CSS v4.** The original navy dashboard color tokens and utility-based layout are retained in `index.css` and the JSX files.
- **Charts: Recharts.** The six model analytics charts and class-probability chart use Recharts components.
- **Icons: Lucide React.** The updated header and dashboard use Lucide icons.
- **Prop validation: PropTypes.** `DashboardHeader.jsx` validates its public props.
- **HTTP: Axios.** The existing dashboard hook uses the configured API client.

## Requirements

- Node.js 20.19+ or 22.12+ (required by Vite 8).
- npm 10 or newer recommended.

Check your installed versions:

```powershell
node -v
npm -v
```

## Install and run (Windows PowerShell)

Open the extracted project folder — the folder that directly contains `package.json`, `index.html`, and `vite.config.js`.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

If `.env` already exists, do not copy it again. Edit it if needed. The Vite terminal prints the local URL; open that exact URL (usually `http://localhost:5173/`, or another port if 5173 is occupied).

## Available scripts

```powershell
npm run dev       # Start the Vite development server
npm run build     # Create the production build in dist/
npm run preview   # Preview the production build locally
npm run start     # Same production preview server; run build first
```

## Folder structure

```text
IDP System-AI/
├── Components/
│   ├── Analytics/
│   │   ├── ClassificationReport.jsx
│   │   ├── ModelPerformanceAnalytics.jsx
│   │   └── PerformanceCharts.jsx
│   ├── Common/
│   │   ├── ChartCard.jsx
│   │   ├── DashboardHeader.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Icon.jsx
│   │   └── StatCard.jsx
│   └── Scanning/
│       ├── ClassProbability.jsx
│       ├── DocumentPreview.jsx
│       ├── DocumentProcessingResult.jsx
│       ├── DocumentProcessingSummary.jsx
│       ├── ExtractedInformation.jsx
│       ├── OcrExtractedText.jsx
│       ├── PredictionResults.jsx
│       └── ProcessingStatus.jsx
├── Pages/
│   └── ScanningPage.jsx
├── hooks/
│   └── useDashboardData.js
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
├── index.css
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

The archive has one project root: when extracted, open the folder containing `package.json`. There is no second nested project folder.

## Top header bar removal

The full top header bar is not rendered in `Pages/ScanningPage.jsx`. This removes the logo/title, search field, theme toggle, notifications control, user avatar, and the header's vertical space. The first visible content is the original summary KPI row. The `Components/Common/DashboardHeader.jsx` file remains available as an optional reusable component, but it is not imported or mounted by the dashboard page.

## Existing dashboard behavior and section order

The application retains the source dashboard sequence:

1. Summary KPI cards (the top header bar is completely omitted)
2. Document Processing Result — Processing Status, Document Preview, Extracted Information, OCR Extracted Text
3. Prediction Results, Class Probability, View Analytics
4. Original divider/collapse control
5. Model Performance Analytics — four metric cards, six chart cards, and Classification Report

No replacement dashboard design or separate demo page is introduced. The HTML supplied earlier did not include a document upload widget, so this project does not fabricate one.

## Flask API configuration

`.env.example` contains:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Copy it to `.env` in the project root. The existing `useDashboardData` hook requests:

```http
GET /dashboard
```

against the configured base URL, which resolves to `GET http://localhost:5000/api/dashboard` by default.

The response shape consumed by the current page is:

```json
{
  "stats": {
    "total_documents": 0,
    "completed": 0,
    "failed": 0,
    "average_processing_time": null
  },
  "unread_notification_count": 0,
  "user": {
    "name": "User",
    "email": ""
  },
  "latest_document": {
    "status": "idle",
    "current_stage": null,
    "preview_url": null,
    "file_name": null,
    "extracted_information": null,
    "ocr_text": null,
    "prediction": null,
    "class_probabilities": null
  },
  "evaluation": {
    "metrics": {
      "accuracy": null,
      "precision": null,
      "recall": null,
      "f1_score": null
    },
    "charts": {
      "accuracy_comparison": [],
      "metrics_comparison": [],
      "confusion_matrix": { "labels": [], "matrix": [] },
      "per_class_performance": [],
      "model_comparison": [],
      "inference_time_comparison": []
    },
    "classification_report": []
  }
}
```

This is an **API contract example**, not actual IDP System output. All metric/chart values must come from real evaluation runs on labeled data. Individual document prediction confidence is not model accuracy.

The backend integration currently provides the dashboard-data request foundation. It does not yet implement the full upload → Celery task polling → OCR → ML/DL inference workflow. Those endpoints must be connected to the actual Flask route names and response schema before claiming end-to-end document processing works.

## ZIP packaging

The supplied ZIP already includes the full project. To create another ZIP on Windows, run PowerShell from the directory **above** the project folder:

```powershell
Compress-Archive -Path .\IDP System-AI\* -DestinationPath .\IDP System-AI.zip -Force
```

Do not include `node_modules` or `dist`. The recipient installs dependencies by running `npm install`.
```


## `index.css`

```css
@import "tailwindcss";

:root {
  color-scheme: dark;
  --c-bg: #001933;
  --c-panel: #00203e;
  --c-inner: #032242;
  --c-line: #003e73;
  --c-dash: #1464aa;
  --c-fg: #e6f0ff;
  --c-muted: #8fb0d8;
  --c-accent: #4da3ff;
  --c-primary: #005ffe;
  --c-secondary: #0145a4;
  --c-grid: #0a2f57;
  font-family: Inter, system-ui, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

:root:not(.dark) {
  color-scheme: light;
  --c-bg: #eef3fb;
  --c-panel: #ffffff;
  --c-inner: #f3f7fe;
  --c-line: #c9d8f0;
  --c-dash: #8fb3e8;
  --c-fg: #0f1f3d;
  --c-muted: #4b6490;
  --c-accent: #1d6fe8;
  --c-primary: #1565e0;
  --c-secondary: #1a4fa8;
  --c-grid: #dbe6f6;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--c-bg); }
body { margin: 0; min-width: 320px; min-height: 100vh; background: var(--c-bg); color: var(--c-fg); font-family: Inter,system-ui,sans-serif; }
button,input { font: inherit; }
button:disabled { cursor: not-allowed; opacity: .55; }
::selection { background: rgb(77 163 255 / 35%); }
.dashboard-grid {
  background-image: linear-gradient(var(--c-grid) 1px,transparent 1px),linear-gradient(90deg,var(--c-grid) 1px,transparent 1px);
  background-size: 28px 28px;
}
.chart-tooltip { border:1px solid var(--c-line); border-radius:8px; background:var(--c-panel); padding:8px 10px; color:var(--c-fg); box-shadow:0 8px 24px rgb(0 0 0 / 22%); }
.chart-tooltip p { margin:0; font-size:12px; }
.recharts-text { fill:var(--c-muted); font-size:10px; }
.recharts-cartesian-grid line { stroke:var(--c-grid); }
.recharts-legend-item-text { color:var(--c-muted)!important; font-size:11px; }
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { scroll-behavior:auto!important; animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; }
}
```


## `index.html`

```html
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#001933" />
    <title>IDP System — Document Processing Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>
```


## `main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```


## `package.json`

```json
{
  "name": "docupilot-ai-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "axios": "^1.21.0",
    "lucide-react": "^1.65.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1",
    "recharts": "^3.10.1",
    "prop-types": "^15.8.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@vitejs/plugin-react": "^6.1.2",
    "tailwindcss": "^4.3.3",
    "vite": "^8.3.5"
  }
}
```


## `vite.config.js`

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```


## `Components/Analytics/ClassificationReport.jsx`

```jsx
import Icon from "../Common/Icon.jsx";
export default function ClassificationReport({ rows = null }) {
  const valid = Array.isArray(rows) && rows.length > 0;
  return (
    <article className="mt-3 rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-2 text-sm font-semibold text-(color:--c-fg)">7. Classification Report</h3>
      <div className="overflow-x-auto rounded-md border border-(color:--c-line)">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="border-b border-(color:--c-line) text-(color:--c-muted)">
            <tr><th scope="col" className="px-3 py-1.5 font-normal">Class</th><th scope="col" className="px-3 py-1.5 text-center font-normal">Precision</th><th scope="col" className="px-3 py-1.5 text-center font-normal">Recall</th><th scope="col" className="px-3 py-1.5 text-center font-normal">F1 Score</th><th scope="col" className="px-3 py-1.5 text-center font-normal">Support</th></tr>
          </thead>
          <tbody>{valid ? rows.map(row=><tr key={row.class} className="border-b border-(color:--c-line) last:border-0"><td className="px-3 py-2">{row.class}</td><td className="px-3 py-2 text-center">{row.precision ?? "—"}</td><td className="px-3 py-2 text-center">{row.recall ?? "—"}</td><td className="px-3 py-2 text-center">{row.f1_score ?? "—"}</td><td className="px-3 py-2 text-center">{row.support ?? "—"}</td></tr>) :
            <tr><td colSpan="5" className="px-3 py-5"><div className="flex flex-col items-center gap-1 text-center text-(color:--c-muted)"><Icon name="doc" className="h-7 w-7 text-(color:--c-accent)" /><p className="font-semibold text-(color:--c-accent)">No evaluation data yet.</p><p>Process documents to generate the classification report.</p></div></td></tr>}
          </tbody>
        </table>
      </div>
    </article>
  );
}
```


## `Components/Analytics/ModelPerformanceAnalytics.jsx`

```jsx
import { ChartNoAxesColumnIncreasing, Activity, Target, Award, Crosshair } from "lucide-react";
import StatCard from "../Common/StatCard.jsx";
import { ModelAccuracyChart, MetricsComparisonChart, ConfusionMatrixChart, PerClassPerformanceChart, ModelComparisonRadarChart, InferenceTimeChart } from "./PerformanceCharts.jsx";
import ClassificationReport from "./ClassificationReport.jsx";

const pct = (value) => value == null || !Number.isFinite(Number(value)) ? "—" : `${(Number(value) <= 1 ? Number(value)*100 : Number(value)).toFixed(2)}%`;

export default function ModelPerformanceAnalytics({ evaluation = null }) {
  const metrics = evaluation?.metrics ?? null;
  const charts = evaluation?.charts ?? {};
  const validEvaluation = Boolean(metrics && ["accuracy","precision","recall","f1_score"].some(key => metrics[key] != null));
  return (
    <section id="analytics" className="scroll-mt-20 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3 sm:p-4" aria-labelledby="analyticsTitle">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-(color:--c-primary) text-white"><ChartNoAxesColumnIncreasing className="h-5 w-5" /></span>
        <div><h2 id="analyticsTitle" className="text-lg font-semibold leading-tight">Model Performance Analytics</h2><p className="text-sm text-(color:--c-muted)">Evaluate model performance with detailed metrics and visualizations.</p></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Activity} label="Accuracy" value={pct(metrics?.accuracy)} tone="green" />
        <StatCard icon={Crosshair} label="Precision" value={pct(metrics?.precision)} tone="sky" />
        <StatCard icon={ChartNoAxesColumnIncreasing} label="Recall" value={pct(metrics?.recall)} tone="violet" />
        <StatCard icon={Award} label="F1 Score" value={pct(metrics?.f1_score)} tone="orange" />
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <ModelAccuracyChart data={validEvaluation ? charts.accuracy_comparison : null} />
        <MetricsComparisonChart data={validEvaluation ? charts.metrics_comparison : null} />
        <ConfusionMatrixChart data={validEvaluation ? charts.confusion_matrix : null} />
        <PerClassPerformanceChart data={validEvaluation ? charts.per_class_performance : null} />
        <ModelComparisonRadarChart data={validEvaluation ? charts.model_comparison : null} />
        <InferenceTimeChart data={validEvaluation ? charts.inference_time_comparison : null} />
      </div>
      <ClassificationReport rows={validEvaluation ? evaluation?.classification_report : null} />
    </section>
  );
}
```


## `Components/Analytics/PerformanceCharts.jsx`

```jsx
import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import ChartCard from "../Common/ChartCard.jsx";

const tooltipStyle = { background: "var(--c-panel)", border: "1px solid var(--c-line)", borderRadius: 8, color: "var(--c-fg)" };
function ChartFrame({ data, children }) {
  return <div className="h-[160px] min-w-0 w-full">{data?.length ? children : null}</div>;
}

export function ModelAccuracyChart({ data }) {
  return <ChartCard title="1. Model Accuracy Comparison" empty={!data?.length} description="Process documents to generate model comparison results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="model" tick={{fontSize:10}} /><YAxis domain={[0,100]} label={{value:"Accuracy (%)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="accuracy" name="Accuracy" fill="#4da3ff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function MetricsComparisonChart({ data }) {
  return <ChartCard title="2. Precision, Recall & F1 Score Comparison" empty={!data?.length} description="Process documents to generate precision, recall and F1 score results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="model" tick={{fontSize:10}} /><YAxis domain={[0,100]} label={{value:"Score (%)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="precision" fill="#4da3ff" /><Bar dataKey="recall" fill="#a78bfa" /><Bar dataKey="f1_score" name="F1 Score" fill="#34d399" /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function ConfusionMatrixChart({ data }) {
  const labels = data?.labels ?? [];
  const matrix = data?.matrix ?? [];
  const hasData = labels.length && matrix.length;
  return <ChartCard title="3. Confusion Matrix" empty={!hasData} icon="grid" description="Process documents to generate the confusion matrix.">
    {hasData ? <div className="h-[160px] overflow-auto"><div className="grid gap-1" style={{gridTemplateColumns:`repeat(${labels.length+1}, minmax(34px,1fr))`}}>
      <span />{labels.map(label=><span key={label} className="truncate text-center text-[9px] text-(color:--c-muted)">{label}</span>)}
      {matrix.map((row,i)=><React.Fragment key={labels[i] ?? i}><span className="truncate self-center text-[9px] text-(color:--c-muted)">{labels[i]}</span>{row.map((value,j)=><span key={`${i}-${j}`} title={`${labels[i]} predicted ${labels[j]}: ${value}`} className="grid min-h-7 place-items-center rounded-sm text-[10px]" style={{background:`rgba(77,163,255,${Math.min(.85, .12 + Number(value)/(Math.max(...matrix.flat(),1))*.73)})`}}>{value}</span>)}</React.Fragment>)}
    </div></div> : null}
  </ChartCard>;
}
export function PerClassPerformanceChart({ data }) {
  return <ChartCard title="4. Per-Class Performance" empty={!data?.length} description="Process documents to generate per-class performance results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="class" tick={{fontSize:9}} /><YAxis domain={[0,100]} label={{value:"Score (%)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="precision" fill="#4da3ff" /><Bar dataKey="recall" fill="#a78bfa" /><Bar dataKey="f1_score" name="F1 Score" fill="#34d399" /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function ModelComparisonRadarChart({ data, models }) {
  const rows = Array.isArray(data) ? data : [];
  const keys = models?.length ? models : Object.keys(rows[0] ?? {}).filter(k => k !== "metric");
  return <ChartCard title="5. Model Comparison (Radar Chart)" empty={!rows.length || !keys.length} icon="pent" description="Process documents to generate model comparison results.">
    <ChartFrame data={rows}><ResponsiveContainer width="100%" height="100%"><RadarChart data={rows}><PolarGrid stroke="var(--c-grid)" /><PolarAngleAxis dataKey="metric" tick={{fontSize:9}} /><PolarRadiusAxis domain={[0,100]} tick={{fontSize:8}} /><Tooltip contentStyle={tooltipStyle} /><Legend />{keys.map((key,index)=><Radar key={key} name={key} dataKey={key} stroke={["#4da3ff","#a78bfa","#34d399"][index%3]} fill={["#4da3ff","#a78bfa","#34d399"][index%3]} fillOpacity={0.12} />)}</RadarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
export function InferenceTimeChart({ data }) {
  return <ChartCard title="6. Inference Time Comparison" empty={!data?.length} description="Process documents to generate inference time comparison results.">
    <ChartFrame data={data}><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="model" tick={{fontSize:10}} /><YAxis label={{value:"Time (ms)",angle:-90,position:"insideLeft",fill:"var(--c-muted)",fontSize:10}} /><Tooltip contentStyle={tooltipStyle} /><Legend /><Bar dataKey="inference_time" name="Inference Time (ms)" fill="#4da3ff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer></ChartFrame>
  </ChartCard>;
}
```


## `Components/Common/ChartCard.jsx`

```jsx
import EmptyState from "./EmptyState.jsx";

export default function ChartCard({ title, children, empty = true, icon = "bars", message = "No evaluation data yet.", description = "Valid evaluation data will appear here." }) {
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-2 text-[13px] font-semibold text-(color:--c-fg)">{title}</h3>
      {empty ? (
        <div className="dashboard-grid flex min-h-[130px] items-center justify-center rounded-md px-2 text-center">
          <EmptyState icon={icon} title={message} description={description} compact />
        </div>
      ) : <div className="h-[160px] min-w-0 w-full">{children}</div>}
    </article>
  );
}
```


## `Components/Common/DashboardHeader.jsx`

```jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Bell,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Search,
  Settings,
  Sun,
  UserRound,
  X,
} from "lucide-react";

function getInitials(user) {
  if (user?.initials) return user.initials.slice(0, 2).toUpperCase();
  const name = user?.name?.trim();
  if (!name) return "U";
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function DashboardHeader({
  title = "IDP System",
  logo = null,
  user = { name: "User", email: "" },
  notificationCount = 0,
  onSearch,
  onLogout,
  onProfile,
  onSettings,
  onNotificationsClick,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  const headerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMenuTriggerRef = useRef(null);
  const notificationTriggerRef = useRef(null);

  const unreadCount = Math.max(0, Number(notificationCount) || 0);
  const initials = getInitials(user);
  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  // Close popovers when focus/click moves outside the header or Escape is pressed.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (activePanel === "user") userMenuTriggerRef.current?.focus();
        if (activePanel === "notifications") notificationTriggerRef.current?.focus();
        setActivePanel(null);
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }

      if (activePanel !== "user") return;
      const items = userMenuRef.current?.querySelectorAll('[role="menuitem"]');
      if (!items?.length) return;
      const itemArray = Array.from(items);
      const currentIndex = itemArray.indexOf(document.activeElement);
      let nextIndex = currentIndex;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % itemArray.length;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex = currentIndex < 0 ? itemArray.length - 1 : (currentIndex - 1 + itemArray.length) % itemArray.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = itemArray.length - 1;
      } else {
        return;
      }
      itemArray[nextIndex]?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePanel]);

  // Put focus in opened menus and the mobile search field for keyboard users.
  useEffect(() => {
    if (mobileSearchOpen) mobileSearchRef.current?.focus();
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (activePanel !== "user") return undefined;
    const frame = window.requestAnimationFrame(() => {
      userMenuRef.current?.querySelector('[role="menuitem"]')?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePanel]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchValue.trim();
    if (query) onSearch?.(query);
  };

  const toggleTheme = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    document.documentElement.classList.toggle("light", !nextDark);
  };

  const closeAll = () => {
    setActivePanel(null);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const runMenuAction = (callback) => {
    closeAll();
    callback?.();
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-(color:--c-line) bg-(color:--c-bg)/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex min-h-14 max-w-[1312px] items-center gap-3 px-3 sm:px-7">
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-lg text-(color:--c-muted) transition hover:bg-(color:--c-inner) hover:text-(color:--c-fg) active:scale-[0.94] md:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="dashboard-mobile-navigation"
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          <a href="#main" className="flex items-center gap-2 rounded-md text-(color:--c-fg) no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(color:--c-accent)" aria-label={`${title} home`}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(color:--c-primary) text-white">
              {logo || <FileText size={18} strokeWidth={1.9} />}
            </span>
            <span className="hidden whitespace-nowrap text-sm font-bold tracking-tight sm:inline">{title}</span>
          </a>
        </div>

        {/* Desktop search is centered between the brand and account controls. */}
        <form
          role="search"
          className="relative mx-auto hidden w-full max-w-[554px] md:block"
          onSubmit={handleSearchSubmit}
        >
          <label htmlFor="dashboard-search" className="sr-only">Search documents, models, or history</label>
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(color:--c-muted)" aria-hidden="true" />
          <input
            id="dashboard-search"
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search documents, models, or history..."
            autoComplete="off"
            className="h-9 w-full rounded-md border border-(color:--c-line) bg-(color:--c-inner) pl-10 pr-3 text-sm text-(color:--c-fg) placeholder:text-(color:--c-muted) transition focus:border-(color:--c-accent) focus:outline-hidden focus:ring-2 focus:ring-(color:--c-accent)/40"
          />
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-(color:--c-muted) transition hover:bg-(color:--c-inner) hover:text-(color:--c-fg) md:hidden"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            aria-controls="dashboard-mobile-search"
            onClick={() => setMobileSearchOpen((open) => !open)}
          >
            {mobileSearchOpen ? <X size={19} /> : <Search size={19} />}
          </button>

          <div className="flex items-center gap-2">
            <Sun className="hidden h-5 w-5 text-(color:--c-muted) sm:block" />
            <button
              type="button"
              role="switch"
              aria-checked={dark}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className={`relative h-5 w-10 rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--c-accent) ${dark ? "bg-(color:--c-primary)" : "bg-slate-400"}`}
            >
              <span className={`absolute top-[3px] h-3.5 w-3.5 rounded-full bg-white transition-all duration-300 ${dark ? "left-[22px]" : "left-[3px]"}`} />
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              className="relative grid h-9 w-9 place-items-center rounded-lg text-(color:--c-muted) transition hover:bg-(color:--c-inner) hover:text-(color:--c-fg)"
              ref={notificationTriggerRef}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
              aria-haspopup="dialog"
              aria-expanded={activePanel === "notifications"}
              aria-controls="dashboard-notifications"
              onClick={() => {
                const opening = activePanel !== "notifications";
                setActivePanel(opening ? "notifications" : null);
                if (opening) onNotificationsClick?.();
              }}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-h-[17px] min-w-[17px] place-items-center rounded-full border-2 border-(color:--c-bg) bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
                  {badgeLabel}
                </span>
              )}
            </button>
            {activePanel === "notifications" && (
              <section
                id="dashboard-notifications"
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 mt-2 w-64 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3 text-sm shadow-xl shadow-black/30"
              >
                <p className="font-semibold">Notifications</p>
                <p className="mt-2 text-xs text-(color:--c-muted)">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}. Notification details will appear here when connected.`
                    : "No new notifications. Processing alerts will appear here."}
                </p>
              </section>
            )}
          </div>

          <div className="relative">
            <button
              ref={userMenuTriggerRef}
              type="button"
              className="flex cursor-pointer items-center gap-1 rounded-full transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--c-accent)"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={activePanel === "user"}
              aria-controls="dashboard-user-menu"
              onClick={() => setActivePanel((current) => current === "user" ? null : "user")}
            >
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#9cc4f5] text-xs font-semibold text-[#1b4f9c]" aria-hidden="true">
                  {initials}
                </span>
              )}
              <ChevronDown size={13} className="hidden text-(color:--c-muted) sm:block" aria-hidden="true" />
            </button>
            {activePanel === "user" && (
              <div
                id="dashboard-user-menu"
                ref={userMenuRef}
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 mt-2 w-48 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-1 text-sm shadow-xl shadow-black/30"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-xs font-semibold text-(color:--c-fg)">{user?.name || "User"}</p>
                  {user?.email && <p className="mt-0.5 truncate text-[11px] text-(color:--c-muted)">{user.email}</p>}
                </div>
                <div className="my-1 h-px bg-(color:--c-line)" />
                <button type="button" role="menuitem" onClick={() => runMenuAction(onProfile)} className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-(color:--c-fg) transition hover:bg-(color:--c-inner)">
                  <UserRound size={15} /> Profile
                </button>
                <button type="button" role="menuitem" onClick={() => runMenuAction(onSettings)} className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-(color:--c-fg) transition hover:bg-(color:--c-inner)">
                  <Settings size={15} /> Settings
                </button>
                <div className="my-1 h-px bg-(color:--c-line)" />
                <button type="button" role="menuitem" onClick={() => runMenuAction(onLogout)} className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-red-400 transition hover:bg-(color:--c-inner)">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search expands on demand to keep the header usable on narrow screens. */}
      {mobileSearchOpen && (
        <div id="dashboard-mobile-search" className="border-t border-(color:--c-line) px-3 py-3 md:hidden">
          <form role="search" onSubmit={handleSearchSubmit} className="relative">
            <label htmlFor="dashboard-mobile-search-input" className="sr-only">Search documents, models, or history</label>
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(color:--c-muted)" aria-hidden="true" />
            <input
              ref={mobileSearchRef}
              id="dashboard-mobile-search-input"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search documents, models, or history..."
              className="h-10 w-full rounded-md border border-(color:--c-line) bg-(color:--c-inner) pl-10 pr-3 text-sm text-(color:--c-fg) placeholder:text-(color:--c-muted) focus:border-(color:--c-accent) focus:outline-hidden focus:ring-2 focus:ring-(color:--c-accent)/40"
            />
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <nav id="dashboard-mobile-navigation" className="border-t border-(color:--c-line) px-3 py-3 md:hidden" aria-label="Dashboard navigation">
          <ul className="grid gap-1 text-sm">
            <li><a onClick={() => setMobileMenuOpen(false)} href="#result" className="block rounded-md px-3 py-2 text-(color:--c-fg) transition hover:bg-(color:--c-inner)">Document Processing Result</a></li>
            <li><a onClick={() => setMobileMenuOpen(false)} href="#analytics" className="block rounded-md px-3 py-2 text-(color:--c-fg) transition hover:bg-(color:--c-inner)">Model Performance Analytics</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.node,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    avatarUrl: PropTypes.string,
    initials: PropTypes.string,
  }),
  notificationCount: PropTypes.number,
  onSearch: PropTypes.func,
  onLogout: PropTypes.func,
  onProfile: PropTypes.func,
  onSettings: PropTypes.func,
  onNotificationsClick: PropTypes.func,
};
```


## `Components/Common/EmptyState.jsx`

```jsx
import Icon from "./Icon.jsx";

export default function EmptyState({ icon = "doc", title, description, compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center text-xs leading-relaxed text-(color:--c-muted) ${compact ? "p-2" : "p-4"}`}>
      <Icon name={icon} className={`${compact ? "mb-1 h-6 w-6" : "mb-3 h-9 w-9"} text-(color:--c-accent)`} />
      {title ? <p className="font-semibold text-(color:--c-accent)">{title}</p> : null}
      <p className="max-w-[220px]">{description}</p>
    </div>
  );
}
```


## `Components/Common/Icon.jsx`

```jsx
import {
  FileText, List, CheckSquare, XSquare, Clock3, Search, Sun, Bell, UserRound,
  ChartNoAxesColumnIncreasing, Target, Award, Grid2X2, Info, ArrowRight, Menu, X,
  Circle, FileSpreadsheet, Pentagon
} from "lucide-react";

const icons = {
  doc: FileText, list: List, check: CheckSquare, x: XSquare, clock: Clock3,
  search: Search, sun: Sun, bell: Bell, user: UserRound, bars: ChartNoAxesColumnIncreasing,
  target: Target, award: Award, grid: Grid2X2, info: Info, arrow: ArrowRight,
  menu: Menu, close: X, circle: Circle, spreadsheet: FileSpreadsheet, pent: Pentagon,
};

export default function Icon({ name, className = "h-5 w-5", ...props }) {
  const Component = icons[name] ?? FileText;
  return <Component className={className} strokeWidth={1.8} {...props} />;
}
```


## `Components/Common/StatCard.jsx`

```jsx
export default function StatCard({ icon: Icon, label, value = "—", tone = "blue", note = "—" }) {
  const tones = {
    blue: "bg-(color:--c-secondary) text-[#bcd7ff]",
    green: "bg-[#034a45] text-emerald-300",
    red: "bg-[#5a2230] text-red-300",
    violet: "bg-[#2c1a78] text-violet-300",
    sky: "bg-[#003a7e] text-sky-300",
    orange: "bg-[#5a3a22] text-orange-300",
  };
  return (
    <article className="flex min-w-0 items-center gap-4 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-(color:--c-accent)/60 sm:p-4">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg sm:h-14 sm:w-14 ${tones[tone]}`}>
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-right text-[11px] text-(color:--c-muted)">
        <p>—</p><p className="mt-3">vs. last 7 days</p>
      </div>
    </article>
  );
}
```


## `Components/Scanning/ClassProbability.jsx`

```jsx
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Icon from "../Common/Icon.jsx";
export default function ClassProbability({ data = null }) {
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Class Probability</h3>
      {Array.isArray(data) && data.length ? (
        <div className="h-[110px] w-full rounded-md border border-(color:--c-line) p-2">
          <ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="var(--c-grid)" /><XAxis dataKey="class" tick={{fontSize:9}} /><YAxis domain={[0,100]} tick={{fontSize:9}} /><Tooltip contentStyle={{background:"var(--c-panel)",border:"1px solid var(--c-line)"}} /><Bar dataKey="probability" fill="#4da3ff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer>
        </div>
      ) : (
        <div className="dashboard-grid flex min-h-[110px] flex-col items-center justify-center rounded-md border border-(color:--c-line) p-4 text-center text-xs text-(color:--c-muted)">
          <Icon name="bars" className="mb-2 h-7 w-7 text-(color:--c-accent)" />
          <p className="font-semibold text-(color:--c-accent)">No prediction results yet.</p>
          <p>Process a document to see class probabilities.</p>
        </div>
      )}
    </article>
  );
}
```


## `Components/Scanning/DocumentPreview.jsx`

```jsx
import Icon from "../Common/Icon.jsx";
export default function DocumentPreview({ fileUrl = null, fileName = null }) {
  return (
    <article className="flex flex-col rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Document Preview</h3>
      {fileUrl ? <iframe title={fileName || "Document preview"} src={fileUrl} className="min-h-[220px] flex-1 rounded-md border border-(color:--c-line)" /> :
        <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-md border border-dashed border-(color:--c-dash)/70 p-4 text-center text-xs leading-relaxed text-(color:--c-muted)">
          <Icon name="doc" className="mb-3 h-10 w-10 text-(color:--c-accent)" />
          <p className="text-[13px] font-semibold text-(color:--c-accent)">No document selected</p>
          <p className="mt-2 max-w-[200px]">The processed document preview will appear here.</p>
        </div>}
    </article>
  );
}
```


## `Components/Scanning/DocumentProcessingResult.jsx`

```jsx
import { FileText } from "lucide-react";
import ProcessingStatus from "./ProcessingStatus.jsx";
import DocumentPreview from "./DocumentPreview.jsx";
import ExtractedInformation from "./ExtractedInformation.jsx";
import OcrExtractedText from "./OcrExtractedText.jsx";
import PredictionResults from "./PredictionResults.jsx";
import ClassProbability from "./ClassProbability.jsx";
import Icon from "../Common/Icon.jsx";

export default function DocumentProcessingResult({ documentData = null, onViewAnalytics }) {
  return (
    <section id="result" className="scroll-mt-20 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3 sm:p-4" aria-labelledby="resultTitle">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-(color:--c-primary) text-white"><FileText className="h-5 w-5" /></span>
        <div><h2 id="resultTitle" className="text-lg font-semibold leading-tight">Document Processing Result</h2><p className="text-sm text-(color:--c-muted)">Details of the recently processed document.</p></div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ProcessingStatus status={documentData?.status ?? "idle"} currentStage={documentData?.current_stage} />
        <DocumentPreview fileUrl={documentData?.preview_url} fileName={documentData?.file_name} />
        <ExtractedInformation data={documentData?.extracted_information} />
        <OcrExtractedText text={documentData?.ocr_text ?? ""} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <PredictionResults prediction={documentData?.prediction} />
        <ClassProbability data={documentData?.class_probabilities} />
        <article className="flex flex-col items-center justify-center gap-4 rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-5 text-center">
          <button type="button" onClick={onViewAnalytics} className="group flex h-12 w-full max-w-[330px] cursor-pointer items-center justify-center gap-2 rounded-md border border-(color:--c-accent) bg-linear-to-b from-[#1a7bff] to-(color:--c-primary) text-[15px] font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:scale-[1.03] hover:shadow-blue-500/50 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--c-accent)">
            <Icon name="bars" className="h-5 w-5" />View Analytics<Icon name="arrow" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="max-w-xs text-xs leading-relaxed text-(color:--c-muted)">Click to view detailed model performance, comparison, and analytics after processing documents.</p>
        </article>
      </div>
    </section>
  );
}
```


## `Components/Scanning/DocumentProcessingSummary.jsx`

```jsx
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
```


## `Components/Scanning/ExtractedInformation.jsx`

```jsx
import Icon from "../Common/Icon.jsx";
export default function ExtractedInformation({ data = null }) {
  return (
    <article className="flex flex-col rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Extracted Information</h3>
      {data && Object.keys(data).length ? <dl className="min-h-[220px] space-y-2 overflow-auto rounded-md border border-(color:--c-line) p-3 text-xs">{Object.entries(data).map(([key,value]) => <div key={key} className="border-b border-(color:--c-line) pb-2"><dt className="text-(color:--c-muted)">{key}</dt><dd className="mt-1 break-words">{String(value)}</dd></div>)}</dl> :
        <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-md border border-dashed border-(color:--c-dash)/70 p-4 text-center text-xs leading-relaxed text-(color:--c-muted)">
          <Icon name="list" className="mb-3 h-9 w-9 text-(color:--c-accent)" />
          <p className="max-w-[180px]">Extracted information will appear here after processing the document.</p>
        </div>}
    </article>
  );
}
```


## `Components/Scanning/OcrExtractedText.jsx`

```jsx
import Icon from "../Common/Icon.jsx";
export default function OcrExtractedText({ text = "" }) {
  return (
    <article className="flex flex-col rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">OCR Extracted Text</h3>
      {text ? <pre className="min-h-[220px] whitespace-pre-wrap overflow-auto rounded-md border border-(color:--c-line) p-3 text-xs leading-relaxed text-(color:--c-fg)">{text}</pre> :
        <div className="flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-md border border-dashed border-(color:--c-dash)/70 p-4 text-center text-xs leading-relaxed text-(color:--c-muted)">
          <Icon name="doc" className="mb-3 h-9 w-9 text-(color:--c-accent)" />
          <p className="max-w-[180px]">OCR extracted text will appear here after processing the document.</p>
        </div>}
    </article>
  );
}
```


## `Components/Scanning/PredictionResults.jsx`

```jsx
import Icon from "../Common/Icon.jsx";
export default function PredictionResults({ prediction = null }) {
  const value = (v) => v == null || v === "" ? "—" : v;
  const confidence = prediction?.confidence_score == null ? "—" : `${(Number(prediction.confidence_score) <= 1 ? Number(prediction.confidence_score)*100 : Number(prediction.confidence_score)).toFixed(2)}%`;
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Prediction Results</h3>
      <dl className="grid grid-cols-2 overflow-hidden rounded-md border border-(color:--c-line) text-xs [&>div]:p-3">
        <div className="flex items-center gap-3 border-b border-r border-(color:--c-line)">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#034a45] text-emerald-300"><Icon name="doc" className="h-5 w-5" /></span>
          <span><dt className="text-(color:--c-muted)">Predicted Class</dt><dd className="font-bold">{value(prediction?.predicted_class)}</dd></span>
        </div>
        <div className="border-b border-(color:--c-line)"><dt className="text-(color:--c-muted)">Confidence Score</dt><dd className="mt-1 font-bold">{confidence}</dd></div>
        <div className="border-r border-(color:--c-line)"><dt className="text-(color:--c-muted)">Selected Model</dt><dd className="mt-1 font-bold">{value(prediction?.model_name)}</dd></div>
        <div><dt className="text-(color:--c-muted)">Processing Time</dt><dd className="mt-1 font-bold">{value(prediction?.processing_time)}</dd></div>
      </dl>
    </article>
  );
}
```


## `Components/Scanning/ProcessingStatus.jsx`

```jsx
import Icon from "../Common/Icon.jsx";

const stages = ["File Uploaded", "Text Extraction", "Document Classification", "Field Extraction"];

export default function ProcessingStatus({ status = "idle", currentStage = null }) {
  const activeIndex = stages.indexOf(currentStage);
  const isIdle = status === "idle";
  return (
    <article className="rounded-lg border border-(color:--c-line) bg-(color:--c-inner)/60 p-3">
      <h3 className="mb-3 text-sm font-semibold text-(color:--c-fg)">Processing Status</h3>
      <div className="rounded-md border border-(color:--c-line) p-3">
        <ol className="space-y-3.5 text-xs">
          {isIdle ? (
            <li className="flex items-center gap-3 font-semibold text-(color:--c-accent)">
              <span className="relative grid h-5 w-5 place-items-center rounded-full border-2 border-(color:--c-accent) bg-(color:--c-panel)"><span className="h-2 w-2 animate-pulse rounded-full bg-(color:--c-accent)" /></span>
              <span className="text-[13px]">No document processed yet</span>
            </li>
          ) : stages.map((stage, index) => {
            const complete = status === "completed" || index < activeIndex;
            const active = stage === currentStage && status !== "completed";
            return (
              <li key={stage} className={`flex items-center gap-3 ${active ? "font-semibold text-(color:--c-accent)" : complete ? "text-emerald-300" : "text-(color:--c-muted)"}`}>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${active ? "border-2 border-(color:--c-accent) bg-(color:--c-panel)" : complete ? "bg-emerald-600" : "bg-[#3c5f9b]"}`}>
                  {complete ? <Icon name="check" className="h-3.5 w-3.5" /> : active ? <span className="h-2 w-2 rounded-full bg-(color:--c-accent)" /> : null}
                </span>
                <span className="flex-1">{stage}</span>
                <span>{complete ? "✓" : active ? "…" : "—"}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mt-3 flex items-start gap-3 rounded-md border border-(color:--c-line) bg-(color:--c-inner) p-3 text-xs" role="status">
        <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-(color:--c-accent)" />
        <p><span className="block font-semibold">{isIdle ? "No document processed yet." : status === "completed" ? "Document processing completed." : status === "failed" ? "Document processing failed." : "Document processing in progress."}</span>
          <span className="text-[11px] text-(color:--c-muted)">{isIdle ? "Upload a document from the dashboard to start processing." : "Processing status is provided by the backend."}</span></p>
      </div>
    </article>
  );
}
```


## `Pages/ScanningPage.jsx`

```jsx
import { useCallback, useRef, useState } from "react";
import DocumentProcessingSummary from "../Components/Scanning/DocumentProcessingSummary.jsx";
import DocumentProcessingResult from "../Components/Scanning/DocumentProcessingResult.jsx";
import ModelPerformanceAnalytics from "../Components/Analytics/ModelPerformanceAnalytics.jsx";
import useDashboardData from "../hooks/useDashboardData.js";

export default function ScanningPage() {
  const dashboard = useDashboardData();
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);
  const analyticsRef = useRef(null);

  const handleViewAnalytics = useCallback(() => {
    setAnalyticsExpanded(true);
    window.requestAnimationFrame(() => {
      analyticsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  }, []);

  return (
    <main id="main" className="mx-auto max-w-[1312px] space-y-3 px-3 py-3 sm:px-7">
      {/* The entire top header bar is intentionally omitted. The dashboard begins with the KPI cards. */}
      <DocumentProcessingSummary stats={dashboard?.stats ?? null} />

      <DocumentProcessingResult
        documentData={dashboard?.latest_document ?? null}
        onViewAnalytics={handleViewAnalytics}
      />

      <div className="relative py-1">
        <div className="h-[3px] rounded-sm bg-(color:--c-line)" />
        <button
          type="button"
          onClick={() => setAnalyticsExpanded((value) => !value)}
          className="absolute left-1/2 top-1/2 h-1.5 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-(color:--c-accent)/70 transition hover:h-2 hover:bg-(color:--c-accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(color:--c-accent)"
          aria-label="Collapse or expand analytics"
          aria-expanded={analyticsExpanded}
          aria-controls="analytics"
        />
      </div>

      <div ref={analyticsRef} className={analyticsExpanded ? "block" : "hidden"}>
        <ModelPerformanceAnalytics evaluation={dashboard?.evaluation ?? null} />
      </div>
    </main>
  );
}
```


## `hooks/useDashboardData.js`

```javascript
import { useEffect, useState } from "react";
import api from "../services/api.js";

export default function useDashboardData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    api.get("/dashboard", { signal: controller.signal })
      .then(response => setData(response.data ?? null))
      .catch(() => { /* Keep the source HTML's original empty states until the API exists. */ });
    return () => controller.abort();
  }, []);
  return data;
}
```


## `services/api.js`

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 30000,
});
export default api;
```
