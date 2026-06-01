import { getCategoryStyle } from "../utils/categoryStyles"

export default function ResultsScreen({ places, filters, onSelectPlace, onBack }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-syne font-bold text-lg text-gray-900">Nearby Places</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {places.length} place{places.length !== 1 ? "s" : ""} within {filters.radiusKm} km
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Empty state */}
      {places.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 px-5 py-16 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-syne font-bold text-lg text-gray-800 mb-2">No places found</h3>
          <p className="text-sm text-gray-500 mb-6">
            Try increasing the radius or removing some filters.
          </p>
          <button
            onClick={onBack}
            className="bg-brand-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            Change filters
          </button>
        </div>
      )}

      {/* List */}
      <div className="flex flex-col gap-2.5 px-4 py-4">
        {places.map(place => {
          const style = getCategoryStyle(place.category)
          return (
            <button
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3.5 text-left hover:border-gray-300 hover:shadow-sm transition-all w-full"
            >
              {/* Category icon */}
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${style.bg}`}>
                {style.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-syne font-bold text-gray-900 text-sm truncate">{place.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">📍 {place.distance.toFixed(1)} km</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
              </div>

              {/* Budget + chevron */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {place.budget}
                </span>
                <span className="text-gray-300 text-sm">›</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
