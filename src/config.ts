export const SHEET_ID = '1oYMTuVYpLBUisQBsIjB65enWYKWEfkNwaxU5DOhTzkI'

/** n8n workflow webhook triggered from the header action button. */
export const N8N_WEBHOOK_URL =
  'https://akrp24.app.n8n.cloud/webhook/90d58ae7-e716-416e-aa65-68094b48b016'

export interface LocationTab {
  /** Exact Google Sheet tab name used by the gviz endpoint. */
  key: string
  /** Thai label shown in the header tab bar. */
  label: string
  /** Exact Google Sheet tab gid used by the gviz endpoint. */
  gid: string
  /** Raw Google Sheet tab gid used by the gviz endpoint. */
  raw_gid: string
  /** Raw Google Sheet tab gid used by the gviz endpoint. */
  task_key: string
}

export const LOCATIONS: LocationTab[] = [
  { key: 'siam', label: 'สยาม', raw_gid: '0', gid: '187216561', task_key: '7EtxlU9RugYBl9qWw' },
  { key: 'ari', label: 'อารีย์', raw_gid: '906333227', gid: '752109424', task_key: 'TZEK4twvIQur6b9p4' },
  { key: 'thonglor', label: 'ทองหล่อ', raw_gid: '1741629981', gid: '920995911', task_key: 'rJlTvwDOX5nkXoGPs' },
  { key: 'asoke', label: 'อโศก', raw_gid: '2014870274', gid: '1791019134', task_key: 'gX7DcXhijJxk9gtJc' },
  { key: 'phromphong', label: 'พร้อมพงษ์', raw_gid: '708806260', gid: '585935467', task_key: 'SmEjpoVFLjeCdJJtR' },
]

/** Builds the public gviz CSV export URL for a given sheet tab gid. */
export function sheetCsvUrl(gid: string): string {
  const params = new URLSearchParams({ tqx: 'out:csv', gid })
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?${params.toString()}`
}
