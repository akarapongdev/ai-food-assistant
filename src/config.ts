export const SHEET_ID = '1oYMTuVYpLBUisQBsIjB65enWYKWEfkNwaxU5DOhTzkI'

export interface LocationTab {
  /** Exact Google Sheet tab name used by the gviz endpoint. */
  key: string
  /** Thai label shown in the header tab bar. */
  label: string
}

export const LOCATIONS: LocationTab[] = [
  { key: 'siam', label: 'สยาม' },
  { key: 'ari', label: 'อารีย์' },
  { key: 'thonglor', label: 'ทองหล่อ' },
  { key: 'asoke', label: 'อโศก' },
  { key: 'phromphong', label: 'พร้อมพงษ์' },
]

/** Builds the public gviz CSV export URL for a given sheet tab. */
export function sheetCsvUrl(tabKey: string): string {
  const params = new URLSearchParams({ tqx: 'out:csv', sheet: tabKey })
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params.toString()}`
}
