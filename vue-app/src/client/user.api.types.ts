export type Me = {
  id: number
  pseudo: string
}

export type GetUserApiMeResponse = {
  responseData: Me
}

//
// See backend types:
//
export type VignetteStation = {
  type: 'station'
  content_as_html: string // TODO: Build this as a json from the station. For now its the HTML of the station weather information.
}

export type VignettePhoto = {
  type: 'photo'
  time_key: number
  photo_index: number
  background_position: [number, number] // [x, y]
}

export type VignetteVigilance = {
  type: 'vigilance'
  content_as_html: string // TODO: Build this as a json from the vigilance. For now its the HTML of the vigilance.
}

export type VignetteCrue = {
  type: 'crue'
  content_as_html: string // TODO: Build this as a json from the crue. For now its the HTML of the crue.
}

export type GetUserApiUserVignettesResponse = {
  responseData: {
    vignettes: (VignetteStation | VignettePhoto | VignetteVigilance | VignetteCrue)[]
    photos_sprite_url: string
  }
}
