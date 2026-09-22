import { useState } from "react";
import api from "../services/api";

/* ---------- Floating decorative blob (artistic, minimal) ---------- */
function Blob({ className, delay = "0s", tilt = "0deg" }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{ animationDelay: delay, "--tilt": tilt }}
    />
  );
}

/* ---------- Inline leaf used in the hero ---------- */
function HeroLeaf({ className, size = 120 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21C12 21 4.5 17 4.5 10.2 4.5 5.6 8.2 3 12 3s7.5 2.6 7.5 7.2C19.5 17 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path
        d="M12 21V9M12 13.5c1.8-.6 3-2 3.4-3.9M12 16.5c-1.8-.6-3-2-3.4-3.9"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Loading skeleton for the result card ---------- */
function ResultSkeleton() {
  return (
    <div className="card mt-10 p-8 anim-fade-in">
      <div className="skeleton h-9 w-56 mb-6" />
      <div className="grid grid-cols-2 gap-4">
        <div className="skeleton h-20" />
        <div className="skeleton h-20" />
      </div>
      <div className="skeleton h-24 w-full mt-6" />
      <div className="skeleton h-4 w-3/4 mt-6" />
      <div className="skeleton h-4 w-2/3 mt-3" />
    </div>
  );
}

/* ---------- Badge color per hazard text ---------- */
function hazardTone(hazard) {
  const h = (hazard || "").toLowerCase();
  if (!h || h === "none" || h === "no") return { cls: "bg-[--moss-mist] text-[--moss-deep]", dot: "bg-[--moss]" };
  if (h.includes("high") || h.includes("toxic") || h.includes("danger")) return { cls: "bg-[--clay-mist] text-[#8f3d1f]", dot: "bg-[--clay]" };
  return { cls: "bg-[--sun-mist] text-[#8a6414]", dot: "bg-[--sun]" };
}

function Home() {
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (item.trim() === "" || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await api.post("/api/analyze", { item });
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Could not reach the server. Is the backend running on port 5000?"
      );
    } finally {
      setLoading(false);
    }
  };

  const tone = hazardTone(result?.hazard);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <Blob className="w-[420px] h-[420px] bg-[--moss-mist] blur-3xl -top-40 -left-32 opacity-70" />
        <Blob className="w-[300px] h-[300px] bg-[--sun-mist] blur-3xl top-10 -right-24 opacity-80" delay="1.2s" />
        <Blob className="w-[220px] h-[220px] bg-[--clay-mist] blur-3xl bottom-0 left-1/3 opacity-60" delay="2.4s" />

        <HeroLeaf className="absolute top-24 right-[12%] text-[--moss]/30 anim-float" size={110} />
        <HeroLeaf className="absolute bottom-10 left-[8%] text-[--clay]/25 anim-float" size={70} delay="2s" tilt="14deg" />

        <div className="relative mx-auto max-w-3xl px-5 pt-24 pb-16 text-center">
          <span className="chip anim-fade-up">
            <span className="w-2 h-2 rounded-full bg-[--moss] anim-pulse-soft" />
            AI powered waste intelligence
          </span>

          <h1
            className="mt-7 text-5xl sm:text-6xl md:text-7xl leading-[1.02] font-semibold text-[--ink] anim-fade-up"
            style={{ animationDelay: "0.08s", fontFamily: "Fraunces, serif" }}
          >
            Give your waste
            <br />
            a{" "}
            <span className="relative inline-block text-[--moss] italic">
              second life
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 8.5C50 3.5 150 3.5 197 8.5"
                  stroke="var(--sun)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{
                    animation: "draw-line 1s cubic-bezier(0.22,1,0.36,1) 0.5s both",
                    transformOrigin: "left",
                  }}
                />
              </svg>
            </span>
          </h1>

          <p
            className="mt-7 text-lg text-[--ink-soft] max-w-xl mx-auto anim-fade-up"
            style={{ animationDelay: "0.16s" }}
          >
            Type any everyday item and get instant, mindful guidance on how to
            recycle, reuse, or safely let it go.
          </p>

          {/* ================= SEARCH ================= */}
          <div id="analyze" className="mt-12 anim-fade-up" style={{ animationDelay: "0.24s" }}>
            <div className="relative max-w-xl mx-auto">
              <input
                className="input-pill pr-40 text-left shadow-[0_16px_40px_-24px_rgba(20,32,26,0.35)]"
                placeholder="e.g. plastic water bottle…"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                aria-label="Waste item"
              />
              <button
                onClick={analyze}
                disabled={loading}
                className="btn-primary absolute right-2 top-1/2 -translate-y-1/2 !py-2.5 !px-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 anim-spin-slow" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,.35)" strokeWidth="3" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Thinking
                  </span>
                ) : (
                  "Analyze"
                )}
              </button>
            </div>

            {/* Suggestion chips */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Plastic bottle", "Old batteries", "Pizza box", "Glass jar"].map((s, i) => (
                <button
                  key={s}
                  onClick={() => setItem(s)}
                  className="chip hover:border-[--moss] hover:text-[--moss] hover:-translate-y-0.5 transition-all duration-200 anim-fade-up"
                  style={{ animationDelay: `${0.3 + i * 0.07}s` }}
                >
                  {s}
                </button>
              ))}
            </div>

            {error && (
              <p className="mt-6 inline-block text-red-700 bg-red-50 border border-red-200 rounded-full px-5 py-2.5 text-sm anim-fade-up">
                {error}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ================= RESULT ================= */}
      <section className="mx-auto max-w-3xl px-5 pb-10">
        {loading && <ResultSkeleton />}

        {result && (
          <div className="card mt-6 p-8 sm:p-10 anim-fade-up relative overflow-hidden">
            {/* corner leaf watermark */}
            <HeroLeaf
              className="absolute -top-6 -right-6 text-[--moss]/10"
              size={150}
            />

            <span className="label-kicker">Analysis result</span>

            <h2 className="text-4xl font-semibold text-[--ink]" style={{ fontFamily: "Fraunces, serif" }}>
              {result.category || "Unknown"}
            </h2>

            {/* meta badges */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className={`chip ${tone.cls} border-transparent`}>
                <span className={`w-2 h-2 rounded-full ${tone.dot}`} />
                {result.recyclable === "Yes" ? "Recyclable" : result.recyclable === "No" ? "Not recyclable" : "Recyclability unknown"}
              </span>
              <span className="chip">
                <span className="w-2 h-2 rounded-full bg-[--ink-faint]" />
                Hazard: {result.hazard || "None"}
              </span>
            </div>

            {/* eco suggestion */}
            <div className="mt-8 rounded-2xl bg-[--moss-mist]/60 border border-[--moss]/15 p-5">
              <span className="label-kicker !mb-2">Eco suggestion</span>
              <p className="text-[--ink] leading-relaxed">{result.ecoSuggestion}</p>
            </div>

            {/* instructions */}
            <div className="mt-8">
              <span className="label-kicker">Disposal steps</span>
              <ol className="mt-2 space-y-3">
                {result.instructions?.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 anim-fade-up"
                    style={{ animationDelay: `${0.15 + index * 0.12}s` }}
                  >
                    <span
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[--moss]/30 bg-[--moss]/10 text-sm font-semibold text-[--moss-deep]"
                    >
                      {index + 1}
                    </span>
                    <span className="pt-1 text-[--ink-soft] leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
