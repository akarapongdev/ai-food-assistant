import type { Restaurant } from '../types'

export interface Criterion {
  key: string
  label: string
  emoji: string
  score: (r: Restaurant) => number
}

function clamp(n: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, n))
}

/** Parses a Google price string to a midpoint THB value, or null when unknown. */
export function priceMidpoint(price: string): number | null {
  if (!price) return null
  const cleaned = price.replace(/,/g, '')
  const nums = (cleaned.match(/\d+/g) ?? []).map(Number)
  if (nums.length > 0) {
    return nums.reduce((a, b) => a + b, 0) / nums.length
  }
  // Fallback for "$"/"$$"/"$$$"/"$$$$" style.
  const dollars = (cleaned.match(/\$/g) ?? []).length
  if (dollars > 0) return [150, 350, 700, 1200][Math.min(dollars, 4) - 1]
  return null
}

function cheapness(mid: number | null): number {
  if (mid === null) return 0.5
  return clamp(1 - mid / 800)
}

function upscale(mid: number | null): number {
  if (mid === null) return 0.5
  return clamp(mid / 1000)
}

function ratingNorm(r: Restaurant): number {
  return clamp(r.totalScore / 5)
}

function reviewsNorm(r: Restaurant): number {
  return clamp(Math.log10(r.reviewsCount + 1) / 3.5)
}

/** 1 when any keyword appears in the restaurant's category text, else 0. */
function matchesAny(r: Restaurant, keywords: string[]): number {
  const hay = `${r.categoryName} ${r.categories.join(' ')}`.toLowerCase()
  return keywords.some((k) => hay.includes(k.toLowerCase())) ? 1 : 0
}

const QUICK = [
  'ก๋วยเตี๋ยว', 'ก๋วยจั๊บ', 'ข้าวมันไก่', 'ข้าว', 'ส้มตำ', 'โจ๊ก',
  'คาเฟ่', 'cafe', 'coffee', 'กาแฟ', 'fast food', 'ฟาสต์ฟู้ด',
  'breakfast', 'เบเกอรี่', 'bakery', 'แซนด์วิช', 'sandwich', 'noodle',
]

const BUSINESS = [
  'ญี่ปุ่น', 'japanese', 'อิตาเลียน', 'italian', 'สเต๊ก', 'สเต็ก', 'steak',
  'ซูชิ', 'sushi', 'fine', 'โรงแรม', 'hotel', 'ฝรั่งเศส', 'french',
  'ยุโรป', 'european', 'ไวน์', 'wine', 'ฟิวชั่น', 'fusion',
]

const GROUP = [
  'บุฟเฟต์', 'buffet', 'ชาบู', 'shabu', 'หมูกระทะ', 'ปิ้งย่าง', 'เนื้อย่าง',
  'เกาหลี', 'korean', 'จีน', 'chinese', 'ติ่มซำ', 'dim sum', 'สุกี้', 'suki',
  'ซีฟู้ด', 'seafood', 'bbq', 'บาร์บีคิว', 'จิ้มจุ่ม', 'hot pot',
]

export const CRITERIA: Criterion[] = [
  {
    key: 'economical',
    label: 'ประหยัด',
    emoji: '💸',
    score: (r) => {
      const mid = priceMidpoint(r.price)
      const bonus = r.scores ? 0.15 * (r.scores.priceSuitability / 25) : 0
      return 0.6 * cheapness(mid) + 0.3 * ratingNorm(r) + 0.1 * reviewsNorm(r) + bonus
    },
  },
  {
    key: 'quickMeal',
    label: 'มื้อด่วน',
    emoji: '⚡',
    score: (r) => {
      const mid = priceMidpoint(r.price)
      return (
        0.5 * matchesAny(r, QUICK) +
        0.2 * cheapness(mid) +
        0.2 * ratingNorm(r) +
        0.1 * reviewsNorm(r)
      )
    },
  },
  {
    key: 'businessMeeting',
    label: 'ประชุมธุรกิจ',
    emoji: '💼',
    score: (r) => {
      const mid = priceMidpoint(r.price)
      return (
        0.4 * matchesAny(r, BUSINESS) +
        0.35 * ratingNorm(r) +
        0.15 * upscale(mid) +
        0.1 * reviewsNorm(r)
      )
    },
  },
  {
    key: 'largeGroup',
    label: 'กลุ่ม 8–12 คน',
    emoji: '👥',
    score: (r) => {
      const bonus = r.scores ? 0.1 * (r.scores.groupSuitability / 25) : 0
      return (
        0.45 * matchesAny(r, GROUP) +
        0.25 * ratingNorm(r) +
        0.2 * reviewsNorm(r) +
        bonus
      )
    },
  },
]

/** Top-N restaurants for a criterion: rated rows, highest score first. */
export function topByCriterion(
  data: Restaurant[],
  criterion: Criterion,
  n = 3,
): Restaurant[] {
  return data
    .filter((r) => r.totalScore > 0)
    .map((r) => ({ r, s: criterion.score(r) }))
    .sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s
      if (b.r.reviewsCount !== a.r.reviewsCount) return b.r.reviewsCount - a.r.reviewsCount
      return b.r.totalScore - a.r.totalScore
    })
    .slice(0, n)
    .map((x) => x.r)
}
