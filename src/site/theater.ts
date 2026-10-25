import { type RefObject, useEffect } from 'react'
import type { Lang } from '../lang'

// The words are all in the page from the start, for readers without scripts
// and for search engines. With scripts, they come on like lyrics on a screen:
// each line writes itself out as it reaches the reading line, the one you are
// on stays bright, and the ones you have passed settle back.
//
// `beats` are the lines that follow the reading line. `quiet` blocks only get
// their words split, so CSS can write them out at a moment of its own choosing,
// like an FAQ answer the instant it is opened.

const split = (block: HTMLElement, words: Intl.Segmenter) => {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
  const texts: Text[] = []
  while (walker.nextNode()) texts.push(walker.currentNode as Text)
  let count = 0
  for (const text of texts) {
    const pieces = document.createDocumentFragment()
    for (const { segment } of words.segment(text.data)) {
      const span = document.createElement('span')
      span.className = 'w'
      span.style.setProperty('--i', String(Math.min(count++, 70)))
      span.textContent = segment
      pieces.append(span)
    }
    text.replaceWith(pieces)
  }
}

type Cast = (root: HTMLElement) => { beats: HTMLElement[]; quiet?: HTMLElement[] }

export const useTheater = (stage: RefObject<HTMLElement | null>, lang: Lang, cast: Cast) => {
  useEffect(() => {
    const root = stage.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const { beats, quiet = [] } = cast(root)

    if (!root.classList.contains('theater')) {
      const words = new Intl.Segmenter(lang, { granularity: 'word' })
      for (const beat of beats) {
        beat.classList.add('beat')
        split(beat, words)
      }
      for (const block of quiet) split(block, words)
      root.classList.add('theater')
    }

    let frame = 0
    const follow = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.66
        const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        const seen = beats.filter((beat) => beat.getClientRects().length > 0)
        let now = -1
        seen.forEach((beat, i) => {
          if (beat.getBoundingClientRect().top < line) now = i
        })
        if (bottom) now = seen.length - 1
        seen.forEach((beat, i) => {
          if (i <= now) beat.classList.add('is-shown')
          beat.classList.toggle('is-now', i === now)
        })
      })
    }
    const opening = window.setTimeout(follow, 250)
    window.addEventListener('scroll', follow, { passive: true })
    window.addEventListener('resize', follow)
    root.addEventListener('toggle', follow, true)
    return () => {
      window.clearTimeout(opening)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', follow)
      window.removeEventListener('resize', follow)
      root.removeEventListener('toggle', follow, true)
    }
  }, [stage, lang, cast])
}
