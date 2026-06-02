import { useEffect, useRef, useState } from "react"
import { getCategoryStyle } from "../utils/categoryStyles"

export default function MapScreen({ places, userLocation, onSelectPlace, onBack }) {
  const mapRef    = useRef(null)
  const mapInst   = useRef(null)
  const routeLayer = useRef(null)
  const [activePlace, setActivePlace] = useState(null)

  useEffect(() => {
    if (!mapRef.current || mapInst.current) return
    const L = window.L; if (!L) return

    const map = L.map(mapRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 13,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org" style="color:#4a9e14">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // User location — blue pulsing dot
    const userIcon = L.divIcon({
      className: "",
      html: `<div class="loc-dot"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    })
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div style="color:#fff;font-weight:600;font-size:13px">📍 You are here</div>')

    // Place markers — green
    places.forEach(place => {
      const style = getCategoryStyle(place.category)
      const placeIcon = L.divIcon({
        className: "",
        html: `
          <div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:#1a2a1a;border:2px solid #4a9e14;
            transform:rotate(-45deg);
            display:flex;align-items:center;justify-content:center;
            box-shadow:0 4px 12px rgba(0,0,0,0.5);
            cursor:pointer;
          ">
            <span style="transform:rotate(45deg);font-size:15px;line-height:1">${style.icon}</span>
          </div>`,
        iconSize: [36, 36], iconAnchor: [18, 36],
      })

      const marker = L.marker([place.lat, place.lng], { icon: placeIcon }).addTo(map)
      marker.on("click", () => {
        setActivePlace(place)
        // Draw straight line from user to place
        if (routeLayer.current) { map.removeLayer(routeLayer.current) }
        routeLayer.current = L.polyline(
          [[userLocation.lat, userLocation.lng], [place.lat, place.lng]],
          { color: "#4a9e14", weight: 2.5, dashArray: "6,8", opacity: 0.8 }
        ).addTo(map)
        map.fitBounds(
          [[userLocation.lat, userLocation.lng], [place.lat, place.lng]],
          { padding: [40, 40] }
        )
      })
    })

    mapInst.current = map
    return () => { map.remove(); mapInst.current = null }
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0f1410" }}>
      {/* Header */}
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(15,20,16,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 200,
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>Map View</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
            {places.length} places · tap a marker to explore
          </div>
        </div>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10, padding: "7px 14px", color: "rgba(255,255,255,0.6)",
          fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
        }}>
          ← List
        </button>
      </div>

      {/* Legend */}
      <div style={{
        padding: "8px 16px", display: "flex", alignItems: "center", gap: 16,
        background: "rgba(15,20,16,0.7)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", border: "2px solid #fff" }} />
          <span style={{ color: "rgba(255,255,255,0.45)" }}>Your location</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a2a1a", border: "2px solid #4a9e14" }} />
          <span style={{ color: "rgba(255,255,255,0.45)" }}>Place</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 18, height: 2, background: "#4a9e14", borderRadius: 1, borderTop: "2px dashed #4a9e14" }} />
          <span style={{ color: "rgba(255,255,255,0.45)" }}>Route</span>
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} style={{ flex: 1 }} />

      {/* Active place popup */}
      {activePlace && (
        <div className="slide-up" style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 300,
          background: "rgba(15,20,16,0.96)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(74,158,20,0.3)", borderBottom: "none",
          borderRadius: "20px 20px 0 0", padding: "20px 18px 28px",
        }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: "rgba(74,158,20,0.15)", border: "1px solid rgba(74,158,20,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
            }}>
              {getCategoryStyle(activePlace.category).icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 3, fontFamily: "'Syne',sans-serif" }}>
                {activePlace.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                <span>📍 {activePlace.distance.toFixed(1)} km away</span>
                <span style={{ color: "#4a9e14", background: "rgba(74,158,20,0.1)", border: "1px solid rgba(74,158,20,0.2)", borderRadius: 6, padding: "1px 7px" }}>
                  {getCategoryStyle(activePlace.category).label}
                </span>
              </div>
            </div>
            <button onClick={() => setActivePlace(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, width: 30, height: 30, color: "rgba(255,255,255,0.4)", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>
              ×
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 14, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>Straight distance</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{activePlace.distance.toFixed(1)} km</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>Budget</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#86efac" }}>{activePlace.budget}</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 3 }}>Best time</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{activePlace.bestTime}</div>
            </div>
          </div>

          <button
            onClick={() => onSelectPlace(activePlace)}
            className="btn-primary"
            style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14 }}
          >
            <span>📋</span> Show full details
          </button>
        </div>
      )}
    </div>
  )
}
