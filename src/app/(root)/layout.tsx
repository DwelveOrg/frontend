import SideBar from "@/app/(root)/_components/Sidebar";
import Navbar from "@/app/(root)/_components/Navbar";
import { getUser } from "@/app/(root)/_utils/getUser";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <div className="flex h-dvh flex-col overflow-hidden text-slate-900 md:min-h-screen md:h-screen md:flex-row dark:bg-[#1e1e1e] dark:text-slate-100">
      <SideBar />
      <div className="layout-enter md:gap-[20px] relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden  md:h-screen md:px-3">
        <Navbar userName={user?.name} />
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden mx-3 md:mx-0 md:mb-4">
          <div className="h-full min-h-0 min-w-0 overflow-y-auto pb-24 md:pb-0 [scrollbar-width:thin] [scrollbar-color:rgba(100,116,139,0.45)_transparent] dark:[scrollbar-color:rgba(148,163,184,0.35)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/45 [&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb:hover]:bg-slate-500/60 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500/40 dark:[&::-webkit-scrollbar-thumb:hover]:bg-slate-400/55">
            <div className="min-w-0">{children}</div>
          </div>  
        </main>
      </div>
    </div>
  );
}
