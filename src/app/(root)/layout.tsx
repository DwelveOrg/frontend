import SideBar from "@/app/(root)/_components/Sidebar";
import Navbar from "@/app/(root)/_components/Navbar";
import RouteHeader from "@/app/(root)/_components/RouteHeader";
import { getUser } from "@/app/(root)/_utils/getUser";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    // Flat app shell: flush-left sidebar (paints --card) over a muted canvas,
    // a full-width content column with a flat top bar above the scrolling main.
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[var(--muted)] text-[var(--foreground)] md:h-screen dark:bg-[var(--background)]">
      <SideBar />
      <div className="layout-enter relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar userName={user?.name} />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto pb-24 md:pb-0 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.45)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/45 [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb:hover]:bg-slate-500/60 dark:[scrollbar-color:rgba(148,163,184,0.35)_transparent] dark:[&::-webkit-scrollbar-thumb]:bg-slate-500/40 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-400/55">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 md:px-8 md:py-8">
            <RouteHeader />
            <div className="mt-6 min-w-0 md:mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
