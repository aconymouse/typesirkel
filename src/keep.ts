// Small preferences that should survive a reload. Never anything precious:
// if storage is blocked we simply start with the defaults.
export const recall = <T extends string>(key: string, fallback: T, allowed: readonly T[]): T => {
  try {
    const value = localStorage.getItem(`typesirkel:${key}`) as T | null
    return value && allowed.includes(value) ? value : fallback
  } catch {
    return fallback
  }
}

export const remember = (key: string, value: string) => {
  try {
    localStorage.setItem(`typesirkel:${key}`, value)
  } catch {}
}

// For settings with a few fields. Whatever comes back is merged over the
// fallback, so a setting added later never arrives as undefined.
export const recallShape = <T extends object>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(`typesirkel:${key}`)
    return raw ? { ...fallback, ...(JSON.parse(raw) as Partial<T>) } : fallback
  } catch {
    return fallback
  }
}

export const rememberShape = (key: string, value: object) => remember(key, JSON.stringify(value))
