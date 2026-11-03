import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSettings from "../components/settings/ThemeSettings";
import AIModelSettings from "../components/settings/AIModelSettings";
import DocumentUploadSettings from "../components/settings/DocumentUploadSettings";
import StorageHistory from "../components/settings/StorageHistory";
import TextExtractionSettings from "../components/settings/TextExtractionSettings";
import Toast from "../components/settings/Toast";
import { getSettings as getSettingsApi, saveSettings as saveSettingsApi, listDocuments, deleteDocument as deleteServerDocument } from "../services/idpService.js";
import { getApiErrorMessage } from "../services/api.js";


const SETTINGS_KEY = "dashboardSettings.v1";
const DOCS_KEY = "dashboardDocuments.v1";
const SELECTION_KEY = "selectedDocuments";

const TEXT_MODELS = ["Logistic Regression", "Linear SVM", "KNN (Cosine)", "Multinomial Naive Bayes"];
const IMAGE_MODELS = ["ResNet18", "MobileNetV2", "EfficientNet-B0"];
const FORMATS = ["PDF", "JPG", "PNG", "JPEG", "DOCX", "XLSX", "PPTX", "TXT", "CSV", "BSON", "JSON", "XML", "ZIP", "RAR"];
const IMAGE_FORMATS = ["JPG", "PNG", "JPEG"];

const DEFAULTS = {
  theme: "navy",
  preferredModel: "auto",
  textModels: TEXT_MODELS.slice(),
  imageModels: IMAGE_MODELS.slice(),
  formats: ["PDF"],
  threshold: 70,
  lowAction: "Mark for manual review",
  maxSize: "10 MB",
  retention: "Keep until manually deleted",
  ocrDisplay: "Show status (Required / Completed / Failed)",
  switches: { rejectState: true, ocrState: true, showState: true, preserveState: true },
  collapsed: {},
};

const DEFAULT_DOCS = { count: 0, usedMB: 0 };

const SELECT_MESSAGES = {
  preferredModel: "Preferred model saved",
  lowAction: "Low-confidence action saved",
  maxSize: "Max file size saved",
  retention: "Retention policy saved",
  ocrDisplay: "OCR status display saved",
};

const SWITCH_MESSAGES = {
  rejectState: "Reject empty/invalid files",
  ocrState: "Scanned-PDF detection",
  showState: "Show extracted text",
  preserveState: "Preserve original file",
};

const memoryStore = {};

function storageGet(key) {
  try {
    if (typeof window === "undefined") throw new Error("Browser storage is unavailable");
    return window.localStorage.getItem(key);
  } catch {
    return memoryStore[key] || null;
  }
}

function storageSet(key, value) {
  try {
    if (typeof window === "undefined") throw new Error("Browser storage is unavailable");
    window.localStorage.setItem(key, value);
  } catch {
    memoryStore[key] = value;
  }
}

