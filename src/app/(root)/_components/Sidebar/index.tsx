"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { logout } from '@/app/(authentication)/_lib/actions'
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  House,
  LogOut,
  Menu,
  NotebookPen,
  School,
  Settings,
  UserRound,
  type LucideIcon
} from "lucide-react";
import { NavItem } from "../../_types/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { examItems } from '../../(pages)/_constants/index'

const COLLAPSED_BUTTON_SIZE = "h-11 w-11 min-h-11 min-w-11 shrink-0 aspect-square";
const SIDEBAR_BUTTON_PADDING = "p-2.5";

function NavIcon({ icon: Icon, color }: { icon: LucideIcon , color?:string }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center">
      <Icon color={color} className="h-6 w-6 shrink-0" strokeWidth={2} absoluteStrokeWidth />
    </span>
  );
}

function SidebarTooltip({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: ReactNode;
}) {
  if (!collapsed) return <>{children}</>;

  return (
    <div className="group/tt relative z-[120] flex w-full justify-center">
      {children}
      <div className="pointer-events-none absolute left-full top-1/2 z-[130] ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-800 opacity-0 shadow-sm transition-opacity duration-150 group-hover/tt:opacity-100 dark:border-slate-700 dark:bg-[#111827] dark:text-slate-100">
        {label}
      </div>
    </div>
  );
}

