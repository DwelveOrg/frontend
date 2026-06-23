"use client";

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import { logout } from "@/app/(authentication)/_lib/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** First letter of the user's name, used as the avatar glyph. */
function initialOf(name?: string | null) {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : null;
}

const Profile = ({ userName }: { userName?: string | null }) => {
  const { t } = useTranslation();
  const initial = initialOf(userName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("root.pages.profile")}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--accent-foreground)] outline-none ring-offset-2 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:h-10 md:w-10"
        >
          {initial ?? <UserRound className="h-4 w-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[220px] rounded-2xl border-[var(--border)] bg-[var(--popover)] p-2 shadow-xl"
      >
        {userName ? (
          <>
            <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-[var(--popover-foreground)]">
              {userName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
          </>
        ) : null}
        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--popover-foreground)]/80 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
        >
          <Link href="/profile">
            <UserRound className="h-4 w-4" />
            <span className="ml-2">{t("sidebar.profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--popover-foreground)]/80 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)]"
        >
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            <span className="ml-2">{t("sidebar.settings")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            logout();
          }}
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--destructive)] focus:bg-[var(--destructive)]/10 focus:text-[var(--destructive)]"
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2">{t("sidebar.logOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
