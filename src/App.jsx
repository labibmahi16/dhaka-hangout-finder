import { useState } from "react"
import HomeScreen from "./components/HomeScreen"
import ResultsScreen from "./components/ResultsScreen"
import DetailScreen from "./components/DetailScreen"
import { PLACES } from "./data/places"
import { filterByRadius } from "./utils/distance"

export default function App() {
  // screen: "home" | "results" | "detail"
  const [screen, setScreen] = useState("home")
  const [filteredPlaces, setFilteredPlaces] = useState([])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [activeFilters, setActiveFilters] = useState(null)

  function handleSearch({ userLocation, radiusKm, categories, budgetMax }) {
    // 1. Filter by radius using Haversine distance
    let results = filterByRadius(PLACES, userLocation.lat, userLocation.lng, radiusKm)

    // 2. Filter by selected categories (empty = all)
    if (categories.length > 0) {
      results = results.filter(p => categories.includes(p.category))
    }

    // 3. Filter by budget
    if (budgetMax !== Infinity) {
      results = results.filter(p => p.budgetMax <= budgetMax)
    }

    setFilteredPlaces(results)
    setActiveFilters({ userLocation, radiusKm, categories, budgetMax })
    setScreen("results")
  }

  function handleSelectPlace(place) {
    setSelectedPlace(place)
    setScreen("detail")
  }

  return (
    <div className="app-shell">
      {/* Top nav bar */}
      <nav className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white">
        <button
          onClick={() => setScreen("home")}
          className="font-syne font-extrabold text-lg tracking-tight text-gray-900"
        >
          Dhaka<span className="text-brand-600">Hangout</span>
        </button>
        <span className="text-xs text-gray-400">Find your next outing</span>
      </nav>

      {/* Screens */}
      {screen === "home" && (
        <HomeScreen onSearch={handleSearch} />
      )}

      {screen === "results" && (
        <ResultsScreen
          places={filteredPlaces}
          filters={activeFilters}
          onSelectPlace={handleSelectPlace}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "detail" && selectedPlace && (
        <DetailScreen
          place={selectedPlace}
          onBack={() => setScreen("results")}
        />
      )}
    </div>
  )
}
