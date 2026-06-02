import { useEffect, useRef, useState } from "react"
import { getCategoryStyle } from "../utils/categoryStyles"

export default function MapScreen({ places, userLocation, onSelectPlace, onBack }) {
  const mapRef      = useRef(null)
  const mapInst     = useRef(null)
  const routeLayer  = useRef(null)
  const [activePlace,   setActivePlace]   = useState(null)
  const [routeShown,    setRouteShown]    = useState(false)
  const [routeLoading,  setRouteLoading]  = useState(false)

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

    // Blue pulsing user dot
    const userIcon = L.divIcon({
      className: "",
      html: `<div class="loc-dot"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    })
    L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div style="color:#fff;font-weight:600;font-size:13px">📍 You are here</div>')

    // Green teardrop place markers
    places.forEach(place => {
      const style = getCategoryStyle(place.category)
      const placeIcon = L.divIcon({
        className: "",
        html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:#1a2a1a;border:2px solid #4a9e14;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.5);cursor:pointer;">
          <span style="transform:rotate(45deg);font-size:15px;line-height:1">${style.icon}</span>
        </div>`,
        iconSize: [36, 36], iconAnchor: [18, 36],
      })
      const marker = L.marker([place.lat, place.lng], { icon: placeIcon }).addTo(map)
      marker.on("click", () => {
        // Clear any existing route when switching places
        if (routeLayer.current) { map.removeLayer(routeLayer.current); routeLayer.current = null }
        setRouteShown(false)
        setActivePlace(place)
        // Pan map to show the place nicely
        map.panTo([place.lat, place.lng], { animate: true, duration: 0.5 })
      })
    })

    mapInst.current = map
    return () => { map.remove(); mapInst.current = null }
  }, [])

  // Clear route when active place changes
  useEffect(() => {
    setRouteShown(false)
  }, [activePlace?.id])

  async function showShortestPath() {
    if (!activePlace || !mapInst.current) return
    const map = mapInst.current
    const L   = window.L

    // Remove old route
    if (routeLayer.current) { map.removeLayer(routeLayer.current); routeLayer.current = null }

    setRouteLoading(true)
    try {
      // OSRM — free routing, no API key needed
      const url = `https://router.project-osrm.org/route/v1/driving/` +
        `${userLocation.lng},${userLocation.lat};${activePlace.lng},${activePlace.lat}` +
        `?overview=full&geometries=geojson`

      const res  = await fetch(url)
      const data = await res.json()

      if (data.code === "Ok" && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
        routeLayer.current = L.polyline(coords, {
          color: "#4a9e14", weight: 4, opacity: 0.85, lineJoin: "round",
        }).addTo(map)

        // Fit map to show full route
        map.fitBounds(routeLayer.current.getBounds(), { padding: [60, 60] })
        setRouteShown(true)
      } else {
        throw new Error("No route found")
      }
    } catch {
      // Fallback: straight dashed line
      routeLayer.current = L.polyline(
        [[userLocation.lat, userLocation.lng], [activePlace.lat, activePlace.lng]],
        { color: "#4a9e14", weight: 3, dashArray: "8,10", opacity: 0.75 }
      ).addTo(map)
      map.fitBounds(routeLayer.current.getBounds(), { padding: [60, 60] })
      setRouteShown(true)
    }
    setRouteLoading(false)
  }

  function closeCard() {
    if (routeLayer.current && mapInst.current) {
      mapInst.current.removeLayer(routeLayer.current)
      routeLayer.current = null
    }
    setRouteShown(false)
    setActivePlace(null)
  }

  const style = activePlace ? getCategoryStyle(activePlace.category) : null

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0f1410", position: "relative" }}>

      {/* Header */}
      <div style={{
        padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(15,20,16,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 200,
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
        padding: "7px 16px", display: "flex", alignItems: "center", gap: 16,
        background: "rgba(15,20,16,0.75)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 11,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", border: "2px solid #fff" }} />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>You</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a2a1a", border: "2px solid #4a9e14" }} />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Place</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 20, height: 3, background: "#4a9e14", borderRadius: 2 }} />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Route</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.25)", marginLeft: "auto", fontSize: 10 }}>
          Tap any 🌿 marker
        </span>
      </div>

      {/* Map fills remaining space */}
      <div ref={mapRef} style={{ flex: 1 }} />

      {/* ── Place detail card (slide up on marker tap) ── */}
      {activePlace && (
        <div
          className="slide-up"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 400,
            background: "rgba(13,18,13,0.97)", backdropFilter: "blur(24px)",
            border: "1px solid rgba(74,158,20,0.25)", borderBottom: "none",
            borderRadius: "22px 22px 0 0",
            padding: "18px 18px 32px",
          }}
        >
          {/* Drag handle */}
          <div style={{ width: 36, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.12)", margin: "0 auto 18px" }} />

          {/* Place header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 15, flexShrink: 0,
              background: "rgba(74,158,20,0.14)", border: "1px solid rgba(74,158,20,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>
              {style.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "'Syne',sans-serif", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activePlace.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.4)" }}>📍 {activePlace.distance.toFixed(1)} km away</span>
                <span style={{ background: "rgba(74,158,20,0.12)", border: "1px solid rgba(74,158,20,0.25)", color: "#86efac", borderRadius: 7, padding: "1px 8px", fontSize: 11, fontWeight: 500 }}>
                  {style.label}
                </span>
              </div>
            </div>
            {/* Close */}
            <button onClick={closeCard} style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>×</button>
          </div>

          {/* Quick stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[
              { label: "Distance", value: activePlace.distance.toFixed(1) + " km" },
              { label: "Budget",   value: activePlace.budget, green: true },
              { label: "Best time",value: activePlace.bestTime, small: true },
            ].map(item => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "10px 10px",
              }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: item.small ? 10 : 13, fontWeight: 600, color: item.green ? "#86efac" : "#fff", lineHeight: 1.3 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.6, marginBottom: 16 }}>
            {activePlace.description}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            {/* Show shortest path */}
            <button
              onClick={showShortestPath}
              disabled={routeLoading}
              style={{
                flex: 1, padding: "12px 10px", borderRadius: 14,
                border: `1px solid ${routeShown ? "rgba(74,158,20,0.5)" : "rgba(74,158,20,0.3)"}`,
                background: routeShown ? "rgba(74,158,20,0.2)" : "rgba(74,158,20,0.08)",
                color: routeShown ? "#86efac" : "rgba(255,255,255,0.6)",
                fontSize: 12, fontWeight: 500, cursor: routeLoading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                transition: "all 0.2s",
              }}
            >
              {routeLoading
                ? <><div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(74,158,20,0.3)", borderTopColor: "#4a9e14", animation: "spin 0.7s linear infinite" }} /> Finding…</>
                : routeShown
                  ? <>✅ Route shown</>
                  : <>🗺️ Shortest path</>
              }
            </button>

            {/* Show details */}
            <button
              onClick={() => onSelectPlace(activePlace)}
              style={{
                flex: 1, padding: "12px 10px", borderRadius: 14,
                background: "linear-gradient(135deg, #2d5a0e 0%, #4a9e14 100%)",
                border: "none", color: "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                boxShadow: "0 4px 16px rgba(74,158,20,0.3)",
              }}
            >
              📋 Show details
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
