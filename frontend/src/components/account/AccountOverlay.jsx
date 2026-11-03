import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const panelTitles = { profile: "My Profile", security: "Security", preferences: "Preferences", notifications: "Notification Settings", sessions: "Active Sessions", help: "Help & Support", about: "About", logout: "Log out" };

function maskEmail(value) { const [name = "", domain = "example.com"] = value.split("@"); return `${name.charAt(0)}•••@${domain}`; }
function maskPhone(value) { const digits = value.replace(/\D/g, ""); return `${value.trim().startsWith("+") ? "+" : ""}•••••••${digits.slice(-2)}`; }

export default function AccountOverlay({ open, initialView, onClose, onProfileChange, profile, onCompactChange, onMarkNotificationsRead, notificationBadgeVisible, onNotificationBadgeChange, uploadRef }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [previousView, setPreviousView] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: profile.name, email: profile.email });
  const [profileStatus, setProfileStatus] = useState("");
  const [profileError, setProfileError] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || null);
  const photoInputRef = useRef(null);
  const titleRef = useRef(null);
  const [showPasswords, setShowPasswords] = useState({ pwCur: false, pwNew: false, pwCon: false });
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [twoFaMethod, setTwoFaMethod] = useState("app");
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaStatus, setTwoFaStatus] = useState("");
  const [twoFaError, setTwoFaError] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState("");
  const [qrPath, setQrPath] = useState("");
  const [twoFaKey, setTwoFaKey] = useState("");
  const [compact, setCompact] = useState(false);
  const [status, setStatus] = useState({});
  const [recoveryEmail, setRecoveryEmail] = useState("member@example.com");
  const [recoveryPhone, setRecoveryPhone] = useState("+91 98765 43210");
  const [editingRecovery, setEditingRecovery] = useState(null);
  const [recoveryDraft, setRecoveryDraft] = useState("");
  const [alerts, setAlerts] = useState({ lblAlNew: true, lblAlFail: true, lblAlPw: true, lblAlRec: false, lblAlLoc: false });
  const [otherSessions, setOtherSessions] = useState([
    { id: "s2", name: "Safari on iPhone", location: "Pune, India · 2 hours ago" },
    { id: "s3", name: "Chrome on Android", location: "Delhi, India · Yesterday, 9:14 PM" },
    { id: "s4", name: "Edge on Windows", location: "Hyderabad, India · 3 days ago" },
  ]);
  const [activityStatus, setActivityStatus] = useState("");
  const sessionsEmptyRef = useRef(null);
  const twoFaCodeRef = useRef(null);
  const pwCurrentRef = useRef(null);
  const pwNewRef = useRef(null);
  const pwConfirmRef = useRef(null);
  const recoveryEmailRef = useRef(null);
  const recoveryPhoneRef = useRef(null);
  const dialogRef = useRef(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState("");
  const [recoveryError, setRecoveryError] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [backupStatus, setBackupStatus] = useState("");
  useEffect(() => { setActiveView(open ? (initialView || "profile") : null); }, [open, initialView]);
  useEffect(() => { setProfileDraft({ name: profile.name, email: profile.email }); setPhotoUrl(profile.photoUrl || null); }, [profile.name, profile.email, profile.photoUrl]);
  useEffect(() => { if (open && activeView) titleRef.current?.focus(); }, [open, activeView]);
  useEffect(() => { if (!photoUrl) return undefined; return () => URL.revokeObjectURL(photoUrl); }, [photoUrl]);
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (newPassword.length) {
      if (newPassword.length >= 8) score++;
      if (newPassword.length >= 12) score++;
      if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score++;
      if (/\d/.test(newPassword)) score++;
      if (/[^A-Za-z0-9]/.test(newPassword)) score++;
      score = Math.max(1, Math.min(4, newPassword.length < 10 ? Math.min(score, 1) : score - (score > 4 ? 1 : 0)));
    }
    return { score, label: `Strength: ${["not entered", "Weak", "Fair", "Good", "Strong"][score]}` };
  }, [newPassword]);
  const maskedRecoveryEmail = maskEmail(recoveryEmail);
  const maskedRecoveryPhone = maskPhone(recoveryPhone);
  const say = (key, message, error = false) => setStatus((current) => ({ ...current, [key]: { message, error } }));
  const randomKey = () => { const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"; return Array.from({ length: 16 }, (_, index) => alphabet[secureIndex(alphabet.length)] + (index % 4 === 3 && index < 15 ? " " : "")).join(""); };
  const generateQrPath = () => { let seed = 11; const random = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }; let d = ""; for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) { const zone = (x < 8 && y < 8) || (x >= 17 && y < 8) || (x < 8 && y >= 17); let on; if (zone) { const inner = (x < 7 && y < 7) || (x >= 18 && y < 7) || (x < 7 && y >= 18); if (inner) { const ox = x >= 18 ? x - 18 : x; const oy = y >= 18 ? y - 18 : y; const ring = Math.max(Math.abs(ox - 3), Math.abs(oy - 3)); on = ring === 3 || ring <= 1; } else on = false; } else on = random() > 0.52; if (on) d += `M${x} ${y}h1v1h-1z`; } return d; };
  const openPanel = (view) => { if (!panelTitles[view]) return; if (activeView && activeView !== "profile" && view === "logout") setPreviousView(activeView); else setPreviousView(null); setActiveView(view); };
  const closePanel = (reopenMenu = true) => { if (activeView === "logout" && previousView === "sessions") { setActiveView("sessions"); setPreviousView(null); return; } setActiveView(null); onClose(reopenMenu); };
  const handleConfirmLogout = async () => { setIsSigningOut(true); try { await signOut(); navigate("/login", { replace: true }); } catch { setIsSigningOut(false); setActivityStatus("Could not sign out. Please try again."); } };
  const handleOverlayClick = (event) => { event.stopPropagation(); if (event.target === event.currentTarget) { closePanel(true); return; } if (event.target.closest?.("#acctBack, #logoutCancel")) { closePanel(true); return; } if (event.target.closest?.("#pfPhotoRemove")) { setPhotoUrl(null); onProfileChange({ ...profile, photoUrl: null }); setProfileStatus("Photo removed. Showing your initial instead."); return; } const viewNode = event.target.closest?.("[data-view]"); if (viewNode) openPanel(viewNode.getAttribute("data-view")); const toggle = event.target.closest?.("[data-toggle]"); if (toggle) { const key = toggle.getAttribute("data-toggle"); setShowPasswords((current) => ({ ...current, [key]: !current[key] })); } const pref = event.target.closest?.("[data-pref]"); if (pref) { const next = !compact; setCompact(next); onCompactChange(next); say("prefStatus", "Updated for this page."); } const alert = event.target.closest?.("[data-alert]"); if (alert) { const key = alert.getAttribute("data-alert"); setAlerts((current) => ({ ...current, [key]: !current[key] })); const alertLabels = { lblAlNew: "New device sign-in", lblAlFail: "Failed sign-in attempts", lblAlPw: "Password changes", lblAlRec: "Recovery option changes", lblAlLoc: "Location changes" }; setAlertStatus(`${alertLabels[key] || "Security"} alerts ${!alerts[key] ? "on" : "off"}.`); } const recEdit = event.target.closest?.("[data-rec-edit]"); const recSave = event.target.closest?.("[data-rec-save]"); const recCancel = event.target.closest?.("[data-rec-cancel]"); const row = event.target.closest?.("[data-rec]"); if (recEdit && row) { const kind = row.getAttribute("data-rec"); setEditingRecovery(kind); setRecoveryDraft(""); } if (recCancel) { setEditingRecovery(null); setRecoveryStatus(""); setRecoveryError(false); } if (recSave && row) saveRecovery(row.getAttribute("data-rec")); };
  const saveRecovery = (kind) => { const value = recoveryDraft.trim(); if (kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setRecoveryError(true); setRecoveryStatus("Please enter a valid email address."); recoveryEmailRef.current?.focus(); return; } if (kind === "phone" && !(/^\+?[\d\s\-()]+$/.test(value) && value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15)) { setRecoveryError(true); setRecoveryStatus("Please enter a valid phone number (7 to 15 digits)."); recoveryPhoneRef.current?.focus(); return; } if (kind === "email") setRecoveryEmail(value); else setRecoveryPhone(value); setEditingRecovery(null); setRecoveryError(false); setRecoveryStatus(`Recovery ${kind} updated for this page only.`); };
  const handleProfileSubmit = (event) => { event.preventDefault(); const name = profileDraft.name.trim(); const email = profileDraft.email.trim(); if (!name) { setProfileError(true); setProfileStatus("Please enter a display name."); return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setProfileError(true); setProfileStatus("Please enter a valid email address."); return; } onProfileChange({ name, email, photoUrl }); setProfileError(false); setProfileStatus("Applied for this page only. Not saved to any account."); };
  const handleProfileReset = () => { setProfileDraft({ name: "User", email: "user@example.com" }); setPhotoUrl(null); onProfileChange({ name: "User", email: "user@example.com", photoUrl: null }); setProfileStatus("Profile details reset."); setProfileError(false); };
  const handlePhotoChange = (event) => { const file = event.target.files?.[0]; if (!file) return; if (!/^image\/(png|jpeg|gif|webp)$/.test(file.type)) { setProfileError(true); setProfileStatus("Please choose a JPG, PNG, GIF or WebP image."); event.target.value = ""; return; } if (file.size > 2 * 1024 * 1024) { setProfileError(true); setProfileStatus("That image is larger than 2 MB. Please choose a smaller one."); event.target.value = ""; return; } const url = URL.createObjectURL(file); setPhotoUrl(url); onProfileChange({ ...profile, photoUrl: url }); setProfileError(false); setProfileStatus("Photo updated for this page only. Not saved to any account."); event.target.value = ""; };
  const handlePasswordSubmit = (event) => { event.preventDefault(); const current = currentPassword; const next = newPassword; const confirm = confirmPassword; if (!current) { setPasswordError(true); setPasswordStatus("Enter your current password."); pwCurrentRef.current?.focus(); return; } if (next.length < 10) { setPasswordError(true); setPasswordStatus("New password must be at least 10 characters."); pwNewRef.current?.focus(); return; } if (next !== confirm) { setPasswordError(true); setPasswordStatus("Passwords do not match."); pwConfirmRef.current?.focus(); return; } setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setShowPasswords({ pwCur: false, pwNew: false, pwCon: false }); setPasswordError(false); setPasswordStatus("Looks valid. Nothing was changed because this prototype has no server."); };
  const handlePasswordClear = () => { setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); setPasswordStatus(""); setPasswordError(false); setShowPasswords({ pwCur: false, pwNew: false, pwCon: false }); };
  const handleTwoFaToggle = () => { const next = !twoFaEnabled; setTwoFaEnabled(next); setTwoFaError(false); if (next) { if (!twoFaKey) { setQrPath(generateQrPath()); setTwoFaKey(randomKey()); } setTwoFaStatus("Choose a method, then enter a 6-digit code to confirm setup."); requestAnimationFrame(() => twoFaCodeRef.current?.focus()); } else setTwoFaStatus("Two-factor authentication is turned off."); };
  const handleTwoFaVerify = () => { if (!/^\d{6}$/.test(twoFaCode.trim())) { setTwoFaError(true); setTwoFaStatus("Enter the 6-digit code."); twoFaCodeRef.current?.focus(); return; } setTwoFaCode(""); setTwoFaError(false); setTwoFaStatus("Code accepted. Two-factor authentication is on (demo check only, no server)."); };
  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); return true; } catch { /* try the legacy fallback below */ }
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch { copied = false; }
    document.body.removeChild(textarea);
    return copied;
  };
  const handleCopyTwoFaKey = async () => {
    const copied = await copyText(twoFaKey.replace(/\s/g, ""));
    setTwoFaStatus(copied ? "Setup key copied." : "Could not copy. Select the key and copy it manually.");
    setTwoFaError(!copied);
  };
  const handleHelpUpload = () => { setActiveView(null); onClose(false); uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const handleCopyCodes = async () => {
    const copied = await copyText(backupCodes.join("\n"));
    setBackupStatus(copied ? "All backup codes copied to the clipboard." : "Could not copy. Use Download instead.");
  };
  const handleDownloadCodes = () => {
    const contents = `IDP backup codes\nGenerated: ${new Date().toLocaleString()}\nEach code can be used once.\n\n${backupCodes.join("\n")}\n`;
    const url = URL.createObjectURL(new Blob([contents], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "idp-backup-codes.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupStatus("Backup codes downloaded as idp-backup-codes.txt.");
  };
  const secureIndex = (max) => { const value = new Uint32Array(1); crypto.getRandomValues(value); return value[0] % max; };
  const handleBackupGenerate = () => { const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; const hadCodes = backupCodes.length > 0; const codes = Array.from({ length: 10 }, () => Array.from({ length: 8 }, (_, index) => alphabet[secureIndex(alphabet.length)] + (index === 3 ? "-" : "")).join("")); setBackupCodes(codes); setShowBackupCodes(false); setBackupStatus(hadCodes ? "New codes generated. Your previous codes no longer work. Choose View codes to see them." : "10 backup codes generated. Choose View codes to see them."); };
  const handleBackupToggle = () => { const next = !showBackupCodes; setShowBackupCodes(next); setBackupStatus(next ? "Codes are visible." : "Codes are hidden."); };
  const handlePrefReset = () => { setCompact(false); onCompactChange(false); say("prefStatus", "Defaults restored."); };
  const handleSessionSignOut = (id) => { const session = otherSessions.find((item) => item.id === id); if (!session) return; setOtherSessions((current) => current.filter((item) => item.id !== id)); setActivityStatus(`Signed out ${session.name}.`); };
  const handleSignOutOthers = () => { setOtherSessions([]); setActivityStatus("Signed out of all other sessions."); };
  useEffect(() => { if (otherSessions.length === 0 && activeView === "security") sessionsEmptyRef.current?.focus(); }, [otherSessions.length, activeView]);
  const handleOverlayKeyDown = (event) => { if (event.key === "Escape") { event.stopPropagation(); closePanel(true); return; } if (event.key === "Tab") { const focusable = Array.from(dialogRef.current?.querySelectorAll('button, input, select, textarea, summary, [tabindex="-1"]') || []).filter((node) => node.getClientRects().length > 0 && !node.disabled); if (!focusable.length) return; const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } };
  return (
    <div id="accountOverlay" className="fixed inset-0 z-110 grid place-items-center bg-[#02061e]/70 p-4 backdrop-blur-md transition-opacity duration-200 starting:opacity-0 max-sm:place-items-stretch max-sm:p-0" hidden={!open || !activeView} onClick={handleOverlayClick} onKeyDown={handleOverlayKeyDown}>
<div ref={dialogRef} className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-155 flex-col overflow-hidden rounded-2xl border border-blue-400/35 bg-[image:radial-gradient(120%_80%_at_0%_0%,rgba(79,124,255,.18),transparent_60%),linear-gradient(180deg,#0c1a68,#060e44)] shadow-[0_24px_60px_rgba(0,0,30,.6)] transition duration-200 starting:translate-y-2 starting:scale-98 starting:opacity-0 max-sm:h-dvh max-sm:max-h-dvh max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0" role="dialog" aria-modal="true" aria-labelledby="acctTitle">
<div className="flex items-center gap-3 border-b border-blue-400/30 px-4.5 py-3.5 max-sm:px-3.5 max-sm:py-3">
<button type="button" id="acctBack" className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-blue-400/50 bg-blue-500/15 pr-3.5 pl-2.5 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/30 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" aria-label="Back to account menu">← Back</button>
<h2 id="acctTitle" ref={titleRef} tabIndex="-1" className="min-w-0 text-lg font-bold wrap-anywhere focus:outline-none">{panelTitles[activeView] || "My Profile"}</h2>
</div>
<div className="min-w-0 overflow-x-hidden overflow-y-auto p-4.5 max-sm:p-3.5">
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="profile" hidden={activeView !== "profile"} data-title="My Profile">
<p className="mb-3.5 text-sm leading-normal text-blue-200">Edit your display details. Changes apply to this page only while it stays open.</p>
<div className="mb-4 flex items-center gap-4 max-sm:flex-col max-sm:items-start">
<span id="pfAvatar" className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-cyan-400/80 bg-[linear-gradient(135deg,#3b82f6_0%,#6366f1_55%,#a78bfa_100%)] font-['Orbitron','Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-white shadow-[0_0_18px_rgba(56,189,248,.5)]" role="img" aria-label={photoUrl ? "Profile photo" : `Profile photo placeholder, initials ${profile.name.charAt(0).toUpperCase()}`}>
<span id="pfInitials" hidden={Boolean(photoUrl)} className="col-start-1 row-start-1" aria-hidden="true">{profile.name.charAt(0).toUpperCase()}</span>
<img id="pfPhotoImg" hidden={!photoUrl} src={photoUrl || undefined} className="col-start-1 row-start-1 size-full object-cover" alt="" />
</span>
<div className="min-w-0">
<p className="mb-0.5 text-sm font-semibold text-blue-100">Profile photo</p>
<p id="pfPhotoHint" className="mb-2.5 text-xs leading-snug text-blue-200/80">JPG, PNG, GIF or WebP, up to 2 MB.</p>
<div className="flex flex-wrap gap-2">
<button type="button" id="pfPhotoBtn" onClick={() => photoInputRef.current?.click()} className="inline-flex items-center gap-2 min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" aria-describedby="pfPhotoHint"><svg className="size-4" aria-hidden="true"><use href="#i-upload"></use></svg><span id="pfPhotoBtnLabel">{photoUrl ? "Change photo" : "Upload photo"}</span></button>
<button type="button" id="pfPhotoRemove" className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" aria-label="Remove profile photo" hidden={!photoUrl}>Remove</button>
</div>
<input type="file" id="pfPhotoInput" ref={photoInputRef} onChange={handlePhotoChange} className="sr-only" accept="image/png,image/jpeg,image/gif,image/webp" aria-label="Choose a profile photo" />
<p id="pfPhotoStatus" className={`mt-2 min-h-4 text-xs leading-snug ${profileError ? "text-red-300" : "text-green-300"}`} role="status" aria-live="polite">{profileStatus}</p>
</div>
</div>
<form id="profileForm" onSubmit={handleProfileSubmit} noValidate={true}>
<div className="mb-3.5 flex min-w-0 flex-col gap-1.5"><label className="text-xs font-semibold text-blue-100" htmlFor="pfName">Display name</label><input className="w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="pfName" value={profileDraft.name} onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))} type="text" maxLength="40" autoComplete="name" /></div>
<div className="mb-3.5 flex min-w-0 flex-col gap-1.5"><label className="text-xs font-semibold text-blue-100" htmlFor="pfEmail">Email address</label><input className="w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="pfEmail" value={profileDraft.email} onChange={(event) => setProfileDraft((current) => ({ ...current, email: event.target.value }))} type="email" maxLength="80" autoComplete="email" /></div>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full">
<button type="submit" className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Apply changes</button>
<button type="button" id="pfReset" onClick={handleProfileReset} className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Reset</button>
</div>
<p id="pfStatus" className={`mt-3 min-h-4.5 text-xs leading-snug ${profileError ? "text-red-300" : "text-green-300"}`} role="status" aria-live="polite">{profileStatus}</p>
</form>
<p className="mt-3 text-xs leading-snug text-blue-200/80">Account type: Standard User. This prototype does not connect to a server, so profile changes are not saved and are lost on reload.</p>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="security" hidden={activeView !== "security"} data-title="Security">
<details className="group mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 open:border-blue-400/50" data-sec="password" open={true}>
<summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3.5 py-3 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
<span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[rgba(30,64,175,.55)] text-[#e6efff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-shield"></use></svg></span>
<span className="min-w-0 flex-1"><b className="block text-sm font-bold">Change Password</b><small className="block text-xs leading-snug text-blue-200">Update the password you use to sign in</small></span>
<svg className="size-4 shrink-0 text-blue-200 transition-transform group-open:rotate-180" aria-hidden="true"><use href="#i-chevron"></use></svg>
</summary>
<div className="border-t border-blue-400/20 px-3.5 py-3.5">
<p className="mb-3.5 text-sm leading-normal text-blue-200">Check the form below for a new password. It is validated here only; this prototype has no server, so no password is actually changed.</p>
<form id="pwForm" onSubmit={handlePasswordSubmit} noValidate={true}>
<div className="mb-3.5 flex min-w-0 flex-col gap-1.5"><label className="text-xs font-semibold text-blue-100" htmlFor="pwCur">Current password</label><div className="relative"><input ref={pwCurrentRef} className="w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 pr-16" id="pwCur" type={showPasswords.pwCur ? "text" : "password"} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" /><button type="button" className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-toggle="pwCur" aria-label={`${showPasswords.pwCur ? "Hide" : "Show"} current password`}>{showPasswords.pwCur ? "Hide" : "Show"}</button></div></div>
<div className="mb-3.5 flex min-w-0 flex-col gap-1.5"><label className="text-xs font-semibold text-blue-100" htmlFor="pwNew">New password (min. 10 characters)</label><div className="relative"><input ref={pwNewRef} className="w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 pr-16" id="pwNew" type={showPasswords.pwNew ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /><button type="button" className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-toggle="pwNew" aria-label={`${showPasswords.pwNew ? "Hide" : "Show"} new password`}>{showPasswords.pwNew ? "Hide" : "Show"}</button></div></div>
<div className="-mt-1.5 mb-3.5" id="pwMeter">
<div className="flex gap-1" aria-hidden="true">{[0, 1, 2, 3].map((segment) => <span key={segment} className="h-1.5 flex-1 rounded-full transition-colors" style={{ backgroundColor: segment < passwordStrength.score ? ["", "#f87171", "#fb923c", "#facc15", "#34d399"][passwordStrength.score] : "" }} />)}</div>
<p id="pwStrength" className="mt-1.5 text-xs text-blue-200" role="status" aria-live="polite">{passwordStrength.label}</p>
</div>
<div className="mb-3.5 flex min-w-0 flex-col gap-1.5"><label className="text-xs font-semibold text-blue-100" htmlFor="pwCon">Confirm new password</label><div className="relative"><input ref={pwConfirmRef} className="w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 pr-16" id="pwCon" type={showPasswords.pwCon ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /><button type="button" className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-blue-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-toggle="pwCon" aria-label={`${showPasswords.pwCon ? "Hide" : "Show"} confirmation password`}>{showPasswords.pwCon ? "Hide" : "Show"}</button></div></div>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full"><button type="submit" className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Check password</button><button type="button" id="pwClear" onClick={handlePasswordClear} className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Clear</button></div>
<p id="pwStatus" className={`mt-3 min-h-4.5 text-xs leading-snug ${passwordError ? "text-red-300" : "text-green-300"}`} role="status" aria-live="polite">{passwordStatus}</p>
</form>
</div>
</details>
<details className="group mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 open:border-blue-400/50" data-sec="2fa">
<summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3.5 py-3 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
<span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[rgba(30,64,175,.55)] text-[#e6efff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-check"></use></svg></span>
<span className="min-w-0 flex-1"><b className="block text-sm font-bold">Two-Factor Authentication</b><small className="block text-xs leading-snug text-blue-200">Add a second step to your sign-in</small></span>
<svg className="size-4 shrink-0 text-blue-200 transition-transform group-open:rotate-180" aria-hidden="true"><use href="#i-chevron"></use></svg>
</summary>
<div className="border-t border-blue-400/20 px-3.5 py-3.5">
<div className="flex items-center justify-between gap-3.5 pb-3.5"><div className="flex min-w-0 flex-col"><b id="lblTwoFa" className="text-sm font-bold">Enable two-factor authentication</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Ask for a second verification step when you sign in.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="twoFaSwitch" onClick={handleTwoFaToggle} role="switch" aria-checked={twoFaEnabled} aria-labelledby="lblTwoFa" aria-controls="twoFaBody"></button></div>
<div id="twoFaBody" hidden={!twoFaEnabled}>
<fieldset className="mb-3.5 min-w-0 border-0 p-0"><legend className="mb-2 text-xs font-semibold text-blue-100">Verification method</legend>
<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
<label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-[13px] has-checked:border-blue-300 has-checked:bg-blue-600/30 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-400"><input type="radio" name="twoFaMethod" value="app" className="accent-blue-500" checked={twoFaMethod === "app"} onChange={() => setTwoFaMethod("app")} />Authenticator app</label>
<label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-[13px] has-checked:border-blue-300 has-checked:bg-blue-600/30 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-400"><input type="radio" name="twoFaMethod" value="sms" className="accent-blue-500" checked={twoFaMethod === "sms"} onChange={() => setTwoFaMethod("sms")} />SMS code</label>
<label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-[13px] has-checked:border-blue-300 has-checked:bg-blue-600/30 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-400"><input type="radio" name="twoFaMethod" value="email" className="accent-blue-500" checked={twoFaMethod === "email"} onChange={() => setTwoFaMethod("email")} />Email code</label>
</div>
</fieldset>
<div data-pane="app" hidden={twoFaMethod !== "app"} className="flex flex-col items-center gap-3.5 sm:flex-row sm:items-start">
<svg id="qrSvg" className="size-32 shrink-0 rounded-lg bg-white p-2" viewBox="0 0 25 25" shapeRendering="crispEdges" role="img" aria-label="QR code placeholder"><path id="qrPath" fill="#0a1560" d={qrPath}></path></svg>
<div className="min-w-0 max-sm:w-full">
<p className="mb-2 text-sm leading-normal text-blue-200">Scan this placeholder with an authenticator app, or enter the sample setup key. A real deployment would show a unique QR code here.</p>
<div className="flex flex-wrap items-center gap-2"><code id="twoFaKey" className="min-w-0 rounded-md border border-blue-400/30 bg-blue-950/70 px-2.5 py-1.5 font-mono text-xs tracking-wider wrap-anywhere" aria-label="Sample setup key">{twoFaKey}</code><button type="button" id="twoFaCopyKey" onClick={handleCopyTwoFaKey} className="min-h-9 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-3 text-xs font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Copy key</button></div>
</div>
</div>
<p data-pane="sms" hidden={twoFaMethod !== "sms"} className="text-sm leading-normal text-blue-200">A 6-digit code will be sent by text message to your recovery phone number.</p>
<p data-pane="email" hidden={twoFaMethod !== "email"} className="text-sm leading-normal text-blue-200">A 6-digit code will be sent to your recovery email address.</p>
<div className="mt-3.5 flex flex-wrap items-end gap-2.5 max-sm:*:basis-full">
<div className="min-w-0 flex-1 basis-40"><label className="text-xs font-semibold text-blue-100" htmlFor="twoFaCode">6-digit verification code</label><input className="mt-1.5 w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="twoFaCode" ref={twoFaCodeRef} value={twoFaCode} onChange={(event) => setTwoFaCode(event.target.value)} type="text" inputMode="numeric" pattern="[0-9]*" maxLength="6" autoComplete="one-time-code" placeholder="123456" /></div>
<button type="button" id="twoFaVerify" onClick={handleTwoFaVerify} className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Confirm setup</button>
</div>
</div>
<p id="twoFaStatus" className={`mt-3 min-h-4.5 text-xs leading-snug ${twoFaError ? "text-red-300" : "text-green-300"}`} role="status" aria-live="polite">{twoFaStatus}</p>
</div>
</details>
<details className="group mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 open:border-blue-400/50" data-sec="activity">
<summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3.5 py-3 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
<span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[rgba(30,64,175,.55)] text-[#e6efff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-monitor"></use></svg></span>
<span className="min-w-0 flex-1"><b className="block text-sm font-bold">Login Activity</b><small className="block text-xs leading-snug text-blue-200">Review recent sessions and sign out</small></span>
<svg className="size-4 shrink-0 text-blue-200 transition-transform group-open:rotate-180" aria-hidden="true"><use href="#i-chevron"></use></svg>
</summary>
<div className="border-t border-blue-400/20 px-3.5 py-3.5">
<ul id="sessList" className="m-0 list-none p-0" aria-label="Recent sign-in sessions">
<li className="flex flex-wrap items-center gap-3 border-b border-blue-400/20 py-3 first:pt-0 last:border-b-0" data-session="cur"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgba(30,64,175,.45)] text-[#cfe0ff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-monitor"></use></svg></span><span className="min-w-0 flex-1"><b className="block text-sm font-bold wrap-anywhere" data-dev="">This device</b><small className="block text-xs leading-snug text-blue-200">Mumbai, India · Active now</small></span><span className="rounded-full border border-green-500/50 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-300">Current session</span></li>
{otherSessions.map((session) => <li key={session.id} className="flex flex-wrap items-center gap-3 border-b border-blue-400/20 py-3 first:pt-0 last:border-b-0" data-session={session.id}><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[rgba(30,64,175,.45)] text-[#cfe0ff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-monitor"></use></svg></span><span className="min-w-0 flex-1"><b className="block text-sm font-bold wrap-anywhere" data-dev="">{session.name}</b><small className="block text-xs leading-snug text-blue-200">{session.location}</small></span><button type="button" onClick={() => handleSessionSignOut(session.id)} className="min-h-9 cursor-pointer rounded-lg border border-red-400/55 bg-linear-to-b from-red-700/85 to-red-900/85 px-3 text-xs font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-signout="" aria-label={`Sign out ${session.name}, ${session.location}`}>Sign out</button></li>)}
</ul>
<p id="sessEmpty" ref={sessionsEmptyRef} className="py-2 text-sm text-blue-200" tabIndex="-1" hidden={otherSessions.length > 0}>No other active sessions.</p>
<div className="mt-3 flex flex-wrap gap-2.5 max-sm:*:basis-full"><button type="button" id="signOutOthers" onClick={handleSignOutOthers} disabled={!otherSessions.length} className="min-h-10 cursor-pointer rounded-lg border border-red-400/55 bg-linear-to-b from-red-700/85 to-red-900/85 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Sign out all other sessions</button></div>
<p id="actStatus" className="mt-3 min-h-4.5 text-xs leading-snug text-green-300" role="status" aria-live="polite">{activityStatus}</p>
<p className="text-xs leading-snug text-blue-200/80">Sample data for this prototype. Real sessions would come from your server.</p>
</div>
</details>
<details className="group mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 open:border-blue-400/50" data-sec="recovery">
<summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3.5 py-3 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
<span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[rgba(30,64,175,.55)] text-[#e6efff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-user"></use></svg></span>
<span className="min-w-0 flex-1"><b className="block text-sm font-bold">Recovery Options</b><small className="block text-xs leading-snug text-blue-200">Recovery email and phone number</small></span>
<svg className="size-4 shrink-0 text-blue-200 transition-transform group-open:rotate-180" aria-hidden="true"><use href="#i-chevron"></use></svg>
</summary>
<div className="border-t border-blue-400/20 px-3.5 py-3.5">
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0 flex-wrap" data-rec="email">
<div className="flex w-full items-center justify-between gap-3" data-rec-view="" hidden={editingRecovery === "email"}><div className="min-w-0"><b className="block text-sm font-bold">Recovery email</b><span className="block truncate text-sm text-blue-200" data-rec-value="">{maskedRecoveryEmail}</span></div><button type="button" className="min-h-9 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-3 text-xs font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-rec-edit="" aria-label="Edit recovery email">Edit</button></div>
<div className="w-full" data-rec-form="" hidden={editingRecovery !== "email"}><label className="text-xs font-semibold text-blue-100" htmlFor="recEmailInput">New recovery email</label><input ref={recoveryEmailRef} className="mt-1.5 w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="recEmailInput" type="email" value={recoveryDraft} onChange={(event) => setRecoveryDraft(event.target.value)} autoComplete="email" maxLength="80" placeholder="name@example.com" /><div className="mt-2.5 flex flex-wrap gap-2 max-sm:*:basis-full"><button type="button" className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-rec-save="">Save</button><button type="button" className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-rec-cancel="">Cancel</button></div></div>
</div>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0 flex-wrap" data-rec="phone">
<div className="flex w-full items-center justify-between gap-3" data-rec-view="" hidden={editingRecovery === "phone"}><div className="min-w-0"><b className="block text-sm font-bold">Recovery phone</b><span className="block truncate text-sm text-blue-200" data-rec-value="">{maskedRecoveryPhone}</span></div><button type="button" className="min-h-9 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-3 text-xs font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-rec-edit="" aria-label="Edit recovery phone">Edit</button></div>
<div className="w-full" data-rec-form="" hidden={editingRecovery !== "phone"}><label className="text-xs font-semibold text-blue-100" htmlFor="recPhoneInput">New recovery phone</label><input ref={recoveryPhoneRef} className="mt-1.5 w-full min-w-0 rounded-lg border border-blue-400/40 bg-blue-950/60 px-3 py-2.5 text-sm text-white placeholder:text-blue-300/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="recPhoneInput" type="tel" value={recoveryDraft} onChange={(event) => setRecoveryDraft(event.target.value)} inputMode="tel" autoComplete="tel" maxLength="20" placeholder="+91 98765 43210" /><div className="mt-2.5 flex flex-wrap gap-2 max-sm:*:basis-full"><button type="button" className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-rec-save="">Save</button><button type="button" className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-rec-cancel="">Cancel</button></div></div>
</div>
<p id="recStatus" className={`mt-3 min-h-4.5 text-xs leading-snug ${recoveryError ? "text-red-300" : "text-green-300"}`} role="status" aria-live="polite">{recoveryStatus}</p>
<p className="text-xs leading-snug text-blue-200/80">Recovery details are used only if you lose access. Changes apply to this page only.</p>
</div>
</details>
<details className="group mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 open:border-blue-400/50" data-sec="alerts">
<summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3.5 py-3 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
<span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[rgba(30,64,175,.55)] text-[#e6efff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-bell"></use></svg></span>
<span className="min-w-0 flex-1"><b className="block text-sm font-bold">Security Alerts</b><small className="block text-xs leading-snug text-blue-200">Choose which events notify you</small></span>
<svg className="size-4 shrink-0 text-blue-200 transition-transform group-open:rotate-180" aria-hidden="true"><use href="#i-chevron"></use></svg>
</summary>
<div className="border-t border-blue-400/20 px-3.5 py-3.5">
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0"><div className="flex min-w-0 flex-col"><b id="lblAlNew" className="text-sm font-bold">New device sign-in</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Alert me when a new browser or device signs in.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" role="switch" aria-checked={alerts.lblAlNew} aria-labelledby="lblAlNew" data-alert="lblAlNew"></button></div>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0"><div className="flex min-w-0 flex-col"><b id="lblAlFail" className="text-sm font-bold">Failed sign-in attempts</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Alert me after repeated wrong passwords.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" role="switch" aria-checked={alerts.lblAlFail} aria-labelledby="lblAlFail" data-alert="lblAlFail"></button></div>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0"><div className="flex min-w-0 flex-col"><b id="lblAlPw" className="text-sm font-bold">Password changes</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Alert me when my password is changed.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" role="switch" aria-checked={alerts.lblAlPw} aria-labelledby="lblAlPw" data-alert="lblAlPw"></button></div>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0"><div className="flex min-w-0 flex-col"><b id="lblAlRec" className="text-sm font-bold">Recovery option changes</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Alert me when recovery email or phone is edited.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" role="switch" aria-checked={alerts.lblAlRec} aria-labelledby="lblAlRec" data-alert="lblAlRec"></button></div>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3 last:border-b-0"><div className="flex min-w-0 flex-col"><b id="lblAlLoc" className="text-sm font-bold">Sign-in from a new location</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Alert me about sign-ins from unfamiliar places.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" role="switch" aria-checked={alerts.lblAlLoc} aria-labelledby="lblAlLoc" data-alert="lblAlLoc"></button></div>
<p id="alertStatus" className="mt-3 min-h-4.5 text-xs leading-snug text-green-300" role="status" aria-live="polite">{alertStatus}</p>
</div>
</details>
<details className="group mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 open:border-blue-400/50" data-sec="backup">
<summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3.5 py-3 [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
<span className="grid size-9 shrink-0 place-items-center rounded-full border border-blue-400/40 bg-[rgba(30,64,175,.55)] text-[#e6efff]"><svg className="size-[18px]" aria-hidden="true"><use href="#i-doc"></use></svg></span>
<span className="min-w-0 flex-1"><b className="block text-sm font-bold">Backup Codes</b><small className="block text-xs leading-snug text-blue-200">One-time codes for emergency access</small></span>
<svg className="size-4 shrink-0 text-blue-200 transition-transform group-open:rotate-180" aria-hidden="true"><use href="#i-chevron"></use></svg>
</summary>
<div className="border-t border-blue-400/20 px-3.5 py-3.5">
<p className="mb-3 text-sm leading-normal text-blue-200">Use a backup code if you cannot reach your verification method. Each code works once. Generating new codes replaces any existing ones.</p>
<div className="flex flex-wrap gap-2.5 max-sm:*:basis-full">
<button type="button" id="bcGenerate" onClick={handleBackupGenerate} className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Generate codes</button>
<button type="button" id="bcToggle" onClick={handleBackupToggle} className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" aria-controls="bcList" aria-expanded={showBackupCodes} disabled={!backupCodes.length}>{showBackupCodes ? "Hide codes" : "View codes"}</button>
<button type="button" id="bcCopy" onClick={handleCopyCodes} className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" disabled={!backupCodes.length}>Copy</button>
<button type="button" id="bcDownload" onClick={handleDownloadCodes} className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" disabled={!backupCodes.length}>Download .txt</button>
</div>
<ul id="bcList" className="mt-3 grid list-none grid-cols-2 gap-2 p-0 font-mono text-sm sm:grid-cols-5" aria-label="Backup codes" hidden={!backupCodes.length}>{backupCodes.map((code, index) => <li key={index} className="rounded-lg border border-blue-400/30 bg-blue-950/60 px-3 py-2 text-center tracking-wider">{showBackupCodes ? code : "••••-••••"}</li>)}</ul>
<p id="bcStatus" className="mt-3 min-h-4.5 text-xs leading-snug text-green-300" role="status" aria-live="polite">{backupStatus}</p>
<p className="text-xs leading-snug text-blue-200/80">Store these somewhere safe. Codes are generated in your browser and are not sent anywhere.</p>
</div>
</details>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="preferences" hidden={activeView !== "preferences"} data-title="Preferences">
<p className="mb-3.5 text-sm leading-normal text-blue-200">Display options for this page. They apply immediately and reset when you reload.</p>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3.5"><div className="flex min-w-0 flex-col"><b id="lblCompact" className="text-sm font-bold">Compact layout</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Tighter spacing on the dashboard.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" role="switch" aria-checked={compact} aria-labelledby="lblCompact" data-pref="compact"></button></div>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full mt-3"><button type="button" id="prefReset" onClick={handlePrefReset} className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Restore defaults</button></div>
<p id="prefStatus" className="mt-3 min-h-4.5 text-xs leading-snug text-green-300" role="status" aria-live="polite">{status.prefStatus?.message || ""}</p>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="notifications" hidden={activeView !== "notifications"} data-title="Notification Settings">
<p className="mb-3.5 text-sm leading-normal text-blue-200">Control the notification bell in the top bar.</p>
<div className="flex items-center justify-between gap-3.5 border-b border-blue-400/20 py-3.5"><div className="flex min-w-0 flex-col"><b id="lblBadge" className="text-sm font-bold">Show unread badge</b><small className="mt-0.5 text-xs leading-snug text-blue-200">Display the red dot on the bell when there are unread items.</small></div><button type="button" className="relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-blue-400/50 bg-blue-950/70 p-0 transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-4.5 after:rounded-full after:bg-blue-200 after:transition after:content-[''] aria-checked:bg-blue-600 aria-checked:after:translate-x-5 aria-checked:after:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" id="badgeSwitch" onClick={() => onNotificationBadgeChange((value) => !value)} role="switch" aria-checked={notificationBadgeVisible} aria-labelledby="lblBadge"></button></div>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full mt-3"><button type="button" id="notifRead" onClick={() => { onMarkNotificationsRead(); setNotificationStatus("All notifications marked as read."); }} className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Mark all as read</button></div>
<p id="notifStatus" className="mt-3 min-h-4.5 text-xs leading-snug text-green-300" role="status" aria-live="polite">{notificationStatus}</p>
<p className="mt-3 text-xs leading-snug text-blue-200/80">Email and push notifications are not available in this prototype.</p>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="sessions" hidden={activeView !== "sessions"} data-title="Active Sessions">
<p className="mb-3.5 text-sm leading-normal text-blue-200">Sessions signed in to this prototype.</p>
<div className="mb-3 rounded-xl border border-blue-400/30 bg-blue-900/45 px-3.5 py-3"><h3 className="mb-1 flex flex-wrap items-center gap-2 text-sm font-bold">This browser <span className="rounded-full border border-green-500/50 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-300">Current session</span></h3><p id="sessInfo" className="text-sm leading-normal wrap-anywhere text-blue-200">{typeof navigator !== "undefined" ? `${/Edg\//.test(navigator.userAgent) ? "Edge" : /Chrome\//.test(navigator.userAgent) ? "Chrome" : /Firefox\//.test(navigator.userAgent) ? "Firefox" : /Safari\//.test(navigator.userAgent) ? "Safari" : "Browser"} on ${navigator.platform || "this device"} · opened ${new Date().toLocaleTimeString()}` : "Current browser"}</p></div>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full"><button type="button" className="min-h-10 cursor-pointer rounded-lg border border-red-400/55 bg-linear-to-b from-red-700/85 to-red-900/85 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400" data-view="logout">Sign out of this session</button></div>
<p className="mt-3 text-xs leading-snug text-blue-200/80">No other sessions exist because there is no server connection.</p>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="help" hidden={activeView !== "help"} data-title="Help &amp; Support">
<div>
<details className="border-b border-blue-400/20"><summary className="cursor-pointer py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Which files can I upload?</summary><p className="pb-3 text-sm leading-relaxed text-blue-200">PDF, JPG, PNG and DOCX files, up to 10MB each.</p></details>
<details className="border-b border-blue-400/20"><summary className="cursor-pointer py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">How do I upload a document?</summary><p className="pb-3 text-sm leading-relaxed text-blue-200">Drag a file onto the upload area on Home, or choose Choose File to browse your device.</p></details>
<details className="border-b border-blue-400/20"><summary className="cursor-pointer py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Where can I see my past uploads?</summary><p className="pb-3 text-sm leading-relaxed text-blue-200">Recent Uploads and the activity list on Home show your documents; History in the sidebar jumps to the activity section.</p></details>
</div>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full mt-3.5"><button type="button" id="helpUpload" onClick={handleHelpUpload} className="min-h-10 cursor-pointer rounded-lg border border-transparent bg-linear-to-b from-blue-500 to-blue-600 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Go to upload area</button></div>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="about" hidden={activeView !== "about"} data-title="About">
<span className="mb-3 inline-block rounded-full border border-blue-400/50 px-3 py-1 text-xs font-semibold text-blue-300">Version 1.0.0</span>
<p className="text-sm leading-relaxed text-blue-100">Intelligent Document Processing (IDP) system designed to help users manage documents through document uploads, text extraction, classification, and activity tracking. By bringing these capabilities together in one interface, IDP System aims to make document handling more organized and simplify the process of extracting and categorizing information from files. Version 1.0.0 provides the current application experience. As a standalone prototype, it does not connect profile controls to a server or persist account changes.</p>
</section>
<section className="transition-opacity duration-200 starting:opacity-0" data-panel="logout" hidden={activeView !== "logout"} data-title="Log out">
<p className="mb-3.5 text-sm leading-normal text-blue-200">Sign out of your IDP account on this device?</p>
<div className="mt-1 flex flex-wrap gap-2.5 max-sm:*:basis-full"><button type="button" id="logoutConfirm" onClick={handleConfirmLogout} disabled={isSigningOut} className="min-h-10 cursor-pointer rounded-lg border border-red-400/55 bg-linear-to-b from-red-700/85 to-red-900/85 px-4 text-sm font-semibold text-white transition hover:brightness-110 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-wait disabled:opacity-60">{isSigningOut ? "Signing out…" : "Log out"}</button><button type="button" id="logoutCancel" className="min-h-10 cursor-pointer rounded-lg border border-blue-400/50 bg-blue-500/10 px-4 text-sm font-semibold text-blue-100 transition hover:brightness-125 active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">Cancel</button></div>
</section>
</div>
</div>
</div>
  );
}
