import { useEffect, useState } from "react";
import api from "../services/api";

/* ---------- Animated count-up hook ---------- */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

/* ---------- Stat tile with count-up ---------- */
function StatTile({ label, value, accent, delay }) {
  const count = useCountUp(value);
  return (
    <div
      className="card p-6 anim-fade-up transition-transform duration-300 hover:-translate-y-1"
      style={{ animationDelay: delay }}
    >
      <span className="label-kicker">{label}</span>
      <div className="flex items-end gap-2">
        <span className="text-5xl font-semibold text-[--ink]" style={{ fontFamily: "Fraunces, serif" }}>
          {count}
        </span>
        <span
          className="mb-1.5 h-2.5 w-2.5 rounded-full"
          style={{ background: accent }}
        />
      </div>
    </div>
  );
}

/* ---------- Minimal animated donut (pure SVG) ---------- */
function Donut({ recyclable, hazardous }) {
  const total = recyclable + hazardous;
  const R = 54;
  const C = 2 * Math.PI * R;

  // Animate from 0 → progress using CSS transition on stroke-dashoffset
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(1));
    return () => cancelAnimationFrame(id);
  }, []);

  const recFrac = total > 0 ? recyclable / total : 0;

  return (
    <div className="relative h-56 w-56">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--paper-soft)" strokeWidth="14" />
        {hazardous > 0 && (
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="var(--clay)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={shown ? C * (1 - (1 - recFrac)) : C}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s" }}
          />
        )}
        {recyclable > 0 && (
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="var(--moss)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={shown ? C * (1 - recFrac) : C}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }}
  />
        )}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold text-[--ink]" style={{ fontFamily: "Fraunces, serif" }}>
          {total}
        </span>
        <span className="text-xs uppercase tracking-widest text-[--ink-faint] mt-1">scans</span>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/dashboard")
      .then((res) => setStats(res.data))
      .catch(() =>
        setError("Could not load dashboard. Is the backend running on port 5000?")
      );
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="text-red-700 bg-red-50 border border-red-200 rounded-2xl p-5 anim-fade-up">
          {error}
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="skeleton h-10 w-64 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="skeleton h-32" />
          <div className="skeleton h-32" />
          <div className="skeleton h-32" />
        </div>
        <div className="skeleton h-64 w-full mt-8" />
      </div>
    );
  }

  const categories = Object.entries(stats.categories || {}).sort((a, b) => b[1] - a[1]);
  const maxCat = categories.length ? categories[0][1] : 1;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      {/* Header */}
      <span className="label-kicker anim-fade-in">Overview</span>
      <h1 className="text-4xl sm:text-5xl font-semibold text-[--ink] anim-fade-up" style={{ fontFamily: "Fraunces, serif" }}>
        Your impact at a glance
      </h1>

      {/* Stat tiles */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatTile label="Total scans" value={stats.total} accent="var(--ink-faint)" delay="0.05s" />
        <StatTile label="Recyclable" value={stats.recyclable} accent="var(--moss)" delay="0.13s" />
        <StatTile label="Hazardous" value={stats.hazardous} accent="var(--clay)" delay="0.21s" />
      </div>

      {/* Charts */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Donut card */}
        <div className="card p-8 anim-fade-up" style={{ animationDelay: "0.28s" }}>
          <span className="label-kicker">Split</span>
          <div className="mt-4 flex items-center gap-8 flex-wrap">
            <Donut recyclable={stats.recyclable} hazardous={stats.hazardous} />
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-[--moss]" />
                <span className="text-sm text-[--ink-soft]">Recyclable · {stats.recyclable}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-[--clay]" />
                <span className="text-sm text-[--ink-soft]">Hazardous · {stats.hazardous}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category bars card */}
        <div className="card p-8 anim-fade-up" style={{ animationDelay: "0.36s" }}>
          <span className="label-kicker">Categories</span>

          {categories.length === 0 ? (
            <p className="text-[--ink-faint] mt-4">
              Nothing analyzed yet — scan an item to populate your dashboard.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {categories.map(([name, count], i) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[--ink] font-medium">{name}</span>
                    <span className="text-[--ink-faint]">{count}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[--paper-soft] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[--moss]"
                      style={{
                        width: `${(count / maxCat) * 100}%`,
                        animation: `grow-w 0.9s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.1}s both`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!stats.total && !categories.length && (
            <div className="mt-6">
              <a href="/" className="btn-primary">Analyze your first item</a>
            </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default Dashboard;
