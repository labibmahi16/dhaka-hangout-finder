import { useEffect, useRef } from "react"
import { getCategoryStyle } from "../utils/categoryStyles"

// Icons for the "Why go here?" tags
const TAG_ICONS = {
  Friends: "👥", Family: "👨‍👩‍👧", Couples: "💑", Solo: "🧘",
  Walking: "🚶", Photography: "📸", Coffee: "☕", Shopping: "🛍️",
  Study: "📚", "Date night": "🌙", Dining: "🍽️", Adda: "💬",
  Cycling: "🚴", "Remote work": "💻", Work: "💻", Chill: "😌",
  Breakfast: "🌅", History: "🏛️", Nature: "🌿", Picnic: "🧺",
  Jogging: "🏃", Art: "🎨", Reading: "📖",
}

export default function DetailScreen({ place, onBack }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const style = getCategoryStyle(place.category)

  // Facilities list
  const facilities = [
    { label: "Food nearby",  key: "food",         icon: "🍴" },
    { label: "Seating",      key: "seating",      icon: "🪑" },
    { label: "Photography",  key: "photography",  icon: "📸" },
    { label: "Parking",      key: "parking",      icon: "🅿️" },
  ]

  // All "why go" tags = bestFor + top 3 activities
  const whyTags = [...place.bestFor, ...place.activities.slice(0, 3)]

  // Build a Leaflet map after mount
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    // Leaflet is loaded via CDN in index.html; access global L
    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [place.lat, place.lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const marker = L.marker([place.lat, place.lng])
    marker.addTo(map).bindPopup(`<strong>${place.name}</strong>`).openPopup()

    mapInstanceRef.current = map
    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [place])

  function openGoogleMaps() {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`,
      "_blank"
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-700 text-xl leading-none flex-shrink-0"
        >
          ←
        </button>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${style.bg}`}>
          {style.icon}
        </div>
        <div className="min-w-0">
          <h2 className="font-syne font-extrabold text-xl text-gray-900 leading-tight truncate">
            {place.name}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {place.distance.toFixed(1)} km away · {style.label}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">{place.description}</p>

        {/* Why go here */}
        <div className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${style.text}`}>
            Why go here?
          </p>
          <div className="flex flex-wrap gap-2">
            {whyTags.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-white border border-white/80 rounded-full px-3 py-1 text-xs font-medium text-gray-700"
              >
                <span>{TAG_ICONS[tag] || "✓"}</span>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-gray-50 rounded-xl p-3.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Distance</p>
            <p className="font-syne font-bold text-gray-900">{place.distance.toFixed(1)} km</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3.5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Budget</p>
            <p className="font-syne font-bold text-gray-900">{place.budget}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3.5 col-span-2">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Best visiting time</p>
            <p className="font-syne font-bold text-gray-900">{place.bestTime}</p>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Facilities</p>
          <div className="grid grid-cols-2 gap-2">
            {facilities.map(f => (
              <div
                key={f.key}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm border
                  ${place.facilities[f.key]
                    ? "bg-teal-50 border-teal-100 text-teal-800"
                    : "bg-gray-50 border-gray-100 text-gray-400 line-through"
                  }`}
              >
                <span>{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Location</p>
          <div ref={mapRef} className="map-container" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-6">
          <button
            onClick={onBack}
            className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            ← All results
          </button>
          <button
            onClick={openGoogleMaps}
            className="flex-2 bg-brand-600 text-white py-3 px-5 rounded-xl font-syne font-bold text-sm hover:bg-brand-800 transition-colors"
            style={{ flex: 2 }}
          >
            📍 Get directions
          </button>
        </div>
      </div>
    </div>
  )
}
