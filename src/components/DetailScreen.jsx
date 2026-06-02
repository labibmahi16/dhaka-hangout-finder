import { useEffect, useRef } from "react"
import { getCategoryStyle } from "../utils/categoryStyles"

const TAG_ICONS = {
  Friends:"👥", Family:"👨‍👩‍👧", Couples:"💑", Solo:"🧘",
  Walking:"🚶", Photography:"📸", Coffee:"☕", Shopping:"🛍️",
  Study:"📚","Date night":"🌙", Dining:"🍽️", Adda:"💬",
  Cycling:"🚴","Remote work":"💻", Work:"💻", Chill:"😌",
  Breakfast:"🌅", History:"🏛️", Nature:"🌿", Picnic:"🧺",
  Jogging:"🏃", Art:"🎨", Reading:"📖", Rides:"🎢", Games:"🎮",
  "Fine dining":"🍷","Local food":"🫕","Group meal":"👨‍👩‍👦",
}

const FAC = [
  { label: "Food nearby", key: "food",        icon: "🍴" },
  { label: "Seating",     key: "seating",      icon: "🪑" },
  { label: "Photography", key: "photography",  icon: "📸" },
  { label: "Parking",     key: "parking",      icon: "🅿️" },
]

export default function DetailScreen({ place, onBack }) {
  const mapRef    = useRef(null)
  const mapInst   = useRef(null)
  const style     = getCategoryStyle(place.category)
  const whyTags   = [...place.bestFor, ...place.activities.slice(0, 4)]

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return
    const L = window.L; if (!L) return
    const map = L.map(mapRef.current, {
      center: [place.lat, place.lng],
      zoom: 15, zoomControl: false, scrollWheelZoom: false,
    })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map)
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#1a2a1a;border:2px solid #4a9e14;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.5)"><span style="transform:rotate(45deg);font-size:15px">${style.icon}</span></div>`,
      iconSize: [36, 36], iconAnchor: [18, 36],
    })
    L.marker([place.lat, place.lng], { icon }).addTo(map)
      .bindPopup(`<strong style="color:#fff">${place.name}</strong>`).openPopup()
    mapInst.current = map
    return () => { map.remove(); mapInst.current = null }
  }, [place])

  function openNav() {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, "_blank")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#0f1410" }}>

      {/* Header */}
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
        background: "rgba(15,20,16,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, width: 34, height: 34, color: "rgba(255,255,255,0.6)", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          ←
        </button>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(74,158,20,0.15)", border: "1px solid rgba(74,158,20,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {style.icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: "'Syne',sans-serif", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {place.name}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 3, display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍 {place.distance.toFixed(1)} km away</span>
            <span style={{ color: "#4a9e14" }}>·</span>
            <span style={{ color: "#86efac", background: "rgba(74,158,20,0.1)", border: "1px solid rgba(74,158,20,0.2)", borderRadius: 6, padding: "1px 7px" }}>{style.label}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Description */}
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0 }}>
          {place.description}
        </p>

        {/* Why go here */}
        <div style={{ background: "rgba(74,158,20,0.08)", border: "1px solid rgba(74,158,20,0.2)", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#4a9e14", marginBottom: 12 }}>
            Why go here?
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {whyTags.map(tag => (
              <span key={tag} className="why-tag">
                {TAG_ICONS[tag] || "✓"} {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="stat-card">
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Distance</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif" }}>{place.distance.toFixed(1)} km</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Budget</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#86efac", fontFamily: "'Syne',sans-serif" }}>{place.budget}</div>
          </div>
          <div className="stat-card" style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>Best visiting time</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>🕐 {place.bestTime}</div>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <div className="section-heading">Facilities</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {FAC.map(f => (
              <div key={f.key} className={`fac-pill ${place.facilities[f.key] ? "fac-yes" : "fac-no"}`}>
                <span style={{ fontSize: 15 }}>{f.icon}</span> {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <div className="section-heading">Location</div>
          <div ref={mapRef} className="map-detail" />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, paddingBottom: 24 }}>
          <button onClick={onBack} style={{
            flex: 1, padding: 13, borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            ← All results
          </button>
          <button onClick={openNav} className="btn-primary" style={{
            flex: 2, padding: 13, fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            📍 Get directions
          </button>
        </div>
      </div>
    </div>
  )
}
