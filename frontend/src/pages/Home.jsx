import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import IconSprite from "../components/Common/IconSprite";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import Dashboard from "../components/dashboard/Dashboard";
import AccountOverlay from "../components/account/AccountOverlay";
import useIdpAnimations from "../hooks/useIdpAnimations";

const BODY_CLASS = "min-h-screen font-['Plus_Jakarta_Sans',Inter,'Segoe_UI',Roboto,Arial,sans-serif] text-white antialiased bg-[radial-gradient(1100px_500px_at_75%_-10%,rgba(40,80,255,.28),transparent_60%),linear-gradient(180deg,#060e3d_0%,#050b30_100%)] [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] min-[701px]:h-full min-[701px]:overflow-hidden max-[700px]:h-auto max-[700px]:overflow-auto [@media(min-width:701px)_and_(max-height:560px)]:h-auto [@media(min-width:701px)_and_(max-height:560px)]:overflow-auto";
const APP_CLASS = "group/app dashboard-app grid min-h-screen grid-cols-[220px_minmax(0,1fr)] transition-[grid-template-columns] duration-[250ms] ease-in-out min-[701px]:max-[1100px]:grid-cols-[175px_minmax(0,1fr)] max-[700px]:grid-cols-[minmax(0,1fr)] min-[701px]:h-screen min-[701px]:min-h-0 min-[701px]:overflow-hidden [&.sidebar-collapsed]:min-[701px]:grid-cols-[68px_minmax(0,1fr)] [@media(min-width:701px)_and_(max-height:560px)]:h-auto [@media(min-width:701px)_and_(max-height:560px)]:overflow-visible [&.sidebar-open]:max-[700px]:after:fixed [&.sidebar-open]:max-[700px]:after:inset-0 [&.sidebar-open]:max-[700px]:after:z-[65] [&.sidebar-open]:max-[700px]:after:bg-[rgba(2,6,30,.6)] [&.sidebar-open]:max-[700px]:after:content-[''] motion-reduce:transition-none";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleBack = () => {
    const historyIndex = window.history.state?.idx;
    if (Number.isInteger(historyIndex) && historyIndex > 0) {
      navigate(-1);
    } else {
      navigate("/home", { replace: true });
    }
  };

  const rootRef = useRef(null);
  const uploadRef = useRef(null);
  const userButtonRef = useRef(null);
  const firstUserMenuItemRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationBadgeVisible, setNotificationBadgeVisible] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountInitialView, setAccountInitialView] = useState("profile");
  const [compact, setCompact] = useState(false);
  const [profile, setProfile] = useState(() => ({
    name: user?.full_name || user?.name || "User",
    email: user?.email || "",
    photoUrl: user?.photo_url || null,
  }));
  useEffect(() => {
    setProfile((current) => ({
      ...current,
      name: user?.full_name || user?.name || current.name,
      email: user?.email || current.email,
      photoUrl: user?.photo_url || current.photoUrl,
    }));
  }, [user]);
  useIdpAnimations(rootRef);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = (event) => { setIsMobile(event.matches); setSidebarOpen(false); };
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  useEffect(() => {
    const closeOutside = (event) => {
      if (!event.target.closest?.(".notification-wrap")) setNotificationsOpen(false);
      if (!event.target.closest?.("#userButton, #userMenu")) setUserMenuOpen(false);
      if (isMobile && !event.target.closest?.("#sidebar, #menuButton")) setSidebarOpen(false);
    };
    document.addEventListener("click", closeOutside);
    return () => document.removeEventListener("click", closeOutside);
  }, [isMobile]);
  useEffect(() => {
    if (accountOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [accountOpen]);
  const toggleSidebar = (event) => { event.stopPropagation(); if (isMobile) setSidebarOpen((value) => !value); else setSidebarCollapsed((value) => !value); };
  const handleSidebarNavigate = (event) => { if (isMobile && event.target.closest?.("a")) setSidebarOpen(false); };
  const toggleNotifications = (event) => { event.stopPropagation(); setUserMenuOpen(false); setNotificationsOpen((value) => !value); };
  const toggleUserMenu = (event) => { event.stopPropagation(); setNotificationsOpen(false); setUserMenuOpen((value) => !value); };
  const handleUserMenuClick = (event) => { const item = event.target.closest?.("[data-view]"); if (!item) return; setAccountInitialView(item.getAttribute("data-view") || "profile"); setUserMenuOpen(false); setAccountOpen(true); };
  const handleAccountClose = useCallback((reopenMenu = false) => { setAccountOpen(false); setUserMenuOpen(Boolean(reopenMenu)); requestAnimationFrame(() => (reopenMenu ? firstUserMenuItemRef.current : userButtonRef.current)?.focus()); }, []);
  return (
    <div ref={rootRef} className={`${BODY_CLASS} ${compact ? "[&_.dashboard-content]:gap-2! [&_.dashboard-content]:p-2!" : ""}`}>
      <IconSprite />
      <div className={`${APP_CLASS} ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Sidebar onNavigate={handleSidebarNavigate} />
        <div className="min-w-0 min-[701px]:flex min-[701px]:h-screen min-[701px]:min-h-0 min-[701px]:flex-col min-[701px]:overflow-hidden [@media(min-width:701px)_and_(max-height:560px)]:h-auto [@media(min-width:701px)_and_(max-height:560px)]:overflow-visible">
          <Topbar notificationsOpen={notificationsOpen} onNotificationToggle={toggleNotifications} onNotificationClose={() => setNotificationsOpen(false)} sidebarExpanded={isMobile ? sidebarOpen : !sidebarCollapsed} onToggleSidebar={toggleSidebar} userMenuOpen={userMenuOpen} onUserToggle={toggleUserMenu} onUserMenuClick={handleUserMenuClick} profile={profile} notificationBadgeVisible={notificationBadgeVisible} onNotificationBadgeChange={setNotificationBadgeVisible} userButtonRef={userButtonRef} firstUserMenuItemRef={firstUserMenuItemRef} onBack={handleBack} />
          <Dashboard uploadRef={uploadRef} />
        </div>
      </div>
      <AccountOverlay open={accountOpen} initialView={accountInitialView} onClose={handleAccountClose} onProfileChange={setProfile} profile={profile} onCompactChange={setCompact} onMarkNotificationsRead={() => setNotificationBadgeVisible(false)} notificationBadgeVisible={notificationBadgeVisible} onNotificationBadgeChange={setNotificationBadgeVisible} uploadRef={uploadRef} />
    </div>
  );
}
