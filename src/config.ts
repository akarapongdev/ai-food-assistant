export const SHEET_ID = '1oYMTuVYpLBUisQBsIjB65enWYKWEfkNwaxU5DOhTzkI'

/** n8n workflow webhook triggered from the header action button. */
export const N8N_WEBHOOK_URL =
  'https://akrp24.app.n8n.cloud/webhook/ac23de00-b87d-482a-8cf5-b43d1700761f'

export interface LocationTab {
  /** Exact Google Sheet tab name used by the gviz endpoint. */
  key: string
  /** Thai label shown in the header tab bar. */
  label: string
  /** Exact Google Sheet tab gid used by the gviz endpoint. */
  gid: string
}

export const LOCATIONS: LocationTab[] = [
  { key: 'siam', label: 'สยาม', gid: '187216561' },
  { key: 'ari', label: 'อารีย์', gid: '752109424' },
  { key: 'thonglor', label: 'ทองหล่อ', gid: '920995911' },
  { key: 'asoke', label: 'อโศก', gid: '1791019134' },
  { key: 'phromphong', label: 'พร้อมพงษ์', gid: '585935467' },
]

/** Builds the public gviz CSV export URL for a given sheet tab gid. */
export function sheetCsvUrl(gid: string): string {
  const params = new URLSearchParams({ tqx: 'out:csv', gid })
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params.toString()}`
}
