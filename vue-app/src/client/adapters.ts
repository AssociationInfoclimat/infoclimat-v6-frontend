import type { ForecastWeatherType, PostPreviApiForecastResponse } from './previ.api.types'

const unescape = (str: string) => {
  return str
    .replace(/&egrave;/g, 'è')
    .replace(/&eacute;/g, 'é')
    .replace(/&agrave;/g, 'à')
    .replace(/&acirc;/g, 'â')
    .replace(/&auml;/g, 'ä')
    .replace(/&igrave;/g, 'ì')
    .replace(/&iacute;/g, 'í')
    .replace(/&icirc;/g, 'î')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

const forecastWeahtertypeToImgUrl = (weathertype: ForecastWeatherType) => {
  return `//static.infoclimat.net/observations/observationsV2/jour/${weathertype}.png`
}

const windDirectionToImgUrl = (windDirection: string) => {
  return `//static.infoclimat.net/images/pictos_vent/${windDirection}.png`
}

// Build the weather forecast from `/api/previ/{<ApiTicketData>}/get?u={<ApiTicketDataEntropy>}` response:
export const adaptWeatherForecast = (forecast: PostPreviApiForecastResponse['responseData']) => {
  const { '0': day0, '1': day1, '2': day2, '3': day3 } = forecast
  const comingDays = [day0, day1, day2, day3]
  return {
    name: unescape(`${forecast.name} ${forecast.dy}`),
    updatedTodayAt: forecast.updated,
    url: `/previsions-meteo/details/${forecast.vkey}/${forecast.seo}.html`,
    days: comingDays.map((day) => ({
      icon: forecastWeahtertypeToImgUrl(day.p.k),
      day: day.day,
      description: unescape(day.p.v),
      temperature: {
        min: day.tmin,
        max: day.tmax,
      },
      rain: day.rr,
      snow: day.snow,
      pressure: day.press,
      wind: {
        direction: day.dir,
        directionIcon: windDirectionToImgUrl(day.dir),
        directionLetter: day.vdir,
        speed: day.raf,
      },
    })),
    graph: `data:image/${forecast.f64};base64,${forecast.b64}`,
  }
}

export type AdaptedWeatherForecast = ReturnType<typeof adaptWeatherForecast>