function readJSON(key, fallback) {
  try {
    const raw = storageGet(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  storageSet(key, JSON.stringify(value));
}

function onlyKnown(list, allowed, fallback) {
  const clean = (Array.isArray(list) ? list : []).filter((value) => allowed.includes(value));
  return clean.length ? clean : fallback.slice();
}

function loadSettings() {
  const saved = readJSON(SETTINGS_KEY, {});
  const settings = JSON.parse(JSON.stringify(DEFAULTS));

  ["theme", "preferredModel", "lowAction", "maxSize", "retention", "ocrDisplay"].forEach((key) => {
    if (typeof saved?.[key] === "string") settings[key] = saved[key];
  });

  if (typeof saved?.threshold === "number") {
    settings.threshold = Math.min(90, Math.max(50, saved.threshold));
  }
  if (saved?.theme !== "light") settings.theme = "navy";

  settings.textModels = onlyKnown(saved?.textModels, TEXT_MODELS, DEFAULTS.textModels);
  settings.imageModels = onlyKnown(saved?.imageModels, IMAGE_MODELS, DEFAULTS.imageModels);
  settings.formats = onlyKnown(saved?.formats, FORMATS, DEFAULTS.formats);

  Object.keys(settings.switches).forEach((key) => {
    if (saved?.switches && typeof saved.switches[key] === "boolean") {
      settings.switches[key] = saved.switches[key];
    }
  });

  if (saved?.collapsed && typeof saved.collapsed === "object") {
    settings.collapsed = saved.collapsed;
  }

  const availableModels = settings.textModels.concat(settings.imageModels);
  if (settings.preferredModel !== "auto" && !availableModels.includes(settings.preferredModel)) {
    settings.preferredModel = "auto";
  }

  return settings;
}

function BackgroundGradient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[image:radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(59,130,246,0.18)_0%,transparent_55%),radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(168,85,247,0.12)_0%,transparent_50%),radial-gradient(ellipse_50%_60%_at_70%_80%,rgba(59,130,246,0.08)_0%,transparent_45%)]"
    />
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(loadSettings);
  const settingsRef = useRef(settings);
  const [docs, setDocs] = useState(() => readJSON(DOCS_KEY, DEFAULT_DOCS) || DEFAULT_DOCS);
  const docsRef = useRef(docs);
  const [toast, setToast] = useState({ message: "", tone: "info", id: 0 });
  const [deleteButtonLabel, setDeleteButtonLabel] = useState("Delete Selected");
  const [deleteFlashing, setDeleteFlashing] = useState(false);
  const deleteFlashTimer = useRef(null);
  const [goTrackButtonLabel, setGoTrackButtonLabel] = useState("Go to Track & Manage");
  const [goTrackFlashing, setGoTrackFlashing] = useState(false);
  const goTrackFlashTimer = useRef(null);
  const thresholdCommitted = useRef(settings.threshold);

  const showToast = useCallback((message, tone = "info") => {
    setToast((current) => ({ message, tone, id: current.id + 1 }));
  }, []); 

  const saveCurrentSettings = useCallback(() => {
    writeJSON(SETTINGS_KEY, settingsRef.current);
    window.dispatchEvent(new CustomEvent("idp:settings-changed", { detail: settingsRef.current }));
    saveSettingsApi(settingsRef.current).catch((error) => showToast(getApiErrorMessage(error, "Could not save settings to the server."), "warn"));
  }, [showToast]);

  const updateSettings = useCallback((updater, message, persist = true) => {
    const current = settingsRef.current;
    const next = typeof updater === "function" ? updater(current) : { ...current, ...updater };
    if (next === current) return current;
    settingsRef.current = next;
    setSettings(next);
    if (persist) {
      writeJSON(SETTINGS_KEY, next);
      window.dispatchEvent(new CustomEvent("idp:settings-changed", { detail: next }));
      saveSettingsApi(next).catch((error) => showToast(getApiErrorMessage(error, "Could not save settings to the server."), "warn"));
    }
    if (message) showToast(message, "ok");
    return next;
  }, [showToast]);

  useEffect(() => {
    document.documentElement.classList.toggle("light", settings.theme === "light");
    window.dispatchEvent(new CustomEvent("idp:settings-changed", { detail: settings }));
  }, [settings]);

  useEffect(() => {
    let active = true;
    Promise.all([getSettingsApi(), listDocuments({ page: 1, limit: 100 })]).then(([remoteSettings, payload]) => {
      if (!active) return;
      const merged = { ...loadSettings(), ...(remoteSettings || {}) };
      settingsRef.current = merged;
      setSettings(merged);
      writeJSON(SETTINGS_KEY, merged);
      const items = payload?.items || [];
      const nextDocs = { count: Number(payload?.pagination?.total ?? items.length), usedMB: items.reduce((total, item) => total + Number(item.size || 0), 0) / (1024 * 1024) };
      docsRef.current = nextDocs;
      setDocs(nextDocs);
    }).catch((error) => { if (active) showToast(getApiErrorMessage(error, "Could not load saved settings and storage details."), "warn"); });
    return () => { active = false; };
  }, [showToast]);

  useEffect(() => () => {
    if (deleteFlashTimer.current) window.clearTimeout(deleteFlashTimer.current);
    if (goTrackFlashTimer.current) window.clearTimeout(goTrackFlashTimer.current);
  }, []);

  useEffect(() => {
    const previousDashboard = window.Dashboard;
    const dashboardApi = {
      getSettings: () => JSON.parse(JSON.stringify(settingsRef.current)),
      setDocuments: (count, usedMB) => {
        const nextDocs = { count: Number(count) || 0, usedMB: Number(usedMB) || 0 };
        docsRef.current = nextDocs;
        setDocs(nextDocs);
        writeJSON(DOCS_KEY, nextDocs);
      },
      setSelectedDocuments: (list) => {
        writeJSON(SELECTION_KEY, Array.isArray(list) ? list : []);
      },
    };

    window.Dashboard = dashboardApi;
    return () => {
      if (window.Dashboard === dashboardApi) {
        if (previousDashboard === undefined) delete window.Dashboard;
        else window.Dashboard = previousDashboard;
      }
    };
  }, []);

  const toggleSection = (key) => {
    updateSettings((current) => {
      const collapsed = { ...current.collapsed };
      if (collapsed[key]) delete collapsed[key];
      else collapsed[key] = true;
      return { ...current, collapsed };
    });
  };

  const changeTheme = (theme) => {
    if (theme === settingsRef.current.theme) return;
    updateSettings({ theme }, theme === "light" ? "Light theme applied" : "Navy Blue theme applied");
  };

  const changeSelect = (key, value) => {
    updateSettings({ [key]: value }, SELECT_MESSAGES[key]);
  };

  const changeModel = (key, item, checked) => {
    updateSettings((current) => {
      const nextItems = checked
        ? [...current[key], item]
        : current[key].filter((value) => value !== item);

      if (nextItems.length === 0) {
        showToast("At least one option must stay selected", "warn");
        return current;
      }

      const next = { ...current, [key]: nextItems };
      const available = next.textModels.concat(next.imageModels);
      if (next.preferredModel !== "auto" && !available.includes(next.preferredModel)) {
        next.preferredModel = "auto";
      }
      return next;
    }, key === "textModels" ? "Text models updated" : "Image models updated");
  };

  const changeFormat = (format, checked) => {
    const current = settingsRef.current;
    const nextFormats = checked
      ? [...current.formats, format]
      : current.formats.filter((value) => value !== format);

    if (nextFormats.length === 0) {
      showToast("At least one option must stay selected", "warn");
      return;
    }

    updateSettings({ formats: nextFormats }, "Allowed formats updated");
    if (checked && IMAGE_FORMATS.includes(format) && !settingsRef.current.switches.ocrState) {
      showToast(`${format} files need OCR – enable "Detect Scanned PDFs (OCR)"`, "warn");
    }
  };

  const changeSwitch = (key, checked) => {
    updateSettings(
      (current) => ({ ...current, switches: { ...current.switches, [key]: checked } }),
      `${SWITCH_MESSAGES[key]}${checked ? " enabled" : " disabled"}`,
    );
  };

  const changeThreshold = (value) => {
    updateSettings((current) => ({ ...current, threshold: value }), undefined, false);
  };

  const commitThreshold = () => {
    const value = settingsRef.current.threshold;
    if (value === thresholdCommitted.current) return;
    thresholdCommitted.current = value;
    saveCurrentSettings();
    showToast(`Threshold set to ${value}%`, "ok");
  };

  const flashDeleteButton = (text) => {
    if (deleteFlashTimer.current) return;
    setDeleteButtonLabel(text);
    setDeleteFlashing(true);
    deleteFlashTimer.current = window.setTimeout(() => {
      setDeleteButtonLabel("Delete Selected");
      setDeleteFlashing(false);
      deleteFlashTimer.current = null;
    }, 1200);
  };

  const flashGoTrackButton = () => {
    if (goTrackFlashTimer.current) return;
    setGoTrackButtonLabel("Opening…");
    setGoTrackFlashing(true);
    goTrackFlashTimer.current = window.setTimeout(() => {
      setGoTrackButtonLabel("Go to Track & Manage");
      setGoTrackFlashing(false);
      goTrackFlashTimer.current = null;
    }, 1200);
  };

  const goTrack = () => {
    flashGoTrackButton();
    navigate("/track-manage");
  };

  const deleteSelected = async () => {
    const selection = readJSON(SELECTION_KEY, []);
    const selectedDocuments = Array.isArray(selection) ? selection : [];
    if (selectedDocuments.length === 0) {
      flashDeleteButton("No document selected");
      showToast("Select documents in Track & Manage first", "warn");
      return;
    }
    const noun = selectedDocuments.length === 1 ? "document" : "documents";
    if (!window.confirm(`Permanently delete ${selectedDocuments.length} ${noun}? This cannot be undone.`)) return;
    try {
      await Promise.all(selectedDocuments.filter((item) => item.id).map((item) => deleteServerDocument(item.id)));
      const freed = selectedDocuments.reduce((sum, document) => sum + (Number(document.sizeMB) || 0), 0);
      const nextDocs = { count: Math.max(0, docsRef.current.count - selectedDocuments.length), usedMB: Math.max(0, docsRef.current.usedMB - freed) };
      docsRef.current = nextDocs; setDocs(nextDocs); writeJSON(DOCS_KEY, nextDocs); writeJSON(SELECTION_KEY, []);
      showToast(`${selectedDocuments.length} ${noun} deleted`, "ok");
    } catch (error) { showToast(getApiErrorMessage(error, "Could not delete the selected documents."), "warn"); }
  };

  const availableModels = settings.textModels.concat(settings.imageModels);

  return (
    <div className="relative min-h-dvh scroll-smooth motion-reduce:scroll-auto overflow-x-hidden bg-[#03132e] font-sans text-[#f0f5ff] antialiased [color-scheme:dark] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] [.light_&]:[color-scheme:light] min-[1920px]:text-[18px] min-[2560px]:text-[22px]">
      <BackgroundGradient />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-3 p-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-4 sm:p-4 lg:gap-5 lg:p-6">
          <Link
          to="/home"
          className="absolute -left-10 top-4 z-10 inline-flex items-center justify-start  gap-2 rounded-lg border border-blue-500/40 bg-[#0B1730] px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm transition hover:border-cyan-400 hover:bg-[#10234A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18] active:scale-95"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5m7 7-7-7 7-7"
            />
          </svg>
        </Link>
        
        <ThemeSettings
          theme={settings.theme}
          onThemeChange={changeTheme}
          open={!settings.collapsed.appearance}
          onToggle={() => toggleSection("appearance")}
        />

        <AIModelSettings
          settings={settings}
          availableModels={availableModels}
          open={!settings.collapsed.models}
          onToggle={() => toggleSection("models")}
          onSelectChange={changeSelect}
          onModelToggle={changeModel}
          onThresholdChange={changeThreshold}
          onThresholdCommit={commitThreshold}
        />

        <DocumentUploadSettings
          settings={settings}
          open={!settings.collapsed.upload}
          onToggle={() => toggleSection("upload")}
          onSelectChange={changeSelect}
          onFormatToggle={changeFormat}
          onSwitchChange={changeSwitch}
        />

        <StorageHistory
          settings={settings}
          docs={docs}
          open={!settings.collapsed.storage}
          onToggle={() => toggleSection("storage")}
          onRetentionChange={(value) => changeSelect("retention", value)}
          onGoTrack={goTrack}
          goTrackButtonLabel={goTrackButtonLabel}
          goTrackFlashing={goTrackFlashing}
          onDeleteSelected={deleteSelected}
          deleteButtonLabel={deleteButtonLabel}
          deleteFlashing={deleteFlashing}
        />

        <TextExtractionSettings
          settings={settings}
          open={!settings.collapsed.extraction}
          onToggle={() => toggleSection("extraction")}
          onSelectChange={changeSelect}
          onSwitchChange={changeSwitch}
        />
      </main>

      <Toast toast={toast} />
    </div>
  );
}
