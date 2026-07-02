"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "@/app/(authentication)/_lib/actions";
import { useNotificationStatus } from "@/app/(root)/_hooks/useNotifications";
import {
  Bell,
  GraduationCap,
  House,
  LogOut,
  Menu,
  NotebookPen,
  School,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { NavItem } from "../../_types/index";
import { isRouteActive } from "../../_constants";
import DwelveLogo from "@/components/Custom/DwelveLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SIDEBAR_WIDTH = "w-[264px]";

/**
 * Shared row geometry so every nav row (link, locked, logout) lines up exactly.
 * Weight is the state signal, not size: idle rests at `font-normal` (400) so the
 * active jump to `font-semibold` (600) reads clearly; row size never changes, so
 * switching tabs never shifts the layout.
 */
const ROW_BASE =
  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sidebar)]";
// Active fill is a soft brand tint derived from --primary (clearly visible on the
// --sidebar surface, unlike the near-white --accent), not a solid fill.
const ROW_ACTIVE =
  "bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--accent-foreground)] font-semibold tracking-[0.01em]";
const ROW_IDLE =
  "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]";

function NavIcon({ icon: Icon, color }: { icon: LucideIcon; color?: string }) {
  return <Icon color={color} className="h-5 w-5 shrink-0" strokeWidth={2} />;
}

/** Red count pill used on the Notifications row. */
function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--destructive)] px-1.5 text-[11px] font-bold leading-none text-[var(--destructive-foreground)]">
      {count}
    </span>
  );
}

function NavLink({
  item,
  active,
  badge,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${ROW_BASE} ${active ? ROW_ACTIVE : ROW_IDLE}`}
    >
      <NavIcon icon={item.icon} />
      <span className="truncate">{item.label}</span>
      {badge ? <CountBadge count={badge} /> : null}
    </Link>
  );
}

function LockedNavItem({
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
      className={`${ROW_BASE} cursor-not-allowed select-none text-[var(--muted-foreground)] opacity-55`}
    >
      <NavIcon icon={Icon} />
      <span className="truncate">{label}</span>
      <span className="ml-auto shrink-0 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
        {comingSoonLabel}
      </span>
    </div>
  );
}

function MobileLink({
  item,
  active,
  badge,
  onPress,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
  onPress?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onPress}
      aria-current={active ? "page" : undefined}
      className={`relative flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 transition ${
        active
          ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      <span className="relative">
        <NavIcon icon={item.icon} />
        {badge ? (
          <span className="absolute -right-2 -top-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--destructive)] px-1 text-[9px] font-bold leading-none text-[var(--destructive-foreground)]">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="truncate text-[11px] font-semibold max-[430px]:hidden">{item.label}</span>
    </Link>
  );
}

export default function SideBar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const { data: notificationStatus } = useNotificationStatus();
  const unreadCount = notificationStatus?.unreadCount ?? 0;

  // Primary navigation — order and items mirror the reference design.
  const primaryItems: NavItem[] = [
    { href: "/dashboard", label: t("sidebar.dashboard"), icon: House },
    { href: "/school", label: t("sidebar.school"), icon: School },
    { href: "/groups", label: t("sidebar.classes"), icon: GraduationCap },
  ];
  const notificationsItem: NavItem = {
    href: "/notifications",
    label: t("sidebar.notifications"),
    icon: Bell,
  };
  const settingsItem: NavItem = { href: "/settings", label: t("sidebar.settings"), icon: Settings };
  const profileItem: NavItem = { href: "/profile", label: t("sidebar.profile"), icon: UserRound };

  const comingSoon = t("sidebar.comingSoon");
  const isActive = (href: string) => isRouteActive(pathname, href);

  const mobileExtra: NavItem[] = [settingsItem, profileItem];

  return (
    <>
      {/* Desktop: flat, flush-left full-height panel with a hairline right divider. */}
      <aside
        className={`hidden md:sticky md:top-0 md:flex md:h-screen md:flex-col ${SIDEBAR_WIDTH} shrink-0 border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)]`}
      >
        <div className="px-6 pb-5 pt-6">
          <DwelveLogo variant="form" />
        </div>

        <nav
          aria-label={t("sidebar.primaryNav")}
          className="flex-1 space-y-1 overflow-y-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {primaryItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
          <LockedNavItem icon={NotebookPen} label={t("sidebar.assignments")} comingSoonLabel={comingSoon} />
          <NavLink
            item={notificationsItem}
            active={isActive(notificationsItem.href)}
            badge={unreadCount}
          />
          <NavLink item={settingsItem} active={isActive(settingsItem.href)} />
        </nav>

        <div className="space-y-1 border-t border-[var(--border)] px-3 py-3">
          <NavLink item={profileItem} active={isActive(profileItem.href)} />
          <button
            type="button"
            onClick={logout}
            className={`${ROW_BASE} ${ROW_IDLE} cursor-pointer hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]`}
          >
            <NavIcon icon={LogOut} />
            <span className="truncate">{t("sidebar.logOut")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile: bottom navigation bar. */}
      <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
        <nav
          aria-label={t("sidebar.primaryNav")}
          className="border-t border-[var(--border)] bg-[var(--card)]/95 p-2 backdrop-blur"
        >
          <div className="flex items-stretch gap-1.5">
            {primaryItems.map((item) => (
              <MobileLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                onPress={() => setMobileMoreOpen(false)}
              />
            ))}
            <MobileLink
              item={notificationsItem}
              active={isActive(notificationsItem.href)}
              badge={unreadCount}
              onPress={() => setMobileMoreOpen(false)}
            />
            <DropdownMenu open={mobileMoreOpen} onOpenChange={setMobileMoreOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${
                    mobileMoreOpen
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
                <DropdownMenuItem
                  disabled
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold opacity-70 max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs"
                >
                  <NavIcon icon={NotebookPen} />
                  <span className="ml-3">{t("sidebar.assignments")}</span>
                  <span className="ml-auto rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
                    {comingSoon}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5" />
                {mobileExtra.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className={`cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold max-[350px]:rounded-lg max-[350px]:px-2.5 max-[350px]:py-2 max-[350px]:text-xs ${
                      isActive(item.href)
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)] focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
                        : "text-[var(--popover-foreground)]/75"
                    }`}
                  >
                    <Link href={item.href}>
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
                  <NavIcon color="var(--destructive)" icon={LogOut} />
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
