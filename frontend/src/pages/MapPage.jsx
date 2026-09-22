import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/api";

// Vite bundling breaks Leaflet's default icon URLs; restore them explicitly.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* Small inline leaf accent */
function LeafMark({ size = 20, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function MapPage() {
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/centers")
      .then((res) => setCenters(res.data))
      .catch(() =>
        setError("Could not load centers. Is the backend running on port 5000?")
      );
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <span className="label-kicker anim-fade-in">Find us</span>
      <h1 className="text-4xl sm:text-5xl font-semibold anim-fade-up" style={{ fontFamily: "Fraunces, serif" }}>
        Collection centers near you
      </h1>
      <p className="mt-4 text-[--ink-soft] max-w-lg anim-fade-up" style={{ animationDelay: "0.08s" }}>
        Drop-off points for recyclables, e-waste, and organic material — tap a
        marker for details.
      </p>

      {error && (
        <p className="mt-8 text-red-700 bg-red-50 border border-red-200 rounded-2xl p-5 anim-fade-up">
          {error}
        </p>
      )}

      {/* Framed map card */}
      <div className="card mt-10 overflow-hidden anim-fade-up" style={{ animationDelay: "0.15s" }}>
        <MapContainer
          center={[13.6288, 79.4192]}
          zoom={13}
          style={{ height: "560px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {centers.map((c, index) => (
            <Marker key={index} position={[c.lat, c.lng]}>
              <Popup>
                <div style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  <strong>{c.name}</strong>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend / list chips */}
      <div className="mt-6 flex flex-wrap gap-2.5 anim-fade-up" style={{ animationDelay: "0.25s" }}>
        {centers.map((c, index) => (
          <span key={index} className="chip">
            <LeafMark size={14} className="text-[--moss]" />
            {c.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default MapPage;
