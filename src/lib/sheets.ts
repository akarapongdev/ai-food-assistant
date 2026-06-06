import Papa from 'papaparse'
import { LOCATIONS, sheetCsvUrl } from '../config'
import type { Restaurant } from '../types'

/** Raw CSV row: every gviz column comes back as a string keyed by its header. */
type RawRow = Record<string, string>

function toNumber(value: string | undefined): number {
  if (!value) return 0
  const n = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function toBool(value: string | undefined): boolean {
  return String(value).trim().toUpperCase() === 'TRUE'
}

function mapRow(row: RawRow): Restaurant {
  return {
    title: row.title?.trim() ?? '',
    subTitle: row.subTitle?.trim() ?? '',
    categoryName: row.categoryName?.trim() ?? '',
    price: row.price?.trim() ?? '',
    totalScore: toNumber(row.totalScore),
    reviewsCount: toNumber(row.reviewsCount),
    neighborhood: row.neighborhood?.trim() ?? '',
    address: row.address?.trim() ?? '',
    website: row.website?.trim() ?? '',
    url: row.url?.trim() ?? '',
    permanentlyClosed: toBool(row.permanentlyClosed),
    temporarilyClosed: toBool(row.temporarilyClosed),
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
