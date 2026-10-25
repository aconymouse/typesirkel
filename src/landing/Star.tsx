import { useEffect, useState } from 'react'

const repo = 'aconymouse/typesirkel'
const kept = 'typesirkel:stars'

// GitHub's public API allows a handful of anonymous calls per hour, so the count
// is fetched once per visit and the button still works if the call fails.
const readCount = async () => {
  try {
    const cached = sessionStorage.getItem(kept)
    if (cached) return Number(cached)
  } catch {}
  const response = await fetch(`https://api.github.com/repos/${repo}`, { headers: { accept: 'application/vnd.github+json' } })
  if (!response.ok) return null
  const count = ((await response.json()) as { stargazers_count?: number }).stargazers_count ?? null
  try {
    if (count !== null) sessionStorage.setItem(kept, String(count))
  } catch {}
  return count
}

const short = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n))

export function Star({ className = '', label = 'Star' }: { className?: string; label?: string }) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    void readCount()
      .then(setCount)
      .catch(() => {})
  }, [])

  return (
    <a href={`https://github.com/${repo}`} className={`star ${className}`.trim()} aria-label={count === null ? 'Star typeSirkel on GitHub' : `Star typeSirkel on GitHub, ${count} stars`}>
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 1.5l1.95 4.1 4.5.55-3.3 3.1.85 4.45L8 11.55 4 13.7l.85-4.45-3.3-3.1 4.5-.55z" />
      </svg>
      <span>{label}</span>
      {count !== null ? <b>{short(count)}</b> : null}
    </a>
  )
}
