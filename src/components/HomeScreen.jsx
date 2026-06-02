import { useState, useEffect, useRef } from "react"
import { CATEGORIES, RADII, BUDGETS } from "../data/places"

const PLACE_PREVIEWS = [
  { name: "Dhanmondi Lake",        emoji: "🌿", cat: "Park",       dist: "0.3 km" },
  { name: "North End Coffee",      emoji: "☕", cat: "Café",       dist: "1.7 km" },
  { name: "Hatirjheel Lake",       emoji: "🌊", cat: "Park",       dist: "2.4 km" },
  { name: "Bashundhara City",      emoji: "🛍️", cat: "Mall",       dist: "3.1 km" },
  { name: "Mirpur Botanical Garden",emoji: "🌳", cat: "Park",      dist: "3.8 km" },
]

export default function HomeScreen({ onSearch }) {
  const [locationStatus, setLocationStatus] = useState("idle")
  const [userLocation, setUserLocation]     = useState(null)
  const [locationName, setLocationName]     = useState("")
  const [selectedCats, setSelectedCats]     = useState([])
  const [selectedRadius, setSelectedRadius] = useState(5)
  const [selectedBudgetMax, setSelectedBudgetMax] = useState(Infinity)
  const [previewIdx, setPreviewIdx]         = useState(0)
  const mapRef   = useRef(null)
  const mapInst  = useRef(null)
  const markerRef = useRef(null)

  // Cycle preview cards
  useEffect(() => {
    const t = setInterval(() => setPreviewIdx(i => (i + 1) % PLACE_PREVIEWS.length), 2500)
    return () => clearInterval(t)
  }, [])

  // Init mini map after location granted
  useEffect(() => {
    if (locationStatus !== "granted" && locationStatus !== "denied") return
    if (!userLocation || !mapRef.current) return
    const L = window.L; if (!L) return
    if (mapInst.current) { mapInst.current.remove(); mapInst.current = null }

    const map = L.map(mapRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      attributionControl: false,
    })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map)

    // Pulsing user location marker
    const icon = L.divIcon({
      className: "",
      html: `<div class="loc-dot"></div>`,
      iconSize: [14, 14], iconAnchor: [7, 7],
    })
    markerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(map)
    mapInst.current = map
    return () => { map.remove(); mapInst.current = null }
  }, [locationStatus, userLocation])

  async function detectLocation() {
    if (!navigator.geolocation) { alert("Geolocation not supported. Try Chrome."); return }
    setLocationStatus("loading")
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setUserLocation({ lat, lng })
        setLocationStatus("granted")
        // Reverse geocode with Nominatim (free, no key)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { "Accept-Language": "en" } }
          )
          const data = await res.json()
          const parts = [
            data.address?.suburb || data.address?.neighbourhood || data.address?.town,
            data.address?.city || data.address?.county,
          ].filter(Boolean)
          setLocationName(parts.join(", ") || "Dhaka")
        } catch { setLocationName("Dhaka") }
      },
      () => {
        setUserLocation({ lat: 23.7461, lng: 90.3742 })
        setLocationStatus("denied")
        setLocationName("Dhanmondi, Dhaka (default)")
      }
    )
  }

  function toggleCategory(catId) {
    setSelectedCats(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  function handleSearch() {
    onSearch({ userLocation, radiusKm: selectedRadius, categories: selectedCats, budgetMax: selectedBudgetMax })
  }

  const filtersVisible = locationStatus === "granted" || locationStatus === "denied"
  const preview = PLACE_PREVIEWS[previewIdx]

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0f1410" }}>

      {/* ── Hero ── */}
      <div className="hero-gradient px-5 pt-10 pb-8" style={{ minHeight: 260 }}>
        <div className="dots-bg" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "#4a9e14" }}>
              Dhaka, Bangladesh
            </span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4a9e14", display: "inline-block" }} />
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.5px" }}>
            Find your next<br />
            <span style={{ color: "#4a9e14" }}>hangout</span> spot
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: 20 }}>
            Discover parks, cafes, restaurants and hidden gems near you in seconds.
          </p>

          {/* Animated preview card */}
          <div key={previewIdx} className="glass slide-up" style={{ borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 26, width: 44, height: 44, borderRadius: 12, background: "rgba(74,158,20,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {preview.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{preview.cat} · {preview.dist}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#4a9e14", background: "rgba(74,158,20,0.1)", border: "1px solid rgba(74,158,20,0.25)", borderRadius: 20, padding: "3px 10px" }}>
              Nearby ✦
            </div>
          </div>

          {/* Location button */}
          {locationStatus === "idle" && (
            <button onClick={detectLocation} className="btn-primary" style={{ width: "100%", padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>📍</span>
              Use my location
            </button>
          )}
          {locationStatus === "loading" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(74,158,20,0.3)", borderTopColor: "#4a9e14", animation: "spin 0.8s linear infinite" }} />
              Detecting your location…
            </div>
          )}
          {(locationStatus === "granted" || locationStatus === "denied") && (
            <div style={{ background: "rgba(74,158,20,0.1)", border: "1px solid rgba(74,158,20,0.3)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#86efac" }}>
                  {locationStatus === "denied" ? "Using default location" : "Location found"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{locationName}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini map */}
      {filtersVisible && (
        <div style={{ height: 140, margin: "0 0 0 0", position: "relative" }}>
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
          <div style={{ position: "absolute", bottom: 8, left: 12, zIndex: 500, background: "rgba(15,20,16,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(74,158,20,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 500, color: "#86efac" }}>
            📍 {locationName}
          </div>
        </div>
      )}

      {/* ── Filters ── */}
      {filtersVisible && (
        <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 24, background: "#0f1410", flex: 1 }}>

          {/* Categories */}
          <div>
            <div className="section-heading">What are you looking for?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`cat-chip ${selectedCats.includes(cat.id) ? "selected" : ""}`}
                >
                  <div className="chip-check">✓</div>
                  <span className="chip-icon">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
            {selectedCats.length === 0 && (
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 8, textAlign: "center" }}>
                No selection = show all categories
              </p>
            )}
          </div>

          {/* Radius */}
          <div>
            <div className="section-heading">How far will you travel?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {RADII.map(r => (
                <button key={r} onClick={() => setSelectedRadius(r)} className={`pill-btn ${selectedRadius === r ? "selected" : ""}`}>
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <div className="section-heading">Budget</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {BUDGETS.map(b => (
                <button key={b.label} onClick={() => setSelectedBudgetMax(b.max)} className={`pill-btn ${selectedBudgetMax === b.max ? "selected" : ""}`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Find button */}
          <button onClick={handleSearch} className="btn-primary" style={{ width: "100%", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔍</span>
            Find places
            <span style={{ marginLeft: 4 }}>→</span>
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
