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

// GitHub's mark, from Lobe Icons (MIT).
const github = 'M12 0c6.63 0 12 5.276 12 11.79-.001 5.067-3.29 9.567-8.175 11.187-.6.118-.825-.25-.825-.56 0-.398.015-1.665.015-3.242 0-1.105-.375-1.813-.81-2.181 2.67-.295 5.475-1.297 5.475-5.822 0-1.297-.465-2.344-1.23-3.169.12-.295.54-1.503-.12-3.125 0 0-1.005-.324-3.3 1.209a11.32 11.32 0 00-3-.398c-1.02 0-2.04.133-3 .398-2.295-1.518-3.3-1.209-3.3-1.209-.66 1.622-.24 2.83-.12 3.125-.765.825-1.23 1.887-1.23 3.169 0 4.51 2.79 5.527 5.46 5.822-.345.294-.66.81-.765 1.577-.69.31-2.415.81-3.495-.973-.225-.354-.9-1.223-1.845-1.209-1.005.015-.405.56.015.781.51.28 1.095 1.327 1.23 1.666.24.663 1.02 1.93 4.035 1.385 0 .988.015 1.916.015 2.196 0 .31-.225.664-.825.56C3.303 21.374-.003 16.867 0 11.791 0 5.276 5.37 0 12 0z'

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
      <svg className="star-github" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <path d={github} />
      </svg>
      <svg className="star-mark" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 1.5l1.95 4.1 4.5.55-3.3 3.1.85 4.45L8 11.55 4 13.7l.85-4.45-3.3-3.1 4.5-.55z" />
      </svg>
      <span>{label}</span>
      {count !== null ? <b>{short(count)}</b> : null}
    </a>
  )
}
