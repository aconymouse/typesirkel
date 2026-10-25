// Near the end of a page the last headings can never reach the top edge, so the
// point we read from slides down the window as the reader runs out of scroll.
export const slide = (box: HTMLElement) => {
  const max = box.scrollHeight - box.clientHeight
  const span = Math.min(box.clientHeight, max)
  if (span <= 0) return 0
  const reached = Math.max(0, span - (max - box.scrollTop)) / span
  return reached * box.clientHeight * 0.9
}
