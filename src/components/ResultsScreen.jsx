import { useState } from "react"
import { getCategoryStyle } from "../utils/categoryStyles"

export default function ResultsScreen({ places, filters, onSelectPlace, onBack, onShowMap }) {
  const [activeFilter, setActiveFilter] = useState("all")

  const categories = ["all", ...new Set(places.map(p => p.category))]
  const filtered = activeFilter === "all" ? places : places.filter(p => p.category === activeFilter)

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0f1410" }}>

      {/* Header */}
      <div style={{
        padding: "14px 16px", background: "rgba(15,20,16,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>Nearby Places</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
              {places.length} place{places.length !== 1 ? "s" : ""} within {filters.radiusKm} km
            </div>
          </div>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, padding: "7px 14px", color: "rgba(255,255,255,0.5)",
            fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
          }}>
            ← Back
          </button>
        </div>

        {/* View toggle + category filter row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Map toggle button */}
          <button onClick={onShowMap} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(74,158,20,0.12)", border: "1px solid rgba(74,158,20,0.3)",
            borderRadius: 10, padding: "7px 14px", color: "#86efac",
            fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}>
            🗺️ Map
          </button>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, flex: 1 }}>
            {categories.map(cat => {
              const style = cat === "all" ? null : getCategoryStyle(cat)
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    padding: "6px 14px", borderRadius: 20, whiteSpace: "nowrap",
                    border: `1px solid ${activeFilter === cat ? "rgba(74,158,20,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: activeFilter === cat ? "rgba(74,158,20,0.15)" : "rgba(255,255,255,0.03)",
                    color: activeFilter === cat ? "#86efac" : "rgba(255,255,255,0.4)",
                    fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}
                >
                  {cat === "all" ? "All" : (style?.icon + " " + style?.label)}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "60px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "'Syne',sans-serif" }}>No places found</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Try a wider radius or different filters</div>
          <button onClick={onBack} className="btn-primary" style={{ padding: "12px 28px" }}>Change filters</button>
        </div>
      )}

      {/* Place list */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((place, i) => {
          const style = getCategoryStyle(place.category)
          return (
            <button
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="place-card slide-up"
              style={{ width: "100%", textAlign: "left", animationDelay: `${i * 0.04}s` }}
            >
              {/* Icon */}
              <div style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                background: "rgba(74,158,20,0.1)", border: "1px solid rgba(74,158,20,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              }}>
                {style.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Syne',sans-serif" }}>
                  {place.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 3 }}>
                    📍 {place.distance.toFixed(1)} km
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 8,
                    background: "rgba(74,158,20,0.1)", color: "#86efac",
                    border: "1px solid rgba(74,158,20,0.2)",
                  }}>
                    {style.label}
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{
                  fontSize: 11, fontWeight: 500, color: "#5dcaa5",
                  background: "rgba(93,202,165,0.1)", border: "1px solid rgba(93,202,165,0.2)",
                  borderRadius: 8, padding: "3px 9px", whiteSpace: "nowrap", marginBottom: 6,
                }}>
                  {place.budget}
                </div>
                <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 16 }}>›</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Floating map button */}
      {places.length > 0 && (
        <div style={{ position: "sticky", bottom: 20, padding: "0 16px", zIndex: 40 }}>
          <button onClick={onShowMap} className="btn-primary" style={{
            width: "100%", padding: "14px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14,
          }}>
            🗺️ Show all {places.length} places on map
          </button>
        </div>
      )}
    </div>
  )
}
