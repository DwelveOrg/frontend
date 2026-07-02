"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import Notifications from "./_components/Notifications";
import Profile from "./_components/Profile";
import { getRouteLabelKey } from "@/app/(root)/_constants";
import { useNotificationStatus } from "@/app/(root)/_hooks/useNotifications";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/(root)/_components/Navbar/_components/Breadcrumb";

const Navbar = ({ userName }: { userName?: string | null }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const { data: notificationStatus, refetch: refetchNotificationStatus } =
    useNotificationStatus();

  const unreadCount = notificationStatus?.unreadCount ?? 0;

  // Breadcrumb always opens with "Home" → dashboard, then the active route trail.
  const crumbs = useMemo(() => {
    const home = { href: "/dashboard", label: t("root.breadcrumb.home") };
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0 || (segments.length === 1 && segments[0] === "dashboard")) {
      return [home];
    }

    const trail = segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const key = getRouteLabelKey(segment);
      return { href, label: key ? t(key) : segment };
    });

    return [home, ...trail];
  }, [pathname, t]);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    void refetchNotificationStatus();
  }, [pathname, refetchNotificationStatus]);

  useEffect(() => {
    if (!showNotifications) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNotifications]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 md:px-6 md:py-3.5">
      <div className="flex items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList className="text-[var(--muted-foreground)]">
            {crumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                {index > 0 ? (
                  <BreadcrumbSeparator className="text-[var(--muted-foreground)]" />
                ) : null}
                <BreadcrumbItem>
                  {index === crumbs.length - 1 ? (
                    <BreadcrumbPage className="font-semibold text-[var(--foreground)]">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-2">
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] transition hover:bg-[var(--muted)] md:h-10 md:w-10"
              aria-label={t("root.pages.notifications")}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--destructive)] ring-2 ring-[var(--card)]" />
              ) : null}
            </button>
            {showNotifications ? (
              <div className="absolute -right-2 top-[calc(100%+12px)] z-50 md:-right-1">
                <Notifications onItemClick={() => setShowNotifications(false)} />
              </div>
            ) : null}
          </div>
          <Profile userName={userName} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
