export interface WikiPage {
  id: string
  lang?: string
  summary?: string
  tags: string[]
  timestamp: number
  title: string
  url: string
}

export interface WikiPageFilter {
  endDate?: number
  searchQuery?: string
  startDate?: number
  tags?: string[]
}
