import Papa from 'papaparse'
import { LOCATIONS, sheetCsvUrl } from '../config'
import type { OpeningHour, Restaurant, SubScores } from '../types'

/** Raw CSV row: every gviz column comes back as a string keyed by its header. */
type RawRow = Record<string, string>

function toNumber(value: string | undefined): number {
  if (!value) return 0
  const n = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/** Parses a JSON string-array cell (e.g. `categories`); returns [] when absent/invalid. */
function safeParseStringArray(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) return []
  try {
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Parses the `openingHours` JSON cell into {day, hours} entries; [] when absent/invalid. */
function safeParseOpeningHours(raw: string | undefined): OpeningHour[] {
  if (!raw || !raw.trim()) return []
  try {
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr
      .filter((x) => x && typeof x === 'object')
      .map((x) => ({ day: String(x.day ?? ''), hours: String(x.hours ?? '') }))
      .filter((x) => x.day || x.hours)
  } catch {
    return []
  }
}

/** Parses the `scores` JSON cell; returns null when absent or malformed. */
function safeParseScores(raw: string | undefined): SubScores | null {
  if (!raw || !raw.trim()) return null
  try {
    const obj = JSON.parse(raw) as Partial<SubScores>
    return {
      ratingReviewQuality: Number(obj.ratingReviewQuality) || 0,
      groupSuitability: Number(obj.groupSuitability) || 0,
      priceSuitability: Number(obj.priceSuitability) || 0,
      travelConvenience: Number(obj.travelConvenience) || 0,
      dataCompleteness: Number(obj.dataCompleteness) || 0,
      uniquenessExperience: Number(obj.uniquenessExperience) || 0,
    }
  } catch {
    return null
  }
}

function mapRow(row: RawRow): Restaurant {
  return {
    title: row.title?.trim() ?? '',
    subTitle: row.subTitle?.trim() ?? '',
    price: row.price?.trim() ?? '',
    categoryName: row.categoryName?.trim() ?? '',
    neighborhood: row.neighborhood?.trim() ?? '',
    totalScore: toNumber(row.totalScore),
    reviewsCount: toNumber(row.reviewsCount),
    address: row.address?.trim() ?? '',
    openingHours: safeParseOpeningHours(row.openingHours),
    categories: safeParseStringArray(row.categories),
    rank: toNumber(row.rank),
    // Prefer `website`; fall back to legacy `url` so older tabs keep a link during migration.
    website: row.website?.trim() || row.url?.trim() || '',
    placeId: row.placeId?.trim() ?? '',
    phoneUnformatted: row.phoneUnformatted?.trim() ?? '',
    scores: safeParseScores(row.scores),
    summary: row.summary?.trim() ?? '',
    systemScore: toNumber(row.systemScore),
  }
}

/** Ranking: highest rating first, breaking ties by review count. */
function byRanking(a: Restaurant, b: Restaurant): number {
  if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
  return b.reviewsCount - a.reviewsCount
}

/**
 * Fetches one location tab from the public Google Sheet, parses the CSV,
 * and returns restaurants ranked by rating.
 */
export async function fetchLocation(tabKey: string): Promise<Restaurant[]> {
  const location = LOCATIONS.find((l) => l.key === tabKey)
  if (!location) {
    throw new Error(`Unknown location "${tabKey}".`)
  }

  const res = await fetch(sheetCsvUrl(location.gid))
  if (!res.ok) {
    throw new Error(
      `Could not load the sheet (HTTP ${res.status}). ` +
        `Make sure the spreadsheet is shared as "Anyone with the link → Viewer".`,
    )
  }

  const csv = await res.text()
  const parsed = Papa.parse<RawRow>(csv, {
    header: true,
    skipEmptyLines: true,
  })

  return parsed.data
    .map(mapRow)
    .filter((r) => r.title.length > 0)
    .sort(byRanking)
}
