"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import Empty from "../../_components/ui/Empty";
import { useDiscoverClasses } from "@/app/(root)/_hooks/useEnrollment";
import DiscoverClassCard from "./DiscoverClassCard";
import ClassesNav from "./ClassesNav";

type DiscoverClassesViewProps = {
  schoolId: string | undefined;
};

const PAGE_SIZE = 20;

/** Student-facing class discovery with search and incremental loading. */
export default function DiscoverClassesView({ schoolId }: DiscoverClassesViewProps) {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounce the search so we don't refetch on every keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  const query = useDiscoverClasses({ schoolId, search, limit: PAGE_SIZE });

  const classes = useMemo(
    () => query.data?.pages.flatMap((page) => page.classes) ?? [],
    [query.data?.pages],
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {t("root.enrollment.discover.title")}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          {t("root.enrollment.discover.subtitle")}
        </p>
      </header>

      <ClassesNav schoolId={schoolId} />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={t("root.enrollment.discover.searchPlaceholder")}
          aria-label={t("root.enrollment.discover.searchPlaceholder")}
          className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
        />
      </div>

      {query.isLoading ? (
        <div
          aria-busy="true"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--muted)]"
            />
          ))}
        </div>
      ) : query.isError ? (
        <Empty
          title={t("root.enrollment.discover.errorTitle")}
          description={t("root.enrollment.discover.errorDescription")}
        />
      ) : classes.length === 0 ? (
        <Empty
          title={
            search
              ? t("root.enrollment.discover.noResultsTitle")
              : t("root.enrollment.discover.emptyTitle")
          }
          description={
            search
              ? t("root.enrollment.discover.noResultsDescription")
              : t("root.enrollment.discover.emptyDescription")
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((item) => (
              <DiscoverClassCard key={item.id} item={item} schoolId={schoolId} />
            ))}
          </div>

          {query.hasNextPage ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => void query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
                className="cursor-pointer rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {query.isFetchingNextPage
                  ? t("root.enrollment.loading")
                  : t("root.enrollment.loadMore")}
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
