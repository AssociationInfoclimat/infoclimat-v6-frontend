export enum UserStatus {
  EN_ATTENTE_DE_VALIDATION = 1,
  ADHERENT = 3,
  MODERATEUR_TEMPS_CALME = 10,
  MODERATEUR_PHOTOLIVE = 11,
  MODERATEUR_VIDEOLIVE = 12,
  MODERATEUR_METEOALERTE = 13,
  MODERATEUR_FORUMS = 14,
  GESTIONNAIRE_MAILS = 15,
  GESTIONNAIRE_RESEAUX = 16,
  GESTIONNAIRE_STATIC = 17,
  GESTIONNAIRE_CLIMATO = 18,
  GESTIONNAIRE_DONNEES = 19,
  PREVISIONNISTE_REGIONAL = 20,
  PREVISIONNISTE_NATIONAL = 21,
  GESTIONNAIRE_ACTUALITES = 23,
  RESPONSABLE_TECHNIQUE = 40,
  ADMINISTRATEUR = 50,
  MEMBRE_BUREAU = 60,
  BANNI = 99,
}

export type Me = {
  id: number
  pseudo: string
  statuses: UserStatus[]
  // params: UserParams; // see backend
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
