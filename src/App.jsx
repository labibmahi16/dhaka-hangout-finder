import { useState } from "react"
import HomeScreen    from "./components/HomeScreen"
import ResultsScreen from "./components/ResultsScreen"
import MapScreen     from "./components/MapScreen"
import DetailScreen  from "./components/DetailScreen"
import { usePlaces } from "./hooks/usePlaces"
import { filterByRadius } from "./utils/distance"

export default function App() {
  const { places, loading } = usePlaces()
  const [screen, setScreen]               = useState("home")
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [activeFilters, setActiveFilters] = useState(null)

  function handleSearch({ userLocation, radiusKm, categories, budgetMax }) {
    let results = filterByRadius(places, userLocation.lat, userLocation.lng, radiusKm)
    if (categories.length > 0) results = results.filter(p => categories.includes(p.category))
    if (budgetMax !== Infinity)  results = results.filter(p => p.budgetMax <= budgetMax)
    setFilteredPlaces(results)
    setActiveFilters({ userLocation, radiusKm, categories, budgetMax })
    setScreen("results")
  }

  function handleSelectPlace(place) { setSelectedPlace(place); setScreen("detail") }

  return (
    <div className="app-shell">
      {/* Nav */}
      <nav className="app-nav" style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
            Dhaka<span style={{ color: "#4a9e14" }}>Hangout</span>
          </span>
        </button>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          {loading ? "Loading…" : `${places.length} places`}
        </span>
      </nav>

      {screen === "home"    && <HomeScreen onSearch={handleSearch} />}
      {screen === "results" && <ResultsScreen places={filteredPlaces} filters={activeFilters} onSelectPlace={handleSelectPlace} onBack={() => setScreen("home")} onShowMap={() => setScreen("map")} />}
      {screen === "map"     && <MapScreen places={filteredPlaces} userLocation={activeFilters?.userLocation} onSelectPlace={handleSelectPlace} onBack={() => setScreen("results")} />}
      {screen === "detail"  && selectedPlace && <DetailScreen place={selectedPlace} onBack={() => setScreen("results")} />}
    </div>
  )
}
