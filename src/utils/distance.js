// Haversine formula — calculates distance between two lat/lng points in km
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}

// Filter places by radius and return them sorted by distance
export function filterByRadius(places, userLat, userLng, radiusKm) {
  return places
    .map(place => ({
      ...place,
      distance: getDistanceKm(userLat, userLng, place.lat, place.lng),
    }))
    .filter(place => place.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance)
}
