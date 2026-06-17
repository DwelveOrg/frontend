import DwelveLogo from "@/components/Custom/DwelveLogo";

export default function AdminPanel() {
  const stats = [
    { value: "3 min", label: "avg setup" },
    { value: "500+", label: "centers" },
    { value: "0", label: "paper waste" },
  ];

  const features = [
    { icon: "🏫", title: "Class management", desc: "Manage teachers, students, and classes from one place." },
    { icon: "📄", title: "PDF test import", desc: "Upload a PDF and Dwelve builds the test draft instantly." },
    { icon: "📊", title: "Center analytics", desc: "Track scores, trends, and progress across all your classes." },
  ];

  return (
    <>
      <DwelveLogo />

      <div className="flex flex-col gap-7">
        <div>
          <h2 className="font-serif text-[2.5rem] leading-[1.12] tracking-tight text-white">
            One platform for<br />your whole center.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            From test creation to grading and analytics — everything your school or learning center needs, in one place.
          </p>
        </div>

        {/* Stat pills */}
        <div className="flex gap-2">
          {stats.map((s) => (
            <div key={s.label} className="flex-1 rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-center backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Class overview card */}
        <div className="w-[280px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-white">Class 10A — Mathematics</p>
              <p className="mt-0.5 text-[10px] text-white/45">3 active tests · 28 students</p>
            </div>
            <span className="rounded-lg bg-indigo-400/20 px-2 py-1 text-[10px] font-semibold text-indigo-300">Live</span>
          </div>
          <div className="space-y-2">
            {[
              { name: "Algebra Quiz", pct: 88 },
              { name: "Geometry Final", pct: 72 },
              { name: "Statistics HW", pct: 95 },
            ].map((item) => (
              <div key={item.name}>
                <div className="mb-1 flex justify-between text-[10px] text-white/55">
                  <span>{item.name}</span>
                  <span className="font-semibold text-white/80">{item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-200"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="mt-0.5 text-base">{f.icon}</span>
              <div>
                <p className="text-xs font-semibold text-white">{f.title}</p>
                <p className="text-[11px] text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof */}
      <p className="text-sm text-white/50">
        Trusted by <span className="font-semibold text-white">500+ learning centers</span> worldwide
      </p>
    </>
  );
}
