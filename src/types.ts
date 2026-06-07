export interface SubScores {
  ratingReviewQuality: number
  groupSuitability: number
  priceSuitability: number
  travelConvenience: number
  dataCompleteness: number
  uniquenessExperience: number
}

export interface OpeningHour {
  day: string
  hours: string
}

export interface Restaurant {
  title: string
  subTitle: string
  price: string
  categoryName: string
  neighborhood: string
  totalScore: number
  reviewsCount: number
  address: string
  openingHours: OpeningHour[]
  categories: string[]
  rank: number
  website: string
  placeId: string
  phoneUnformatted: string
  scores: SubScores | null
  summary: string
  systemScore: number
}
