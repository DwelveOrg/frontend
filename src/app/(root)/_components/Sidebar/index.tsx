"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { logout } from '@/app/(authentication)/_lib/actions'
import {
  Bell,
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
import DwelveLogo from "@/components/Custom/DwelveLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COLLAPSED_BUTTON_SIZE = "h-11 w-11 min-h-11 min-w-11 shrink-0 aspect-square";
const SIDEBAR_BUTTON_PADDING = "p-2.5";

function NavIcon({ icon: Icon, color }: { icon: LucideIcon; color?: string }) {
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
      <div className="pointer-events-none absolute left-full top-1/2 z-[130] ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs font-medium text-[var(--foreground)] opacity-0 shadow-sm transition-opacity duration-150 group-hover/tt:opacity-100">
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
            ? "border-[var(--sidebar-primary)] bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
            : "border-transparent text-[var(--sidebar-foreground)] opacity-70 hover:border-[var(--sidebar-border)] hover:bg-[var(--sidebar-accent)] hover:opacity-100"
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

function LockedNavItem({
  icon: Icon,
  label,
  collapsed,
  comingSoonLabel,
}: {
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  comingSoonLabel: string;
}) {
  return (
    <SidebarTooltip label={`${label} — ${comingSoonLabel}`} collapsed={collapsed}>
      <div
        aria-disabled="true"
        className={`flex items-center rounded-2xl border border-dashed border-[var(--sidebar-border)] transition-all ${
          collapsed
            ? `mx-auto ${COLLAPSED_BUTTON_SIZE} ${SIDEBAR_BUTTON_PADDING} justify-center`
            : `${SIDEBAR_BUTTON_PADDING} justify-start`
        } cursor-not-allowed select-none opacity-40`}
      >
        <NavIcon icon={Icon} />
        {!collapsed ? (
          <>
            <span className="ml-3 truncate text-[15px] font-semibold tracking-tight text-[var(--sidebar-foreground)]">
              {label}
            </span>
            <span className="ml-auto shrink-0 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-foreground)]">
              {comingSoonLabel}
            </span>
          </>
        ) : null}
      </div>
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
          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
          : "text-[var(--sidebar-foreground)] opacity-70 hover:bg-[var(--sidebar-accent)] hover:opacity-100"
      }`}
    >
      <NavIcon icon={Icon} />
      <span className="truncate text-[11px] font-semibold max-[430px]:hidden">{item.label}</span>
    </Link>
  );
}

function MobileLockedItem({
  icon: Icon,
  label,
  comingSoonLabel,
}: {
  icon: LucideIcon;
  label: string;
  comingSoonLabel: string;
}) {
  return (
    <div
      aria-disabled="true"
      className="relative flex min-w-0 flex-1 cursor-not-allowed select-none flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 opacity-40"
    >
      <NavIcon icon={Icon} />
      <span className="truncate text-[11px] font-semibold text-[var(--sidebar-foreground)] max-[430px]:hidden">
        {label}
      </span>
      <span className="absolute -top-0.5 right-0 rounded-full bg-[var(--accent)] px-1.5 py-px text-[8px] font-bold uppercase tracking-wide text-[var(--accent-foreground)]">
        {comingSoonLabel}
      </span>
    </div>
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
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const topItems: NavItem[] = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: House },
    { href: "/school", label: t("sidebar.school"), icon: School },
    { href: "/groups", label: t("sidebar.classes"), icon: GraduationCap },
    { href: "/notifications", label: t("sidebar.notifications"), icon: Bell },
  ];

  const bottomItems: NavItem[] = [
    { href: "/settings", label: t("sidebar.settings"), icon: Settings },
    { href: "/profile", label: t("sidebar.profile"), icon: UserRound },
  ];

  const mobilePrimary: NavItem[] = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: House },
    { href: "/school", label: t("sidebar.school"), icon: School },
    { href: "/groups", label: t("sidebar.classes"), icon: GraduationCap },
  ];

  const mobileExtra = [...topItems.slice(3), ...bottomItems];
  const comingSoon = t("sidebar.comingSoon");

  useEffect(() => {
    localStorage.setItem("gf-sidebar-collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const desktopWidth = useMemo(() => (collapsed ? "w-[96px]" : "w-[300px]"), [collapsed]);

  if (!mounted) {
    return <aside className="hidden md:flex w-[300px] shrink-0 p-4" aria-hidden />;
  }

  return (
    <>
      <aside className={`hidden md:sticky md:top-0 md:flex md:h-screen ${desktopWidth} shrink-0 p-4 transition-[width] duration-300`}>
        <div className="relative flex h-[calc(100vh-2rem)] w-full flex-col overflow-visible rounded-[28px] border border-[var(--sidebar-border)] bg-[var(--sidebar)] p-3 text-[var(--sidebar-foreground)] shadow-sm">
          <div className={`mb-4 ${collapsed ? "flex justify-center" : "flex items-start justify-between"}`}>
            {!collapsed ? (
              <div className="min-w-0 pl-[10px]">
                <DwelveLogo variant="form" />
                <p className="truncate mt-1 text-xs text-[var(--muted-foreground)]">{t("sidebar.brandSub")}</p>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setCollapsed((prev) => !prev)}
              className={`inline-flex ${COLLAPSED_BUTTON_SIZE} ${SIDEBAR_BUTTON_PADDING} cursor-pointer items-center justify-center rounded-2xl border border-[var(--sidebar-border)] bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]`}
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
              {topItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
              ))}
            </nav>
          </div>

          <div className={collapsed ? "mt-4 flex flex-col items-center gap-2" : "mt-4 space-y-2"}>
            <LockedNavItem
              icon={NotebookPen}
              label={t("sidebar.assignments")}
              collapsed={collapsed}
              comingSoonLabel={comingSoon}
            />
            {bottomItems.map((item) => (
              <NavLink key={item.href} item={item} collapsed={collapsed} active={pathname === item.href} />
            ))}
            <SidebarTooltip label={t("sidebar.logOut")} collapsed={collapsed}>
              <button
                type="button"
                onClick={logout}
                className={`flex cursor-pointer items-center rounded-2xl border border-[var(--sidebar-border)] bg-[var(--sidebar-accent)] text-[var(--sidebar-foreground)] transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] ${
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
        <nav className="border-t border-[var(--sidebar-border)] bg-[var(--sidebar)]/95 p-2 backdrop-blur">
          <div className="flex items-stretch gap-1.5">
            {mobilePrimary.map((item) => (
              <MobileLink
                key={item.href}
                item={item}
                active={pathname === item.href}
                onPress={() => setMobileMoreOpen(false)}
              />
            ))}
            <MobileLockedItem
              icon={NotebookPen}
              label={t("sidebar.assignments")}
              comingSoonLabel={comingSoon}
            />
            <DropdownMenu open={mobileMoreOpen} onOpenChange={setMobileMoreOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                    mobileMoreOpen
                      ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]"
                      : "text-[var(--sidebar-foreground)] opacity-75 hover:bg-[var(--sidebar-accent)] hover:opacity-100"
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
                className="mb-2 w-[260px] rounded-2xl border-[var(--border)] bg-[var(--popover)] p-2 shadow-xl max-[350px]:w-[220px]"
              >
                {mobileExtra.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs ${
                      pathname === item.href
                        ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] focus:bg-[var(--sidebar-primary)] focus:text-[var(--sidebar-primary-foreground)]"
                        : "text-[var(--popover-foreground)]/75"
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
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--popover-foreground)]/75 max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs"
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
