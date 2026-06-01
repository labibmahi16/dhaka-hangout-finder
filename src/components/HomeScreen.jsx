import { useState } from "react"
import { CATEGORIES, RADII, BUDGETS } from "../data/places"

export default function HomeScreen({ onSearch }) {
  const [locationStatus, setLocationStatus] = useState("idle") // idle | loading | granted | denied
  const [userLocation, setUserLocation] = useState(null)
  const [selectedCats, setSelectedCats] = useState([])
  const [selectedRadius, setSelectedRadius] = useState(5)
  const [selectedBudgetMax, setSelectedBudgetMax] = useState(Infinity)

  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Your browser doesn't support location. Try Chrome or Firefox.")
      return
    }
    setLocationStatus("loading")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationStatus("granted")
      },
      () => {
        // Fallback: use BRACU coordinates so the app still works
        setUserLocation({ lat: 23.7461, lng: 90.3742 })
        setLocationStatus("denied")
      }
    )
  }

  function toggleCategory(catId) {
    setSelectedCats(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    )
  }

  function handleSearch() {
    onSearch({
      userLocation,
      radiusKm: selectedRadius,
      categories: selectedCats,      // empty = all categories
      budgetMax: selectedBudgetMax,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <div className="px-5 pt-10 pb-7 bg-white border-b border-gray-100">
        <p className="text-xs font-medium tracking-widest text-brand-600 uppercase mb-2">
          Dhaka, Bangladesh
        </p>
        <h1 className="font-syne text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-2">
          Find your next<br />hangout spot
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Parks, cafes, restaurants and more — filtered by your location and budget.
        </p>

        {locationStatus === "idle" && (
          <button
            onClick={detectLocation}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            📍 Use my location
          </button>
        )}

        {locationStatus === "loading" && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="animate-spin">⏳</span> Getting your location…
          </div>
        )}

        {locationStatus === "granted" && (
          <div className="flex items-center gap-2 text-sm text-brand-600 font-medium">
            ✅ Location found — Dhaka
          </div>
        )}

        {locationStatus === "denied" && (
          <div className="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
            ⚠️ Location blocked — using Dhanmondi as default. You can still browse.
          </div>
        )}
      </div>

      {/* Filters — only shown after location step */}
      {(locationStatus === "granted" || locationStatus === "denied") && (
        <div className="px-5 py-6 flex flex-col gap-6 flex-1 bg-gray-50">

          {/* Category filter */}
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
              What are you looking for?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all
                    ${selectedCats.includes(cat.id)
                      ? "bg-brand-50 border-green-300 text-green-800"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
            {selectedCats.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">No selection = show all categories</p>
            )}
          </div>

          {/* Radius filter */}
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
              How far will you travel?
            </p>
            <div className="flex flex-wrap gap-2">
              {RADII.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRadius(r)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all
                    ${selectedRadius === r
                      ? "bg-brand-50 border-green-300 text-green-800 font-semibold"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Budget filter */}
          <div>
            <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3">
              Budget
            </p>
            <div className="flex flex-wrap gap-2">
              {BUDGETS.map(b => (
                <button
                  key={b.label}
                  onClick={() => setSelectedBudgetMax(b.max)}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all
                    ${selectedBudgetMax === b.max
                      ? "bg-brand-50 border-green-300 text-green-800 font-semibold"
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-syne font-bold text-base hover:bg-brand-800 transition-colors mt-auto"
          >
            Find places →
          </button>
        </div>
      )}
    </div>
  )
}
