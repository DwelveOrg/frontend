import DwelveLogo from "@/components/Custom/DwelveLogo";

export default function LoginPanel() {
  const bars = [55, 72, 85, 90, 78, 88, 95, 70, 82];
  const avatars = [
    { initials: "AY", color: "from-violet-500 to-purple-600" },
    { initials: "KM", color: "from-blue-500 to-indigo-600" },
    { initials: "SR", color: "from-emerald-500 to-teal-600" },
    { initials: "NB", color: "from-amber-400 to-orange-500" },
  ];

  return (
    <>
      <DwelveLogo />

      <div className="flex flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
          Active across 500+ classrooms
        </div>

        <div>
          <h2 className="font-serif text-[2.5rem] leading-[1.12] tracking-tight text-white">
            Your students deserve<br />instant feedback.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Auto-graded tests. Real-time analytics.<br />Zero paperwork.
          </p>
        </div>

        {/* Floating test-result card */}
        <div className="w-72 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-white">Algebra · Chapter 5</p>
              <p className="mt-0.5 text-[10px] text-white/45">Graded automatically · 2 min ago</p>
            </div>
            <span className="shrink-0 rounded-lg border border-emerald-400/25 bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">
              ✓ Done
            </span>
          </div>
          <div className="mb-3 flex h-12 items-end gap-0.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[3px] bg-gradient-to-t from-indigo-400/50 to-indigo-200/80 transition-all"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/45">24 students</span>
            <span className="font-bold text-white">83% avg score</span>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-xs text-white/70 backdrop-blur-sm">
          <span className="text-base">⚡</span>
          <span><strong className="text-white">5 tests</strong> graded in the last hour</span>
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2.5">
          {avatars.map((a) => (
            <div
              key={a.initials}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.color} border-2 border-white/20 text-[10px] font-bold text-white shadow-lg`}
            >
              {a.initials}
            </div>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20 bg-white/15 text-xs font-semibold text-white backdrop-blur-sm">
            +
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">2,400+ teachers</p>
          <p className="text-xs text-white/45">trust Dwelve every day</p>
        </div>
      </div>
    </>
  );
}
