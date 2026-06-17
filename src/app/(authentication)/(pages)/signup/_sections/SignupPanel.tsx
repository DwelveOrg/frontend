import DwelveLogo from "@/components/Custom/DwelveLogo";

export default function SignupPanel() {
  const features = [
    { icon: "⚡", label: "Instant auto-grading" },
    { icon: "📊", label: "Progress analytics" },
    { icon: "📄", label: "PDF test generation" },
    { icon: "📱", label: "Works on any device" },
  ];

  return (
    <>
      <DwelveLogo />

      <div className="flex flex-col gap-7">
        <div>
          <h2 className="font-serif text-[2.5rem] leading-[1.12] tracking-tight text-white">
            Start learning<br />smarter today.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            The platform built for students and teachers who want real results, not more paperwork.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/8 px-3 py-2.5 backdrop-blur-sm"
            >
              <span className="text-base">{f.icon}</span>
              <span className="text-xs font-medium text-white/80">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Score card */}
        <div className="w-64 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white/45">Physics · Unit 4</p>
              <p className="text-xs font-semibold text-white">Your latest score</p>
            </div>
            <div className="relative flex h-12 w-12 items-center justify-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="87.96 100"
                  pathLength="100"
                />
              </svg>
              <span className="relative text-[11px] font-bold text-white">94%</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {["A", "B", "A+", "B+", "A"].map((g, i) => (
              <div key={i} className="flex-1 rounded-lg bg-white/12 py-1.5 text-center text-[10px] font-semibold text-white/80">
                {g}
              </div>
            ))}
          </div>
          <p className="mt-2 text-right text-[10px] text-white/40">Last 5 subjects</p>
        </div>
      </div>

      {/* Social proof */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2.5">
          {[
            { initials: "JK", color: "from-pink-500 to-rose-600" },
            { initials: "LM", color: "from-indigo-400 to-blue-600" },
            { initials: "TA", color: "from-teal-500 to-emerald-600" },
          ].map((a) => (
            <div
              key={a.initials}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${a.color} border-2 border-white/20 text-[10px] font-bold text-white`}
            >
              {a.initials}
            </div>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20 bg-white/15 text-xs font-semibold text-white">
            +
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">12,000+ students</p>
          <p className="text-xs text-white/45">already on Dwelve</p>
        </div>
      </div>
    </>
  );
}
