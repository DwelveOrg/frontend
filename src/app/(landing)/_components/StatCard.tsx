import type { StatCardProps } from "../_types";

export default function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3 dark:bg-white/5">
      <p className="text-[11px] font-medium text-[#94a3b8] dark:text-slate-400">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${
          accent ? "text-[#4F46E5] dark:text-indigo-300" : "text-[#1a1a2e] dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
