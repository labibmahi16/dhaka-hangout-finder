// Central style config for each category
// bg = light background, text = dark text, icon = emoji icon

export const CATEGORY_STYLES = {
  park: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    dot: "bg-green-500",
    icon: "🌿",
    label: "Park",
  },
  cafe: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: "☕",
    label: "Café",
  },
  restaurant: {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    dot: "bg-red-400",
    icon: "🍽️",
    label: "Restaurant",
  },
  mall: {
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    dot: "bg-purple-500",
    icon: "🛍️",
    label: "Mall",
  },
  museum: {
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    dot: "bg-blue-400",
    icon: "🏛️",
    label: "Museum",
  },
  recreation: {
    bg: "bg-pink-50",
    text: "text-pink-800",
    border: "border-pink-200",
    dot: "bg-pink-400",
    icon: "🎡",
    label: "Recreation",
  },
}

export function getCategoryStyle(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.park
}
