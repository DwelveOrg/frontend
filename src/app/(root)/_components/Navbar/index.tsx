"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import Notifications from "./_components/Notifications";
import Profile from "./_components/Profile";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/(root)/_components/Navbar/_components/Breadcrumb";

const PAGE_KEY_MAP: Record<string, string> = {
  dashboard: "root.pages.dashboard",
  groups: "root.pages.classes",
  school: "root.pages.school",
  notifications: "root.pages.notifications",
  profile: "root.pages.profile",
  settings: "root.pages.settings",
  assignments: "sidebar.assignments",
  homework: "root.pages.homework",
  exams: "root.pages.exams",
};

const Navbar = ({ userName }: { userName?: string | null }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ href: "/dashboard", label: t("root.pages.dashboard") }];
    }

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const key = PAGE_KEY_MAP[segment];
      return {
        href,
        label: key ? t(key) : segment,
      };
    });
  }, [pathname, t]);

  const pageTitle = crumbs[crumbs.length - 1]?.label ?? t("root.pages.dashboard");
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const closeNotifications = () => setShowNotifications(false);
    closeNotifications();
  }, [pathname]);

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
    <div className="sticky top-0 z-30 w-full md:top-4">
      <nav className="rounded-none border-b border-[var(--border)] bg-[var(--background)] px-4 py-3 shadow-none md:rounded-[28px] md:border md:border-[var(--border)] md:bg-[var(--background)]/85 md:px-5 md:py-4 md:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:backdrop-blur dark:md:shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[var(--foreground)] capitalize">{pageTitle}</h1>

            <Breadcrumb className="mt-1">
              <BreadcrumbList className="text-[var(--muted-foreground)]">
                {crumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 ? <BreadcrumbSeparator className="text-[var(--muted-foreground)]" /> : null}
                    <BreadcrumbItem>
                      {index === crumbs.length - 1 ? (
                        <BreadcrumbPage className="text-[var(--foreground)]/70">{crumb.label}</BreadcrumbPage>
                      ) : (
                        <Link href={crumb.href} className="text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]">
                          {crumb.label}
                        </Link>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2">
            <div ref={notificationsRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] transition hover:bg-[var(--muted)] md:h-10 md:w-10 md:rounded-xl cursor-pointer"
                aria-label={t("root.pages.notifications")}
              >
                <Bell className="h-4 w-4" />
              </button>
              {showNotifications ? (
                <div className="absolute md:-right-1 -right-2 top-[calc(100%+12px)] z-50">
                  <Notifications onItemClick={() => setShowNotifications(false)} />
                </div>
              ) : null}
            </div>
            <Profile userName={userName} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
