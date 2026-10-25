import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// The marker that walks an outline's trail, shared by the tall outline in the
// sidebar and the flat one under the demo on small screens. Each outline lays
// out its own stops and draws its own trail; this part only measures where the
// stops sit along it and moves the tile between them.

export type Stop = { x: number; y: number }

const same = (a: number[], b: number[]) => a.length === b.length && a.every((n, i) => Math.abs(n - b[i]) < 0.5)

export const sameStops = (a: Stop[], b: Stop[]) => same(a.flatMap((s) => [s.x, s.y]), b.flatMap((s) => [s.x, s.y]))

export const useWalker = (stops: Stop[], trailOf: (stops: Stop[]) => string, active: number) => {
  const road = useRef<SVGPathElement>(null)
  const walked = useRef<SVGPathElement>(null)
  const marker = useRef<SVGGElement>(null)
  const tile = useRef<SVGGElement>(null)
  const [marks, setMarks] = useState<number[]>([])
  const at = useRef(0)
  const speed = useRef(0)
  const goal = useRef(0)
  const motion = useRef(0)
  const d = trailOf(stops)

  // Lengths along the trail where each stop sits. Measured on the real path,
  // so the marker lands exactly on the dots no matter how the trail bends.
  useLayoutEffect(() => {
    const path = road.current
    if (!path || stops.length === 0) return setMarks((prev) => (prev.length ? [] : prev))
    const probe = path.cloneNode() as SVGPathElement
    path.parentNode?.appendChild(probe)
    const out = stops.map((_, i) => {
      if (i === 0) return 0
      probe.setAttribute('d', trailOf(stops.slice(0, i + 1)))
      return probe.getTotalLength()
    })
    probe.remove()
    setMarks((prev) => (same(prev, out) ? prev : out))
  }, [stops, trailOf])

  const blink = () => {
    const el = tile.current?.firstElementChild
    if (!el) return
    el.classList.remove('blink')
    void (el as SVGElement).getBoundingClientRect()
    el.classList.add('blink')
  }

  // The tile leans into the direction it travels and straightens when it stops.
  const place = (length: number, lean: number) => {
    const path = road.current
    if (!path || !marker.current) return
    const total = path.getTotalLength()
    const point = path.getPointAtLength(Math.min(length, total))
    marker.current.setAttribute('transform', `translate(${point.x} ${point.y})`)
    walked.current?.style.setProperty('stroke-dasharray', `${length} ${total + 1}`)
    tile.current?.setAttribute('transform', `rotate(${lean})`)
  }

  // A spring, not a timeline. While a guide types heading after heading the
  // goal keeps moving, and a spring simply bends toward the new goal from
  // wherever it is, at the speed it already has, instead of starting over.
  const glide = () => {
    if (motion.current) return
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const pull = 15
      const gap = goal.current - at.current
      speed.current += (pull * pull * gap - 2 * pull * speed.current) * dt
      at.current += speed.current * dt
      if (Math.abs(gap) < 0.3 && Math.abs(speed.current) < 4) {
        at.current = goal.current
        speed.current = 0
        motion.current = 0
        place(at.current, 0)
        blink()
        return
      }
      place(at.current, Math.max(-9, Math.min(9, speed.current * 0.05)))
      motion.current = requestAnimationFrame(tick)
    }
    motion.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (marks.length === 0) return
    goal.current = active < 0 ? 0 : marks[Math.min(active, marks.length - 1)]
    if (motion.current) return
    if (Math.abs(goal.current - at.current) < 0.5 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      at.current = goal.current
      return place(at.current, 0)
    }
    glide()
  }, [active, marks, d])

  useEffect(
    () => () => {
      cancelAnimationFrame(motion.current)
      motion.current = 0
    },
    [],
  )

  return { d, road, walked, marker, tile }
}
