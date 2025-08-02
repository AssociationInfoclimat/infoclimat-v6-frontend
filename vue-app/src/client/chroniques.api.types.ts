export type GetChroniquesBqsResponse = {
  responseData: {
    id: number
    title: string
    published_at: string // DD/MM
    summary: string
    url: string // relative URL
  }[]
}

export type GetBimResponse = {
  responseData: {
    id: number
    title: string
    published_at: string // DD/MM
    summary: string
    url: string // relative URL
  }[]
}

export type GetBs2sResponse = {
  responseData: {
    id: number
    link: string // relative URL
    date_range: string // "Du DD/MM au DD/MM"
    types: string[] // lowercase types like "pluie", "neige", ...
  }[]
}

export type GetMobileNewsResponse = {
  responseData: {
    id: number
    type: 'bqs' | 'bim'
    title: string
    published_at: string // DD/MM
    summary: string
    url: string // relative URL
    thumbnail?: string
  }[]
}
