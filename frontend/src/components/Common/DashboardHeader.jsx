import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {Bell, ChevronDown, FileText, LogOut, Menu, Search, Settings, Sun, UserRound, X,} from "lucide-react";

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
      let nextIndex;

      

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