function NavLink({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;

  return (
    <SidebarTooltip label={item.label} collapsed={collapsed}>
      <Link
        href={item.href}
        prefetch={false}
        onClick={onClick}
        className={`group flex cursor-pointer items-center rounded-2xl border transition-all duration-200 ${
          collapsed
            ? `mx-auto ${COLLAPSED_BUTTON_SIZE} ${SIDEBAR_BUTTON_PADDING} justify-center overflow-visible`
            : `justify-start ${SIDEBAR_BUTTON_PADDING}`
        } ${
          active
            ? "border-[#2d63ff] bg-[#0046FF] text-white"
            : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:text-white/80 dark:hover:border-white/10 dark:hover:bg-white/8 dark:hover:text-white"
        }`}
      >
        <NavIcon icon={Icon} />
        {!collapsed ? (
          <span className="ml-3 truncate text-[15px] font-semibold tracking-tight">{item.label}</span>
        ) : null}
      </Link>
    </SidebarTooltip>
  );
}

function MobileLink({
  item,
  active,
  onPress,
}: {
  item: NavItem;
  active: boolean;
  onPress?: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      prefetch={false}
      onClick={onPress}
      className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition ${
        active
          ? "bg-[#0046FF] text-white"
          : "text-[#121212]/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
      }`}
    >
      <NavIcon icon={Icon} />
      <span className="truncate text-[11px] font-semibold max-[430px]:hidden">{item.label}</span>
    </Link>
  );
}

export default function SideBar() {
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("gf-sidebar-collapsed") === "1";
  });
  const [assignmentsOpen, setassignmentsOpen] = useState(false);
  const [mobileAssignmentsOpen, setMobileAssignmentsOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const assignmentsMenuRef = useRef<HTMLDivElement | null>(null);
  const expandAssignmentsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assignmentsActive = pathname.startsWith("/assignments");
  const topItems: NavItem[] = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: House },
    { href: "/groups", label: t("sidebar.classes"), icon: GraduationCap },
    { href: "/school", label: t("sidebar.school"), icon: School },
    { href: "/notifications", label: t("sidebar.notifications"), icon: Bell },
  ];

  const assessmentItems = [
    { href: "/assignments/homework", label: t("sidebar.homework"), count: 0 },
    { href: "/assignments/exams", label: t("sidebar.exams"), count: examItems.length },
  ];

  const bottomItems: NavItem[] = [
    { href: "/settings", label: t("sidebar.settings"), icon: Settings },
    { href: "/profile", label: t("sidebar.profile"), icon: UserRound },
  ];

  const mobilePrimary: NavItem[] = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: House },
    { href: "/groups", label: t("sidebar.classes"), icon: GraduationCap },
    { href: "/school", label: t("sidebar.school"), icon: School },
    { href: "/assignments", label: t("sidebar.assignments"), icon: NotebookPen },
  ];
  const mobileExtra = [...topItems.slice(3), ...bottomItems];

  useEffect(() => {
    localStorage.setItem("gf-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    return () => {
      if (expandAssignmentsTimerRef.current) {
        clearTimeout(expandAssignmentsTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (assignmentsOpen) {
        const assignmentsMenu = assignmentsMenuRef.current;
        if (assignmentsMenu && !assignmentsMenu.contains(target)) {
          setassignmentsOpen(false);
        }
      }

    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (assignmentsOpen) setassignmentsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [assignmentsOpen]);

  const desktopWidth = useMemo(() => (collapsed ? "w-[96px]" : "w-[300px]"), [collapsed]);

  const handleCollapsedassignmentsClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (expandAssignmentsTimerRef.current) {
      clearTimeout(expandAssignmentsTimerRef.current);
    }
    setassignmentsOpen(false);
    setCollapsed(false);
    expandAssignmentsTimerRef.current = setTimeout(() => {
      setassignmentsOpen(true);
      expandAssignmentsTimerRef.current = null;
    }, 320);
  };

  if (!mounted) {
    return <aside className="hidden md:flex w-[300px] shrink-0 p-4" aria-hidden />;
  }

  return (
    <>
      <aside className={`hidden md:sticky md:top-0 md:flex md:h-screen ${desktopWidth} shrink-0 p-4 transition-[width] duration-300`}>
        <div className="relative flex h-[calc(100vh-2rem)] w-full flex-col overflow-visible rounded-[28px] border border-black/10 bg-white p-3 text-slate-900 shadow-sm dark:border-[#3a3a3a] dark:bg-[#1a1a1a] dark:text-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className={`mb-4 ${collapsed ? "flex justify-center" : "flex items-start justify-between"}`}>
            {!collapsed ? (
              <div className="min-w-0 pl-[10px]">
                <p className="truncate font-[var(--font-montserrat)] text-2xl font-semibold leading-none">Dwelve</p>
                <p className="truncate mt-1 text-xs text-slate-500 dark:text-white/55">{t("sidebar.brandSub")}</p>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className={`inline-flex ${COLLAPSED_BUTTON_SIZE} ${SIDEBAR_BUTTON_PADDING} cursor-pointer items-center justify-center rounded-2xl border border-slate-300 bg-slate-50 text-slate-700 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/6 dark:text-white/85 dark:hover:bg-white/14 dark:hover:text-white`}
              aria-label={collapsed ? t("sidebar.expand") : t("sidebar.collapse")}
            >
              {collapsed ? <NavIcon icon={ChevronRight} /> : <NavIcon icon={ChevronLeft} />}
            </button>
          </div>

          <div
            className={`flex-1 pr-1 ${
              collapsed
                ? "overflow-visible"
                : "sidebar-scroll overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            }`}
          >
            <nav className={collapsed ? "mx-auto flex w-full flex-col items-center gap-2" : "space-y-2"}>
              {topItems.slice(0, 3).map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
              ))}

              {collapsed ? (
                <SidebarTooltip label={t("sidebar.assignments")} collapsed={collapsed}>
                  <button
                    type="button"
                    onClick={handleCollapsedassignmentsClick}
                    className={`group flex cursor-pointer items-center justify-center rounded-2xl border transition-all duration-200 ${
                      collapsed
                        ? `mx-auto ${COLLAPSED_BUTTON_SIZE} ${SIDEBAR_BUTTON_PADDING} overflow-visible`
                        : `w-full ${SIDEBAR_BUTTON_PADDING}`
                    } ${
                      assignmentsActive
                        ? "border-[#2d63ff] bg-[#0046FF] text-white"
                        : "border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:text-white/80 dark:hover:border-white/10 dark:hover:bg-white/8 dark:hover:text-white"
                    }`}
                  >
                    <NavIcon icon={NotebookPen} />
                  </button>
                </SidebarTooltip>
              ) : (
                <div
                  ref={assignmentsMenuRef}
                  className="rounded-2xl border border-slate-300/80 bg-white/80 dark:border-white/8 dark:bg-white/3"
                >
                  <button
                    type="button"
                    onClick={() => setassignmentsOpen((prev) => !prev)}
                    aria-expanded={assignmentsOpen}
                    aria-controls="sidebar-assignments-panel"
                    className={`flex w-full cursor-pointer items-center rounded-2xl text-left transition ${SIDEBAR_BUTTON_PADDING} ${
                      assignmentsActive
                        ? "bg-slate-100 text-slate-900 dark:bg-white/8 dark:text-white"
                        : "text-slate-700 hover:bg-slate-100 dark:text-white/85 dark:hover:bg-white/6 dark:hover:text-white"
                    }`}
                  >
                    <NotebookPen className="h-5 w-5 shrink-0" />
                    <span className="ml-3 text-[15px] font-semibold tracking-tight">{t("sidebar.assignments")}</span>
                    <span
                      className={`ml-auto transition-transform duration-300 ${
                        assignmentsOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <div
                    id="sidebar-assignments-panel"
                    className={`overflow-hidden px-2 transition-[max-height,opacity] duration-300 ease-out ${
                      assignmentsOpen ? "max-h-96 pb-2 opacity-100" : "max-h-0 pb-0 opacity-0"
                    }`}
                  >
                    <div className="mt-2">
                      {assessmentItems.map((item) => {
                        const subActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={`flex cursor-pointer items-center rounded-xl px-3 py-2 transition ${
                              subActive
                                ? "text-[#0046FF]"
                                : "text-slate-700 hover:bg-slate-100 dark:text-white/85 dark:hover:bg-white/6 dark:hover:text-white"
                            }`}
                          >
                            <span className={`mr-3 h-2 w-2 rounded-full ${subActive ? "bg-[#0046FF]" : "bg-slate-500 dark:bg-white/80"}`} />
                            <span className="text-[15px] font-semibold">{item.label}</span>
                            {item.count > 0 ? (
                              <span className="ml-auto text-[28px] leading-none text-[#e11d48]">{item.count}</span>
                            ) : null}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {topItems.slice(3).map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
              ))}
            </nav>
          </div>

          <div className={collapsed ? "mt-4 flex flex-col items-center gap-2" : "mt-4 space-y-2"}>
            {bottomItems.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
            ))}
            <SidebarTooltip label={t("sidebar.logOut")} collapsed={collapsed}>
              <button
                type="button"
                onClick={logout}
                className={`flex cursor-pointer items-center rounded-2xl border border-slate-300 bg-slate-50 text-slate-700 transition hover:bg-slate-200 dark:border-white/12 dark:bg-white/7 dark:text-white/85 dark:hover:bg-white/15 dark:hover:text-white ${
                    collapsed
                      ? `mx-auto ${COLLAPSED_BUTTON_SIZE} ${SIDEBAR_BUTTON_PADDING} justify-center overflow-visible`
                      : `w-full justify-start ${SIDEBAR_BUTTON_PADDING}`
                }`}
              >
                  <NavIcon color="#FF746C" icon={LogOut} />
                  {!collapsed ? <span className="ml-3 text-[15px] font-semibold">{t("sidebar.logOut")}</span> : null}
                </button>
            </SidebarTooltip>
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <nav className="border-t border-black/10 bg-white/95 p-2 backdrop-blur dark:border-[#3a3a3a] dark:bg-[#1a1a1a]/95">
          <div className="flex items-stretch gap-1.5">
            {mobilePrimary.map((item) =>
              item.href === "/assignments" ? (
                <DropdownMenu
                  key={item.href}
                  open={mobileAssignmentsOpen}
                  onOpenChange={(open) => {
                    setMobileAssignmentsOpen(open);
                    if (open) setMobileMoreOpen(false);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition ${
                        assignmentsActive || mobileAssignmentsOpen
                          ? "bg-[#0046FF] text-white"
                          : "text-[#121212]/70 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                      }`}
                      aria-label={t("sidebar.toggleAssignments")}
                    >
                      <NavIcon icon={NotebookPen} />
                      <span className="truncate text-[11px] font-semibold max-[430px]:hidden">{item.label}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="end"
                    className="mb-2 w-[260px] rounded-2xl border-black/10 bg-white p-2 shadow-xl max-[350px]:w-[220px] dark:border-[#3a3a3a] dark:bg-[#1a1a1a]"
                  >
                    {assessmentItems.map((option) => (
                      <DropdownMenuItem
                        key={option.href}
                        asChild
                        className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs ${
                          pathname === option.href
                            ? "bg-[#0046FF] text-white focus:bg-[#0046FF] focus:text-white"
                            : "text-[#121212]/75 dark:text-white/75"
                        }`}
                      >
                        <Link href={option.href} prefetch={false}>
                          <span className={`h-2 w-2 rounded-full ${pathname === option.href ? "bg-white" : "bg-slate-500 dark:bg-white/80"}`} />
                          <span className="ml-3">{option.label}</span>
                          {option.count > 0 ? (
                            <span className="ml-auto text-[18px] leading-none text-[#e11d48]">
                              {option.count}
                            </span>
                          ) : null}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <MobileLink
                  key={item.href}
                  item={item}
                  active={pathname === item.href}
                  onPress={() => {
                    setMobileAssignmentsOpen(false);
                    setMobileMoreOpen(false);
                  }}
                />
              )
            )}
            <DropdownMenu
              open={mobileMoreOpen}
              onOpenChange={(open) => {
                setMobileMoreOpen(open);
                if (open) setMobileAssignmentsOpen(false);
              }}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                    mobileMoreOpen
                      ? "bg-[#0046FF] text-white"
                      : "text-[#121212]/75 hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
                  }`}
                  aria-label={t("sidebar.toggleMore")}
                >
                  <NavIcon icon={Menu} />
                  <span className="max-[430px]:hidden">{t("sidebar.more")}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="mb-2 w-[260px] rounded-2xl border-black/10 bg-white p-2 shadow-xl max-[350px]:w-[220px] dark:border-[#3a3a3a] dark:bg-[#1a1a1a]"
              >
                {mobileExtra.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs ${
                      pathname === item.href
                        ? "bg-[#0046FF] text-white focus:bg-[#0046FF] focus:text-white"
                        : "text-[#121212]/75 dark:text-white/75"
                    }`}
                  >
                    <Link href={item.href} prefetch={false}>
                      <NavIcon icon={item.icon} />
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    logout();
                  }}
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-[#121212]/75 max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs dark:text-white/75"
                >
                  <NavIcon color="#FF746C" icon={LogOut} />
                  <span className="ml-3">{t("sidebar.logOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </>
  );
}


