export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null
  }
  return null
}

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

export const setCookie = ({
  name,
  value,
  expiresAt,
  path,
}: {
  name: string
  value: string
  expiresAt: Date
  path: string
}) => {
  document.cookie = `${name}=${value}; path=${path}; expires=${expiresAt}`
}
