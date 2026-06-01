import { useState, useEffect } from "react"
import { PLACES as FALLBACK_PLACES } from "../data/places"

// Paste your Google Sheet CSV URL here after following the setup steps
// It looks like: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv&gid=0
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJElpDeIBaPWReKBF3i6Dys_XEvw6M9N5Tev1HaZtRNbCRwo3K7of-H7Tt56kC366SKcg0VGVDKCxv/pub?output=csv"

// Parse a single CSV row, handling commas inside quoted fields
function parseCSVRow(row) {
  const result = []
  let current = ""
  let insideQuotes = false
  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    if (char === '"') {
      insideQuotes = !insideQuotes
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

// Convert a raw CSV row (array of strings) into a place object
function rowToPlace(headers, values) {
  const obj = {}
  headers.forEach((h, i) => {
    obj[h.trim()] = (values[i] || "").trim()
  })

  // Parse pipe-separated arrays e.g. "Friends|Family|Couples"
  const toArray = (str) =>
    str ? str.split("|").map(s => s.trim()).filter(Boolean) : []

  return {
    id:          Number(obj.id),
    name:        obj.name,
    category:    obj.category?.toLowerCase(),
    lat:         parseFloat(obj.lat),
    lng:         parseFloat(obj.lng),
    budget:      obj.budget,
    budgetMax:   Number(obj.budgetMax),
    description: obj.description,
    bestFor:     toArray(obj.bestFor),
    activities:  toArray(obj.activities),
    bestTime:    obj.bestTime,
    facilities: {
      food:         obj.food === "TRUE" || obj.food === "true",
      seating:      obj.seating === "TRUE" || obj.seating === "true",
      photography:  obj.photography === "TRUE" || obj.photography === "true",
      parking:      obj.parking === "TRUE" || obj.parking === "true",
    },
  }
}

export function usePlaces() {
  const [places, setPlaces]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // If no sheet URL is set yet, use the hardcoded fallback data
    if (!SHEET_CSV_URL) {
      setPlaces(FALLBACK_PLACES)
      setLoading(false)
      return
    }

    async function fetchPlaces() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(SHEET_CSV_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const csv = await res.text()
        const rows = csv.trim().split("\n")
        const headers = parseCSVRow(rows[0])

        const parsed = rows
          .slice(1)                          // skip header row
          .filter(row => row.trim())         // skip empty rows
          .map(row => rowToPlace(headers, parseCSVRow(row)))
          .filter(p => p.name && !isNaN(p.lat) && !isNaN(p.lng)) // skip invalid rows

        if (parsed.length === 0) throw new Error("Sheet returned 0 valid places")

        setPlaces(parsed)
      } catch (err) {
        console.error("Failed to fetch places from sheet:", err)
        setError(err.message)
        setPlaces(FALLBACK_PLACES) // fall back to hardcoded data on error
      } finally {
        setLoading(false)
      }
    }

    fetchPlaces()
  }, [])

  return { places, loading, error }
}
