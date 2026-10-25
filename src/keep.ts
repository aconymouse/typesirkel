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
