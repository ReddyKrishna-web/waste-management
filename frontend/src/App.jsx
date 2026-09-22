import { BrowserRouter, Routes, Route, useLocation, NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import MapPage from "./pages/MapPage.jsx";

/* ---------- Decorative botanical leaf (inline SVG, no icon lib needed) ---------- */
function LeafMark({ className = "", size = 22 }) {
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
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 21V9M12 13.5c1.8-.6 3-2 3.4-3.9M12 16.5c-1.8-.6-3-2-3.4-3.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Minimal wordmark ---------- */
function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <span className="text-[--moss] transition-transform duration-500 group-hover:rotate-12">
        <LeafMark size={26} />
      </span>
      <span className="font-bold text-lg tracking-tight text-[--ink]" style={{ fontFamily: "Fraunces, serif" }}>
        WasteGuide
      </span>
      <span className="chip !py-0.5 !px-2 !text-[10px] uppercase tracking-widest">AI</span>
    </Link>
  );
}

/* ---------- Animated top scroll-progress bar ---------- */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (doc.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
      <div
        className="h-full bg-[--moss] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%`, borderRadius: "0 999px 999px 0" }}
      />
    </div>
  );
}

/* ---------- Sticky glass navigation ---------- */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Analyze" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/history", label: "History" },
    { to: "/map", label: "Map" },
  ];

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[--line] bg-[--paper]/80 px-5 py-3 shadow-[0_8px_30px_-18px_rgba(20,32,26,0.35)] backdrop-blur-md">
          <Wordmark />

          {/* Desktop links — always visible on sm and up */}
          <nav className="hidden sm:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <a href="#analyze" className="btn-primary !hidden md:!inline-flex !py-2.5 !px-5 text-sm">
            Start
          </a>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-[--line] bg-[--card]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className="block w-5 h-[2px] bg-[--ink] rounded transition-all duration-300"
              style={{ transform: menuOpen ? "translateY(6px) rotate(45deg)" : "none" }}
            />
            <span
              className="block w-5 h-[2px] bg-[--ink] rounded my-1 transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-[2px] bg-[--ink] rounded transition-all duration-300"
              style={{ transform: menuOpen ? "translateY(-6px) rotate(-45deg)" : "none" }}
            />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className="sm:hidden overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: menuOpen ? "260px" : "0px",
            opacity: menuOpen ? 1 : 0,
          }}
        >
          <nav className="mt-2 rounded-2xl border border-[--line] bg-[--paper]/95 backdrop-blur-md shadow-[0_16px_40px_-20px_rgba(20,32,26,0.4)] p-3 flex flex-col">
            {links.map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-[15px] transition-colors ${
                    isActive
                      ? "bg-[--moss-mist] text-[--moss-deep] font-semibold"
                      : "text-[--ink-soft] hover:bg-[--paper-soft]"
                  }`
                }
                style={{ animation: menuOpen ? `fade-up 0.35s ease ${i * 0.06}s both` : undefined }}
              >
                {l.label}
                <span className="text-[--ink-faint]">→</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="mt-24 border-t border-[--line]">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[--ink-faint]">
          <LeafMark size={18} className="anim-sway" />
          WasteGuide AI — sustainable disposal, beautifully guided
        </div>
        <div className="flex gap-5 text-sm text-[--ink-faint]">
          <a className="hover:text-[--moss] transition-colors" href="https://leafletjs.com" target="_blank" rel="noreferrer">OpenStreetMap data</a>
          <a className="hover:text-[--moss] transition-colors" href="https://groq.com" target="_blank" rel="noreferrer">Groq AI</a>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page transition wrapper ---------- */
function PageShell({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <main key={location.pathname} className="anim-fade-in min-h-[70vh]">
      {children}
    </main>
  );
}

/* ---------- Route map ---------- */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageShell>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </PageShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProgress />
      <Nav />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}
