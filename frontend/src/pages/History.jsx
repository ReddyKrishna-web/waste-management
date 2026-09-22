import { useEffect, useState } from "react";
import api from "../services/api";

/* Map category names to dot colors */
const CATEGORY_COLORS = {
  plastic: "var(--sun)",
  paper: "var(--sun)",
  organic: "var(--moss)",
  glass: "var(--sky)",
  metal: "var(--ink-faint)",
  "e-waste": "var(--clay)",
  hazardous: "var(--clay)",
  general: "var(--ink-faint)",
  unknown: "var(--ink-faint)",
};

function categoryColor(cat) {
  const key = (cat || "").toLowerCase();
  for (const k in CATEGORY_COLORS) {
    if (key.includes(k)) return CATEGORY_COLORS[k];
  }
  return "var(--ink-faint)";
}

function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/history")
      .then((res) => setHistory(res.data))
      .catch(() => setError("Could not load history. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <span className="label-kicker anim-fade-in">Archive</span>
      <h1 className="text-4xl sm:text-5xl font-semibold anim-fade-up" style={{ fontFamily: "Fraunces, serif" }}>
        Past analyses
      </h1>

      {error && (
        <p className="mt-8 text-red-700 bg-red-50 border border-red-200 rounded-2xl p-5 anim-fade-up">
          {error}
        </p>
      )}

      {loading && (
        <div className="mt-10 space-y-4">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
      )}

      {!loading && history.length === 0 && !error && (
        <div className="mt-10 card p-10 text-center anim-fade-up">
          <p className="text-[--ink-faint]">Nothing analyzed yet.</p>
          <a href="/" className="btn-primary mt-6">Analyze your first item</a>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="relative mt-12 pl-8">
          {/* vertical timeline line */}
          <span className="absolute left-[7px] top-2 bottom-2 w-px bg-[--line]" />

          {history.map((h, index) => {
            const r = h.result || {};
            const color = categoryColor(r.category);
            return (
              <div
                key={index}
                className="relative mb-6 anim-fade-up"
                style={{ animationDelay: `${index * 0.09}s` }}
              >
                {/* timeline dot */}
                <span
                  className="absolute -left-8 top-6 h-[15px] w-[15px] rounded-full border-2 border-[--paper] shadow"
                  style={{ background: color }}
                />
                <div className="card p-6 transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold text-[--ink]" style={{ fontFamily: "Fraunces, serif" }}>
                      {h.item}
                    </h3>
                    {r.category && (
                      <span className="chip shrink-0">
                        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                        {r.category}
                      </span>
                    )}
                  </div>

                  {r && (
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[--ink-soft]">
                      <span>
                        <strong className="text-[--ink] font-medium">Recyclable:</strong>{" "}
                        {r.recyclable || "—"}
                      </span>
                      <span>
                        <strong className="text-[--ink] font-medium">Hazard:</strong>{" "}
                        {r.hazard || "—"}
                      </span>
                    </div>
                  )}

                  {r.ecoSuggestion && (
                    <p className="mt-3 text-sm text-[--ink-faint] leading-relaxed border-l-2 border-[--moss]/25 pl-3">
                      {r.ecoSuggestion}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default History;
