export interface SubScores {
  ratingReviewQuality: number
  groupSuitability: number
  priceSuitability: number
  travelConvenience: number
  dataCompleteness: number
  uniquenessExperience: number
}

export interface Restaurant {
  title: string
  subTitle: string
  categoryName: string
  price: string
  totalScore: number
  reviewsCount: number
  neighborhood: string
  address: string
  website: string
  url: string
  permanentlyClosed: boolean
  temporarilyClosed: boolean
  systemScore: number
  summary: string
  scores: SubScores | null
}
