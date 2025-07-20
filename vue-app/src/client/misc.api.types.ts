export type GetLexiqueWordsResponse = {
  responseData: {
    id: number
    slug: string
    mot: string
  }[]
}

// https://www.infoclimat.fr/photolive/vignettes/infos.json
export type GetPhotoliveVignettesResponse = {
  responseData: {
    /*
      "y1y": "ProvenceCCA",
      "v1v": "Agr&eacute;able   ",
      "l1l": "Arles (13)",
      "photourl1x": "/photolive-photos-meteo-330323-agr-atilde-copyable.html",
      "photoid1x": "330323",
    */
    y1y: string
    v1v: string
    l1l: string
    photourl1x: string
    photoid1x: string

    y2y: string
    v2v: string
    l2l: string
    photourl2x: string
    photoid2x: string

    y3y: string
    v3v: string
    l3l: string
    photourl3x: string
    photoid3x: string

    // ... goes to 20 photos like this..

    // TODO: Clean this endpoint and type it
  }
}

export type GetPhotoliveLatestResponse = {
  responseData: {
    id: number
    is_big: boolean
    photo_url: string
    url: string
    dh_prise: string
    titre: string
  }[]
}
